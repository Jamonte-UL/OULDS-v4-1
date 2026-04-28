# Button Component: Old vs New Spec Comparison

## Overview

This document compares the existing OULDS button implementation (SCSS + Gulp) against the agreed specification for the new `oulds-button` Stencil web component.

## Side-by-Side Comparison

| Decision | Old System (OULDS-Latest) | New Spec (OULDS-v4) | Change |
|---|---|---|---|
| **Tech stack** | SCSS + Gulp + Storybook HTML | Stencil Web Component + Shadow DOM | **Changed** — CSS-only → web component |
| **Tag / class name** | `.ul-button` (CSS class) | `<oulds-button>` (custom element) | **Changed** |
| **Variants** | `primary`, `secondary`, `tertiary`, `alternative`, `save`, `delete`, `widget` (7) | `primary`, `secondary`, `destructive`, `ghost` (4) | **Reduced** — tertiary/alternative/save/widget removed; delete→destructive; ghost added |
| **Variant API** | CSS modifier class (`-primary`, `-delete`, etc.) | `variant` prop | **Changed** |
| **Sizes** | `default`, `small` (2) | `sm`, `md`, `lg` (3) | **Changed** — added `lg`, renamed `default`→`md`, `small`→`sm` |
| **Size API** | CSS modifier class (`-small`) | `size` prop | **Changed** |
| **Icon support** | `leftIcon`/`rightIcon` booleans + icon class strings; icon-only via CSS `:has()` | Named slots (`slot="start"`, `slot="end"`) + `icon-only` prop | **Changed** — slots replace prop-driven icons |
| **Separate icon-button** | Yes — dedicated `icon-button` component | No — unified via `icon-only` prop on `oulds-button` | **Merged** |
| **Group button** | Dedicated `group-button` component | Not in scope (separate component later) | **Deferred** |
| **Loading state** | Not supported | `loading` prop + spinner + `aria-busy` | **Added** |
| **Link mode** | Not supported | Renders `<a>` when `href` provided; `target`, `rel` props | **Added** |
| **Full width** | Not supported | `full-width` prop | **Added** |
| **Form type** | Hardcoded `type="button"` | `type` prop (`button`, `submit`, `reset`) | **Added** |
| **Rounded variant** | `isRounded` boolean | Not included | **Removed** |
| **Label visibility** | `isLabelVisible` prop | Not needed — slot content controls this naturally | **Removed** |
| **Theme switching** | `ultheme` prop toggling `uls`/`ultrus` class | CSS custom properties + semantic token layers (light/dark) | **Changed** — theme via token tiers, not class toggle |
| **Disabled** | `disabled` attribute + opacity + `pointer-events: none` | `disabled` attribute (native behavior) | **Simplified** |
| **Focus style** | Per-variant `--btn-*-border-focus` outline | Unified `--oulds-button-focus-ring-color/width` | **Simplified** |
| **Token naming** | `--btn-<variant>-<property>-<state>` (SCSS vars, 2-tier) | `--oulds-button-<variant>-<property>` (CSS custom props, 3-tier DTCG) | **Changed** — W3C DTCG format, 3-tier pipeline |
| **Token tiers** | Flat SCSS variables per theme | Primitive → Semantic → Component | **Added** semantic layer |
| **Sizing tokens** | `--btn-min-height`, `--btn-padding-*` (2 sizes) | `--oulds-button-height-{sm,md,lg}`, `--oulds-button-padding-{x,y}-{sm,md,lg}` | **Expanded** |
| **Custom events** | None | None (native events bubble) | **Same** |
| **Accessibility** | Focus outline only; no ARIA attributes | Focus ring + `aria-busy` on loading; `aria-disabled` consideration | **Improved** |
| **File structure** | SCSS partials across `scss/components/`, `scss/variables/` | Single folder `src/components/oulds-button/` with `.tsx`, `.css`, `.spec.ts` | **Changed** |

## Key Takeaways

- **7 → 4 variants** — the old system had overlapping/redundant variants (tertiary, alternative, save, widget). The new spec consolidates to a clean, opinionated set.
- **3 new features** — loading state, link mode (`href`), and full-width support fill gaps in the old system.
- **2 merged components** — the dedicated `icon-button` is folded into the main button via an `icon-only` prop.
- **Token architecture** is the biggest structural change — moving from flat SCSS variables to a 3-tier W3C DTCG pipeline (Primitive → Semantic → Component) with CSS custom properties.
- **2 features removed** — `isRounded` and `isLabelVisible` are dropped as unnecessary in the new architecture.

## New Agreed Spec Summary

| Property | Value |
|---|---|
| Tag name | `oulds-button` |
| Variant API | Single `variant` prop: `primary`, `secondary`, `destructive`, `ghost` |
| Sizes | `sm`, `md`, `lg` via `size` prop (default `md`) |
| Icons | Named slots (`slot="start"`, `slot="end"`) + `icon-only` boolean prop |
| Loading | `loading` boolean prop, shows spinner, sets `aria-busy` |
| Link mode | Renders `<a>` when `href` is provided; supports `target`, `rel` |
| Full width | `full-width` boolean prop |
| Form support | Inner `<button>` with `type` prop (`button`, `submit`, `reset`), no `ElementInternals` |
| Events | None custom — native `click`/`focus`/`blur` bubble naturally |
| Token consumption | CSS custom properties from `@oulds/tokens` |
| File structure | Stencil convention: `src/components/oulds-button/oulds-button.{tsx,css,spec.ts}` |
