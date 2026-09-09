# Environment & tooling reference

Situational detail pulled out of `CLAUDE.md` to keep the always-loaded context small. Read the relevant part only when you're actually doing that kind of work (debugging tooling, PDF reading, screenshots, auth).

---

## Machines

Two machines have been used on this project.

| | Machine 1 | Machine 2 (current, from 2026-09-07) |
|---|---|---|
| User / host | `jomat_nweuhlk` | `l9moneyprinter\hexadrine` |
| Project path | — | `C:\Users\Hexadrine\Desktop\MotiTheraCode` |
| Poppler bin | `C:\Users\jomat_nweuhlk\AppData\Local\Microsoft\WinGet\Packages\oschwartz10612.Poppler_Microsoft.Winget.Source_8wekyb3d8bbwe\poppler-25.07.0\Library\bin` | `C:\Users\Hexadrine\AppData\Local\Microsoft\WinGet\Packages\oschwartz10612.Poppler_Microsoft.Winget.Source_8wekyb3d8bbwe\poppler-25.07.0\Library\bin` |

**Machine 2 state (bootstrapped 2026-09-07, full log in `PROGRESS.md`):** Node v24.19.0, npm 11.17.0, Shopify CLI 4.7.1, Poppler 25.07.0, local Puppeteer + Chrome 152. Shopify `auth login` + `store auth` (scopes `read_products,write_products,read_themes,write_themes`) done 2026-09-09. `shopify-plugin@shopify-ai-toolkit` v1.8.0 installed (user scope) via the bundled CLI 2026-09-09.

**Shells:** PowerShell is primary. **The Bash tool does not see the Windows PATH at all** — use PowerShell, or call binaries by absolute path from Bash. After a VS Code restart, `node` / `npm` / `shopify` / `pdftoppm` resolve on PATH without absolute paths; until then, prepend `$env:PATH = "C:\Program Files\nodejs;$env:APPDATA\npm;" + $env:PATH` in PowerShell calls.

**`claude` CLI** (for `plugin` / other admin commands) is not on PATH — it's the VS Code extension's bundled binary at `C:\Users\Hexadrine\.vscode\extensions\anthropic.claude-code-<version>-win32-x64\resources\native-binary\claude.exe`. Call it by full path.

**git push** from Claude's shells fails — no stored GitHub credential and Git Credential Manager can't prompt non-interactively. The user must run `git push` once in their own terminal (GCM browser sign-in), or set up `gh auth login` / a PAT credential helper once; after that Claude's pushes work.

---

## Shopify auth

- Config lives under `%APPDATA%\shopify-cli-kit-nodejs\Config\config.json` (auth session: `sessionStore` + `currentSessionId` keys) and `%APPDATA%\shopify-cli-store-nodejs\Config\config.json` (per-store scoped auth). **Not** `~/.config/shopify` — that Unix path has never existed on these Windows machines.
- Store auth is **per-machine** — a fresh machine needs `shopify auth login` + `shopify store auth` again regardless of consent elsewhere.
- First-time `shopify auth login` **cannot run non-interactively** (account-picker prompt, no TTY; `--alias` only reuses an existing session). The user runs this one. Everything after it — `shopify store auth`, `shopify store execute` — Claude runs.
- `shopify store execute` returns the **raw result object, not wrapped in a GraphQL `data` key** (e.g. `{"productCreate": {...}}` directly). Parsers assuming a `data` wrapper silently miss `userErrors`.
- `shopify store info --json` on CLI 4.7.1 returns `{organizationId, organizationName, adminUrl, subdomain}`.

---

## Reading PDFs (`swipe/`, `sourcing/`)

If `Read` on a PDF errors with "pdftoppm is not installed," Poppler is installed but not yet on this process's PATH — restart VS Code, **or** use the no-restart workaround:

1. Render with the full path: `<poppler-bin>\pdftoppm.exe -r 150 -png <pdf> <output-prefix>`
2. These FireShot captures are one very tall page (10,000+ px) with **no text layer** (`pdftotext -layout` yields 0 bytes — no OCR shortcut). Split the PNG into ~1500–1600 px-tall crops with Pillow (`PIL` is available) before handing crops to `Read`.

Same dir has `pdftotext.exe`, `pdfinfo.exe`, etc.

---

## `.docx` files

No `python-docx` / `pandoc`. The four foundational `.docx` files were converted to Markdown by a one-off stdlib script (`zipfile` + `xml.etree.ElementTree` pulling `word/document.xml`) run from the scratchpad, not checked in. For new `.docx` files, write the same kind of script again or ask the user to install `pandoc`.

---

## Screenshot workflow mechanics

Operational rules stay in `CLAUDE.md` ("Frontend / visual verification workflow"). Mechanics:

- Puppeteer is a **local** project dependency (`node_modules/`, not global). Bundled Chrome is in `~/.cache/puppeteer/`. If Puppeteer seems "missing," check the local copy is being resolved, not a global one — Node's ESM resolver ignores `NODE_PATH`, so a global install + `NODE_PATH` does **not** work.
- `screenshot.mjs` (project root): `node screenshot.mjs <url> [label]`. Saves to `./temporary screenshots/screenshot-N[-label].png` (git-ignored), auto-incrementing.
- First Chrome launch on a fresh machine can time out once (>30 s) while Windows Defender scans the new binary; subsequent launches are fine. No `--no-sandbox` needed once warm.
- Point it at the `shopify theme dev` live-reload URL (default `http://127.0.0.1:9292`). After capture, `Read` the PNG and analyze it directly.
