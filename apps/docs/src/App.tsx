import { useState, useMemo } from 'react'
import { PrimitivesTab } from './tabs/PrimitivesTab'
import { SemanticTab } from './tabs/SemanticTab'
import { ComponentsTab } from './tabs/ComponentsTab'
import { ChangelogTab } from './tabs/ChangelogTab'
import { GuideTab } from './tabs/GuideTab'
import { SunIcon, MoonIcon } from './icons'

type Tab = 'guide' | 'primitives' | 'semantic' | 'components' | 'changelog'

const TABS: { id: Tab; label: string }[] = [
  { id: 'guide', label: 'Guide' },
  { id: 'primitives', label: 'Primitives' },
  { id: 'semantic', label: 'Semantic' },
  { id: 'components', label: 'Components' },
  { id: 'changelog', label: 'Changelog' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('guide')
  const [darkMode, setDarkMode] = useState(false)
  const [search, setSearch] = useState('')

  const appClass = useMemo(
    () => (darkMode ? 'dark bg-gray-950 text-gray-100 min-h-screen' : 'bg-gray-50 text-gray-900 min-h-screen'),
    [darkMode]
  )

  return (
    <div className={appClass}>
      {/* Top bar */}
      <header
        className={`sticky top-0 z-50 border-b ${
          darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
        }`}
      >
        <div className="max-w-screen-2xl mx-auto px-6">
          <div className="flex items-center gap-6 h-14">
            {/* Wordmark */}
            <div className="flex items-baseline gap-2 shrink-0">
              <span className="font-display font-bold text-lg tracking-tight text-[var(--color-brand)]">
                OULDS
              </span>
              <span className={`text-xs font-body ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Token Reference
              </span>
            </div>

            {/* Tabs */}
            <nav className="flex gap-1 ml-4">
              {TABS.filter(t => t.id !== 'changelog' && t.id !== 'guide').map(tab => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setSearch('') }}
                  className={`px-4 py-1.5 rounded-md text-sm font-body font-medium transition-colors ${
                    activeTab === tab.id
                      ? darkMode
                        ? 'bg-gray-700 text-white'
                        : 'bg-gray-100 text-gray-900'
                      : darkMode
                      ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                      : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>

            {/* Search */}
            <div className="flex-1 max-w-sm ml-auto">
              <input
                type="search"
                placeholder="Search tokens…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className={`w-full px-3 py-1.5 text-sm rounded-lg border font-mono outline-none transition-colors ${
                  darkMode
                    ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-blue-500'
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-400'
                }`}
              />
            </div>

            {/* Guide + Changelog buttons */}
            <button
              onClick={() => { setActiveTab('guide'); setSearch('') }}
              className={`px-3 py-1.5 rounded-md text-sm font-body font-medium transition-colors ${
                activeTab === 'guide'
                  ? darkMode
                    ? 'bg-gray-700 text-white'
                    : 'bg-gray-100 text-gray-900'
                  : darkMode
                  ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              Guide
            </button>

            {/* Changelog button */}
            <button
              onClick={() => { setActiveTab('changelog'); setSearch('') }}
              className={`px-3 py-1.5 rounded-md text-sm font-body font-medium transition-colors ${
                activeTab === 'changelog'
                  ? darkMode
                    ? 'bg-gray-700 text-white'
                    : 'bg-gray-100 text-gray-900'
                  : darkMode
                  ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              Changelog
            </button>

            {/* Dark mode toggle */}
            <button
              onClick={() => setDarkMode(d => !d)}
              className={`p-2 rounded-lg transition-colors ${
                darkMode ? 'hover:bg-gray-800 text-yellow-400' : 'hover:bg-gray-100 text-gray-500'
              }`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
        </div>
      </header>

      {/* Page hero */}
      <div className={`border-b ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
        <div className="max-w-screen-2xl mx-auto px-6 py-10">
          <p className={`text-xs font-mono uppercase tracking-widest mb-2 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`}>
            One UL Design System
          </p>
          <h1 className="font-display font-bold text-3xl tracking-tight mb-2">
            OULDS Design System
            <span className={`ml-3 text-xl font-normal ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              — Token Reference
            </span>
          </h1>
          <p className={`font-body text-sm max-w-xl ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            The single source of truth for all design decisions. Browse primitives, semantic tokens, and component-level values.
          </p>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-screen-2xl mx-auto px-6 py-8">
        {activeTab === 'guide' && <GuideTab darkMode={darkMode} onNavigate={tab => { setActiveTab(tab); setSearch('') }} />}
        {activeTab === 'primitives' && <PrimitivesTab search={search} darkMode={darkMode} />}
        {activeTab === 'semantic' && <SemanticTab search={search} darkMode={darkMode} />}
        {activeTab === 'components' && <ComponentsTab search={search} darkMode={darkMode} />}
        {activeTab === 'changelog' && <ChangelogTab search={search} darkMode={darkMode} />}
      </main>
    </div>
  )
}
