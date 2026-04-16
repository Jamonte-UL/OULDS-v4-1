import { useMemo, useState } from 'react'
import { flattenSemantic, type SemanticRow } from '../tokens'
import { CopyButton } from '../components/CopyButton'

interface Props {
  search: string
  darkMode: boolean
}

// Group semantic tokens by their top-level category (text, bg, border, etc.)
const CATEGORIES = [
  { id: 'text', label: 'Text' },
  { id: 'bg', label: 'Background' },
  { id: 'border', label: 'Border' },
  { id: 'interactive', label: 'Interactive' },
  { id: 'accent', label: 'Accent' },
  { id: 'severity', label: 'Severity' },
  { id: 'chart', label: 'Chart' },
  { id: 'surface', label: 'Surface' },
  { id: 'typography', label: 'Typography' },
  { id: 'elevation', label: 'Elevation' },
  { id: 'motion', label: 'Motion' },
  { id: 'focus', label: 'Focus' },
  { id: 'state', label: 'State' },
]

export function SemanticTab({ search, darkMode }: Props) {
  const allTokens = useMemo(() => flattenSemantic(), [])
  const [activeCategory, setActiveCategory] = useState('text')

  const navItemBase = `block w-full text-left px-3 py-1.5 rounded-md text-sm font-body transition-colors`

  const filteredByCategory = useMemo(() => {
    const cats: Record<string, SemanticRow[]> = {}
    for (const cat of CATEGORIES) {
      cats[cat.id] = allTokens.filter(t => t.name.startsWith(cat.id + '.') || t.name === cat.id)
    }
    return cats
  }, [allTokens])

  const displayed = useMemo(() => {
    const rows = filteredByCategory[activeCategory] ?? []
    if (!search) return rows
    const q = search.toLowerCase()
    return rows.filter(
      r =>
        r.name.toLowerCase().includes(q) ||
        r.lightValue.toLowerCase().includes(q) ||
        r.darkValue.toLowerCase().includes(q) ||
        r.lightResolved.toLowerCase().includes(q) ||
        r.darkResolved.toLowerCase().includes(q)
    )
  }, [filteredByCategory, activeCategory, search])

  return (
    <div className="flex gap-8">
      {/* Sidebar */}
      <aside className="shrink-0 w-48 sticky top-20 self-start">
        <p className={`text-xs font-mono uppercase tracking-widest mb-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          Categories
        </p>
        <nav className="flex flex-col gap-0.5">
          {CATEGORIES.map(cat => {
            const count = filteredByCategory[cat.id]?.length ?? 0
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`${navItemBase} flex justify-between items-center ${
                  activeCategory === cat.id
                    ? darkMode
                      ? 'bg-gray-700 text-white font-medium'
                      : 'bg-gray-100 text-gray-900 font-medium'
                    : darkMode
                    ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] font-mono ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>{count}</span>
              </button>
            )
          })}
        </nav>
      </aside>

      {/* Table */}
      <div className="flex-1 min-w-0">
        <div className="mb-6">
          <h2 className="font-display font-bold text-xl">
            {CATEGORIES.find(c => c.id === activeCategory)?.label ?? activeCategory}
          </h2>
          <p className={`text-sm font-body mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            {displayed.length} tokens · Light &amp; dark values shown side by side
          </p>
        </div>

        <div className={`rounded-xl border overflow-hidden ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <table className="w-full text-sm">
            <thead>
              <tr className={`text-xs font-mono uppercase tracking-wider ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-50 text-gray-400'}`}>
                <th className="text-left px-4 py-3 w-1/3">Token</th>
                <th className="text-left px-4 py-3">Light</th>
                <th className="text-left px-4 py-3">Dark</th>
              </tr>
            </thead>
            <tbody>
              {displayed.map(row => (
                <SemanticRow key={row.name} row={row} darkMode={darkMode} />
              ))}
              {displayed.length === 0 && (
                <tr>
                  <td colSpan={3} className={`px-4 py-10 text-center text-sm ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                    No tokens match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function SemanticRow({ row, darkMode }: { row: SemanticRow; darkMode: boolean }) {
  const isColor = row.type === 'color'

  return (
    <tr className={`group border-t ${darkMode ? 'border-gray-800 hover:bg-gray-800/40' : 'border-gray-100 hover:bg-gray-50'}`}>
      {/* Token name */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className={`font-mono text-xs ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
            {row.name}
          </span>
          <CopyButton text={row.name} darkMode={darkMode} />
        </div>
        <span className={`text-[10px] font-mono mt-0.5 block ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
          {row.type}
        </span>
      </td>

      {/* Light value */}
      <td className="px-4 py-3">
        <TokenValueCell
          raw={row.lightValue}
          resolved={row.lightResolved}
          type={row.type}
          isColor={isColor}
          darkMode={darkMode}
          theme="light"
        />
      </td>

      {/* Dark value */}
      <td className="px-4 py-3">
        <TokenValueCell
          raw={row.darkValue}
          resolved={row.darkResolved}
          type={row.type}
          isColor={isColor}
          darkMode={darkMode}
          theme="dark"
        />
      </td>
    </tr>
  )
}

function TokenValueCell({
  raw,
  resolved,
  isColor,
  darkMode,
  theme,
}: {
  raw: string
  resolved: string
  type: string
  isColor: boolean
  darkMode: boolean
  theme: 'light' | 'dark'
}) {
  if (!raw) {
    return <span className={`text-xs ${darkMode ? 'text-gray-700' : 'text-gray-300'}`}>—</span>
  }

  const bg = theme === 'dark' ? '#111827' : '#ffffff'

  return (
    <div className="flex items-center gap-2">
      {isColor && (
        <div
          className="w-8 h-8 rounded-md border shrink-0"
          style={{
            backgroundColor: resolved,
            borderColor: darkMode ? '#374151' : '#e5e7eb',
            boxShadow: `inset 0 0 0 1px rgba(0,0,0,0.08)`,
          }}
          title={resolved}
        />
      )}
      {isColor && theme === 'dark' && (
        // Show swatch on dark bg
        <div
          className="w-8 h-8 rounded-md border shrink-0"
          style={{
            backgroundColor: bg,
            borderColor: '#374151',
            position: 'relative',
          }}
          title="Dark background preview"
        >
          <div
            style={{
              position: 'absolute',
              inset: 4,
              borderRadius: 4,
              backgroundColor: resolved,
            }}
          />
        </div>
      )}
      <div>
        <p className={`font-mono text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {resolved !== raw && resolved ? resolved.toUpperCase() : raw}
        </p>
        {resolved !== raw && raw && (
          <p className={`font-mono text-[10px] ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
            {raw}
          </p>
        )}
      </div>
    </div>
  )
}
