# Executive Summary — Oulds Design System Modernisation
**Date:** 26 March 2026
**Prepared by:** James
**For:** Asif 

---

## Background

The OULDS design system (OULDS-V3) was built using Stencil and a 2-tier design token system. While it has served the business well, it has a number of structural limitations:

- Figma designs are disconnected from code, creating inconsistency between what designers produce and what engineers implement
- The 2-tier token system lacks a semantic layer, making it difficult to support theming, dark mode, or brand variants without significant rework
- Framework-specific coupling makes it harder for new products on different stacks to adopt the system

The goal of this modernization is to rebuild the system on a solid, future-proof foundation — one that stays in sync with Figma, supports any framework, and scales with the business.

---

## What was done today

Today marked the first working session on the new system. The following was completed:

**Architecture decisions finalised**
All foundational technical decisions were made and recorded. These decisions will not need to be revisited and form the basis for all future work.

Key choices:
- **3-tier token system** (Primitive → Semantic → Component) replacing the current 2-tier approach — enables theming, brand variants, and cleaner component styling
- **Figma Variables API integration** — design tokens will be exportable directly from Figma, keeping design and code in sync
- **Stencil Web Components** — continuing the existing technology, now producing framework-agnostic output consumable by React, Vue, and Angular teams with auto-generated wrappers
- **pnpm monorepo + Turborepo** — modern, fast build infrastructure with independent versioning per package

**Codebase scaffolded**
The full repository structure was created, including:
- Token pipeline (W3C standard format + Style Dictionary transformation)
- Component package with Stencil configuration
- Auto-generated wrapper packages for React, Vue, and Angular
- Storybook documentation environment
- Changesets for versioning and release management
- Figma export script stub, ready to be wired up to the design file

All architectural decisions are documented in the repository for the team's reference.

---

## What happens next

Work is broken into four sequential tracks:

### Track 1 — Share with Pete (this week)
The scaffold will be pushed to GitHub so Pete can pull, build, and verify the toolchain works. Any environment issues will be caught early.

### Track 2 — Token review (James + Pete)
James and Pete will review the design-tokens work already completed and map it into the new 3-tier structure. This includes agreeing on naming conventions with the design team in Figma so the automated export pipeline can be activated.

### Track 3 — Pilot component (following Track 2)
A single component (e.g., checkbox) will be built end-to-end through the full pipeline — from Stencil source through to React, Vue, and Angular wrappers, rendered in Storybook with live design tokens. This de-risks the approach before scaling to the full library.

### Track 4 — OULDS-3 migration plan (following Track 3)
Once the pipeline is validated, a full audit of OULDS-v3 will be conducted to produce a prioritized migration plan. The approach will be a "strangler fig" — new products adopt the new system immediately, while existing products migrate component by component. API parity will be maintained where possible to minimise disruption to consuming teams.

---

## Why this approach is low-risk

- No existing products are affected — OULDS-3 continues to run unchanged during the transition
- The pilot component test catches toolchain issues before they compound
- All decisions are documented and reversible at the architectural level
- The team (James + Pete) is small and coordinated — decisions can move quickly

---

## Summary

| What | Status |
|------|--------|
| Architecture decisions | Complete |
| Repository scaffolded | Complete |
| Push to GitHub for Pete | Next action |
| Token review (James + Pete) | Planned |
| Pilot test component | Planned |
| OULDS-3 migration plan | Planned |

The foundation is in place. The next two to three weeks will validate the pipeline and produce the first real component, at which point the team will be ready to migrate the full OULDS-3 library at pace.
