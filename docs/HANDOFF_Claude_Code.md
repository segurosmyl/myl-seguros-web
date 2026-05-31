# PROMPT MAESTRO — Handoff a Claude Code
## Consultores M&L Seguros — Implementación completa del sitio web
## v1.0

---

## CONTEXTO DEL PROYECTO

Tienes dos páginas HTML completamente diseñadas y aprobadas por el cliente:
- `home_index.html` — página principal del sitio
- `vehiculos_particulares_index.html` — subpágina piloto (prototipo de las 27 subpáginas)

Tu trabajo es implementar el sitio web completo: extraer componentes compartidos, conectar el Google Sheets como fuente de datos, generar las 27 subpáginas automáticamente y activar el chat de Mili con IA real.

**Principio guía: Data-Driven Design.** Todo el contenido dinámico viene del Google Sheets. Agregar o editar una póliza en el Sheets se refleja en el sitio sin tocar el código.

**Documentos de referencia que debes leer antes de empezar:**
- `00_BRAND_SYSTEM.md` — colores, tipografía, componentes de marca
- `02_SUBPAGE_TEMPLATE.md` — lógica de generación de subpáginas y cards
- `03_GOBERNANZA.md` — taxonomía, descripciones y frases de impacto por subcategoría
- `05_MILI_SPEC.md` — personalidad, flujo y system prompt de Mili

---

## FUENTE DE DATOS

**Google Sheets (fuente de verdad):**
```
URL: https://docs.google.com/spreadsheets/d/1YivNd2BoXqwbSrrDEJNmT7ACJ1Z4RTz4YhTTqcgPhbQ
Hojas: Products · Categories · Subcategories · Carriers · UI_Config
API: Google Sheets API v4 (requiere API key o acceso público por CSV)
```

**Alternativa sin API key — CSV público:**
```javascript
const SHEET_ID = '1YivNd2BoXqwbSrrDEJNmT7ACJ1Z4RTz4YhTTqcgPhbQ';
const PRODUCTS_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Products`;
const CARRIERS_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Carriers`;
const SUBCATEGORIES_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Subcategories`;
```

**Campos clave de la hoja Products:**
```
product_id, is_active, product_name, carrier_name,
menu_category, menu_subcategory, product_type,
short_description, long_description, benefits,
is_featured, logo_filename, icon_name,
clausulado_url, clausulado_disponible,
whatsapp_template, show_in_comparator
```

**Campo clave de la hoja Carriers:**
```
carrier_name, logo_filename  ← ruta completa ej: logos/estado.png
```

---

## ARQUITECTURA DE ARCHIVOS A GENERAR

```
/
├── index.html                          ← Home (ya existe — usar home_index.html)
├── logos/                              ← Logos de carriers (ya existen)
├── assets/
│   └── banners/                        ← Imágenes hero por subcategoría
│       ├── vehiculos-particulares.png  ← Ya existe (Banner_Seguros_Particulares.png)
│       └── [otras subcategorías]       ← Gradient CSS como fallback
├── js/
│   ├── sheets-client.js                ← Fetch, parseo CSV y caché del Sheets
│   ├── subpage-renderer.js             ← Renderiza cards desde datos
│   └── mili-chat.js                    ← Chat Mili con API Anthropic
├── css/
│   └── shared.css                      ← Navbar, footer, FAB, modal — compartidos
├── [subcategory_slug]/
│   └── index.html                      ← 27 subpáginas generadas
│       ej: /vehiculos-particulares/index.html  ← Ya existe como referencia
│           /individual/index.html
│           /polizas-de-hogar/index.html
│           ... (25 más)
├── comparar/
│   └── index.html
├── aliadas/
│   └── index.html
└── contacto/
    └── index.html
```

---

## PASO 1 — EXTRAER COMPONENTES COMPARTIDOS

Del `home_index.html` y `vehiculos_particulares_index.html`, extrae estos bloques
como componentes reutilizables en `css/shared.css` y archivos JS separados:

### 1.1 Navbar (idéntico en todas las páginas)
El navbar está en ambos HTML entre `<nav id="navbar">` y `</nav>`.
La única diferencia entre páginas es qué ítem está activo.

**Lógica de estado activo:**
```javascript
// En cada página, activar el ítem correcto según la URL
function setNavActive() {
  const path = window.location.pathname;
  // Ítem principal activo
  document.querySelectorAll('.nav-menu > li > a').forEach(a => {
    a.classList.remove('active');
  });
  if (path.includes('/vehiculos-') || path.includes('/movilidad') ||
      path.includes('/credito-de-autos') || path.includes('/polizas-colectivas') ||
      path.includes('/maquinaria')) {
    document.querySelector('a[href="#autos"]').classList.add('active');
  } else if (path.includes('/individual') || path.includes('/vida-') ||
             path.includes('/ap-') || path.includes('/mascotas') ||
             path.includes('/exequial') || path.includes('/arl') ||
             path.includes('/polizas-de-salud') || path.includes('/polizas-de-asistencia')) {
    document.querySelector('a[href="#vida"]').classList.add('active');
  } else if (path.includes('/entidades-') || path.includes('/judiciales') ||
             path.includes('/cumplimiento-') || path.includes('/arrendamiento')) {
    document.querySelector('a[href="#cumplimiento"]').classList.add('active');
  } else if (path.includes('/polizas-de-hogar') || path.includes('/empresas-') ||
             path.includes('/educativa') || path.includes('/transporte-') ||
             path.includes('/responsabilidad-') || path.includes('/polizas-de-cop') ||
             path.includes('/polizas-todo-riesgo')) {
    document.querySelector('a[href="#generales"]').classList.add('active');
  } else {
    document.querySelector('a[href="#"]').classList.add('active'); // Inicio
  }

  // Subítem activo en mega-menu
  document.querySelectorAll('.mega-menu-title').forEach(el => {
    el.classList.remove('active-submenu');
  });
  const subcatName = document.querySelector('meta[name="subcategory"]')?.content;
  if (subcatName) {
    document.querySelectorAll('.mega-menu-title').forEach(el => {
      if (el.textContent.trim() === subcatName) {
        el.classList.add('active-submenu');
      }
    });
  }
}
```

**CSS del subítem activo en mega-menu:**
```css
.mega-menu-title.active-submenu {
  color: #C2185B;
  font-weight: 600;
  border-left: 3px solid #C2185B;
  padding-left: 9px;
  background: rgba(194,24,91,0.05);
  border-radius: 4px;
}
```

**Cada subpágina debe tener en el `<head>`:**
```html
<meta name="subcategory" content="Vehículos Particulares">
<meta name="category" content="AUTOS">
```

### 1.2 Footer (idéntico en todas las páginas)
Extraer de `home_index.html` entre `<footer>` y `</footer>`.
Sin modificaciones — igual en todas las páginas.

### 1.3 FAB Mili flotante (idéntico en todas las páginas)
Extraer de `vehiculos_particulares_index.html`:
```html
<button class="mili-fab-floating" onclick="openMili()">
  <div class="mili-fab-avatar-wrapper">
    <div class="mili-fab-avatar">M</div>
    <div class="mili-fab-status-dot"></div>
  </div>
  <div class="mili-fab-content">
    <p class="mili-fab-title">Hablar con Mili</p>
    <p class="mili-fab-subtitle">● Respuesta inmediata</p>
  </div>
</button>
```
Con su CSS completo de `.mili-fab-floating` del mismo archivo.

### 1.4 Chat Mili overlay (idéntico en todas las páginas)
Extraer el overlay del chat Mili de `vehiculos_particulares_index.html`
(`.mili-overlay` y su contenido). Ver `05_MILI_SPEC.md` para la implementación
con IA real (Paso 4 de este documento).

### 1.5 Bug a corregir en vehiculos_particulares_index.html
Hay un `<div class="policy-overlay" id="policyOverlay">` duplicado al final del archivo
(línea ~2728, después del `</script>`). Eliminar esa segunda instancia —
solo debe existir la que está antes del `</body>`.

---

## PASO 2 — SHEETS CLIENT (js/sheets-client.js)

```javascript
// js/sheets-client.js
const SHEET_ID = '1YivNd2BoXqwbSrrDEJNmT7ACJ1Z4RTz4YhTTqcgPhbQ';

class SheetsClient {
  constructor() {
    this.cache = {};
    this.cacheTime = 5 * 60 * 1000; // 5 minutos
  }

  async fetchSheet(sheetName) {
    const cacheKey = sheetName;
    const now = Date.now();
    if (this.cache[cacheKey] && (now - this.cache[cacheKey].time) < this.cacheTime) {
      return this.cache[cacheKey].data;
    }
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
    const response = await fetch(url);
    const csv = await response.text();
    const data = this.parseCSV(csv);
    this.cache[cacheKey] = { data, time: now };
    return data;
  }

  parseCSV(csv) {
    const lines = csv.split('\n');
    const headers = this.parseCSVLine(lines[0]);
    return lines.slice(1)
      .filter(line => line.trim())
      .map(line => {
        const values = this.parseCSVLine(line);
        const obj = {};
        headers.forEach((h, i) => {
          obj[h.trim().replace(/"/g, '')] = (values[i] || '').trim().replace(/^"|"$/g, '');
        });
        return obj;
      });
  }

  parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      if (line[i] === '"') {
        inQuotes = !inQuotes;
      } else if (line[i] === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += line[i];
      }
    }
    result.push(current);
    return result;
  }

  async getProducts(filters = {}) {
    const all = await this.fetchSheet('Products');
    return all.filter(p => {
      if (p.is_active !== 'TRUE' && p.is_active !== '1' && p.is_active !== 'true') return false;
      if (filters.menu_subcategory && p.menu_subcategory !== filters.menu_subcategory) return false;
      if (filters.menu_category && p.menu_category !== filters.menu_category) return false;
      return true;
    });
  }

  async getCarriers() {
    return await this.fetchSheet('Carriers');
  }

  async getSubcategories() {
    return await this.fetchSheet('Subcategories');
  }

  parseBenefits(benefitsStr) {
    if (!benefitsStr) return [];
    try {
      // Try JSON array format
      const cleaned = benefitsStr.replace(/^'|'$/g, '').replace(/'/g, '"');
      return JSON.parse(cleaned);
    } catch {
      // Comma separated
      return benefitsStr.split(',').map(b =>
        b.trim().replace(/^['"\[]/,'').replace(/['"\]],?$/,'').trim()
      ).filter(Boolean);
    }
  }
}

window.sheetsClient = new SheetsClient();
```

---

## PASO 3 — GENERACIÓN MASIVA DE 27 SUBPÁGINAS (js/subpage-renderer.js)

### Lógica de agrupación:
```javascript
// Filtrar productos de la subcategoría → agrupar por product_type → renderizar cards
async function renderSubpage(subcategorySlug, subcategoryName) {
  const products = await sheetsClient.getProducts({ menu_subcategory: subcategoryName });
  const carriers = await sheetsClient.getCarriers();

  // Crear mapa de logo_filename por carrier_name
  const logoMap = {};
  carriers.forEach(c => { logoMap[c.carrier_name] = c.logo_filename; });

  // Agrupar por product_type
  const groups = {};
  products.forEach(p => {
    if (!groups[p.product_type]) groups[p.product_type] = [];
    groups[p.product_type].push(p);
  });

  // Stats para el banner
  const stats = {
    polizas: products.length,
    productTypes: Object.keys(groups).length,
    carriers: new Set(products.map(p => p.carrier_name)).size
  };

  return { groups, stats, logoMap, products };
}
```

### Template HTML de cada subpágina generada:
Usar `vehiculos_particulares_index.html` como base visual exacta.
Reemplazar los datos hardcodeados por los del Sheets para cada subcategoría.

**Campos a reemplazar dinámicamente:**
```
<!-- [sheets: menu_category] -->          → p.menu_category
<!-- [sheets: menu_subcategory] -->       → p.menu_subcategory
<!-- [sheets: frase_impacto] -->          → del 03_GOBERNANZA por subcategoría
<!-- [sheets: count products...] -->      → stats.polizas, stats.carriers
<!-- [sheets: product_type card] -->      → por cada group en groups
<!-- [sheets: icon_name OR image_url] --> → p.icon_name o p.image_url
<!-- [sheets: product_type] -->          → group key
<!-- [sheets: count products of type] --> → group.length
<!-- [sheets: count carriers of type] --> → new Set(group.map(p=>p.carrier_name)).size
<!-- [sheets: carriers with logo] -->     → chips de logo del group
<!-- [sheets: long_description] -->       → p.long_description (en modal)
<!-- [sheets: benefits] -->               → sheetsClient.parseBenefits(p.benefits)
```

### Mapa de las 27 subpáginas:
```javascript
const SUBCATEGORY_MAP = [
  // VIDA
  { slug: 'individual',                    name: 'Individual',                                  category: 'VIDA' },
  { slug: 'vida-colectiva',                name: 'Vida Colectiva',                              category: 'VIDA' },
  { slug: 'ap-accidentes-personales',      name: 'AP (Accidentes Personales)',                  category: 'VIDA' },
  { slug: 'polizas-de-salud-y-medicina-prepagada', name: 'Pólizas de Salud y Medicina Prepagada', category: 'VIDA' },
  { slug: 'mascotas',                      name: 'Mascotas',                                    category: 'VIDA' },
  { slug: 'arl-riesgos-laborales',         name: 'ARL (Riesgos Laborales)',                     category: 'VIDA' },
  { slug: 'polizas-de-asistencia-en-viajes-internacionales', name: 'Pólizas de Asistencia en Viajes Internacionales', category: 'VIDA' },
  { slug: 'exequial',                      name: 'Exequial',                                    category: 'VIDA' },
  // AUTOS
  { slug: 'vehiculos-particulares',        name: 'Vehículos Particulares',                      category: 'AUTOS' }, // ← PROTOTIPO
  { slug: 'vehiculos-comerciales',         name: 'Vehículos Comerciales',                       category: 'AUTOS' },
  { slug: 'vehiculos-pesados',             name: 'Vehículos Pesados',                           category: 'AUTOS' },
  { slug: 'maquinaria-y-equipos-moviles',  name: 'Maquinaria y Equipos Móviles',                category: 'AUTOS' },
  { slug: 'movilidad-personal',            name: 'Movilidad Personal',                          category: 'AUTOS' },
  { slug: 'credito-de-autos-livianos-publicos-y-pesados', name: 'Crédito de Autos - Livianos, Públicos y Pesados', category: 'AUTOS' },
  { slug: 'polizas-colectivas',            name: 'Pólizas Colectivas',                          category: 'AUTOS' },
  // CUMPLIMIENTO
  { slug: 'entidades-estatales',           name: 'Entidades Estatales',                         category: 'CUMPLIMIENTO' },
  { slug: 'cumplimiento-particular',       name: 'Cumplimiento Particular',                     category: 'CUMPLIMIENTO' },
  { slug: 'arrendamiento',                 name: 'Arrendamiento',                               category: 'CUMPLIMIENTO' },
  { slug: 'judiciales',                    name: 'Judiciales',                                  category: 'CUMPLIMIENTO' },
  // GENERALES
  { slug: 'empresas-o-persona-natural',    name: 'Empresas y/o Persona Natural',                category: 'GENERALES' },
  { slug: 'polizas-de-hogar',              name: 'Pólizas de Hogar',                            category: 'GENERALES' },
  { slug: 'polizas-todo-riesgo-construccion', name: 'Pólizas Todo Riesgo Construcción',         category: 'GENERALES' },
  { slug: 'responsabilidad-civil-profesional', name: 'Responsabilidad Civil Profesional',       category: 'GENERALES' },
  { slug: 'transporte-de-mercancias',      name: 'Transporte de Mercancías',                    category: 'GENERALES' },
  { slug: 'educativa',                     name: 'Educativa',                                   category: 'GENERALES' },
  { slug: 'polizas-de-copropiedades',      name: 'Pólizas de Copropiedades',                    category: 'GENERALES' },
  { slug: 'polizas-todo-riesgo-montaje',   name: 'Pólizas Todo Riesgo Montaje',                 category: 'GENERALES' },
];
```

### Sección de bienvenida — generación automática con IA:
Para cada subpágina, Claude Code genera el párrafo de introducción llamando
a la API de Anthropic con las descripciones reales de los productos:

```javascript
async function generateIntroSection(subcategoryName, products) {
  // Leer titulo_bienvenida y descripcion_subcategoria del 03_GOBERNANZA.md
  // (hardcodeados en un objeto JS extraído del .md)
  const gobernanzaData = GOBERNANZA_MAP[subcategoryName];

  const descriptions = products
    .filter(p => p.long_description)
    .map(p => p.long_description)
    .slice(0, 8)
    .join('\n---\n');

  // Llamar API de Claude para generar badges contextuales
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      system: 'Eres un experto en seguros colombianos. Responde SOLO en JSON válido, sin texto adicional.',
      messages: [{
        role: 'user',
        content: `Analiza estas pólizas de la subcategoría "${subcategoryName}" y genera exactamente 5 badges cortos (máx 3 palabras cada uno) que representen los beneficios más comunes y diferenciadores.

Descripciones:
${descriptions}

Responde SOLO este JSON:
{"badges": ["badge1", "badge2", "badge3", "badge4", "badge5"]}`
      }]
    })
  });
  const data = await response.json();
  try {
    const parsed = JSON.parse(data.content[0].text);
    return {
      titulo: gobernanzaData.titulo_bienvenida,
      descripcion: gobernanzaData.descripcion_subcategoria,
      badges: parsed.badges
    };
  } catch {
    return {
      titulo: gobernanzaData.titulo_bienvenida,
      descripcion: gobernanzaData.descripcion_subcategoria,
      badges: ['Cobertura amplia', 'Asistencia 24/7', 'Sin costo de asesoría', 'Múltiples aseguradoras', 'Cotización gratis']
    };
  }
}
```

### Mapa de datos del Gobernanza (extraído del 03_GOBERNANZA.md):
```javascript
// js/gobernanza-data.js — extraer automáticamente del 03_GOBERNANZA.md
const GOBERNANZA_MAP = {
  'Vehículos Particulares': {
    titulo_bienvenida: 'Bienvenidos a la sección de Pólizas para Vehículos Particulares',
    descripcion_subcategoria: 'Encuentra el seguro ideal para tu automóvil, camioneta o campero familiar entre 10 pólizas de 9 aseguradoras líderes. Desde planes básicos con responsabilidad civil hasta coberturas Premium 360 con deducible desde 0%, vehículo de reemplazo hasta 30 días, conciliación en sitio y asistencia en carretera 24/7.',
    frase_impacto: 'Tu carro, protegido en cada kilómetro.',
    banner_h1: 'Seguros de',
    banner_h2: 'Vehículos Particulares',
    banner_image: 'assets/banners/vehiculos-particulares.png',
    banner_coberturas: [
      { icono: 'shield', texto: 'Daños propios y a terceros' },
      { icono: 'lock', texto: 'Protección contra robo' },
      { icono: 'user-check', texto: 'Responsabilidad civil' },
      { icono: 'truck', texto: 'Asistencias en carretera' }
    ]
  },
  // ... (completar para las 27 subcategorías desde el 03_GOBERNANZA.md)
  // Para subcategorías sin banner de imagen: usar gradient CSS del brand system
  // background: linear-gradient(135deg, #1A1A2E 0%, #2D1B4E 60%, #C2185B 100%)
};
```

---

## PASO 4 — MILI CON IA REAL (js/mili-chat.js)

Implementar la función `openMili(context)` que activa el chat con la API de Anthropic.
Ver `05_MILI_SPEC.md` para el system prompt completo, los flujos por contexto
(card, modal, fab) y las reglas de Mili.

```javascript
// Llamada a la API — usar el system prompt de 05_MILI_SPEC.md
async function sendMiliMessage(userMessage, context, history) {
  const systemPrompt = buildSystemPrompt(context); // ver 05_MILI_SPEC.md sección 10

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: systemPrompt,
      messages: history
    })
  });

  const data = await response.json();
  return data.content[0].text;
}
```

**Nota de seguridad:** La API key de Anthropic NO debe estar en el frontend.
Implementar un proxy backend mínimo (Node.js/Express o Cloudflare Worker)
que reciba la petición del frontend y llame a la API con la key del servidor.

---

## PASO 5 — NAVEGACIÓN ENTRE PÁGINAS

Actualizar el navbar para que los ítems del mega-menu tengan `href` funcionales:

```javascript
// Mapeo nombre de subcategoría → slug de URL
const SLUG_MAP = {
  'Vehículos Particulares':    '/vehiculos-particulares/',
  'Vehículos Comerciales':     '/vehiculos-comerciales/',
  'Individual':                '/individual/',
  'Pólizas de Hogar':         '/polizas-de-hogar/',
  // ... completar con los 27 slugs del SUBCATEGORY_MAP
};

// Aplicar hrefs al mega-menu
document.querySelectorAll('.mega-menu-title').forEach(el => {
  const slug = SLUG_MAP[el.textContent.trim()];
  if (slug) {
    el.style.cursor = 'pointer';
    el.addEventListener('click', () => window.location.href = slug);
  }
});
```

---

## PASO 6 — PÁGINAS ADICIONALES

Además de las 27 subpáginas, implementar:

**Comparar (`/comparar/`):**
- Grid de productos con `show_in_comparator = 1` del Sheets
- Filtros por categoría
- Tabla comparativa lado a lado (máx 3 productos)

**Aliadas (`/aliadas/`):**
- Grid de logos de todas las aseguradoras activas del Sheets (hoja Carriers)
- Logos en color, con descripción de cada carrier

**Contacto (`/contacto/`):**
- Formulario: nombre, email, teléfono, tipo de seguro, mensaje
- CTA de WhatsApp directo

---

## CHECKLIST DE ENTREGA

Antes de dar por terminado, verificar:

- [ ] `home_index.html` funciona sin cambios (no tocar el home)
- [ ] `vehiculos_particulares_index.html` corregido (bug overlay duplicado eliminado)
- [ ] Las 27 subpáginas generadas con datos reales del Sheets
- [ ] Navbar activo correcto en cada subpágina
- [ ] Footer idéntico en todas las páginas
- [ ] FAB Mili idéntico en todas las páginas
- [ ] Modal de póliza funciona en todas las subpáginas
- [ ] Chat Mili abre con contexto correcto desde card, modal y FAB
- [ ] Logos en `logos/` referenciados correctamente desde `logo_filename` del Sheets
- [ ] Subpáginas sin productos muestran card-cero con mensaje "próximamente"
- [ ] Sección de bienvenida con título del Gobernanza + badges generados por IA
- [ ] Página Comparar, Aliadas y Contacto implementadas
- [ ] API key de Anthropic en el servidor, no en el frontend
- [ ] Sitio funciona correctamente en mobile (responsive)

---

## ARCHIVOS QUE TIENES DISPONIBLES

```
home_index.html                      ← Home aprobado — NO modificar
vehiculos_particulares_index.html    ← Subpágina piloto aprobada
logos/                               ← 15 logos de carriers
assets/banners/
  vehiculos-particulares.png         ← Banner VP (Banner_Seguros_Particulares.png)
00_BRAND_SYSTEM.md
02_SUBPAGE_TEMPLATE.md
03_GOBERNANZA.md
Mili_Phase_1_Assistant.md
Mili Architecture Decisions.md
```
