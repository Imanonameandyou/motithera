# PROGRESS LOG

Audit log of every API call and file change made to the store or this project. Newest entries at the top.

---

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
