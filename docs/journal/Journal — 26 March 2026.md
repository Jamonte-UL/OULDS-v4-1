# Journal — 26 March 2026

## Session summary

Working session with Claude Code to initialise the new Oulds design system repository.

### What we did

**1. Established working conventions**
Set up `CLAUDE.md` to capture project context and working rules for all future Claude Code sessions. Two skills were created:
- `/ds-interview` — structured architecture interview before any scaffolding
- `/ds-audit` — component and token audit workflow for the existing OULDS-3 system

**2. Architecture interview**
Worked through all foundational decisions before writing a single line of code. Decisions recorded below.

**3. Monorepo scaffolded**
Full pnpm workspace structure created and committed to this directory.

---

## Architecture decisions made today

| Decision | Choice | Notes |
|----------|--------|-------|
| Token format | W3C DTCG JSON | Emerging standard; best long-term compatibility |
| Token transform | Style Dictionary v4 | Battle-tested; supports DTCG natively |
| Token tiers | Primitive → Semantic → Component | Upgrade from current 2-tier system in OULDS-3 |
| Token pipeline | Figma Variables API → manual export | Export script stub created at `packages/tokens/scripts/export-figma.ts` |
| Token source location | `packages/tokens/src/` | Treated as authored source, reviewed in PRs |
| Component library | Stencil Web Components | Continuing from OULDS-3; framework-agnostic output |
| Stencil output targets | `dist-custom-elements` + `dist` | Modern bundlers (primary) + legacy CDN fallback |
| Framework wrappers | React, Vue, Angular | Auto-generated via Stencil output targets |
| Docs | Storybook 8 + Vite | Fast HMR; web-components-vite framework |
| Monorepo tooling | pnpm workspaces + Turborepo | Strict dependency isolation; build caching |
| Versioning | Changesets, independent per-package | Each package (tokens, components, wrappers) versions separately |
| Package scope | `@oulds` | |

---

## Files created today

```
CLAUDE.md
.gitignore
package.json
pnpm-workspace.yaml
turbo.json
.changeset/config.json
packages/tokens/package.json
packages/tokens/style-dictionary.config.json
packages/tokens/src/primitive.json         ← placeholder DTCG tokens
packages/tokens/src/semantic.json          ← placeholder DTCG tokens
packages/tokens/src/component.json         ← placeholder DTCG tokens
packages/tokens/scripts/export-figma.ts    ← Figma export stub
packages/components/package.json
packages/components/stencil.config.ts      ← includes React/Vue/Angular output targets
packages/components/tsconfig.json
packages/components/src/index.ts
packages/react/package.json
packages/vue/package.json
packages/angular/package.json
apps/storybook/package.json
apps/storybook/.storybook/main.ts
apps/storybook/.storybook/preview.ts
.claude/skills/ds-interview/SKILL.md
.claude/skills/ds-audit/SKILL.md
docs/journal/2026-03-26.md                 ← this file
```

---

## Decisions deferred / still open

- Which npm registry for publishing `@oulds/*` packages? (public npm, private registry, GitHub Packages)
- Do consuming teams need SSR support? (affects Stencil output target config)
- Storybook theme — custom branded or default?
- CI provider (GitHub Actions assumed but not configured yet)
