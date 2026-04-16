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
    const paddingX = resolveNum(tokens['padding-x']?.md?.['$value'] ?? '16')
    const paddingY = resolveNum(tokens['padding-y']?.md?.['$value'] ?? '8')
    const radius = resolveNum(tokens['radius']?.['$value'] ?? '8')
    const fontSize = resolveNum(tokens['font-size']?.md?.['$value'] ?? '16')
    const height = resolveNum(tokens['height']?.md?.['$value'] ?? '40')

    return (
      <div className="flex flex-wrap gap-4 items-end">
        {(['sm', 'md', 'lg'] as const).map(size => {
          const px = resolveNum(tokens['padding-x']?.[size]?.['$value'] ?? paddingX.toString())
          const py = resolveNum(tokens['padding-y']?.[size]?.['$value'] ?? paddingY.toString())
          const fs = resolveNum(tokens['font-size']?.[size]?.['$value'] ?? fontSize.toString())
          const h = resolveNum(tokens['height']?.[size]?.['$value'] ?? height.toString())
          return (
            <div key={size} className="flex flex-col items-center gap-2">
              <button
                style={{
                  paddingLeft: px,
                  paddingRight: px,
                  paddingTop: py,
                  paddingBottom: py,
                  borderRadius: radius,
                  fontSize: fs,
                  height: h,
                  backgroundColor: '#005999',
                  color: '#fff',
                  border: 'none',
                  cursor: 'default',
                  fontFamily: 'inherit',
                  fontWeight: 500,
                }}
              >
                Button
              </button>
              <span className={`text-xs font-mono ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{size}</span>
            </div>
          )
        })}
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
