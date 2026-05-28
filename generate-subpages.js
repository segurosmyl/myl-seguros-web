/**
 * generate-subpages.js
 * Genera las 26 subpáginas restantes (vehiculos-particulares ya existe)
 * Uso: node generate-subpages.js
 */

const fs = require('fs');
const path = require('path');

const BASE = __dirname;

const SUBPAGES = [
  // VIDA
  { slug: 'individual',                                    name: 'Individual',                                     category: 'VIDA',         h1: 'Seguros de',   h2: 'Vida Individual',               desc: 'Compara seguros de vida individual entre las mejores aseguradoras. Cobertura ante fallecimiento, invalidez y enfermedades graves. Sin costo de asesoría.' },
  { slug: 'vida-colectiva',                               name: 'Vida Colectiva',                                 category: 'VIDA',         h1: 'Seguros de',   h2: 'Vida Colectiva',                desc: 'Pólizas de vida en grupo para empresas, cooperativas y gremios. Protege a todos tus empleados con una sola póliza.' },
  { slug: 'ap-accidentes-personales',                     name: 'AP (Accidentes Personales)',                     category: 'VIDA',         h1: 'Seguros de',   h2: 'Accidentes Personales',         desc: 'Cobertura económica inmediata ante accidentes. Ideal para estudiantes, deportistas y trabajadores de campo.' },
  { slug: 'polizas-de-salud-y-medicina-prepagada',        name: 'Pólizas de Salud y Medicina Prepagada',          category: 'VIDA',         h1: 'Seguros de',   h2: 'Salud y Medicina Prepagada',    desc: 'Accede a los mejores servicios médicos. Hospitalización, cirugías, enfermedades de alto costo y cobertura internacional BUPA.' },
  { slug: 'mascotas',                                     name: 'Mascotas',                                       category: 'VIDA',         h1: 'Seguros para', h2: 'Mascotas',                      desc: 'Protege la salud de tu perro o gato con coberturas veterinarias, asistencia ante decesos y responsabilidad civil.' },
  { slug: 'arl-riesgos-laborales',                        name: 'ARL (Riesgos Laborales)',                        category: 'VIDA',         h1: 'Seguros de',   h2: 'ARL y Riesgos Laborales',       desc: 'Cumple con la obligación legal de ARL y protege a tus empleados ante accidentes laborales y enfermedades ocupacionales.' },
  { slug: 'polizas-de-asistencia-en-viajes-internacionales', name: 'Pólizas de Asistencia en Viajes Internacionales', category: 'VIDA',    h1: 'Seguros de',   h2: 'Asistencia en Viajes',          desc: 'Viaja al exterior con respaldo médico completo. Hospitalización, repatriación y asistencia 24/7 en cualquier parte del mundo.' },
  { slug: 'exequial',                                     name: 'Exequial',                                       category: 'VIDA',         h1: 'Seguros',      h2: 'Exequiales',                    desc: 'Cobertura completa de servicios funerarios. Protege a tu familia de cargas económicas en el momento más difícil.' },
  // AUTOS
  { slug: 'vehiculos-comerciales',                        name: 'Vehículos Comerciales',                          category: 'AUTOS',        h1: 'Seguros para', h2: 'Vehículos Comerciales',         desc: 'Protección especializada para taxis, vans y camionetas de trabajo. Incluye lucro cesante y asesoría jurídica.' },
  { slug: 'vehiculos-pesados',                            name: 'Vehículos Pesados',                              category: 'AUTOS',        h1: 'Seguros para', h2: 'Vehículos Pesados',             desc: 'Coberturas robustas para camiones y tractocamiones. Pérdida total, hurto y responsabilidad civil extracontractual.' },
  { slug: 'maquinaria-y-equipos-moviles',                 name: 'Maquinaria y Equipos Móviles',                   category: 'AUTOS',        h1: 'Seguros para', h2: 'Maquinaria y Equipos',          desc: 'Protege tu maquinaria amarilla, retroexcavadoras y equipos de obra ante daños súbitos y volcamientos.' },
  { slug: 'movilidad-personal',                           name: 'Movilidad Personal',                             category: 'AUTOS',        h1: 'Seguros de',   h2: 'Movilidad Personal',            desc: 'Asegura tu moto, bicicleta o vehículo eléctrico contra hurto, daños y responsabilidad civil.' },
  { slug: 'credito-de-autos-livianos-publicos-y-pesados', name: 'Crédito de Autos - Livianos, Públicos y Pesados', category: 'AUTOS',      h1: 'Seguros de',   h2: 'Crédito Vehicular',             desc: 'Pólizas con beneficiario oneroso para vehículos financiados. Protege tu crédito y al banco simultáneamente.' },
  { slug: 'polizas-colectivas',                           name: 'Pólizas Colectivas',                             category: 'AUTOS',        h1: 'Pólizas',      h2: 'Colectivas de Vehículos',       desc: 'Una sola póliza para toda tu flota. Condiciones especiales por volumen para flotas convencionales, eléctricas e híbridas.' },
  // CUMPLIMIENTO
  { slug: 'entidades-estatales',                          name: 'Entidades Estatales',                            category: 'CUMPLIMIENTO', h1: 'Seguros de',   h2: 'Cumplimiento Estatal',          desc: 'Garantías de cumplimiento para contratos con el Estado bajo Ley 80. Seriedad de la oferta, anticipos y estabilidad de obra.' },
  { slug: 'cumplimiento-particular',                      name: 'Cumplimiento Particular',                        category: 'CUMPLIMIENTO', h1: 'Seguros de',   h2: 'Cumplimiento Particular',       desc: 'Garantías de cumplimiento entre privados. Ideal para contratos de construcción, servicios y obra privada.' },
  { slug: 'arrendamiento',                                name: 'Arrendamiento',                                  category: 'CUMPLIMIENTO', h1: 'Seguros de',   h2: 'Arrendamiento',                 desc: 'Garantiza el pago oportuno del canon de arrendamiento. Asistencia 24/7 para emergencias en el inmueble y asesoría jurídica.' },
  { slug: 'judiciales',                                   name: 'Judiciales',                                     category: 'CUMPLIMIENTO', h1: 'Seguros',      h2: 'Judiciales y Cauciones',        desc: 'Cauciones y contracautelas para procesos legales. Fianzas judiciales exigidas por jueces y tribunales colombianos.' },
  // GENERALES
  { slug: 'empresas-o-persona-natural',                   name: 'Empresas y/o Persona Natural',                   category: 'GENERALES',    h1: 'Seguros para', h2: 'Empresas y Personas',           desc: 'Protege tu empresa o actividad profesional ante RC, incendio, robo y ciberataques. Desde microseguros hasta coberturas ALL RISK.' },
  { slug: 'polizas-de-hogar',                             name: 'Pólizas de Hogar',                               category: 'GENERALES',    h1: 'Seguros de',   h2: 'Hogar y Patrimonio',            desc: 'Protege tu casa o apartamento con coberturas multirriesgo: incendio, terremoto, robo, daños por agua y asistencia 24/7.' },
  { slug: 'polizas-todo-riesgo-construccion',             name: 'Pólizas Todo Riesgo Construcción',               category: 'GENERALES',    h1: 'Seguros',      h2: 'Todo Riesgo Construcción',      desc: 'Cobertura integral para obras civiles en ejecución. Daños materiales, fenómenos naturales y responsabilidad civil.' },
  { slug: 'responsabilidad-civil-profesional',            name: 'Responsabilidad Civil Profesional',              category: 'GENERALES',    h1: 'Seguros de',   h2: 'RC Profesional',                desc: 'Protege tu patrimonio ante reclamaciones por errores u omisiones. Pólizas E&O para médicos, abogados, contadores y arquitectos.' },
  { slug: 'transporte-de-mercancias',                     name: 'Transporte de Mercancías',                       category: 'GENERALES',    h1: 'Seguros de',   h2: 'Transporte de Mercancías',      desc: 'Tu carga protegida de origen a destino: terrestre, aéreo, marítimo y fluvial. Rutas nacionales e internacionales.' },
  { slug: 'educativa',                                    name: 'Educativa',                                      category: 'GENERALES',    h1: 'Seguros',      h2: 'Educativos',                    desc: 'Garantiza la continuidad educativa y protege la infraestructura de tu institución. Renta educativa para colegios y familias.' },
  { slug: 'polizas-de-copropiedades',                     name: 'Pólizas de Copropiedades',                       category: 'GENERALES',    h1: 'Seguros de',   h2: 'Copropiedades',                 desc: 'Protección obligatoria para zonas comunes bajo Ley 675. Incendio, robo, RC y asistencia domiciliaria para conjuntos residenciales.' },
  { slug: 'polizas-todo-riesgo-montaje',                  name: 'Pólizas Todo Riesgo Montaje',                    category: 'GENERALES',    h1: 'Seguros',      h2: 'Todo Riesgo Montaje',           desc: 'Cobertura para instalación y puesta en marcha de maquinaria industrial fija. Desde la llegada de partes hasta los períodos de prueba.' },
];

function generatePage(subpage) {
  const { slug, name, category, h1, h2, desc } = subpage;
  const fabSubcat = name.replace(/'/g, "\\'");

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="subcategory" content="${name}">
  <meta name="category" content="${category}">
  <meta name="slug" content="${slug}">
  <title>${h2} — Consultores M&L Seguros</title>
  <meta name="description" content="${desc}">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Lora:ital,wght@1,400&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="../colors_and_type.css">
  <link rel="stylesheet" href="../css/shared.css">
  <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js" defer></script>
</head>
<body>

<nav id="navbar">
  <div class="container">
    <img src="../Logo_Leon_V2_transparente.png" alt="M&L Seguros" class="nav-logo">
    <ul class="nav-menu">
      <li><a href="/">Inicio</a></li>
      <li class="has-dropdown">
        <a href="#vida">Vida <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg></a>
        <div class="mega-menu">
          <div class="mega-menu-column"><div class="mega-menu-title">Individual</div></div>
          <div class="mega-menu-column"><div class="mega-menu-title">Vida Colectiva</div></div>
          <div class="mega-menu-column"><div class="mega-menu-title">AP (Accidentes Personales)</div></div>
          <div class="mega-menu-column"><div class="mega-menu-title">Pólizas de Salud</div></div>
          <div class="mega-menu-column"><div class="mega-menu-title">Exequial</div></div>
          <div class="mega-menu-column"><div class="mega-menu-title">Viajes Internacionales</div></div>
          <div class="mega-menu-column"><div class="mega-menu-title">ARL (Riesgos Laborales)</div></div>
          <div class="mega-menu-column"><div class="mega-menu-title">Mascotas</div></div>
        </div>
      </li>
      <li class="has-dropdown">
        <a href="#autos">Autos <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg></a>
        <div class="mega-menu">
          <div class="mega-menu-column"><div class="mega-menu-title">Vehículos Particulares</div></div>
          <div class="mega-menu-column"><div class="mega-menu-title">Vehículos Comerciales</div></div>
          <div class="mega-menu-column"><div class="mega-menu-title">Vehículos Pesados</div></div>
          <div class="mega-menu-column"><div class="mega-menu-title">Maquinaria y Equipos Móviles</div></div>
          <div class="mega-menu-column"><div class="mega-menu-title">Movilidad Personal</div></div>
          <div class="mega-menu-column"><div class="mega-menu-title">Crédito de Autos</div></div>
          <div class="mega-menu-column"><div class="mega-menu-title">Pólizas Colectivas</div></div>
        </div>
      </li>
      <li class="has-dropdown">
        <a href="#cumplimiento">Cumplimiento <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg></a>
        <div class="mega-menu">
          <div class="mega-menu-column"><div class="mega-menu-title">Entidades Estatales</div></div>
          <div class="mega-menu-column"><div class="mega-menu-title">Judiciales</div></div>
          <div class="mega-menu-column"><div class="mega-menu-title">Cumplimiento Particular</div></div>
          <div class="mega-menu-column"><div class="mega-menu-title">Arrendamiento</div></div>
        </div>
      </li>
      <li class="has-dropdown">
        <a href="#generales">Generales <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg></a>
        <div class="mega-menu">
          <div class="mega-menu-column"><div class="mega-menu-title">Pólizas de Hogar</div></div>
          <div class="mega-menu-column"><div class="mega-menu-title">Empresas y/o Persona Natural</div></div>
          <div class="mega-menu-column"><div class="mega-menu-title">Educativa</div></div>
          <div class="mega-menu-column"><div class="mega-menu-title">Transporte de Mercancías</div></div>
          <div class="mega-menu-column"><div class="mega-menu-title">RC Profesional</div></div>
          <div class="mega-menu-column"><div class="mega-menu-title">Pólizas de Copropiedades</div></div>
          <div class="mega-menu-column"><div class="mega-menu-title">Todo Riesgo Construcción</div></div>
          <div class="mega-menu-column"><div class="mega-menu-title">Todo Riesgo Montaje</div></div>
        </div>
      </li>
      <li><a href="/comparar/">Comparar</a></li>
      <li><a href="/aliadas/">Aliadas</a></li>
    </ul>
    <div class="nav-right">
      <div class="badge-ai" onclick="openMili({entry_point:'fab',menu_subcategory:'${name}',menu_category:'${category}'})">
        <span class="pulse-dot"></span>IA 24/7
      </div>
      <a href="/contacto/" class="btn-primary">Contacto</a>
    </div>
  </div>
</nav>

<section class="subpage-hero">
  <div class="subpage-hero-bg" id="heroBannerBg"></div>
  <div class="subpage-hero-overlay"></div>
  <div class="container">
    <div id="heroContent">
      <div class="hero-breadcrumb">
        <a href="/">Inicio</a><span>›</span><span>${category}</span><span>›</span><span>${h2}</span>
      </div>
      <div class="hero-category-badge">${category}</div>
      <h1 class="hero-h1">${h1}</h1>
      <h2 class="hero-h2">${h2}</h2>
      <div class="hero-divider"></div>
      <div class="hero-stats">
        <div class="hero-stat"><span class="hero-stat-number" id="statPolizas">—</span><span class="hero-stat-label">Productos</span></div>
        <div class="hero-stat"><span class="hero-stat-number" id="statTipos">—</span><span class="hero-stat-label">Categorías</span></div>
        <div class="hero-stat"><span class="hero-stat-number" id="statCarriers">—</span><span class="hero-stat-label">Aseguradoras</span></div>
      </div>
    </div>
  </div>
</section>

<section class="welcome-section" id="welcomeSection"></section>

<section class="cards-section">
  <div class="container">
    <p class="cards-section-title">${category} · ${name.toUpperCase()}</p>
    <h2 class="cards-section-headline">Elige tu aseguradora ideal</h2>
    <div class="cards-grid" id="cardsGrid">
      <div class="skeleton-card"></div>
      <div class="skeleton-card"></div>
    </div>
  </div>
</section>

<section class="carriers-strip" id="carriersStrip"></section>
<section class="cta-dark" id="ctaDark"></section>

<footer>
  <div class="footer-main">
    <div>
      <img src="../Logo_Leon_V2_transparente.png" alt="M&L Seguros" class="footer-logo">
      <p class="footer-info">Consultores de Seguros · Bogotá, Colombia<br>NIT: 901331365-1</p>
      <div class="social-icons">
        <a href="#" class="social-icon" aria-label="Facebook"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
        <a href="#" class="social-icon" aria-label="LinkedIn"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg></a>
      </div>
    </div>
    <div>
      <div class="footer-column-label">NAVEGACIÓN</div>
      <ul class="footer-links">
        <li><a href="/">Inicio</a></li>
        <li><a href="/individual/">Vida</a></li>
        <li><a href="/vehiculos-particulares/">Autos</a></li>
        <li><a href="/entidades-estatales/">Cumplimiento</a></li>
        <li><a href="/polizas-de-hogar/">Generales</a></li>
        <li><a href="/comparar/">Comparar</a></li>
        <li><a href="/aliadas/">Aliadas</a></li>
        <li><a href="/contacto/">Contacto</a></li>
      </ul>
    </div>
    <div>
      <div class="footer-column-label">CONTACTO</div>
      <div class="footer-contact-item"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#25D366" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg><span>+57 xxx xxx xxxx</span></div>
      <div class="footer-contact-item"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C2185B" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg><span>mateusyd@segurosmyl.com</span></div>
      <div class="footer-contact-item"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.55)" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg><span>Bogotá, Colombia</span></div>
    </div>
  </div>
  <div class="footer-bottom">
    <div class="footer-copyright">© 2025 Consultores de Seguros M&L — Todos los derechos reservados</div>
    <div class="footer-mili-status"><span class="pulse-dot"></span>Mili IA disponible 24/7</div>
  </div>
</footer>

<button class="mili-fab-floating" onclick="openMili({entry_point:'fab',menu_subcategory:'${name}',menu_category:'${category}'})">
  <div class="mili-fab-avatar-wrapper">
    <div class="mili-fab-avatar">M</div>
    <div class="mili-fab-status-dot"></div>
  </div>
  <div class="mili-fab-content">
    <p class="mili-fab-title">Hablar con Mili</p>
    <p class="mili-fab-subtitle">● Respuesta inmediata</p>
  </div>
</button>

<div class="policy-overlay" id="policyOverlay"></div>

<div id="miliWindow" style="display:none" class="mili-window">
  <div class="mili-chat">
    <div class="mili-header">
      <div class="mili-header-avatar">M</div>
      <div class="mili-header-info">
        <p class="mili-header-name">Mili · Asesora M&L</p>
        <p class="mili-header-status"><span class="pulse-dot" style="width:6px;height:6px"></span>En línea · Responde en segundos</p>
      </div>
      <button class="mili-close-btn" onclick="closeMili()">✕</button>
    </div>
    <div class="mili-messages" id="miliMessages"></div>
    <div class="quick-chips" id="miliQuickChips"></div>
    <div class="mili-input-area">
      <input type="text" class="mili-input" id="miliInput" placeholder="Escribe tu pregunta..." autocomplete="off">
      <button class="mili-send" id="miliSendBtn" aria-label="Enviar">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
      </button>
    </div>
  </div>
</div>

<script src="../js/sheets-client.js"></script>
<script src="../js/gobernanza-data.js"></script>
<script src="../js/mili-chat.js"></script>
<script src="../js/subpage-renderer.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', () => {
    initSubpage('${slug}');
    if (window.lucide) lucide.createIcons();
  });
</script>
</body>
</html>`;
}

let created = 0;
let errors = 0;

for (const subpage of SUBPAGES) {
  const dir = path.join(BASE, subpage.slug);
  const file = path.join(dir, 'index.html');

  try {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(file, generatePage(subpage), 'utf8');
    console.log(`✓  ${subpage.slug}/index.html`);
    created++;
  } catch (err) {
    console.error(`✗  ${subpage.slug}: ${err.message}`);
    errors++;
  }
}

console.log(`\n✅  ${created} subpáginas generadas, ${errors} errores.`);
