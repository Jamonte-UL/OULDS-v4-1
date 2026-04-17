import { useMemo } from 'react'
import { changelog, type ChangeType } from '../changelog'
import { CopyButton } from '../components/CopyButton'
import { flattenTokens, primitiveTokens, lightTokens, darkTokens, componentTokens, type TokenNode } from '../tokens'

interface Props {
  search: string
  darkMode: boolean
}

const TYPE_META: Record<ChangeType, { label: string; colors: { light: string; dark: string }; dot: string }> = {
  added:      { label: 'Added',      colors: { light: 'bg-green-50 text-green-800 border-green-200',   dark: 'bg-green-950 text-green-300 border-green-800'  }, dot: '#22c55e' },
  changed:    { label: 'Changed',    colors: { light: 'bg-blue-50 text-blue-800 border-blue-200',      dark: 'bg-blue-950 text-blue-300 border-blue-800'    }, dot: '#005999' },
  deprecated: { label: 'Deprecated', colors: { light: 'bg-orange-50 text-orange-800 border-orange-200', dark: 'bg-orange-950 text-orange-300 border-orange-800'}, dot: '#f97316' },
  removed:    { label: 'Removed',    colors: { light: 'bg-red-50 text-red-800 border-red-200',         dark: 'bg-red-950 text-red-300 border-red-800'       }, dot: '#ef4444' },
  fixed:      { label: 'Fixed',      colors: { light: 'bg-purple-50 text-purple-800 border-purple-200', dark: 'bg-purple-950 text-purple-300 border-purple-800'}, dot: '#a855f7' },
}

export function ChangelogTab({ search, darkMode }: Props) {
  const filtered = useMemo(() => {
    if (!search) return changelog
    const q = search.toLowerCase()
    return changelog
      .map(release => ({
        ...release,
        changes: release.changes.filter(
          c =>
            c.description.toLowerCase().includes(q) ||
            (c.token ?? '').toLowerCase().includes(q) ||
            c.type.toLowerCase().includes(q)
        ),
      }))
      .filter(r => r.changes.length > 0 || r.version.includes(q) || r.summary.toLowerCase().includes(q))
  }, [search])

  const totalTokens = useMemo(() => {
    const count = (
      flattenTokens(primitiveTokens as unknown as TokenNode).length +
      flattenTokens(lightTokens as unknown as TokenNode).length +
      flattenTokens(darkTokens as unknown as TokenNode).length +
      flattenTokens(componentTokens as unknown as TokenNode).length
    )
    return count
  }, [])

  return (
    <div className="max-w-3xl">
      {/* Header stats */}
      <div className="mb-8">
        <h2 className="font-display font-bold text-xl mb-1">Changelog</h2>
        <p className={`text-sm font-body ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          Token history and release notes for the One UL Design System.
        </p>
        <div className="flex gap-4 mt-4">
          <Stat label="Latest version" value={changelog[0]?.version ?? '—'} darkMode={darkMode} />
          <Stat label="Releases" value={String(changelog.length)} darkMode={darkMode} />
          <Stat label="Total tokens" value={String(totalTokens)} darkMode={darkMode} />
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2 mb-8">
        {(Object.entries(TYPE_META) as [ChangeType, typeof TYPE_META[ChangeType]][]).map(([type, meta]) => (
          <span
            key={type}
            className={`inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-full border ${
              darkMode ? meta.colors.dark : meta.colors.light
            }`}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: meta.dot, flexShrink: 0, display: 'inline-block' }} />
            {meta.label}
          </span>
        ))}
      </div>

      {/* Releases */}
      {filtered.length === 0 ? (
        <p className={`text-sm ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>No results match your search.</p>
      ) : (
        <div className="flex flex-col gap-10">
          {filtered.map(release => (
            <ReleaseBlock key={release.version} release={release} darkMode={darkMode} />
          ))}
        </div>
      )}
    </div>
  )
}

function ReleaseBlock({ release, darkMode }: { release: typeof changelog[number]; darkMode: boolean }) {
  // Group changes by type
  const grouped = useMemo(() => {
    const order: ChangeType[] = ['added', 'changed', 'fixed', 'deprecated', 'removed']
    const map = new Map<ChangeType, typeof release.changes>()
    for (const type of order) {
      const items = release.changes.filter(c => c.type === type)
      if (items.length) map.set(type, items)
    }
    return map
  }, [release.changes])

  return (
    <div>
      {/* Release header */}
      <div className="flex items-baseline gap-3 mb-1">
        <h3 className="font-display font-bold text-2xl">v{release.version}</h3>
        <span className={`font-mono text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{release.date}</span>
        <span className={`ml-auto font-mono text-xs ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
          {release.changes.length} changes
        </span>
      </div>
      <p className={`text-sm font-body mb-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{release.summary}</p>

      {/* Divider */}
      <div className={`border-t mb-5 ${darkMode ? 'border-gray-800' : 'border-gray-200'}`} />

      {/* Change groups */}
      <div className="flex flex-col gap-5">
        {Array.from(grouped.entries()).map(([type, items]) => (
          <ChangeGroup key={type} type={type} items={items} darkMode={darkMode} />
        ))}
      </div>
    </div>
  )
}

function ChangeGroup({
  type,
  items,
  darkMode,
}: {
  type: ChangeType
  items: typeof changelog[number]['changes']
  darkMode: boolean
}) {
  const meta = TYPE_META[type]

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full border ${
            darkMode ? meta.colors.dark : meta.colors.light
          }`}
        >
          <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: meta.dot, flexShrink: 0, display: 'inline-block' }} />
          {meta.label}
        </span>
        <span className={`text-xs font-mono ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>{items.length}</span>
      </div>

      <ul className="flex flex-col gap-1">
        {items.map((item, i) => (
          <li
            key={i}
            className={`flex items-start gap-3 text-sm px-3 py-2 rounded-lg ${
              darkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'
            } group`}
          >
            <span className={`mt-1.5 w-1 h-1 rounded-full shrink-0`} style={{ backgroundColor: meta.dot }} />
            <span className="flex-1">
              {item.token && (
                <span className="inline-flex items-center gap-1 mr-2">
                  <code className={`font-mono text-xs px-1.5 py-0.5 rounded ${darkMode ? 'bg-gray-800 text-blue-400' : 'bg-gray-100 text-blue-700'}`}>
                    {item.token}
                  </code>
                  <CopyButton text={item.token} darkMode={darkMode} />
                </span>
              )}
              <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{item.description}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Stat({ label, value, darkMode }: { label: string; value: string; darkMode: boolean }) {
  return (
    <div className={`rounded-lg border px-4 py-2.5 ${darkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'}`}>
      <p className={`text-xs font-mono ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{label}</p>
      <p className="font-display font-bold text-lg leading-tight">{value}</p>
    </div>
  )
}
