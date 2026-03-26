# Critical work

Priority order. Each item has a clear owner, outcome, and dependency.

---

## 1 — Upload scaffold to GitHub for Pete to review and test

**Owner:** James
**Depends on:** Nothing — do this first
**Outcome:** Pete can clone the repo, run `pnpm install && pnpm build`, and confirm the toolchain works on his machine

**Actions:**
- [ ] Create GitHub repo under the org (public or private — decide with Pete)
- [ ] Push the scaffold (see `docs/next-steps.md` Step 1)
- [ ] Invite Pete as collaborator
- [ ] Pete pulls, runs steps 2–5 from `docs/next-steps.md`, and reports any issues
- [ ] Resolve any environment or toolchain discrepancies before continuing

---

## 2 — Review existing design-tokens work

**Owner:** James + Pete
**Depends on:** Item 1 (repo shared)
**Outcome:** Understand what token work already exists and how it maps to the new 3-tier structure (Primitive → Semantic → Component)

**Actions:**
- [ ] James and Pete review the existing design-tokens work together
- [ ] Map existing tokens to the new tier structure — which are Primitive, which are Semantic, which are Component-specific
- [ ] Identify gaps: tokens needed in the new system that don't exist yet
- [ ] Agree on Figma variable collection naming convention (`Primitive`, `Semantic`, `Component`) so the export script can map them correctly
- [ ] Update `packages/tokens/src/primitive.json`, `semantic.json`, `component.json` with real values (or run the Figma export to generate them)

---

## 3 — Pilot test component

**Owner:** James + Pete
**Depends on:** Item 2 (tokens reviewed and in place)
**Outcome:** One real component (e.g., `Button`) running end-to-end through the full pipeline — Stencil build → wrapper generation → Storybook — with no unresolved issues

**Why this first:**
A single component will expose any mismatches between the Stencil config, wrapper output targets, token import paths, and Storybook setup before the team scales to the full component library.

**Checklist:**
- [ ] Scaffold `packages/components/src/components/button/` with props, styles (consuming token CSS vars), and a basic shadow DOM implementation
- [ ] Build components — confirm React, Vue, and Angular wrappers are generated correctly
- [ ] Write a Storybook story for the Button — confirm it renders with correct tokens applied
- [ ] Test the React wrapper in an isolated React app
- [ ] Test the Vue wrapper in an isolated Vue 3 app
- [ ] Test the Angular wrapper in an isolated Angular app
- [ ] Document any issues found and resolve before moving to additional components

---

## 4 — Migration plan for OULDS-3

**Owner:** James (lead), Pete (review)
**Depends on:** Item 3 (pilot test complete and pipeline validated)
**Outcome:** A documented, prioritised migration plan for moving OULDS-3 components into the new system

**Approach — strangler fig:**
New products adopt the new DS immediately. Existing products stay on OULDS-3 and are migrated one by one. Both systems run in parallel during transition.

**Actions:**
- [ ] Run `/ds-audit` on the OULDS-3 codebase (provide the path when prompted)
  - Outputs: full component inventory, token inventory, migration classification (carries over / needs rethinking / drop)
- [ ] Agree migration order: foundations and tokens first, primitive components second, composite components last
- [ ] Identify components that need API parity (same props/events) so consuming teams can swap with minimal code changes
- [ ] Define "done" criteria for each component migration
- [ ] Agree on a sunset timeline for OULDS-3

---

## Open questions to resolve

| Question | Who decides | Blocking |
|----------|-------------|---------|
| Public npm vs private registry for `@oulds/*`? | James + Pete | Publishing any package |
| Which org/repo name on GitHub? | James | Item 1 |
| Do any consuming apps need SSR support? | Consuming team leads | Stencil output target config |
| Storybook branded theme or default? | Design team | Item 3 |
| CI provider and pipeline setup? | James + Pete | Automated builds and publishing |
