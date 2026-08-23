# PROGRESS LOG

Audit log of every API call and file change made to the store or this project. Newest entries at the top.

---

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
