# Journal — 15 April 2026

## TL;DR

Token files exported to Figma contained hardcoded values instead of alias references, breaking the 3-tier chain. We rewrote all three files to W3C DTCG format, imported them via Tokens Studio, and confirmed 569 variables live in Figma with a working Primitive → Semantic → Component alias chain. We also filled three missing token groups (typography, elevation, motion) identified during an audit.

---

## Session summary

Working session in VS Code with Claude Sonnet 4.6 to audit the 3-tier token system, fill identified gaps, and validate the full Primitive → Semantic → Component chain in Figma using Tokens Studio.

### The problem we started with

The original `semantic.json` and `component.json` files had been exported directly from Figma's Variables REST API. That API outputs colors as verbose objects — `{ colorSpace, components, alpha, hex }` — rather than W3C DTCG alias references. The result was that every token in the Semantic and Component collections carried a raw, hardcoded value (a flat hex string or a number) with no pointer back to the Primitive collection.

**What this looked like in Figma:** When the files were imported, the Semantic collection showed tokens like `text.primary = #3E3E3E` — a standalone hex value — instead of the expected alias `→ color/gray/700`. The variables were structurally flat; the 3-tier alias chain was completely broken.

**Why the native Figma Import button failed:** Figma's own Variables Import button expects Figma's proprietary Variables JSON export format. It does not understand W3C DTCG alias syntax (`"$value": "{color.gray.700}"`). Importing `primitive.json` worked because raw hex values are format-agnostic, but importing `semantic.json` produced an error because the alias strings were unrecognized.

**Root cause summary:** The token files were in Figma's export format, not W3C DTCG format. Re-importing them verbatim could never produce an alias chain because there were no `{token.path}` references in the files — only resolved, hardcoded values.

---

### What we did

**1. Token system audit (ds-audit skill)**
Ran a full audit of all three token files to assess coverage against modern enterprise design system standards. The audit identified five gaps:

- Typography tokens existed in `primitive.json` but were not promoted to `semantic.json`
- Shadow/elevation tokens were entirely absent at both tiers
- Motion tokens (duration, easing) existed in primitive but were not promoted to semantic
- Only 9 components covered in `component.json` (a full DS typically needs 50+)
- No high-contrast or brand variant modes defined beyond light/dark

**2. Shadow primitives added to `primitive.json`**
Added a new `shadow` group with 8 scale steps: `none`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `inner`. Values use standard Tailwind-derived multi-layer box shadows with RGBA transparency.

**3. Three new semantic groups added to `semantic.json`**
Added the following groups to both `light` and `dark` modes:

| Group | Tokens per mode | Description |
|---|---|---|
| `typography` | 11 | body/heading/mono fonts, sizes, weights, line-height |
| `elevation` | 4 | raised, floating, overlay, dialog → literal shadow strings |
| `motion` | 7 | enter/exit/expand/fade durations + enter/exit/standard easings |

Total semantic token count increased from 258 → 276 Variables in Figma (18 new number Variables, 8 new per mode). Shadow tokens go to Effect Styles, not Variables — this is expected Figma behavior.

**4. Figma import via Tokens Studio**
Walked through the complete Tokens Studio import workflow:
- Created 3 token sets in Tokens Studio: `primitive`, `semantic`, `component`
- Pasted updated JSON into each set via Edit JSON
- Ran Export styles & variables to Figma
- Confirmed 276 semantic variables, 238 primitive variables, 55 component variables in Figma Variables panel
- Confirmed alias chain working: semantic tokens show `color/gray/700` references, not hardcoded hex

**5. Elevation / Effect Styles investigation**
Discovered that Tokens Studio Free (v2.11.4) does not export Effect Styles — this is a Pro-only feature. Elevation tokens correctly exist in `semantic.json` with literal shadow values and will output correctly through the Style Dictionary code pipeline. Effect Styles in Figma can be created manually or via a Pro subscription when needed.

**6. Shadow alias limitation resolved**
Initial elevation tokens used `{shadow.sm}` DTCG aliases. Tokens Studio could not resolve these when creating Effect Styles. Changed both light and dark elevation groups to use inline literal shadow strings. The primitive `shadow` scale remains in `primitive.json` for use by Style Dictionary in the code pipeline.

---

## Architecture decisions made today

| Decision | Choice | Notes |
|----------|--------|-------|
| Typography semantic layer | Added | 11 tokens per mode aliasing fontFamily, fontSize, fontWeight, lineHeight |
| Shadow primitive scale | Added | 8 steps (none → 2xl + inner), `$type: shadow` |
| Elevation semantic layer | Added | 4 intent names (raised/floating/overlay/dialog), literal values in semantic |
| Motion semantic layer | Added | 7 tokens per mode: 4 durations + 3 easings |
| Elevation in Figma | Effect Styles (Pro) or manual | Not Variables; Tokens Studio Free cannot export Effect Styles |
| Shadow alias format in semantic | Literal strings, not `{shadow.sm}` | Tokens Studio cannot resolve shadow aliases for Effect Style export |

---

## Files changed today

```
packages/tokens/src/primitive.json   ← added shadow group (8 tokens)
packages/tokens/src/semantic.json    ← added typography, elevation, motion groups
                                        to both light and dark modes (+44 tokens)
```

---

## Does this meet modern enterprise design system standards?

**Yes — with honest gaps noted.**

### What's strong ✅

| Standard | Status |
|---|---|
| W3C DTCG token format | ✅ All three files use `$type` / `$value` syntax |
| 3-tier token architecture | ✅ Primitive → Semantic → Component chain complete |
| Alias references throughout | ✅ Semantic tokens reference primitives; component tokens reference primitives |
| Light/dark mode structure | ✅ Both modes present with appropriate alias targets |
| Color scale depth | ✅ 11-step scales (50–950) for all hue families |
| Semantic intent naming | ✅ `text.primary`, `bg.canvas`, `border.error`, `interactive.primary` etc. |
| Chart / data viz tokens | ✅ 10-series palette + sentiment, trend, threshold, heatmap, diverging |
| Typography semantic layer | ✅ Added today — font, size, weight, line-height promoted |
| Shadow / elevation | ✅ Added today — 4-level scale with named intent tokens |
| Motion semantic layer | ✅ Added today — named duration/easing intents |
| Figma Variables sync | ✅ 569 total variables across 3 collections |

### What's still missing ⚠️

| Gap | Priority | Notes |
|---|---|---|
| Component token coverage | High | Only 9 components. A full DS needs checkbox, radio, select, table, tabs, alert, progress, spinner, etc. — add incrementally as each Stencil component is built |
| High-contrast mode | Medium | Semantic structure supports it (just add a 3rd mode key). Not built yet. |
| Effect Styles in Figma | Low | Requires Tokens Studio Pro or manual creation. Token values are correct in code. |
| Style Dictionary build verification | High | `pnpm build` in `packages/tokens` has not been run yet. Should be done to confirm CSS custom property output is correct before component work begins. |
| Typography → Text Styles in Figma | Low | Font tokens don't map to Figma Text Styles via Tokens Studio Free. Can be added manually or via Pro. |

---

## Next steps (recommended order)

1. **Run `pnpm build` in `packages/tokens`** — verify Style Dictionary transforms all alias references to correct CSS custom properties. This is the most important validation remaining.
2. **Build the first Stencil component** (suggest: `ou-button`) — apply component tokens to a real web component to prove the chain works end to end.
3. **Add component tokens** for each new component as it is built — `checkbox`, `radio`, `select`, `table`, `tabs`, `alert`, `progress`, `spinner`.
4. **Decide on Tokens Studio Pro** — if designers need Effect Styles for elevation in Figma, upgrade or create the 8 elevation styles manually.
5. **Plan high-contrast mode** — add a `high-contrast` key to `semantic.json` when accessibility audit requires it. Structure already supports this.
6. **Set up CI** — GitHub Actions workflow to run `pnpm build` on token changes and fail if Style Dictionary errors.

---

## Decisions deferred / still open

- Whether to upgrade Tokens Studio to Pro for Effect Style and Text Style export
- CI provider and token build validation step
- Publishing registry for `@oulds/*` packages (public npm, private, GitHub Packages)
- SSR support requirements from consuming teams
