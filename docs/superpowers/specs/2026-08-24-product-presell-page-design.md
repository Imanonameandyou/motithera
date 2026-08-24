# MotiThera Neck Relax — Presell + PDP Product Page Design

**Status:** Approved by user 2026-08-24 ("yes. build."). Architectural-path design per `superpowers:brainstorming`.

## Goal

Build a single product page for MotiThera Neck Relax (`gid://shopify/Product/9595773681922`) that functions as a pre-sell sales page and PDP in one — warming cold traffic through the full problem/mechanism/proof narrative, with an anchor-jump shortcut for warmer traffic to skip straight to the buy box. Structure and section-by-section placement are modeled directly on the competitor swipe: Kineon's MOVE+ "Use Case: Neck and Shoulder" page (`swipe/FireShot Capture 023...pdf`, captured 2026-08-24 — supersedes the earlier `Capture 021` in the same folder).

## Why this shape

Kineon's page isn't a static landing page — the mid-page "buy box" is their live PDP (real price, variant picker, Add to Cart) embedded inside a full narrative page. Copying that structure means MotiThera's version must be a **Shopify alternate product template**, not a generic CMS page, so the buy box can be the real product form.

## Architecture

- Duplicate the store's current theme (Horizon) into a new MotiThera draft theme — never edit Live directly (CLAUDE.md rule 2).
- Build each content block below as its own custom Liquid section with customizer-editable schema (settings + blocks where content will vary, e.g. FAQ items, use-case tiles).
- Assemble into one JSON template (`templates/product.presell.json`) using those sections in order, assigned as an alternate template to the MotiThera Neck Relax product only.
- Product stays in Draft status until the user reviews and explicitly approves publish (rule 3/4).

## Section-by-section map

Sections are listed in page order. "Live template" = included in `product.presell.json` for this v1 build. "Built, not live" = the section file exists in the theme for future use but isn't added to the template.

| # | Kineon reference | MotiThera content | Live template? |
|---|---|---|---|
| 1 | Announcement bar "SAVE $200 · SHOP NOW" | "$200 OFF · SHOP NOW" — anchor-links to `#buy-box`. Real: product already has $699 compare-at → $499 price, no new discount code needed. | Yes |
| 2 | Header nav | Logo, "Shop Now" anchor-jump to `#buy-box` (the warm-traffic shortcut), cart icon | Yes |
| 3 | Hero, dark bg, on-body photo | Kicker "HEAT · PULSE · RED LIGHT"; headline "Heat, pulse & red light — engineered for the always-on neck" (from `brand/BRAND_GUIDE.md` §9 reference copy); 3 true trust bullets (wireless & hands-free / USB-C rechargeable / designed for desk-day wear); CTA anchors to buy box | Yes |
| 4 | Problem agitation + photo | "Coat-hanger" tension copy sourced from `brand/AVATAR_SHEET.md` verbatim pain quotes — burning ache, knots, tension headaches, stiff rotation, sleep disruption | Yes |
| 5 | 6-tile use-case grid | Re-themed from clinical conditions to desk-posture pain *states* (not diagnoses): afternoon coat-hanger tension, trapezius knots, tension headaches, stiff neck rotation, end-of-day shoulder tightness, post-call/meeting tension | Yes |
| 6 | Icon benefit grid | Structural language only ("may help ease tension," "supports relaxation," "designed for daily wear") — no ATP/circulation/cellular mechanism claims | Yes |
| 7 | Dark feature panel, 5 rows | Real spec rows only: constant 42°C heat, 4-node vibration massage, low-frequency pulse modes, soft red light, wireless & rechargeable | Yes |
| 8 | 3-step how-to-use | Position the wrap → power on & select mode → wear hands-free | Yes |
| 9 | Trust marquee ticker | Heat + Pulse + Red Light · Wireless & Hands-Free · USB-C Rechargeable · 60-Day Guarantee | Yes |
| 10 | Video testimonial carousel | Section file built (schema-ready for merchant to add customer video blocks later) | **Not live** — zero real customers/reviews exist; an empty carousel reads as broken |
| 11 | "As Seen In" press logos | — | **Omitted entirely** — no real press mentions exist |
| 12 | Buy box (real PDP) | Real price/compare-at, variant picker, Add to Cart, payment icons, Shop Pay installments messaging (native, shows only if actually enabled). No star rating/review count, no "Clinicians' Choice"/GOVX-style badges — fabricated for us | Yes — `id="buy-box"`, anchor target |
| 13 | Stats/citation proof panel | — | **Omitted, not deferred.** Even real general PBM literature would misleadingly imply clinical validation for a device that is FCC/CE/RoHS-only, not medical-grade — this is the exact "clinical-grade laundering" `CLAUDE.md` claim-integrity section warns against. Do not resurrect this section without a change to what's actually claimed about the device. |
| 14 | FAQ accordion | Real answers: 60-day guarantee (prepaid return shipping, full refund) + 1-year hardware warranty — **confirmed by user 2026-08-24**, overrides the offer brief's `[VERIFY]` 60-day figure and the market research dossier's 2-year warranty figure; how it works (heat/pulse/vibration/red light, structural language only); safety; cleaning; what's in the box | Yes |
| 15 | Blog teaser | — | **Omitted** — no blog content exists yet |
| 16 | 4-icon trust bar | 60-Day Guarantee · 1-Year Warranty · Wireless & Hands-Free · USB-C Rechargeable | Yes |
| 17 | Footer | Theme's existing default footer, MotiThera nav/policy links | Yes (theme default, not custom-built) |

## Claim-integrity decisions (binding, not just this build)

- **HSA/FSA eligibility:** offer brief marks this `[VERIFY]`; user has not confirmed it (unlike guarantee/warranty). Left out entirely — no natural placeholder slot for "maybe eligible" the way a review count has an `[EMPTY]` slot. Revisit if user confirms.
- **Guarantee/warranty:** 60-day money-back guarantee (prepaid return shipping, full refund) + 1-year hardware warranty are **CONFIRMED real** by the user 2026-08-24 — safe to state as fact, no `[VERIFY]` flag needed. This supersedes any other figure in `offer/OFFER_BRIEF.md` or `research/MARKET_RESEARCH_DOSSIER.md`.
- **Reviews/ratings/clinician endorsements/press logos:** none exist. Per `CLAUDE.md` claim-integrity rule, sections that depend entirely on this kind of proof (not a single fillable slot inside an otherwise-real section) are left out of the live template rather than shipped with visible "[EMPTY]" placeholders, because an empty carousel/logo-strip/stat-panel reads as broken rather than as an honest placeholder. The section files still get built where reasonable (testimonial carousel) so they're ready to enable later.
- **No mechanism claims:** no ATP, nitric oxide, cellular energy, photodissociation, 660nm/850nm, or "clinical irradiance" language anywhere on this page. Device is heat + vibration + low-frequency pulse + mild red light, FCC/CE/RoHS (safety/EMC certified, not medical-grade).

## New placeholder assets needed

Higgsfield-generated, same convention as the existing 3 in `brand/assets/placeholders/` (AI-generated, flagged in that folder's README, swap before publish):
- 6 close-up neck/shoulder pain-state photos (use-case grid)
- 1–2 additional on-body product shots (dark feature panel; hero may reuse an existing placeholder)
- 3 step-by-step usage photos (how-to-use section)

## Verification plan

Per `CLAUDE.md` → "Frontend / visual verification workflow": `shopify theme dev` live preview, Puppeteer screenshots via `screenshot.mjs`, at least 2 comparison rounds against the Kineon swipe file per section, `frontend-design` skill invoked before writing/restyling any section.

## Out of scope for this build

Discount code creation (existing compare-at pricing is sufficient), blog content, real customer testimonials/reviews infrastructure, HSA/FSA eligibility claims, any stats/citation proof panel.
