import { useMemo, useState } from 'react'
import { flattenTokens, componentTokens, resolveAlias } from '../tokens'
import { CopyButton } from '../components/CopyButton'

interface Props {
  search: string
  darkMode: boolean
}

const COMPONENTS = ['button', 'input', 'card', 'modal', 'icon', 'avatar', 'badge']

export function ComponentsTab({ search, darkMode }: Props) {
  const [activeComponent, setActiveComponent] = useState('button')

  const navItemBase = `block w-full text-left px-3 py-1.5 rounded-md text-sm font-body transition-colors`

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const componentData = useMemo(() => componentTokens as any, [])

  const tokens = useMemo(() => {
    const obj = componentData[activeComponent] ?? {}
    return flattenTokens(obj, activeComponent)
  }, [componentData, activeComponent])

  const filtered = useMemo(() => {
    if (!search) return tokens
    const q = search.toLowerCase()
    return tokens.filter(t => t.name.toLowerCase().includes(q) || t.value.toLowerCase().includes(q))
  }, [tokens, search])

  return (
    <div className="flex gap-8">
      {/* Sidebar */}
      <aside className="shrink-0 w-48 sticky top-20 self-start">
        <p className={`text-xs font-mono uppercase tracking-widest mb-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          Components
        </p>
        <nav className="flex flex-col gap-0.5">
          {COMPONENTS.map(comp => (
            <button
              key={comp}
              onClick={() => setActiveComponent(comp)}
              className={`${navItemBase} capitalize ${
                activeComponent === comp
                  ? darkMode
                    ? 'bg-gray-700 text-white font-medium'
                    : 'bg-gray-100 text-gray-900 font-medium'
                  : darkMode
                  ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              {comp}
            </button>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="mb-6">
          <h2 className="font-display font-bold text-xl capitalize">{activeComponent}</h2>
          <p className={`text-sm font-body mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            {filtered.length} tokens
          </p>
        </div>

        {/* Live Preview */}
        <div className={`rounded-xl border p-6 mb-6 ${darkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'}`}>
          <p className={`text-xs font-mono uppercase tracking-widest mb-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Live Preview
          </p>
          <ComponentPreview component={activeComponent} tokens={componentData[activeComponent] ?? {}} darkMode={darkMode} />
        </div>

        {/* Token table */}
        <div className={`rounded-xl border overflow-hidden ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <table className="w-full text-sm">
            <thead>
              <tr className={`text-xs font-mono uppercase tracking-wider ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-50 text-gray-400'}`}>
                <th className="text-left px-4 py-3">Token</th>
                <th className="text-left px-4 py-3">Alias</th>
                <th className="text-left px-4 py-3">Resolved</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(token => (
                <tr key={token.name} className={`group border-t ${darkMode ? 'border-gray-800 hover:bg-gray-800/40' : 'border-gray-100 hover:bg-gray-50'}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className={`font-mono text-xs ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                        {token.name}
                      </span>
                      <CopyButton text={token.name} darkMode={darkMode} />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-mono text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      {token.value}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-mono text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {token.resolved !== token.value ? formatResolved(token.resolved) : token.resolved}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function formatResolved(val: string): string {
  const num = parseFloat(val)
  if (!isNaN(num)) return `${num}px`
  return val
}

function ComponentPreview({
  component,
  tokens,
  darkMode,
}: {
  component: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tokens: any
  darkMode: boolean
}) {
  function resolveNum(alias: string): number {
    const val = resolveAlias(alias)
    return parseFloat(val) || 0
  }

  const previewBg = darkMode ? '#1f2937' : '#f9fafb'

  if (component === 'button') {
    const px = resolveNum(tokens['padding-x']?.md?.['$value'] ?? '16')
    const py = resolveNum(tokens['padding-y']?.md?.['$value'] ?? '8')
    const radius = resolveNum(tokens['radius']?.['$value'] ?? '8')
    const fs = resolveNum(tokens['font-size']?.md?.['$value'] ?? '16')
    const h = resolveNum(tokens['height']?.md?.['$value'] ?? '40')

    const resolve = (path: string) => {
      const [group, key] = path.split('/')
      return resolveAlias(tokens[group]?.[key]?.['$value'] ?? '')
    }

    const focusRing = resolve('focus-ring-color')

    const variants: Array<{
      label: string
      states: Array<{ label: string; bg: string; border: string; color: string; opacity?: number; focusRing?: string }>
    }> = [
      {
        label: 'Primary',
        states: [
          { label: 'Default',  bg: resolve('primary/bg'),          border: resolve('primary/border'),          color: resolve('primary/text') },
          { label: 'Hover',    bg: resolve('primary/bg-hover'),     border: resolve('primary/border-hover'),    color: resolve('primary/text') },
          { label: 'Active',   bg: resolve('primary/bg-active'),    border: resolve('primary/border-hover'),    color: resolve('primary/text') },
          { label: 'Disabled', bg: resolve('primary/bg-disabled'),  border: resolve('primary/border-disabled'), color: resolve('primary/text-disabled'), opacity: 0.6 },
          { label: 'Focus',    bg: resolve('primary/bg'),           border: resolve('primary/border'),          color: resolve('primary/text'), focusRing },
        ],
      },
      {
        label: 'Secondary',
        states: [
          { label: 'Default',  bg: 'transparent',                          border: resolve('secondary/border'),          color: resolve('secondary/text') },
          { label: 'Hover',    bg: resolve('secondary/bg-hover'),           border: resolve('secondary/border-hover'),    color: resolve('secondary/text') },
          { label: 'Active',   bg: resolve('secondary/bg-active'),          border: resolve('secondary/border-hover'),    color: resolve('secondary/text') },
          { label: 'Disabled', bg: resolve('secondary/bg-disabled'),        border: resolve('secondary/border-disabled'), color: resolve('secondary/text-disabled'), opacity: 0.6 },
          { label: 'Focus',    bg: 'transparent',                          border: resolve('secondary/border'),          color: resolve('secondary/text'), focusRing },
        ],
      },
      {
        label: 'Destructive',
        states: [
          { label: 'Default',  bg: resolve('destructive/bg'),          border: resolve('destructive/border'),          color: resolve('destructive/text') },
          { label: 'Hover',    bg: resolve('destructive/bg-hover'),     border: resolve('destructive/border-hover'),    color: resolve('destructive/text') },
          { label: 'Active',   bg: resolve('destructive/bg-active'),    border: resolve('destructive/bg-active'),       color: resolve('destructive/text') },
          { label: 'Disabled', bg: resolve('destructive/bg-disabled'),  border: resolve('destructive/border-disabled'), color: resolve('destructive/text-disabled'), opacity: 0.6 },
          { label: 'Focus',    bg: resolve('destructive/bg'),           border: resolve('destructive/border'),          color: resolve('destructive/text'), focusRing },
        ],
      },
      {
        label: 'Ghost',
        states: [
          { label: 'Default',  bg: 'transparent',                    border: 'transparent',                      color: resolve('ghost/text') },
          { label: 'Hover',    bg: resolve('ghost/bg-hover'),         border: resolve('ghost/border-hover'),      color: resolve('ghost/text') },
          { label: 'Active',   bg: resolve('ghost/bg-active'),        border: resolve('ghost/border-hover'),      color: resolve('ghost/text') },
          { label: 'Disabled', bg: 'transparent',                    border: 'transparent',                      color: resolve('ghost/text-disabled'), opacity: 0.6 },
          { label: 'Focus',    bg: 'transparent',                    border: 'transparent',                      color: resolve('ghost/text'), focusRing },
        ],
      },
      {
        label: 'Success',
        states: [
          { label: 'Default',  bg: resolve('success/bg'),          border: resolve('success/border'),          color: resolve('success/text') },
          { label: 'Hover',    bg: resolve('success/bg-hover'),     border: resolve('success/border-hover'),    color: resolve('success/text') },
          { label: 'Active',   bg: resolve('success/bg-active'),    border: resolve('success/bg-active'),       color: resolve('success/text') },
          { label: 'Disabled', bg: resolve('success/bg-disabled'),  border: resolve('success/border-disabled'), color: resolve('success/text-disabled'), opacity: 0.6 },
          { label: 'Focus',    bg: resolve('success/bg'),           border: resolve('success/border'),          color: resolve('success/text'), focusRing },
        ],
      },
      {
        label: 'Warning',
        states: [
          { label: 'Default',  bg: resolve('warning/bg'),          border: resolve('warning/border'),          color: resolve('warning/text') },
          { label: 'Hover',    bg: resolve('warning/bg-hover'),     border: resolve('warning/border-hover'),    color: resolve('warning/text') },
          { label: 'Active',   bg: resolve('warning/bg-active'),    border: resolve('warning/bg-active'),       color: resolve('warning/text') },
          { label: 'Disabled', bg: resolve('warning/bg-disabled'),  border: resolve('warning/border-disabled'), color: resolve('warning/text-disabled'), opacity: 0.6 },
          { label: 'Focus',    bg: resolve('warning/bg'),           border: resolve('warning/border'),          color: resolve('warning/text'), focusRing },
        ],
      },
    ]

    const sharedStyle = (bg: string, border: string, color: string, opacity?: number, focusRing?: string) => ({
      paddingLeft: px, paddingRight: px, paddingTop: py, paddingBottom: py,
      borderRadius: radius, fontSize: fs, height: h,
      backgroundColor: bg,
      border: `1px solid ${border}`,
      boxShadow: focusRing ? `0 0 0 2px #fff, 0 0 0 4px ${focusRing}` : 'none',
      color,
      opacity: opacity ?? 1,
      cursor: 'default',
      fontFamily: 'inherit',
      fontWeight: 500,
    })

    return (
      <div className="overflow-x-auto">
        <table className="text-xs font-mono w-full border-collapse">
          <thead>
            <tr>
              <th className={`text-left pr-4 pb-3 font-normal ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Variant</th>
              {['Default', 'Hover', 'Active', 'Disabled', 'Focus'].map(s => (
                <th key={s} className={`text-center pb-3 px-3 font-normal ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{s}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {variants.map(v => (
              <tr key={v.label}>
                <td className={`pr-4 py-3 font-mono text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{v.label}</td>
                {v.states.map(s => (
                  <td key={s.label} className={`px-3 py-3 text-center${s.focusRing ? ' px-5' : ''}`}>
                    <button style={sharedStyle(s.bg, s.border, s.color, s.opacity, s.focusRing)}>
                      Button
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  if (component === 'input') {
    const px = resolveNum(tokens['padding-x']?.['$value'] ?? '12')
    const py = resolveNum(tokens['padding-y']?.['$value'] ?? '8')
    const radius = resolveNum(tokens['radius']?.['$value'] ?? '8')
    const fs = resolveNum(tokens['font-size']?.['$value'] ?? '16')

    return (
      <div className="flex flex-col gap-3 max-w-sm">
        {(['sm', 'md', 'lg'] as const).map(size => {
          const h = resolveNum(tokens['height']?.[size]?.['$value'] ?? '40')
          return (
            <div key={size} className="flex items-center gap-3">
              <input
                readOnly
                placeholder={`Input — ${size}`}
                style={{
                  paddingLeft: px,
                  paddingRight: px,
                  paddingTop: py,
                  paddingBottom: py,
                  borderRadius: radius,
                  fontSize: fs,
                  height: h,
                  border: `1px solid ${darkMode ? '#374151' : '#D3D3D3'}`,
                  backgroundColor: darkMode ? '#111827' : '#ffffff',
                  color: darkMode ? '#f3f4f6' : '#3E3E3E',
                  outline: 'none',
                  width: '100%',
                  fontFamily: 'inherit',
                }}
              />
              <span className={`text-xs font-mono shrink-0 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{size}</span>
            </div>
          )
        })}
      </div>
    )
  }

  if (component === 'card') {
    return (
      <div className="flex flex-wrap gap-4">
        {(['sm', 'md', 'lg'] as const).map(size => {
          const padding = resolveNum(tokens['padding']?.[size]?.['$value'] ?? '16')
          const radius = resolveNum(tokens['radius']?.['$value'] ?? '12')
          return (
            <div
              key={size}
              style={{
                padding,
                borderRadius: radius,
                border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                minWidth: 140,
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              }}
            >
              <p className={`font-body text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Card — {size}</p>
              <p className={`font-body text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>padding: {padding}px · radius: {radius}px</p>
            </div>
          )
        })}
      </div>
    )
  }

  if (component === 'avatar') {
    return (
      <div className="flex flex-wrap items-end gap-4">
        {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map(size => {
          const s = resolveNum(tokens['size']?.[size]?.['$value'] ?? '40')
          const radius = resolveNum(tokens['radius']?.['$value'] ?? '9999')
          return (
            <div key={size} className="flex flex-col items-center gap-2">
              <div
                style={{
                  width: s,
                  height: s,
                  borderRadius: radius,
                  backgroundColor: '#005999',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: Math.max(10, s * 0.35),
                  fontWeight: 600,
                }}
              >
                JD
              </div>
              <span className={`text-xs font-mono ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{size}</span>
            </div>
          )
        })}
      </div>
    )
  }

  if (component === 'badge') {
    const px = resolveNum(tokens['padding-x']?.['$value'] ?? '8')
    const py = resolveNum(tokens['padding-y']?.['$value'] ?? '4')
    const fs = resolveNum(tokens['font-size']?.['$value'] ?? '12')
    const radius = resolveNum(tokens['radius']?.['$value'] ?? '9999')

    const variants = [
      { label: 'Default', bg: '#E6E6E6', color: '#3E3E3E' },
      { label: 'Success', bg: '#E4F4E4', color: '#265627' },
      { label: 'Warning', bg: '#FEF3C7', color: '#A66B00' },
      { label: 'Error', bg: '#FEE2E3', color: '#9C1C21' },
    ]

    return (
      <div className="flex flex-wrap gap-3 items-center">
        {variants.map(v => (
          <span
            key={v.label}
            style={{
              paddingLeft: px,
              paddingRight: px,
              paddingTop: py,
              paddingBottom: py,
              fontSize: fs,
              borderRadius: radius,
              backgroundColor: v.bg,
              color: v.color,
              fontWeight: 600,
              fontFamily: 'inherit',
            }}
          >
            {v.label}
          </span>
        ))}
      </div>
    )
  }

  if (component === 'icon') {
    return (
      <div className="flex flex-wrap items-end gap-6">
        {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map(size => {
          const s = resolveNum(tokens['size']?.[size]?.['$value'] ?? '20')
          return (
            <div key={size} className="flex flex-col items-center gap-2">
              <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={darkMode ? '#60a5fa' : '#005999'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span className={`text-xs font-mono ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{size} · {s}px</span>
            </div>
          )
        })}
      </div>
    )
  }

  if (component === 'modal') {
    const padding = resolveNum(tokens['padding']?.['$value'] ?? '24')
    const radius = resolveNum(tokens['radius']?.['$value'] ?? '16')
    return (
      <div
        style={{
          padding,
          borderRadius: radius,
          border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
          backgroundColor: darkMode ? '#1f2937' : '#ffffff',
          maxWidth: resolveNum(tokens['width']?.sm?.['$value'] ?? '400'),
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.15)',
        }}
      >
        <p className={`font-body font-semibold text-sm mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Modal Preview</p>
        <p className={`font-body text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          padding: {padding}px · radius: {radius}px
        </p>
      </div>
    )
  }

  // Fallback
  return (
    <div
      className="flex items-center justify-center h-20 rounded-lg"
      style={{ backgroundColor: previewBg }}
    >
      <p className={`text-sm font-body ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        Preview not available for <strong>{component}</strong>
      </p>
    </div>
  )
}
