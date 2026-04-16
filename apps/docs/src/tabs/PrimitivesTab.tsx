import { useMemo, useState } from 'react'
import { getColorScales, getNonColorPrimitives } from '../tokens'
import { CopyButton } from '../components/CopyButton'

interface Props {
  search: string
  darkMode: boolean
}

const SIDEBAR_ITEMS = [
  { id: 'color-scales', label: 'Color Scales' },
  { id: 'spacing', label: 'Spacing' },
  { id: 'radius', label: 'Radius' },
  { id: 'fontSize', label: 'Font Size' },
  { id: 'fontFamily', label: 'Font Family' },
  { id: 'fontWeight', label: 'Font Weight' },
  { id: 'lineHeight', label: 'Line Height' },
  { id: 'letterSpacing', label: 'Letter Spacing' },
  { id: 'borderWidth', label: 'Border Width' },
  { id: 'opacity', label: 'Opacity' },
  { id: 'zIndex', label: 'Z-Index' },
  { id: 'duration', label: 'Duration' },
  { id: 'easing', label: 'Easing' },
  { id: 'breakpoint', label: 'Breakpoint' },
]

export function PrimitivesTab({ search, darkMode }: Props) {
  const [activeSection, setActiveSection] = useState('color-scales')
  const colorScales = useMemo(() => getColorScales(), [])
  const nonColor = useMemo(() => getNonColorPrimitives(), [])

  const sidebarClass = `shrink-0 w-48 sticky top-20 self-start`
  const navItemBase = `block w-full text-left px-3 py-1.5 rounded-md text-sm font-body transition-colors`

  return (
    <div className="flex gap-8">
      {/* Sidebar */}
      <aside className={sidebarClass}>
        <p className={`text-xs font-mono uppercase tracking-widest mb-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          Sections
        </p>
        <nav className="flex flex-col gap-0.5">
          {SIDEBAR_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`${navItemBase} ${
                activeSection === item.id
                  ? darkMode
                    ? 'bg-gray-700 text-white font-medium'
                    : 'bg-gray-100 text-gray-900 font-medium'
                  : darkMode
                  ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {activeSection === 'color-scales' && (
          <ColorScalesSection scales={colorScales} search={search} darkMode={darkMode} />
        )}
        {activeSection !== 'color-scales' && (
          <NonColorSection
            category={activeSection}
            tokens={nonColor[activeSection] ?? []}
            search={search}
            darkMode={darkMode}
          />
        )}
      </div>
    </div>
  )
}

function ColorScalesSection({
  scales,
  search,
  darkMode,
}: {
  scales: ReturnType<typeof getColorScales>
  search: string
  darkMode: boolean
}) {
  const ORDER = ['gray', 'blue', 'green', 'teal', 'orange', 'red', 'brand-red']

  const sorted = useMemo(() => {
    const all = [...scales].sort((a, b) => {
      const ai = ORDER.indexOf(a.name)
      const bi = ORDER.indexOf(b.name)
      if (ai === -1 && bi === -1) return a.name.localeCompare(b.name)
      if (ai === -1) return 1
      if (bi === -1) return -1
      return ai - bi
    })
    if (!search) return all
    return all.filter(
      s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.swatches.some(sw => sw.hex.toLowerCase().includes(search.toLowerCase()))
    )
  }, [scales, search])

  return (
    <div>
      <SectionHeader title="Color Scales" subtitle="All primitive color palettes" darkMode={darkMode} />
      <div className="grid gap-6">
        {sorted.map(scale => (
          <ColorScaleCard key={scale.name} scale={scale} darkMode={darkMode} />
        ))}
      </div>
    </div>
  )
}

function ColorScaleCard({
  scale,
  darkMode,
}: {
  scale: ReturnType<typeof getColorScales>[number]
  darkMode: boolean
}) {
  return (
    <div className={`rounded-xl border p-5 ${darkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'}`}>
      <h3 className="font-display font-semibold text-base mb-4 capitalize">{scale.name}</h3>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(72px,1fr))] gap-3">
        {scale.swatches.map(sw => (
          <SwatchCard key={sw.step} step={sw.step} hex={sw.hex} scaleName={scale.name} darkMode={darkMode} />
        ))}
      </div>
    </div>
  )
}

function SwatchCard({
  step,
  hex,
  scaleName,
  darkMode,
}: {
  step: string
  hex: string
  scaleName: string
  darkMode: boolean
}) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(hex).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  // Determine if text should be dark or light based on hex luminance
  const isLight = useMemo(() => {
    const h = hex.replace('#', '')
    if (h.length < 6) return true
    const r = parseInt(h.slice(0, 2), 16)
    const g = parseInt(h.slice(2, 4), 16)
    const b = parseInt(h.slice(4, 6), 16)
    const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return lum > 0.5
  }, [hex])

  const isDefault = step === '600' && scaleName !== 'gray'

  return (
    <button
      onClick={copy}
      title={`color.${scaleName}.${step} · ${hex}${isDefault ? ' (default)' : ''}`}
      className="group flex flex-col rounded-lg overflow-hidden border transition-transform hover:scale-105 active:scale-95"
      style={{
        borderColor: darkMode ? '#374151' : '#e5e7eb',
      }}
    >
      {/* Swatch */}
      <div
        className="h-14 w-full flex items-start justify-between p-1"
        style={{ backgroundColor: hex }}
      >
        {isDefault && (
          <span
            className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded-sm leading-tight"
            style={{
              backgroundColor: isLight ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.25)',
              color: isLight ? '#000' : '#fff',
            }}
          >
            Default
          </span>
        )}
        {copied && (
          <span
            className="ml-auto text-[9px] font-mono px-1 py-0.5 rounded"
            style={{ backgroundColor: isLight ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.2)', color: isLight ? '#000' : '#fff' }}
          >
            ✓
          </span>
        )}
      </div>
      {/* Label */}
      <div className={`px-2 py-1.5 text-left ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <p className={`text-[11px] font-mono font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{step}</p>
        <p className={`text-[10px] font-mono ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{hex.toUpperCase()}</p>
      </div>
    </button>
  )
}

function NonColorSection({
  category,
  tokens,
  search,
  darkMode,
}: {
  category: string
  tokens: Array<{ name: string; type: string; value: string }>
  search: string
  darkMode: boolean
}) {
  const filtered = useMemo(
    () =>
      search
        ? tokens.filter(t => t.name.toLowerCase().includes(search.toLowerCase()))
        : tokens,
    [tokens, search]
  )

  const title = SIDEBAR_ITEMS.find(s => s.id === category)?.label ?? category

  return (
    <div>
      <SectionHeader title={title} subtitle={`${filtered.length} tokens`} darkMode={darkMode} />
      <div className={`rounded-xl border overflow-hidden ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
        <table className="w-full text-sm">
          <thead>
            <tr className={`text-xs font-mono uppercase tracking-wider ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-50 text-gray-400'}`}>
              <th className="text-left px-4 py-3">Token</th>
              <th className="text-left px-4 py-3">Preview</th>
              <th className="text-left px-4 py-3">Value</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((token) => (
              <tr
                key={token.name}
                className={`group border-t ${
                  darkMode ? 'border-gray-800 hover:bg-gray-800/50' : 'border-gray-100 hover:bg-gray-50'
                }`}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className={`font-mono text-xs ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                      {category}.{token.name}
                    </span>
                    <CopyButton text={`${category}.${token.name}`} darkMode={darkMode} />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <TokenPreview category={category} name={token.name} value={token.value} darkMode={darkMode} />
                </td>
                <td className="px-4 py-3">
                  <span className={`font-mono text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {formatValue(category, token.value)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TokenPreview({
  category,
  name,
  value,
  darkMode,
}: {
  category: string
  name: string
  value: string
  darkMode: boolean
}) {
  const num = parseFloat(value)
  const border = darkMode ? '#374151' : '#d1d5db'
  const fg = darkMode ? '#5CC0FF' : '#005999'
  const subtle = darkMode ? '#1f2937' : '#f3f4f6'

  // --- SPACING: a filled square whose size = value (capped) ---
  if (category === 'spacing') {
    if (isNaN(num) || num === 0) {
      return <span className={`text-xs font-mono ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>0</span>
    }
    const size = Math.min(num, 64)
    return (
      <div className="flex items-center gap-2">
        <div style={{ width: size, height: size, backgroundColor: fg, borderRadius: 2, flexShrink: 0 }} />
      </div>
    )
  }

  // --- RADIUS: a rounded rectangle showing the actual corner radius ---
  if (category === 'radius') {
    const r = name === 'full' ? 9999 : Math.min(num, 32)
    return (
      <div
        style={{
          width: 48,
          height: 32,
          borderRadius: r,
          border: `2px solid ${fg}`,
          backgroundColor: 'transparent',
          flexShrink: 0,
        }}
      />
    )
  }

  // --- FONT SIZE: sample text rendered at actual size (capped display) ---
  if (category === 'fontSize') {
    const displaySize = Math.min(num, 32)
    return (
      <span
        style={{
          fontSize: displaySize,
          lineHeight: 1,
          fontFamily: 'inherit',
          color: darkMode ? '#e5e7eb' : '#111827',
          fontWeight: 500,
        }}
      >
        Aa
      </span>
    )
  }

  // --- FONT FAMILY: sample text in the actual family ---
  if (category === 'fontFamily') {
    const family = value.replace(/['"]/g, '').split(',')[0].trim()
    return (
      <span
        style={{
          fontFamily: value,
          fontSize: 14,
          color: darkMode ? '#e5e7eb' : '#111827',
        }}
      >
        {family}
      </span>
    )
  }

  // --- FONT WEIGHT: "OULDS" at the actual weight ---
  if (category === 'fontWeight') {
    return (
      <span
        style={{
          fontWeight: value,
          fontSize: 14,
          fontFamily: 'inherit',
          color: darkMode ? '#e5e7eb' : '#111827',
        }}
      >
        One UL
      </span>
    )
  }

  // --- LINE HEIGHT: two lines of text showing spacing ---
  if (category === 'lineHeight') {
    const lh = isNaN(num) ? 1.5 : num / 100
    return (
      <div
        style={{
          fontSize: 11,
          lineHeight: lh,
          color: darkMode ? '#9ca3af' : '#6b7280',
          fontFamily: 'inherit',
          maxWidth: 100,
        }}
      >
        <div>Text line one</div>
        <div>Text line two</div>
      </div>
    )
  }

  // --- LETTER SPACING: sample text with the actual tracking applied as px (clamped for legibility) ---
  if (category === 'letterSpacing') {
    const clamped = Math.max(num, -0.75)
    return (
      <span
        style={{
          letterSpacing: `${clamped}px`,
          fontSize: 13,
          fontFamily: 'inherit',
          fontWeight: 500,
          color: darkMode ? '#e5e7eb' : '#111827',
          whiteSpace: 'nowrap',
        }}
      >
        One UL Design System
      </span>
    )
  }

  // --- BORDER WIDTH: a horizontal rule at the actual thickness ---
  if (category === 'borderWidth') {
    if (num === 0) {
      return <span className={`text-xs font-mono ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>none</span>
    }
    return (
      <div style={{ width: 64, height: Math.max(num, 1), backgroundColor: fg, borderRadius: 1, flexShrink: 0 }} />
    )
  }

  // --- OPACITY: a colored swatch at the actual opacity ---
  if (category === 'opacity') {
    const alpha = isNaN(num) ? 1 : num / 100
    return (
      <div className="flex items-center gap-2">
        <div
          style={{
            width: 36,
            height: 20,
            borderRadius: 4,
            border: `1px solid ${border}`,
            background: `repeating-conic-gradient(#ccc 0% 25%, white 0% 50%) 0 0 / 8px 8px`,
            flexShrink: 0,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', inset: 0, backgroundColor: fg, opacity: alpha }} />
        </div>
      </div>
    )
  }

  // --- Z-INDEX: stacked layers visualisation (vertical) ---
  if (category === 'zIndex') {
    const layers = Math.min(Math.max(Math.ceil(num / 100), 1), 7)
    return (
      <div className="flex items-end" style={{ width: 28, height: 32, position: 'relative' }}>
        {Array.from({ length: layers }).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: i * 3,
              bottom: i * 3,
              width: 18,
              height: 18,
              backgroundColor: fg,
              opacity: 0.35 + i * 0.1,
              borderRadius: 3,
              border: `1px solid ${darkMode ? '#1e3a5f' : '#bfdbfe'}`,
            }}
          />
        ))}
      </div>
    )
  }

  // --- DURATION: a progress track showing relative timing ---
  if (category === 'duration') {
    if (num === 0) {
      return <span className={`text-xs font-mono ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>instant</span>
    }
    const maxDuration = 1000
    const pct = Math.min((num / maxDuration) * 100, 100)
    return (
      <div className="flex items-center gap-2">
        <div
          style={{
            width: 80,
            height: 4,
            borderRadius: 2,
            backgroundColor: darkMode ? '#374151' : '#e5e7eb',
            flexShrink: 0,
            overflow: 'hidden',
          }}
        >
          <div style={{ width: `${pct}%`, height: '100%', backgroundColor: fg, borderRadius: 2 }} />
        </div>
      </div>
    )
  }

  // --- EASING: a simple bezier curve path sketch ---
  if (category === 'easing') {
    const curves: Record<string, string> = {
      linear:       'M 0 40 L 40 0',
      ease:         'M 0 40 C 10 40 30 0 40 0',
      'ease-in':    'M 0 40 C 28 40 40 10 40 0',
      'ease-out':   'M 0 40 C 0 10 12 0 40 0',
      'ease-in-out':'M 0 40 C 14 40 26 0 40 0',
      sharp:        'M 0 40 C 16 40 24 0 40 0',
      bounce:       'M 0 40 C 20 50 16 -10 40 0',
    }
    const d = curves[name] ?? curves['ease']
    return (
      <svg width="44" height="44" viewBox="-2 -4 44 48" fill="none">
        <path d={d} stroke={fg} strokeWidth="2" strokeLinecap="round" />
        <circle cx="0" cy="40" r="2.5" fill={fg} />
        <circle cx="40" cy="0" r="2.5" fill={fg} />
      </svg>
    )
  }

  // --- BREAKPOINT: a proportional device-width bar ---
  if (category === 'breakpoint' || category === 'container') {
    const maxBp = 1536
    const pct = Math.min((num / maxBp) * 100, 100)
    return (
      <div className="flex items-center gap-2">
        <div
          style={{
            width: 96,
            height: 14,
            borderRadius: 3,
            backgroundColor: darkMode ? '#374151' : '#e5e7eb',
            flexShrink: 0,
            overflow: 'hidden',
            border: `1px solid ${border}`,
          }}
        >
          <div style={{ width: `${pct}%`, height: '100%', backgroundColor: fg }} />
        </div>
      </div>
    )
  }

  // --- FALLBACK: just show the value as text ---
  return (
    <span className={`text-xs font-mono italic ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
      {value.length > 48 ? value.slice(0, 48) + '…' : value}
    </span>
  )
}

function formatValue(category: string, value: string): string {
  const num = parseFloat(value)
  if (isNaN(num)) return value

  const pxCategories = ['spacing', 'fontSize', 'radius', 'borderWidth', 'breakpoint', 'letterSpacing']
  const msCategories = ['duration']
  const pctCategories = ['opacity', 'lineHeight']

  if (pxCategories.includes(category)) return `${num}px`
  if (msCategories.includes(category)) return `${num}ms`
  if (pctCategories.includes(category)) return `${num}%`
  return value
}

function SectionHeader({ title, subtitle, darkMode }: { title: string; subtitle: string; darkMode: boolean }) {
  return (
    <div className="mb-6">
      <h2 className="font-display font-bold text-xl">{title}</h2>
      <p className={`text-sm font-body mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{subtitle}</p>
    </div>
  )
}
