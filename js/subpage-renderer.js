/* ============================================================
   subpage-renderer.js — Motor de renderizado de subpáginas
   Consultores M&L Seguros · v1
   ============================================================ */

/* ── Variables globales de la página ─────────────────────── */
let pageProducts = [];   // productos activos de la subcategoría
let pageCarriers = [];   // todos los carriers
let logoMap = {};        // carrier_name → logo_filename
let productMap = {};     // product_id → product (para el modal)
let currentSlug = '';
let currentGobernanza = null;

/* ── Punto de entrada ────────────────────────────────────── */
async function initSubpage(slug) {
  currentSlug = slug;
  currentGobernanza = GOBERNANZA_BY_SLUG[slug];

  if (!currentGobernanza) {
    console.error('[Renderer] Slug no encontrado en GOBERNANZA_MAP:', slug);
    return;
  }

  const subcatEntry = SUBCATEGORY_BY_SLUG[slug];
  if (!subcatEntry) return;

  const subcatName = subcatEntry.name;

  // Render inmediato del hero (sin esperar datos)
  renderHero(currentGobernanza);
  renderWelcome(currentGobernanza);
  renderCardsLoading();
  renderCardsSectionHeader();
  renderCTADark(currentGobernanza);

  // Aplicar estado activo del navbar
  setNavActive(subcatName);

  // Vincular hrefs del mega-menu
  wireNavHrefs();

  // Fetch de datos
  try {
    const [products, carriers] = await Promise.all([
      window.sheetsClient.getProducts({ menu_subcategory: subcatName }),
      window.sheetsClient.getCarriers(),
    ]);

    pageProducts = products;
    pageCarriers = carriers;

    // Construir mapa de logos
    carriers.forEach(c => { logoMap[c.carrier_name] = c.logo_filename; });

    // Construir mapa de productos por ID
    products.forEach(p => { productMap[p.product_id] = p; });

    // Actualizar hero stats
    updateHeroStats(products);

    // Actualizar badges de bienvenida con datos reales
    updateWelcomeBadges(products, currentGobernanza);

    // Renderizar cards
    renderCards(products, currentGobernanza);

    // Renderizar strip de carriers
    renderCarriersStrip(products);

  } catch (err) {
    console.error('[Renderer] Error cargando datos:', err);
    renderCardsError();
  }

  // Scroll reveal
  initScrollReveal();
}

/* ── Hero banner ─────────────────────────────────────────── */
function renderHero(g) {
  const heroBg = document.getElementById('heroBannerBg');
  if (heroBg && g.banner_image) {
    heroBg.style.backgroundImage = `url('${g.banner_image}')`;
    heroBg.style.backgroundSize = 'cover';
    heroBg.style.backgroundPosition = 'center';
  }

  const heroContent = document.getElementById('heroContent');
  if (!heroContent) return;

  const subcatEntry = SUBCATEGORY_BY_SLUG[currentSlug];
  const category = g.category || subcatEntry?.category || '';

  const coberturas = (g.banner_coberturas || []).map(c =>
    `<div class="hero-cobertura-item">
      <i data-lucide="${c.icono}" width="20" height="20"></i>
      <span>${c.texto}</span>
    </div>`
  ).join('');

  heroContent.innerHTML = `
    <div class="hero-breadcrumb">
      <a href="/">Inicio</a>
      <span>›</span>
      <span>${category}</span>
      <span>›</span>
      <span>${g.banner_h2 || subcatEntry?.name || ''}</span>
    </div>

    <div class="hero-category-badge">
      <i data-lucide="${categoryIcon(category)}" width="14" height="14"></i>
      ${category}
    </div>

    <h1 class="hero-h1">${g.banner_h1 || 'Seguros de'}</h1>
    <h2 class="hero-h2">${g.banner_h2 || subcatEntry?.name || ''}</h2>
    <div class="hero-divider"></div>
    <p class="hero-subtexto">${g.frase_impacto || ''}</p>

    <div class="hero-coberturas">${coberturas}</div>

    <div class="hero-stats" id="heroStats">
      <div class="hero-stat">
        <span class="hero-stat-number" id="statPolizas">—</span>
        <span class="hero-stat-label">Productos</span>
      </div>
      <div class="hero-stat">
        <span class="hero-stat-number" id="statTipos">—</span>
        <span class="hero-stat-label">Categorías</span>
      </div>
      <div class="hero-stat">
        <span class="hero-stat-number" id="statCarriers">—</span>
        <span class="hero-stat-label">Aseguradoras</span>
      </div>
    </div>
  `;

  // Crear íconos Lucide
  if (window.lucide) lucide.createIcons();
}

function updateHeroStats(products) {
  const polizas  = products.length;
  const tipos    = new Set(products.map(p => p.product_type)).size;
  const carriers = new Set(products.map(p => p.carrier_name)).size;

  const s1 = document.getElementById('statPolizas');
  const s2 = document.getElementById('statTipos');
  const s3 = document.getElementById('statCarriers');
  if (s1) s1.textContent = polizas;
  if (s2) s2.textContent = tipos;
  if (s3) s3.textContent = carriers;
}

function categoryIcon(cat) {
  const map = { VIDA: 'heart', AUTOS: 'car', CUMPLIMIENTO: 'file-check', GENERALES: 'home' };
  return map[cat] || 'shield';
}

/* ── Sección de bienvenida ───────────────────────────────── */
function renderWelcome(g) {
  const section = document.getElementById('welcomeSection');
  if (!section) return;

  const category = g.category || '';
  const defaultBadges = DEFAULT_BADGES[category] || DEFAULT_BADGES['GENERALES'];

  section.innerHTML = `
    <div class="container">
      <div class="welcome-inner">
        <h2 class="welcome-title">${g.titulo_bienvenida}</h2>
        <p class="welcome-description">${g.descripcion_subcategoria}</p>
        <div class="welcome-badges" id="welcomeBadges">
          ${defaultBadges.map(b =>
            `<span class="welcome-badge">
              <i data-lucide="check-circle" width="14" height="14"></i>
              ${b}
            </span>`
          ).join('')}
        </div>
      </div>
    </div>
  `;

  if (window.lucide) lucide.createIcons();
}

function updateWelcomeBadges(products, g) {
  // Extraer badges únicos de benefits de todos los productos
  const benefitSet = new Set();
  products.forEach(p => {
    const benefits = window.sheetsClient.parseBenefits(p.benefits);
    benefits.slice(0, 2).forEach(b => {
      if (b.length < 35) benefitSet.add(b);
    });
  });

  const badges = [...benefitSet].slice(0, 5);
  const category = g.category || '';
  const fallback = DEFAULT_BADGES[category] || DEFAULT_BADGES['GENERALES'];

  const finalBadges = badges.length >= 3 ? badges : fallback;
  const badgesEl = document.getElementById('welcomeBadges');
  if (!badgesEl) return;

  badgesEl.innerHTML = finalBadges.map(b =>
    `<span class="welcome-badge">
      <i data-lucide="check-circle" width="14" height="14"></i>
      ${b}
    </span>`
  ).join('');

  if (window.lucide) lucide.createIcons();
}

/* ── Cards section header ────────────────────────────────── */
function renderCardsSectionHeader() {
  const headline = document.querySelector('.cards-section-headline');
  if (!headline) return;

  const isCreditSubcat = /credito|leasing|cartera/i.test(currentSlug);

  headline.textContent = isCreditSubcat
    ? 'Explora el tipo de crédito que necesitas y compara las opciones disponibles.'
    : 'Explora el tipo de protección que necesitas y compara las opciones disponibles.';
}

/* ── Cards de product_type ───────────────────────────────── */
function renderCardsLoading() {
  const grid = document.getElementById('cardsGrid');
  if (!grid) return;
  grid.innerHTML = `
    <div class="skeleton-card"></div>
    <div class="skeleton-card"></div>
    <div class="skeleton-card"></div>
  `;
}

function renderCardsError() {
  const grid = document.getElementById('cardsGrid');
  if (grid) grid.innerHTML = `
    <div style="grid-column:1/-1;text-align:center;padding:40px;color:#9E9E9E;">
      <p>No se pudieron cargar los productos. Intenta recargar la página.</p>
    </div>`;
}

function renderCards(products, g) {
  const grid = document.getElementById('cardsGrid');
  if (!grid) return;

  // Agrupar por product_type
  const groups = {};
  products.forEach(p => {
    if (!groups[p.product_type]) groups[p.product_type] = [];
    groups[p.product_type].push(p);
  });

  // product_types definidos en gobernanza para esta subcategoría
  const definedTypes = g.product_types || Object.keys(groups);

  // Merge: tipos con productos + tipos sin productos
  const allTypes = [...new Set([...Object.keys(groups), ...definedTypes])];

  if (allTypes.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:#9E9E9E;">
      <p>No hay pólizas disponibles en esta categoría todavía.</p>
    </div>`;
    return;
  }

  grid.innerHTML = allTypes.map(type => {
    const items = groups[type] || [];
    return items.length > 0
      ? renderProductCard(type, items)
      : renderZeroCard(type, g);
  }).join('');

  if (window.lucide) lucide.createIcons();
}

function renderProductCard(productType, items) {
  const polizaCount  = items.length;
  const carrierCount = new Set(items.map(p => p.carrier_name)).size;

  // Descripción del card: usar copy del gobernanza si existe, si no la short_description del primer producto
  const desc = items[0]?.short_description || 'Póliza disponible en múltiples aseguradoras.';

  // Imagen del card
  const typeSlug = slugify(productType);
  const cardImageSrc = `../assets/cards/${typeSlug}.png`;

  // Agrupar por carrier para detectar multi-producto (Qualitas case)
  const byCarrier = {};
  items.forEach(p => {
    if (!byCarrier[p.carrier_name]) byCarrier[p.carrier_name] = [];
    byCarrier[p.carrier_name].push(p);
  });

  // Mili context serializado
  const miliCtxStr = JSON.stringify({
    entry_point: 'card',
    menu_category: currentGobernanza?.category || '',
    menu_subcategory: SUBCATEGORY_BY_SLUG[currentSlug]?.name || '',
    product_type: productType,
    available_products: items,
  }).replace(/'/g, '&#39;');

  return `
    <div class="product-type-card scroll-reveal">
      <div class="card-image-area">
        <img src="${cardImageSrc}" alt="${productType}"
             onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
        <div class="card-image-icon" style="display:none;width:100%;height:100%;align-items:center;justify-content:center;">
          <i data-lucide="shield" width="64" height="64"></i>
        </div>
      </div>
      <div class="card-body">
        <h3 class="card-product-type">${productType}</h3>
        <div class="card-badges">
          <span class="badge-stat">${polizaCount} póliza${polizaCount !== 1 ? 's' : ''}</span>
          <span class="badge-stat">${carrierCount} aseguradora${carrierCount !== 1 ? 's' : ''}</span>
        </div>
        <p class="card-description">${desc}</p>
        <p class="card-carriers-label">Aseguradoras disponibles</p>
        <div class="card-logos" id="logos_${slugify(productType)}">
          ${renderLogoChipsAll(items, byCarrier)}
        </div>
        <p class="card-hint">
          <i data-lucide="mouse-pointer-click" width="12" height="12"></i>
          Selecciona una aseguradora para ver los detalles
        </p>
      </div>
    </div>
  `;
}

/* Bug fixes applied:
   - Global dedup by carrier (one chip per carrier regardless of featured/non-featured split)
   - data-* attributes instead of inline JSON to avoid HTML-breaking serialization
   - normalizeLogoFilename strips the logos_ prefix that may still exist in Sheets data */
function renderLogoChipsAll(items, byCarrier) {
  // Determine which carriers have at least one featured product
  const featuredCarriers = new Set(
    items
      .filter(p => p.is_featured == 1 || p.is_featured === 'TRUE' || p.is_featured === 'true')
      .map(p => p.carrier_name)
  );

  // Global dedup: one chip per carrier, featured carriers first
  const seen = new Set();
  const sorted = [
    ...items.filter(p => featuredCarriers.has(p.carrier_name)),
    ...items.filter(p => !featuredCarriers.has(p.carrier_name)),
  ].filter(p => {
    if (seen.has(p.carrier_name)) return false;
    seen.add(p.carrier_name);
    return true;
  });

  return sorted.map(p => {
    const carrierItems = byCarrier[p.carrier_name] || [p];
    const count = carrierItems.length;
    const logo = normalizeLogoFilename(logoMap[p.carrier_name] || p.logo_filename || '');
    const logoSrc = logo ? `../logos/${logo}` : '';
    const featuredClass = featuredCarriers.has(p.carrier_name) ? 'featured' : 'non-featured';
    const escapedCarrier = p.carrier_name.replace(/"/g, '&quot;');
    const escapedType = (carrierItems[0]?.product_type || '').replace(/"/g, '&quot;');

    return `
      <div class="logo-chip ${featuredClass}"
           title="${escapedCarrier}"
           data-carrier="${escapedCarrier}"
           data-type="${escapedType}"
           onclick="handleChipClick(this)">
        ${logoSrc
          ? `<img src="${logoSrc}" alt="${escapedCarrier}"
                  onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
             <span style="display:none;font-size:9px;text-align:center;color:#9E9E9E;line-height:1.2;">${p.carrier_name.split(' ')[0]}</span>`
          : `<span style="font-size:9px;text-align:center;color:#9E9E9E;line-height:1.2;">${p.carrier_name.split(' ')[0]}</span>`
        }
        ${count > 1 ? `<span class="logo-chip-badge">${count}</span>` : ''}
      </div>`;
  }).join('');
}

/* Click handler for logo chips — reads from data-* to avoid JSON serialization in onclick */
function handleChipClick(el) {
  const carrierName = el.dataset.carrier;
  const productType = el.dataset.type;
  const carrierItems = pageProducts.filter(p =>
    p.carrier_name === carrierName &&
    (!productType || p.product_type === productType)
  );
  if (!carrierItems.length) return;

  if (carrierItems.length > 1) {
    openMultiProductModal(carrierItems);
  } else {
    renderPolicyModalContent(carrierItems[0]);
    const overlay = document.getElementById('policyOverlay');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function renderZeroCard(productType, g) {
  return `
    <div class="product-type-card empty scroll-reveal">
      <div class="card-image-area">
        <div class="card-image-icon">
          <i data-lucide="shield-off" width="64" height="64"></i>
        </div>
      </div>
      <div class="card-body">
        <h3 class="card-product-type" style="color:#9E9E9E">${productType}</h3>
        <div class="card-badges">
          <span class="badge-stat empty">0 pólizas disponibles</span>
        </div>
        <div class="empty-card-message">
          Por ahora no tenemos este producto — estamos trabajando en incorporarlo pronto.
        </div>
        <button class="btn-mili-card" style="margin-top:16px"
          onclick="openMili({entry_point:'card',menu_subcategory:'${SUBCATEGORY_BY_SLUG[currentSlug]?.name || ''}',product_type:'${productType}'})">
          <i data-lucide="message-circle" width="16" height="16"></i>
          Mili puede conseguirte una cotización
        </button>
      </div>
    </div>
  `;
}

/* ── Abrir Mili desde card (serialización segura) ─────────── */
function openMiliFromCard(ctxStr) {
  try {
    const ctx = JSON.parse(ctxStr);
    // Adjuntar productos actuales
    const subcatName = SUBCATEGORY_BY_SLUG[currentSlug]?.name || '';
    const productType = ctx.product_type;
    ctx.available_products = pageProducts.filter(p => p.product_type === productType);
    openMili(ctx);
  } catch (e) {
    openMili({ entry_point: 'card' });
  }
}

/* ── Strip de aseguradoras ───────────────────────────────── */
function renderCarriersStrip(products) {
  const strip = document.getElementById('carriersStrip');
  if (!strip) return;

  const uniqueCarriers = [];
  const seen = new Set();

  products.forEach(p => {
    if (!seen.has(p.carrier_name)) {
      seen.add(p.carrier_name);
      uniqueCarriers.push(p.carrier_name);
    }
  });

  if (!uniqueCarriers.length) {
    strip.style.display = 'none';
    return;
  }

  const logos = uniqueCarriers.map(name => {
    const product = products.find(p => p.carrier_name === name);
    const carrierItems = products.filter(p => p.carrier_name === name);
    const count = carrierItems.length;

    const logo = normalizeLogoFilename(
      logoMap[name] ||
      product?.logo_filename ||
      ''
    );

    const src = logo ? `/logos/${logo}` : '';

    return `
      <div class="carrier-logo-item"
           title="Ver productos de ${name}"
           data-carrier="${name.replace(/"/g, '&quot;')}"
           onclick="handleCarrierStripClick(this)">

        ${src
          ? `<img src="${src}" alt="${name}"
                  onerror="this.outerHTML='<span style=\\'font-size:12px;color:#9E9E9E;\\'>${name.split(' ')[0]}</span>'">`
          : `<span style="font-size:12px;color:#9E9E9E;">${name.split(' ')[0]}</span>`
        }

        ${count > 1 ? `<span class="logo-chip-badge">${count}</span>` : ''}
      </div>`;
  }).join('');

  const subcatEntry = SUBCATEGORY_BY_SLUG[currentSlug];
  const categoryName = subcatEntry?.category || '';
  const subcategoryName = subcatEntry?.name || '';

  const dynamicHeadline =
    `Explora también las pólizas disponibles por empresa para ${categoryName} > ${subcategoryName}`;

  strip.innerHTML = `
    <div class="container">
      <h3 class="carriers-strip-headline">${dynamicHeadline}</h3>
      <p class="carriers-strip-sub">
        Haz clic en una aseguradora para ver sus productos disponibles.
      </p>
      <div class="carriers-logos-grid">${logos}</div>
    </div>
  `;
}
/* ── Click handler: strip de aseguradoras → modal filtrado ─ */
function handleCarrierStripClick(el) {
  const carrierName = el.dataset.carrier;

  if (!carrierName || !pageProducts.length) return;

  const carrierItems = pageProducts.filter(
    p => p.carrier_name === carrierName
  );

  if (!carrierItems.length) return;

  if (carrierItems.length === 1) {
    renderPolicyModalContent(carrierItems[0]);

    const overlay = document.getElementById('policyOverlay');
    if (overlay) overlay.classList.add('active');

    document.body.style.overflow = 'hidden';
    return;
  }

  openMultiProductModal(carrierItems);
}

/* ── CTA dark ─────────────────────────────────────────────── */
function renderCTADark(g) {
  const cta = document.getElementById('ctaDark');
  if (!cta) return;

  const subcatEntry = SUBCATEGORY_BY_SLUG[currentSlug];
  const ctaLabel = getCtaLabel(g.category, subcatEntry?.name);

  cta.innerHTML = `
    <div class="container">
      <span class="cta-dark-badge">Sin costo · Sin compromiso</span>
      <h2 class="cta-dark-headline">¿Listo para proteger ${ctaLabel}?</h2>
      <p class="cta-dark-sub">Un asesor M&L te ayuda a comparar y elegir en minutos.</p>
      <div class="cta-dark-buttons">
        <a href="https://wa.me/573212414529" target="_blank" rel="noopener" class="btn-whatsapp">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
          Hablar con asesor por WhatsApp
        </a>
        <button class="btn-primary"
          onclick="openMili({entry_point:'hero',menu_subcategory:'${subcatEntry?.name || ''}',menu_category:'${g.category || ''}'})">
          Cotizar ahora
        </button>
      </div>
    </div>
  `;
}

function getCtaLabel(category, subcatName) {
  const labels = {
    VIDA:        'lo que más te importa',
    AUTOS:       'tu vehículo',
    CUMPLIMIENTO: 'tus contratos',
    GENERALES:   'tu patrimonio',
  };
  return labels[category] || 'lo que más te importa';
}

/* ── Modal de póliza ─────────────────────────────────────── */
function openPolicyModal(productId, carrierItemsStr) {
  let product = productMap[productId];
  let carrierItems = [];

  try {
    carrierItems = JSON.parse(carrierItemsStr);
    if (!product && carrierItems.length) product = carrierItems[0];
  } catch(e) {}

  if (!product) return;

  // Caso Qualitas (múltiples productos bajo mismo carrier)
  if (carrierItems.length > 1) {
    openMultiProductModal(carrierItems);
    return;
  }

  renderPolicyModalContent(product);
  const overlay = document.getElementById('policyOverlay');
  if (overlay) overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function renderPolicyModalContent(product) {
  const overlay = document.getElementById('policyOverlay');
  if (!overlay) return;

  const logo = normalizeLogoFilename(logoMap[product.carrier_name] || product.logo_filename || '');
  const logoSrc = logo ? `/logos/${logo}` : '';
  const benefits = window.sheetsClient.parseBenefits(product.benefits);
  const hasClausulado = product.clausulado_disponible == 1 || product.clausulado_disponible === 'TRUE';

  overlay.innerHTML = `
    <div class="policy-modal" onclick="event.stopPropagation()">
      <div class="policy-modal-header">
        <div class="policy-modal-logo">
          ${logoSrc
            ? `<img src="${logoSrc}" alt="${product.carrier_name}">`
            : `<span style="font-size:11px;color:rgba(255,255,255,0.8);text-align:center;">${product.carrier_name.split(' ')[0]}</span>`}
        </div>
        <div class="policy-modal-title-group">
          <p class="policy-modal-carrier">${product.carrier_name}</p>
          <p class="policy-modal-name">${product.product_name}</p>
          <p class="policy-modal-meta">${product.product_id || ''} · ${product.product_type || ''}</p>
        </div>
        <button class="policy-modal-close" onclick="closePolicyModal()">✕</button>
      </div>

      <div class="policy-modal-body">
        ${product.long_description || product.short_description ? `
          <p class="policy-modal-section-title">Descripción</p>
          <p class="policy-modal-description">${product.long_description || product.short_description}</p>
        ` : ''}

        ${benefits.length ? `
          <p class="policy-modal-section-title">Beneficios incluidos</p>
          <ul class="policy-benefits-list">
            ${benefits.map(b => `
              <li class="policy-benefit-item">
                <span class="benefit-check">✓</span>
                <span>${b}</span>
              </li>`).join('')}
          </ul>
        ` : ''}
      </div>

      <div class="policy-modal-footer">
        <button class="btn-mili-modal"
          onclick="closePolicyModal(); openMili({
            entry_point:'modal',
            menu_category:'${currentGobernanza?.category || ''}',
            menu_subcategory:'${SUBCATEGORY_BY_SLUG[currentSlug]?.name || ''}',
            product_type:'${product.product_type || ''}',
            product: ${JSON.stringify(product).replace(/'/g, "\\'")}
          })">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          Hablar con Mili sobre esta póliza
        </button>
        ${hasClausulado && product.clausulado_url ? `
          <a href="${product.clausulado_url}" target="_blank" rel="noopener" class="btn-clausulado">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            Ver clausulado completo ↗
          </a>
        ` : `
          <button class="btn-clausulado disabled" disabled>
            Clausulado no disponible online — solicitar por WhatsApp
          </button>
        `}
      </div>
    </div>
  `;

  // Cerrar al clic en overlay
  overlay.onclick = (e) => { if (e.target === overlay) closePolicyModal(); };
}

function openMultiProductModal(items) {
  const overlay = document.getElementById('policyOverlay');
  if (!overlay) return;

  const logo = normalizeLogoFilename(
  logoMap[items[0].carrier_name] || items[0].logo_filename || ''
);
  const logoSrc = logo ? `/logos/${logo}` : '';

  overlay.innerHTML = `
    <div class="policy-modal" onclick="event.stopPropagation()">
      <div class="policy-modal-header">
        <div class="policy-modal-logo">
          ${logoSrc ? `<img src="${logoSrc}" alt="${items[0].carrier_name}">` : ''}
        </div>
        <div class="policy-modal-title-group">
          <p class="policy-modal-carrier">${items[0].carrier_name}</p>
          <p class="policy-modal-name">${items.length} productos disponibles</p>
        </div>
        <button class="policy-modal-close" onclick="closePolicyModal()">✕</button>
      </div>
      <div class="policy-modal-body">
        <p class="policy-modal-section-title">¿Qué póliza te interesa?</p>
        ${items.map(p => `
  <div style="border:1px solid rgba(0,0,0,0.08);border-radius:8px;padding:14px 16px;margin-bottom:10px;cursor:pointer;transition:all 0.2s"
       data-product-id="${p.product_id}"
       onmouseover="this.style.borderColor='#C2185B'"
       onmouseout="this.style.borderColor='rgba(0,0,0,0.08)'"
       onclick="openSelectedProduct(this)">
    <strong style="font-size:14px;color:#1A1A2E">${p.product_name}</strong>
    <p style="font-size:13px;color:#9E9E9E;margin-top:4px">${p.short_description || ''}</p>
  </div>`).join('')}
      </div>
    </div>
  `;

  overlay.classList.add('active');
  overlay.onclick = (e) => { if (e.target === overlay) closePolicyModal(); };
  document.body.style.overflow = 'hidden';
}
function openSelectedProduct(el) {
  const productId = el.dataset.productId;
  const product = productMap[productId];

  if (!product) return;

  renderPolicyModalContent(product);

  const overlay = document.getElementById('policyOverlay');
  if (overlay) overlay.classList.add('active');

  document.body.style.overflow = 'hidden';
}
function closePolicyModal() {
  const overlay = document.getElementById('policyOverlay');
  if (overlay) overlay.classList.remove('active');
  document.body.style.overflow = '';
}

/* ── Navbar helpers ──────────────────────────────────────── */
function setNavActive(subcatName) {
  const path = window.location.pathname;

  document.querySelectorAll('.nav-menu > li > a').forEach(a => a.classList.remove('active'));

  const vida = ['individual', 'vida-colectiva', 'ap-accidentes-personales',
    'polizas-de-salud-y-medicina-prepagada', 'mascotas', 'arl-riesgos-laborales',
    'polizas-de-asistencia-en-viajes-internacionales', 'exequial'];
  const autos = ['vehiculos-particulares', 'vehiculos-comerciales', 'vehiculos-pesados',
    'maquinaria-y-equipos-moviles', 'movilidad-personal',
    'credito-de-autos-livianos-publicos-y-pesados', 'polizas-colectivas'];
  const cumplimiento = ['entidades-estatales', 'cumplimiento-particular', 'arrendamiento', 'judiciales'];
  const generales = ['empresas-o-persona-natural', 'polizas-de-hogar',
    'polizas-todo-riesgo-construccion', 'responsabilidad-civil-profesional',
    'transporte-de-mercancias', 'educativa', 'polizas-de-copropiedades',
    'polizas-todo-riesgo-montaje'];

  const slug = currentSlug;
  let activeHref = '/';
  if (vida.includes(slug))        activeHref = '#vida';
  else if (autos.includes(slug))  activeHref = '#autos';
  else if (cumplimiento.includes(slug)) activeHref = '#cumplimiento';
  else if (generales.includes(slug))    activeHref = '#generales';

  document.querySelectorAll('.nav-menu > li > a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href === activeHref || (activeHref === '/' && href === '#')) {
      a.classList.add('active');
    }
  });

  // Subítem activo en mega-menu
  document.querySelectorAll('.mega-menu-title').forEach(el => {
    el.classList.remove('active-submenu');
    if (el.textContent.trim() === subcatName) {
      el.classList.add('active-submenu');
    }
  });
}

function wireNavHrefs() {
  document.querySelectorAll('.mega-menu-title').forEach(el => {
    const name = el.textContent.trim();
    const slug = SLUG_MAP[name];
    if (slug) {
      el.style.cursor = 'pointer';
      el.addEventListener('click', () => { window.location.href = slug; });
    }
  });
}

/* ── Scroll reveal ───────────────────────────────────────── */
function initScrollReveal() {
  const obs = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.scroll-reveal').forEach(el => obs.observe(el));
}

/* ── Navbar scroll effect ────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 10);
    });
  }
});

/* ── Utilidades ──────────────────────────────────────────── */
function slugify(str) {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function normalizeLogoFilename(filename) {
  if (!filename) return '';

  return filename
    .replace(/^logos_/, '')
    .replace(/^logos\//, '');
}
