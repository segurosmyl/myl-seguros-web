# SESSION HANDOFF — MYL Seguros Web

**Date:** 2026-05-28
**Status:** Branding refresh, contact update, carrier prioritization, and logo upgrade complete. QA baseline maintained at 323 PASS / 0 FAIL. Website functionally complete — pending production infrastructure migration.

---

## 1. Project Overview

### Project
**MYL Seguros Web** — marketing and lead-generation website for M&L Seguros, a Colombian insurance broker. The site presents insurance product lines, lets visitors compare options, and routes inquiries to the broker via a contact form backed by Google Apps Script.

### Architecture
Pure static HTML/CSS/JS. No build step, no framework, no bundler. Files are served directly; deployment target is Cloudflare Pages or Vercel. The Myli AI chatbot is the only component with a backend dependency (Cloudflare Worker proxying the Anthropic API — key never exposed in frontend code).

### Routing Structure

| Route | File | Codepath |
|---|---|---|
| `/` | `index.html` | Standalone — all HTML/CSS/JS inline |
| `/vida/` | `vida/index.html` | Shared layout via `js/shared-layout.js` |
| `/autos/` | `autos/index.html` | Shared layout via `js/shared-layout.js` |
| `/cumplimiento/` | `cumplimiento/index.html` | Shared layout via `js/shared-layout.js` |
| `/generales/` | `generales/index.html` | Shared layout via `js/shared-layout.js` |
| `/comparar/` | `comparar/index.html` | Inline nav — loads `css/shared.css`, does NOT use `shared-layout.js` |
| `/contacto/` | `contacto/index.html` | Inline nav — loads `css/shared.css`, does NOT use `shared-layout.js` |
| `/aliadas/` | `aliadas/index.html` | Inline nav — loads `css/shared.css`, does NOT use `shared-layout.js` |
| `/[product-slug]/` | `[slug]/index.html` | Generated subpages — use `js/subpage-renderer.js` + `js/category-renderer.js` |

### Three Distinct Nav Codepaths

1. **Home (`index.html`)** — does not load `shared.css`. All CSS is inline in `<style>` tags. Nav, footer, and mobile drawer are hand-coded HTML in the same file.

2. **Shared-layout pages (vida / autos / cumplimiento / generales)** — load `css/shared.css`. Nav and footer are JS-injected at runtime by `js/shared-layout.js` via `injectLayout()`.

3. **Inline-nav pages (comparar / contacto / aliadas)** — load `css/shared.css` but have their own hand-coded nav HTML.

### CSS Architecture

- **`css/shared.css`** — global stylesheet loaded by all pages except `index.html`. Contains nav, footer, mobile drawer, shared component classes, and all responsive breakpoints for shared components.
- **`index.html` inline `<style>`** — home-page-only styles. Completely independent of `shared.css`.
- **Page-specific inline styles** — `comparar/index.html`, `contacto/index.html`, `aliadas/index.html` each have a `<style>` block on top of the shared.css base.

### JS Architecture

| File | Role |
|---|---|
| `js/shared-layout.js` | Injects nav, footer, Myli shell, and mobile drawer HTML into shared-layout pages. |
| `js/mili-chat.js` | Myli AI chatbot UI and API interaction. Routes to Cloudflare Worker. **Frozen — do not modify logic.** |
| `js/subpage-renderer.js` | Renders product subpages dynamically from JSON data. Contains `prioritizeCarriers()` global helper. |
| `js/category-renderer.js` | Renders category landing pages. |
| `js/category-meta.js` | Metadata for category pages. |
| `js/gobernanza-data.js` | Data file for gobernanza content. |
| `js/sheets-client.js` | Google Sheets client helper. |

---

## 2. Session Summary — 2026-05-28

### Commits This Session

| Commit | Description |
|---|---|
| `e14ab9b` | Commit A: comparar subtitle bump + aliadas priority ordering |
| `aa71b9e` | Commit B: footer typography +1px across all selectors |
| `4d52601` | Commit C: replace aliados_confianza_v3 with v4 |
| `d0055d2` | Commit D: contact info, WhatsApp, form notifications |
| `b22459e` | Commit E: rebrand Mili → Myli (user-facing text only) |
| `7cc0b88` | Commit F: replace Logo V2 with V3 across all routes |
| `ad7a1ab` | Fix: Aliadas and Contacto desktop nav links on home page |
| `01b736f` → `619fe83` | Logo V3 sizing iterations (Option B → final approved) |
| `60f8cd8` | Footer: compact logo-to-text spacing |
| `37b91df` | Navbar height 92px → 88px |
| `33e27f0` | Global carrier priority rule: SURA first, Seguros del Estado second |

---

### A — Navigation Fix

Desktop nav on `index.html` had broken anchor links (`href="#aliadas"`, `href="#contacto"`) that pointed to non-existent in-page IDs. Mobile drawer already had correct paths. Fixed desktop nav to match.

**File:** `index.html` — 2 lines changed
**Commit:** `ad7a1ab`

---

### B — Myli Rebrand

Renamed all user-facing "Mili" text to "Myli" across the entire site. Internal JS identifiers, CSS classes, IDs, and the filename `mili-chat.js` are intentionally unchanged — renaming them would break chat functionality.

**Changed:**
- FAB title: "Hablar con Myli"
- Chat header: "Myli · Asesora M&L"
- Footer status: "Myli IA disponible 24/7"
- Greeting messages in `js/mili-chat.js` (lines 63, 65)
- System prompt in `js/mili-chat.js` (line 141): "Eres Myli, la asesora virtual..."
- All marketing copy on `index.html` and product cards

**Unchanged:** `openMili()`, `closeMili()`, `resetMili()`, `.mili-*` CSS classes, `#miliWindow`, `#miliSideBtn`, `js/mili-chat.js` filename

**Files:** 35 production files (~113 text replacements)
**Commit:** `b22459e`

---

### C — Logo Upgrade (V2 → V3)

Replaced `Logo_Leon_V2_transparente.png` with `Logo_Leon_V3_transparente.png` site-wide.

**Key dimension difference:**
- V2: 1666 × 624 px (aspect ratio 2.67:1 — wide landscape)
- V3: 1536 × 1024 px (aspect ratio 1.5:1 — near square)

**Final approved CSS values:**

| Selector | Value | Rendered V3 width |
|---|---|---|
| `nav#navbar height` | 88 px | — |
| `.nav-logo height` | 88 px | 132 px |
| `.footer-logo height` | 84 px | 126 px |
| `.footer-logo margin-bottom` | 0 (+ `vertical-align: top`) | — |
| `.nav-mobile-logo height` | 72 px | 108 px |

**IMPORTANT — pre-production:** `Logo_Leon_V3_transparente.png` at root is **2.55 MB** (unoptimized). Must be compressed to ≤300 KB before production deployment. The file at `images/Logo_Leon_V3_transparente.png` is the same source.

**Files:** `css/shared.css`, `index.html`, `js/shared-layout.js`, all 27 subpages, comparar/contacto/aliadas, `generate-subpages.js`
**Commit chain:** `7cc0b88` → `01b736f` → `619fe83` → `37b91df` → `60f8cd8`

---

### D — Contact Information

| Field | Old value | New value |
|---|---|---|
| Public phone | +57 318 651 7626 | **+57 320 278 0611** |
| Public email | info@consultoresmyl.com | **mateusyd@segurosmyl.com** |
| WhatsApp target | 573186517626 / 57XXXXXXXXXX | **573212414529** |
| Lead notification | erasoc@gmail.com | **vargash@segurosmyl.com, mateusyd@segurosmyl.com** |

**Note:** `docs/contact-form.gs` was updated locally. The deployed Google Apps Script endpoint still runs the old version until the client manually redeploys from the Apps Script UI — or until the script is migrated to the client account.

**Files:** 36 files (all routes + `js/shared-layout.js` + `js/mili-chat.js` + `js/subpage-renderer.js` + `docs/contact-form.gs`)
**Commit:** `d0055d2`

---

### E — Carrier Priority Rule

Implemented a global SURA-first / Seguros del Estado-second ordering rule, applied consistently wherever carriers or products are displayed.

**Logic:**
1. If both SURA and Seguros del Estado exist → SURA first, SdE second, rest unchanged
2. If only SURA exists → SURA first, rest unchanged
3. If only SdE exists → SdE first, rest unchanged
4. If neither exists → original order preserved, no sorting introduced

**Implementation:** `prioritizeCarriers(items)` helper added to `js/subpage-renderer.js` (top of file). Works with both product objects (`item.carrier_name`) and plain strings. Uses filter-based stable ordering (not `Array.sort()`).

**Applied at:**
- `renderLogoChipsAll()` in `subpage-renderer.js` → carrier chips on all 27 product-type cards
- `renderCarriersStrip()` in `subpage-renderer.js` → carrier logo strip on all subpages
- `renderProductGrid()` in `comparar/index.html` → product cards in comparison view
- `loadAliadas()` in `aliadas/index.html` → already had equivalent `PINNED_CARRIERS.sort()`, unchanged

**Files:** `js/subpage-renderer.js`, `comparar/index.html`
**Commit:** `33e27f0`

---

### F — Other Polish (Commits A–C)

| Change | File | Commit |
|---|---|---|
| Comparar hero subtitle: 16px → 18px | `comparar/index.html` | `e14ab9b` |
| Footer typography +1px (all selectors) | `css/shared.css` + `index.html` | `aa71b9e` |
| aliados_confianza_v3 → v4 | `index.html` | `4d52601` |

---

## 3. Current QA Baseline

**323 PASS / 0 FAIL** — maintained throughout session.

Tested at: 320 / 375 / 390 / 414 / 768 / 1440 px across all 6 routes.

Run: `node qa-mobile-phase-a.js` (requires server on `http://localhost:3001`)

---

## 4. Files Modified This Session

| File | Changes |
|---|---|
| `css/shared.css` | Footer typography, logo sizes, navbar height, footer logo spacing |
| `index.html` | All of the above (duplicate inline styles) + logo swap + contact info + Myli text + nav links + aliados_confianza |
| `js/shared-layout.js` | Logo swap, contact info (phone + email), Myli text |
| `js/mili-chat.js` | Myli greeting text + system prompt (lines 63, 65, 141) + WhatsApp number |
| `js/subpage-renderer.js` | WhatsApp number, Myli card text, `prioritizeCarriers()` helper + carrier strip |
| `comparar/index.html` | Subtitle size, logo swap, contact info, Myli text, `prioritizeCarriers()` in product grid |
| `contacto/index.html` | Logo swap, contact info, WhatsApp links, Myli text + schedule label |
| `aliadas/index.html` | Logo swap, contact info, WhatsApp CTA |
| `generate-subpages.js` | Logo swap, email update, Myli template text |
| All 27 subpages | Logo swap, email update, Myli text (3 strings each) |
| `docs/contact-form.gs` | Lead notification email (requires manual Apps Script redeploy) |
| `Logo_Leon_V3_transparente.png` | New root-level logo asset (2.55 MB — compress before production) |

---

## 5. Open Items for Next Session

### Priority 1 — Myli Phase 1 Implementation

Review scope documents before starting:
- `docs/Mili_Phase_1_Assistant.md`
- `docs/Mili Architecture Decisions.md`

Architecture decisions locked:
- n8n orchestration
- Claude Sonnet LLM
- Google Sheets as data source
- Cloudflare Worker as secure API proxy
- No CRM, avatar, or voice in Phase 1

The `js/mili-chat.js` UI shell exists. The Cloudflare Worker proxy is not yet deployed. The Anthropic API key must never appear in any frontend file.

---

### Priority 2 — Logo V3 Compression

Before any production deployment, compress `Logo_Leon_V3_transparente.png` from 2.55 MB to ≤300 KB.

Replace both:
- `Logo_Leon_V3_transparente.png` (root — live production reference)
- `images/Logo_Leon_V3_transparente.png` (source copy)

Then commit a new "Commit F production" replacing both files.

---

### Priority 3 — Google Workspace Migration

**Google Sheet:** Transfer `1YivNd2BoXqwbSrrDEJNmT7ACJ1Z4RTz4YhTTqcgPhbQ` to `tecnologia@segurosmyl.com` (or final client account).

**Google Apps Script:** Rebuild `contact-form.gs` under client ownership.
- Target accounts: `vargash@segurosmyl.com`, `mateusyd@segurosmyl.com`
- Redeploy as Web App
- Update `APPS_SCRIPT_URL` in `contacto/index.html`
- Verify form submissions → email delivery → no spam filtering

Current `docs/contact-form.gs` is updated locally but the deployed endpoint still uses the old `erasoc@gmail.com` recipient.

---

### Priority 4 — GitHub Migration

- Create or verify client GitHub account
- Transfer repository ownership
- Validate build after transfer

---

### Priority 5 — Vercel Migration

- Vercel support ticket open: **Case 01202547** (waiting for response)
- Once unblocked: create client Vercel project, connect GitHub repo, set environment variables, validate deployment

---

### Priority 6 — Production Domain

After GitHub + Vercel are complete:
- Configure `segurosmyl.com` and `www.segurosmyl.com`
- SSL, redirects, DNS, production build validation

---

### Priority 7 — Contact Form Production Validation

After Apps Script migration:
- Test form submission end-to-end
- Verify email delivery to `vargash@segurosmyl.com` and `mateusyd@segurosmyl.com`
- Verify spam behavior, input validation, logging

---

## 6. Known Technical Debt

### Logo V3 unoptimized (BLOCKING for production)
`Logo_Leon_V3_transparente.png` is 2.55 MB. Must compress to ≤300 KB before production.

### Duplicated mobile drawer markup
Drawer HTML/JS copy-pasted into `comparar/index.html`, `contacto/index.html`, `aliadas/index.html`. Any nav link change must be applied to all three files AND `js/shared-layout.js`.

### Home page CSS entirely inline
~1,600+ lines of inline CSS in `index.html` after all session changes. Any shared token change (colors, spacing) must be applied to both `shared.css` and `index.html` independently.

### Myli WhatsApp in mili-chat.js (functional but frozen)
The escalation button in the chat now correctly points to `573212414529`. The file was approved for this one change only. Any further chat logic changes require explicit authorization.

### Apps Script not yet redeployed
`docs/contact-form.gs` updated locally with new notification emails. The live endpoint still emails `erasoc@gmail.com`. Requires manual redeploy — or migration to client account (Priority 3 above).

### Carousel mobile approach uses !important transform override
The carousel JS sets `track.style.transform` on an interval. On mobile, `transform: none !important` suppresses this. If the carousel JS is significantly refactored, the mobile scroll-snap implementation must be revisited.

---

## 7. Recovery Instructions

### Run local dev server

```bash
npx serve . -p 3001
```

The QA script expects `http://localhost:3001`.

### Run QA

```bash
node qa-mobile-phase-a.js
```

### Stable baseline

Current stable commit: `33e27f0` on branch `main`.

### Key credentials (do not expose publicly)

- **Apps Script endpoint** — in `contacto/index.html` as `APPS_SCRIPT_URL`. Update after migration.
- **WhatsApp number** — `573212414529` (client number, confirmed).
- **Anthropic API key** — lives exclusively in the Cloudflare Worker. Never in any frontend JS file.
- **Google Sheets ID** — `1YivNd2BoXqwbSrrDEJNmT7ACJ1Z4RTz4YhTTqcgPhbQ`

---

## 8. AI-Assisted Development Workflow

**Human (Cesar Eraso)** — product decisions, architecture approvals, scope definition, final commit authorization, visual review, real-device testing, client relationship.

**Claude Code** — implementation of approved plans: HTML/CSS/JS editing, QA automation, root-cause analysis, diff previews.

**Established workflow:**
1. Define scope and constraints (human).
2. Claude Code performs analysis — no edits yet.
3. Claude Code produces a patch plan.
4. Human reviews and approves.
5. Claude Code applies approved edits.
6. Claude Code runs QA and reports.
7. Human approves commit message; Claude Code commits.
