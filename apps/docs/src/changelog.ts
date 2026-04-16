export type ChangeType = 'added' | 'changed' | 'deprecated' | 'removed' | 'fixed'

export interface ChangeEntry {
  token?: string
  description: string
  type: ChangeType
}

export interface ChangelogRelease {
  version: string
  date: string
  summary: string
  changes: ChangeEntry[]
}

export const changelog: ChangelogRelease[] = [
  {
    version: '0.1.0',
    date: '2026-04-16',
    summary: 'Initial release of the OULDS token system. Establishes the three-tier primitive → semantic → component architecture.',
    changes: [
      // Primitives
      { type: 'added', description: 'Color primitive scales: gray, red, brand-red, orange, green, teal, blue (11 steps each: 50–950)' },
      { type: 'added', description: 'Spacing scale: 0–96px in 14 steps' },
      { type: 'added', description: 'Radius scale: none, xs, sm, md, lg, xl, 2xl, full' },
      { type: 'added', description: 'Font family tokens: sans (Open Sans), serif (Georgia), mono (Roboto Mono), display/heading (Poppins)' },
      { type: 'added', description: 'Font size scale: xs (12px) through 7xl (72px)' },
      { type: 'added', description: 'Font weight tokens: light (300) through extrabold (800)' },
      { type: 'added', description: 'Line height tokens: none (100%) through loose (200%)' },
      { type: 'added', description: 'Letter spacing tokens: tighter (−5px) through widest (10px)' },
      { type: 'added', description: 'Border width tokens: 0, 1px, 2px, 4px' },
      { type: 'added', description: 'Opacity scale: 0–100 in 12 steps' },
      { type: 'added', description: 'Z-index scale: hide (−1) through tooltip (700)' },
      { type: 'added', description: 'Duration tokens: 0ms through 1000ms' },
      { type: 'added', description: 'Easing tokens: linear, ease, ease-in, ease-out, ease-in-out, sharp, bounce' },
      { type: 'added', description: 'Breakpoint tokens: xs (320px) through 2xl (1536px)' },
      // Semantic
      { type: 'added', token: 'light.text.*', description: 'Semantic text color tokens for light theme: primary, secondary, muted, inverse, link, success, warning, error, info' },
      { type: 'added', token: 'dark.text.*', description: 'Semantic text color tokens for dark theme' },
      { type: 'added', token: 'light.bg.*', description: 'Background tokens for light theme: canvas, surface, surface-elevated, muted, subtle, inverse, and status variants' },
      { type: 'added', token: 'dark.bg.*', description: 'Background tokens for dark theme' },
      { type: 'added', token: 'light.border.*', description: 'Border color tokens: default, muted, strong, inverse, focus, error, success, warning' },
      { type: 'added', token: 'light.interactive.*', description: 'Interactive state tokens: primary, secondary, destructive with hover/active/disabled variants' },
      { type: 'added', token: 'light.accent.*', description: 'Accent tokens: primary (blue.600), brand (brand-red.600), secondary (teal.600)' },
      { type: 'added', token: 'light.severity.*', description: 'Severity tokens: critical, high, medium, low — each with bg, border, text variants' },
      { type: 'added', token: 'light.chart.*', description: '40+ chart tokens covering series colors, sentiment, trend, status, performance, heatmap, diverging, threshold, and geographic scales' },
      { type: 'added', token: 'light.elevation.*', description: 'Elevation shadow tokens: raised, floating, overlay, dialog' },
      { type: 'added', token: 'light.motion.*', description: 'Motion tokens: enter/exit/expand/fade durations and easing aliases' },
      { type: 'added', token: 'light.typography.*', description: 'Typography semantic tokens: body-font, heading-font, mono-font, sizes, weights, line-height' },
      // Component
      { type: 'added', token: 'button.*', description: 'Button component tokens: radius, gap, padding-x/y (sm/md/lg), height (sm/md/lg), font-size (sm/md/lg)' },
      { type: 'added', token: 'input.*', description: 'Input component tokens: padding, font-size, radius, border-width, height variants' },
      { type: 'added', token: 'card.*', description: 'Card component tokens: radius, padding (sm/md/lg)' },
      { type: 'added', token: 'modal.*', description: 'Modal component tokens: padding, radius, width (sm/md/lg/xl)' },
      { type: 'added', token: 'icon.*', description: 'Icon size tokens: xs–xl' },
      { type: 'added', token: 'avatar.*', description: 'Avatar tokens: radius (full), size (xs–xl)' },
      { type: 'added', token: 'badge.*', description: 'Badge component tokens: padding, font-size, radius' },
    ],
  },
]
