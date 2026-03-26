# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project context

Enterprise design system modernization. The existing system is built with Stencil and uses a 2-tier token system. The goal is a framework-agnostic rebuild that corrects known shortcomings.

**Current system:**
- Stencil Web Components
- 2-tier token system (no semantic layer)
- Figma designs exist but are disconnected from code

**New direction:**
- Stencil Web Components (continuing)
- Rollup or Vite for docs/Storybook build
- 3-tier token architecture: **Primitive → Semantic → Component**
- Token pipeline: Figma Variables API → custom export script

## Architecture decisions

| Decision | Choice |
|----------|--------|
| Token format | W3C DTCG JSON |
| Token transform | Style Dictionary v4 |
| Token tiers | Primitive → Semantic → Component |
| Token pipeline | Figma Variables API → manual export → `packages/tokens/src/` |
| Component library | Stencil Web Components |
| Stencil output targets | `dist-custom-elements` (primary) + `dist` (legacy fallback) |
| Framework wrappers | React, Vue, Angular (via Stencil output targets) |
| Docs | Storybook 8 + Vite builder |
| Monorepo | pnpm workspaces + Turborepo |
| Versioning | Changesets, independent per-package |

## Repo structure

```
packages/
  tokens/       — DTCG JSON sources + Style Dictionary config
  components/   — Stencil source; wrappers are generated from here
  react/        — generated React wrappers
  vue/          — generated Vue wrappers
  angular/      — generated Angular wrappers
apps/
  storybook/    — Storybook 8, consumes @oulds/components + @oulds/tokens
```

## Working rules

- **Interview before scaffolding.** Ask key questions about stack, token pipeline, build tooling, and Figma sync before writing any code or creating files. Don't scaffold until direction is agreed.
- **Explain trade-offs.** When recommending a direction, explain the trade-offs — don't just pick one.
- **Be concise.** Skip preamble and trailing summaries.
