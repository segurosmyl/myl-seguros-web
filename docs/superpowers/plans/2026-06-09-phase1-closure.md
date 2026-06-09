# Phase 1 Closure — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close Phase 1 of the MYL Seguros Web project: remove FINESA from all ally sections, update privacy policy links site-wide, and implement a session-scoped hybrid consent mechanism in the Myli chat widget.

**Architecture:** Pure static HTML/JS site — no build step, no framework. All Myli privacy logic is implemented exclusively in `js/mili-chat.js` using the existing `appendBubble()` / placeholder pattern. The consent notice is injected as a chat bubble before the welcome message. Input is disabled until the user makes a choice. Privacy state is session-scoped (JS variables only — no localStorage in Phase 1). The `privacyConsented` boolean is added to every n8n webhook payload.

**Tech Stack:** Vanilla JavaScript, static HTML. Local dev server: `npx serve . -p 3001`. No test runner — all verification is browser-based.

---

## Prerequisites (client data task — not code)

Before or alongside these changes, the client must deactivate Finesa in the Google Sheets **Carriers** tab (`is_active = 0` or delete the row). The code changes below remove Finesa from the static fallback map and the marquee — but if Finesa remains active in Sheets, it will still appear in the `/aliadas/` dynamic grid. This is a data task, not a code task.

---

## Task 1: Remove FINESA from home page marquee

**Files:**
- Modify: `index.html:2312` and `index.html:2325`

The home page marquee renders the logos twice for a seamless infinite scroll loop. Both instances must be removed.

- [ ] **Step 1: Remove first FINESA logo instance**

In `index.html`, find and delete line 2312 exactly:
```html
      <img src="logos/finesa.png" alt="Finesa" class="marquee-logo">
```
The surrounding lines for context (do not delete these):
```
2311:       <img src="logos/qualitas.png" alt="Qualitas" class="marquee-logo">
2312: →     <img src="logos/finesa.png" alt="Finesa" class="marquee-logo">   ← DELETE
2313:       <img src="logos/sufi.png" alt="Sufi" class="marquee-logo">
```

- [ ] **Step 2: Remove second FINESA logo instance (loop duplicate)**

In `index.html`, find and delete line 2325 (after removing line 2312, re-verify the line number — it will shift to ~2324):
```html
      <img src="logos/finesa.png" alt="Finesa" class="marquee-logo">
```
The surrounding lines for context:
```
      <img src="logos/qualitas.png" alt="Qualitas" class="marquee-logo">
→     <img src="logos/finesa.png" alt="Finesa" class="marquee-logo">   ← DELETE
      <img src="logos/sufi.png" alt="Sufi" class="marquee-logo">
```

- [ ] **Step 3: Start the dev server**

```bash
npx serve . -p 3001
```

- [ ] **Step 4: Verify in browser**

Open `http://localhost:3001`. Scroll to the carrier logo marquee section. Confirm the Finesa logo no longer appears in either pass of the marquee animation.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "fix: remove Finesa from home page carrier marquee"
```

---

## Task 2: Remove FINESA from aliadas CARRIER_URLS

**Files:**
- Modify: `aliadas/index.html:459` and `aliadas/index.html:468`

The `CARRIER_URLS` object is a fallback URL map used when a carrier has no `website_url` in the Sheets data. Removing these entries means Finesa cards (if they still appear from Sheets data) will render without a clickable URL — they will not be removed from the grid unless the client also deactivates Finesa in Sheets (see Prerequisites).

- [ ] **Step 1: Remove the 'Finesa' entry**

In `aliadas/index.html`, find this block and delete the highlighted line:
```javascript
  'HDI Colombia':                   'https://www.hdi.com.co/',
  'Finesa':                         'https://www.finesa.com.co/',   // ← DELETE THIS LINE
  'Bancolombia':                    'https://www.bancolombia.com/',
```

- [ ] **Step 2: Remove the 'SURA (Finesa)' entry**

In `aliadas/index.html`, find this block and delete the highlighted line:
```javascript
  'SURA (Bancolombia / Celsia)':   'https://www.segurossura.com.co/',
  'SURA (Finesa)':                 'https://www.segurossura.com.co/',   // ← DELETE THIS LINE
  'Seguros Médicos Internacionales': 'https://segurosmedicosinternacionales.com/intermediarios',
```

- [ ] **Step 3: Verify in browser**

Open `http://localhost:3001/aliadas/`. Confirm no Finesa card appears in the carrier grid (assuming Sheets data has been updated). If Sheets still has Finesa active, a card will render without a URL link — confirm the page does not throw a JavaScript error.

- [ ] **Step 4: Commit**

```bash
git add aliadas/index.html
git commit -m "fix: remove Finesa from aliadas CARRIER_URLS fallback map"
```

---

## Task 3: Fix privacy policy dead link in contacto

**Files:**
- Modify: `contacto/index.html:369`

The contact form currently has a dead `href="#"` on the privacy policy link. Replace it with the real Google Drive document URL.

- [ ] **Step 1: Update the link**

In `contacto/index.html`, find line 369:
```html
      <p class="privacy-note">Al enviar aceptas nuestra <a href="#">política de privacidad</a>. No compartimos tu información con terceros.</p>
```

Replace with:
```html
      <p class="privacy-note">Al enviar aceptas nuestra <a href="https://drive.google.com/file/d/1JPyAjYV1U9S77llbk6_jZ4rtJsbaXXgb/view?usp=sharing" target="_blank" rel="noopener">política de privacidad</a>. No compartimos tu información con terceros.</p>
```

- [ ] **Step 2: Verify in browser**

Open `http://localhost:3001/contacto/`. Scroll to the form. Click "política de privacidad". Confirm it opens the Google Drive document in a new tab.

- [ ] **Step 3: Commit**

```bash
git add contacto/index.html
git commit -m "fix: update contacto privacy policy link from dead # to Google Drive document"
```

---

## Task 4: Add privacy constant and state variables to mili-chat.js

**Files:**
- Modify: `js/mili-chat.js:10` (after MYLI_WEBHOOK) and `js/mili-chat.js:16` (after state vars)

This task only adds new declarations. No existing behavior changes yet.

- [ ] **Step 1: Add MYLI_PRIVACY_POLICY_URL constant**

In `js/mili-chat.js`, after line 10:
```javascript
const MYLI_WEBHOOK = 'https://n8n.segurosmyl.com/webhook/myli-chat';
```

Add directly below it:
```javascript
const MYLI_PRIVACY_POLICY_URL = 'https://drive.google.com/file/d/1JPyAjYV1U9S77llbk6_jZ4rtJsbaXXgb/view?usp=sharing';
```

- [ ] **Step 2: Add privacy state variables**

After the existing state variables block (after line 16):
```javascript
let miliContext = null;
let miliSessionId = null;
let miliHistory = [];
let miliTyping = false;
```

Add directly below it:
```javascript
let miliPrivacyConsented = false;  // true when user clicked "Acepto"
let miliPrivacyAnswered = false;   // true after either consent choice is made
```

- [ ] **Step 3: Verify no syntax errors**

Open `http://localhost:3001`. Open browser DevTools → Console. Confirm no errors. Click the Myli FAB — chat should still open normally (no behavior change yet).

---

## Task 5: Add showConsentNotice() and renderConsentButtons()

**Files:**
- Modify: `js/mili-chat.js` — add two new functions after `sendWelcomeMessage()` (after line 74)

- [ ] **Step 1: Add showConsentNotice()**

In `js/mili-chat.js`, after the closing `}` of `sendWelcomeMessage()` (after line 74), insert:

```javascript
/* ── Aviso de privacidad antes de iniciar conversación ───── */
function showConsentNotice() {
  const notice =
    '¡Hola! Soy <strong>Myli</strong>, tu asesora de seguros en M&L.\n\n' +
    'Antes de comenzar, quiero contarte que si aceptas nuestra política de privacidad, ' +
    'podré ayudarte a cotizar, conectarte con un asesor y registrar tu consulta.\n\n' +
    'Si prefieres no aceptar, puedes continuar recibiendo orientación informativa ' +
    'sobre seguros sin registrar tus datos.\n\n' +
    '<a href="' + MYLI_PRIVACY_POLICY_URL + '" target="_blank" rel="noopener" ' +
    'style="color:var(--color-accent);text-decoration:underline;font-size:13px">' +
    'Ver política de privacidad ↗</a>\n\n[CONSENT_BUTTONS]';
  appendBubble('mili', notice);
}
```

- [ ] **Step 2: Add renderConsentButtons()**

Directly after `showConsentNotice()`, insert:

```javascript
function renderConsentButtons() {
  return '<div id="miliConsentBtns" style="display:flex;gap:8px;flex-wrap:wrap;margin-top:4px">'
    + '<button onclick="handleConsentAccepted()" style="'
    + 'background:var(--color-accent);color:#fff;border:none;padding:10px 18px;'
    + 'border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;'
    + 'font-family:Inter,sans-serif">✓ Acepto</button>'
    + '<button onclick="handleConsentInformationalOnly()" style="'
    + 'background:rgba(0,0,0,.06);color:var(--text-primary);'
    + 'border:1px solid var(--border-light);padding:10px 18px;border-radius:8px;'
    + 'font-size:14px;font-weight:500;cursor:pointer;font-family:Inter,sans-serif">'
    + 'Solo información</button>'
    + '</div>';
}
```

- [ ] **Step 3: Verify no syntax errors**

Reload `http://localhost:3001`. DevTools Console — no errors. Myli FAB still opens normally (no wiring yet).

---

## Task 6: Add consent choice handlers

**Files:**
- Modify: `js/mili-chat.js` — add two new functions after `renderConsentButtons()`

- [ ] **Step 1: Add handleConsentAccepted()**

Directly after `renderConsentButtons()`, insert:

```javascript
function handleConsentAccepted() {
  miliPrivacyConsented = true;
  miliPrivacyAnswered = true;
  document.getElementById('miliConsentBtns')?.remove();
  var input = document.getElementById('miliInput');
  var sendBtn = document.getElementById('miliSendBtn');
  if (input) input.disabled = false;
  if (sendBtn) sendBtn.disabled = false;
  var chipsEl = document.getElementById('miliQuickChips');
  if (chipsEl) chipsEl.style.display = 'flex';
  renderQuickChips();
  sendWelcomeMessage();
  setTimeout(function () { if (input) input.focus(); }, 100);
}
```

- [ ] **Step 2: Add handleConsentInformationalOnly()**

Directly after `handleConsentAccepted()`, insert:

```javascript
function handleConsentInformationalOnly() {
  miliPrivacyConsented = false;
  miliPrivacyAnswered = true;
  document.getElementById('miliConsentBtns')?.remove();
  var input = document.getElementById('miliInput');
  var sendBtn = document.getElementById('miliSendBtn');
  if (input) input.disabled = false;
  if (sendBtn) sendBtn.disabled = false;
  var chipsEl = document.getElementById('miliQuickChips');
  if (chipsEl) chipsEl.style.display = 'flex';
  renderQuickChips();
  sendWelcomeMessage();
  setTimeout(function () { if (input) input.focus(); }, 100);
}
```

- [ ] **Step 3: Verify no syntax errors**

Reload dev server page. DevTools Console — no errors.

---

## Task 7: Add consent-required CTA gate and its handlers

**Files:**
- Modify: `js/mili-chat.js` — add three new functions after `renderWhatsAppCTA()`

This handles the case where a user in informational-only mode triggers a high-intent signal (quiero cotizar, etc.). Instead of showing the WhatsApp CTA directly, a consent gate is shown.

- [ ] **Step 1: Add renderConsentRequiredCTA()**

In `js/mili-chat.js`, after the closing `}` of `renderWhatsAppCTA()` (after line 264), insert:

```javascript
function renderConsentRequiredCTA() {
  return '<div id="miliConsentCtaBtns" style="display:flex;gap:8px;flex-wrap:wrap;margin-top:4px">'
    + '<button onclick="handleConsentAcceptedCTA()" style="'
    + 'background:var(--color-accent);color:#fff;border:none;padding:10px 18px;'
    + 'border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;'
    + 'font-family:Inter,sans-serif">✓ Acepto y continúo</button>'
    + '<button onclick="handleConsentDeclinedCTA()" style="'
    + 'background:rgba(0,0,0,.06);color:var(--text-primary);'
    + 'border:1px solid var(--border-light);padding:10px 18px;border-radius:8px;'
    + 'font-size:14px;font-weight:500;cursor:pointer;font-family:Inter,sans-serif">'
    + 'Continuar sin cotizar</button>'
    + '</div>';
}
```

- [ ] **Step 2: Add handleConsentAcceptedCTA()**

Directly after `renderConsentRequiredCTA()`, insert:

```javascript
function handleConsentAcceptedCTA() {
  miliPrivacyConsented = true;
  miliPrivacyAnswered = true;
  document.getElementById('miliConsentCtaBtns')?.remove();
  var msgs = document.getElementById('miliMessages');
  if (msgs) {
    var ctaWrap = document.createElement('div');
    ctaWrap.innerHTML = renderWhatsAppCTA();
    msgs.appendChild(ctaWrap);
    msgs.scrollTop = msgs.scrollHeight;
  }
}
```

- [ ] **Step 3: Add handleConsentDeclinedCTA()**

Directly after `handleConsentAcceptedCTA()`, insert:

```javascript
function handleConsentDeclinedCTA() {
  document.getElementById('miliConsentCtaBtns')?.remove();
  appendBubble('mili',
    'Entendido. Puedo seguir dándote información general sobre seguros. ' +
    'Si en algún momento decides compartir tus datos, solo dímelo y ' +
    'con gusto te conectamos con un asesor.');
}
```

- [ ] **Step 4: Verify no syntax errors**

Reload dev server page. DevTools Console — no errors.

---

## Task 8: Modify appendBubble() to handle consent placeholders

**Files:**
- Modify: `js/mili-chat.js:215–238` — add two new placeholder cases

Current `appendBubble()` handles `[CTA_WHATSAPP]`. Add handling for `[CONSENT_BUTTONS]` and `[CONSENT_REQUIRED_CTA]`.

- [ ] **Step 1: Replace appendBubble() with the updated version**

Find the entire `appendBubble()` function (lines ~215–238):
```javascript
function appendBubble(role, text) {
  const msgs = document.getElementById('miliMessages');
  if (!msgs) return;

  const bubble = document.createElement('div');
  bubble.className = role === 'mili' ? 'bubble-mili' : 'bubble-user';

  // Detectar CTA placeholder
  if (text.includes('[CTA_WHATSAPP]')) {
    text = text.replace('[CTA_WHATSAPP]', '').trim();
    bubble.innerHTML = formatMiliText(text);
    msgs.appendChild(bubble);

    const ctaWrap = document.createElement('div');
    ctaWrap.innerHTML = renderWhatsAppCTA();
    msgs.appendChild(ctaWrap);
  } else {
    bubble.innerHTML = formatMiliText(text);
    msgs.appendChild(bubble);
  }

  msgs.scrollTop = msgs.scrollHeight;
}
```

Replace it entirely with:
```javascript
function appendBubble(role, text) {
  const msgs = document.getElementById('miliMessages');
  if (!msgs) return;

  const bubble = document.createElement('div');
  bubble.className = role === 'mili' ? 'bubble-mili' : 'bubble-user';

  if (text.includes('[CTA_WHATSAPP]')) {
    text = text.replace('[CTA_WHATSAPP]', '').trim();
    bubble.innerHTML = formatMiliText(text);
    msgs.appendChild(bubble);
    const ctaWrap = document.createElement('div');
    ctaWrap.innerHTML = renderWhatsAppCTA();
    msgs.appendChild(ctaWrap);
  } else if (text.includes('[CONSENT_BUTTONS]')) {
    text = text.replace('[CONSENT_BUTTONS]', '').trim();
    bubble.innerHTML = formatMiliText(text);
    msgs.appendChild(bubble);
    const btnsWrap = document.createElement('div');
    btnsWrap.innerHTML = renderConsentButtons();
    msgs.appendChild(btnsWrap);
  } else if (text.includes('[CONSENT_REQUIRED_CTA]')) {
    text = text.replace('[CONSENT_REQUIRED_CTA]', '').trim();
    bubble.innerHTML = formatMiliText(text);
    msgs.appendChild(bubble);
    const gateBubble = document.createElement('div');
    gateBubble.className = 'bubble-mili';
    gateBubble.innerHTML = formatMiliText(
      'Para cotizar o conectarte con un asesor necesito tu autorización. ' +
      '<a href="' + MYLI_PRIVACY_POLICY_URL + '" target="_blank" rel="noopener" ' +
      'style="color:var(--color-accent)">Ver política ↗</a>'
    );
    msgs.appendChild(gateBubble);
    const btnsWrap = document.createElement('div');
    btnsWrap.innerHTML = renderConsentRequiredCTA();
    msgs.appendChild(btnsWrap);
  } else {
    bubble.innerHTML = formatMiliText(text);
    msgs.appendChild(bubble);
  }

  msgs.scrollTop = msgs.scrollHeight;
}
```

- [ ] **Step 2: Verify no syntax errors**

Reload dev server page. DevTools Console — no errors.

---

## Task 9: Modify openMili() — show consent notice, disable input

**Files:**
- Modify: `js/mili-chat.js:19–47` — replace `sendWelcomeMessage()` call with consent flow

- [ ] **Step 1: Replace the new-session initialization block**

Find in `openMili()`:
```javascript
  // Limpiar si es una nueva sesión
  if (miliHistory.length === 0) {
    miliSessionId = 'myli_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9);
    clearMessages();
    renderQuickChips();
    sendWelcomeMessage();
  }
```

Replace with:
```javascript
  // Limpiar si es una nueva sesión
  if (miliHistory.length === 0) {
    miliSessionId = 'myli_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9);
    clearMessages();
    var inputEl = document.getElementById('miliInput');
    var sendBtnEl = document.getElementById('miliSendBtn');
    if (inputEl) inputEl.disabled = true;
    if (sendBtnEl) sendBtnEl.disabled = true;
    var chipsEl = document.getElementById('miliQuickChips');
    if (chipsEl) chipsEl.style.display = 'none';
    showConsentNotice();
  }
```

- [ ] **Step 2: Fix focus guard to skip disabled input**

Find in `openMili()`:
```javascript
  // Focus en el input
  setTimeout(() => {
    const input = document.getElementById('miliInput');
    if (input) input.focus();
  }, 300);
```

Replace with:
```javascript
  // Focus en el input (solo si está habilitado — después de aceptar privacidad)
  setTimeout(() => {
    const input = document.getElementById('miliInput');
    if (input && !input.disabled) input.focus();
  }, 300);
```

- [ ] **Step 3: Verify consent notice appears**

Open `http://localhost:3001`. Click the Myli FAB. Confirm:
- The consent notice text appears in the chat bubble
- The privacy policy link is clickable (opens Google Drive in new tab)
- The "✓ Acepto" and "Solo información" buttons are visible
- The text input is greyed out / disabled
- The send button is disabled

- [ ] **Step 4: Verify Accept flow**

Click "✓ Acepto". Confirm:
- The consent buttons disappear
- The welcome message appears
- The text input becomes active
- Quick chips appear
- Typing and sending a message works normally

- [ ] **Step 5: Verify informational flow**

Refresh the page. Open Myli. Click "Solo información". Confirm:
- Consent buttons disappear
- Welcome message appears
- Input is enabled and functional
- User can type and send messages normally

---

## Task 10: Modify sendMiliUserMessage() — gate WhatsApp CTA on consent

**Files:**
- Modify: `js/mili-chat.js:100–104` — add consent check before CTA injection

- [ ] **Step 1: Replace the CTA detection block**

Find in `sendMiliUserMessage()`:
```javascript
    // Detectar CTA de WhatsApp
    let finalResponse = response;
    if (shouldShowWhatsAppCTA(text, response)) {
      finalResponse += '\n\n[CTA_WHATSAPP]';
    }
```

Replace with:
```javascript
    // Detectar CTA de WhatsApp — requiere consentimiento de privacidad
    let finalResponse = response;
    if (shouldShowWhatsAppCTA(text, response)) {
      if (miliPrivacyConsented) {
        finalResponse += '\n\n[CTA_WHATSAPP]';
      } else {
        finalResponse += '\n\n[CONSENT_REQUIRED_CTA]';
      }
    }
```

- [ ] **Step 2: Verify consent gate at CTA trigger**

Refresh the page. Open Myli. Click "Solo información". Send the message: `quiero cotizar`. Confirm:
- The AI response appears normally
- A second bubble appears with the consent gate message + policy link
- The "✓ Acepto y continúo" and "Continuar sin cotizar" buttons appear
- Clicking "✓ Acepto y continúo": buttons disappear, WhatsApp CTA button appears
- Clicking "Continuar sin cotizar": buttons disappear, a friendly informational message appears

- [ ] **Step 3: Verify full accepted flow**

Refresh the page. Open Myli. Click "✓ Acepto". Send `quiero cotizar`. Confirm:
- WhatsApp CTA appears directly (no consent gate — user already accepted)

---

## Task 11: Modify callMiliAPI() — add privacyConsented to n8n payload

**Files:**
- Modify: `js/mili-chat.js:118–126` — add `privacyConsented` field to POST body

- [ ] **Step 1: Update the fetch body**

Find in `callMiliAPI()`:
```javascript
    body: JSON.stringify({
      sessionId: miliSessionId,
      message: userMessage,
      pageContext: buildPageContext(),
    }),
```

Replace with:
```javascript
    body: JSON.stringify({
      sessionId: miliSessionId,
      message: userMessage,
      pageContext: buildPageContext(),
      privacyConsented: miliPrivacyConsented,
    }),
```

- [ ] **Step 2: Verify payload in browser**

Open `http://localhost:3001`. Open DevTools → Network tab. Open Myli, accept consent, send a message. Find the POST request to `n8n.segurosmyl.com/webhook/myli-chat`. Click it → Payload. Confirm the request body includes `"privacyConsented": true`.

Repeat with "Solo información" consent. Send a message. Confirm `"privacyConsented": false` appears in the payload.

---

## Task 12: Modify resetMili() — reset consent state and show consent notice

**Files:**
- Modify: `js/mili-chat.js:305–313` — replace `sendWelcomeMessage()` with consent reset flow

- [ ] **Step 1: Replace resetMili()**

Find the entire `resetMili()` function:
```javascript
function resetMili() {
  miliSessionId = 'myli_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9);
  clearMessages();
  const chipsEl = document.getElementById('miliQuickChips');
  if (chipsEl) chipsEl.style.display = 'flex';
  renderQuickChips();
  sendWelcomeMessage();
}
```

Replace it entirely with:
```javascript
function resetMili() {
  miliSessionId = 'myli_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9);
  miliPrivacyConsented = false;
  miliPrivacyAnswered = false;
  clearMessages();
  var input = document.getElementById('miliInput');
  var sendBtn = document.getElementById('miliSendBtn');
  if (input) input.disabled = true;
  if (sendBtn) sendBtn.disabled = true;
  var chipsEl = document.getElementById('miliQuickChips');
  if (chipsEl) chipsEl.style.display = 'none';
  showConsentNotice();
}
```

- [ ] **Step 2: Verify "Nueva conversación" flow**

Open Myli, accept consent, send a message. Click "↺ Nueva conversación". Confirm:
- The chat clears
- The consent notice reappears
- Input is disabled again
- User must make a new consent choice

---

## Task 13: End-to-end verification

Run the local server (`npx serve . -p 3001`) and verify all flows.

- [ ] **Flow 1: Full consent → quote**

1. Open `http://localhost:3001`
2. Click Myli FAB
3. Consent notice appears, input disabled ✓
4. Click "✓ Acepto"
5. Welcome message appears, input enabled ✓
6. Type `quiero cotizar un seguro de vida` → send
7. AI response arrives ✓
8. WhatsApp CTA button appears ✓
9. Click CTA → WhatsApp opens in new tab ✓

- [ ] **Flow 2: Informational only → consent gate at quote trigger**

1. Refresh page, open Myli
2. Click "Solo información"
3. Welcome message appears ✓
4. Type `cuánto vale el seguro de autos` → send
5. AI response arrives ✓
6. Consent gate message + policy link + buttons appear ✓
7. Click "Continuar sin cotizar" → informational message appears, no CTA ✓

- [ ] **Flow 3: Informational only → upgrade consent at CTA gate**

1. Refresh page, open Myli
2. Click "Solo información"
3. Type `me interesa cotizar` → send
4. Consent gate appears ✓
5. Click "✓ Acepto y continúo" → WhatsApp CTA renders ✓
6. Send another message with quote signal → CTA now appears directly (no gate) ✓

- [ ] **Flow 4: Privacy policy link is clickable**

1. Open Myli → click policy link in consent notice → Google Drive opens ✓
2. Go to `http://localhost:3001/contacto/` → click "política de privacidad" → Google Drive opens ✓

- [ ] **Flow 5: Marquee and aliadas**

1. `http://localhost:3001` → scroll to carrier marquee → no Finesa logo ✓
2. `http://localhost:3001/aliadas/` → no Finesa card in grid (if Sheets updated) ✓

- [ ] **Flow 6: n8n payload verification**

DevTools → Network → POST to `n8n.segurosmyl.com`:
- After "Acepto": payload contains `"privacyConsented": true` ✓
- After "Solo información": payload contains `"privacyConsented": false` ✓

- [ ] **Final commit**

```bash
git add js/mili-chat.js
git commit -m "feat: implement Myli hybrid consent — privacy notice before chat, CTA gate for non-consented users, privacyConsented flag in n8n payload"
```

---

## Task 14: Commit spec and plan documents

- [ ] **Step 1: Stage and commit documentation**

```bash
git add docs/superpowers/specs/2026-06-09-portal-operativo-inteligente-design.md
git add docs/superpowers/plans/2026-06-09-phase1-closure.md
git commit -m "docs: add Portal Operativo spec and Phase 1 closure implementation plan"
```

- [ ] **Step 2: Push to production remote**

```bash
git push new-origin main
```

Verify deployment at `https://www.segurosmyl.com` within ~60 seconds (Vercel auto-deploy).

- [ ] **Step 3: Post-deploy validation**

1. `https://www.segurosmyl.com` → Myli FAB → consent notice appears ✓
2. `https://www.segurosmyl.com/contacto/` → privacy policy link opens Google Drive ✓
3. `https://www.segurosmyl.com/aliadas/` → no Finesa card ✓

---

## Note: Future [DATA_COLLECTION_START] Marker (Phase 2 / Myli Project)

**Do not implement in Phase 1.**

The current implementation detects quote intent from the user's message text (via `shouldShowWhatsAppCTA()` signal matching). This works for explicit phrases like "quiero cotizar" but cannot detect the moment when the n8n AI is about to *request* personal data fields (e.g., license plate, city of circulation for auto quotes).

**Recommended future architecture for the Myli project:**

When the n8n workflow is about to transition from informational to data-collection mode, it should include a structured marker in its response:

```
[DATA_COLLECTION_START:auto_quote]
```

The frontend intercepts this marker in `callMiliAPI()` response handling and injects the explicit consent gate before the response is rendered, regardless of what the user said. This replaces the imperfect signal-matching approach and handles all product lines uniformly.

Implementation location (when ready):
- n8n: append `[DATA_COLLECTION_START:scope]` to the response text when entering data-collection phase
- `js/mili-chat.js`: add detection in the response handling block of `sendMiliUserMessage()`, alongside the existing `shouldShowWhatsAppCTA()` check

This should be coordinated between the Website project and the Myli (n8n) project at the start of Phase 2.
