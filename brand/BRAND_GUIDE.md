# MotiThera Brand Guide — "Clinical Authority"

**Status: locked 2026-08-23.** Chosen from a 5-option identity review (Clinical Authority / Quiet Luxury Spa / Modern Wellness Tech / Heritage Apothecary / Boutique Feminine Premium) — this is Option A. This doc is the source of truth for every visual decision on the store from here forward; `CLAUDE.md` → "Design system guardrails" points here.

**The job this system does:** MotiThera sells at $499 next to red-light "belts" on Amazon at $50. The whole identity exists to make that gap feel correct before a single word of copy runs — cool ink-on-porcelain, one restrained accent, tight radii, spec-sheet precision. It should read like device documentation, not a wellness ad.

**A note on example copy in this doc:** per `PROGRESS.md` (2026-08-23), the actually-sourced device is a heat + vibration + low-frequency-pulse + mild-red-light massager (FCC/CE/RoHS, not a cleared medical device) — **not** the calibrated 660nm/850nm clinical-PBM device described in `offer/OFFER_BRIEF.md`. Every example below uses verified, sourcing-accurate language. Do not restore the 660nm/850nm/"clinical irradiance" claims into live copy — see `CLAUDE.md` → "Claim integrity."

---

## 1. Color system

| Token | Hex | Usage |
|---|---|---|
| `--color-ink-900` | `#14202E` | Headlines, primary body text, dark surfaces (e.g. footer) |
| `--color-ink-700` | `#3C4753` | Subheads, secondary body text |
| `--color-ink-500` | `#5B6672` | Muted text — captions, timestamps, helper text |
| `--color-ink-300` | `#9AA3AA` | Disabled text, placeholder text |
| `--color-ink-100` | `#DCE3E6` | Borders, dividers, disabled fills |
| `--color-porcelain` | `#FAF9F6` | Primary page background |
| `--color-mist` | `#EEF2F3` | Secondary surface — cards, alternating sections, table stripes |
| `--color-clay-600` | `#C1502E` | **Primary accent.** CTA default, price emphasis, sale badges |
| `--color-clay-700` | `#A43F22` | CTA hover; doubles as `--color-error-600` |
| `--color-clay-800` | `#832F19` | CTA active/pressed |
| `--color-clay-100` | `#F5DCD3` | Tint fill behind badges/callouts in the accent family |
| `--color-steel-600` | `#4C6B7A` | Secondary accent — eyebrows/kickers, links, icons, diagram lines |
| `--color-steel-700` | `#38505C` | Link hover/active, secondary-button hover |
| `--color-steel-100` | `#DCE9EC` | Tint fill for secondary/info callouts, focus rings on inputs |
| `--color-success-600` | `#4B7A5E` | In stock, order confirmation |
| `--color-success-100` | `#DDEAE0` | Success fill |
| `--color-warning-600` | `#B8863E` | Low stock, shipping caution |
| `--color-warning-100` | `#F3E6D3` | Warning fill |

**Rule: two accents, not five.** Clay red is the only color that means "act now." Steel blue is the only color that means "here's more information." Everything else on the page is ink, porcelain, or mist. If a design needs a third hue to feel finished, that's a sign to remove something rather than add a color.

**Error uses the clay family, not a new red** (`--color-clay-700` = `--color-error-600`). One red hue for the whole system — differentiate CTA vs. error by context (a button vs. a form field border), not by inventing a second red.

## 2. Typography

**Family: Inter** (Google Fonts, variable, weights 400/500/600/700/800). Fallback stack:
`"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`

Why Inter, and only Inter: it's the same register Apple Health, Oura, Levels, and Eight Sleep use — a typeface that reads as *engineered*, not *decorated*. One family across headings and body (varying only weight) reinforces the spec-sheet feel; introducing a second display face for headlines would pull this toward the "Quiet Luxury Spa" or "Boutique Feminine Premium" options that were not chosen.

| Role | Size / line-height | Weight | Tracking | Use for |
|---|---|---|---|---|
| Display | 44px / 1.1 | 800 | -0.015em | Homepage hero, PDP hero headline |
| H1 | 36px / 1.15 | 800 | -0.01em | Page titles |
| H2 | 28px / 1.2 | 700 | -0.005em | Section headers |
| H3 | 22px / 1.25 | 700 | normal | Card titles (large), subsection headers |
| H4 | 18px / 1.3 | 600 | normal | Card titles (standard), form section labels |
| Body Large | 18px / 1.5 | 400 | normal | Subheads, lede paragraphs, PDP intro copy |
| Body | 16px / 1.6 | 400 | normal | Default paragraph text |
| Small | 14px / 1.5 | 400 | normal | Captions, footnotes, helper text |
| Label / Eyebrow | 12.5px / 1.3 | 600 | 0.09em, uppercase | Kickers, badges, nav microcopy |
| Button | 14.5px / 1 | 600 | 0.02em | All button and CTA text |

Body copy max width: **65 characters** per line. Headings get `text-wrap: balance`.

## 3. Spacing, radius, shadow, motion

```
--space-4: 4px;   --space-8: 8px;   --space-12: 12px;  --space-16: 16px;
--space-24: 24px; --space-32: 32px; --space-48: 48px;  --space-64: 64px; --space-96: 96px;

--radius-sm: 2px;   /* inputs, tags */
--radius-md: 3px;   /* buttons */
--radius-lg: 6px;   /* cards, product images */
/* nothing above 6px — see "Forbidden" below */

--shadow-sm: 0 1px 2px rgba(20, 32, 46, 0.06);            /* resting card */
--shadow-md: 0 12px 32px -18px rgba(20, 32, 46, 0.28);     /* hover-lift, dropdowns, modals */

--motion-duration: 160ms;
--motion-ease: cubic-bezier(0.4, 0, 0.2, 1);
/* animate specific properties only (transform, background-color, border-color, box-shadow) — never `transition: all` */
```

## 4. Interactive states

Every clickable element needs all four states defined below — never ship default/hover only.

**Primary button (CTA)**
- Default: bg `clay-600`, text `porcelain`, `radius-md`, `shadow-sm`
- Hover: bg `clay-700`, `shadow-md`, `translateY(-1px)`
- Active/pressed: bg `clay-800`, `translateY(0)`, shadow removed
- Focus-visible: `2px solid ink-900` outline, `2px` offset — never remove the browser outline without replacing it
- Disabled: bg `ink-100`, text `ink-300`, no shadow, no hover/active response, `cursor: not-allowed`

**Secondary / ghost button**
- Default: transparent bg, `1px solid ink-900` border, `ink-900` text
- Hover: bg `mist`
- Active: bg `ink-100`
- Focus-visible: same `2px solid ink-900` outline
- Disabled: `ink-100` border, `ink-300` text

**Text link**
- Default: `steel-600`, no underline
- Hover / active: `steel-700`, underline
- Focus-visible: `2px solid ink-900` outline, `2px` offset

**Form input**
- Default: bg `porcelain`, `1px solid ink-100` border, `ink-900` text, `radius-sm`
- Focus: border `steel-600` + `0 0 0 3px steel-100` ring
- Error: border `error-600`, helper text `error-600`
- Disabled: bg `mist`, text `ink-300`, border `ink-100`

## 5. Forbidden — this brand's specific anti-patterns

- **No default framework palette colors** (Tailwind `blue-500` #3B82F6, `indigo-*`, `purple-*`, etc.) — use `steel-600`, never a generic UI blue.
- **No neon/alarm red** (`#FF0000`, `#EF4444`-style) — always the `clay` family. It's a device accent, not a warning light.
- **No pastel wellness colors** — no mint, no lavender, no soft blush. Those belong to the Spa/Feminine options that weren't chosen; mixing them in dilutes the "engineered, not decorated" read.
- **No radius above 6px, ever** — no pill buttons, no fully-rounded cards. Soft/rounded reads as a friendly consumer app; this brand reads as precise instrumentation.
- **No floating "soft UI" drop shadows** — shadows are the two tokens above, used sparingly (hover states, dropdowns/modals), never as decoration on static cards.
- **No `transition: all`** — animate named properties only, 160ms, no bounce/spring easing.
- **No gradients** — flat color only, including on any future logo mark or CTA button.
- **No soft-focus golden-hour lifestyle stock photography** — see imagery below.
- **No therapeutic/diagnostic language** ("treats," "cures," "relieves migraines") and no restoring the unverified 660nm/850nm/clinical-irradiance claims — both are covered in `CLAUDE.md` → "Claim integrity," binding regardless of visual system.

## 6. Imagery

- Product photography: seamless `porcelain` or `mist` background, consistent with the device's actual silver/white body and its own colorful LED glow (see `sourcing/` PDF) — let the product's real accent light be the color moment, don't add another one in post.
- Lifestyle/context photography: real desk environments (laptop, forward-head posture) over generic "woman touching neck, smiling" stock wellness photography — check against `brand/AVATAR_SHEET.md` before selecting any stock image.
- Diagrams/mechanism illustrations: `steel-600` line work on `porcelain`, matching the clinical-diagram style already present in the sourcing material. No neon medical-illustration greens/reds.
- All current product images in `brand/assets/placeholders/` are AI-generated placeholders (flagged in that folder's README) — replace with real photography before any customer-facing publish, per rule 3.

## 7. Logo

No logo exists yet. Whatever mark is designed must work as flat `ink-900` (or reversed: `porcelain` on `ink-900`) with no gradient, no drop shadow, at both a small favicon size and a full wordmark size. Flag this doc for an update once one exists.

## 8. Voice, briefly

Full positioning lives in `offer/OFFER_BRIEF.md` and `brand/AVATAR_SHEET.md` — this is the visual system's voice complement, not a replacement:
- **Precise, not hypey.** Say what the device does in plain, specific terms (heat, vibration, pulse modes, red light) — the typography is already doing the "premium" work, copy doesn't need to oversell on top of it.
- **Structural language**, per `CLAUDE.md` → "Claim integrity": "supports," "designed to," "may help relax" — never "treats" or "cures."
- **Unhurried sentences.** Short, declarative, confident. No stacked exclamation points, no scarcity theater beyond what's actually true.

## 9. Reference implementation — example applied

```
Kicker:    HEAT · PULSE · RED LIGHT                     (steel-600, label style)
Headline:  Heat, pulse & red light —
           engineered for the always-on neck.            (ink-900, Display)
Subhead:   Wireless, hands-free relief for the tension    (ink-700, Body Large)
           a desk-bound day leaves behind.
CTA:       [ Shop the Neck Relax — $499 ]                 (clay-600 bg, porcelain text)
```

## 10. Drop-in CSS

```css
:root {
  --color-ink-900: #14202E;
  --color-ink-700: #3C4753;
  --color-ink-500: #5B6672;
  --color-ink-300: #9AA3AA;
  --color-ink-100: #DCE3E6;
  --color-porcelain: #FAF9F6;
  --color-mist: #EEF2F3;

  --color-clay-600: #C1502E;
  --color-clay-700: #A43F22;
  --color-clay-800: #832F19;
  --color-clay-100: #F5DCD3;

  --color-steel-600: #4C6B7A;
  --color-steel-700: #38505C;
  --color-steel-100: #DCE9EC;

  --color-success-600: #4B7A5E;
  --color-success-100: #DDEAE0;
  --color-warning-600: #B8863E;
  --color-warning-100: #F3E6D3;
  --color-error-600: #A43F22;
  --color-error-100: #F5DCD3;

  --font-family-base: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;

  --space-4: 4px;   --space-8: 8px;   --space-12: 12px;  --space-16: 16px;
  --space-24: 24px; --space-32: 32px; --space-48: 48px;  --space-64: 64px; --space-96: 96px;

  --radius-sm: 2px;
  --radius-md: 3px;
  --radius-lg: 6px;

  --shadow-sm: 0 1px 2px rgba(20, 32, 46, 0.06);
  --shadow-md: 0 12px 32px -18px rgba(20, 32, 46, 0.28);

  --motion-duration: 160ms;
  --motion-ease: cubic-bezier(0.4, 0, 0.2, 1);
}
```

Reference build showing all five original options (this one is Option A): see the published artifact linked from the 2026-08-23 conversation, or ask Claude to regenerate it from this doc.
