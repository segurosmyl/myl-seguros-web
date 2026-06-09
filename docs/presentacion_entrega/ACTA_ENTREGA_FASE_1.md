# ACTA DE ENTREGA – FASE 1

---

**Cliente:** Consultores de Seguros M&L

**Proyecto:** Portal Web Corporativo + Myli V1.0 — Asistente Conversacional con IA

**Proveedor de Desarrollo:** IsaGIS Technologies

**Fecha de Entrega:** 2026-06-09

**Versión del Documento:** 1.0

---

## 1. ALCANCE ENTREGADO

### 1.1 Portal Web Corporativo

| Módulo | Descripción | Estado |
|---|---|---|
| Sitio web corporativo | Portal en producción en `https://www.segurosmyl.com` con diseño responsive, compatible con dispositivos móviles y de escritorio. | ✅ Entregado |
| Catálogo dinámico de seguros | 4 categorías, subcategorías, tipos de producto y 27 subpáginas de producto generadas dinámicamente desde Google Sheets sin intervención técnica. | ✅ Entregado |
| Módulo de comparación | Página `/comparar/` para comparación de productos de seguro por categoría. | ✅ Entregado |
| Módulo de aliadas | Página `/aliadas/` con lista de aseguradoras aliadas activas, cargada dinámicamente desde Google Sheets. Imagen corporativa `aliados_confianza_v5.png`. | ✅ Entregado |
| Módulo de contacto | Formulario `/contacto/` con validación frontend, captura de leads vía Google Apps Script y notificaciones automáticas por correo. | ✅ Entregado |
| CMS sin código | Administración del catálogo completo (categorías, productos, aseguradoras, descripciones, beneficios) desde Google Sheets sin modificar código fuente. | ✅ Entregado |
| Política de privacidad | Enlace activo a la Política de Privacidad en el formulario de contacto y en el widget de Myli. | ✅ Entregado |

### 1.2 Myli V1.0 — Asistente Conversacional con IA

| Componente | Descripción | Estado |
|---|---|---|
| Widget web Myli | Widget de chat integrado en todas las páginas del sitio, disponible 24/7, con tres puntos de entrada: FAB general, card de producto y modal de producto. | ✅ Entregado |
| Motor IA | GPT-4.1-mini (OpenAI) con Window Buffer Memory de 20 mensajes, orquestado por n8n en `https://n8n.segurosmyl.com`. | ✅ Entregado |
| Consulta de catálogo | Herramienta `product_knowledge` que permite al agente consultar el catálogo de seguros en tiempo real desde Google Sheets. | ✅ Entregado |
| Consentimiento de datos (Habeas Data) | Implementación en dos capas: aviso en el widget frontend (input deshabilitado hasta aceptar/rechazar) y regla crítica en el system prompt del agente IA. Cumplimiento con Ley 1581 de 2012. | ✅ Entregado |
| Captura de leads con IA | Herramienta `lead_capture` que recopila hasta 14 campos del prospecto durante la conversación y los registra en Google Sheets `CONTACT_LEADS`. | ✅ Entregado |
| Campos enriquecidos de leads | Schema CONTACT_LEADS con 14 columnas: datos de contacto, preferencia de canal y horario, transcripción completa, resumen de IA, placa y ciudad (AUTOS). | ✅ Entregado |
| Escalamiento humano | Herramienta `human_handoff` que conecta al prospecto con un asesor M&L por WhatsApp cuando lo solicita. | ✅ Entregado |
| Integración Google Sheets CRM | Todos los leads capturados por Myli se registran automáticamente en la hoja `CONTACT_LEADS` con estado inicial `NEW — Sin gestionar`. | ✅ Entregado |
| Notificaciones automáticas por correo | Correo automático enviado al equipo comercial para cada lead capturado, con clasificación de prioridad (`🔥 PRIORITARIO` / `🚨 Estándar`) basada en señales de la conversación. | ✅ Entregado |
| Destinatarios de notificaciones | `tecnologia@segurosmyl.com`, `vargash@segurosmyl.com`, `mateusyd@segurosmyl.com`, `alertasmyl@gmail.com`. | ✅ Entregado |
| Mejoras de cotización AUTOS | Captura obligatoria de placa del vehículo y ciudad de movilidad antes de registrar el lead en la categoría AUTOS. | ✅ Entregado |

### 1.3 Infraestructura y Continuidad Operativa

| Ítem | Estado |
|---|---|
| Dominio `segurosmyl.com` y redirect apex | ✅ Bajo propiedad del cliente |
| Repositorio GitHub `segurosmyl/myl-seguros-web` | ✅ Bajo propiedad del cliente |
| Proyecto Vercel con despliegue continuo | ✅ Bajo propiedad del cliente |
| Google Sheets CMS | ✅ Bajo propiedad del cliente |
| Google Apps Script | ✅ Bajo propiedad del cliente |
| Cuenta OpenAI y API key en vault n8n | ✅ Bajo propiedad del cliente |
| VPS Hostinger + n8n | ✅ Bajo propiedad del cliente |
| Gmail API (GCP `seguros-myl-n8n`) | ✅ Bajo propiedad del cliente |
| Documentación técnica | ✅ Entregada en `/docs/` del repositorio |
| Libro Maestro de Credenciales e Infraestructura | ✅ Entregado |
| Backup workflows n8n (JSON) | ✅ Disponible |

### 1.4 Demostraciones IA

| Demostración | Estado |
|---|---|
| Demostración del asistente Myli en vivo sobre el portal web | ✅ Disponible |
| Base de conocimiento integrada con catálogo de productos M&L | ✅ Operativa |
| Flujo de captura de lead desde el chat hasta Google Sheets | ✅ Validado en producción |
| Notificación por correo con lead de prueba | ✅ Validado en producción |

---

## 2. EXCLUSIONES — FUERA DEL ALCANCE DE FASE 1

Los siguientes ítems no forman parte del alcance de la Fase 1 entregada y quedan expresamente excluidos de este acta:

| Ítem excluido | Fase prevista |
|---|---|
| Portal Operativo Inteligente M&L (`portal.segurosmyl.com`) | Fase 2 |
| Bot de Marketing | Fase 2–3 |
| Bot Asistente Interno | Fase 2 |
| Myli V2.0 | Fase 2–3 |
| Canal WhatsApp (Meta API) | Fase 2 |
| Canal Instagram | Fase 3 |
| Canal Facebook Messenger | Fase 3 |
| Integración con redes sociales | Fase 3 |
| CRM integrado | Fase 2 |
| Agendamiento de citas | Fase 2 |
| Analítica conversacional avanzada | Fase 2–3 |
| Automatizaciones comerciales avanzadas | Fase 2–3 |
| Memoria persistente de clientes entre sesiones | Fase 2 |
| Optimización SEO completa (títulos, meta, sitemap) | Pendiente |
| Compresión de imágenes (WebP) | Pendiente |
| Autoservicio del cliente final | Fuera de roadmap actual |

---

## 3. OBSERVACIONES TÉCNICAS

Las siguientes limitaciones menores fueron identificadas al cierre de Fase 1 y se documentan formalmente. No afectan la operatividad del sistema y están programadas para resolución en iteraciones futuras:

1. El formulario de contacto web (`/contacto/`) utiliza el schema original de 8 columnas en su Google Apps Script. La actualización a 14 columnas queda pendiente.
2. Cinco nodos del workflow `myli-chat` en n8n son código inalcanzable (dead code) pendiente de limpieza.
3. El filtro de aseguradoras en la página `/aliadas/` tiene un bug latente (`is_active === '1'` vs `'TRUE'`) que no afecta el comportamiento observable, ya que la lista se deriva correctamente de la pestaña Products.
4. No existe deduplicación de leads: dos submissions del mismo usuario generan dos filas en CONTACT_LEADS.
5. Seis subpáginas de producto están vacías por ausencia de datos en Google Sheets (no es un defecto de código).

---

## 4. DECLARACIÓN DE ACEPTACIÓN

Por medio del presente documento, se certifica que el proyecto **Portal Web Corporativo + Myli V1.0** de Consultores de Seguros M&L ha sido completado y entregado satisfactoriamente en sus términos de Fase 1, con todos los componentes descritos en la Sección 1 en estado operativo en producción a la fecha 2026-06-09.

La infraestructura tecnológica se encuentra bajo control y propiedad directa del cliente. El equipo de IsaGIS ha transferido todos los accesos, credenciales y documentación necesarios para la operación y continuidad del sistema.

Ambas partes reconocen el cierre formal de la Fase 1 y la disponibilidad de los entregables descritos en este documento.

---

## 5. FIRMAS

### Por Consultores de Seguros M&L

```
Nombre:        ___________________________________

Cargo:         ___________________________________

Firma:         ___________________________________

Fecha:         ___________________________________
```

---

### Por IsaGIS Technologies

```
Nombre:        Cesar Eraso

Cargo:         Arquitecto de Soluciones

Firma:         ___________________________________

Fecha:         2026-06-09
```

---

*Documento generado al cierre de Fase 1 — MYL Seguros Web + Myli V1.0.*
*Referencia técnica: `docs/presentacion_entrega/DOCUMENTO DE ENTREGA TÉCNICA Portal Web Consultores M&L.md`*
*Session handoff: `docs/SESSION_HANDOFF_AFTER_CLIENT_MIGRATION.md`*
