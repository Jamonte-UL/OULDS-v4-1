# Journal — 17 April 2026

## TL;DR

Built a full interactive button demo page (`button-demo.html`) to aid design decisions. Decided on the Atlassian-style transparent secondary button approach and updated semantic + component tokens accordingly. Added `text/disabled` as a new semantic token. Made several manual Figma variable updates with guidance. Built Secondary Default, Hover, Active, and Disabled variants in Figma.

---

## Session summary

Working session in VS Code with Claude Sonnet 4.6 to design and validate the Secondary button variant, update tokens to match decisions made in Figma, and build out the Secondary button states.

---

## Button demo page

Created `OULDS-v4/button-demo.html` — a standalone design review page that resolves all token values to their final primitives and renders all 4 button variants (Primary, Secondary, Destructive, Ghost) across all 5 states (Default, Hover, Active, Disabled, Focus).

Key features:
- Interactive playground section at the top with live hover/active/focus CSS states
- State documentation grid below with pinned (non-interactive) state examples
- Side-by-side Secondary comparison: filled (gray.200) vs transparent (Atlassian-style)
- Sizes section (sm/md/lg)
- Ripple and transform animations were added then removed at user request — final version has only color/border/shadow transitions (120ms, custom ease)

---

## Secondary button design decision

Chose **Atlassian-style transparent secondary** over the original filled gray.200 approach.

### Reasoning
- Transparent default creates clear visual hierarchy — Primary is dominant, Secondary recedes
- Subtle border provides affordance without competing with Primary
- Lighter hover/active fills give clear feedback without feeling heavy

### Final secondary state progression

| State | bg | border | text |
|---|---|---|---|
| Default | transparent | gray/300 | gray/600 |
| Hover | gray/100 | gray/400 | gray/600 |
| Active | gray/300 | gray/400 | gray/600 |
| Disabled | transparent | gray/100 | gray/400 |
| Focus | transparent | gray/300 | gray/600 + focus ring |

---

## Token changes made this session

### `semantic/light.json`

| Token | Before | After | Reason |
|---|---|---|---|
| `interactive.secondary` | `{color.gray.200}` | `{color.transparent}` | Transparent secondary button |
| `interactive.secondary-hover` | `{color.gray.300}` | `{color.gray.100}` | Lighter hover fill |
| `interactive.secondary-active` | `{color.gray.400}` | `{color.gray.300}` | Clear press feedback (gray/100 was too close to hover) |
| `interactive.secondary-disabled` | `{color.gray.100}` | `{color.transparent}` | Disabled = no fill |
| `border.default` | `{color.gray.200}` | `{color.gray.300}` | User decision — slightly stronger default border |
| `text.disabled` | *(new)* | `{color.gray.400}` | New semantic token for disabled text across all components |

### `component.json`

| Token | Before | After | Reason |
|---|---|---|---|
| `button.secondary.text` | `{text.primary}` | `{text.secondary}` | User switched to secondary text color in Figma |
| `button.secondary.text-disabled` | `{text.muted}` | `{text.disabled}` | New disabled token — muted was too strong |
| `button.ghost.text-disabled` | `{text.muted}` | `{text.disabled}` | Same fix applied to ghost |

---

## Figma changes made this session (manual — no GitHub sync)

### Primitive collection
- Added `color/transparent` variable → `#00000000`

### semantic/light collection
- `interactive/secondary` → aliased to `color/transparent`
- `interactive/secondary-hover` → aliased to `color/gray/100`
- `interactive/secondary-active` → aliased to `color/gray/100` *(needs update to gray/300 — see open items)*
- `interactive/secondary-disabled` → aliased to `color/transparent`
- `border/default` → aliased to `color/gray/300`
- `text/disabled` → needs to be added, aliased to `color/gray/400`

### Button component variants built
- `variant=Secondary, state=Default` — bg: `button/secondary/bg`, stroke: `button/secondary/border`, text: `button/secondary/text`
- `variant=Secondary, state=Hover` — bg: `button/secondary/bg-hover`, stroke: `button/secondary/border-hover`
- `variant=Secondary, state=Active` — bg: `button/secondary/bg-active`, stroke: `button/secondary/border-hover`
- `variant=Secondary, state=Disabled` — bg: `button/secondary/bg-disabled`, stroke: `button/secondary/border-disabled`, text: `button/secondary/text-disabled`

---

## Open items / carry into next session

1. **`interactive/secondary-active` in Figma** — currently set to `color/gray/100` (same as hover). Needs to be updated to `color/gray/300` to match the token JSON and give clear press feedback.

2. **`text/disabled` in Figma** — new semantic token needs to be created in `semantic/light` collection aliased to `color/gray/400`, then `button/secondary/text-disabled` and `button/ghost/text-disabled` component variables updated to point to it.

3. **`text/disabled` primitive value** — user was debating gray/400 vs gray/300 vs gray/200. Decision was pending at end of session. Once decided, update `semantic/light.json` accordingly.

4. **Secondary Focus state** — not yet built in Figma. Same as Default + second stroke using `button/focus-ring-color` (Outside, weight 2).

5. **Destructive variant** — not yet built (5 states pending).

6. **Ghost variant** — not yet built (5 states pending).

7. **Token JSON / Figma sync** — no GitHub sync set up. All Figma changes are being made manually. Consider setting up Tokens Studio GitHub sync to keep code and Figma in step automatically.

---

## Notes on workflow

- Figma variable edits are manual (no Tokens Studio GitHub sync on Free plan)
- The alias chain in Figma: `component → semantic → primitive` — always edit at the semantic level, never hardcode in component
- `button/secondary/bg-active` uses `border-hover` (not `border-active`) for the stroke — intentional, keeps border consistent between hover and active, only bg changes
- Primary disabled text uses `text/muted` (gray/500) rather than `text/disabled` (gray/400) — this is intentional since the gray/200 bg already communicates disabled clearly; the slightly stronger text maintains legibility against the light gray fill
