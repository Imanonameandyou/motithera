# MotiThera Neck Relax — Presell + PDP Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task (Inline Execution — see "Why inline, not subagent-driven" below). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the MotiThera Neck Relax product page as a presell + PDP hybrid, structured section-by-section on the Kineon swipe, as an alternate Shopify product template (`product.presell.json`) in a duplicated Horizon draft theme.

**Architecture:** Horizon (the store's current theme) is a block-composition theme, not a classic one-file-per-section theme — pages are built by nesting existing block primitives (`group`, `text`, `image`, `icon`, `button`, `accordion`, `_divider`, `_marquee`, `spacer`, `payment-icons`) inside a small set of section shells (`hero.liquid`, `media-with-content.liquid`, `section.liquid` generic canvas, `marquee.liquid`), all defined in JSON template files. This plan composes the whole page from those existing primitives — confirmed against their real `{% schema %}` definitions below — rather than writing new bespoke `.liquid` section files. The only reused *section* with real business logic is `product-information` (the native buy box: media gallery, variant picker, buy buttons), restyled and repositioned rather than rebuilt.

**Tech Stack:** Shopify CLI v4.7.0, Shopify Horizon theme (JSON template / block architecture), Liquid, Puppeteer (`screenshot.mjs`) for visual verification, Higgsfield MCP for placeholder image generation.

**Spec:** `docs/superpowers/specs/2026-08-24-product-presell-page-design.md` — read it first, it has the full claim-integrity reasoning behind what's included/omitted below.

## Why inline, not subagent-driven

Every task in this plan edits the same live theme-dev preview and the same JSON files, and each task's screenshot verification depends on the previous task's section already being in place. This doesn't decompose into independent, isolable units the way subagent-driven execution wants — do it inline, one task at a time, in this session.

## Global Constraints

- Never edit theme id `163498656002` (LullyRest's live draft) or push to the live theme. All work happens in theme id `163621273858` ("MotiThera — Presell + PDP (draft)", role `unpublished`).
- Store: `gcvy0q-cb.myshopify.com`. Product: `gid://shopify/Product/9595773681922` (DRAFT status — stays DRAFT through this whole plan).
- No claims beyond: heat (42°C constant), 4-node vibration massage, low-frequency pulse modes, soft red light, wireless/USB-C rechargeable, 60-day money-back guarantee (prepaid return shipping), 1-year hardware warranty. No ATP/nitric-oxide/PBM/660nm/850nm/clinical-irradiance language anywhere. No fabricated star ratings, review counts, clinician endorsements, press logos, or stats/citations.
- Brand tokens (from `brand/BRAND_GUIDE.md`): ink `#14202E`, porcelain `#FAF9F6`, mist `#EEF2F3`, clay `#C1502E`/`#A43F22`/`#832F19`, steel `#4C6B7A`/`#38505C`. Radii max 6px, no pills. Inter only.
- Every file change that touches theme/product data gets logged in `PROGRESS.md` per CLAUDE.md rule 5. Commit + `git push origin main` after each task per rule 7.
- Visual verification: `shopify theme dev --theme 163621273858 --store gcvy0q-cb.myshopify.com --path theme`, screenshot via `node screenshot.mjs <url> [label]`, compare against the matching `swipe/FireShot Capture 023...` crop.

---

## Task 1: Duplicate theme (DONE)

Already completed this session: pulled Horizon (`163498262786`) to `theme/`, pushed as new unpublished theme `163621273858` ("MotiThera — Presell + PDP (draft)"). No further action — record this in PROGRESS.md as part of Task 16's log entry.

---

## Task 2: Global design tokens

**Files:**
- Modify: `theme/config/settings_data.json` (the `"current"` object)

**Interfaces:**
- Produces: a theme where `settings.color_palette.background/foreground/color1/color2` and the primary/secondary button palette match Brand Guide tokens — every later section that references `settings.color_palette.*` or leaves a color field blank inherits these.

- [ ] **Step 1: Read current values**

Confirmed already present in `theme/config/settings_data.json` → `current`:
```
"color_palette": {"background": "#ffffff", "foreground": "#000000", "color1": "#333333", "color2": "#DFDFDF"}
"type_body_font": "inter_n4"
"type_heading_font": "inter_n7"
"palette_primary_button_background": "{{ settings.color_palette.foreground }}"
"palette_primary_button_text": "{{ settings.color_palette.background }}"
"button_border_radius_primary": 14
"product_corner_radius": 0
"card_corner_radius": 4
```
Fonts are already Inter (`inter_n4`/`inter_n7`) — no font change needed. Colors and the 14px pill radius need to change.

- [ ] **Step 2: Edit `theme/config/settings_data.json`**

Set these keys inside `"current"` (keep every other existing key untouched):
```json
"color_palette": {
  "background": "#FAF9F6",
  "foreground": "#14202E",
  "color1": "#4C6B7A",
  "color2": "#EEF2F3"
},
"palette_primary_button_background": "#C1502E",
"palette_primary_button_text": "#FAF9F6",
"palette_primary_button_border": "#C1502E",
"button_border_radius_primary": 3,
"palette_secondary_button_background": "#FAF9F6",
"palette_secondary_button_text": "#14202E",
"palette_secondary_button_border": "#14202E",
"button_border_radius_secondary": 3,
"product_corner_radius": 6,
"card_corner_radius": 6,
"popover_border_radius": 6,
"inputs_border_radius": 2
```
(`popover_border_radius` / `inputs_border_radius` keys were both present in the original current-keys list — reuse them as-is with these new values, don't invent new keys.)

- [ ] **Step 3: Start theme dev and verify**

```bash
shopify theme dev --theme 163621273858 --store gcvy0q-cb.myshopify.com --path theme
```
Leave running in the background for the rest of this plan (Shopify's live-reload preview at `http://127.0.0.1:9292`, restart only if it crashes).

- [ ] **Step 4: Screenshot the homepage and check tokens applied**

```bash
node screenshot.mjs http://127.0.0.1:9292 homepage-tokens
```
Read the PNG. Expected: porcelain background, ink text, any primary button shows clay `#C1502E` background with a 3px (not pill) radius. If a button still looks black/pill-shaped, the theme dev server needs a restart to pick up the settings_data.json change.

- [ ] **Step 5: Commit**

```bash
git add theme/config/settings_data.json
git commit -m "Apply MotiThera brand tokens (clay/ink/porcelain/steel, tight radii) to draft theme"
git push origin main
```

---

## Task 3: Generate placeholder image assets

**Files:**
- Create: 11 new files under `brand/assets/placeholders/`
- Modify: `brand/assets/placeholders/README.md`

- [ ] **Step 1: Generate via Higgsfield `generate_image_batch`**

11 independent generations, same restrained "Clinical Authority" photographic style as the existing 3 placeholders (seamless porcelain/mist background or realistic desk environment, no soft-focus golden-hour stock-photo look, per `brand/BRAND_GUIDE.md` §6 Imagery):

Pain-state close-ups (6, for the use-case grid — close-up of neck/shoulder/hand-on-neck, no faces needed, matches Kineon's tile style):
1. `motithera-usecase-coathanger-tension.png` — close-up, hand gripping back of neck/trapezius, desk visible in soft background
2. `motithera-usecase-trap-knot.png` — close-up on shoulder/trapezius area, tension implied
3. `motithera-usecase-tension-headache.png` — close-up, hand at base of skull/neck
4. `motithera-usecase-stiff-rotation.png` — person mid-turn of the neck, desk setting
5. `motithera-usecase-evening-tightness.png` — close-up, shoulder area, evening/low light desk lamp
6. `motithera-usecase-post-call-tension.png` — close-up, person at laptop rubbing neck after a call

On-body product shots (2):
7. `motithera-onbody-hero.png` — device worn on neck/shoulders from behind, dark/moody background, red light glow visible (for the hero section, matches Kineon's hero framing)
8. `motithera-onbody-feature-panel.png` — device worn, closer detail crop showing the red light glow and strap, dark background (for the dark feature panel)

Step-by-step usage photos (3):
9. `motithera-step1-position.png` — hands positioning the wrap around the neck
10. `motithera-step2-power-on.png` — close-up on the device's power button/mode selector being pressed
11. `motithera-step3-wear-hands-free.png` — person wearing the device hands-free at a desk, working normally

- [ ] **Step 2: Save and confirm**

Save all 11 to `brand/assets/placeholders/`. Confirm file count:
```bash
ls "c:\Users\jomat_nweuhlk\Desktop\MotiThera\brand\assets\placeholders" | wc -l
```
Expected: 14 (3 existing + 11 new) plus the README.

- [ ] **Step 3: Update README and commit**

Add the 11 new filenames to `brand/assets/placeholders/README.md`'s existing placeholder-tracking list (same format as the 3 already documented there — AI-generated, swap before publish).

```bash
git add brand/assets/placeholders/
git commit -m "Generate 11 additional Higgsfield placeholder images for the presell page"
git push origin main
```

---

## Task 4: Warm-traffic shortcut (announcement bar + header)

**Files:**
- Modify: `theme/sections/header-group.json` (the header-announcements section's blocks)

**Interfaces:**
- Produces: an announcement bar and header link both pointing to `#shopify-section-main` (the buy box's DOM anchor, confirmed by Shopify convention: a section keyed `"main"` in a JSON template renders with `id="shopify-section-main"` — no custom id-setting needed).

- [ ] **Step 1: Read the current header-group.json**

```bash
cat "theme/sections/header-group.json"
```
Confirm the `header-announcements` section's block structure (type `_announcement`, per the earlier `blocks/_announcement.liquid` file) and the header's own logo/menu block layout — this file is shared across every page (not the presell template), so only add/edit an announcement block, don't remove existing header nav functionality.

- [ ] **Step 2: Edit the announcement block**

In the `header-announcements` section's blocks, set (or add) one `_announcement` block:
```json
{
  "type": "_announcement",
  "settings": {
    "text": "<p>$200 off — save while it lasts</p>",
    "link": "#shopify-section-main"
  }
}
```
(Read `blocks/_announcement.liquid`'s schema first to confirm the exact setting id names before writing — likely `text` and `link` based on the pattern seen in every other text/link block so far, but verify against the source rather than assuming.)

- [ ] **Step 3: Screenshot and verify**

```bash
node screenshot.mjs http://127.0.0.1:9292 header-announcement
```
Confirm the announcement bar shows the $200-off message and, when clicked in a real browser, jumps to the buy box once Task 12 exists (can't fully verify the jump target until then — just confirm the bar renders correctly now).

- [ ] **Step 4: Commit**

```bash
git add theme/sections/header-group.json
git commit -m "Add warm-traffic shortcut: announcement bar links to buy box anchor"
git push origin main
```

---

## Task 5: Hero section

**Files:**
- Create (content only, inside the template being assembled in Task 15): the `hero` section block within `theme/templates/product.presell.json`

Work this task in a scratch/staging JSON file first — `theme/templates/product.presell.json` doesn't exist until Task 15 assembles all sections together. For Tasks 5–14, accumulate each section's JSON in a working document you'll merge in Task 15 (a local scratch file in the scratchpad directory, not committed).

**Interfaces:**
- Consumes: `brand/assets/placeholders/motithera-onbody-hero.png` (Task 3)
- Produces: a `hero` section definition matching `sections/hero.liquid`'s confirmed schema (accepts blocks: `text`, `button`, `logo`, `jumbo-text`, `spacer`, `group`, `_marquee`)

- [ ] **Step 1: Upload the hero placeholder as a theme asset or reference via Files**

Product/section images in Shopify JSON templates reference either a `shopify://shop_images/<filename>` URL (if uploaded to Shopify Files) or an `assets/<file>` theme asset. Upload `motithera-onbody-hero.png` to the store's Files via `shopify theme push --only assets/motithera-onbody-hero.png` after copying it into `theme/assets/`, OR use the `image_picker` field in the theme editor UI (image_picker settings reference an uploaded image by its Shopify CDN GID, not a raw path — resolve this by copying the file into `theme/assets/motithera-onbody-hero.png` and referencing it as `"image": "shopify://shop_images/motithera-onbody-hero.png"` after the push uploads it; confirm the exact reference format `shopify theme push` reports back, since `image_picker` values are GIDs assigned at upload time, not filenames).

- [ ] **Step 2: Write the hero section JSON**

```json
{
  "type": "hero",
  "blocks": {
    "kicker": {
      "type": "text",
      "settings": {
        "text": "<p>HEAT · PULSE · RED LIGHT</p>",
        "type_preset": "h6",
        "case": "uppercase",
        "text_color": "#4C6B7A"
      }
    },
    "headline": {
      "type": "text",
      "settings": {
        "text": "<h1>Heat, pulse &amp; red light — engineered for the always-on neck.</h1>",
        "type_preset": "h1",
        "text_color": "#FAF9F6"
      }
    },
    "subhead": {
      "type": "text",
      "settings": {
        "text": "<p>Wireless, hands-free relief for the tension a desk-bound day leaves behind.</p>",
        "type_preset": "paragraph",
        "text_color": "#FAF9F6"
      }
    },
    "trust_bullets": {
      "type": "text",
      "settings": {
        "text": "<p>✓ Wireless &amp; hands-free &nbsp; ✓ USB-C rechargeable &nbsp; ✓ Designed for desk-day wear</p>",
        "type_preset": "paragraph",
        "text_color": "#FAF9F6"
      }
    },
    "cta": {
      "type": "button",
      "settings": {
        "label": "Shop the Neck Relax — $499",
        "link": "#shopify-section-main",
        "style_class": "button"
      }
    }
  },
  "block_order": ["kicker", "headline", "subhead", "trust_bullets", "cta"],
  "settings": {
    "media_type_1": "image",
    "image_1": "shopify://shop_images/motithera-onbody-hero.png",
    "content_position": "middle-left"
  }
}
```
(`content_position` and any other hero-level layout settings not yet inspected — read the remainder of `sections/hero.liquid`'s schema past the `media_2`/`media_3` block, which was cut off during discovery, before finalizing this settings object; the block content above is confirmed against the schema already read.)

- [ ] **Step 2: Screenshot and compare**

```bash
node screenshot.mjs http://127.0.0.1:9292 hero-section
```
Compare against `swipe/FireShot Capture 023...` crop-00 (top of page, the dark hero with on-body photo). Check: dark background readable text, clay CTA button with 3px radius, on-body image visible on the right.

- [ ] **Step 3: Commit the scratch progress**

Not a real commit target yet (JSON lives in scratch until Task 15) — skip git commit for this task, note completion and move to Task 6.

---

## Task 6: Problem-agitation section

**Files:** same scratch-JSON approach as Task 5.

**Interfaces:**
- Consumes: an existing product/context photo — reuse `brand/assets/placeholders/motithera-neck-relax-detail.png` (one of the original 3) or a stock-style desk photo if preferred; no new asset required here per the design spec (photo already existed for this slot's Kineon equivalent — a person holding their neck).
- Produces: a `media-with-content` section keyed `problem_agitation`, following the confirmed `_media-without-appearance` + `_content-without-appearance` pattern.

- [ ] **Step 1: Write the section JSON**

```json
{
  "type": "media-with-content",
  "settings": {
    "media_position": "right",
    "media_width": "medium",
    "media_height": "auto",
    "background_color": "#FAF9F6"
  },
  "blocks": {
    "media": {
      "type": "_media-without-appearance",
      "static": true,
      "settings": {
        "media_type": "image",
        "image": "shopify://shop_images/motithera-neck-relax-detail.png"
      }
    },
    "content": {
      "type": "_content-without-appearance",
      "static": true,
      "settings": {
        "horizontal_alignment_flex_direction_column": "flex-start",
        "vertical_alignment_flex_direction_column": "center"
      },
      "blocks": {
        "heading": {
          "type": "text",
          "settings": {
            "text": "<h2>Neck and shoulder tension rarely stays in one spot.</h2>",
            "type_preset": "h2"
          }
        },
        "body": {
          "type": "text",
          "settings": {
            "text": "<p>The burning \"coat hanger\" ache across your traps by mid-afternoon. Rock-hard knots that come back no matter how much you stretch. Tension headaches that start at the base of your skull. A stiff neck that won't fully rotate by the end of a desk day. Shoulder tightness that follows you into the evening.</p>",
            "type_preset": "rte",
            "max_width": "narrow"
          }
        }
      },
      "block_order": ["heading", "body"]
    }
  },
  "block_order": ["media", "content"]
}
```

- [ ] **Step 2: Screenshot and compare**

```bash
node screenshot.mjs http://127.0.0.1:9292 problem-agitation
```
Compare against swipe crop-00, the "Neck and shoulder pain rarely stays in one spot" block. Verify image/text side-by-side layout and that copy reads as structural pain description (no diagnostic claims).

---

## Task 7: Use-case grid section (6 tiles)

**Files:** scratch JSON.

**Interfaces:**
- Consumes: the 6 use-case placeholder images from Task 3.
- Produces: a `section` (generic canvas) keyed `use_case_grid`, using nested `group` blocks (confirmed: `section.liquid` accepts `@theme` blocks, and `group.liquid` also accepts `@theme` blocks, so groups nest inside groups).

- [ ] **Step 1: Write the section JSON**

```json
{
  "type": "section",
  "settings": {
    "content_direction": "column",
    "horizontal_alignment": "center",
    "background_color": "#FAF9F6",
    "padding-block-start": 64,
    "padding-block-end": 64
  },
  "blocks": {
    "kicker": {
      "type": "text",
      "settings": { "text": "<p>USE CASES</p>", "type_preset": "h6", "case": "uppercase", "alignment": "center" }
    },
    "heading": {
      "type": "text",
      "settings": { "text": "<h2>How the Neck Relax Can Help</h2>", "type_preset": "h2", "alignment": "center" }
    },
    "grid": {
      "type": "group",
      "settings": { "content_direction": "row", "vertical_on_mobile": true, "gap": 16, "width": "fill" },
      "blocks": {
        "tile_1": { "type": "group", "settings": {"content_direction": "column", "width": "fill"}, "blocks": {
          "img": {"type": "image", "settings": {"image": "shopify://shop_images/motithera-usecase-coathanger-tension.png"}},
          "label": {"type": "text", "settings": {"text": "<p>Afternoon coat-hanger tension</p>", "type_preset": "h6"}}
        }, "block_order": ["img", "label"]},
        "tile_2": { "type": "group", "settings": {"content_direction": "column", "width": "fill"}, "blocks": {
          "img": {"type": "image", "settings": {"image": "shopify://shop_images/motithera-usecase-trap-knot.png"}},
          "label": {"type": "text", "settings": {"text": "<p>Trapezius knots</p>", "type_preset": "h6"}}
        }, "block_order": ["img", "label"]},
        "tile_3": { "type": "group", "settings": {"content_direction": "column", "width": "fill"}, "blocks": {
          "img": {"type": "image", "settings": {"image": "shopify://shop_images/motithera-usecase-tension-headache.png"}},
          "label": {"type": "text", "settings": {"text": "<p>Tension headaches from screen posture</p>", "type_preset": "h6"}}
        }, "block_order": ["img", "label"]},
        "tile_4": { "type": "group", "settings": {"content_direction": "column", "width": "fill"}, "blocks": {
          "img": {"type": "image", "settings": {"image": "shopify://shop_images/motithera-usecase-stiff-rotation.png"}},
          "label": {"type": "text", "settings": {"text": "<p>Stiff neck rotation</p>", "type_preset": "h6"}}
        }, "block_order": ["img", "label"]},
        "tile_5": { "type": "group", "settings": {"content_direction": "column", "width": "fill"}, "blocks": {
          "img": {"type": "image", "settings": {"image": "shopify://shop_images/motithera-usecase-evening-tightness.png"}},
          "label": {"type": "text", "settings": {"text": "<p>End-of-day shoulder tightness</p>", "type_preset": "h6"}}
        }, "block_order": ["img", "label"]},
        "tile_6": { "type": "group", "settings": {"content_direction": "column", "width": "fill"}, "blocks": {
          "img": {"type": "image", "settings": {"image": "shopify://shop_images/motithera-usecase-post-call-tension.png"}},
          "label": {"type": "text", "settings": {"text": "<p>Post-call, post-meeting tension</p>", "type_preset": "h6"}}
        }, "block_order": ["img", "label"]}
      },
      "block_order": ["tile_1", "tile_2", "tile_3", "tile_4", "tile_5", "tile_6"]
    }
  },
  "block_order": ["kicker", "heading", "grid"]
}
```
Note: a `row` direction group with 6 fixed-width children will overflow on desktop past 3-per-row typically wraps via flexbox `flex-wrap` — verify visually in Step 2; if it doesn't wrap (Horizon's `group` may not set `flex-wrap: wrap` by default for `row` direction), split `grid` into two row-groups of 3 tiles each (`row_1`: tiles 1–3, `row_2`: tiles 4–6) instead of one row of 6.

- [ ] **Step 2: Screenshot and compare**

```bash
node screenshot.mjs http://127.0.0.1:9292 use-case-grid
```
Compare against swipe crop-00's 6-tile "How Targeted Light Therapy Can Help" grid. If tiles don't wrap into 2 rows of 3 as expected, apply the two-row-group fix from Step 1's note and re-screenshot.

---

## Task 8: Benefit icon grid section

**Files:** scratch JSON.

**Interfaces:**
- Produces: a `section` keyed `benefit_grid`, using `icon` + `text` pairs inside `group` blocks (icon enum confirmed: `fire`, `lightning_bolt`, `stopwatch`, `heart` available and usable here).

- [ ] **Step 1: Write the section JSON**

```json
{
  "type": "section",
  "settings": {
    "content_direction": "column",
    "horizontal_alignment": "center",
    "background_color": "#EEF2F3",
    "padding-block-start": 64,
    "padding-block-end": 64
  },
  "blocks": {
    "heading": {
      "type": "text",
      "settings": { "text": "<h2>How the Neck Relax May Help</h2>", "type_preset": "h2", "alignment": "center" }
    },
    "row": {
      "type": "group",
      "settings": { "content_direction": "row", "vertical_on_mobile": true, "gap": 24, "width": "fill" },
      "blocks": {
        "b1": {"type": "group", "settings": {"content_direction": "column", "horizontal_alignment": "center"}, "blocks": {
          "icon": {"type": "icon", "settings": {"icon": "fire", "icon_color": "#C1502E"}},
          "text": {"type": "text", "settings": {"text": "<p>May help ease surface tension</p>", "type_preset": "paragraph", "alignment": "center"}}
        }, "block_order": ["icon", "text"]},
        "b2": {"type": "group", "settings": {"content_direction": "column", "horizontal_alignment": "center"}, "blocks": {
          "icon": {"type": "icon", "settings": {"icon": "lightning_bolt", "icon_color": "#C1502E"}},
          "text": {"type": "text", "settings": {"text": "<p>Designed to support relaxation</p>", "type_preset": "paragraph", "alignment": "center"}}
        }, "block_order": ["icon", "text"]},
        "b3": {"type": "group", "settings": {"content_direction": "column", "horizontal_alignment": "center"}, "blocks": {
          "icon": {"type": "icon", "settings": {"icon": "stopwatch", "icon_color": "#C1502E"}},
          "text": {"type": "text", "settings": {"text": "<p>Rhythmic, adjustable pulse intensity</p>", "type_preset": "paragraph", "alignment": "center"}}
        }, "block_order": ["icon", "text"]},
        "b4": {"type": "group", "settings": {"content_direction": "column", "horizontal_alignment": "center"}, "blocks": {
          "icon": {"type": "icon", "settings": {"icon": "heart", "icon_color": "#C1502E"}},
          "text": {"type": "text", "settings": {"text": "<p>A calming addition to your routine</p>", "type_preset": "paragraph", "alignment": "center"}}
        }, "block_order": ["icon", "text"]}
      },
      "block_order": ["b1", "b2", "b3", "b4"]
    }
  },
  "block_order": ["heading", "row"]
}
```

- [ ] **Step 2: Screenshot and compare**

```bash
node screenshot.mjs http://127.0.0.1:9292 benefit-grid
```
Compare against swipe crop-00's "How the MOVE+ Helps" icon grid. Confirm 4 icons in a row (wrapping to 2x2 on mobile), clay-colored icons, structural (not therapeutic) language.

---

## Task 9: Dark feature panel section

**Files:** scratch JSON.

**Interfaces:**
- Consumes: `brand/assets/placeholders/motithera-onbody-feature-panel.png`
- Produces: a `media-with-content` section keyed `feature_panel`, dark background, 5 feature rows.

- [ ] **Step 1: Write the section JSON**

```json
{
  "type": "media-with-content",
  "settings": {
    "media_position": "left",
    "media_width": "medium",
    "media_height": "auto",
    "background_color": "#14202E"
  },
  "blocks": {
    "media": {
      "type": "_media-without-appearance",
      "static": true,
      "settings": { "media_type": "image", "image": "shopify://shop_images/motithera-onbody-feature-panel.png" }
    },
    "content": {
      "type": "_content-without-appearance",
      "static": true,
      "settings": { "horizontal_alignment_flex_direction_column": "flex-start", "vertical_alignment_flex_direction_column": "center" },
      "blocks": {
        "heading": {
          "type": "text",
          "settings": { "text": "<h2>Built for how you actually work</h2>", "type_preset": "h2", "text_color": "#FAF9F6" }
        },
        "rows": {
          "type": "group",
          "settings": { "content_direction": "column", "gap": 16 },
          "blocks": {
            "r1": {"type": "text", "settings": {"text": "<p><strong>Constant 42°C heat</strong> — steady warmth, no fiddling with settings</p>", "type_preset": "paragraph", "text_color": "#FAF9F6"}},
            "r2": {"type": "text", "settings": {"text": "<p><strong>4-node vibration massage</strong> — targets the neck and both shoulders at once</p>", "type_preset": "paragraph", "text_color": "#FAF9F6"}},
            "r3": {"type": "text", "settings": {"text": "<p><strong>Low-frequency pulse modes</strong> — adjustable intensity, your choice</p>", "type_preset": "paragraph", "text_color": "#FAF9F6"}},
            "r4": {"type": "text", "settings": {"text": "<p><strong>Soft red light</strong> — a calming glow while you work</p>", "type_preset": "paragraph", "text_color": "#FAF9F6"}},
            "r5": {"type": "text", "settings": {"text": "<p><strong>Wireless &amp; USB-C rechargeable</strong> — no cords, no wall tether</p>", "type_preset": "paragraph", "text_color": "#FAF9F6"}}
          },
          "block_order": ["r1", "r2", "r3", "r4", "r5"]
        }
      },
      "block_order": ["heading", "rows"]
    }
  },
  "block_order": ["media", "content"]
}
```

- [ ] **Step 2: Screenshot and compare**

```bash
node screenshot.mjs http://127.0.0.1:9292 feature-panel
```
Compare against swipe crop-01's "Built For Targeted Treatments" dark panel. Confirm dark ink background, porcelain text, 5 real spec rows (not the Kineon originals).

---

## Task 10: How-to-use 3-step section

**Files:** scratch JSON.

**Interfaces:**
- Consumes: the 3 step placeholder images from Task 3.
- Produces: a `section` keyed `how_to_steps`.

- [ ] **Step 1: Write the section JSON**

```json
{
  "type": "section",
  "settings": {
    "content_direction": "column",
    "horizontal_alignment": "center",
    "background_color": "#14202E",
    "padding-block-start": 64,
    "padding-block-end": 64
  },
  "blocks": {
    "heading": {
      "type": "text",
      "settings": { "text": "<h2>How Do I Use The Neck Relax?</h2>", "type_preset": "h2", "alignment": "center", "text_color": "#FAF9F6" }
    },
    "steps": {
      "type": "group",
      "settings": { "content_direction": "row", "vertical_on_mobile": true, "gap": 24, "width": "fill" },
      "blocks": {
        "s1": {"type": "group", "settings": {"content_direction": "column"}, "blocks": {
          "img": {"type": "image", "settings": {"image": "shopify://shop_images/motithera-step1-position.png"}},
          "label": {"type": "text", "settings": {"text": "<p><strong>Step 1</strong><br>Position the wrap around your neck and shoulders</p>", "type_preset": "paragraph", "text_color": "#FAF9F6"}}
        }, "block_order": ["img", "label"]},
        "s2": {"type": "group", "settings": {"content_direction": "column"}, "blocks": {
          "img": {"type": "image", "settings": {"image": "shopify://shop_images/motithera-step2-power-on.png"}},
          "label": {"type": "text", "settings": {"text": "<p><strong>Step 2</strong><br>Power on and select your mode</p>", "type_preset": "paragraph", "text_color": "#FAF9F6"}}
        }, "block_order": ["img", "label"]},
        "s3": {"type": "group", "settings": {"content_direction": "column"}, "blocks": {
          "img": {"type": "image", "settings": {"image": "shopify://shop_images/motithera-step3-wear-hands-free.png"}},
          "label": {"type": "text", "settings": {"text": "<p><strong>Step 3</strong><br>Wear it hands-free — at your desk, on a call, or winding down</p>", "type_preset": "paragraph", "text_color": "#FAF9F6"}}
        }, "block_order": ["img", "label"]}
      },
      "block_order": ["s1", "s2", "s3"]
    }
  },
  "block_order": ["heading", "steps"]
}
```

- [ ] **Step 2: Screenshot and compare**

```bash
node screenshot.mjs http://127.0.0.1:9292 how-to-steps
```
Compare against swipe crop-01's "How Do I Use The MOVE+ PRO?" 3-step block.

---

## Task 11: Trust marquee ticker section

**Files:** scratch JSON.

**Interfaces:**
- Produces: a `marquee` section (native Horizon component — `assets/marquee.js` already handles the scroll animation, no custom JS needed).

- [ ] **Step 1: Write the section JSON**

```json
{
  "type": "marquee",
  "settings": {
    "movement_direction": "normal",
    "background_color": "#EEF2F3",
    "gap_between_elements": 48
  },
  "blocks": {
    "t1": {"type": "text", "settings": {"text": "Heat + Pulse + Red Light"}},
    "d1": {"type": "_divider"},
    "t2": {"type": "text", "settings": {"text": "Wireless & Hands-Free"}},
    "d2": {"type": "_divider"},
    "t3": {"type": "text", "settings": {"text": "USB-C Rechargeable"}},
    "d3": {"type": "_divider"},
    "t4": {"type": "text", "settings": {"text": "60-Day Guarantee"}},
    "d4": {"type": "_divider"},
    "t5": {"type": "text", "settings": {"text": "1-Year Warranty"}}
  },
  "block_order": ["t1", "d1", "t2", "d2", "t3", "d3", "t4", "d4", "t5"]
}
```
Read `blocks/text.liquid`'s schema once more here — the `text` setting elsewhere took HTML (`<p>...</p>`); confirm whether the marquee's `text` block wants plain text or HTML (check `blocks/_marquee.liquid` or however the marquee text block differs from the standalone `text.liquid`, since marquee accepts a `text` block type per its schema's `blocks` list, not necessarily identical settings to the standalone block) before finalizing — adjust to `<p>Heat + Pulse + Red Light</p>` etc. if HTML is required.

- [ ] **Step 2: Screenshot and compare**

```bash
node screenshot.mjs http://127.0.0.1:9292 trust-marquee
```
Compare against swipe crop-01's scrolling trust-badge strip. Confirm it auto-scrolls (marquee.js) and only true claims appear.

---

## Task 12: Buy box (restyle existing product-information section)

**Files:**
- Base content: `theme/templates/product.json`'s `"main"` section (the `product-information` type already read in full during discovery)

**Interfaces:**
- Produces: a `main` section (type `product-information`) carried into `product.presell.json`, restyled to brand tokens, stripped of anything implying reviews/ratings we don't have (the section as pulled has no rating/review block at all — good, nothing to remove there), with real guarantee/warranty copy added.

- [ ] **Step 1: Copy the `main` section object from `theme/templates/product.json` into the scratch document as-is** — it already has media-gallery, product title, price, variant-picker, buy-buttons (quantity + add-to-cart + accelerated-checkout), and a `disclosures` block plus a product-description text block. This is the real buy box; don't rebuild it.

- [ ] **Step 2: Edit the `disclosures_g9mWze` block's heading and content**

Change its `heading` setting from `"Disclosures"` to `"Guarantee & Warranty"`, and add a nested text block inside it (the `disclosures` block type accepts `@theme`/`@app` per typical accordion-style blocks — confirm via `blocks/disclosures.liquid` schema) with:
```
<p>60-day money-back guarantee — try it at home, and if it's not for you, send it back for a full refund. We cover return shipping.</p>
<p>1-year hardware warranty against manufacturing defects.</p>
```

- [ ] **Step 3: Update the `text_aEtTtq` product-description block's settings if needed** — leave `"text": "{{ closest.product.description }}"` as-is (it pulls the real product description already written to Shopify per PROGRESS.md 2026-08-23, no hardcoded duplicate copy needed here).

- [ ] **Step 4: Add an `id`/anchor confirmation** — no action needed; Shopify auto-generates `id="shopify-section-main"` for a section keyed `"main"`, which Task 4's announcement bar and Task 5's hero CTA both already target.

- [ ] **Step 5: Screenshot and compare**

```bash
node screenshot.mjs http://127.0.0.1:9292 buy-box
```
Compare against swipe crop-02's "The MOVE+" buy box. Confirm: real $499/$699 price with strikethrough compare-at (already set on the product per PROGRESS.md), variant picker, Add to Cart button in clay, guarantee/warranty disclosure — and confirm there's **no** star rating, review count, or "Clinicians' Choice"-style badge (none should exist since we didn't add one, this is a negative-space check).

---

## Task 13: FAQ accordion section

**Files:** scratch JSON.

**Interfaces:**
- Produces: a `section` keyed `faq`, using the native `accordion` block (accepts `_accordion-row` children per confirmed schema).

- [ ] **Step 1: Write the section JSON**

```json
{
  "type": "section",
  "settings": {
    "content_direction": "column",
    "background_color": "#FAF9F6",
    "padding-block-start": 64,
    "padding-block-end": 64
  },
  "blocks": {
    "kicker": {"type": "text", "settings": {"text": "<p>FAQS</p>", "type_preset": "h6", "case": "uppercase"}},
    "heading": {"type": "text", "settings": {"text": "<h2>Got Questions? We Have Answers.</h2>", "type_preset": "h2"}},
    "faq_accordion": {
      "type": "accordion",
      "settings": { "icon": "plus", "dividers": true },
      "blocks": {
        "q1": {"type": "_accordion-row", "settings": {"heading": "What's your return policy?", "open_by_default": true}, "blocks": {
          "a": {"type": "text", "settings": {"text": "<p>You have 60 days to try the Neck Relax at home. If it's not for you, send it back for a full refund — we cover return shipping.</p>", "type_preset": "rte"}}
        }, "block_order": ["a"]},
        "q2": {"type": "_accordion-row", "settings": {"heading": "What's covered under warranty?"}, "blocks": {
          "a": {"type": "text", "settings": {"text": "<p>Every Neck Relax comes with a 1-year hardware warranty covering manufacturing defects.</p>", "type_preset": "rte"}}
        }, "block_order": ["a"]},
        "q3": {"type": "_accordion-row", "settings": {"heading": "How does it work?"}, "blocks": {
          "a": {"type": "text", "settings": {"text": "<p>The Neck Relax combines constant 42°C heat, 4-node vibration massage, low-frequency pulse modes, and a soft red light glow in one wireless, hands-free wrap.</p>", "type_preset": "rte"}}
        }, "block_order": ["a"]},
        "q4": {"type": "_accordion-row", "settings": {"heading": "Is it safe for daily use?"}, "blocks": {
          "a": {"type": "text", "settings": {"text": "<p>The device is FCC, CE, and RoHS certified for safety, and designed for comfortable daily wear.</p>", "type_preset": "rte"}}
        }, "block_order": ["a"]},
        "q5": {"type": "_accordion-row", "settings": {"heading": "How do I charge it?"}, "blocks": {
          "a": {"type": "text", "settings": {"text": "<p>It charges via USB-C — no proprietary cable required.</p>", "type_preset": "rte"}}
        }, "block_order": ["a"]},
        "q6": {"type": "_accordion-row", "settings": {"heading": "How do I clean it?"}, "blocks": {
          "a": {"type": "text", "settings": {"text": "<p>Wipe the strap and device with a soft, dry cloth. Avoid submerging it in water.</p>", "type_preset": "rte"}}
        }, "block_order": ["a"]}
      },
      "block_order": ["q1", "q2", "q3", "q4", "q5", "q6"]
    }
  },
  "block_order": ["kicker", "heading", "faq_accordion"]
}
```
Check `blocks/accordion.liquid`'s `icon` setting's enum options before finalizing `"icon": "plus"` — the earlier extraction only listed the setting id, not its option values; confirm `plus` (or whatever the real default/plus-style option is called) is valid, or use the field's documented default if `plus` isn't one of the options.

- [ ] **Step 2: Screenshot and compare**

```bash
node screenshot.mjs http://127.0.0.1:9292 faq
```
Compare against swipe crop-02/03's FAQ block. Confirm the first item is open by default (matching Kineon's pattern), accordion expand/collapse works, and every answer matches this plan's confirmed-real claims (60-day guarantee, 1-year warranty — no `[VERIFY]` language, since these are confirmed facts).

---

## Task 14: Trust icon bar section

**Files:** scratch JSON.

**Interfaces:**
- Produces: a `section` keyed `trust_icon_bar`, 4 icon+text pairs.

- [ ] **Step 1: Write the section JSON**

```json
{
  "type": "section",
  "settings": {
    "content_direction": "row",
    "horizontal_alignment": "center",
    "vertical_on_mobile": true,
    "background_color": "#EEF2F3",
    "padding-block-start": 32,
    "padding-block-end": 32
  },
  "blocks": {
    "i1": {"type": "group", "settings": {"content_direction": "column", "horizontal_alignment": "center"}, "blocks": {
      "icon": {"type": "icon", "settings": {"icon": "return", "icon_color": "#4C6B7A"}},
      "text": {"type": "text", "settings": {"text": "<p>60-Day Guarantee</p>", "type_preset": "paragraph", "alignment": "center"}}
    }, "block_order": ["icon", "text"]},
    "i2": {"type": "group", "settings": {"content_direction": "column", "horizontal_alignment": "center"}, "blocks": {
      "icon": {"type": "icon", "settings": {"icon": "lock", "icon_color": "#4C6B7A"}},
      "text": {"type": "text", "settings": {"text": "<p>1-Year Warranty</p>", "type_preset": "paragraph", "alignment": "center"}}
    }, "block_order": ["icon", "text"]},
    "i3": {"type": "group", "settings": {"content_direction": "column", "horizontal_alignment": "center"}, "blocks": {
      "icon": {"type": "icon", "settings": {"icon": "check_box", "icon_color": "#4C6B7A"}},
      "text": {"type": "text", "settings": {"text": "<p>Wireless &amp; Hands-Free</p>", "type_preset": "paragraph", "alignment": "center"}}
    }, "block_order": ["icon", "text"]},
    "i4": {"type": "group", "settings": {"content_direction": "column", "horizontal_alignment": "center"}, "blocks": {
      "icon": {"type": "icon", "settings": {"icon": "recycle", "icon_color": "#4C6B7A"}},
      "text": {"type": "text", "settings": {"text": "<p>USB-C Rechargeable</p>", "type_preset": "paragraph", "alignment": "center"}}
    }, "block_order": ["icon", "text"]}
  },
  "block_order": ["i1", "i2", "i3", "i4"]
}
```

- [ ] **Step 2: Screenshot and compare**

```bash
node screenshot.mjs http://127.0.0.1:9292 trust-icon-bar
```
Compare against swipe crop-03's 4-icon trust bar. Confirm no fabricated "Rated 4.7" or "HSA/FSA Eligible" equivalent appears (per claim-integrity decisions).

---

## Task 15: Assemble the template and assign it to the product

**Files:**
- Create: `theme/templates/product.presell.json`
- Modify (via Admin API, not a file): the MotiThera Neck Relax product's `templateSuffix`

**Interfaces:**
- Consumes: all section JSON blocks from Tasks 5–14.
- Produces: a live, orderable product template.

- [ ] **Step 1: Assemble `theme/templates/product.presell.json`**

```json
{
  "sections": {
    "hero": { /* Task 5 JSON */ },
    "problem_agitation": { /* Task 6 JSON */ },
    "use_case_grid": { /* Task 7 JSON */ },
    "benefit_grid": { /* Task 8 JSON */ },
    "feature_panel": { /* Task 9 JSON */ },
    "how_to_steps": { /* Task 10 JSON */ },
    "trust_marquee": { /* Task 11 JSON */ },
    "main": { /* Task 12 JSON — the restyled product-information section */ },
    "faq": { /* Task 13 JSON */ },
    "trust_icon_bar": { /* Task 14 JSON */ }
  },
  "order": ["hero", "problem_agitation", "use_case_grid", "benefit_grid", "feature_panel", "how_to_steps", "trust_marquee", "main", "faq", "trust_icon_bar"]
}
```
Substitute each task's real JSON object for the placeholder comments above — every one was fully written out in Tasks 5–14, nothing here is actually a placeholder in the final file.

- [ ] **Step 2: Push the new template file**

```bash
shopify theme push --theme 163621273858 --store gcvy0q-cb.myshopify.com --path theme --only templates/product.presell.json
```

- [ ] **Step 3: Assign the template to the product**

Use the `shopify-plugin:shopify-admin` skill (search docs, validate the mutation) to author a `productUpdate` mutation setting `templateSuffix: "presell"` on `gid://shopify/Product/9595773681922`, then execute via:
```bash
shopify store execute --store gcvy0q-cb.myshopify.com --query '<validated productUpdate mutation>' --allow-mutations
```
Confirm the response has no `userErrors`.

- [ ] **Step 4: Preview the assembled page**

```bash
node screenshot.mjs "http://127.0.0.1:9292/products/motithera-neck-relax" full-page-assembled
```
(Confirm the actual product handle first via `shopify store execute` read-only query if `motithera-neck-relax` isn't confirmed — it should match whatever handle `productCreate` assigned on 2026-08-23.)

- [ ] **Step 5: Commit**

```bash
git add theme/templates/product.presell.json
git commit -m "Assemble MotiThera Neck Relax presell + PDP product template"
git push origin main
```

---

## Task 16: Full-page verification, PROGRESS.md log, final commit

**Files:**
- Modify: `PROGRESS.md`

- [ ] **Step 1: Round 1 comparison** — screenshot the full assembled page top to bottom (may need multiple scroll-position screenshots if `screenshot.mjs` doesn't capture full page height — check its capture mode) and compare section-by-section against all 4 `swipe/FireShot Capture 023...` crops. List every visible mismatch (spacing, color, missing content). Also open `theme/sections/footer-group.json` / `theme/sections/footer.liquid` and confirm the footer content is Horizon's generic default (nav labels like "Quick links", no hardcoded LullyRest brand name, policy links, or copy) — this theme was duplicated from Horizon directly, not from LullyRest's draft, so it should already be clean, but confirm rather than assume before this page goes anywhere near review.

- [ ] **Step 2: Fix mismatches found in Round 1**, re-screenshot only the affected sections.

- [ ] **Step 3: Round 2 comparison** — repeat the full-page comparison. Per `CLAUDE.md`'s verification workflow, stop only when no visible differences remain against intent (not pixel-identical to Kineon — intent-matched: structure, hierarchy, and brand tokens correct).

- [ ] **Step 4: Write the PROGRESS.md entry**

Add a dated entry covering: theme duplication (id `163621273858`), the 11 new placeholder assets, the global token change, every section built, the `templateSuffix` assignment, and confirmation the product is still DRAFT and the theme is still unpublished (nothing customer-visible went live).

- [ ] **Step 5: Final commit**

```bash
git add PROGRESS.md
git commit -m "Complete MotiThera Neck Relax presell + PDP page build, log full mutation history"
git push origin main
```

- [ ] **Step 6: Report to user** — summarize what was built, share the theme preview URL (`https://gcvy0q-cb.myshopify.com?preview_theme_id=163621273858`) for their review, and explicitly flag: theme is unpublished, product is still DRAFT — nothing is live. Ask whether they want to review before any publish step (which requires their explicit go-ahead per CLAUDE.md rules 2–4, out of scope for this plan).
