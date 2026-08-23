# PROGRESS LOG

Audit log of every API call and file change made to the store or this project. Newest entries at the top.

---

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
