# Developer Onboarding — OULDS Design System v4

**Welcome, Connor!** This document will bring you up to speed on the OULDS design system modernization project — what it is, why it exists, how it's built, and what work has been done so far. Read this end to end before diving into the code.

---

## Table of Contents

1. [What is this project?](#1-what-is-this-project)
2. [Why are we rebuilding?](#2-why-are-we-rebuilding)
3. [Architecture overview](#3-architecture-overview)
4. [Repository structure](#4-repository-structure)
5. [Getting started locally](#5-getting-started-locally)
6. [The 3-tier token system](#6-the-3-tier-token-system)
7. [Token files explained](#7-token-files-explained)
8. [Token pipeline (Figma → Code)](#8-token-pipeline-figma--code)
9. [The docs app (Token Reference)](#9-the-docs-app-token-reference)
10. [Figma integration (MCP)](#10-figma-integration-mcp)
11. [Work completed so far (timeline)](#11-work-completed-so-far-timeline)
12. [Current state of each component](#12-current-state-of-each-component)
13. [Key design decisions](#13-key-design-decisions)
14. [What's next](#14-whats-next)
15. [Important files to know](#15-important-files-to-know)
16. [Common tasks](#16-common-tasks)
17. [Gotchas and lessons learned](#17-gotchas-and-lessons-learned)

---

## 1. What is this project?

OULDS (the design system) is used across products at the organization. **v3** was the previous version — built with Stencil Web Components and a 2-tier token system. **v4** is a ground-up modernization that keeps Stencil but rebuilds everything else on a stronger foundation.

The goal: a design system where Figma designs and code stay in sync, tokens flow through a clean 3-tier architecture, and any framework team (React, Vue, Angular) can consume the components.

**GitHub repo:** https://github.com/Jamonte-UL/OULDS-v4-1

---

## 2. Why are we rebuilding?

The v3 system had three structural problems:

1. **Figma and code were disconnected.** Designers worked in Figma, developers worked in code, and the two drifted apart constantly.
2. **2-tier tokens couldn't scale.** Without a semantic layer, there was no clean way to support theming, dark mode, or brand variants.
3. **Framework coupling.** It was harder than it should have been for teams on different stacks to adopt the system.

v4 solves all three.

---

## 3. Architecture overview

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Tokens** | W3C DTCG JSON + Style Dictionary v4 | Design values (colors, spacing, typography, etc.) |
| **Components** | Stencil v4 Web Components | Framework-agnostic UI components |
| **Wrappers** | Stencil output targets | Auto-generated React, Vue, Angular bindings |
| **Docs** | Storybook 8 + Vite | Component documentation and playground |
| **Token reference** | React + Vite + Tailwind | Live token browser with visual previews |
| **Monorepo** | pnpm workspaces + Turborepo | Build orchestration and dependency management |
| **Versioning** | Changesets | Independent per-package versioning |

### Build order

Turborepo handles this automatically, but it's worth understanding:

```
tokens → components → react/vue/angular wrappers → storybook/docs
```

---

## 4. Repository structure

```
OULDS-v4/
├── apps/
│   ├── docs/              # Token reference app (React + Vite + Tailwind)
│   │   ├── src/
│   │   │   ├── App.tsx            # Main shell — header, tabs, search, dark mode
│   │   │   ├── tokens.ts          # Token utilities (flattenTokens, resolveAlias, etc.)
│   │   │   ├── changelog.ts       # Changelog release data
│   │   │   └── tabs/              # One file per tab
│   │   │       ├── PrimitivesTab.tsx
│   │   │       ├── SemanticTab.tsx
│   │   │       ├── ComponentsTab.tsx   # ← Has live button preview grid
│   │   │       ├── GuideTab.tsx
│   │   │       └── ChangelogTab.tsx
│   │   └── button-showcase.html   # Standalone HTML — visual comparison with Figma
│   └── storybook/         # Storybook 8 (empty — no stories yet)
│
├── packages/
│   ├── tokens/            # DTCG JSON sources + Style Dictionary config
│   │   ├── src/
│   │   │   ├── primitive.json         # Raw values (colors, spacing, shadows, etc.)
│   │   │   ├── semantic/
│   │   │   │   ├── light.json         # Light mode semantic aliases
│   │   │   │   └── dark.json          # Dark mode semantic aliases
│   │   │   └── component.json         # Component-scoped tokens (button, input, etc.)
│   │   ├── scripts/
│   │   │   └── export-figma.ts        # Figma Variables API export script
│   │   └── style-dictionary.config.js # SD v4 config — transforms + outputs
│   │
│   ├── components/        # Stencil Web Components source
│   ├── react/             # Auto-generated React wrappers
│   ├── vue/               # Auto-generated Vue wrappers
│   └── angular/           # Auto-generated Angular wrappers
│
├── docs/                  # Project documentation
│   ├── executive-summary-2026-03-26.md
│   ├── critical-work.md
│   ├── next-steps.md
│   ├── figma-mcp-setup-guide.md
│   ├── requirements-to-specs-workflow.md
│   └── journal/           # Session journals (chronological work log)
│
├── CLAUDE.md              # AI assistant context file
├── turbo.json             # Turborepo task config
├── pnpm-workspace.yaml    # Workspace package definitions
└── package.json           # Root package — scripts, engines
```

---

## 5. Getting started locally

### Prerequisites

- **Node.js ≥ 18**
- **pnpm ≥ 9** — install with `npm install -g pnpm`

### Setup

```bash
# Clone the repo
git clone https://github.com/Jamonte-UL/OULDS-v4-1.git
cd OULDS-v4-1

# Install all dependencies
pnpm install

# Build everything (tokens → components → wrappers)
pnpm build
```

### Run the token reference app

```bash
cd apps/docs
pnpm dev
```

Opens in your browser (usually `http://localhost:5173`). This is where you can see all tokens visualized with live previews.

### Build the token reference app for production

```bash
cd apps/docs
pnpm build
# Output is in apps/docs/dist/
```

To serve the production build locally:

```bash
cd apps/docs
npx serve dist
# Serves on http://localhost:3000
```

> **Note:** `npx serve dist` locks the `dist/` folder. You must stop it (Ctrl+C) before rebuilding.

---

## 6. The 3-tier token system

This is the most important concept to understand. Every design value in the system flows through three tiers:

```
Primitive  →  Semantic  →  Component
(raw value)   (intent)     (usage)
```

### Tier 1: Primitive

Raw, context-free values. These never change between themes.

```json
"color": {
  "blue": {
    "600": { "$type": "color", "$value": "#2563eb" }
  }
}
```

### Tier 2: Semantic

Intent-based aliases that point to primitives. **These change between themes** (light/dark).

```json
"interactive": {
  "primary": { "$type": "color", "$value": "{color.blue.600}" }
}
```

In dark mode, `interactive.primary` might point to `color.blue.400` instead.

### Tier 3: Component

Component-specific tokens that point to semantic tokens. These describe exactly how a specific component uses a value.

```json
"button": {
  "primary": {
    "bg": { "$type": "color", "$value": "{interactive.primary}" }
  }
}
```

### Why this matters

- Change a primitive → all semantic and component tokens that reference it update automatically.
- Switch from light to dark mode → only swap the semantic layer. Components don't change.
- Add a new brand theme → create a new semantic file. Primitives and components stay the same.

### The alias chain in practice

```
button.primary.bg
  → {interactive.primary}        (component.json → semantic)
    → {color.blue.600}           (semantic/light.json → primitive)
      → #2563eb                  (primitive.json → final value)
```

---

## 7. Token files explained

All token files use the **W3C Design Tokens Community Group (DTCG)** format. Every token has a `$type` and `$value`. Aliases use curly-brace syntax: `"{token.path}"`.

### `packages/tokens/src/primitive.json`

~238 raw values organized by category:

| Category | Examples |
|----------|---------|
| `color.*` | 11-step scales (50–950) for gray, blue, green, red, orange, yellow, purple, teal, pink |
| `color.transparent` | `#00000000` |
| `spacing.*` | 0–96 scale (px values) |
| `borderRadius.*` | none, sm, md, lg, xl, 2xl, 3xl, full |
| `fontSize.*` | xs through 9xl |
| `fontWeight.*` | thin through black |
| `fontFamily.*` | sans, serif, mono |
| `lineHeight.*` | none through loose |
| `shadow.*` | none, xs, sm, md, lg, xl, 2xl, inner |
| `zIndex.*` | 0–50 scale |
| `opacity.*` | 0, 5, 10, 20, ... 100 |
| `duration.*` | 75ms through 1000ms |
| `easing.*` | linear, in, out, in-out |
| `borderWidth.*` | 0–8 scale |

### `packages/tokens/src/semantic/light.json` and `dark.json`

~276 semantic tokens per mode, organized by intent:

| Group | Description |
|-------|-------------|
| `text.*` | primary, secondary, muted, disabled, inverse, link, error, success, warning |
| `bg.*` | canvas, surface, muted, inverse, overlay, hover states |
| `border.*` | default, muted, strong, focus, error, success |
| `interactive.*` | primary, secondary, destructive, ghost, success, warning + hover/active/disabled states |
| `status.*` | info, success, warning, error backgrounds |
| `chart.*` | Data visualization palette (10-series + sentiment) |
| `typography.*` | Font families, sizes, weights, line-heights |
| `elevation.*` | raised, floating, overlay, dialog shadow values |
| `motion.*` | Named duration/easing intents |
| `focus-ring-color` | The blue ring shown on focused interactive elements |

### `packages/tokens/src/component.json`

~55+ component-specific tokens:

| Component | Tokens | Pattern |
|-----------|--------|---------|
| `button.primary` | bg, bg-hover, bg-active, bg-disabled, text, text-disabled, border, border-hover, border-disabled |
| `button.secondary` | Same 9 tokens |
| `button.destructive` | Same 9 tokens |
| `button.ghost` | Same 9 tokens |
| `button.success` | Same 9 tokens |
| `button.warning` | Same 9 tokens |
| `input.*` | bg, border, text, placeholder, focus-border, error-border, disabled-bg |
| `card.*` | bg, border, shadow |
| `modal.*` | bg, overlay, shadow |
| `avatar.*` | bg, text, border |
| `badge.*` | bg, text |
| `icon.*` | primary, secondary, disabled |

---

## 8. Token pipeline (Figma → Code)

Tokens live in two places that must stay in sync:

```
Figma Variables  ←→  Token JSON files  →  Style Dictionary  →  CSS/JS output
```

### Direction 1: Figma → Code

The Figma file contains all tokens as Figma Variables organized into three collections: `Primitive`, `Semantic`, and `Component`. When tokens are updated in Figma:

1. Run the export script: `npx tsx packages/tokens/scripts/export-figma.ts`
2. Review the diff in `packages/tokens/src/`
3. Commit the changes

### Direction 2: Code → Figma

When tokens are added or changed in the JSON files, they need to be imported into Figma. This is done via **Tokens Studio** (Figma plugin):

1. Open the Figma file
2. Open Tokens Studio plugin
3. Create/update the token set with the new JSON
4. Run "Export styles & variables to Figma"

> **Important:** Tokens Studio Free does not export Effect Styles (shadows) or Text Styles. Those must be created manually in Figma or require Tokens Studio Pro.

### Style Dictionary build

```bash
cd packages/tokens
pnpm build
```

This runs `style-dictionary build` which:
- Reads the three source JSON files
- Resolves all alias references
- Outputs `dist/tokens.css` (CSS custom properties) and `dist/tokens.js` (JS module)

The config is in `packages/tokens/style-dictionary.config.js`. It includes a custom `color/css/hex` transform that handles both string hex values and Figma's verbose color objects.

---

## 9. The docs app (Token Reference)

**Location:** `apps/docs/`
**Stack:** Vite 5 + React 18 + TypeScript + Tailwind CSS

This is a single-page app that reads directly from the token JSON files and renders them as browsable, searchable documentation. It has five tabs:

| Tab | What it shows | Who it's for |
|-----|--------------|--------------|
| **Guide** | Plain-English explainer of the token system | Non-technical stakeholders |
| **Primitives** | Raw values with visual previews (color swatches, spacing squares, etc.) | Designers & developers |
| **Semantic** | Light/dark columns showing alias chains and resolved values | Designers & developers |
| **Components** | Token tables + live button preview grid (6 variants × 5 states) | Developers |
| **Changelog** | Versioned history of token changes | Everyone |

### Key technical details

- **Single source of truth** — imports token JSON directly via a Vite alias (`@tokens` → `packages/tokens/src/`). No manual documentation to maintain.
- **Dark mode** — Tailwind `darkMode: 'class'`, toggled from the header.
- **Search** — filters across all token names, values, and categories in every tab.
- **Live button preview** — `ComponentsTab.tsx` resolves token aliases at runtime and renders actual styled buttons in all states.

### The button showcase

There's also a standalone file at `apps/docs/button-showcase.html` — a pure HTML page with hardcoded resolved values that shows all 6 button variants × 5 states in both light and dark mode. Useful for visual comparison with Figma without needing a dev server.

---

## 10. Figma integration (MCP)

We use **MCP (Model Context Protocol)** to connect VS Code (via GitHub Copilot) directly to Figma for programmatic reads and writes. This is how we built button variants, created variables, and bound tokens — all from VS Code.

### The Figma file

**URL:** `https://www.figma.com/design/wqh88OOJ3JRPrkLAjeWHhS/OULDS-Tokens`
**File key:** `wqh88OOJ3JRPrkLAjeWHhS`

### Three MCP servers

| Server | Purpose | How it works |
|--------|---------|-------------|
| `figmaDesktop` | **Read-only** access to Figma | Connects to Figma desktop app on port 3845 |
| `figma` (official) | **Read/write** via Plugin API (`use_figma`) | OAuth authentication through VS Code |
| `TalkToFigma` | Alternative write path | WebSocket + Figma plugin |

### Setup summary

Full setup instructions are in `docs/figma-mcp-setup-guide.md`. The short version:

1. Add the three servers to your VS Code `mcp.json`
2. Reload VS Code
3. Sign in to Figma when prompted (OAuth for the official MCP)
4. Install the Figma skills under `.agents/skills/` (especially `figma-use/SKILL.md` — mandatory before any write operation)

### What `use_figma` does

`use_figma` executes JavaScript against the Figma Plugin API inside your Figma file. You can:

- Create and edit nodes (frames, rectangles, text)
- Create and bind variables
- Build component variants
- Set fills, strokes, auto-layout properties

Example — binding a variable to a node's fill:
```js
const node = figma.getNodeById("39:4");
const variable = figma.variables.getLocalVariables().find(v => v.name === "button/primary/bg");
const base = { type: 'SOLID', color: { r: 0, g: 0, b: 0 } };
const boundPaint = figma.variables.setBoundVariableForPaint(base, 'color', variable);
node.fills = [boundPaint];
return { mutatedNodeIds: [node.id] };
```

> **Critical rule:** `setBoundVariableForPaint` returns a **new** paint object — you must reassign it. `console.log` is invisible — always `return` data.

---

## 11. Work completed so far (timeline)

### 26 March 2026 — Project kickoff

- All architecture decisions finalized (see table in `CLAUDE.md`)
- Full monorepo scaffolded: tokens, components, wrappers, storybook, docs
- Two AI skills created: `/ds-interview` (architecture planning) and `/ds-audit` (codebase audit)
- Executive summary written for stakeholders

### 15 April 2026 — Token system overhaul

- **Problem found:** Token files exported from Figma had hardcoded hex values instead of alias references. The 3-tier chain was broken.
- **Fix:** Rewrote all three token files to proper W3C DTCG format with alias references
- Imported via Tokens Studio → 569 variables live in Figma with working alias chain
- Added missing token groups: typography (11 tokens), elevation (4), motion (7)
- Audit confirmed: system meets modern enterprise design system standards

### 16 April 2026 — Token reference app built

- Designed and built the full docs app (`apps/docs/`)
- Five tabs: Guide, Primitives, Semantic, Components, Changelog
- Live dark mode, search, copy-to-clipboard
- Initially deployed to Vercel (later removed — see below)

### 17 April 2026 — Button design decisions

- Created `button-demo.html` — interactive design review page for button variants
- **Key decision:** Secondary button uses Atlassian-style transparent background (not filled gray)
- Updated semantic tokens (`interactive.secondary` → `transparent`, etc.)
- Added `text/disabled` as a new semantic token
- Built Secondary button states (Default, Hover, Active, Disabled) in Figma with variable bindings

### 20 April 2026 — Button audit, new variants, cleanup

- **Figma button audit:** Found and fixed 5 color inconsistencies across Primary, Secondary, Destructive variants
- Renamed 10 Figma variant nodes for naming consistency
- Added missing Secondary focus variant in Figma
- Fixed focus state rendering in the docs app — uses `box-shadow` ring instead of replacing the border
- Fixed `text-disabled` tokens for Primary and Destructive buttons
- **Added Success and Warning button variants** across all surfaces:
  - 6 new semantic tokens (`interactive.success/warning` + hover/active) in both light and dark
  - 18 new component tokens (`button.success.*` and `button.warning.*`)
  - Updated ComponentsTab.tsx with all 6 variants
  - Created button-showcase.html with all 6 variants
  - Built 10 new Figma variant nodes with variable bindings
- Removed Vercel deployment files (deployment target is Azure, not Vercel)
- Added README.md

---

## 12. Current state of each component

### Button (most developed)

**6 variants:** Primary, Secondary, Destructive, Ghost, Success, Warning
**5 states each:** Default, Hover, Active, Disabled, Focus

- ✅ All token aliases defined in `component.json`
- ✅ All semantic tokens in `light.json` and `dark.json`
- ✅ All 30 states visible in the docs app (`ComponentsTab.tsx`)
- ✅ All 30 states built in Figma with variable bindings
- ✅ Focus state uses `box-shadow: 0 0 0 2px #fff, 0 0 0 4px <focus-ring-color>` pattern

### Other components (tokens defined, no Stencil implementation yet)

| Component | Tokens defined | Figma built | Stencil component |
|-----------|:-:|:-:|:-:|
| Input | ✅ | ❌ | ❌ |
| Card | ✅ | ❌ | ❌ |
| Modal | ✅ | ❌ | ❌ |
| Avatar | ✅ | ❌ | ❌ |
| Badge | ✅ | ❌ | ❌ |
| Icon | ✅ | ❌ | ❌ |

---

## 13. Key design decisions

These decisions have been made and shouldn't be revisited without good reason:

| Decision | Choice | Why |
|----------|--------|-----|
| Token format | W3C DTCG JSON | Industry standard, best long-term compatibility |
| 3-tier tokens | Primitive → Semantic → Component | Enables theming, dark mode, brand variants |
| Secondary button style | Transparent (Atlassian-style) | Clear visual hierarchy — Primary dominant, Secondary recedes |
| Secondary disabled bg | Transparent (not gray fill) | Consistent with default transparent state |
| Disabled text color | `text.disabled` → `color.gray.400` | Dedicated semantic token, not reusing `text.muted` |
| Focus ring | `box-shadow` (not `outline`) | Preserves the button's own border while adding the ring |
| Focus ring pattern | `0 0 0 2px #fff, 0 0 0 4px <ring-color>` | White gap between element and ring for visibility |
| Framework | Stencil (continuing from v3) | Framework-agnostic Web Components |
| Monorepo | pnpm + Turborepo | Fast, strict dependency isolation |
| Deployment target | Azure Static Web Apps | Organization infrastructure (not Vercel) |

---

## 14. What's next

These are the priorities going forward, roughly in order:

### High priority

1. **Build the first Stencil component (`ou-button`)** — Apply component tokens to a real Web Component. This validates the full pipeline: tokens → Stencil → wrapper generation → Storybook rendering.

2. **Add component tokens incrementally** — As each new component is built in Stencil, add its token group to `component.json`. Candidates: checkbox, radio, select, table, tabs, alert, progress, spinner.

3. **Set up CI/CD** — GitHub Actions workflow to run `pnpm build` on PRs and fail if Style Dictionary or Stencil errors. Auto-deploy docs to Azure on `main`.

### Medium priority

4. **High-contrast mode** — Add a `high-contrast` key to the semantic layer. The structure already supports this.

5. **Test framework wrappers** — Build a small test app in React, Vue, and Angular to verify the generated wrapper code works correctly.

6. **OULDS-3 migration plan** — Audit the v3 codebase, produce a prioritized migration plan using the strangler fig pattern.

### Lower priority

7. **Tokens Studio Pro** — Evaluate whether to upgrade for automatic Effect Style and Text Style export.

8. **Storybook stories** — Write stories for each component as they're built.

---

## 15. Important files to know

| File | Why it matters |
|------|----------------|
| `CLAUDE.md` | AI assistant context — architecture decisions, working rules, repo structure |
| `packages/tokens/src/primitive.json` | All raw design values |
| `packages/tokens/src/semantic/light.json` | Light theme semantic aliases (most edited file) |
| `packages/tokens/src/semantic/dark.json` | Dark theme — keep in sync with light |
| `packages/tokens/src/component.json` | Component-level token definitions |
| `packages/tokens/style-dictionary.config.js` | Style Dictionary transform config |
| `apps/docs/src/tabs/ComponentsTab.tsx` | The live button preview grid — most complex UI file |
| `apps/docs/button-showcase.html` | Standalone HTML for Figma comparison |
| `docs/figma-mcp-setup-guide.md` | How to set up the Figma ↔ VS Code MCP connection |
| `docs/critical-work.md` | Original priority task list |
| `turbo.json` | Turborepo build pipeline configuration |

---

## 16. Common tasks

### Add a new token

1. Add the raw value to `primitive.json` (if it doesn't exist)
2. Add the semantic alias to `semantic/light.json` and `dark.json`
3. Add the component token to `component.json` (if it's component-specific)
4. Run `cd packages/tokens && pnpm build` to verify Style Dictionary resolves it
5. Import into Figma via Tokens Studio

### Add a new button variant

1. Add semantic tokens: `interactive.<name>`, `interactive.<name>-hover`, `interactive.<name>-active` to both `light.json` and `dark.json`
2. Add 9 component tokens to `component.json` under `button.<name>`: `bg`, `bg-hover`, `bg-active`, `bg-disabled`, `text`, `text-disabled`, `border`, `border-hover`, `border-disabled`
3. Update `ComponentsTab.tsx` — add the variant to the variants array and add state entries
4. Update `button-showcase.html` — add a new row with resolved hex values
5. Build 5 Figma variant nodes (Default, Hover, Active, Disabled, Focus) with variable bindings

### Update a token value

1. Change the `$value` in the appropriate JSON file
2. Run `pnpm build` in `packages/tokens`
3. If the change affects Figma, update the variable in Figma (or re-import via Tokens Studio)
4. If the change affects the button showcase, update the hardcoded hex in `button-showcase.html`

### Run a full build

```bash
# From repo root
pnpm build
```

This runs Turborepo which builds tokens → components → wrappers in the correct order.

---

## 17. Gotchas and lessons learned

### Token format

- **Figma's Variables API exports verbose color objects**, not DTCG aliases. You must transform the output into proper `{alias.path}` references — never commit raw Figma export output directly.
- **Figma's native Import button doesn't understand DTCG aliases.** Use Tokens Studio for imports.
- **Token names are path-separated with `/` in Figma** (e.g., `button/primary/bg`) but with `.` in JSON (e.g., `button.primary.bg`).

### Figma MCP

- Always read the `figma-use/SKILL.md` skill before any `use_figma` call.
- `setBoundVariableForPaint` returns a **new** paint object — you must reassign `node.fills = [boundPaint]`.
- `console.log()` is invisible in `use_figma` — always `return` data.
- Load fonts before text operations: `await figma.loadFontAsync(...)`.
- Variable names are case-sensitive.

### Build and dev

- `npx serve dist` locks the `dist/` folder — stop it before rebuilding.
- The docs app Vite alias `@tokens` points to `../../packages/tokens/src` — if you move files, update `vite.config.ts`.
- `pnpm install` must be run from the repo root, not from individual packages.

### Design decisions

- The secondary button is intentionally transparent by default — this was a deliberate Atlassian-style choice, not a bug.
- Focus states use `box-shadow` (not CSS `outline`) so the button's own border is preserved.
- `text-disabled` is a separate semantic token from `text.muted` — muted is for de-emphasized content, disabled is for non-interactive elements.

---

## Questions?

Read the journal files in `docs/journal/` for detailed session-by-session context. Each one records what was done, what decisions were made, and what was deferred.

If you need to understand a specific architecture decision, check `CLAUDE.md` — it has the full decision table.

For Figma MCP setup, follow `docs/figma-mcp-setup-guide.md` step by step.

Good luck, and welcome to the team!
