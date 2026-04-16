interface Props {
  darkMode: boolean
  onNavigate: (tab: 'primitives' | 'semantic' | 'components') => void
}

// ─── Section wrapper ─────────────────────────────────────────────────────────
function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <section className={`mb-16 ${className}`}>{children}</section>
}

function SectionLabel({ children, darkMode }: { children: React.ReactNode; darkMode: boolean }) {
  return (
    <p className={`text-xs font-mono uppercase tracking-widest mb-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
      {children}
    </p>
  )
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="font-display font-bold text-2xl mb-3 leading-tight">{children}</h2>
}

function Body({ children, darkMode, className = '' }: { children: React.ReactNode; darkMode: boolean; className?: string }) {
  return (
    <p className={`font-body text-base leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'} ${className}`}>
      {children}
    </p>
  )
}

// ─── Token chip ───────────────────────────────────────────────────────────────
function TokenChip({ children, darkMode }: { children: string; darkMode: boolean }) {
  return (
    <code
      className={`inline-block font-mono text-xs px-2 py-0.5 rounded ${
        darkMode ? 'bg-gray-800 text-blue-400' : 'bg-blue-50 text-blue-700'
      }`}
    >
      {children}
    </code>
  )
}

// ─── Tier flow diagram ────────────────────────────────────────────────────────
function TierDiagram({ darkMode }: { darkMode: boolean }) {
  const tiers = [
    {
      label: 'Primitive',
      tag: 'Layer 1',
      name: 'color.blue.600',
      value: '#005999',
      preview: <span className="block w-8 h-8 rounded-full" style={{ background: '#005999' }} />,
      desc: 'The raw color in the palette. No meaning attached — just a value.',
      tagColor: darkMode ? 'text-gray-500 bg-gray-800' : 'text-gray-500 bg-gray-100',
    },
    {
      label: 'Semantic',
      tag: 'Layer 2',
      name: 'interactive.primary',
      value: '↳ color.blue.600',
      preview: (
        <span
          className="block w-8 h-8 rounded-full border-2"
          style={{ background: '#005999', borderColor: '#005999' }}
        />
      ),
      desc: 'Named for its purpose — "this blue is used for primary interactive actions".',
      tagColor: darkMode ? 'text-blue-400 bg-blue-950' : 'text-blue-700 bg-blue-50',
    },
    {
      label: 'Component',
      tag: 'Layer 3',
      name: 'button.bg',
      value: '↳ interactive.primary',
      preview: (
        <span
          className="flex items-center justify-center w-16 h-8 rounded text-white text-xs font-body font-semibold"
          style={{ background: '#005999', fontSize: 11 }}
        >
          Save
        </span>
      ),
      desc: 'Scoped to a single UI component — the button background specifically.',
      tagColor: darkMode ? 'text-green-400 bg-green-950' : 'text-green-700 bg-green-50',
    },
  ]

  return (
    <div className="flex flex-col md:flex-row gap-4 mt-6">
      {tiers.map((tier, i) => (
        <div key={tier.label} className="flex md:flex-col md:flex-1 items-start md:items-stretch gap-4">
          {/* Card */}
          <div
            className={`flex-1 rounded-xl border p-5 ${
              darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              {tier.preview}
              <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${tier.tagColor}`}>
                {tier.tag}
              </span>
            </div>
            <p className="font-display font-semibold text-sm mb-1">{tier.label}</p>
            <code
              className={`block font-mono text-xs mb-1 ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}
            >
              {tier.name}
            </code>
            <code className={`block font-mono text-xs mb-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              {tier.value}
            </code>
            <p className={`text-xs font-body leading-relaxed ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              {tier.desc}
            </p>
          </div>

          {/* Arrow between cards */}
          {i < tiers.length - 1 && (
            <div className="hidden md:flex items-center justify-center w-6 shrink-0 mt-6">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M4 10h12M12 6l4 4-4 4"
                  stroke={darkMode ? '#4b5563' : '#d1d5db'}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Theme demo ───────────────────────────────────────────────────────────────
function ThemeDemo({ darkMode }: { darkMode: boolean }) {
  const modes = [
    {
      label: 'Light mode',
      bg: '#ffffff',
      surface: '#f9fafb',
      text: '#374151',
      textMuted: '#9ca3af',
      border: '#e5e7eb',
      accent: '#005999',
      accentFg: '#ffffff',
    },
    {
      label: 'Dark mode',
      bg: '#030712',
      surface: '#111827',
      text: '#f3f4f6',
      textMuted: '#6b7280',
      border: '#1f2937',
      accent: '#5CC0FF',
      accentFg: '#030712',
    },
  ]

  return (
    <div className="flex flex-col sm:flex-row gap-4 mt-6">
      {modes.map(mode => (
        <div key={mode.label} className="flex-1 rounded-xl overflow-hidden border border-gray-200" style={{ borderColor: mode.border }}>
          {/* Mini app chrome */}
          <div style={{ background: mode.surface, borderBottom: `1px solid ${mode.border}`, padding: '10px 14px' }}>
            <div className="flex items-center gap-2">
              <span style={{ fontFamily: 'inherit', fontWeight: 700, fontSize: 12, color: mode.accent }}>OULDS</span>
              <span style={{ fontSize: 10, color: mode.textMuted, fontFamily: 'monospace' }}>Token Reference</span>
            </div>
          </div>
          {/* Mini card */}
          <div style={{ background: mode.bg, padding: 14 }}>
            <div style={{ background: mode.surface, borderRadius: 8, border: `1px solid ${mode.border}`, padding: 12 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: mode.text, marginBottom: 4 }}>Color token</p>
              <code style={{ fontSize: 10, color: mode.accent, fontFamily: 'monospace' }}>light.text.primary</code>
              <p style={{ fontSize: 10, color: mode.textMuted, fontFamily: 'monospace', marginTop: 2 }}>
                → {mode.label === 'Light mode' ? '#374151' : '#f3f4f6'}
              </p>
              <div style={{ marginTop: 10 }}>
                <span style={{
                  display: 'inline-block',
                  background: mode.accent,
                  color: mode.accentFg,
                  fontSize: 10,
                  fontWeight: 600,
                  padding: '4px 10px',
                  borderRadius: 6,
                }}>
                  Primary button
                </span>
              </div>
            </div>
          </div>
          {/* Label */}
          <div style={{ background: mode.surface, padding: '6px 14px', borderTop: `1px solid ${mode.border}` }}>
            <p style={{ fontSize: 10, color: mode.textMuted, fontFamily: 'monospace' }}>{mode.label}</p>
          </div>
        </div>
      ))}
      {/* Token stays the same callout */}
      <div className={`hidden sm:flex flex-col justify-center px-2 text-center`}>
        <svg width="24" height="40" viewBox="0 0 24 40">
          <line x1="12" y1="0" x2="12" y2="40" stroke={darkMode ? '#374151' : '#d1d5db'} strokeWidth="1.5" strokeDasharray="3 3" />
        </svg>
      </div>
    </div>
  )
}

// ─── Token anatomy ────────────────────────────────────────────────────────────
function TokenAnatomy({ darkMode }: { darkMode: boolean }) {
  const parts = [
    { text: 'light', color: darkMode ? '#818cf8' : '#6366f1', label: 'Theme', desc: 'Which theme this token belongs to (light or dark)' },
    { text: '.', color: darkMode ? '#4b5563' : '#d1d5db', label: '', desc: '' },
    { text: 'text', color: darkMode ? '#34d399' : '#059669', label: 'Category', desc: 'The UI property this affects — text, bg, border, interactive…' },
    { text: '.', color: darkMode ? '#4b5563' : '#d1d5db', label: '', desc: '' },
    { text: 'primary', color: darkMode ? '#f59e0b' : '#d97706', label: 'Role', desc: 'The specific use case within that category' },
  ]

  return (
    <div className={`mt-6 rounded-xl border p-6 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
      {/* Token name display */}
      <div className="flex items-baseline gap-0 font-mono text-2xl font-bold mb-8 flex-wrap">
        {parts.map((p, i) => (
          <span key={i} style={{ color: p.color }}>{p.text}</span>
        ))}
      </div>

      {/* Labels */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {parts
          .filter(p => p.label)
          .map((p, i) => (
            <div key={i} className={`rounded-lg border p-4 ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full"
                  style={{ background: p.color }}
                />
                <span className="font-mono text-xs font-semibold" style={{ color: p.color }}>
                  {p.label}
                </span>
              </div>
              <code className="font-mono text-sm block mb-1" style={{ color: p.color }}>
                "{p.text}"
              </code>
              <p className={`text-xs font-body leading-relaxed ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                {p.desc}
              </p>
            </div>
          ))}
      </div>

      {/* Component token example */}
      <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
        <p className={`text-xs font-body mb-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          Component tokens follow a similar pattern:
        </p>
        <div className="flex items-baseline gap-0 font-mono text-lg font-bold flex-wrap">
          <span style={{ color: darkMode ? '#818cf8' : '#6366f1' }}>button</span>
          <span style={{ color: darkMode ? '#4b5563' : '#d1d5db' }}>.</span>
          <span style={{ color: darkMode ? '#34d399' : '#059669' }}>height</span>
          <span style={{ color: darkMode ? '#4b5563' : '#d1d5db' }}>.</span>
          <span style={{ color: darkMode ? '#f59e0b' : '#d97706' }}>md</span>
        </div>
        <p className={`text-xs font-body mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          Component · Property · Size variant
        </p>
      </div>
    </div>
  )
}

// ─── Why it matters cards ─────────────────────────────────────────────────────
function BenefitCard({
  icon,
  title,
  body,
  darkMode,
}: {
  icon: string
  title: string
  body: string
  darkMode: boolean
}) {
  return (
    <div
      className={`rounded-xl border p-5 ${
        darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
      }`}
    >
      <span className="text-2xl block mb-3">{icon}</span>
      <p className="font-display font-semibold text-sm mb-2">{title}</p>
      <p className={`text-xs font-body leading-relaxed ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
        {body}
      </p>
    </div>
  )
}

// ─── Category overview cards ──────────────────────────────────────────────────
function CategoryCard({
  title,
  examples,
  preview,
  darkMode,
}: {
  title: string
  examples: string[]
  preview: React.ReactNode
  darkMode: boolean
}) {
  return (
    <div className={`rounded-xl border p-5 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
      <div className="mb-4">{preview}</div>
      <p className="font-display font-semibold text-sm mb-2">{title}</p>
      <div className="flex flex-col gap-1">
        {examples.map(e => (
          <code key={e} className={`text-xs font-mono ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            {e}
          </code>
        ))}
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export function GuideTab({ darkMode, onNavigate }: Props) {
  const divider = <div className={`border-t mb-16 ${darkMode ? 'border-gray-800' : 'border-gray-100'}`} />

  return (
    <div className="max-w-3xl">

      {/* ── Hero ── */}
      <Section>
        <SectionLabel darkMode={darkMode}>Design tokens explained</SectionLabel>
        <SectionHeading>What are design tokens?</SectionHeading>
        <Body darkMode={darkMode}>
          A design token is simply a <strong>named design decision</strong>. Instead of hard-coding a hex value like{' '}
          <TokenChip darkMode={darkMode}>#005999</TokenChip> into a button, you reference a token like{' '}
          <TokenChip darkMode={darkMode}>interactive.primary</TokenChip>. The token carries the value, the context, and
          the meaning — all in one place.
        </Body>
        <Body darkMode={darkMode} className="mt-3">
          The One UL Design System uses tokens for every visual decision: colors, spacing, typography, border radius,
          shadows, animation, and more. When a value needs to change — say, the brand blue shifts slightly — it changes
          once in the token, and every product that uses OULDS updates automatically.
        </Body>
      </Section>

      {divider}

      {/* ── Three tiers ── */}
      <Section>
        <SectionLabel darkMode={darkMode}>Architecture</SectionLabel>
        <SectionHeading>The three layers of OULDS tokens</SectionHeading>
        <Body darkMode={darkMode}>
          OULDS organizes tokens into three layers. Each layer builds on the one before it, adding more context and
          purpose. Think of it like going from ingredients → recipe → finished dish.
        </Body>
        <TierDiagram darkMode={darkMode} />

        <div className={`mt-6 rounded-xl p-5 border-l-4 ${darkMode ? 'bg-gray-900 border-blue-600' : 'bg-blue-50 border-blue-500'}`}>
          <p className={`text-sm font-body leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <strong>The golden rule:</strong> always use the most specific token for your situation. Reach for a{' '}
            <em>component</em> token first, then a <em>semantic</em> token, and only use a <em>primitive</em> if no
            semantic equivalent exists. This keeps theming consistent.
          </p>
        </div>
      </Section>

      {divider}

      {/* ── Themes ── */}
      <Section>
        <SectionLabel darkMode={darkMode}>Themes</SectionLabel>
        <SectionHeading>One token, every theme</SectionHeading>
        <Body darkMode={darkMode}>
          A <strong>theme</strong> is a set of token values tuned for a specific look — light mode, dark mode, high
          contrast, and so on. Because all UI components reference tokens rather than raw values, switching themes
          requires zero code changes in the product; you just swap which token set is active.
        </Body>
        <Body darkMode={darkMode} className="mt-3">
          The token name <TokenChip darkMode={darkMode}>light.text.primary</TokenChip> resolves to{' '}
          <TokenChip darkMode={darkMode}>#374151</TokenChip> in light mode and{' '}
          <TokenChip darkMode={darkMode}>#f3f4f6</TokenChip> in dark mode. The component asks for "primary text color"
          — OULDS handles the rest.
        </Body>
        <ThemeDemo darkMode={darkMode} />
      </Section>

      {divider}

      {/* ── Token name anatomy ── */}
      <Section>
        <SectionLabel darkMode={darkMode}>Reading tokens</SectionLabel>
        <SectionHeading>How to read a token name</SectionHeading>
        <Body darkMode={darkMode}>
          Token names describe <em>how</em> a value should be used, not what color or number it happens to be. Each
          segment of the name narrows the intent. Once you learn the pattern, the right token for any situation becomes
          obvious.
        </Body>
        <TokenAnatomy darkMode={darkMode} />
      </Section>

      {divider}

      {/* ── Token categories ── */}
      <Section>
        <SectionLabel darkMode={darkMode}>What's in OULDS</SectionLabel>
        <SectionHeading>Token categories at a glance</SectionHeading>
        <Body darkMode={darkMode}>
          OULDS ships tokens across seven categories. Each one replaces a class of hard-coded values that designers and
          developers previously managed manually.
        </Body>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
          <CategoryCard
            darkMode={darkMode}
            title="color"
            examples={['color.blue.600', 'light.text.primary', 'light.bg.canvas']}
            preview={
              <div className="flex gap-1.5">
                {['#005999','#057A5E','#D14F3E','#E07B28','#2DA04C'].map(c => (
                  <span key={c} className="block w-5 h-5 rounded-full" style={{ background: c }} />
                ))}
              </div>
            }
          />
          <CategoryCard
            darkMode={darkMode}
            title="Spacing"
            examples={['spacing.4 → 16px', 'spacing.8 → 32px', 'spacing.0 → 0px']}
            preview={
              <div className="flex items-end gap-1.5">
                {[4, 8, 12, 16, 24].map(s => (
                  <span key={s} className="block rounded-sm" style={{ width: s / 3, height: s / 3, background: '#005999', opacity: 0.7 }} />
                ))}
              </div>
            }
          />
          <CategoryCard
            darkMode={darkMode}
            title="Typography"
            examples={['fontSize.base → 16px', 'fontWeight.bold → 700', 'lineHeight.normal']}
            preview={
              <div className="flex flex-col gap-0.5">
                <span style={{ fontSize: 18, fontWeight: 700, lineHeight: 1, color: darkMode ? '#f3f4f6' : '#111827', fontFamily: 'Syne, sans-serif' }}>Aa</span>
                <span style={{ fontSize: 12, fontWeight: 400, color: darkMode ? '#9ca3af' : '#6b7280', fontFamily: 'DM Sans, sans-serif' }}>Aa</span>
              </div>
            }
          />
          <CategoryCard
            darkMode={darkMode}
            title="Border"
            examples={['radius.md → 8px', 'borderWidth.1 → 1px', 'border.default']}
            preview={
              <div className="flex gap-2">
                {[2, 6, 12, 9999].map(r => (
                  <span key={r} className="block w-6 h-6 border-2" style={{ borderRadius: r, borderColor: '#005999' }} />
                ))}
              </div>
            }
          />
          <CategoryCard
            darkMode={darkMode}
            title="Motion"
            examples={['duration.200 → 200ms', 'easing.ease-out', 'motion.enter']}
            preview={
              <div className="flex items-center gap-2">
                <span className="block w-3 h-3 rounded-full" style={{ background: '#005999' }} />
                <span style={{ fontSize: 10, color: darkMode ? '#4b5563' : '#9ca3af', fontFamily: 'monospace' }}>→ 200ms</span>
                <span className="block w-3 h-3 rounded-full" style={{ background: '#005999', opacity: 0.3 }} />
              </div>
            }
          />
          <CategoryCard
            darkMode={darkMode}
            title="Elevation"
            examples={['elevation.raised', 'elevation.overlay', 'elevation.dialog']}
            preview={
              <div className="relative w-10 h-8">
                <span className="absolute block w-7 h-6 rounded" style={{ background: darkMode ? '#1f2937' : '#f9fafb', border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', left: 0, top: 4 }} />
                <span className="absolute block w-7 h-6 rounded" style={{ background: darkMode ? '#111827' : '#ffffff', border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`, boxShadow: '0 4px 12px rgba(0,0,0,0.15)', left: 5, top: 0 }} />
              </div>
            }
          />
        </div>
      </Section>

      {divider}

      {/* ── Why it matters ── */}
      <Section>
        <SectionLabel darkMode={darkMode}>Benefits</SectionLabel>
        <SectionHeading>Why this matters for UL products</SectionHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          <BenefitCard
            darkMode={darkMode}
            icon="🔄"
            title="Change once, update everywhere"
            body="When the UL brand evolves, a single token value change propagates across every product, every screen, and every component automatically."
          />
          <BenefitCard
            darkMode={darkMode}
            icon="🌗"
            title="Dark mode and theming for free"
            body="Because products use tokens rather than hex values, dark mode, high-contrast, and future color themes require no per-product engineering work."
          />
          <BenefitCard
            darkMode={darkMode}
            icon="🤝"
            title="Shared language across teams"
            body="Designers and engineers use the same token names. Handoff is faster, conversations are clearer, and there's no ambiguity about which blue to use."
          />
          <BenefitCard
            darkMode={darkMode}
            icon="♿"
            title="Accessibility by default"
            body="Semantic tokens are designed with contrast ratios baked in. Using the right token for a purpose means meeting WCAG standards without extra effort."
          />
        </div>
      </Section>

      {divider}

      {/* ── CTA ── */}
      <Section>
        <SectionLabel darkMode={darkMode}>Explore</SectionLabel>
        <SectionHeading>Ready to dive in?</SectionHeading>
        <Body darkMode={darkMode}>
          Use the tabs above to explore all OULDS tokens. Start with{' '}
          <strong>Primitives</strong> to see the raw color scales and spacing values, then move to{' '}
          <strong>Semantic</strong> to understand how those primitives are named for purpose.
        </Body>

        <div className="flex flex-wrap gap-3 mt-6">
          <button
            onClick={() => onNavigate('primitives')}
            className="px-5 py-2.5 rounded-lg text-sm font-body font-semibold text-white transition-colors"
            style={{ background: '#005999' }}
            onMouseOver={e => (e.currentTarget.style.background = '#004d87')}
            onMouseOut={e => (e.currentTarget.style.background = '#005999')}
          >
            Browse Primitives →
          </button>
          <button
            onClick={() => onNavigate('semantic')}
            className={`px-5 py-2.5 rounded-lg text-sm font-body font-semibold transition-colors border ${
              darkMode
                ? 'border-gray-700 text-gray-200 hover:bg-gray-800'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Browse Semantic tokens →
          </button>
          <button
            onClick={() => onNavigate('components')}
            className={`px-5 py-2.5 rounded-lg text-sm font-body font-semibold transition-colors border ${
              darkMode
                ? 'border-gray-700 text-gray-200 hover:bg-gray-800'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Browse Component tokens →
          </button>
        </div>
      </Section>

    </div>
  )
}
