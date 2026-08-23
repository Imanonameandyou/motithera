# MotiThera — Shopify Store Project Conventions

This file records the standing rules for how Claude Code operates on this Shopify store. These rules apply to every session unless the user explicitly overrides them in the moment.

## Always-do rules (safety)

1. **Always `/plan` first.** For any task that mutates store data (products, discounts, theme files, pages, navigation, etc.), outline the plan — what will be read, what will be created/changed, and how it will be verified — before executing.
2. **Never edit the Live theme directly.** All theme/code changes happen in a duplicated draft theme. The Live theme is only touched via an explicit, user-approved "publish" step at the very end.
3. **New products, discounts, and pages default to Draft/Hidden.** Nothing goes live-facing without the user reviewing it first and giving explicit go-ahead to publish.
4. **Confirm before irreversible or customer-visible actions**: publishing a theme, activating a discount, publishing a product, sending customer-facing emails, deleting anything.
5. **Log every mutation.** Every API call or file change that alters store state gets an entry in `PROGRESS.md` (see below) — what was called, when, and the result.
6. **Pull before starting any work.** At the start of every session, and before making any file changes, run `git pull` on this repo to ensure the local copy is up to date and avoid merge conflicts.
7. **Push after every change.** Any commit made to this repo gets pushed to `origin main` immediately (`git push origin main`) — don't let local commits pile up unpushed. This does not override rule 2 (never publish the Live theme) or rule 4 (confirm before customer-visible actions) — pushing to this git repo is a code-storage action, not a storefront-publish action.
8. **This store is shared with LullyRest — never touch LullyRest's objects.** See "Shared store" below. Before creating or editing anything store-side, confirm it's scoped to MotiThera, not an existing LullyRest theme/product/page.

## Store access

- Connection method: Shopify CLI v4.7.0. Store-scoped API operations run via `shopify store auth --store <domain> --scopes <scopes>` + `shopify store execute --store <domain> --query '...'` — no custom app / manually-generated Admin API token needed.
- **Store domain: gcvy0q-cb.myshopify.com** (admin: https://admin.shopify.com/store/gcvy0q-cb). Same store as the LullyRest project — see "Shared store" below.
- **Auth status on this machine (as of 2026-08-23): not yet authenticated.** `~/.config/shopify` does not exist here. `shopify auth login` **cannot complete non-interactively** — it was attempted from Claude Code's Bash tool (including with `--alias`) and failed both times with `Failed to prompt: Which account would you like to use?` because there's no stdin/TTY for the account picker. **The user needs to run `shopify auth login` themselves in their own interactive terminal**, then confirm back here before any `shopify store auth` / `shopify store execute` calls.
- `shopify store execute` returns the raw result object, not wrapped in a GraphQL `data` key — parsers assuming `data` will silently miss `userErrors` and crash after a mutation has already committed. (Carried over from the LullyRest project; unverified against v4.7.0 but assume true until proven otherwise.)
- Store auth is per-machine — a machine with no `~/.config/shopify` needs `shopify auth login` + `shopify store auth` again, regardless of consent granted elsewhere.
- No MotiThera theme, product, or page has been created yet. This is greenfield — first store-side task should duplicate a theme (not yet chosen) into a MotiThera-specific draft, per rule 2.

## Shared store — LullyRest is also here

This store used to be single-brand (LullyRest). It's now shared between **LullyRest** and **MotiThera**. Known LullyRest objects that MotiThera work must never read, write, or publish over:

- Theme **Horizon** (`163498262786`) — role MAIN (live storefront for whichever brand is currently published — check before assuming).
- Theme `elixir-1-6-1-pillow` (`163498426626`) — UNPUBLISHED, LullyRest's source theme.
- Theme `LullyRest — Presell + PDP (draft)` (`163498656002`) — UNPUBLISHED, LullyRest's working draft.
- LullyRest product `9589261009154` and bonus/GWP products (`9591781064962`, `9591783981314`, `9591784243458`), page `136591114498` (handle `presell`).
- LullyRest's own repo/history lives in a separate git remote (`lullyrestcode.git`) — not this one.

MotiThera work duplicates its own theme and creates its own products/pages from scratch. If a task seems like it needs to touch any of the objects above, stop and confirm with the user first — that's almost certainly a mistake.

## Brand / product context

- **Brand:** MotiThera. **Product:** MotiThera Photobiomodulation Cervical Drape — a wireless, hands-free dual-wavelength (660nm red + 850nm near-infrared) light-therapy wearable for chronic neck/trap/shoulder tension and cervicogenic headaches.
- **Audience:** Primarily women 35–62 (core 40–52), knowledge workers / remote or hybrid employees with a forward-head desk posture problem ("coat hanger" trap pain, afternoon tension headaches). Full profile: [`brand/AVATAR_SHEET.md`](brand/AVATAR_SHEET.md).
- **Positioning / mechanism:** "Cinderella Energy Crisis" — sustained screen posture starves Type I muscle fibers of ATP, locking them in contraction; dual-wavelength PBM photodissociates nitric oxide to restart ATP production and release the knot. Full offer strategy, headlines, objections, funnel architecture: [`offer/OFFER_BRIEF.md`](offer/OFFER_BRIEF.md).
- **Funnel-critical beliefs** a prospect must hold before buying: [`brand/NECESSARY_BELIEFS.md`](brand/NECESSARY_BELIEFS.md) — use as a coverage checklist when writing any presell/PDP copy.
- **Market research / voice-of-customer:** [`research/MARKET_RESEARCH_DOSSIER.md`](research/MARKET_RESEARCH_DOSSIER.md) — long document, grep it rather than reading end to end.
- **Product sourcing:** [`sourcing/`](sourcing/) — Alibaba listing screenshot for the candidate supplier device ("Built-in Mild Red Light Warm Therapy Neck Relax Gear With Multi Adjustment"). Not yet read by Claude — see PDF rendering gotcha below. Read before finalizing product specs, since MotiThera's marketing claims (irradiance, wavelength accuracy, battery life) need to match what's actually sourced.
- **Competitor swipe:** [`swipe/`](swipe/) — Kineon (kineon.io) neck-and-shoulder use-case landing page. **Read this before writing any page copy or choosing a page format**, same convention as the LullyRest project.

## Claim integrity (standing rule — extra weight in this niche)

Never ship a review, star rating, review count, testimonial, named endorsement, certification, or clinical result that does not actually exist. Hold the slots open and label them `[EMPTY]` instead.

This niche carries **more regulatory exposure than a pillow**: it's a light-emitting device making implicit health claims (pain relief, cellular/ATP mechanism, "clinical-grade," "medical-grade"). Treat every claim sourced from `offer/OFFER_BRIEF.md` and `research/MARKET_RESEARCH_DOSSIER.md` as a draft, not a fact:

- Anything marked `[VERIFY: …]` in `offer/OFFER_BRIEF.md` (the Lancet/820-patient citation, "5,000 studies," HSA/FSA eligibility, the specific 60-day/2-year guarantee terms, the >100 mW/cm² irradiance spec) **must be confirmed against a real source or the actual sourced device** before it appears in any customer-facing copy. Until verified, keep the `[VERIFY]` marker inline.
- Keep product language structural ("supports," "designed to," "may help relax") rather than therapeutic/diagnostic ("treats," "cures," "relieves migraines," "FDA-cleared" unless it actually is).
- "Aerospace-grade," "medical-grade," "clinical irradiance" are marketing metaphors in the offer brief, not verified specs — don't launder them into hard claims without checking the actual sourced product's documentation.

## Windows / environment gotchas (this machine)

- **Poppler (`pdftoppm`) installed 2026-08-23 via `winget install oschwartz10612.Poppler`** to enable reading the image-only PDFs in `swipe/` and `sourcing/`. Winget updated the user PATH, but the already-running Claude Code process (and its Bash tool subprocess) doesn't pick that up until the session/app is restarted. **If `Read` on a PDF still errors with "pdftoppm is not installed," that's this — ask the user to restart Claude Code, not to reinstall anything.**
  - **Confirmed still true as of 2026-08-23** (later in the same day, still same un-restarted session): `Read` on a PDF with `pages` still fails with the same error, and `where pdftoppm` still resolves to nothing in Bash.
  - **Workaround that doesn't require a restart:** call the poppler binaries by their full install path directly — `/c/Users/jomat_nweuhlk/AppData/Local/Microsoft/WinGet/Packages/oschwartz10612.Poppler_Microsoft.Winget.Source_8wekyb3d8bbwe/poppler-25.07.0/Library/bin/pdftoppm.exe` (same dir has `pdftotext.exe`, `pdfinfo.exe`, etc.). Render the PDF to a PNG with `pdftoppm.exe -r 150 -png <pdf> <output-prefix>`, then — since these image-only PDFs are usually one very tall page (a full-page web capture, easily 10,000+ px tall) — split it into ~1500-1600px-tall crops with Pillow (`pip`/already-available `PIL`) before handing individual crops to `Read`; a single 12,000px-tall image is too tall to read usefully in one shot. `pdftotext.exe -layout` confirmed these FireShot captures have **no text layer** (0 bytes out) — image rendering is the only way to read them, there's no OCR shortcut here.
- No `python-docx` / `pandoc` installed. The four foundational `.docx` files were converted to Markdown by a one-off stdlib script (`zipfile` + `xml.etree.ElementTree` pulling `word/document.xml`) run from the scratchpad, not checked into this repo. If more `.docx` files show up, either write the same kind of script again or ask the user to install `pandoc`.
- Node v24.13.1, npm 11.8.0, Shopify CLI 4.7.0, `shopify-ai-toolkit` plugin v1.7.0 — verified 2026-08-23.

## Frontend / visual verification workflow

Applies once theme work starts (no theme exists yet — see "Session objectives"). Adapted from a screenshot-driven QA workflow used on a prior project; the mechanics differ because this is a Shopify theme, not a static HTML file.

- **Invoke the `frontend-design` skill** before writing or restyling any theme section/template, every session, no exceptions — it's the guidance for aesthetic direction and avoiding templated-default choices. Pull in the relevant `shopify-plugin:shopify-liquid` skill for Liquid-specific correctness.
- **Always preview from a live server, never a static file.** Use `shopify theme dev --store gcvy0q-cb.myshopify.com --theme <motithera-draft-theme-id>` (Shopify's live-reload preview, default `http://127.0.0.1:9292`) — this is the Shopify-theme equivalent of Flove's `node serve.mjs`. Start it in the background before taking screenshots; don't start a second instance if one's already running.
- **Screenshot workflow — installed and working as of 2026-08-23:**
  - Puppeteer is a **local project dependency** (`npm install puppeteer` ran in project root — see `package.json` / `node_modules/`, not global). Its bundled Chrome lives in the normal cache at `~/.cache/puppeteer/` (`chrome/`, `chrome-headless-shell/`).
  - `screenshot.mjs` (project root) is the runner: `node screenshot.mjs <url> [label]`. Smoke-tested against `https://example.com` — works end-to-end.
  - Saves to `./temporary screenshots/screenshot-N[-label].png` (git-ignored via `.gitignore`), auto-incrementing, never overwriting.
  - Point it at the `shopify theme dev` live-reload URL once that's running. After screenshotting, read the PNG with the `Read` tool and analyze it directly — don't just trust the Liquid diff.
  - Note: an earlier attempt installed Puppeteer **globally** and tried `NODE_PATH` to make a plain `node screenshot.mjs` find it — that doesn't work, Node's ESM resolver ignores `NODE_PATH`. Fixed by doing a normal local install instead (`npm init -y` + `npm install puppeteer` in project root) and removing the global copy. If Puppeteer ever seems "missing" despite being installed, check it's the local copy being resolved, not a global one.
- **Do at least 2 comparison rounds** (before/after, or against the swipe file in `swipe/`) per visual change. Stop only when no visible differences remain against intent.

## Design system guardrails

**Not yet populated — `brand/BRAND_GUIDE.md` doesn't exist yet** (name/price/offer are locked per the offer brief, but visual identity is not). Once it's locked, fill this section in with the same specificity as the rest of this file:

- Exact hex values for background/surface/border/accent/CTA — not "a purple accent," the literal hex.
- The exact font pairing (heading vs. body) and why they're paired.
- What's explicitly forbidden: default Tailwind/framework palette colors, `transition-all`, flat default shadows, generic wellness-brand pastels/mint — whatever this brand's anti-pattern list turns out to be once the identity is chosen.
- Required interactive states (hover/focus-visible/active) for every clickable element.
- Spacing/shadow/depth tokens, once decided, rather than ad hoc Tailwind steps.

Until this section is filled in, don't invent brand colors/fonts on the fly — ask, or point to a competitor/swipe reference and confirm before locking anything in.

## Brand assets

- **Check `brand/assets/` before designing anything.** If a logo, color guide, product photo, or other real asset exists there, use it — don't reach for a placeholder image or an invented color when a real asset is available.
- If `brand/assets/` is empty (it is, as of 2026-08-23), fall back to placeholders (`https://placehold.co/WIDTHxHEIGHT`) and flag in the response that a real asset would improve the result.

## File layout

```
CLAUDE.md              this file
SHOPIFY_BOOTSTRAP.md    reusable environment-setup runbook (generic, not MotiThera-specific)
README.md               project index
PROGRESS.md             audit log of every store mutation / meaningful file change
brand/                   avatar, beliefs, (BRAND_GUIDE.md once identity is locked)
brand/assets/            logo, color guide, product photos — check before using placeholders
brand/assets/placeholders/  AI-generated (Higgsfield) product image placeholders — not real photography, swap before publish
offer/                   offer brief, funnel/positioning strategy
research/                market research & voice-of-customer dossier
sourcing/                Alibaba supplier screenshots — read before finalizing product specs
swipe/                   competitor landing pages to swipe structure/format from (Kineon)
theme/                   (not created yet — added once a theme is duplicated for MotiThera)
screenshot.mjs           Puppeteer screenshot runner — node screenshot.mjs <url> [label]
package.json / node_modules/  local Puppeteer install (npm install puppeteer already run)
temporary screenshots/   visual-verification screenshots (git-ignored)
```

## Session objectives (current)

Environment bootstrap only, as of 2026-08-23: transferred foundational docs from a prior project, organized them into the folder layout above, converted `.docx` sources to Markdown companions, rewrote this file for MotiThera, initialized git. **No store-side work has started** — no theme duplicated, no product created. Shopify auth on this machine is still pending the user completing `shopify auth login` interactively (see "Store access" above). Next session should pick up with: confirm auth, pick/duplicate a theme for MotiThera, then start on positioning/copy using the docs above.

## Git / version control

- Remote: https://github.com/Imanonameandyou/motithera.git — branch `main`.
- This repo tracks project files (research, brand docs, progress log, theme/code work once it starts). It does **not** deploy anything by itself — pushing here is separate from theme publishing (rule 2) or any storefront-visible action (rule 4).
- Workflow: `git pull` before starting work (rule 6) → make changes → commit → `git push origin main` (rule 7).

## Notes

- Store-specific schema details (custom metafields, product types, collection structure, etc.) get captured in Claude's memory as they're discovered, not duplicated here.
