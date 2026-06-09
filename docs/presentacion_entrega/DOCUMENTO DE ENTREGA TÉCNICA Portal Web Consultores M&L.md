# **DOCUMENTO DE ENTREGA TÉCNICA**

## **Portal Web + Myli V1.0 — Consultores de Seguros M&L**

### **Cierre Proyecto – Fase 1**

Versión: 1.1 (Final)
Fecha de cierre: 2026-06-09

---

# **1. RESUMEN EJECUTIVO**

Se completó exitosamente la implementación, despliegue y puesta en producción de la plataforma digital de Consultores de Seguros M&L, incluyendo el portal web corporativo y el asistente conversacional Myli V1.0.

El proyecto entregó:

* Portal web corporativo con catálogo dinámico de seguros.
* CMS basado en Google Sheets sin dependencia técnica para administración de contenidos.
* Módulo de aliadas dinámico con imagen corporativa actualizada.
* Módulo de comparación de seguros.
* Módulo de contacto con formulario automatizado y notificaciones por correo.
* Integración con Google Apps Script para captura de leads del formulario web.
* Asistente conversacional Myli V1.0 con IA (GPT-4.1-mini) disponible 24/7.
* Flujo de captura de leads enriquecido con 14 campos incluyendo datos de vehículo, preferencias de contacto y transcripción de conversación.
* Implementación de consentimiento de tratamiento de datos (Habeas Data — Ley 1581 de 2012) en dos capas: frontend y agente IA.
* Notificaciones automáticas por correo con clasificación de prioridad.
* Infraestructura completamente bajo propiedad del cliente.
* Despliegue continuo mediante GitHub y Vercel.

**Estado Final: PRODUCCIÓN OPERATIVA.**

---

# **2. OBJETIVOS DEL PROYECTO**

El objetivo principal fue construir una plataforma digital moderna que permitiera:

* Publicar y mantener el catálogo completo de seguros sin intervención técnica.
* Administrar aseguradoras aliadas y contenido comercial desde Google Sheets.
* Capturar, calificar y notificar oportunidades comerciales automáticamente.
* Cumplir con la normativa colombiana de protección de datos personales.
* Integrar Inteligencia Artificial para atención al cliente 24/7.
* Mantener propiedad total de toda la infraestructura por parte del cliente.
* Establecer la base tecnológica para las fases 2 y 3 del roadmap digital.

---

# **3. ARQUITECTURA GENERAL**

## **3.1 Frontend — Portal Web**

Tecnologías:

* HTML5, CSS3, JavaScript Vanilla (sin framework, sin bundler)

Características:

* Arquitectura estática de alto rendimiento — sin servidor de aplicación.
* Diseño responsive compatible con móviles, tablets y escritorio.
* Tres codepaths de layout:
  * `index.html` (home) — CSS y nav completamente inline.
  * Páginas de categoría (vida, autos, cumplimiento, generales) — layout inyectado por `js/shared-layout.js`.
  * Páginas inline-nav (comparar, contacto, aliadas) — nav propio con `css/shared.css`.
* 27 subpáginas de producto generadas dinámicamente desde Google Sheets en tiempo de carga.
* Despliegue automático vía Vercel en cada push a la rama `main`.

## **3.2 CMS — Google Sheets**

Spreadsheet ID: `1t6ixz8gSDM2Yg14NggwuNru7Mid2npAR9AaxOvkccgc`

Pestañas activas:

| Pestaña | Función |
|---|---|
| Products | Catálogo completo de productos de seguro |
| Carriers | Aseguradoras aliadas y sus logos |
| Subcategories | Subcategorías del catálogo |
| CONTACT_LEADS | Registro de leads capturados (14 columnas) |

Permite administrar sin modificar código:

* Categorías, subcategorías, tipos de producto.
* Productos, descripciones, beneficios, información comercial.
* Aseguradoras activas y sus URLs de imagen.
* Leads y seguimiento comercial.

## **3.3 Backend Ligero**

| Componente | Tecnología | Función |
|---|---|---|
| Formulario web | Google Apps Script | Recibe submissions del formulario `/contacto/` y escribe en CONTACT_LEADS |
| Catálogo | Google Sheets `gviz/tq` API | Servido directamente al frontend sin proxy — caché de sesión 5 minutos |
| Automatizaciones IA | n8n (self-hosted en VPS) | Orquestación del agente Myli, captura de leads IA, notificaciones |

## **3.4 Myli V1.0 — Asistente Conversacional IA**

Motor: GPT-4.1-mini (OpenAI)
Memoria: Window Buffer Memory — 20 mensajes
Orquestación: n8n en `https://n8n.segurosmyl.com`
Punto de entrada web: `https://n8n.segurosmyl.com/webhook/myli-chat`

### Arquitectura de flujos n8n

```
[Widget Web (js/mili-chat.js)]
       │  POST {sessionId, message, pageContext, privacyConsented}
       ▼
[myli-chat — GYrRnpph5IfjUtSh]
  Webhook → Normalize Input → AI Agent (GPT-4.1-mini)
       │
       ├─ tool: lead_capture (toolWorkflow)
       │         ▼
       │   [myli-tool-lead-capture — KDkMUJsvATJ6mhjz]
       │     → Validate and Build Row (14 campos)
       │     → Append to CONTACT_LEADS (Google Sheets)
       │     → Classify Lead Priority
       │     → Send Lead Email (Gmail)
       │
       ├─ tool: product_knowledge (toolWorkflow — ocwO0NsXB9QVgxqg)
       ├─ tool: human_handoff (toolCode)
       ├─ tool: appointment_booking (toolCode — placeholder Fase 2)
       └─ tool: analytics_event (toolCode — placeholder Fase 2)
       │
       ▼
  Respond to Webhook → Widget Web
```

### IDs de versiones activas en producción

| Workflow | ID | Versión activa |
|---|---|---|
| myli-chat | GYrRnpph5IfjUtSh | `43f22fad-48ed-4e76-96c6-4f6a01897006` |
| myli-tool-lead-capture | KDkMUJsvATJ6mhjz | `1e8b32c6-3c18-462d-917c-250541240531` |
| myli-tool-product-knowledge | ocwO0NsXB9QVgxqg | `bf0380ea-25e3-40bd-ad29-b950b7dbe78c` |

### Contrato de payload (website → n8n)

```json
POST https://n8n.segurosmyl.com/webhook/myli-chat
{
  "sessionId": "myli_<timestamp>_<random>",
  "message": "<último mensaje del usuario>",
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

---

# **4. INFRAESTRUCTURA IMPLEMENTADA**

## **4.1 Componentes activos**

| Componente | Plataforma | URL / ID | Estado |
|---|---|---|---|
| Sitio web | Vercel | `https://www.segurosmyl.com` | Activo |
| Dominio | — | `segurosmyl.com` + redirect apex | Activo |
| Código fuente | GitHub | `https://github.com/segurosmyl/myl-seguros-web` | Activo |
| CMS catálogo | Google Sheets | `1t6ixz8gSDM2Yg14NggwuNru7Mid2npAR9AaxOvkccgc` | Activo |
| Formulario web | Google Apps Script | `AKfycbyLe5...FpOe/exec` | Activo |
| Automatizaciones IA | n8n | `https://n8n.segurosmyl.com` | Activo |
| Motor IA | OpenAI GPT-4.1-mini | `platform.openai.com` | Activo |
| VPS | Hostinger | `hpanel.hostinger.com` | Activo |
| Notificaciones | Gmail API vía GCP | proyecto `seguros-myl-n8n` | Activo |

## **4.2 Propiedad de la infraestructura**

Todos los activos fueron transferidos a cuentas bajo control directo del cliente antes del cierre de Fase 1:

* Dominio, GitHub, Vercel, Google Cloud, Google Sheets, Apps Script, OpenAI, n8n, Gmail.

## **4.3 Notificaciones automáticas — Destinatarios confirmados**

| Correo | Rol |
|---|---|
| `tecnologia@segurosmyl.com` | Tecnología |
| `vargash@segurosmyl.com` | Gerencia / seguimiento comercial |
| `mateusyd@segurosmyl.com` | Operación |
| `alertasmyl@gmail.com` | Alertas de respaldo |

---

# **5. FUNCIONALIDADES IMPLEMENTADAS**

## **5.1 Catálogo Dinámico de Seguros**

* 4 categorías principales: Vida, Autos, Cumplimiento, Generales.
* Subcategorías, tipos de producto y productos administrados en Google Sheets.
* 27 subpáginas de producto generadas en tiempo de carga desde la API de Google Sheets.
* Regla de prioridad de aseguradoras: SURA primero, Seguros del Estado segundo (`prioritizeCarriers()` en `js/subpage-renderer.js`).
* Caché de sesión de 5 minutos en `SheetsClient` para evitar peticiones redundantes.

## **5.2 Módulo de Aliadas — Página `/aliadas/`**

* Lista de aseguradoras aliadas generada dinámicamente desde la pestaña Carriers de Google Sheets.
* Imagen corporativa actualizada a `aliados_confianza_v5.png`.
* Eliminada Finesa (SURA-Finesa) del mapa de carriers y del marquee del home por instrucción del cliente.
* Regla activa: solo se muestran aseguradoras con productos activos (`is_active = TRUE` en Products).

## **5.3 Módulo de Comparación — Página `/comparar/`**

* Permite al usuario comparar productos de seguro por categoría.
* Contenido cargado dinámicamente desde Google Sheets.

## **5.4 Módulo de Contacto — Página `/contacto/`**

* Formulario de contacto con validación frontend.
* Submission vía Google Apps Script — escribe directamente en Google Sheets `CONTACT_LEADS`.
* Correo de notificación automático a `vargash@segurosmyl.com` y `mateusyd@segurosmyl.com`.
* Enlace a Política de Privacidad (`https://drive.google.com/file/d/1JPyAjYV1U9S77llbk6_jZ4rtJsbaXXgb/view`) activo y visible en el formulario.

## **5.5 Myli V1.0 — Asistente Conversacional**

### Widget Frontend (`js/mili-chat.js`)

* Widget disponible en todas las rutas del sitio (FAB fijo en esquina inferior derecha).
* Tres puntos de entrada: FAB general, card de producto, modal de producto.
* `pageContext` transmitido al webhook en cada mensaje para asesoría contextualizada.
* Historial visual local — el historial de conversación real reside en Window Buffer Memory de n8n.
* Nueva sesión con nuevo `sessionId` en cada apertura de chat limpia.

### Capacidades del agente

* Atención al cliente 24/7.
* Consulta del catálogo de productos desde Google Sheets (tool `product_knowledge`).
* Calificación y captura de prospectos con 14 campos (tool `lead_capture`).
* Escalamiento a asesor humano vía WhatsApp (tool `human_handoff`).
* Metodología Design Thinking + Jobs To Be Done en el system prompt.

## **5.6 Captura de Leads — Schema CONTACT_LEADS (14 columnas)**

El schema fue expandido de 8 a 14 columnas durante Fase 1:

| Campo | Tipo | Descripción |
|---|---|---|
| timestamp | datetime | ISO 8601 — generado al momento de escritura |
| nombre | string | Nombre completo del prospecto |
| telefono | string | Número de teléfono |
| email | string | Correo electrónico |
| categoria | string | AUTOS, VIDA, HOGAR, SALUD, PYME, OTRO |
| mensaje | string | ID de sesión + confirmación de consentimiento |
| **Conversación Completa** | string | Transcripción completa del chat |
| **Resumen de la Conversación** | string | Resumen generado por IA |
| **Horario de Contacto** | string | Preferencia horaria del prospecto |
| **Canal de Contacto** | string | Canal preferido (WhatsApp, llamada, email) |
| **Placa de Vehiculo** | string | Placa del vehículo (categoría AUTOS) |
| **Ciudad de Movilidad** | string | Ciudad de circulación (categoría AUTOS) |
| source_page | string | Página de origen (`myli-chat`, `/contacto/`, etc.) |
| status | string | Estado inicial: `NEW — Sin gestionar` |

*Los campos en negrita son nuevos en Fase 1.*

## **5.7 Notificaciones por Correo con Clasificación de Prioridad**

Cada lead capturado genera un correo automático con las siguientes características:

**Clasificación automática:**

| Tipo | Asunto | Condición |
|---|---|---|
| Prioritario | `🔥 LEAD PRIORITARIO - Nuevo Lead Myli - [CATEGORIA]` | Texto contiene: cotización, asesor, llamada, urgente, solicita contacto |
| Estándar | `🚨 Nuevo Lead Myli - [CATEGORIA]` | Todos los demás casos |

**Contenido del correo:**

* Datos del prospecto (nombre, teléfono, email, categoría).
* Preferencias de contacto (canal, horario).
* Datos del vehículo si aplica (placa, ciudad — solo AUTOS).
* Resumen de la conversación generado por IA.
* Estado: `NEW — Sin gestionar`.

## **5.8 Consentimiento de Tratamiento de Datos (Habeas Data)**

Implementado en dos capas:

**Capa 1 — Frontend (Widget Myli):**

* Aviso de privacidad mostrado como primer burbuja al abrir el chat.
* Input deshabilitado hasta que el usuario elija.
* Dos opciones: "✓ Sí" (acepta) / "✗ No" (solo información general).
* Consentimiento de sesión — no se almacena en localStorage.
* Campo `privacyConsented: boolean` incluido en cada POST al webhook n8n.
* Al hacer reset del chat, el consentimiento se limpia y el aviso vuelve a mostrarse.

**Capa 2 — Agente IA (System Prompt):**

* El agente tiene instrucción explícita bajo `## PRIVACIDAD — REGLA CRÍTICA` de obtener consentimiento verbal antes de registrar cualquier lead.
* Si el usuario declina, el agente no llama `lead_capture` y lo informa explícitamente.
* Cumplimiento referenciado: Ley 1581 de 2012 / Habeas Data Colombia.
* Consentimiento registrado en el campo `mensaje` de CONTACT_LEADS con el texto `"Consentimiento de privacidad: Sí."`.

## **5.9 Mejoras en Cotización Automática (AUTOS)**

Para la categoría AUTOS, el agente sigue un checklist de recolección obligatorio antes de llamar `lead_capture`:

1. Nombre completo.
2. Teléfono.
3. Email.
4. **Placa del vehículo.**
5. **Ciudad de movilidad.**
6. **Canal de contacto preferido.**
7. **Horario de contacto preferido.**

Los campos 4–7 son nuevos en Fase 1 y se almacenan en columnas dedicadas en CONTACT_LEADS.

---

# **6. CAMBIOS APLICADOS EN CIERRE DE FASE 1 (2026-06-09)**

Los siguientes cambios se aplicaron en la sesión de cierre el 2026-06-09 como resultado de la revisión final del cliente:

| Cambio | Archivo | Detalle |
|---|---|---|
| Eliminación de Finesa del marquee | `index.html` | Removidos logos de Finesa en ambas instancias del loop infinito |
| Eliminación de Finesa de aliadas | `aliadas/index.html` | Entradas `'Finesa'` y `'SURA (Finesa)'` removidas del mapa CARRIER_URLS |
| Corrección enlace de privacidad | `contacto/index.html:369` | `href="#"` (muerto) → URL Google Drive de la política |
| Flujo de consentimiento Myli | `js/mili-chat.js` | Implementación completa del modelo híbrido descrito en §5.8 |
| Campo privacyConsented en payload | `js/mili-chat.js` | Agregado `privacyConsented: boolean` a todos los POST al webhook |
| Reset de consentimiento | `js/mili-chat.js` | `resetMili()` limpia el estado y muestra el aviso nuevamente |
| Texto del aviso aprobado | `js/mili-chat.js` | Wording final aprobado por cliente con `¿Estás de acuerdo?` |
| Estilo de botones de consentimiento | `js/mili-chat.js` | Ambos botones arrancan como outline; el presionado vira a rojo |
| Imagen aliadas v5 | `index.html`, `.gitignore` | `aliados_confianza_v4.png` → `aliados_confianza_v5.png` |

---

# **7. PROPIEDAD DE LA INFRAESTRUCTURA**

Todos los activos fueron migrados a cuentas controladas directamente por el cliente antes del cierre:

| Activo | Estado |
|---|---|
| Dominio `segurosmyl.com` | Bajo control del cliente |
| Repositorio GitHub `segurosmyl/myl-seguros-web` | Bajo control del cliente |
| Proyecto Vercel | Conectado a GitHub del cliente — auto-deploy activo |
| Google Sheets CMS | Bajo control del cliente |
| Google Apps Script | Bajo control del cliente |
| OpenAI (cuenta Developer) | Bajo control del cliente — API key en vault n8n |
| n8n (VPS Hostinger) | Bajo control del cliente |
| Gmail API (GCP proyecto `seguros-myl-n8n`) | Bajo control del cliente |

---

# **8. ENTREGABLES**

| Entregable | Estado |
|---|---|
| Código fuente completo | ✅ Repositorio `segurosmyl/myl-seguros-web` |
| Portal web en producción | ✅ `https://www.segurosmyl.com` |
| Workflows n8n exportados (JSON) | ✅ Backup disponible |
| CMS Google Sheets | ✅ ID `1t6ixz8gSDM2Yg14NggwuNru7Mid2npAR9AaxOvkccgc` |
| Documentación técnica | ✅ `/docs/` en el repositorio |
| Libro maestro de credenciales | ✅ `docs/presentacion_entrega/LIBRO MAESTRO...md` |
| Manual operativo CMS | ✅ Incluido en documentación técnica |
| Acta de entrega Fase 1 | ✅ `docs/presentacion_entrega/ACTA_ENTREGA_FASE_1.md` |

---

# **9. ESTADO DEL PROYECTO**

| Ítem | Estado |
|---|---|
| Fase 1 | ✅ COMPLETADA — 2026-06-09 |
| Portal web | ✅ Producción operativa |
| Myli V1.0 | ✅ Producción operativa |
| Migración a cuentas cliente | ✅ Completada |
| Consentimiento Habeas Data | ✅ Implementado en 2 capas |
| Captura de leads 14 campos | ✅ Activa |
| Notificaciones con prioridad | ✅ Activas |
| Validación post-producción | ✅ Completada |

---

# **10. LIMITACIONES CONOCIDAS Y DIFERIDAS A FASE 2**

| Ítem | Detalle |
|---|---|
| Nodos muertos en myli-chat | 5 nodos (`Save Lead to CRM`, `Lead Exists?`, `Append Lead Row`, `Classify Lead Priority`, `Send Lead Email`) permanecen en el grafo del workflow pero son inalcanzables. Limpieza pendiente. |
| Schema Apps Script contacto web | El script de Google Apps Script del formulario `/contacto/` usa el schema original de 8 columnas; no está actualizado a las 14 columnas de CONTACT_LEADS. |
| Bug filtro Carriers en aliadas | `aliadas/index.html:489` — `c.is_active === '1'` nunca coincide con `'TRUE'`; la pestaña Carriers siempre es bypaseada. La lista de aliadas se deriva correctamente de Products. |
| Re-clic en botones de consentimiento | Presionar el botón de consentimiento por segunda vez reinicia el historial. |
| `appointment_booking` / `analytics_event` | Ambas herramientas retornan mensaje placeholder. Implementación real diferida a Fase 2. |
| Deduplicación de leads | Sin detección de duplicados. Dos submissions del mismo usuario generan dos filas. |
| Compresión de imágenes | Logo V3 (2.55 MB), banners PNG (1–3 MB c/u), cards PNG — pendientes de optimización WebP. |
| SEO | Todas las páginas sin `<title>`, `<meta description>`, `<meta og:image>`. |
| `sitemap.xml` / `robots.txt` | No existen. Requeridos para indexación Google. |
| 6 subpáginas vacías | Sin datos en Google Sheets: `polizas-de-salud-y-medicina-prepagada`, `vehiculos-pesados`, `maquinaria-y-equipos-moviles`, `movilidad-personal`, `polizas-colectivas`, `responsabilidad-civil-profesional`. |
| WhatsApp AI | Fuera del alcance de Fase 1. |

---

# **11. PRÓXIMA FASE**

## **Fase 2 — Portal Operativo Inteligente M&L**

Spec aprobada: `docs/superpowers/specs/2026-06-09-portal-operativo-inteligente-design.md`

Stack: Next.js 14 + Supabase + Vercel
Subdominio previsto: `portal.segurosmyl.com`

Alcance preliminar:

* Portal interno para operación del negocio de seguros.
* Myli y futuros bots como actores de primera clase del sistema.
* Gestión de pólizas como entidad core.
* Solo operaciones internas en Fase 2 — sin autoservicio del cliente final.

## **Myli V2.0 (Fase 2–3)**

* Canal WhatsApp (Meta API).
* Canal Instagram / Facebook.
* CRM integrado.
* Agendamiento de citas.
* Analítica conversacional avanzada.
* Automatizaciones comerciales.

---

# **12. CONCLUSIÓN**

La plataforma digital de Consultores de Seguros M&L quedó completamente operativa, documentada y transferida al cliente al cierre de Fase 1 el 2026-06-09.

El portal web y el asistente Myli V1.0 se encuentran en producción, cumpliendo con la normativa colombiana de protección de datos personales (Ley 1581 de 2012), capturando leads enriquecidos con 14 campos, y entregando notificaciones automáticas con clasificación de prioridad al equipo comercial.

La infraestructura está bajo control total del cliente y preparada para las fases siguientes del roadmap digital.
