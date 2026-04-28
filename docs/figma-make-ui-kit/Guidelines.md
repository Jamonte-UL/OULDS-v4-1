
# Patternz Design System Guidelines

## Setup

Import the styles CSS in your application:

```tsx
import "../Patternz/styles.css";
```

## Token format quirks you need to know first

Before you use any token, understand these three things about how this stylesheet works. Getting any of them wrong will silently break your styles.

**1. Most numeric values are unitless.** Spacing, border-radius, font-size, shadow offsets — they're all raw numbers. You must multiply by `1px` when using them in CSS. If you write `padding: var(--spacer-3)` you'll get `padding: 16` which is invalid CSS. Always use the `calc()` pattern:

```css
padding: calc(var(--spacer-3) * 1px);   /* becomes 16px */
gap: calc(var(--spacer-2) * 1px);       /* becomes 8px */
border-radius: calc(var(--radius-medium) * 1px); /* becomes 5px */
```

**2. Many variable names contain special characters.** Tokens use `✦`, `/`, and `🎨` in their names. In CSS you reference them with `var()` using the exact escaped names from the stylesheet (backslash before each `/`). In inline JSX styles, the escaping looks like this:

```tsx <div style={{ color: "var(--✦/_text/text-default)" }} /> ```

**3. Color tokens are already complete CSS values.** Unlike spacing, colors do not need any transformation. Use them directly:

```css
background: var(--✦/_bg/bg-default);
color: var(--✦/_text/text-secondary);
```


## Choosing backgrounds

When you need a background color, start here. These are the semantic tokens, organized by the decision you're making.

**Page and card surfaces:**

| Token | Value | When to reach for it |
|---|---|---|
| `--✦/_bg/bg-default` | `#FFF` | The default background for pages and cards |
| `--✦/_bg/bg-secondary` | `#F5F5F5` | Subtle alternate sections, sidebars, secondary containers |

**Interactive states:**

| Token | Value | When to reach for it |
|---|---|---|
| `--✦/_bg/bg-hover` | `#F5F5F5` | Hover state on clickable elements |
| `--✦/_bg/bg-selected` | `#E5F4FF` | Active or selected item highlight |
| `--✦/bg/disabled/default` | `#D9D9D9` | Disabled element fill |

**Dark surfaces (menus and toolbars):**

| Token | Value | When to reach for it |
|---|---|---|
| `--✦/_bg/bg-menu` | `#1E1E1E` | Dropdown menus, dark popover backgrounds |
| `--✦/_bg/bg-toolbar` | `#2C2C2C` | Toolbar backgrounds |

When using these dark surfaces, pair them with `--✦/_text/text-onbrand` and `--✦/_icon/icon-onbrand` for legible text and icons.

**Semantic status backgrounds:**

| Token | Value | When to reach for it |
|---|---|---|
| `--✦/_bg/bg-brand` | `#0D99FF` | Brand-colored fills for buttons and small accents |
| `--✦/_bg/bg-danger` | `#F24822` | Destructive or error backgrounds |
| `--✦/_bg/bg-warning` | `#FFCD29` | Warning banners |

**Tertiary (tinted) backgrounds** for lighter variations:

| Token | When to reach for it |
|---|---|
| `--✦/bg/brand/tertiary` | Light blue tinted background (`#E5F4FF`) |
| `--✦/bg/brand/tertiary-hover` | Hover state for the above |
| `--✦/bg/brand/tertiary-pressed` | Pressed state for the above |
| `--✦/bg/danger/tertiary` | Light red background for error regions |
| `--✦/bg/warning/tertiary` | Light yellow background for warning regions |
| `--✦/bg/default/tertiary` | Neutral grey tertiary (`#E6E6E6`) |


## Choosing text colors

| Token | Value | When to reach for it |
|---|---|---|
| `--✦/_text/text-default` | `#000000E5` | Primary text: titles, body copy, tab labels |
| `--✦/_text/text-secondary` | `#00000080` | Secondary labels, timestamps, inactive tabs |
| `--✦/_text/text-tertiary` | `#0000004D` | Placeholder text — very low contrast, use sparingly |
| `--✦/_text/text-onbrand` | `#FFF` | Text placed on brand-colored or dark backgrounds |
| `--✦/_text/text-brand` | `#007BE5` | Links and brand-tinted inline text |
| `--✦/_text/text-danger` | `#DC3412` | Error messages |
| `--✦/_text/text-warning` | `#B86200` | Warning messages |
| `--✦/_text/text-success` | `#009951` | Success messages |
| `--✦/text/disabled/default` | — | Disabled text |


## Choosing icon colors

Icons follow the same semantic pattern as text. The tokens are:

`--✦/_icon/icon-default`, `icon-secondary`, `icon-tertiary`, `icon-onbrand`, `icon-brand`, `icon-danger`, `icon-warning`, `icon-success`.

Match your icon color to the equivalent text color in most cases.


## Choosing border colors

| Token | Value | When to reach for it |
|---|---|---|
| `--✦/_border/border-default` | `#E6E6E6` | Dividers, input borders, card outlines |
| `--✦/_border/border-strong` | `#2C2C2C` | High-emphasis borders when you need more contrast |
| `--✦/_border/border-selected` | `#0D99FF` | Focused or selected input borders |
| `--✦/_border/border-onbrand-strong` | `#FFF` | Borders on top of brand-colored backgrounds |


## Palette colors (fallback only)

Raw palette colors exist for situations where no semantic token fits. Always prefer the semantic tokens above. If you find yourself reaching for a palette color, pause and check whether a semantic token already covers your use case.

- **Blue:** `--🎨/blue/100` through `--🎨/blue/600`
- **Purple:** `--🎨/purple/100` through `--🎨/purple/900`
- **Violet:** `--🎨/violet/100` through `--🎨/violet/500`
- **Grey:** `--🎨/grey/100` through `--🎨/grey/500`
- **Red:** `--🎨/red/200` through `--🎨/red/400`
- **Persimmon:** `--🎨/persimmon/100` through `--🎨/persimmon/500`
- **Orange:** `--🎨/orange/100`, `--🎨/orange/400`
- **Green:** `--🎨/green/100`, `--🎨/green/500`
- **Pink:** `--🎨/pink/500`

Also available: `--color-1` through `--color-7`, `--white`, `--black`, `--warm-red` (#F24E1E).


## Spacing

All spacing uses `--spacer-*` tokens. Remember: values are unitless, so always multiply by `1px`.

| Token | Effective value |
|---|---|
| `--spacer-0` | 0 |
| `--spacer-1` | 4px |
| `--spacer-2` | 8px |
| `--spacer-2-5` | 12px |
| `--spacer-3` | 16px |
| `--spacer-4` | 24px |
| `--spacer-5` | 32px |
| `--spacer-6` | 40px |

For pixel-precise sizing, `--base/size/*` tokens are available from 2 to 128.

```tsx <div style={{ padding: "calc(var(--spacer-3) * 1px)", gap: "calc(var(--spacer-2) * 1px)" }}>
      ``` ## Border radius | Token | Effective value | When to reach for it
      | |---|---|---| | `--radius-none` | 0 | Sharp corners | | `--radius-small`
      | 2px | Subtle rounding on small elements | | `--radius-medium` | 5px
      | Default for inputs, cards, containers | | `--radius-large` | 13px |
      Prominent rounding for featured elements | | `--radius-full` | 9999px
      | Pill shapes, circular avatars | Legacy tokens (`--borderradius/small`
      = 3, `--borderradius/medium` = 6, `--borderradius/large` = 12, `--borderradius/full`
      = 9999, `--borderradius/default` = 6) are also available but prefer the
      `--radius-*` set. ## Typography Typography classes are the preferred
      way to style text. Each class sets font-family, font-size, font-weight,
      and line-height together, so you get consistent type with a single class
      name. Do not manually set individual font properties when a class exists
      for what you need. ### All typography classes at a glance #### Headings
      and display | Class | Font | Size | Weight | When to use it | |---|---|---|---|---|
      | `.display-display-large` | Whyte | 64px | 700 | Hero headlines, the
      biggest text on the page | | `.display-display-medium` | Whyte | 36px
      | 700 | Major section headlines | | `.display-display-small` | Whyte
      | 22px | 700 | Sub-headlines within sections | | `.heading-display` |
      Whyte | 48px | 500 | Product display text, lighter weight than display
      classes | | `.heading-heading-large` | Inter | 24px | 550 | Page-level
      titles | | `.heading-heading-medium` | Inter | 15px | 550 | Section titles
      within a page | | `.heading-heading-small` | Inter | 13px | 550 | Subsection
      titles, sidebar headings | | `.h1` | Whyte | 32px | 700 | Semantic H1
      elements | | `.h2` | Whyte | 24px | 700 | Semantic H2 elements | | `.h3`
      | Whyte | 20px | 700 | Semantic H3 elements | #### Body text | Class
      | Font | Size | Weight | When to use it | |---|---|---|---|---| | `.body-body-hero`
      | Whyte | 22px | 400 | Hero body text, large introductory paragraphs
      | | `.body-body-large-2` | Whyte | 22px | 400 | Large body text in marketing
      contexts | | `.body-body-medium-2` | Whyte | 18px | 400 | Medium body
      text in marketing contexts | | `.body-body-medium-bold` | Whyte | 18px
      | 700 | Bold callouts in marketing body | | `.body-body-regular` | Whyte
      | 16px | 400 | Standard body text (Whyte) | | `.body-body-regular-bold`
      | Whyte | 16px | 700 | Bold body text (Whyte) | | `.body-body-eyebrow`
      | Whyte | 14px | 500 | Eyebrow/overline text above headings | | `.paragraph`
      | Whyte | 16px | 400 | General paragraph text | | `.body-body-large`
      | Inter | 13px | 450 | UI body text (large) | | `.body-body-large-strong`
      | Inter | 13px | 550 | UI body text (large, bold) | | `.body-body-medium`
      | Inter | 11px | 450 | UI body text (medium) | | `.body-body-medium-strong`
      | Inter | 11px | 550 | UI body text (medium, bold) | | `.body-body-small`
      | Inter | 9px | 450 | Small labels, fine print | | `.body-body-small-strong`
      | Inter | 9px | 550 | Small labels (bold) | | `.title-small` | SF Pro
      Text | 16px | 600 | Small titles in UI contexts | #### Code and monospace
      | Class | Font | Size | When to use it | |---|---|---|---| | `.codeblock`
      | SF Mono | 13px | Multi-line code blocks | | `.mono-mono-large` | Roboto
      Mono | 13px | Inline code in UI (large) | | `.mono-mono-medium` | Roboto
      Mono | 11px | Inline code in UI (medium) | | `.mono-mono-small` | Roboto
      Mono | 9px | Inline code in UI (small) | | `.codeinline-body-large` |
      SF Mono | ~15px | Inline code within large body text | | `.codeinline-body-medium`
      | SF Mono | ~13px | Inline code within medium body text | | `.codeinline-body-small`
      | SF Mono | ~11px | Inline code within small body text | | `.codeinline-caption`
      | SF Mono | ~11px | Code in captions or footnotes | ### Font families
      - **Whyte** is for display and marketing: headings, hero text, paragraphs
      on landing pages - **Inter** is for UI: app headings, body text in product
      interfaces, labels - **SF Mono / Roboto Mono** are for code: blocks,
      inline snippets, technical values ### Font weight tokens If you need
      to override weight independently (rare — prefer the typography classes):
      | Token | Value | |---|---| | `--font/weight/default` | 450 | | `--font/weight/medium`
      | 450 | | `--font/weight/strong` | 550 | | `--base/text/weight/light`
      | 300 | | `--base/text/weight/normal` | 400 | | `--base/text/weight/medium`
      | 500 | | `--base/text/weight/semibold` | 600 | ## Shadows Shadows are
      composed from multiple tokens. Here are the assembled snippets so you
      don't have to figure out the composition yourself. ### Resting shadow
      (small) For cards, inputs, and static elevated elements: ```css box-shadow:
      calc(var(--shadow\/resting\/small\/1\/offsetx) * 1px) calc(var(--shadow\/resting\/small\/1\/offsety)
      * 1px) calc(var(--shadow\/resting\/small\/1\/blur) * 1px) calc(var(--shadow\/resting\/small\/1\/spread)
      * 1px) var(--shadow\/resting\/small\/1\/color), calc(var(--shadow\/resting\/small\/2\/offsetx)
      * 1px) calc(var(--shadow\/resting\/small\/2\/offsety) * 1px) calc(var(--shadow\/resting\/small\/2\/blur)
      * 1px) calc(var(--shadow\/resting\/small\/2\/spread) * 1px) var(--shadow\/resting\/small\/2\/color);
      ``` ### Floating shadows For overlays, dropdowns, and modals. Available
      in sizes: `small`, `medium`, `large`, `xlarge`. Each size has multiple
      layers. Follow the same composition pattern as the resting shadow, substituting
      `floating` for `resting` and the desired size. ## Breakpoints | Token
      | Value | When to reach for it | |---|---|---| | `--breakpoint/xsmall`
      | 320px | Small phones | | `--breakpoint/small` | 544px | Large phones
      | | `--breakpoint/medium` | 768px | Tablets | | `--breakpoint/large`
      | 1012px | Small desktops | | `--breakpoint/xlarge` | 1280px | Standard
      desktops | | `--breakpoint/xxlarge` | 1400px | Large screens | ## What
      not to do These constraints matter as much as the tokens themselves.
      Violating them is a common source of visual bugs. 1. **Do not use brand
      color as a page background.** `--✦/_bg/bg-brand` and `--✦/_text/text-brand`
      are for buttons, links, and small accents. Large brand-colored areas
      overwhelm the interface. 2. **Do not hardcode pixel values when a spacing
      token exists.** Write `calc(var(--spacer-3) * 1px)`, not `16px`. The
      tokens ensure consistency if the scale ever changes. 3. **Do not manually
      set font properties when a typography class covers your need.** If you
      want 13px Inter at weight 550, use `.body-body-large-strong`. Don't write
      `font-size: 13px; font-weight: 550; font-family: Inter`. 4. **Do not
      repurpose status colors.** Danger, warning, and success tokens are reserved
      for their semantic meanings. Don't use `bg-danger` as a decorative red.
      5. **Do not pair dark text with dark backgrounds.** When using `bg-menu`
      or `bg-toolbar`, switch to `text-onbrand` and `icon-onbrand`. 6. **Do
      not use raw palette colors when a semantic token exists.** Semantic tokens
      update correctly across themes. Palette colors don't. 7. **Do not forget
      the `* 1px` multiplication.** This is the single most common mistake
      with this token system. Spacing, radius, shadow offsets, and font sizes
      are all unitless numbers. 8. **Do not skip `border-selected` for focus
      states.** Use `--✦/_border/border-default` for resting borders, and `--✦/_border/border-selected`
      when an input or element receives focus. 9. **Disabled states** have
      their own tokens: `--✦/bg/disabled/default` for backgrounds and `--✦/text/disabled/default`
      for text. Don't approximate disabled styling with opacity hacks.
    