# SESSION HANDOFF — MYL Seguros Web (Post-Migration)

**Date:** 2026-06-09
**Status:** Phase 1 fully closed. Myli consent flow live. Finesa removed. Stable commit: `1cb5b7a`.
**Phase complete:** Website build + client migration + Myli Phase 1 + Phase 1 closure polish.
**Next focus:** Phase 2 — Portal Operativo Inteligente M&L (spec approved). Deuda técnica: image compression, SEO, sitemap.

---

## 1. Project Overview

### Project
**MYL Seguros Web** — marketing and lead-generation website for M&L Seguros, a Colombian insurance broker. The site presents insurance product lines, lets visitors compare options, and routes inquiries to the broker via a contact form backed by Google Apps Script.

### Architecture Summary
Pure static HTML/CSS/JS. No build step, no framework, no bundler. Files are served directly from Vercel. The Myli AI chatbot is the only component with a backend dependency (n8n webhook at `https://n8n.segurosmyl.com/webhook/myli-chat` — API keys stored in n8n credentials vault, never in frontend code).

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
| `js/mili-chat.js` | Myli AI chatbot UI and API interaction. Routes to `https://n8n.segurosmyl.com/webhook/myli-chat`. Changes require explicit authorization from Cesar Eraso. |
| `js/subpage-renderer.js` | Renders product subpages dynamically from JSON data. Contains `prioritizeCarriers()` global helper. |
| `js/category-renderer.js` | Renders category landing pages. |
| `js/category-meta.js` | Metadata for category pages. |
| `js/gobernanza-data.js` | Data file for gobernanza content. |
| `js/sheets-client.js` | Google Sheets client helper. Reads product, carrier, and subcategory data. |

---

## 2. Infrastructure — Current State (All Client-Owned)

### Production Endpoints

| Resource | URL / ID | Status |
|---|---|---|
| **Live site (www)** | `https://www.segurosmyl.com` | ✅ Live |
| **Apex redirect** | `https://segurosmyl.com` → `www` | ✅ Active |
| **GitHub repository** | `https://github.com/segurosmyl/myl-seguros-web` | ✅ Client account |
| **Vercel project** | Connected to client GitHub | ✅ Auto-deploys on push |
| **Google Sheets** | `1t6ixz8gSDM2Yg14NggwuNru7Mid2npAR9AaxOvkccgc` | ✅ Client account |
| **Google Apps Script** | `AKfycbyLe5G5...FpOe/exec` | ✅ Client account, wired in production |
| **n8n VPS** | `https://n8n.segurosmyl.com` | ✅ Myli Phase 1 live |
| **Myli webhook** | `https://n8n.segurosmyl.com/webhook/myli-chat` | ✅ Wired in `js/mili-chat.js` |
| **OpenAI account** | Developer account | ✅ API key + billing configured |

### Git Remotes

| Remote | URL | Purpose |
|---|---|---|
| `new-origin` | `https://github.com/segurosmyl/myl-seguros-web.git` | **Active — always push here** |
| `origin` | `https://github.com/erasocesar/myl-seguros-web.git` | Developer archive — retired |

### Credentials Reference

| Secret | Location | Status |
|---|---|---|
| Anthropic API key | n8n credentials vault only | Never in any frontend file |
| OpenAI API key | Local env only — not in repo | Asset generation scripts only |
| WhatsApp | `573212414529` | Client-confirmed, live in production |
| Lead notification | `vargash@segurosmyl.com`, `mateusyd@segurosmyl.com` | Confirmed delivering |
| Google Sheets ID | `1t6ixz8gSDM2Yg14NggwuNru7Mid2npAR9AaxOvkccgc` | In `js/sheets-client.js` |
| Apps Script URL | `AKfycbyLe5G5...FpOe/exec` | In `contacto/index.html` |

---

## 3. Final Project Status

### Infrastructure — 100% Complete

| Item | Verified |
|---|---|
| GitHub migrated to client account | ✅ `https://github.com/segurosmyl/myl-seguros-web` |
| Vercel project under client account | ✅ Auto-deploys on push to `main` |
| `www.segurosmyl.com` live | ✅ Serving production traffic |
| `segurosmyl.com` apex redirect | ✅ Redirects to `www` |
| DNS configured and propagated | ✅ Validated |
| Google Sheets under client account | ✅ ID `1t6ixz8...` in production code |
| Google Apps Script under client account | ✅ Endpoint wired in `contacto/index.html` |
| OpenAI Developer account | ✅ API key created, billing configured |
| n8n VPS | ✅ Operational — Myli Phase 1 live |
| Myli webhook wired in `js/mili-chat.js` | ✅ `https://n8n.segurosmyl.com/webhook/myli-chat` |

### Contact Form — Production Validated

| Check | Result |
|---|---|
| Form submits to new Apps Script endpoint | ✅ Confirmed via DevTools Network |
| Lead written to client Google Sheet | ✅ Row appears in `CONTACT_LEADS` tab |
| Email to `vargash@segurosmyl.com` | ✅ Delivered |
| Email to `mateusyd@segurosmyl.com` | ✅ Delivered |

### Production Assets — All Deployed

| Asset | Status |
|---|---|
| `aliados_confianza_v5.png` | ✅ Deployed — commit `8e817bc`. v4 preserved in repo. |
| Logo V3 (`Logo_Leon_V3_transparente.png`) | ⚠️ Live but unoptimized — 2.55 MB (see open items) |

### Site Build — Complete

| Item | Status |
|---|---|
| 27 product subpages | ✅ Generated from Google Sheets |
| Myli rebrand (Mili → Myli, user-facing only) | ✅ All routes |
| Logo V3 deployed site-wide | ✅ Nav 88px, logo 88px / 132px rendered |
| Contact info updated | ✅ Phone, email, WhatsApp, notification emails |
| Carrier priority rule (SURA first) | ✅ `prioritizeCarriers()` in `subpage-renderer.js` |
| Desktop nav links fixed | ✅ `index.html` anchor hrefs corrected |
| QA baseline | ✅ 323 PASS / 0 FAIL — all breakpoints |
| Finesa removed from marquee + aliadas | ✅ `index.html` marquee (both loop instances) + `aliadas/index.html` CARRIER_URLS |
| Privacy link fixed in contacto | ✅ `contacto/index.html:369` — `href="#"` → Google Drive URL |
| Myli hybrid consent flow | ✅ Session-scoped, input gated, `privacyConsented` in n8n payload |
| aliados_confianza v5 | ✅ `index.html` updated, asset committed |

---

## 4. Session Log

### Session: 2026-06-09 — Phase 1 closure + Myli consent flow

| Commit | Descripción |
|---|---|
| `5304bcb` | docs: add Portal Operativo spec and Phase 1 closure plan |
| `39fa02d` | feat: Phase 1 closure — remove Finesa, fix privacy links, add Myli hybrid consent |
| `9a4efea` | fix: update Myli consent flow to match client-approved UX wording |
| `8e817bc` | feat: replace aliados_confianza_v4 with v5 |
| `0d3fbdb` | fix: update Myli consent notice to approved greeting wording |
| `3505059` | fix: add consent confirmation question to Myli greeting |
| `1cb5b7a` | fix: consent buttons start as outline, turn red only on press |

**Scope:**

1. **Finesa eliminada** — logos del marquee en `index.html` (ambas instancias del loop) y entradas `'Finesa'` / `'SURA (Finesa)'` del mapa CARRIER_URLS en `aliadas/index.html`. Causa raíz de SURA en `/aliadas/`: producto MYL_171 activo en Google Sheets — cliente lo desactiva directamente.

2. **Enlace de privacidad corregido** — `contacto/index.html:369`: `href="#"` → URL Google Drive de la política.

3. **Flujo de consentimiento Myli** — Aviso como primer burbuja, input deshabilitado hasta elección, dos botones "✓ Sí" / "✗ No". Campo `privacyConsented: boolean` agregado a cada POST al webhook n8n. `resetMili()` limpia y muestra el aviso de nuevo. Bug corregido: el handler de aceptación llamaba a `sendWelcomeMessage()` generando saludo duplicado — eliminado; los handlers ahora inyectan el mensaje post-consentimiento directamente y siembran `miliHistory[]`.

4. **Texto del aviso aprobado por cliente:**
   > ¡Hola! Soy Myli, bienvenido/a a mi chat.\n\nAntes de que iniciemos nuestra conversación, quería comentarte que al utilizar este canal está aceptando nuestra Política de Privacidad, la cual puede consultar en este enlace:\n\n👉 Ver política de privacidad\n\n¿Estás de acuerdo?

5. **Estilo de botones** — Ambos arrancan con contorno gris. Al presionar, el botón elegido vira a rojo (`#C2185B`).

6. **aliados_confianza v5** — `index.html` actualizado, excepción `.gitignore` agregada.

7. **Documentación** — Spec Portal Operativo (`docs/superpowers/specs/2026-06-09-portal-operativo-inteligente-design.md`) y plan Phase 1 closure (`docs/superpowers/plans/2026-06-09-phase1-closure.md`) creados y commiteados.

---

### Session: 2026-06-01 — Myli Phase 1 website integration

| Commit | Description |
|---|---|
| `c29fc13` | fix: wire Myli chat to production n8n webhook |

**`c29fc13` — Root cause and fix:**

A pre-session audit confirmed the Myli chat widget was calling `/api/mili` (a relative path with no backing proxy or `vercel.json` route), causing every chat message to 404 in production. Myli Phase 1 had already been validated and deployed on n8n, but the website had never been updated to point at it.

Changes applied to `js/mili-chat.js`:

| Change | Before | After |
|---|---|---|
| Webhook URL | `/api/mili` (404 in production) | `https://n8n.segurosmyl.com/webhook/myli-chat` |
| Payload key 1 | `system_context` (long string) | `sessionId` (unique per session) |
| Payload key 2 | `messages` (full history array) | `message` (latest user message only) |
| Payload key 3 | *(none)* | `pageContext` (entry point, category, product context) |
| Response parsing | `data.response \|\| data.content` | `data.output \|\| data.response \|\| data.message \|\| data.content` |
| Session ID | *(none)* | Generated on `openMili()` and `resetMili()` |

**Architecture note:** n8n Window Buffer Memory owns conversation history. The frontend retains `miliHistory[]` for local UI rendering only — it is no longer sent to the webhook. `buildProductContext()` remains in the file (unused) and must not be removed without explicit authorization.

**Pushed to:** `new-origin` → `https://github.com/segurosmyl/myl-seguros-web.git`

---

### Session: 2026-05-31 — Infrastructure alignment and production validation

| Commit | Description |
|---|---|
| `fb47c6f` | fix: wire contact form and Sheets client to client-owned infrastructure |
| `7c35776` | fix: add missing `aliados_confianza_v4.png` + `.gitignore` exception |

**`fb47c6f` — Root cause and fix:**
A production contact form test revealed that submissions were routing to the old developer-account Apps Script (`AKfycbxj...`) instead of the client-owned script (`AKfycbyLe5...`). The old script wrote to the personal Google Sheet (`1YivNd2...`). Full audit identified three files with stale references. Fixed in one commit:
- `contacto/index.html:532` — `APPS_SCRIPT_URL` → new client endpoint
- `js/sheets-client.js:6` — `SHEET_ID` → new client Sheet ID
- `docs/contact-form.gs:6,22` — documentation aligned to match

Verified: Vercel deployed in ~10 s. New endpoint confirmed live in production HTML.

**`7c35776` — Root cause and fix:**
`aliados_confianza_v4.png` existed locally but was never committed. Commit `4d52601` (2026-05-28) updated `index.html` to reference v4, but the `uploads/*` `.gitignore` rule blocked staging. Added `!uploads/aliados_confianza_v4.png` exception (mirrors v3 pattern). Verified: 200 OK, `image/png`, 553 KB at production URL.

---

### Session: 2026-05-28 — Branding refresh and polish

| Commit | Description |
|---|---|
| `e14ab9b` | Comparar subtitle bump + aliadas priority ordering |
| `aa71b9e` | Footer typography +1px across all selectors |
| `4d52601` | Replace aliados_confianza_v3 with v4 in `index.html` |
| `d0055d2` | Contact info, WhatsApp, form notification emails |
| `b22459e` | Rebrand Mili → Myli (user-facing text only) |
| `7cc0b88` | Replace Logo V2 with V3 across all routes |
| `ad7a1ab` | Fix: Aliadas and Contacto desktop nav links on home page |
| `01b736f` → `619fe83` | Logo V3 sizing iterations (Option B → final approved) |
| `60f8cd8` | Footer: compact logo-to-text spacing |
| `37b91df` | Navbar height 92px → 88px |
| `33e27f0` | Global carrier priority rule: SURA first, Seguros del Estado second |

---

## 5. Remaining Open Items

### Client Action Pending

| Acción | Detalle |
|---|---|
| Desactivar MYL_171 en Google Sheets | Producto "Financia Periodos de Gracia" con `carrier_name = 'SURA (Finesa)'`. Poner `is_active = FALSE` en la pestaña Products. |

### Myli Post-Launch Polish (Deferred)

| Item | Detalle |
|---|---|
| Re-clic en botones de consentimiento | Presionar "✓ Sí" / "✗ No" por segunda vez llama a `sendWelcomeMessage()` y reinicia el historial |
| `handleConsentAcceptedCTA()` | No elimina la tarjeta de consent gate al hacer re-clic — muestra CTA de WhatsApp duplicado |
| Bug filtro Carriers en aliadas | `aliadas/index.html:489` — `c.is_active === '1'` nunca coincide con `'TRUE'`; la pestaña Carriers siempre se bypasea |

### Social Links in Footer — Decision Required

All footer instances contain IsaGIS Technologies social links (the developer's company), not M&L Seguros social accounts. Applies to:

- `js/shared-layout.js:85–88` — affects all shared-layout pages and subpages
- `index.html:2702–2705`
- `aliadas/index.html:371–374`
- `comparar/index.html:385–388`
- `contacto/index.html:454–457`

Pending client decision: replace with M&L Seguros social handles, or keep as developer credit.

### Logo V3 Compression — Production Performance

`Logo_Leon_V3_transparente.png` is **2.55 MB** in production. No functional issue — the logo displays correctly — but it is a significant performance liability on mobile. Target: **≤300 KB**.

Replace both copies before next image-focused session:
- `Logo_Leon_V3_transparente.png` (root — active path in all HTML/CSS)
- `images/Logo_Leon_V3_transparente.png` (source copy)

### Image Compression — Banners and Cards

All AI-generated PNGs are 1–3 MB each. Convert to WebP.

- `assets/banners/*.png` — 27 files
- `assets/cards/*.png` — 52 files

### SEO

All 30 pages lack `<title>`, `<meta name="description">`, and `<meta property="og:image">`.

### sitemap.xml / robots.txt

Neither file exists. Required for Google indexing.

### Six Empty Product Pages

The following subpages have no Sheets data (render empty states). Requires data entry in the Google Sheet — not a code issue:
- `polizas-de-salud-y-medicina-prepagada`
- `vehiculos-pesados`
- `maquinaria-y-equipos-moviles`
- `movilidad-personal`
- `polizas-colectivas`
- `responsabilidad-civil-profesional`

---

## 6. Known Technical Debt

### Home page CSS entirely inline
~1,600+ lines of inline CSS in `index.html`. Any shared token change (colors, spacing) must be applied to both `shared.css` and `index.html` independently.

### Duplicated mobile drawer markup
Drawer HTML/JS copy-pasted into `comparar/index.html`, `contacto/index.html`, `aliadas/index.html`. Nav link changes must be applied to all three files AND `js/shared-layout.js`.

### `mili-chat.js` — cambios requieren autorización
El flujo de consentimiento, los handlers y la lógica de webhook están estables al cierre de Phase 1. Cambios futuros requieren autorización explícita de Cesar Eraso. Webhook URL: `https://n8n.segurosmyl.com/webhook/myli-chat`. Payload: `{sessionId, message, pageContext, privacyConsented}`.

### Carousel mobile `!important` override
The carousel JS sets `track.style.transform` on an interval. On mobile, `transform: none !important` suppresses this. Any carousel JS refactor must revisit the mobile scroll-snap implementation.

---

## 7. Next Session Starting Point — PHASE 2 READY

### Current State

Phase 1 cerrada. Myli consent flow live y aprobado por el cliente. Finesa removida del sitio. Todos los sistemas bajo propiedad del cliente. Stable commit: `1cb5b7a`.

El próximo proyecto mayor es el **Portal Operativo Inteligente M&L** — spec aprobada en `docs/superpowers/specs/2026-06-09-portal-operativo-inteligente-design.md`. Stack: Next.js 14 + Supabase + Vercel en subdominio `portal.segurosmyl.com`.

### Architecture (Deployed)

| Component | Status |
|---|---|
| Orchestration | n8n at `https://n8n.segurosmyl.com` — live |
| Webhook | `https://n8n.segurosmyl.com/webhook/myli-chat` — wired in frontend |
| LLM | Claude Sonnet via n8n (API key in n8n credentials vault only) |
| Data source | Google Sheets `1t6ixz8gSDM2Yg14NggwuNru7Mid2npAR9AaxOvkccgc` |
| Memory | n8n Window Buffer Memory — session-scoped |
| Scope | No CRM, no avatar, no voice in Phase 1 |

### Myli Payload Contract (Confirmed in Production)

**Request** (website → n8n):
```json
{
  "sessionId": "myli_<timestamp>_<random>",
  "message": "<latest user message>",
  "pageContext": {
    "entry_point": "fab | card | modal",
    "menu_category": "",
    "menu_subcategory": "",
    "product_type": "",
    "product_name": "",
    "carrier_name": ""
  },
  "privacyConsented": true
}
```

**Response** (n8n → website) — parsed in priority order:
`data.output || data.response || data.message || data.content || fallback`

### Immediate Next Steps

1. **Cliente:** Desactivar MYL_171 en Google Sheets (`is_active = FALSE`) para que SURA (Finesa) desaparezca de `/aliadas/`.
2. **Deuda técnica ligera:** Consent button re-click guard, `handleConsentAcceptedCTA()` cleanup, Carriers filter bug.
3. **Performance:** Logo V3 compression (2.55 MB → ≤300 KB), banners/cards PNG → WebP.
4. **SEO:** `<title>`, `<meta description>`, `sitemap.xml`, `robots.txt`.

### Phase 2 — Portal Operativo Inteligente M&L

Spec aprobada: `docs/superpowers/specs/2026-06-09-portal-operativo-inteligente-design.md`

- Stack: Next.js 14 + Supabase + Vercel
- Subdominio: `portal.segurosmyl.com` (a confirmar con cliente)
- Myli y futuros bots como actores de primera clase (`system_agent`)
- `policies` como entidad core de Phase 2
- Alcance: operaciones internas únicamente — sin autoservicio del cliente en Phase 2
- Decisiones abiertas en Sección 13 del spec (subdomain, OAuth client, Supabase ownership)

---

## 8. Recovery Instructions

### Run local dev server

```bash
npx serve . -p 3001
```

QA script expects `http://localhost:3001`.

### Run QA

```bash
node qa-mobile-phase-a.js
```

### Stable baseline

Current stable commit: `1cb5b7a` on branch `main`.
GitHub: `https://github.com/segurosmyl/myl-seguros-web`

### Push correctly

```bash
git push new-origin main
```

`origin` points to the retired developer repo — always use `new-origin`.

---

## 9. AI-Assisted Development Workflow

**Human (Cesar Eraso)** — product decisions, architecture approvals, scope definition, final commit authorization, visual review, real-device testing, client relationship.

**Claude Code** — implementation of approved plans: HTML/CSS/JS editing, QA automation, root-cause analysis, diff previews.

**Established workflow:**
1. Define scope and constraints (human).
2. Claude Code performs analysis — no edits yet.
3. Claude Code produces a patch plan.
4. Human reviews and approves.
5. Claude Code applies approved edits.
6. Claude Code runs QA and reports.
7. Human approves commit message; Claude Code commits and pushes.

---

## 10. Post-Migration Production Fixes

### Fix 1 — Missing production asset

| Field | Value |
|---|---|
| **Commit** | `7c35776` |
| **File** | `uploads/aliados_confianza_v4.png` |
| **Root cause** | Asset existed locally but was excluded by the `uploads/*` `.gitignore` rule and never committed. `index.html` was updated to reference v4 in commit `4d52601`, creating a broken image in production. |
| **Fix** | Added `!uploads/aliados_confianza_v4.png` exception to `.gitignore` (mirrors the existing v3 pattern) and committed the asset. |
| **Status** | ✅ Fixed and deployed — HTTP 200, `image/png`, 553 KB confirmed in production. |

---

### Fix 2 — Production navigation audit

| Field | Value |
|---|---|
| **Commit** | `2cc9c47` |
| **Root cause** | Six broken or dead routes on the home page (`index.html`). Hero button had no `href`. "Comparar" linked to a nonexistent anchor (`#comparar`). Four product cards used a two-level `/category/product` URL hierarchy that does not exist in the repo — actual structure is flat. |

**Fixes applied:**

| Element | Before | After |
|---|---|---|
| Hero button "Hablar con Asesor" | `<button>` (no href) | `<a href="/contacto/">` |
| Hero button "Comparar Seguros" | `href="#comparar"` (dead anchor) | `href="/comparar/"` |
| Autos y Movilidad card | `/autos/vehiculos-particulares` | `/autos/` |
| Vida y Familia card | `/vida/individual` | `/vida/` |
| Cumplimiento card | `/cumplimiento/entidades-estatales` | `/cumplimiento/` |
| Generales card | `/generales/polizas-de-hogar` | `/generales/` |

**Status:** ✅ All 6 routes validated HTTP 200 locally and in production (`segurosmyl.com`).

---

### Fix 3 — Repository synchronization incident

| Event | Detail |
|---|---|
| Commit `2cc9c47` initially pushed to | `origin` → `erasocesar/myl-seguros-web` (developer repo) |
| Production repository | `new-origin` → `segurosmyl/myl-seguros-web` (client repo) |
| Resolution | Commit subsequently synchronized to `new-origin` via `git push new-origin main` |
| Final state verified | `new-origin/main` HEAD confirmed `2cc9c47` after fetch |

**Root cause:** `main` was tracking `origin/main` (developer repo), not `new-origin/main`. A bare `git push origin main` sent the commit to the wrong remote. Always confirm the push target explicitly.

---

## IMPORTANT OPERATIONS NOTE

```
Production repository:  segurosmyl/myl-seguros-web

Git remotes:
  origin     = erasocesar/myl-seguros-web  (developer repository — retired)
  new-origin = segurosmyl/myl-seguros-web  (client production repository — always push here)

Correct push command:
  git push new-origin main

Always verify push target before deployment.
```
# CROSS-PROJECT INTEGRATION

## Related AI Assistant Project

The website integrates with a separate project:

MYLI AI ASSISTANT

The Myli project owns:

* n8n workflows
* AI orchestration
* Product catalog retrieval
* Lead capture workflows
* Conversational memory
* OpenAI integration
* Google Sheets integrations

The website project owns:

* Frontend implementation
* User experience
* Chat widget rendering
* Session initialization
* Website deployment
* GitHub repository
* Vercel deployment

---

## Production Integration Endpoint

### n8n Production Instance

https://n8n.segurosmyl.com

### Production Webhook

https://n8n.segurosmyl.com/webhook/myli-chat

### Expected Request

POST JSON

Required:

* sessionId
* message

Optional:

* pageContext

---

## Integration Rule

The website must never hardcode development URLs.

Only production URLs are allowed:

https://n8n.segurosmyl.com/webhook/myli-chat

Any future webhook change must be coordinated with the Myli project.

---

## Validation Requirement

After any frontend deployment:

1. Open website
2. Open Myli chat widget
3. Send product question
4. Verify AI response
5. Execute lead capture test
6. Verify row creation in CONTACT_LEADS

Deployment is not considered successful until these tests pass.

---

## Current Production Status

Website migration complete.

Client GitHub repository operational.

Client Vercel deployment operational.

Myli Phase 1 live — website wired to `https://n8n.segurosmyl.com/webhook/myli-chat`.

Myli payload contract confirmed: `{sessionId, message, pageContext}`.

Lead capture operational.

Google Sheets integration operational.

OpenAI integration operational (via n8n credentials vault).

Post-launch validation pending — run checklist in Section 5 before closing Phase 1.

---

## Future Phase 2

Future enhancements may include:

* WhatsApp integration
* CRM integration
* Appointment scheduling
* Analytics dashboards
* Persistent customer memory

These features belong primarily to the Myli repository and must be coordinated across both projects.
