---
name: ds-audit
description: Audits an existing design system codebase. Lists all components, their props/variants, and tokens; then maps what carries over cleanly to the new system vs what needs rethinking. Use this before starting a migration or parallel-build (strangler fig) approach.
disable-model-invocation: false
---

Audit the existing design system at the path provided by the user (or ask for it if not given). Do not migrate anything — only audit and report.

## Step 1 — Read the codebase

Scan the existing design system directory. Look for:
- Component source files (`.tsx`, `.ts`, `.css`, `.scss`, shadow DOM styles)
- Token files (JSON, CSS custom properties, SCSS variables)
- Any existing documentation or Storybook stories

## Step 2 — Component inventory

For each component, capture:
| Component | Props | Variants / states | Notes |
|-----------|-------|-------------------|-------|

Include: all public props/attributes, named slots, CSS parts, and custom events.

## Step 3 — Token inventory

List all design tokens currently in use:
| Token name | Value | Tier (Primitive / Semantic / Component) | Used by |
|------------|-------|-----------------------------------------|---------|

If the current system is 2-tier, note which tokens would map to the new Primitive tier and which to Semantic.

## Step 4 — Migration mapping

For each component and token, classify:
- **Carries over cleanly** — direct equivalent exists or is trivial to create in the new system
- **Needs rethinking** — API surface, token usage, or behaviour differs enough to warrant a design decision
- **Deprecated / drop** — not worth carrying forward

## Step 5 — Summary

- Total component count
- Token count by tier (current and proposed 3-tier split)
- Top 3 migration risks or decisions that need resolution before work begins
- Recommended migration order: foundations (tokens, typography, spacing) first, then primitive components, then composite components

If the old DS will run in parallel (strangler fig), flag which components need API parity so consuming teams can swap with minimal changes.
