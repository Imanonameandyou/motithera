# PROGRESS LOG

Audit log of every API call and file change made to the store or this project. Newest entries at the top.

---

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
