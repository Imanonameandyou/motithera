# PROGRESS LOG

Audit log of every API call and file change made to the store or this project. Newest entries at the top.

---

## 2026-09-10 — Default product template rewritten for MotiThera (PDP finished)

**Task:** finish the product page — keep the *default* product template's structure (`templates/product.json`, the one product `9595773681922` actually resolves to, `templateSuffix: null`), swap copy and imagery to MotiThera, written for a reader arriving from the tech-neck listicle.

**Store mutations**
- **`shopify store execute`** (reads only) — `product(id: 9595773681922)` for variants/media; `files(query: "motithera")` and `files(query: "neck")` to confirm which `shopify://shop_images/` handles actually exist. No writes to any product, page, or discount.
- **`shopify theme push --only templates/product.json --force`** → theme `163622060290` (`MotiThera — Presell + PDP (elixir draft)`, unpublished). Pushed 4×: 2 rejected by schema validation (`table_column_width` >50; `swatch_border_radius` not on a valid step), then succeeded. LullyRest's live theme `163498656002` untouched.
- **Nothing published.** Theme stays unpublished; product status/visibility unchanged from what the 2026-08-24 session left (ACTIVE + on Online Store — still not rule-3 state, still flagged).

**Files**
- Rewrote `theme-elixir/templates/product.json` (the only changed file). Section *order and structure preserved* as instructed — every change is a settings value, a `disabled` flag, or a palette remap.

**Copy — written against the listicle's exit state, not from scratch**
Reader arrives already believing the Cinderella/tech-neck mechanism and that heating pads and massage guns fail. So the PDP does not re-teach it; it answers *what exactly do I get, why not the drawer fix, and what's my risk*:
- Buy box: spec line ("Heat · 4-node vibration · Pulse modes · Red light" + "One wireless wrap. Nothing to hold, no cord to the wall, no appointment to book."), `ADD TO CART`, real guarantee badges (60-day money-back / 1-year hardware warranty), and the ex-"cheap replicas" block repurposed into the belief-4 point (flat panels/rigid belts can't hold contact across the slope of the neck).
- Product accordion: Description / How to use (3 steps, ~15 min) / Features (42°C heat, 4-node vibration, low-frequency pulse, soft red light, USB-C, FCC-CE-RoHS) / **Safety & precautions** (not a medical device; pregnancy, pacemaker, diagnosed cervical spine condition) / Shipping & Returns.
- Benefits grid: the four modalities in avatar language ("where the coat-hanger ache lives", "instead of gritting through it").
- Comparison table reframed from "Us vs. knock-offs" to **"Why Not Just Another Heating Pad?"** vs "The Usual Fixes (pads, guns, appointments)" — 4 structural rows + "What it costs over time: One-time / Ongoing".
- Guarantee section + bottom FAQ (session length, payments, daily-use safety, what-if-it-doesn't-work) all on confirmed-real terms only.

**Claim integrity — sections held open rather than faked** (CLAUDE.md standing rule)
Disabled, not deleted, so they can be switched on the day real material exists:
- Sections: `before_after_comparison` (no real before/after imagery), `customer_reviews` (heading was "Rated 4.8/5 by 1,000+" over 4 stock images), `customer_reviews_carousel` (4 lorem-ipsum reviews, "Rated 4.8/5 based on +10,839 Total Ratings").
- Blocks in `main`: `trustpilot_rating` ("Excellent 4.7 out of 5"), `number_one_award` ("#1 BESTSELLER OF 2024"), `video_carousel_standalone` ("Over __M Views On Instagram"), `customer_review` ("Lauren J."), plus `money_back_guarantee` (its "Less than 1% of customers claim…" stat was invented, and its fallback badge icon rendered as a broken image).
- Also disabled as inapplicable, not as claims: `simple_variant_picker` + both "Choose Your…" labels + `quantity_break` (single "Default Title" variant; the quantity tiers were LullyRest's pillow BOGO with pillow photography), and 4 empty `carousel_default_video` blocks.
- `sticky_add_to_cart` rating line "Excellent 4.8 | 1319 reviews" → "60-day money-back guarantee · 1-year warranty".
- Shipping transit times removed from the FAQ (the inherited "3-5 business days continental US" is not verified) — replaced with "You will receive tracking by email as soon as your order ships." **Needs the user's real fulfilment numbers to say more.**

**Listicle ↔ PDP mismatch — unchanged, still on hold.** The published listicle sells 660nm/850nm, "clinical-grade"/"medical-grade LEDs" and the NASA lineage; the PDP describes the red light as "a gentle red glow that runs alongside the heat and the massage." That gap is deliberate: `sourcing/` still contains only the Alibaba `JT-8B` capture ("mild red light", no wavelength or irradiance, FCC/CE/RoHS), and the supplier tech sheet requested on 2026-09-09 has not landed. If it arrives and confirms the wavelengths, the PDP is a one-setting change (`product_benefits` benefit 4 + FAQ "Features"). Verified by fetching the rendered page: no "660", "850", "medical-grade", "clinical-grade" or "NASA" appears in visible copy.

**Palette — LullyRest → MotiThera, template-wide**
Scripted remap of the inherited elixir/LullyRest palette to `brand/BRAND_GUIDE.md` tokens: `#1773b0`/`rgba(23,115,176)` → ink `#14202E`, `#83d7f9` → steel-100 `#DCE9EC`, `#e4f9ff` → mist `#EEF2F3`, `#f7fcff` → porcelain `#FAF9F6`, pink `#EF4A65`/`#FF6B9D` → clay `#C1502E`, neon `#13ff00`/`#11e100` → success `#4B7A5E`. Every `linear-gradient(...)` value collapsed to a solid token (guide forbids gradients). The 3 wavy `divider` sections disabled — they rendered as stacked grey rules, and the section background alternation already separates.
- **Gotcha for next time:** a blanket "cap every `*radius*` at 6px" pass is rejected by the API — several radius settings have step constraints that make 6 invalid. Radii were restored to their original values except `replica_warning.border_radius` (8 → 6). Two settings also carry hard caps: `product_comparison.table_column_width` max 50.
- Two sections were ignoring their colour settings because `use_theme_colors` / `theme_color_mode` defaulted to theme-driven: `scrolling_features_bar` needed `theme_color_mode: "custom"` (it was rendering as a full-bleed clay band; clay is the "act now" colour only) and `money_back_guarantee` needed `use_theme_colors: false`. **Check that flag first whenever a colour setting appears to have no effect on this theme.**

**Imagery**
- `product_benefits` feature image swapped from `motithera-neck-relax-detail.png` — **which does not exist in the store's files** (the presell template references it too, so that section of `product.presell.json` is rendering a broken image; not fixed here) — to `motithera-onbody-hero.png`: worn hands-free on the neck and shoulders by a woman, matching the 84%-female avatar, with the red glow and USB-C port visible.
- Comparison column 1 thumbnail removed so both column headers sit on the same baseline.
- Gallery still uses the 3 Higgsfield placeholders on the product record. **They show a white/orange device while the two on-body panels show a silver/black one — the product does not look like one product across the page.** Real photography, or one regenerated consistent set, is the highest-value remaining fix.

**Verification — visual QA complete (3 desktop rounds + mobile)**
- `screenshot-4` (local dev, blocked by the 3 known vendor Liquid errors — see below), `screenshot-5` round 1 remote, `screenshot-6` round 2 (identical to r1 — caught that the push had been *rejected*, not applied), `screenshot-7` round 3 after the schema fixes, `screenshot-8` mobile 390px DPR2. All in `temporary screenshots/`.
- Re-ran the 2026-09-09 inherited-demo-defaults audit against every enabled section/block: 6 hits, all benign (an unused `after_custom_icon` SVG default; `text_value_3` "No" on 5 comparison rows, only rendered at `column_count: 3` — ours is 2). No fabricated copy leaks.
- Fetched the rendered HTML and grepped for Trustpilot / 4.7 / 4.8 / 1319 / BESTSELLER / Lorem / pillow / "Lauren J" / "60% OFF" / 10,839 / "Verified Buyer": every remaining match is CSS class names, font hashes or asset version strings, none in visible copy.

**Tooling**
- **Puppeteer's Chrome was broken and is now repaired** — `icudtl.dat` was missing from `~/.cache/puppeteer/chrome/win64-152.0.7977.42/chrome-win64/`, so every launch failed with `Invalid file descriptor to ICU data received` (both shells; `headless:'shell'` and `pipe:true` too). `npx puppeteer browsers install chrome` was a no-op because the directory existed — fix was to **delete the version directory first, then reinstall**. First launch after reinstall times out waiting for the WS endpoint (Defender scanning the fresh binary); the second succeeds.
- `screenshot.mjs` must be run from the repo root (it resolves `puppeteer` from `./node_modules`), and Chrome launch fails from the Bash tool — use PowerShell.
- The 3 vendor Liquid errors flagged on 2026-09-09 (`snippets/product-info.liquid`, `snippets/product-variant-options.liquid`, `sections/cart-notification-product.liquid` — filters like `| default: 0` / `| append:` / `| escape` inside `render` arguments, which Liquid does not allow) **still break `shopify theme dev` uploads**, and `product-info.liquid` *is* on this template's path, so the local dev server renders an upload-error page for the PDP. Worked around by pushing `--only templates/product.json` and screenshotting the remote `?preview_theme_id=` preview. Still not fixed.


## 2026-09-09 — Tech-neck listicle presell lander built (draft theme) + claim-integrity hold

**Task:** user supplied a finished listicle/advertorial draft ("0 REASONS YOUR 'TECH NECK' KNOTS WON'T BUDGE") to run as the paid-ads presell lander, and directed: keep the copy verbatim, build it as a new page on the existing elixir draft theme.

**Store mutations**
- **`shopify store auth`** re-run with expanded scopes — was `read_products,write_products,read_themes,write_themes`, now adds **`read_content,write_content`** (needed for `pageCreate`; the first attempt failed `ACCESS_DENIED`). Browser consent auto-completed against the existing login. Authenticated as jomatheoos@gmail.com.
- **`pageCreate`** → **`gid://shopify/Page/137262924034`**, title "10 Reasons Your Tech Neck Knots Wont Budge", handle `motithera-tech-neck-listicle`, `templateSuffix: listicle-motithera`, **`isPublished: false` (hidden, per rule 3)**. No userErrors.
- **`shopify theme push --only templates/page.listicle-motithera.json --nodelete`** → theme `163622060290` (`MotiThera — Presell + PDP (elixir draft)`, confirmed `unpublished` via `theme list` immediately before pushing; LullyRest's `163498656002` re-confirmed `live` and untouched). First push rejected (`Setting 'gap' must be a step in the range`), second push succeeded.
- No product was modified. **The live product description was NOT rewritten** — see the hold below.

**Files**
- Added `theme-elixir/templates/page.listicle-motithera.json` — 12 blocks on the existing `listicle` section: header, summary (intro), 4× `listicle-item`, `listicle-callout-quote`, `limited-time-sale` CTA card (5 nested `lts-*` blocks), closing summary, `listicle-sticky-atc`, `advertorial-footer`. Styled to `brand/BRAND_GUIDE.md` (porcelain `#FAF9F6` ground, ink `#14202E` text, clay `#C1502E` CTA, steel `#4C6B7A` kicker, radii ≤6px). Existing `page.listicle.json` (elixir source theme's "Eye Glow Kit" demo content) left untouched.
- Fixed `theme-elixir/snippets/quantity-break.liquid` — **pre-existing bug, unrelated to this task**: 13 `{% liquid %}`-block statements written as one-liners (`when 'red' assign color_hex = '#FF0000'`), which is invalid Liquid and made `shopify theme dev` fail to upload with `Liquid syntax error (line 1021): Unexpected character =`. Split each into `when` / `assign` on separate lines. Backup at `/tmp/qb.bak`. This was blocking *any* `theme dev` session on this theme, not just this page.
- `shopify theme dev` still reports syntax errors in three other vendor files (`snippets/product-info.liquid`, `snippets/product-variant-options.liquid`, `sections/cart-notification-product.liquid` — all multi-line `{%\n render %}` tags). Not fixed — none are used by this template; worked around with `--ignore` on those three. Flagged for later.

**Page PUBLISHED (user-directed, same session)**
- **`pageUpdate`** → `gid://shopify/Page/137262924034` set **`isPublished: true`** (`publishedAt` 2026-09-09T14:24:36Z), at the user's explicit instruction ("just publish the page"), satisfying rule 4's confirm-before-customer-visible requirement. Rule 3's "pages default to Draft/Hidden" no longer describes this page's state — flag if picking work back up.
- **Exposure note:** the MotiThera theme is still unpublished, so the *live* storefront (LullyRest's theme, which has no `page.listicle-motithera.json`) falls back to `page.json` and renders only the page title + stub body — verified via a live fetch: HTTP 200, contains "Content is rendered by the theme template", does **not** contain the listicle copy. So the article itself is not publicly readable; only a stub page at `/pages/motithera-tech-neck-listicle` is. **Consequence: Online Store → Pages → Preview shows the stub, not the lander.** The working preview URL is `…/pages/motithera-tech-neck-listicle?preview_theme_id=163622060290` (verified HTTP 200 with all listicle markers present).

**Bug caught in visual QA — fabricated discount leaking from demo defaults**
- First render showed **"60% OFF FOR A LIMITED TIME ONLY!"** above the CTA headline. Not authored — it's the schema `default` for `eyebrow_text` in `blocks/lts-headline.liquid`, inherited because the setting was left unset. False on its face ($499 from $699 is ~29%) and a fabricated scarcity claim. Fixed by setting `eyebrow_text: ""` (the block guards on `!= blank`), re-pushed, re-verified gone.
- **Systemic lesson, worth remembering:** in this theme *any* unset setting silently inherits the elixir demo theme's copy, which is full of "60% OFF", "FREE SERUM", and invented review counts. Wrote a one-off audit that walks every block in the template and reports text/richtext/url/image settings that are unset but carry a non-empty schema default — it found exactly this one. **Re-run that audit after any block is added to a template on this theme.**

**Verification status — visual QA COMPLETE (2 rounds, desktop + mobile)**
- Round 1 desktop full-page → caught the "60% OFF" leak. Round 2 desktop + mobile after fix → clean.
- Desktop 1440px and mobile 390px (DPR2) both render correctly: header, intro, 4 body sections, callout quote, CTA card (chip / headline / subhead / clay button / real guarantee line), closing note, sticky ATC, disclaimer footer. Brand system holds (porcelain ground, ink text, clay `#C1502E` CTA, steel chip, tight radii).
- The mobile full-page capture *appeared* to duplicate the article; verified via DOM inspection that it does not (1 `.listicle-section`, "0 REASONS" ×1, "doomscrolling" ×1, "CHECK AVAILABILITY" ×2 = CTA card + sticky bar, as designed). It's a Puppeteer fullPage stitching artifact caused by the sticky ATC repainting during scroll — **not a page bug**; use viewport/element captures on this page instead of `fullPage` for mobile.
- Screenshots in `temporary screenshots/`: `screenshot-1-listicle-desktop.png` (pre-fix), `screenshot-2-listicle-desktop-v2.png`, `screenshot-3-listicle-mobile.png`, `crop-cta-card.png`, `crop-ul-intro.png`, `crop-mobile-top.png`.
- **Open copy issue:** headline still literally reads "**0 REASONS**" — left verbatim rather than guessing; body has 6 sections, not 10. Needs a number from the user.

**Superseded — earlier in this session, before the publish**
- Template JSON parses; all 12 block types resolve to real files in `theme-elixir/blocks/`; `block_order` and `blocks` match exactly (no orphans/missing).
- Wrote a one-off audit script checking every setting against its block schema: caught 8 invalid values in one pass (`max_width` 750→740, `image_column_width` 42→40, chip `letter_spacing` 9→2, desc `line_height` 15→1.5, sticky `button_border_radius` 3→2, footer `padding_vertical` 36→35, footer `gap` 18→20). Confirmed **zero unknown setting ids**. Re-push then succeeded.
- **No screenshots taken.** `theme dev` on port 9293 serves the theme cleanly, but `/pages/motithera-tech-neck-listicle` returns **404 because the page is hidden** — Shopify won't serve an unpublished page even through the dev server. Visual verification needs either the admin theme-editor preview (merchant browser) or a brief publish of the page — the latter is a customer-visible action, so it was **not** done unilaterally (rule 4). Awaiting user.

**Claim-integrity hold (rule: "Claim integrity", CLAUDE.md)**
Copy placed verbatim as instructed, **except four elements that are fabricated proof and were held out of the template**, pending real source material from the user:
1. **Byline "Dr. Anja Renner ✓Verified, Posture Specialist & Red Light Researcher"** — `show_author_info` set to `false`. User states she is a real in-house staff member with doctorate-level credentials; requested her actual title/degree/institution, plus an **FTC material-connection disclosure** ("Dr. Renner is MotiThera's Head of Research") since an undisclosed employee endorsement is the enforcement risk, not the endorsement itself.
2. **"97% of MotiThera users"** (3 occurrences, incl. one intro bullet and a whole section heading) — omitted. User states it comes from a ~5,000-respondent post-purchase questionnaire; requested the export, field dates, and verbatim question wording.
3. **Study chart** ("mitochondrial effects in human cell cultures / skin healing in Navy SEAL trainees / pain relief in Air Force veterans with chronic neck arthritis") — section built without it. User states these are real tests they ran; requested the report or lab/protocol.
4. **Footnotes ¹–¹⁸** — omitted; the supplied draft has bare superscripts and **no bibliography attached**, so there was nothing to render. Requested the reference list. Note: even if the citations are real general-PBM literature, per the standing rule they may support *category*-level statements only and must not be positioned as validation of this specific device.

**Device-spec claims — placed, but unverified and flagged.** The copy's 660nm/850nm dual-wavelength, near-infrared, "clinical-grade"/"medical-grade LEDs", 30–50mm penetration, NASA-lineage and ATP/cytochrome-c-oxidase mechanism claims all contradict the only device documentation in the repo (`sourcing/`, Create Top Electronics `JT-8B`: "mild red light", **no stated wavelength or irradiance**, FCC/CE/RoHS only). User states the Shopify product description is what's wrong and the copy is correct. **Requested the supplier tech sheet / test report to add to `sourcing/` before the live product description is rewritten.** Until that lands: page stays on the unpublished draft theme, page stays hidden, live product `9595773681922` description unchanged.

## 2026-09-09 — Shopify AI Toolkit plugin installed + token-optimization pass

- **`shopify-plugin@shopify-ai-toolkit` v1.8.0 installed** (user scope, enabled). Done via the VS Code extension's bundled CLI (`C:\Users\Hexadrine\.vscode\extensions\anthropic.claude-code-2.1.266-win32-x64\resources\native-binary\claude.exe`) since `claude` isn't on PATH and claude.ai-hosted marketplaces weren't reachable from that out-of-band invocation. Steps: `claude plugin marketplace add Shopify/shopify-ai-toolkit` (HTTPS clone of the public MIT repo) → `claude plugin install shopify-plugin@shopify-ai-toolkit`. 22 skills, ~3,330 tok always-on; active next session/restart. `claude plugin details` reports per-skill token cost — `shopify-hydrogen` is ~58k on invoke, so CLAUDE.md now lists which skills are in-scope.
- **Token-optimization pass** (researched current best practices, Sept 2026 — analyticsvidhya, buildtolaunch, stationx, code.claude.com/docs/costs). No quality-reducing changes; all are waste removal:
  - Created `.claude/settings.json` with a `permissions.deny` Read-list: `node_modules/**`, lockfiles, `**/*.min.js`/`.min.css`/`.map`/`.log`, `.git/**`, `.cache/**`. Prevents accidental multi-thousand-token reads of build noise. Does **not** deny `temporary screenshots/**` (the visual-QA workflow reads those PNGs).
  - Created `docs/ENVIRONMENT.md` and moved situational detail out of the always-loaded `CLAUDE.md`: machine table, Shopify auth config paths, PDF-reading (poppler) workaround, `.docx` conversion note, Puppeteer/screenshot mechanics. `CLAUDE.md` keeps only the load-bearing lines + pointers. All safety rules, shared-store rules, claim-integrity, and the brand-doc read order stayed verbatim.
  - Added `## Token discipline` (search-don't-sweep, name the files, delegate verbose ops to subagents w/ `model: haiku`, in-scope shopify skills only, `/clear` + `/compact` habits, unused MCP connectors) and `## Compact instructions` (preserve unlogged mutations / active theme id / auth changes / `[VERIFY]` resolutions) sections to `CLAUDE.md`.
  - Recommendation logged for the user (not yet actioned — claude.ai-side): disable unused MCP connectors (Canva, Gethookd, Gmail, Calendar, Klaviyo, Notion, Pipeboard, Stripe, Drive) in claude.ai connector settings; only Higgsfield has been used on this project.
- Memory added: `run-setup-commands-yourself` (+ `MEMORY.md` index) — user asked Claude to run auth/CLI/git/install commands itself rather than hand back a checklist.

## 2026-09-09 — Shopify auth completed on the second machine

- User ran `shopify auth login` in cmd (created `sessionStore` + `currentSessionId` in `%APPDATA%\shopify-cli-kit-nodejs\Config\config.json`).
- Claude ran `shopify store auth --store gcvy0q-cb.myshopify.com --scopes read_products,write_products,read_themes,write_themes` — browser consent auto-completed against the fresh login session; `%APPDATA%\shopify-cli-store-nodejs\Config\config.json` now written. Output: "Authenticated as jomatheoos@gmail.com against gcvy0q-cb.myshopify.com."
- Verified read-only: `shopify store info --store gcvy0q-cb.myshopify.com --json` → org `MotiThera` (229789884), admin `https://admin.shopify.com/store/gcvy0q-cb`. `shopify store execute` GraphQL smoke (`query { shop { name myshopifyDomain plan { displayName } } }`) → `MotiThera` / `gcvy0q-cb.myshopify.com` / plan "Basic". No mutations run.
- **Still outstanding:** `shopify-ai-toolkit` Claude plugin (needs `/plugin` in an interactive session), and `git push` (no GitHub credentials on this machine — user must push from their own terminal). Two doc commits are now pending push (`2be78a4` + this entry).

## 2026-09-07 — Environment re-bootstrapped on a second machine (`l9moneyprinter\hexadrine`, `C:\Users\Hexadrine`)

New machine — none of the tooling from the original `jomat_nweuhlk` machine was present (only git 2.55.0, winget 1.29, VS Code). Ran `git pull` (already up to date), then followed `SHOPIFY_BOOTSTRAP.md`. No store data touched — local install steps only.

- **Node.js LTS installed** via `winget install OpenJS.NodeJS.LTS` → node v24.19.0 / npm 11.17.0. MSI added `C:\Program Files\nodejs\` to the machine PATH and `%APPDATA%\Roaming\npm` to the user PATH.
- **Shopify CLI installed** via `npm install -g @shopify/cli@latest` → v4.7.1. `shopify version`, `shopify store --help`, `shopify doc --help` all functional. npm 11 blocked one optional postinstall (`esbuild@0.28.1`) — not needed for store/theme/doc commands; only matters for `shopify app` bundling.
- **Poppler installed** via `winget install oschwartz10612.Poppler` → v25.07.0. Bin dir on this machine: `C:\Users\Hexadrine\AppData\Local\Microsoft\WinGet\Packages\oschwartz10612.Poppler_Microsoft.Winget.Source_8wekyb3d8bbwe\poppler-25.07.0\Library\bin`. winget added it to the user PATH. `pdfinfo` verified against a real `sourcing/` PDF.
- **Puppeteer installed** via `npm install` in project root (`node_modules/` was absent from the clone). npm 11 blocked Puppeteer's Chrome-download postinstall — ran it manually with `node node_modules/puppeteer/install.mjs`; Chrome 152.0.7977.42 + headless-shell downloaded to `C:\Users\Hexadrine\.cache\puppeteer\`.
- **`screenshot.mjs` verified end-to-end** against `https://example.com` (`temporary screenshots/screenshot-1-bootstrap-smoketest.png`). First Chrome launch timed out once (>30s) — Windows Defender scanning the fresh 200MB binary; every launch after was fine. `screenshot.mjs` unchanged, no `--no-sandbox` needed once the binary is warm.
- **Persistent PATH after a VS Code restart will include:** `C:\Program Files\nodejs\` (machine), `%APPDATA%\Roaming\npm` + the Poppler bin dir (user). The currently-running session still needs full paths / a session `$env:PATH` prepend until VS Code is restarted.
- **Still needs the user (interactive, can't be scripted):**
  1. `shopify auth login` — no auth session on this machine (`%APPDATA%\shopify-cli-kit-nodejs\Config\config.json` has only cache, no identity; `shopify-cli-store-nodejs` config absent).
  2. `shopify store auth --store gcvy0q-cb.myshopify.com --scopes read_products,write_products` (add `read_themes,write_themes` etc. as tasks need them) — one browser consent click.
  3. **`shopify-ai-toolkit` Claude Code plugin** — not installed on this machine (`~/.claude/plugins` absent; no `shopify-plugin:*` skills loaded). Install via `/plugin` in an interactive Claude Code session (the Shopify CLI already emits the `shopify-ai-toolkit@claude-plugins-official` install hint).

## 2026-08-24 — Presell + PDP product page built on elixir-1-6-1-pillow theme

Full build session — design spec at `docs/superpowers/specs/2026-08-24-product-presell-page-design.md`, implementation plan at `docs/superpowers/plans/2026-08-24-product-presell-page.md` (plan was written against Horizon, then superseded mid-execution by the elixir switch below; the plan's content/copy decisions still apply, only the underlying theme/section mechanism changed).

- **Theme duplicated: Horizon → MotiThera draft `163621273858`.** Pulled Horizon, pushed as new unpublished theme. Built tokens (Task 2) and a wordmark-logo fix on it before the user redirected the whole build to elixir instead — this theme and its local `theme/` folder are now superseded/unused, kept only for reference (local folder stuck under a Windows file lock, harmless).
- **User redirect: build in `elixir-1-6-1-pillow` instead.** That theme is LullyRest's original source theme (flagged off-limits in `CLAUDE.md`'s "Shared store" section) — user explicitly authorized MotiThera duplicating it as a source (never editing it in place). Recorded in `CLAUDE.md` and in a persistent memory file (`motithera_shared_theme_elixir.md`) per explicit "update your memory" request.
- **New MotiThera theme: elixir → `163622060290`** ("MotiThera — Presell + PDP (elixir draft)"), unpublished. Pulled to `theme-elixir/`, pushed as new theme.
- **Applied brand tokens** to `theme-elixir/config/settings_data.json`: clay/ink/porcelain/steel colors, disabled default gradients/box-shadows/scroll-reveal-animation, tight corner radii (was 40px pills throughout). Reused the existing MotiThera wordmark placeholder as the theme logo (`shopify://shop_images/motithera-wordmark-placeholder.png`).
- **Generated + uploaded 11 new Higgsfield placeholder images** (6 pain-state use-case photos, 2 on-body product shots, 3 how-to-use step photos) via `fileCreate` with external Higgsfield CDN URLs as `originalSource` — no `write_files`/staged-upload needed for these (only needed for the one locally-rendered file, the wordmark, which hit a blocked `stagedUploadsCreate` — worked around by hosting it via Higgsfield first, then `fileCreate` with that URL). All in `brand/assets/placeholders/`.
- **Built `theme-elixir/templates/product.presell.json`** — full section-by-section page (announcement bar → hero → problem-agitation → use-case grid → benefit grid → dark feature panel → how-to-steps → trust marquee → buy box → FAQ → trust icon bar), composed from elixir's native components rather than hand-built primitives. Full claim-integrity pass: omitted every fake-proof-dependent section this theme ships by default (fake Trustpilot rating, "#1 BESTSELLER OF 2024" badge, quantity-break bundle tiers, fake video testimonial carousels, fake "Lauren J." review, fake stats/percentages, advertorial-template fake author/expert bylines) — none of that appears anywhere in the built template.
- **Product status changed DRAFT → ACTIVE**, user-directed ("just set it to active and keep it that way") after Active-only wasn't enough to preview the alternate template.
- **Product published to the Online Store sales channel** (`publishablePublish`, publication `gid://shopify/Publication/205524435202`) — user-approved after the same mutation, when I attempted it, was blocked by a session-level safety classifier; user ran the mutation themselves via the Shopify CLI in their own terminal. Product `gid://shopify/Product/9595773681922` is now live-reachable at its handle on whichever theme is actually published — **the elixir draft theme (`163622060290`) is still unpublished**, so the presell template itself is not customer-facing; only the *product* itself is generally live now (using LullyRest's default theme/template if anyone found the URL directly).
- **Fixed real bugs found during visual verification** (see commit `87e0d7a` for full detail): announcement-bar slider-vs-simple-mode field mismatch, steps-section invisible text/images (per-block background color + `loading="lazy"` + `background_type` gate), icon-grid sizing/color, footer showing the shared store's literal "LullyRest" shop name. Fixed `screenshot.mjs` to scroll through the page before capturing (Shopify theme dev's persistent hot-reload connection also breaks `networkidle0`, fixed earlier in the session).
- **Verified end-to-end via Puppeteer screenshots** against the Kineon swipe reference, multiple rounds, all sections confirmed rendering correctly with real content, no fake claims found anywhere.
- **Not yet published theme itself** — the elixir draft theme remains unpublished (rule 2). Only the underlying product (status + one sales-channel publication) changed, both user-directed.

## 2026-08-23 — Brand visual identity locked

- Presented 5 typography + color identity directions as an artifact (Clinical Authority, Quiet Luxury Spa, Modern Wellness Tech, Heritage Apothecary, Boutique Feminine Premium), each demonstrated with real product copy and named premium-brand parallels. User picked **Clinical Authority**.
- Created `brand/BRAND_GUIDE.md`: full color system (ink/porcelain/mist neutrals, clay accent, steel secondary accent, semantic success/warning/error), Inter-only type scale, spacing/radius/shadow/motion tokens, required interactive states (default/hover/active/focus-visible/disabled) per component, a forbidden/anti-patterns list, imagery guidance, and a drop-in CSS custom-properties block.
- Example copy in the guide deliberately uses the verified heat/pulse/red-light spec (not the offer brief's unverified 660nm/850nm clinical-PBM claims), consistent with the claim-integrity finding logged below.
- Updated `CLAUDE.md` → "Design system guardrails" (now points to the guide instead of "not yet populated") and the file-layout table.
- No store data touched — file/repo changes only.

## 2026-08-23 — First MotiThera product created (draft)

- **Auth resolved.** User ran `shopify auth login` + `shopify store auth --store gcvy0q-cb.myshopify.com --scopes write_products,read_products` in their own terminal. Verified with a read-only `shopify store info` call. Correction to earlier notes: Shopify CLI session/store auth on this Windows machine is **not** under `~/.config/shopify` (that path never existed) — it's under `%APPDATA%\shopify-cli-kit-nodejs\Config\config.json` and `%APPDATA%\shopify-cli-store-nodejs\Config\config.json`. Updating `CLAUDE.md`.
- Used the `shopify-plugin:shopify-admin` skill to author and schema-validate all three mutations below before executing (per its required search-then-validate workflow). API version 2026-07.
- **`productCreate`** (`shopify store execute --allow-mutations`) — created product `gid://shopify/Product/9595773681922`, title "MotiThera Neck Relax — Heat, Pulse & Red Light Massager", status DRAFT, vendor MotiThera, productType "Neck Massager", tags (neck massager, red light therapy, heat therapy, shoulder relief, tension relief, desk wellness), description written to the verified sourcing-PDF spec (heat, 4-node vibration massage, low-frequency pulse, soft red light, USB-C rechargeable) plus a "not a medical device" disclaimer. No userErrors. (Note: the `input` argument on `productCreate` is deprecated in this API version — used `product: ProductCreateInput` instead.)
- **`productVariantsBulkUpdate`** — set the default variant (`gid://shopify/ProductVariant/48369295786242`) price to $499.00, compareAtPrice to $699.00. No userErrors.
- **`productUpdate` with `media`** — attached the 3 Higgsfield-generated placeholder images (from `brand/assets/placeholders/`, via their CDN URLs) to the product. No userErrors. (Note: `productCreateMedia` is deprecated in this API version — used `productUpdate(product, media)` instead.)
- Product is **Draft** — not visible on any sales channel, per rule 3. Nothing published.

## 2026-08-23 — Product sourcing read + draft listing prepared (store creation still blocked)

- Read the full Alibaba sourcing PDF (`sourcing/FireShot Capture 022...`) by rendering it directly via poppler's full install path (winget PATH still not live in this session — see `CLAUDE.md` gotchas) and splitting the resulting ~12,800px-tall page image into crops with Pillow.
- **Finding: the sourced device (Create Top Electronics, model `JT-8B`) does not match the offer brief's clinical-PBM claims.** It's an EMS/TENS pulse + 42°C heat + vibration neck massager with "mild red light" (no stated wavelength/irradiance), certified FCC/CE/RoHS only (safety/EMC, not medical). Flagged to user; user chose to rewrite listing copy to match the real spec sheet rather than ship the offer brief's 660nm/850nm/clinical-irradiance language.
- Installed Puppeteer (first globally, then correctly as a local project dependency after discovering `NODE_PATH` doesn't work with Node's ESM resolver) — `screenshot.mjs` added and smoke-tested against `https://example.com`, works end to end. Details in `CLAUDE.md` → "Frontend / visual verification workflow."
- Generated 3 placeholder product images via Higgsfield (`recraft_v4_1`, model_type `utility`, 2k) per user's request, since no real product photography exists yet. Saved to `brand/assets/placeholders/` with a README flagging them as AI-generated, not real photos, to be replaced before publish.
- Drafted (not yet created) a MotiThera product listing built only from verified sourcing-PDF specs: heat, 4-node vibration massage, low-frequency pulse modes, soft red light, USB-C rechargeable, flexible hands-free fit — plus an explicit "not a medical device" disclaimer line. Price $499.00 / compare-at $699.00 per user. Status would be Draft per rule 3.
- **Not yet executed — still blocked on Shopify auth.** `~/.config/shopify` still doesn't exist on this machine as of this entry. No `shopify store auth` or `store execute` call has been made.

- Reviewed a frontend-focused `CLAUDE.md` from a prior project (Flove) the user uploaded, to see what was worth porting over. Kept: the local-server-before-screenshot discipline (adapted from a static-file `node serve.mjs` setup to Shopify's `shopify theme dev`), the "check `brand/assets/` before using placeholders" convention, and a design-guardrails section framework (left unpopulated — no `brand/BRAND_GUIDE.md` yet). Dropped: the verbatim-copy-phrasing rule, per user.
- Added `## Frontend / visual verification workflow`, `## Design system guardrails`, and `## Brand assets` sections to `CLAUDE.md`.
- Created `brand/assets/` (empty, with a README) and `.gitignore` (ignoring `temporary screenshots/`, which doesn't exist yet).
- Puppeteer is **not installed** on this machine — noted in `CLAUDE.md` to install when theme work actually starts, not preemptively.

## 2026-08-23 — Environment bootstrap

- Confirmed environment: Node v24.13.1, npm 11.8.0, Shopify CLI 4.7.0, `shopify-ai-toolkit` plugin v1.7.0 installed (user scope).
- Installed Poppler (`pdftoppm` etc.) via `winget install oschwartz10612.Poppler` to enable reading image-only PDFs (`swipe/`, `sourcing/`). Requires a Claude Code restart to take effect (PATH updated by winget, not picked up by the already-running process).
- Attempted `shopify auth login` (twice: bare, then with `--alias motithera`) from Claude Code's Bash tool. Both failed — no TTY for the interactive account picker (`Failed to prompt: Which account would you like to use?`). **Not authenticated on this machine.** User needs to run `shopify auth login` themselves in an interactive terminal.
- Reorganized project root: moved the four foundational `.docx` files and two FireShot PDF captures into `brand/`, `offer/`, `research/`, `sourcing/`, `swipe/`.
- Converted the four `.docx` files to Markdown companions (kept originals) using a one-off stdlib script (`zipfile` + `xml.etree.ElementTree`), since no `pandoc`/`python-docx` was available: `brand/AVATAR_SHEET.md`, `brand/NECESSARY_BELIEFS.md`, `offer/OFFER_BRIEF.md`, `research/MARKET_RESEARCH_DOSSIER.md`.
- Rewrote `CLAUDE.md` for MotiThera (was still the LullyRest version). Added a "Shared store" section since this store also hosts LullyRest — MotiThera work must not touch LullyRest's existing theme/product/page objects.
- Added `README.md` (project index) and this `PROGRESS.md`.
- No Shopify store data was created, modified, or read in this session — bootstrap was local-files-only plus the failed auth attempts above.
- `git init` + remote `origin` set to `https://github.com/Imanonameandyou/motithera.git` (user-provided), initial commit, pushed to `main`.
