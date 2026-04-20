# OULDS Design System v4

Enterprise design system modernization — a framework-agnostic rebuild with a 3-tier token architecture, Stencil Web Components, and a Figma-connected token pipeline.

## Architecture

### Token tiers

```
Primitive → Semantic → Component
```

Tokens are authored in W3C DTCG JSON format and transformed via Style Dictionary v4.

| Tier | File(s) | Description |
|------|---------|-------------|
| Primitive | `packages/tokens/src/primitive.json` | Raw values (colors, spacing, etc.) |
| Semantic | `packages/tokens/src/semantic/light.json`, `dark.json` | Contextual aliases (e.g. `interactive.primary`) |
| Component | `packages/tokens/src/component.json` | Component-scoped tokens (e.g. `button.primary.bg`) |

### Packages

| Package | Description |
|---------|-------------|
| `@oulds/tokens` | DTCG JSON sources + Style Dictionary config. Outputs CSS and JS. |
| `@oulds/components` | Stencil Web Components. Output targets: `dist-custom-elements` + `dist`. |
| `@oulds/react` | Auto-generated React wrappers (via Stencil output target) |
| `@oulds/vue` | Auto-generated Vue wrappers |
| `@oulds/angular` | Auto-generated Angular wrappers |

### Apps

| App | Description |
|-----|-------------|
| `apps/docs` | Token reference app — React + Vite + Tailwind. Live previews of primitives, semantic tokens, and component states. |
| `apps/storybook` | Storybook 8 + Vite — component documentation and interactive playground. |

## Getting started

**Prerequisites:** Node ≥ 18, pnpm ≥ 9

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run the token reference docs app
cd apps/docs
pnpm dev

# Run Storybook
cd apps/storybook
pnpm dev
```

### Build tokens only

```bash
cd packages/tokens
pnpm build
```

## Token pipeline

Tokens originate in Figma Variables and are exported via a custom script to the DTCG JSON source files. Style Dictionary then transforms them to CSS custom properties and JS modules.

```
Figma Variables → export script → packages/tokens/src/ → Style Dictionary → dist/
```

To re-export tokens from Figma, run:

```bash
cd packages/tokens
npx tsx scripts/export-figma.ts
```

## Monorepo structure

```
OULDS-v4/
├── apps/
│   ├── docs/          # Token reference app (React + Vite)
│   └── storybook/     # Component docs (Storybook 8)
├── packages/
│   ├── tokens/        # DTCG JSON + Style Dictionary config
│   ├── components/    # Stencil Web Components
│   ├── react/         # Generated React wrappers
│   ├── vue/           # Generated Vue wrappers
│   └── angular/       # Generated Angular wrappers
├── turbo.json
└── pnpm-workspace.yaml
```

## Tooling

| Tool | Purpose |
|------|---------|
| pnpm workspaces | Package management |
| Turborepo | Monorepo task orchestration |
| Style Dictionary v4 | Token transformation |
| Stencil v4 | Web Component authoring |
| Changesets | Versioning and changelog |

## Versioning

This repo uses [Changesets](https://github.com/changesets/changesets) for independent per-package versioning.

```bash
# Create a changeset
pnpm changeset

# Version packages
pnpm version-packages

# Publish
pnpm release
```
