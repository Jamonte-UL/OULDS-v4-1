---
name: ds-interview
description: Guides the architecture interview for a new design system before any scaffolding begins. Covers token pipeline, build tooling, monorepo strategy, and Figma sync. Use this at the start of a new DS project or when revisiting foundational decisions.
---

Conduct a structured architecture interview for the new design system. Work through each topic below in order, asking one topic at a time. For each decision, present the options and explain the trade-offs clearly before asking the user to choose. Do not scaffold or write any code until the full interview is complete and the user has agreed on direction.

## Topics to cover

1. **Token pipeline**
   - How will design tokens be authored and exported from Figma? (Tokens Studio, Figma Variables API + custom script, manual)
   - What format will tokens be stored in? (W3C DTCG JSON, Style Dictionary format, custom)
   - How will tokens be transformed for consumption? (Style Dictionary, custom build step, none)
   - Confirm the 3-tier structure: Primitive → Semantic → Component

2. **Component build tooling**
   - Stencil is the agreed baseline — confirm output targets needed (dist-custom-elements, dist, www)
   - Any wrapper generation needed for React, Vue, or Angular?

3. **Docs / Storybook build**
   - Storybook vs a custom docs site vs both
   - If Storybook: which builder — Vite or Webpack?
   - If custom docs site: framework preference

4. **Monorepo strategy**
   - Single package or monorepo (tokens, components, docs as separate packages)?
   - If monorepo: pnpm workspaces, Turborepo, Nx, or Lerna?

5. **Figma sync**
   - Confirmed approach: Figma Variables API → custom export script
   - Who runs the export — manual trigger, CI, or a design-side tool?
   - Where do the exported token files live in the repo?

6. **Versioning and release**
   - Semantic versioning with Changesets, standard-version, or manual?
   - Single version for the whole system or per-package versioning?

## After the interview

Summarise all decisions in a single table (Decision | Choice | Key reason). Then ask the user to confirm before offering to scaffold.
