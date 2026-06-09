/* ============================================================
   mili-chat.js — Chat Mili · UI completa + llamadas API
   Consultores M&L Seguros · v1

   NOTA DE SEGURIDAD: Las llamadas a la API de Anthropic van a través de
   /api/mili (proxy backend — Cloudflare Worker o Node.js/Express).
   NUNCA exponer la API key en el frontend.
   ============================================================ */

const MYLI_WEBHOOK = 'https://n8n.segurosmyl.com/webhook/myli-chat';
const MYLI_PRIVACY_POLICY_URL = 'https://drive.google.com/file/d/1JPyAjYV1U9S77llbk6_jZ4rtJsbaXXgb/view?usp=sharing';

/* ── Estado del chat ─────────────────────────────────────── */
let miliContext = null;
let miliSessionId = null;
let miliHistory = [];
let miliTyping = false;
let miliPrivacyConsented = false;
let miliPrivacyAnswered = false;

/* ── Punto de entrada principal ──────────────────────────── */
function openMili(ctx = {}) {
  miliContext = {
    entry_point:      ctx.entry_point || 'fab',
    menu_category:    ctx.menu_category || '',
    menu_subcategory: ctx.menu_subcategory || '',
    product_type:     ctx.product_type || '',
    available_products: ctx.available_products || [],
    product:          ctx.product || null, // producto específico (desde modal)
  };

  const win = document.getElementById('miliWindow');
  if (!win) return;
  win.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  // Limpiar si es una nueva sesión
  if (miliHistory.length === 0) {
    miliSessionId = 'myli_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9);
    clearMessages();
    const input = document.getElementById('miliInput');
    const sendBtn = document.getElementById('miliSendBtn');
    const chipsEl = document.getElementById('miliQuickChips');
    if (input) input.disabled = true;
    if (sendBtn) sendBtn.disabled = true;
    if (chipsEl) chipsEl.style.display = 'none';
    showConsentNotice();
  }

  // Focus en el input solo si está habilitado
  setTimeout(() => {
    const input = document.getElementById('miliInput');
    if (input && !input.disabled) input.focus();
  }, 300);
}

function closeMili() {
  const win = document.getElementById('miliWindow');
  if (win) win.style.display = 'none';
  document.body.style.overflow = '';
}

/* ── Mensaje de bienvenida contextualizado ───────────────── */
function sendWelcomeMessage() {
  let greeting = '';

  if (miliContext.entry_point === 'card' && miliContext.product_type) {
    greeting = `¡Hola! Veo que estás explorando <strong>${miliContext.product_type}</strong>` +
      (miliContext.menu_subcategory ? ` en ${miliContext.menu_subcategory}` : '') +
      `.\n\nCuéntame, ¿qué es lo más importante para ti al proteger lo que te importa?`;
  } else if (miliContext.entry_point === 'modal' && miliContext.product) {
    const p = miliContext.product;
    greeting = `¡Hola! Veo que te interesó <strong>${p.product_name}</strong> de <strong>${p.carrier_name}</strong>.\n\n¿Tienes alguna pregunta sobre esta póliza o te gustaría comparar con otras opciones?`;
  } else if (miliContext.menu_subcategory) {
    greeting = `¡Hola! Soy Myli, tu asesora de seguros en M&L.\n\nEstás en la sección de <strong>${miliContext.menu_subcategory}</strong>. ¿Qué tipo de protección estás buscando hoy?`;
  } else {
    greeting = `¡Hola! Soy <strong>Myli</strong>, tu asesora de seguros en Consultores M&L.\n\nEstoy aquí para ayudarte a encontrar la mejor protección sin costo de asesoría. ¿Qué te trajo por aquí hoy?`;
  }

  appendBubble('mili', greeting);
  miliHistory = [{ role: 'assistant', content: greeting.replace(/<[^>]+>/g, '') }];
}

/* ── Aviso de privacidad y consentimiento ────────────────── */
function showConsentNotice() {
  const notice = `¡Hola! Soy Myli, bienvenido/a a mi chat.\n\nAntes de que iniciemos nuestra conversación, quería comentarte que al utilizar este canal está aceptando nuestra Política de Privacidad, la cual puede consultar en este enlace:\n\n👉 <a href="${MYLI_PRIVACY_POLICY_URL}" target="_blank" rel="noopener" style="color:#C2185B;">Ver política de privacidad</a>\n\n[CONSENT_BUTTONS]`;
  appendBubble('mili', notice);
}

function renderConsentButtons() {
  return `<div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap;">
    <button onclick="handleConsentAccepted()"
      style="background:#C2185B;color:#fff;border:none;padding:10px 18px;border-radius:8px;
      font-size:13px;font-weight:600;cursor:pointer;flex:1;min-width:100px;">
      ✓ Sí
    </button>
    <button onclick="handleConsentInformationalOnly()"
      style="background:transparent;color:#666;border:1px solid #ccc;padding:10px 18px;
      border-radius:8px;font-size:13px;cursor:pointer;flex:1;min-width:100px;">
      ✗ No
    </button>
  </div>`;
}

function handleConsentAccepted() {
  miliPrivacyConsented = true;
  miliPrivacyAnswered = true;
  const input = document.getElementById('miliInput');
  const sendBtn = document.getElementById('miliSendBtn');
  const chipsEl = document.getElementById('miliQuickChips');
  const acceptanceMsg = `Adicionalmente, si luego de finalizada nuestra conversación, usted desea que lo contacte un asesor, aceptando nuestra política de privacidad, Consultores de Seguros M&L podrá contactarlo por el medio de comunicación de su preferencia.\n\nMuchas gracias por aceptar nuestra política de privacidad.\n\n¿En qué puedo asesorarlo el día de hoy?`;
  appendBubble('mili', acceptanceMsg);
  miliHistory = [{ role: 'assistant', content: acceptanceMsg }];
  if (input) { input.disabled = false; input.focus(); }
  if (sendBtn) sendBtn.disabled = false;
  if (chipsEl) chipsEl.style.display = 'flex';
  renderQuickChips();
}

function handleConsentInformationalOnly() {
  miliPrivacyConsented = false;
  miliPrivacyAnswered = true;
  const input = document.getElementById('miliInput');
  const sendBtn = document.getElementById('miliSendBtn');
  const chipsEl = document.getElementById('miliQuickChips');
  const declineMsg = `No hay problema.\n\nPuedo orientarlo y resolver sus dudas sobre nuestros productos y servicios de seguros.\n\nSin embargo, si posteriormente desea solicitar una cotización o que uno de nuestros asesores lo contacte, será necesario aceptar nuestra Política de Privacidad y Tratamiento de Datos.\n\n¿En qué puedo ayudarlo el día de hoy?`;
  appendBubble('mili', declineMsg);
  miliHistory = [{ role: 'assistant', content: declineMsg }];
  if (input) { input.disabled = false; input.focus(); }
  if (sendBtn) sendBtn.disabled = false;
  if (chipsEl) chipsEl.style.display = 'flex';
  renderQuickChips();
}

/* ── Enviar mensaje del usuario ──────────────────────────── */
async function sendMiliUserMessage(text) {
  if (!text.trim() || miliTyping) return;

  // Ocultar chips después del primer mensaje
  const chipsEl = document.getElementById('miliQuickChips');
  if (chipsEl) chipsEl.style.display = 'none';

  appendBubble('user', text);
  miliHistory.push({ role: 'user', content: text });

  // Limpiar input
  const input = document.getElementById('miliInput');
  if (input) input.value = '';

  // Mostrar typing
  const typingId = showTyping();
  miliTyping = true;

  try {
    const response = await callMiliAPI(text);
    removeTyping(typingId);
    miliTyping = false;

    // Detectar CTA de WhatsApp (requiere consentimiento)
    let finalResponse = response;
    if (shouldShowWhatsAppCTA(text, response)) {
      finalResponse += miliPrivacyConsented ? '\n\n[CTA_WHATSAPP]' : '\n\n[CONSENT_REQUIRED_CTA]';
    }

    appendBubble('mili', finalResponse);
    miliHistory.push({ role: 'assistant', content: response });
  } catch (err) {
    removeTyping(typingId);
    miliTyping = false;
    appendBubble('mili', 'Tuve un problema técnico momentáneo. Por favor escríbenos directamente por WhatsApp y te atendemos de inmediato.');
    console.error('[Mili]', err);
  }
}

/* ── Llamada al webhook de producción (n8n) ──────────────── */
async function callMiliAPI(userMessage) {
  const response = await fetch(MYLI_WEBHOOK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId: miliSessionId,
      message: userMessage,
      pageContext: buildPageContext(),
      privacyConsented: miliPrivacyConsented,
    }),
  });

  if (!response.ok) {
    throw new Error(`API ${response.status}`);
  }

  const data = await response.json();
  return data.output || data.response || data.message || data.content || 'Entendido. ¿En qué más puedo ayudarte?';
}

/* ── Contexto de página para el webhook ──────────────────── */
function buildPageContext() {
  if (!miliContext) return {};
  const ctx = {
    entry_point: miliContext.entry_point || 'fab',
    menu_category: miliContext.menu_category || '',
    menu_subcategory: miliContext.menu_subcategory || '',
    product_type: miliContext.product_type || '',
  };
  if (miliContext.product) {
    ctx.product_name = miliContext.product.product_name;
    ctx.carrier_name = miliContext.product.carrier_name;
  }
  return ctx;
}

/* ── Contexto del producto para el system prompt ─────────── */
function buildProductContext() {
  const BASE = `Eres Myli, la asesora virtual de Consultores M&L Seguros.
Eres cercana, empática, clara y confiable — igual que la marca M&L.
Hablas en español colombiano, en segunda persona ("tú").

Tu metodología es Design Thinking + Jobs To Be Done:
1. EMPATIZAR: escucha antes de recomendar. Haz preguntas poderosas, no encuestas.
2. IDENTIFICAR EL JOB: detecta si el cliente es Funcional (quiere datos),
   Socio-Emocional (quiere confianza y tranquilidad) o de Consumo (quiere rapidez y precio).
3. ADAPTAR el lenguaje y la recomendación a ese perfil.
4. IDEAR: ofrece máximo 2-3 opciones del catálogo, nunca abrumes.
5. PROTOTIPAR: usa escenarios concretos para que el cliente visualice el beneficio.
6. CERRAR (Liner): cuando el cliente está listo, conéctalo con un asesor M&L por WhatsApp.

Reglas:
- Solo hablas de los productos del catálogo de M&L (datos inyectados en el contexto).
- Nunca inventes coberturas o precios.
- Si no sabes algo, ofrece conectar con asesor humano por WhatsApp.
- Respuestas cortas y claras (máx 3 párrafos).
- Nunca hables de precios finales — posiciona al asesor humano como el "Closer".
- Terminología correcta del 03_GOBERNANZA: nunca mezcles riesgos entre categorías.`;

  if (!miliContext || (!miliContext.available_products?.length && !miliContext.product)) {
    return BASE + `\n\nContexto: Usuario en la sección ${miliContext?.menu_subcategory || 'general'} del sitio de M&L Seguros.`;
  }

  let productList = '';
  if (miliContext.product) {
    const p = miliContext.product;
    productList = `Producto consultado: ${p.product_name} (${p.carrier_name})
Descripción: ${p.long_description || p.short_description}
Beneficios: ${p.benefits}
Clausulado: ${p.clausulado_disponible == 1 ? p.clausulado_url : 'No disponible online — solicitar por WhatsApp'}
WhatsApp: ${p.whatsapp_template}`;
  } else if (miliContext.available_products?.length) {
    productList = miliContext.available_products.map(p =>
      `- ${p.carrier_name}: "${p.product_name}"
  Descripción: ${p.long_description || p.short_description}
  Beneficios: ${p.benefits}
  Clausulado: ${p.clausulado_disponible == 1 ? p.clausulado_url : 'No disponible online'}
  WhatsApp: ${p.whatsapp_template}`
    ).join('\n');
  }

  return `${BASE}

CONTEXTO ACTUAL:
Categoría: ${miliContext.menu_category} > ${miliContext.menu_subcategory}
Tipo de seguro: ${miliContext.product_type}
Punto de entrada: ${miliContext.entry_point}

PRODUCTOS DISPONIBLES:
${productList}`;
}

/* ── Detectar momento de CTA de WhatsApp ─────────────────── */
function shouldShowWhatsAppCTA(userMsg, botResponse) {
  const signals = ['quiero cotizar', 'cuánto vale', 'me interesa', 'quiero contratar', 'cómo lo compro'];
  const lower = userMsg.toLowerCase();
  return signals.some(s => lower.includes(s));
}

/* ── Render de burbujas ──────────────────────────────────── */
function appendBubble(role, text) {
  const msgs = document.getElementById('miliMessages');
  if (!msgs) return;

  const bubble = document.createElement('div');
  bubble.className = role === 'mili' ? 'bubble-mili' : 'bubble-user';

  if (text.includes('[CONSENT_BUTTONS]')) {
    text = text.replace('[CONSENT_BUTTONS]', '').trim();
    bubble.innerHTML = formatMiliText(text);
    msgs.appendChild(bubble);
    const btns = document.createElement('div');
    btns.innerHTML = renderConsentButtons();
    msgs.appendChild(btns);
  } else if (text.includes('[CONSENT_REQUIRED_CTA]')) {
    text = text.replace('[CONSENT_REQUIRED_CTA]', '').trim();
    bubble.innerHTML = formatMiliText(text);
    msgs.appendChild(bubble);
    const cta = document.createElement('div');
    cta.className = 'consent-required-cta';
    cta.innerHTML = renderConsentRequiredCTA();
    msgs.appendChild(cta);
  } else if (text.includes('[CTA_WHATSAPP]')) {
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

function formatMiliText(text) {
  // Convierte **bold**, saltos de línea, bullets básicos
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/✓/g, '<span style="color:#C2185B;font-weight:700">✓</span>')
    .replace(/🔵/g, '•')
    .replace(/\n/g, '<br>');
}

function renderWhatsAppCTA() {
  let waUrl = 'https://wa.me/573212414529';
  if (miliContext?.product?.whatsapp_template) {
    waUrl = `https://wa.me/573212414529?text=${encodeURIComponent(miliContext.product.whatsapp_template)}`;
  } else if (miliContext?.available_products?.length) {
    const tpl = miliContext.available_products[0]?.whatsapp_template;
    if (tpl) waUrl = `https://wa.me/573212414529?text=${encodeURIComponent(tpl)}`;
  }
  return `<a href="${waUrl}" target="_blank" rel="noopener"
    style="display:flex;align-items:center;gap:8px;background:#25D366;color:#fff;
    padding:12px 18px;border-radius:8px;text-decoration:none;font-size:14px;
    font-weight:600;margin-top:4px;width:fit-content;">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
    Cotizar por WhatsApp →
  </a>`;
}

/* ── CTA con gate de consentimiento ─────────────────────── */
function renderConsentRequiredCTA() {
  return `<div style="background:#fff3f7;border:1px solid #f8c0d4;border-radius:8px;padding:12px 16px;margin-top:4px;">
    <p style="font-size:13px;color:#333;margin:0 0 10px;">Para cotizar o contactar un asesor necesito tu autorización de tratamiento de datos.</p>
    <div style="display:flex;gap:8px;flex-wrap:wrap;">
      <button onclick="handleConsentAcceptedCTA()"
        style="background:#C2185B;color:#fff;border:none;padding:8px 16px;border-radius:6px;
        font-size:13px;font-weight:600;cursor:pointer;">
        ✓ Acepto y continuar
      </button>
      <button onclick="handleConsentDeclinedCTA()"
        style="background:transparent;color:#666;border:1px solid #ccc;padding:8px 16px;
        border-radius:6px;font-size:13px;cursor:pointer;">
        Solo información
      </button>
    </div>
  </div>`;
}

function handleConsentAcceptedCTA() {
  miliPrivacyConsented = true;
  miliPrivacyAnswered = true;
  const waText = '¡Gracias! Ahora te conecto con un asesor M&L para tu cotización.\n\n[CTA_WHATSAPP]';
  appendBubble('mili', waText);
}

function handleConsentDeclinedCTA() {
  appendBubble('mili', 'Sin problema. Puedo seguir orientándote sobre seguros de forma general. ¿Qué otras dudas tienes?');
}

/* ── Typing indicator ────────────────────────────────────── */
function showTyping() {
  const msgs = document.getElementById('miliMessages');
  if (!msgs) return null;
  const id = 'typing_' + Date.now();
  const el = document.createElement('div');
  el.id = id;
  el.className = 'bubble-typing';
  el.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
  msgs.appendChild(el);
  msgs.scrollTop = msgs.scrollHeight;
  return id;
}

function removeTyping(id) {
  if (id) document.getElementById(id)?.remove();
}

/* ── Quick chips ─────────────────────────────────────────── */
function renderQuickChips() {
  const chipsEl = document.getElementById('miliQuickChips');
  if (!chipsEl) return;

  const subcatName = miliContext?.menu_subcategory || 'default';
  const chips = MILI_CHIPS[subcatName] || MILI_CHIPS['default'];

  chipsEl.innerHTML = chips.map(c =>
    `<button class="chip" onclick="sendMiliUserMessage('${c.replace(/'/g, "\\'")}')">${c}</button>`
  ).join('');
}

/* ── Limpiar mensajes ────────────────────────────────────── */
function clearMessages() {
  const msgs = document.getElementById('miliMessages');
  if (msgs) msgs.innerHTML = '';
  miliHistory = [];
  miliTyping = false;
}

/* ── Nueva conversación ──────────────────────────────────── */
function resetMili() {
  miliPrivacyConsented = false;
  miliPrivacyAnswered = false;
  miliSessionId = 'myli_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9);
  clearMessages();
  const input = document.getElementById('miliInput');
  const sendBtn = document.getElementById('miliSendBtn');
  const chipsEl = document.getElementById('miliQuickChips');
  if (input) input.disabled = true;
  if (sendBtn) sendBtn.disabled = true;
  if (chipsEl) chipsEl.style.display = 'none';
  showConsentNotice();
}

/* ── Event listeners ─────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Input submit por Enter
  const input = document.getElementById('miliInput');
  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const val = input.value.trim();
        if (val) sendMiliUserMessage(val);
      }
    });
  }

  // Botón enviar
  const sendBtn = document.getElementById('miliSendBtn');
  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      const val = input?.value?.trim();
      if (val) sendMiliUserMessage(val);
    });
  }

  // Cerrar con clic en overlay
  const win = document.getElementById('miliWindow');
  if (win) {
    win.addEventListener('click', (e) => {
      if (e.target === win) closeMili();
    });
  }
});
