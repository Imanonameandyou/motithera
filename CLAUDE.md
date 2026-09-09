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

- Connection method: Shopify CLI (4.7.1). Store-scoped ops run via `shopify store auth --store <domain> --scopes <scopes>` + `shopify store execute --store <domain> --query '...'` (`--allow-mutations` for writes) — no custom app / Admin API token needed. `shopify store execute` returns the **raw result object, not wrapped in a GraphQL `data` key** — a `userErrors`-checking parser must not assume a `data` wrapper.
- **Store domain: gcvy0q-cb.myshopify.com** (admin: https://admin.shopify.com/store/gcvy0q-cb). Same store as the LullyRest project — see "Shared store" below.
- **Auth: done on the current machine** (`shopify auth login` + `store auth` with `read_products,write_products,read_themes,write_themes,read_content,write_content`, re-scoped 2026-09-09 — `read_content,write_content` added for `pageCreate`; org `MotiThera` / 229789884, plan Basic).
- **GraphQL quoting on Windows:** PowerShell mangles inline GraphQL containing `gid://...` strings (`Invalid GraphQL syntax: Expected Name, found ":"`). Run store queries from the **Bash** tool calling node directly instead: `"/c/Program Files/nodejs/node.exe" "$APPDATA/npm/node_modules/@shopify/cli/bin/run.js" store execute --store … --query '…'`. Auth is per-machine; config paths, the per-machine detail, and why first-time `shopify auth login` needs the user are in [`docs/ENVIRONMENT.md`](docs/ENVIRONMENT.md).
- **First MotiThera product created 2026-08-23**, DRAFT status: `gid://shopify/Product/9595773681922` ("MotiThera Neck Relax — Heat, Pulse & Red Light Massager", $499.00 / compare-at $699.00, 3 placeholder images). Full mutation log in `PROGRESS.md`.
- **MotiThera draft theme created 2026-08-24**: `MotiThera — Presell + PDP (draft)`, theme id `163621273858`, role `unpublished` — created by pulling Horizon (`163498262786`) locally to `theme/` and pushing with `--unpublished`. This is now the only theme MotiThera work should touch (`shopify theme dev --theme 163621273858 ...`). **Horizon is a block-composition theme** (JSON templates nesting `group`/`text`/`image`/`icon`/`button`/`accordion`/`marquee` block primitives inside a handful of section shells like `hero.liquid`, `media-with-content.liquid`, the generic `section.liquid` canvas) — not the classic one-bespoke-Liquid-file-per-section model. See `docs/superpowers/plans/2026-08-24-product-presell-page.md` for the confirmed real schemas.
- When authoring new Admin GraphQL mutations, use the `shopify-plugin:shopify-admin` skill (search docs, then validate the query, before executing) rather than relying on trained knowledge of field names — the API changes: `productCreate` now takes a `product: ProductCreateInput` argument (the old `input` arg is deprecated), and `productCreateMedia` is deprecated in favor of `productUpdate(product, media)`. Both discovered by the skill's validator, not by guessing.

## Shared store — LullyRest is also here

This store used to be single-brand (LullyRest). It's now shared between **LullyRest** and **MotiThera**. Known LullyRest objects that MotiThera work must never read, write, or publish over:

- Theme `LullyRest — Presell + PDP (draft)` (`163498656002`) — role **live** (confirmed via `shopify theme list` 2026-08-24). This is the current storefront — never touch it.
- Theme **Horizon** (`163498262786`) — role **unpublished** (as of 2026-08-24; was live earlier in the project, roles can flip — always re-check with `shopify theme list` rather than trusting this note before assuming which theme is live). MotiThera's first draft theme (`163621273858`) was duplicated from this before the 2026-08-24 switch to elixir below — that theme/local `theme-horizon-unused/` folder is superseded, kept only for reference, not actively worked in.
- LullyRest product `9589261009154` and bonus/GWP products (`9591781064962`, `9591783981314`, `9591784243458`), page `136591114498` (handle `presell`).
- LullyRest's own repo/history lives in a separate git remote (`lullyrestcode.git`) — not this one.

**Exception, user-approved 2026-08-24: theme `elixir-1-6-1-pillow` (`163498426626`) may be used as a duplication source for MotiThera.** It's LullyRest's original source theme, but the user explicitly said MotiThera can build on it too. The rule is still: duplicate it into a **new, separate, MotiThera-owned unpublished theme** (pull + `theme push --unpublished` under a new name, same pattern used for the Horizon draft) — never edit theme `163498426626` itself, and never touch the two LullyRest theme/product objects listed above. Confirm this distinction is still what's wanted before assuming it extends to any other LullyRest object.

MotiThera work duplicates its own theme and creates its own products/pages from scratch. If a task seems like it needs to directly read, write, or publish one of the *live/off-limits* objects above (not a duplication-source theme), stop and confirm with the user first — that's almost certainly a mistake.

## Brand / product context

- **Brand:** MotiThera. **Product:** MotiThera Neck Relax — a wireless, hands-free neck massager: constant-temperature heat, 4-node vibration massage, low-frequency pulse modes, and a soft red light glow. **The offer brief below was written around a clinical dual-wavelength (660nm/850nm) photobiomodulation device — the actual sourced unit does not have those specs verified (see "Claim integrity").** Visual identity: `brand/BRAND_GUIDE.md` ("Clinical Authority" — locked 2026-08-23).
- **Audience:** Primarily women 35–62 (core 40–52), knowledge workers / remote or hybrid employees with a forward-head desk posture problem ("coat hanger" trap pain, afternoon tension headaches). Full profile: [`brand/AVATAR_SHEET.md`](brand/AVATAR_SHEET.md).
- **Positioning / mechanism (offer brief, treat as aspirational — see claim integrity):** "Cinderella Energy Crisis" — sustained screen posture starves Type I muscle fibers of ATP, locking them in contraction; dual-wavelength PBM photodissociates nitric oxide to restart ATP production and release the knot. This is the offer brief's original framing, written before the actual device was sourced — the *emotional* positioning (posture → tension → relief) still applies, but don't repeat the specific clinical-mechanism claims (ATP/nitric oxide/photodissociation) as fact for this device. Full offer strategy, headlines, objections, funnel architecture: [`offer/OFFER_BRIEF.md`](offer/OFFER_BRIEF.md).
- **Funnel-critical beliefs** a prospect must hold before buying: [`brand/NECESSARY_BELIEFS.md`](brand/NECESSARY_BELIEFS.md) — use as a coverage checklist when writing any presell/PDP copy, but same caveat as above on the specific mechanism claims.
- **Market research / voice-of-customer:** [`research/MARKET_RESEARCH_DOSSIER.md`](research/MARKET_RESEARCH_DOSSIER.md) — long document, grep it rather than reading end to end.
- **Product sourcing:** [`sourcing/`](sourcing/) — Alibaba listing for the sourced device (Create Top Electronics, model `JT-8B`): EMS/TENS pulse, 42°C heat, 4 vibration massage nodes, "mild red light" (no stated wavelength/irradiance), FCC/CE/RoHS certified (safety/EMC, not medical). Already read — see `PROGRESS.md` 2026-08-23 for how (poppler direct-path workaround) and the full finding.
- **Competitor swipe:** [`swipe/`](swipe/) — Kineon (kineon.io) neck-and-shoulder use-case landing page, two captures: `Capture 021` (earlier) and `Capture 023` (2026-08-24, supersedes 021 — used as the structural reference for the product page build below). **Read this before writing any page copy or choosing a page format**, same convention as the LullyRest project.

### Before writing any MotiThera customer-facing copy — always read these first

Don't write headlines, PDP/presell copy, FAQ answers, ad copy, or emails from memory or general knowledge of the niche. Always (re-)read, in this order:

1. `brand/AVATAR_SHEET.md` — who we're talking to, their pain in their own words (use verbatim quotes where possible)
2. `brand/NECESSARY_BELIEFS.md` — the belief checklist the copy needs to cover before a CTA
3. `offer/OFFER_BRIEF.md` — positioning/mechanism/objections, but filter everything through "Claim integrity" below before it ships
4. `research/MARKET_RESEARCH_DOSSIER.md` — grep for the specific topic, it's long
5. `swipe/` (Kineon) — structure/format reference, read before choosing a page format
6. `brand/BRAND_GUIDE.md` — voice section (§8) and reference copy example (§9) for how it should actually sound once claim-integrity has filtered it

This list itself doesn't change often — but the underlying docs do (e.g. a `[VERIFY]` claim gets confirmed or rejected), so re-read them each time rather than relying on a memory of what they said last session.

## Claim integrity (standing rule — extra weight in this niche)

Never ship a review, star rating, review count, testimonial, named endorsement, certification, or clinical result that does not actually exist. Hold the slots open and label them `[EMPTY]` instead.

This niche carries **more regulatory exposure than a pillow**: it's a light-emitting device making implicit health claims (pain relief, cellular/ATP mechanism, "clinical-grade," "medical-grade"). Treat every claim sourced from `offer/OFFER_BRIEF.md` and `research/MARKET_RESEARCH_DOSSIER.md` as a draft, not a fact:

- Anything marked `[VERIFY: …]` in `offer/OFFER_BRIEF.md` (the Lancet/820-patient citation, "5,000 studies," HSA/FSA eligibility, the >100 mW/cm² irradiance spec) **must be confirmed against a real source or the actual sourced device** before it appears in any customer-facing copy. Until verified, keep the `[VERIFY]` marker inline.
- **Exception — guarantee/warranty CONFIRMED real by user 2026-08-24:** 60-day money-back guarantee (prepaid return shipping, full refund) + 1-year hardware warranty. Safe to state as fact, no `[VERIFY]` flag. This overrides the offer brief's unconfirmed 60-day figure and `research/MARKET_RESEARCH_DOSSIER.md`'s 2-year warranty figure — 1 year is correct.
- **Still unconfirmed, do not claim:** HSA/FSA eligibility. Leave it out of copy entirely (not a fillable `[EMPTY]` slot) until the user confirms.
- **Sections that depend entirely on nonexistent proof** (star ratings/review counts, clinician endorsement badges, press-logo strips, stats/citation proof panels) — don't ship these with visible `[EMPTY]` placeholders; an empty carousel or logo strip reads as broken, not honest. Omit the section from the live template entirely; build the section file only if it's reasonably likely to be populated soon (e.g. a testimonial carousel), otherwise skip it. Never attach real general-research citations (e.g. genuine PBM literature) to imply clinical validation for this specific device — it's FCC/CE/RoHS-only, not medical-grade, and doing so is the same "clinical-grade laundering" this rule exists to prevent even when the citation itself is real.
- Keep product language structural ("supports," "designed to," "may help relax") rather than therapeutic/diagnostic ("treats," "cures," "relieves migraines," "FDA-cleared" unless it actually is).
- "Aerospace-grade," "medical-grade," "clinical irradiance" are marketing metaphors in the offer brief, not verified specs — don't launder them into hard claims without checking the actual sourced product's documentation.

## Windows / environment

Full detail (machine table, auth config paths, PDF-reading workaround, `.docx` conversion, screenshot mechanics) is in [`docs/ENVIRONMENT.md`](docs/ENVIRONMENT.md) — read the relevant part when doing that kind of work. The load-bearing bits:

- **PowerShell is the primary shell. The Bash tool does not see the Windows PATH** — use PowerShell, or call binaries by absolute path. Until a VS Code restart, prepend `$env:PATH = "C:\Program Files\nodejs;$env:APPDATA\npm;" + $env:PATH` in PowerShell calls.
- **`claude` CLI** (plugin/admin commands) is not on PATH — bundled at `C:\Users\Hexadrine\.vscode\extensions\anthropic.claude-code-<version>-win32-x64\resources\native-binary\claude.exe`.
- **`git push` fails from Claude's shells** (no stored GitHub credential, GCM can't prompt) — the user runs `git push` once in their own terminal, then Claude's pushes work.
- **Run setup/auth/CLI/install/commit commands yourself** — don't hand the user a checklist. Only `shopify auth login` (first-time) and the first `git push` genuinely need them. (Memory: [[run-setup-commands-yourself]].)
- `shopify-plugin@shopify-ai-toolkit` v1.8.0 is installed (user scope). Its 22 skills are picked up next session/restart.

## Token discipline

Keep context small — it's re-sent every turn. None of this trades away output quality; it removes waste.

- **Search, don't sweep.** Use `Grep`/`Glob` to locate; `Read` only the specific files/line ranges you need. Never read `node_modules/`, lockfiles, `.min.js`/`.map`, build output, or a whole directory "to get oriented." `.claude/settings.json` denies the worst offenders, but judgment still applies.
- **Name the files.** Prefer "edit `theme-elixir/sections/x.liquid`" over "look at the theme." Most tasks touch 2–3 files.
- **Delegate verbose work to a subagent** (`Task`) — multi-file exploration, log/output grinding, doc research. The bulky output stays in the subagent; only its conclusion returns. Use `model: haiku` for mechanical subagent tasks (renames, lookups, formatting).
- **`shopify-plugin` skills — use the in-scope ones only.** Relevant here: `shopify-admin`, `shopify-liquid`, `shopify-storefront-graphql`, `shopify-shopifyql`, `shopify-use-shopify-cli`, `shopify-custom-data`, `shopify-dev`. Do **not** invoke `shopify-hydrogen` (~58k tok on invoke), `shopify-pos-ui`, `shopify-functions`, or the `shopify-polaris-*` / `shopify-app-*` skills — not used on this project.
- **`/clear` between unrelated tasks; `/compact` when a session gets long.** A one-line question in a day-old session still re-bills the whole history.
- Reserve extended thinking / Opus for genuinely hard multi-step work; routine edits don't need them.
- MCP connectors (Canva, Gethookd, Gmail, Calendar, Klaviyo, Notion, Pipeboard, Stripe, Drive) each add always-on overhead. Only Higgsfield has been used here (placeholder image gen). Disabling the unused ones in claude.ai connector settings is a standing win — user action, flagged 2026-09-09.

## Frontend / visual verification workflow

Screenshot mechanics are in [`docs/ENVIRONMENT.md`](docs/ENVIRONMENT.md#screenshot-workflow-mechanics). The rules:

- **Invoke the `frontend-design` skill** before writing or restyling any theme section/template, every session, no exceptions. Pull in `shopify-plugin:shopify-liquid` for Liquid correctness.
- **Always preview from a live server, never a static file:** `shopify theme dev --store gcvy0q-cb.myshopify.com --theme 163622060290` (live-reload, default `http://127.0.0.1:9292`). Start it in the background before screenshotting; don't start a second instance if one's running.
- **Capture with `node screenshot.mjs <url> [label]`** → saves to `./temporary screenshots/`. `Read` the PNG and analyze it directly — don't just trust the Liquid diff.
- **Do at least 2 comparison rounds** per visual change (before/after, or against `swipe/`). Stop only when no visible differences remain against intent.

## Design system guardrails

**Locked 2026-08-23 — full spec in [`brand/BRAND_GUIDE.md`](brand/BRAND_GUIDE.md).** Identity direction: "Clinical Authority" — cool ink-on-porcelain, one restrained accent, tight radii, spec-sheet precision (the visual argument for why $499 is correct next to a $50 Amazon belt). Read the full doc before any theme/section work; quick reference:

- **Colors:** ink `#14202E` (text), porcelain `#FAF9F6` (bg), mist `#EEF2F3` (secondary surface), clay `#C1502E`/`#A43F22`/`#832F19` (primary accent + hover/active — also doubles as the error color), steel `#4C6B7A`/`#38505C` (secondary accent — links, kickers, diagrams). Two accents only, never a third hue.
- **Type:** Inter only, headings and body both — varying weight (400–800), not family. Full scale in the guide.
- **Forbidden:** default Tailwind palette colors, neon/alarm red, pastel wellness mint/lavender/blush, any radius above 6px (no pills/full-rounding), floating "soft UI" shadows, `transition: all`, gradients, soft-focus golden-hour lifestyle stock photography. Full list + rationale in the guide.
- **States:** every clickable element needs default/hover/active/focus-visible/disabled defined — see the guide's "Interactive states" section, don't ship hover-only.
- Drop-in CSS custom-properties block is at the bottom of the guide — paste directly into the theme once one exists.

The guide's example copy is deliberately spec-accurate (heat/pulse/red-light, not clinical PBM) per "Claim integrity" below — don't let old offer-brief language leak back in via a copy-pasted example.

## Brand assets

- **Check `brand/assets/` before designing anything.** If a logo, color guide, product photo, or other real asset exists there, use it — don't reach for a placeholder image or an invented color when a real asset is available.
- If `brand/assets/` is empty (it is, as of 2026-08-23), fall back to placeholders (`https://placehold.co/WIDTHxHEIGHT`) and flag in the response that a real asset would improve the result.

## File layout

```
CLAUDE.md              this file — always-loaded; keep it lean (see "Token discipline")
docs/ENVIRONMENT.md    situational tooling/auth/PDF/screenshot detail (not always-loaded)
.claude/settings.json  project settings — Read deny-list for build noise (token hygiene)
SHOPIFY_BOOTSTRAP.md    reusable environment-setup runbook (generic, not MotiThera-specific)
README.md               project index
PROGRESS.md             audit log of every store mutation / meaningful file change
brand/                   avatar, beliefs, BRAND_GUIDE.md (visual identity, locked 2026-08-23)
brand/assets/            logo, color guide, product photos — check before using placeholders
brand/assets/placeholders/  AI-generated (Higgsfield) product image placeholders — not real photography, swap before publish
offer/                   offer brief, funnel/positioning strategy
research/                market research & voice-of-customer dossier
sourcing/                Alibaba supplier screenshots — read before finalizing product specs
swipe/                   competitor landing pages to swipe structure/format from (Kineon)
theme-elixir/            ACTIVE MotiThera theme working copy (theme id 163622060290)
theme/                   superseded Horizon attempt — reference only, don't work in it
docs/superpowers/specs/ design specs (e.g. the product presell/PDP page design, 2026-08-24)
screenshot.mjs           Puppeteer screenshot runner — node screenshot.mjs <url> [label]
package.json / node_modules/  local Puppeteer install (npm install puppeteer already run)
temporary screenshots/   visual-verification screenshots (git-ignored)
```

## Session objectives (current)

As of 2026-08-23: environment bootstrapped (docs organized, `.docx` → Markdown, git initialized), Puppeteer visual-verification workflow set up and working, and the **first MotiThera product created** — `gid://shopify/Product/9595773681922`, DRAFT, $499/$699, 3 placeholder images (see "Store access" above and `PROGRESS.md` for the full mutation log). Copy was rewritten to match the actual sourced device's real spec sheet rather than the offer brief's unverified clinical-PBM claims, per the claim-integrity finding.

**As of 2026-08-24: presell + PDP page built and verified.** Modeled section-by-section on the Kineon swipe (`swipe/FireShot Capture 023...`), design spec at [`docs/superpowers/specs/2026-08-24-product-presell-page-design.md`](docs/superpowers/specs/2026-08-24-product-presell-page-design.md), implementation plan at [`docs/superpowers/plans/2026-08-24-product-presell-page.md`](docs/superpowers/plans/2026-08-24-product-presell-page.md) (written against Horizon, then superseded mid-build — see below).

**Build moved from Horizon to `elixir-1-6-1-pillow` mid-session, user-directed** — see "Shared store" above for the authorized exception, and `motithera_shared_theme_elixir` in Claude's memory. Active theme: **`MotiThera — Presell + PDP (elixir draft)`, id `163622060290`, unpublished**, local files at `theme-elixir/` (NOT `theme/` — that's the superseded Horizon attempt, kept for reference only, folder-locked but harmless). Template: `theme-elixir/templates/product.presell.json`, assigned via `?view=presell` (not yet set as the product's actual `templateSuffix` — that's the remaining step before this can be the product's default view).

**Product `gid://shopify/Product/9595773681922` is now ACTIVE status and published to the Online Store sales channel** (both user-directed, mid-session, to enable visual QA of the alternate template — Shopify's draft-preview mechanism doesn't honor `?view=` overrides). This means the product itself is generally reachable now — whichever theme is actually **published** (still LullyRest's live draft, not this MotiThera one) is what a customer would see if they found its URL, using that theme's default product template. The MotiThera presell theme itself remains unpublished, so rule 2 hasn't been crossed — but rule 3's "products default to Draft/Hidden" no longer describes this product's actual state; flag this if picking work back up here.

Full mutation log for this whole build: `PROGRESS.md`, 2026-08-24 entry.

## Git / version control

- Remote: https://github.com/Imanonameandyou/motithera.git — branch `main`.
- This repo tracks project files (research, brand docs, progress log, theme/code work once it starts). It does **not** deploy anything by itself — pushing here is separate from theme publishing (rule 2) or any storefront-visible action (rule 4).
- Workflow: `git pull` before starting work (rule 6) → make changes → commit → `git push origin main` (rule 7).

## Notes

- Store-specific schema details (custom metafields, product types, collection structure, etc.) get captured in Claude's memory as they're discovered, not duplicated here.

## Compact instructions

When compacting, preserve: (1) every unlogged store mutation and its result, so it can still be written to `PROGRESS.md`; (2) the active theme id (`163622060290`) and which local folder is live (`theme-elixir/`); (3) auth/tooling state changes; (4) any `[VERIFY]` claim that got confirmed or rejected this session; (5) the current task's decisions and open threads. Drop: file contents already read, tool-call transcripts, superseded drafts.
