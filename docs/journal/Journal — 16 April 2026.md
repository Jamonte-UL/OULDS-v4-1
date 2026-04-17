# Journal — 16 April 2026

## TL;DR

Built and deployed a full token reference web app (`apps/docs`) for the OULDS design system. The app is live at https://oulds-token-reference.vercel.app and serves as a single source of truth for all design token documentation — readable by designers, developers, and non-technical stakeholders alike.

---

## Session summary

Working session in VS Code with Claude Sonnet 4.6 to design, build, and deploy a token reference application inside the OULDS monorepo.

---

## What we built

A Vite + React + TypeScript single-page app at `apps/docs/` that reads directly from the three source token JSON files (`primitive.json`, `semantic.json`, `component.json`) and renders them as browsable, searchable documentation.

### App structure

| Tab | Audience | Description |
|---|---|---|
| **Guide** | Non-technical stakeholders | Plain-English explainer: what tokens are, the three-tier architecture, how themes work, how to read a token name, categories at a glance, and why it matters |
| **Primitives** | Designers & devs | All raw design values with live visual previews per category (colour swatches, spacing squares, typography samples, radius previews, motion curves, z-index diagrams, etc.) |
| **Semantic** | Designers & devs | Light/dark split columns showing token name, alias reference, and resolved hex for all 13 semantic categories |
| **Components** | Devs | Token tables for every UI component (button, input, card, modal, avatar, badge, icon) alongside live UI previews at multiple size variants |
| **Changelog** | All | Versioned history of token changes grouped by type (added, changed, fixed, deprecated, removed), with searchable token name pills and a real token count from the source files |

### Key design decisions

- **Single source of truth** — The app imports the three token JSON files directly. There is no manual documentation to maintain. Any change to a token file in `packages/tokens/src/` is reflected on the next build and deploy.
- **Monorepo-native** — The app lives at `apps/docs/` inside the existing pnpm workspace. Turbo's existing `dev` and `build` tasks cover it automatically. No separate repository needed.
- **Dark mode** — Full dark mode support via Tailwind's `darkMode: 'class'` strategy, toggled from the header.
- **Search** — A single search input filters across all token names, values, descriptions, and categories in every tab.
- **Copy to clipboard** — Every token name has a copy button for developer convenience.

---

## Architecture & tech stack

| Layer | Choice |
|---|---|
| Framework | Vite 5.4 + React 18 + TypeScript |
| Styling | Tailwind CSS 3.4 with OULDS blue scale override |
| Fonts | Syne (display), DM Sans (body), DM Mono (mono) via Google Fonts |
| Token source | `@tokens` alias → `packages/tokens/src/` |
| Monorepo integration | pnpm workspace + Turbo (existing tasks) |
| Deployment | Vercel CLI (static deploy of `apps/docs/dist`) |

---

## Refinements made during the session

| Item | Change |
|---|---|
| Changelog tab | Created with versioned release data, type legend, and real token count derived from source files |
| Guide tab | Created as a non-technical explainer; moved to right-side header alongside Changelog |
| American spelling | Corrected "colour → color", "organises → organizes" throughout `GuideTab.tsx` |
| Header layout | Left nav: Primitives / Semantic / Components. Right nav: search → Guide → Changelog → dark mode toggle |
| Token count stat | Changed from hardcoded changelog entry count to a real count via `flattenTokens()` across all three source files |

---

## Deployment

The app was deployed directly to Vercel via the CLI without requiring a GitHub connection:

```
npx vercel deploy apps/docs/dist --prod
```

**Live URL:** https://oulds-token-reference.vercel.app

### Production deployment (next step)

The current Vercel deployment is for review and stakeholder sharing. The production target is **Microsoft Azure Static Web Apps**, hosted within UL's existing Azure infrastructure. This will require coordination with the platform/infrastructure team and involves:

1. Building `apps/docs` via the existing pnpm build command
2. Publishing the `apps/docs/dist` output to an Azure Static Web App resource
3. Setting up a CI/CD pipeline (Azure DevOps or GitHub Actions) to auto-deploy on pushes to `main`
4. Assigning an internal domain (e.g. `tokens.ux.ul.com`)

---

## Files added today

| File | Description |
|---|---|
| `apps/docs/package.json` | Package definition — React 18, Vite 5, Tailwind 3 |
| `apps/docs/vite.config.ts` | Vite config with `@tokens` alias to `packages/tokens/src/` |
| `apps/docs/tailwind.config.js` | Tailwind config with OULDS blue scale override |
| `apps/docs/tsconfig.json` | TypeScript config |
| `apps/docs/postcss.config.js` | PostCSS config for Tailwind |
| `apps/docs/index.html` | HTML entry point with Google Fonts |
| `apps/docs/public/favicon.svg` | OULDS favicon |
| `apps/docs/src/main.tsx` | React entry point |
| `apps/docs/src/index.css` | Tailwind base styles |
| `apps/docs/src/App.tsx` | Main shell — header, tabs, search, dark mode toggle |
| `apps/docs/src/tokens.ts` | Token utilities — `flattenTokens`, `resolveAlias`, `getColorScales` etc. |
| `apps/docs/src/icons.tsx` | Sun, Moon, Copy, Check SVG icons |
| `apps/docs/src/changelog.ts` | Changelog data — v0.1.0 release entries |
| `apps/docs/src/components/CopyButton.tsx` | Reusable copy-to-clipboard button |
| `apps/docs/src/tabs/PrimitivesTab.tsx` | Primitives tab with colour scales and per-category visual previews |
| `apps/docs/src/tabs/SemanticTab.tsx` | Semantic tab with light/dark split columns |
| `apps/docs/src/tabs/ComponentsTab.tsx` | Component tab with live UI previews and token tables |
| `apps/docs/src/tabs/ChangelogTab.tsx` | Changelog tab with versioned release blocks |
| `apps/docs/src/tabs/GuideTab.tsx` | Non-technical guide tab with explainer content |

---

## Commit

```
feat(docs): add token reference app with primitives, semantic, component, guide, and changelog tabs
64dc88a → Jamonte-UL/OULDS-v4-1 (main)
```
