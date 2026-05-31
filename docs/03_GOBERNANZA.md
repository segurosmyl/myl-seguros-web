# 03_GOBERNANZA.md — Manual de Gobernanza de Clasificación de Pólizas
## Consultores M&L Seguros · v2

> **Instrucción para Claude Design, Claude Code y Mili:**
> Este documento es la fuente de verdad para la clasificación de productos aseguradores.
> - Claude Design lo usa para generar descripciones precisas en cards, modales y banners.
> - Mili lo usa para responder con terminología técnica correcta y sin mezclar riesgos.
> - Claude Code lo usa para validar la estructura del catálogo y los filtros del Google Sheets.
> NUNCA mezclar riesgos entre categorías. La taxonomía aquí definida es inamovible.
>
> **v2 — Nuevo en esta versión:**
> Cada subcategoría tiene ahora:
> - `descripcion_subcategoria`: texto que aparece en el subtexto del banner y en cards
> - `frase_impacto`: frase corta y emocional para el hero banner de la subpágina

---

## 1. PROPÓSITO

Este manual establece las directrices de gobernanza de datos para la indexación consistente de los productos de las 10 aseguradoras representadas. Su propósito es guiar tanto al equipo operativo como a los modelos de Inteligencia Artificial para:

- Evitar la mezcla de riesgos entre categorías
- Garantizar la consistencia estadística de la base de datos
- Asegurar que las descripciones, banners y cards de la web reflejen correctamente la naturaleza de cada producto

---

## 2. ARQUITECTURA DE CLASIFICACIÓN

La base de datos se estructura en 4 niveles:

```
Categoría Matriz → Subcategoría → Product Type → Producto individual
```

Ejemplo:
```
VIDA → Individual → Auxilios y Respaldos Económicos → Plan Vive SURA
AUTOS → Vehículos Particulares → Seguro de Autos → Seguro de Autos Livianos (Seguros del Estado)
```

---

## 3. CATEGORÍA MATRIZ: VIDA

**Definición oficial:** Enfocada en la protección integral de la estructura familiar, la salud, la integridad física, las mascotas de compañía y el amparo o sustitución de los ingresos financieros directos (incluidos los componentes pensionales del sistema de seguridad social).

**Imagen de banner sugerida:** Familias, personas en momentos de protección, salud, bienestar personal, mascotas. Tonos cálidos, luminosos, emotivos.

---

### 3.1 Subcategoría: Individual

> **descripcion_subcategoria:** Protege económicamente a tu familia y a ti mismo con seguros de vida que van mucho más allá de la cobertura básica. Encuentra pólizas de vida individual o tradicionales con ahorro programado, respaldo ante enfermedades graves como cáncer o Alzheimer, auxilios económicos en efectivo por hospitalización o desempleo, y coberturas que cancelan el saldo de tus deudas ante fallecimiento o incapacidad. SURA, Seguros Bolívar, MAPFRE, AXA Colpatria y más te acompañan en cada etapa de la vida.
>
> **frase_impacto:** "Porque lo que más importa merece la mayor protección."
>
> **titulo_bienvenida:** "Bienvenidos a la sección de Seguros de Vida Individual"

#### Product Type: Individual
- **Definición:** Seguros tradicionales de vida entera o temporal B2C
- **Perfil del tomador:** Persona natural que busca protección financiera para su familia
- **Ejemplos:** Vida Individual de Seguros del Estado, MAPFRE, AXA Colpatria; Vida Ahorro de MAPFRE
- **Copy sugerido para card:** "Protege económicamente a tu familia ante fallecimiento, invalidez o enfermedad grave."
- **Copy sugerido para banner de subpágina:** "Tu familia, protegida para siempre."

#### Product Type: Vida Deudor
- **Definición:** Pólizas individuales suscritas para ser endosadas a un banco para respaldar un crédito personal o hipoteca
- **Perfil del tomador:** Persona natural con crédito activo en entidad financiera
- **Característica clave:** El beneficiario es el banco, no la familia directamente
- **Copy sugerido para card:** "Protege tus créditos. Si falleces o quedas incapacitado, el seguro cubre el saldo de tu deuda."
- **Copy sugerido para banner:** "Tu deuda no será una carga para tu familia."

#### Product Type: Auxilios y Respaldos Económicos
- **Definición:** Seguros indemnizatorios que otorgan sumas de dinero fijas o rentas de libre destinación ante un evento adverso (hospitalización o diagnóstico)
- **Distinción clave:** Indemniza directamente al bolsillo del asegurado, NO cubre gastos clínicos institucionales (eso es Pólizas de Salud)
- **Ejemplos:** Plan Vive SURA, Seguro de Enfermedades Graves SURA, Plan Tutor Familiar Seguros Bolívar
- **Copy sugerido para card:** "Recibe dinero en efectivo si te hospitalizan, diagnostican una enfermedad grave o quedas incapacitado."
- **Copy sugerido para banner:** "Respaldo económico cuando más lo necesitas."

---

### 3.2 Subcategoría: Vida Colectiva

> **descripcion_subcategoria:** Protege a todo tu equipo con una sola póliza. Soluciones corporativas de vida en grupo para empresas, cooperativas, colegios y gremios que cubren fallecimiento, invalidez, desmembración y beneficios por accidente para empleados y asociados. Incluye opciones con componente de ahorro colectivo, protección para cartera de deudores y programas de bienestar empresarial de SURA, MAPFRE, Equidad Seguros, Mundial de Seguros y Seguros del Estado.
>
> **frase_impacto:** "El mejor beneficio que le puedes dar a tu equipo."
>
> **titulo_bienvenida:** "Bienvenidos a la sección de Seguros de Vida Colectiva"

#### Product Type: Vida Grupo Empresarial
- **Definición:** Pólizas grupales B2B corporativas, educativas o gremiales para empleados o asociados
- **Perfil del tomador:** Empresa, cooperativa, colegio o gremio que asegura a su grupo
- **Ejemplos:** Vida Grupo de Seguros del Estado o MAPFRE, Vida Grupo Ahorradores de MAPFRE, Plan Empresario SURA
- **Copy sugerido para card:** "Protección colectiva de vida para empleados, asociados o grupos empresariales."
- **Copy sugerido para banner:** "Cuida a tu equipo con el mejor beneficio corporativo."

#### Product Type: Vida Grupo Deudores
- **Definición:** Pólizas de contratación global donde el tomador es un banco o cooperativa para asegurar la cartera de deudores de la entidad
- **Distinción clave:** El tomador es la entidad financiera, no la empresa empleadora
- **Ejemplos:** Vida Grupo Deudores MAPFRE, Vida Grupo Deudores Equidad Seguros
- **Copy sugerido para card:** "Seguro colectivo que protege la cartera de créditos de tu entidad financiera."

---

### 3.3 Subcategoría: AP (Accidentes Personales)

> **descripcion_subcategoria:** Cobertura económica inmediata ante lesiones, incapacidad o fallecimiento causados por accidentes: eventos externos, fortuitos y visibles. Ideal para estudiantes, trabajadores de campo, deportistas y toda persona activa. Incluye gastos médicos por accidente, desmembración, incapacidad total y permanente, auxilio funerario y respaldo para instituciones educativas. Disponible con Seguros Bolívar, Equidad Seguros, Mundial de Seguros y Seguros del Estado.
>
> **frase_impacto:** "Porque los accidentes no avisan."
>
> **titulo_bienvenida:** "Bienvenidos a la sección de Accidentes Personales"

#### Product Type: AP (Accidentes Personales)
- **Definición:** Pólizas indemnizatorias exclusivas para lesiones o muertes causadas por eventos externos, fortuitos y visibles
- **Exclusión crítica:** NO cubre enfermedades — solo accidentes
- **Ejemplos:** Accidentes Personales de Seguros del Estado, Seguro Escolar Seguros Bolívar, Segurísimo Mundial de Seguros
- **Copy sugerido para card:** "Protección económica ante accidentes: lesiones, incapacidad o fallecimiento por eventos imprevistos."
- **Copy sugerido para banner:** "Porque los accidentes no avisan."

---

### 3.4 Subcategoría: Pólizas de Salud y Medicina Prepagada

> **descripcion_subcategoria:** Accede a los mejores servicios médicos con pólizas que cubren hospitalización, cirugías, urgencias, enfermedades de alto costo y embarazo. Desde cobertura nacional con telemedicina y médico en casa 24/7, hasta protección internacional BUPA con coberturas de hasta USD 7 millones para cáncer, trasplantes y deportes de alto riesgo. SURA, Seguros Bolívar, AXA Colpatria y MAPFRE tienen el plan que tu salud merece.
>
> **frase_impacto:** "Tu salud no puede esperar. Protégela hoy."
>
> **titulo_bienvenida:** "Bienvenidos a la sección de Salud y Medicina Prepagada"

#### Product Type: Pólizas de Salud
- **Definición:** Seguros médicos de asistencia regulados por la SuperFinanciera, con un límite de capital anual global
- **Distinción clave:** Reguladas por SuperFinanciera, cubren gastos clínicos institucionales
- **Ejemplos:** Seguro de Salud de AXA Colpatria, SURA, Seguros del Estado, Salud Vital de MAPFRE, Seguro de Salud Integral Seguros Bolívar, BUPA Seguros Bolívar
- **Copy sugerido para card:** "Acceso a servicios médicos especializados con cobertura de hospitalización, cirugías y enfermedades de alto costo."
- **Copy sugerido para banner:** "Tu salud, protegida por las mejores pólizas del mercado."

#### Product Type: Medicina Prepagada
- **Definición:** Planes de salud regulados por la SuperSalud con redes cerradas y tarifas fijas por rangos de edad
- **Distinción clave:** Reguladas por SuperSalud (no SuperFinanciera), operan con redes médicas cerradas
- **Ejemplos:** Contratos con Colmédica, Sanitas, Medplus
- **Copy sugerido para card:** "Atención médica sin límites con redes de clínicas y especialistas en todo el país."

---

### 3.5 Subcategoría: ARL (Riesgos Laborales)

> **descripcion_subcategoria:** Cumple con la ley y protege a tus empleados ante accidentes laborales y enfermedades ocupacionales. Incluye administración de riesgos laborales obligatoria para empleadores colombianos, soluciones de seguridad social, rentas vitalicias mensuales de por vida ajustadas por IPC y sustitución pensional para beneficiarios. Equidad ARL, AXA Colpatria, MAPFRE y Seguros Bolívar ofrecen las soluciones más completas del mercado.
>
> **frase_impacto:** "Cumple con la ley y protege a quienes hacen posible tu empresa."
>
> **titulo_bienvenida:** "Bienvenidos a la sección de ARL y Riesgos Laborales"

#### Product Type: ARL
- **Definición:** Cobertura del Sistema General de Riesgos Laborales obligatorio en Colombia
- **Carácter:** Obligatorio por ley para empleadores
- **Copy sugerido para card:** "Protección obligatoria para tus empleados ante accidentes y enfermedades laborales."

#### Product Type: Seguridad Social
- **Definición:** Pólizas emitidas en el marco del Sistema de Seguridad Social Integral (Ley 100 de 1993)
- **Ejemplos:** Seguro Previsional y Rentas Vitalicias de MAPFRE, Seguro de Renta Vitalicia Seguros Bolívar
- **Nota:** Se indexan bajo VIDA → ARL → Seguridad Social. Incluye productos de AFP como pensiones y rentas vitalicias.
- **Copy sugerido para card:** "Soluciones pensionales y de renta vitalicia para garantizar ingresos de por vida."

---

### 3.6 Subcategoría: Mascotas

> **descripcion_subcategoria:** Tu perro o gato también es parte de la familia y merece protección real. Coberturas veterinarias para enfermedades, accidentes y urgencias, asistencia ante decesos y responsabilidad civil si tu mascota causa daños a terceros. SURA, MAPFRE y Mundial de Seguros tienen planes diseñados para que cuides la salud y el bienestar de tus peludos sin preocuparte por los gastos imprevistos.
>
> **frase_impacto:** "Ellos también son familia. Protégelos."
>
> **titulo_bienvenida:** "Bienvenidos a la sección de Seguros para Mascotas"

#### Product Type: Mascotas
- **Definición:** Coberturas de salud, asistencia veterinaria, decesos y responsabilidad civil por tenencia para caninos y felinos
- **Lógica de clasificación:** Se mantiene bajo VIDA siguiendo la lógica de protección del núcleo familiar
- **Ejemplos:** Seguro para Mascotas MAPFRE, Seguro para Mascotas SURA, Seguro para Peludos Mundial
- **Copy sugerido para card:** "Cuida la salud y bienestar de tu mascota con cobertura veterinaria y asistencia."
- **Copy sugerido para banner:** "Ellos también son familia. Protégelos."

---

### 3.7 Subcategoría: Exequial

> **descripcion_subcategoria:** Cuando llega el momento más difícil, lo último que tu familia debe enfrentar es una carga económica. Los seguros exequiales de SURA cubren los servicios funerarios completos y brindan apoyo logístico integral ante el fallecimiento del asegurado o sus familiares cubiertos, garantizando acompañamiento en uno de los momentos más importantes de la vida.
>
> **frase_impacto:** "Dale a tu familia la tranquilidad de no tener que preocuparse por nada."
>
> **titulo_bienvenida:** "Bienvenidos a la sección de Seguros Exequiales"

#### Product Type: Exequial
- **Definición:** Soluciones de previsión exequial individuales o colectivas. Cubre servicios funerarios y apoyo logístico ante fallecimiento.
- **Copy sugerido para card:** "Cobertura completa de servicios funerarios para que tu familia no enfrente gastos inesperados."

---

### 3.8 Subcategoría: Pólizas de Asistencia en Viajes Internacionales

> **descripcion_subcategoria:** Viaja al exterior con la tranquilidad de tener respaldo médico completo donde estés. Seguros Médicos Internacionales ofrece planes por días, meses o estadías prolongadas que cubren consultas, urgencias, hospitalización, farmacia, repatriación y odontología. Planes especiales para estudiantes en el exterior y trabajadores expatriados con asistencia telefónica médica 24/7 en cualquier parte del mundo.
>
> **frase_impacto:** "Viaja sin límites. Nosotros te cuidamos donde estés."
>
> **titulo_bienvenida:** "Bienvenidos a la sección de Asistencia en Viajes Internacionales"

#### Product Type: Pólizas de Asistencia en Viajes Internacionales
- **Definición:** Tarjetas de asistencia médica internacional y pérdida de equipaje.
- **Copy sugerido para card:** "Asistencia médica internacional, repatriación y cobertura de equipaje para viajeros frecuentes."

---

## 4. CATEGORÍA MATRIZ: AUTOS

**Definición oficial:** Diseñada para asegurar el chasis, la carrocería y los componentes mecánicos de vehículos terrestres rodantes y autopropulsados, abarcando usos particulares, comerciales, pesados y de maquinaria. Incluye la Responsabilidad Civil Extracontractual (RCE) por daños causados por dichos automotores en movimiento.

**Distinción crítica con GENERALES:** AUTOS ampara el vehículo físico. GENERALES → Transporte de Mercancías ampara la carga comercial que transporta ese vehículo.

**Imagen de banner sugerida:** Vehículos en movimiento, carreteras, ciudades, maquinaria en operación. Tonos dinámicos, modernos, seguros.

---

### 4.1 Subcategoría: Vehículos Particulares

> **descripcion_subcategoria:** Encuentra el seguro ideal para tu automóvil, camioneta o campero familiar entre 10 pólizas de 9 aseguradoras líderes. Desde planes básicos con responsabilidad civil hasta coberturas Premium 360 con deducible desde 0%, vehículo de reemplazo hasta 30 días, conciliación en sitio y asistencia en carretera 24/7. Comparamos opciones de Seguros Bolívar, SURA, MAPFRE, AXA Colpatria y más para que protejas tu inversión sin pagar de más.
>
> **frase_impacto:** "Tu carro, protegido en cada kilómetro."
>
> **titulo_bienvenida:** "Bienvenidos a la sección de Pólizas para Vehículos Particulares"

#### Product Type: Seguro de Autos
- **Definición:** Póliza todo riesgo estándar para automóviles, camionetas y camperos de servicio particular familiar
- **Ejemplos:** Seguro de Autos Livianos Seguros del Estado, Seguro de Autos SURA, Seguro de Automóvil Familiar MAPFRE, Auto Protegido Equidad, Seguro Todo Riesgo Vehículo Bolívar
- **Copy sugerido para card:** "Protección integral para tu vehículo: daños, robo, responsabilidad civil y asistencias en carretera."
- **Copy sugerido para banner:** "Tu carro, protegido en cada kilómetro."

---

### 4.2 Subcategoría: Vehículos Comerciales

> **descripcion_subcategoria:** Protección especializada para los vehículos que son el motor de tu negocio. Coberturas para taxis con amparo de lucro cesante, responsabilidad civil contractual para transporte de pasajeros, seguros para vans comerciales y camionetas de trabajo con asistencia jurídica incluida. HDI Colombia, Equidad Seguros, Previsora y Mundial de Seguros cuidan tu flota comercial en cada ruta.
>
> **frase_impacto:** "Tu negocio sobre ruedas, protegido en cada ruta."
>
> **titulo_bienvenida:** "Bienvenidos a la sección de Seguros para Vehículos Comerciales"

#### Product Type: Todo Riesgo Taxis
- **Definición:** Cobertura integral para transporte público individual, incluyendo amparo de lucro cesante.

#### Product Type: Vehículos de Servicio Público
- **Definición:** Pólizas para buses, busetas y microbuses, incluyendo RCC y RCE obligatorios.

#### Product Type: Vans Comerciales
- **Definición:** Vehículos livianos tipo panel o furgón para distribución de mercancía empresarial.

#### Product Type: Camionetas de Trabajo
- **Definición:** Camionetas pick-up o de estacas para labores operativas o agrícolas.

---

### 4.3 Subcategoría: Vehículos Pesados

> **descripcion_subcategoria:** Coberturas robustas para camiones, tractocamiones y vehículos de gran tonelaje que operan en carreteras nacionales. Incluye responsabilidad civil extracontractual, pérdida total o parcial por daños o hurto, asesoría jurídica en accidentes y opciones para flotas pesadas colectivas. Seguros Bolívar con su línea #322, Equidad Seguros y Mundial de Seguros protegen tu inversión en transporte de carga.
>
> **frase_impacto:** "Cobertura tan robusta como tu flota."
>
> **titulo_bienvenida:** "Bienvenidos a la sección de Seguros para Vehículos Pesados"

#### Product Type: Seguro de Autos Pesados
- **Definición:** Póliza matriz todo riesgo para vehículos de gran tonelaje. Ej: Seguros del Estado, Equidad, Bolívar.

#### Product Type: Camiones
- **Definición:** Cobertura para vehículos rígidos de carga pesada con cabina y furgón integrados.

#### Product Type: Tractocamiones
- **Definición:** Seguros para vehículos articulados de carretera (tractomulas / cabezotes).

#### Product Type: Flotas Pesadas
- **Definición:** Pólizas corporativas globales para múltiples vehículos pesados del mismo tomador. Ej: Pesados de Carga Colectivo Mundial.

---

### 4.4 Subcategoría: Maquinaria y Equipos Móviles

> **descripcion_subcategoria:** Protege tu maquinaria amarilla, retroexcavadoras, bulldozers y equipos de obra ante daños internos súbitos, colisiones, volcamientos y actos malintencionados. Coberturas para maquinaria de contratistas con recursos para reparar o reemplazar equipos afectados y asesoría de expertos para prevenir pérdidas. Seguros Bolívar y Mundial de Seguros tienen las soluciones que tu operación necesita.
>
> **frase_impacto:** "Tu maquinaria trabaja duro. Nosotros la protegemos."
>
> **titulo_bienvenida:** "Bienvenidos a la sección de Seguros para Maquinaria y Equipos"

#### Product Type: Maquinaria Amarilla
- **Definición:** Todo riesgo para equipos pesados de construcción vial o minería.

#### Product Type: Retroexcavadoras
- **Definición:** Seguros específicos para equipos de excavación sobre llantas u orugas.

#### Product Type: Bulldozers
- **Definición:** Seguros para tractores de oruga de empuje pesado.

#### Product Type: Maquinaria de Contratistas
- **Definición:** Equipos móviles menores, motobombas, plantas eléctricas y herramientas de obra. Ej: Seguro Maquinaria y Equipo de Contratistas Bolívar.

---

### 4.5 Subcategoría: Movilidad Personal

> **descripcion_subcategoria:** Desde motos de alto cilindraje hasta bicicletas, patinetas y suscripciones de movilidad eléctrica: asegura el medio que usas cada día. Coberturas contra hurto, daños materiales, responsabilidad civil y asistencia en viaje para motociclistas, ciclistas y usuarios de transporte urbano. MAPFRE, Equidad Seguros, Qualitas Colombia, HDI Colombia y SURA Muverang tienen el plan perfecto para tu movilidad.
>
> **frase_impacto:** "Muévete libre. Llega siempre protegido."
>
> **titulo_bienvenida:** "Bienvenidos a la sección de Seguros de Movilidad Personal"

#### Product Type: Motos
- **Definición:** Pólizas todo riesgo para motocicletas de cualquier cilindraje. Ej: Seguro de Motos MAPFRE, Equidad.

#### Product Type: Bicicletas
- **Definición:** Hurto calificado y daños de bicicletas y vehículos de micromovilidad.

#### Product Type: Movilidad Urbana
- **Definición:** Asegura a la persona natural en desplazamientos diarios multimodal, no a una placa fija. Ej: Plan Muévete Libre SURA.

---

### 4.6 Subcategoría: Crédito de Autos

> **descripcion_subcategoria:** Pólizas todo riesgo con cláusula de beneficiario oneroso para vehículos financiados o en leasing. Protegen al banco, a la financiera y al deudor simultáneamente, garantizando que ante un siniestro la deuda quede cubierta y el activo financiado no se convierta en un pasivo.
>
> **frase_impacto:** "Tu crédito vehicular, respaldado desde el primer día."
>
> **titulo_bienvenida:** "Bienvenidos a la sección de Crédito Vehicular"

#### Product Type: Crédito de Autos Pesados
- **Definición:** Todo riesgo con cláusula de beneficiario oneroso para vehículos pesados financiados.

#### Product Type: Crédito de Autos Livianos
- **Definición:** Todo riesgo para automóviles particulares financiados.

#### Product Type: Leasing Vehicular
- **Definición:** Pólizas para vehículos bajo arrendamiento financiero con opción de compra.

#### Product Type: Compra de Cartera de Vehículos
- **Definición:** Seguros emitidos bajo procesos de sustitución de garantías crediticias automotrices.

---

### 4.7 Subcategoría: Pólizas Colectivas

> **descripcion_subcategoria:** Una sola póliza para toda la flota de tu empresa, con condiciones especiales por volumen. Coberturas para flotas convencionales, vehículos eléctricos e híbridos con asistencias especializadas para baterías, y opciones para flotas mixtas de todo tipo de motor. SURA y Qualitas Colombia ofrecen soluciones corporativas que simplifican la administración de tus pólizas vehiculares.
>
> **frase_impacto:** "Una sola póliza para toda tu flota. Menos trámites, más cobertura."
>
> **titulo_bienvenida:** "Bienvenidos a la sección de Pólizas Colectivas de Vehículos"

#### Product Type: Híbridos y/o Eléctricos
- **Definición:** "Seguros Verdes" con asistencias especializadas para carga energética y baterías de alta tensión.

#### Product Type: Convencionales
- **Definición:** Seguros para flotas de automotores de combustibles fósiles (gasolina / diésel).

#### Product Type: Todo Tipo de Motor
- **Definición:** Pólizas globales unificadas para flotas corporativas de motores mixtos. Ej: Seguro Colectivo de Autos SURA.

---

## 5. CATEGORÍA MATRIZ: CUMPLIMIENTO

**Definición oficial:** Ramo técnico-jurídico que garantiza el resarcimiento de los perjuicios económicos causados por el incumplimiento de obligaciones contractuales, legales o judiciales. El tomador es el obligado y el beneficiario es el acreedor de la prestación.

**Imagen de banner sugerida:** Documentos, contratos, sellos, edificios gubernamentales, apretones de mano. Tonos formales, azul oscuro, sobrios.

---

### 5.1 Subcategoría: Entidades Estatales

> **descripcion_subcategoria:** Garantiza el cumplimiento de todos tus contratos con el Estado colombiano bajo la Ley 80 de 1993. Coberturas para seriedad de la oferta, cumplimiento del contrato, manejo de anticipos, estabilidad y calidad de la obra, pago de salarios y prestaciones sociales. Seguros Bolívar, AXA Colpatria, Previsora y Seguros del Estado son las aseguradoras especializadas en el sector público.
>
> **frase_impacto:** "Cada contrato con el Estado, respaldado con la garantía correcta."
>
> **titulo_bienvenida:** "Bienvenidos a la sección de Seguros de Cumplimiento Estatal"

#### Product Type: Entidades Estatales
- **Definición:** Garantías para contratos con el Estado bajo Ley 80 de 1993. Ej: Seguros Bolívar, AXA Colpatria, Previsora.

---

### 5.2 Subcategoría: Judiciales

> **descripcion_subcategoria:** Cauciones y contracautelas para procesos legales activos, exigidas por jueces y tribunales colombianos. Mundial de Seguros ofrece fianzas judiciales que garantizan el cumplimiento de medidas cautelares, libertades provisionales y decisiones judiciales, respaldando tus obligaciones legales con la solvencia de una aseguradora reconocida.
>
> **frase_impacto:** "Respaldo jurídico cuando el proceso lo exige."
>
> **titulo_bienvenida:** "Bienvenidos a la sección de Seguros Judiciales y Cauciones"

#### Product Type: Judiciales
- **Definición:** Cauciones y contracautelas exigidas por jueces dentro de procesos legales activos.

---

### 5.3 Subcategoría: Cumplimiento Particular

> **descripcion_subcategoria:** Protege tus contratos privados con garantías de cumplimiento entre personas naturales y empresas, sin participación del Estado. Ideal para contratos de construcción, servicios profesionales, suministros y obra privada. Seguros Bolívar, Equidad Seguros, Previsora y Mundial de Seguros respaldan tus compromisos comerciales y protegen al contratante ante incumplimientos.
>
> **frase_impacto:** "Tu contrato privado, blindado ante cualquier incumplimiento."
>
> **titulo_bienvenida:** "Bienvenidos a la sección de Cumplimiento entre Privados"

#### Product Type: Cumplimiento Particular
- **Definición:** Garantías de contratos comerciales o de servicios entre privados. Ej: MAPFRE, Equidad, Mundial.

---

### 5.4 Subcategoría: Arrendamiento

> **descripcion_subcategoria:** Garantiza el pago oportuno de tu canon de arrendamiento incluso cuando el inquilino no puede pagar. Coberturas para viviendas y comercios hasta 400 m², con asistencia ilimitada 24/7 para emergencias en el inmueble, asesoría jurídica especializada, gestión profesional de cobranzas y respaldo para cuotas de administración y servicios públicos. SURA, MAPFRE, Seguros Bolívar y Mundial de Seguros cuidan tu inversión.
>
> **frase_impacto:** "Arrienda con confianza. Tu canon, garantizado."
>
> **titulo_bienvenida:** "Bienvenidos a la sección de Seguros de Arrendamiento"

#### Product Type: Arrendamiento
- **Definición:** Garantiza al propietario el pago de cánones, cuotas de administración y servicios públicos. Ej: SURA, MAPFRE, Bolívar.

---

## 6. CATEGORÍA MATRIZ: GENERALES

**Definición oficial:** Ramo patrimonial enfocado en la conservación, protección y resarcimiento de daños materiales sobre activos fijos, mercancías, predios, obras de ingeniería y responsabilidades legales ajenas al uso de vehículos o al ejercicio de profesiones de la salud.

**Imagen de banner sugerida:** Edificios, hogares, inmuebles, construcciones, mercancías, patrimonio. Tonos sólidos, estables, patrimoniales.

---

### 6.1 Subcategoría: Pólizas de Hogar

> **descripcion_subcategoria:** Protege tu casa o apartamento y todo lo que hay dentro con coberturas multirriesgo que incluyen incendio, terremoto, robo, daños por agua, responsabilidad civil y asistencia domiciliaria 24/7. Desde planes esenciales hasta coberturas integrales que protegen también a tu mascota y a tus empleados del hogar. SURA, MAPFRE, AXA Colpatria, Seguros Bolívar, Previsora y HDI Colombia tienen el plan que tu hogar necesita.
>
> **frase_impacto:** "Tu hogar es tu mayor patrimonio. Protégelo como merece."
>
> **titulo_bienvenida:** "Bienvenidos a la sección de Seguros para el Hogar"

#### Product Type: Pólizas de Hogar
- **Definición:** Seguros multirriesgo residenciales para inmuebles particulares familiares. Ej: SURA, MAPFRE, AXA, Bolívar, Previsora.
- **Copy sugerido para card:** "Protege tu vivienda y su contenido ante incendio, robo, terremoto y daños por agua."

---

### 6.2 Subcategoría: Empresas y/o Persona Natural

> **descripcion_subcategoria:** Protege tu empresa o actividad profesional ante los riesgos que más importan: daños a terceros, incendio, robo, fraude de empleados, ciberataques, rotura de maquinaria y responsabilidad civil extracontractual. Desde microseguros para pequeños negocios hasta coberturas ALL RISK corporativas para grandes empresas. Seguros Bolívar, MAPFRE, Previsora y más de 6 aseguradoras tienen la solución para tu tamaño de empresa.
>
> **frase_impacto:** "Porque un error no debería costarte todo lo que has construido."
>
> **titulo_bienvenida:** "Bienvenidos a la sección de Seguros para Empresas y Personas"

#### Product Type: Empresas
- **Definición:** RCE corporativa que ampara predios, labores, operaciones y productos.

#### Product Type: Persona Natural
- **Definición:** RCE familiar y de actividades de la vida privada extraprofesional.

#### Product Type: Todo Tipo
- **Definición:** Bolsa transaccional para pólizas matrices de RCE genéricas. Ej: RC de Seguros del Estado.

---

### 6.3 Subcategoría: Educativa

> **descripcion_subcategoria:** Asegura la continuidad educativa de tus hijos y protege la infraestructura de tu institución. Seguros de renta educativa de SURA y MAPFRE garantizan el pago de la matrícula y gastos escolares si los padres fallecen o quedan incapacitados, mientras que las pólizas patrimoniales protegen las instalaciones físicas de colegios e institutos ante daños y siniestros.
>
> **frase_impacto:** "La educación de tus hijos, protegida ante cualquier imprevisto."
>
> **titulo_bienvenida:** "Bienvenidos a la sección de Seguros Educativos"

#### Product Type: Educativa
- **Definición:** Seguros patrimoniales de plantas físicas escolares y soluciones de rentas educativas. Ej: SURA, MAPFRE.
- **Copy sugerido para card:** "Protege la infraestructura de tu institución y garantiza la continuidad educativa de tus hijos."

---

### 6.4 Subcategoría: Transporte de Mercancías

> **descripcion_subcategoria:** Tu carga protegida desde el origen hasta el destino, sin importar el medio de transporte: terrestre, aéreo, marítimo, fluvial o férreo. Seguros Bolívar ofrece el Programa Global de Logística para gestionar riesgos en toda la cadena de suministro, con línea Express para siniestros de hasta 10 millones. AXA Colpatria y Mundial de Seguros también cubren tus mercancías en rutas nacionales e internacionales.
>
> **frase_impacto:** "Tu mercancía parte protegida y llega protegida."
>
> **titulo_bienvenida:** "Bienvenidos a la sección de Seguros de Transporte de Mercancías"

#### Product Type: Transporte de Mercancías
- **Definición:** Cubre pérdida o daño de bienes durante transporte nacional o internacional. Ej: AXA Colpatria, Bolívar.
- **Copy sugerido para card:** "Protege tu carga en tránsito ante pérdidas, daños y robos en rutas nacionales e internacionales."

---

### 6.5 Subcategoría: Responsabilidad Civil Profesional

> **descripcion_subcategoria:** Protege tu patrimonio y el de tus pacientes o clientes ante reclamaciones por errores, omisiones o negligencias en el ejercicio de tu profesión. Pólizas E&O bajo modalidad Claims Made para médicos, odontólogos, abogados, contadores, arquitectos y directivos. MAPFRE, Seguros Bolívar y Mundial de Seguros tienen coberturas especializadas que incluyen gastos de defensa legal.
>
> **frase_impacto:** "Ejerce tu profesión con confianza. Nosotros cubrimos los errores."
>
> **titulo_bienvenida:** "Bienvenidos a la sección de Responsabilidad Civil Profesional"

#### Product Type: RC Profesional
- **Definición:** Pólizas E&O bajo modalidad Claims Made para profesionales independientes. Ej: RC Médica MAPFRE, RC Médicos Bolívar.
- **Copy sugerido para card:** "Protección ante reclamaciones por errores u omisiones en el ejercicio de tu profesión."

---

### 6.6 Subcategoría: Pólizas de Copropiedades

> **descripcion_subcategoria:** Protección obligatoria para las zonas comunes de tu conjunto residencial o edificio bajo Ley 675 de propiedad horizontal. Seguros Bolívar cubre daños por incendio, robo con violencia, equipos electrónicos, responsabilidad civil ante terceros y ofrece asistencia en plomería, cerrajería y gas, más asesoría jurídica y gestión en línea a través del portal de clientes.
>
> **frase_impacto:** "Las zonas comunes de tu conjunto, protegidas como lo exige la ley."
>
> **titulo_bienvenida:** "Bienvenidos a la sección de Seguros para Copropiedades"

#### Product Type: Pólizas de Copropiedades
- **Definición:** Seguros obligatorios de zonas comunes bajo Ley 675 de propiedad horizontal. Ej: Bolívar.
- **Copy sugerido para card:** "Cobertura obligatoria para las zonas comunes de tu copropiedad, cumpliendo la Ley 675."

---

### 6.7 Subcategoría: Pólizas Todo Riesgo Construcción

> **descripcion_subcategoria:** Protege tu obra desde el primer pico hasta la entrega final. Coberturas para pérdidas o daños súbitos durante la construcción, incluyendo fenómenos naturales, sociales y daños a equipos. Seguros Bolívar, Equidad Seguros, Previsora y Mundial de Seguros brindan los recursos necesarios para reparar lo afectado y garantizar la continuidad de tu proyecto sin interrupciones.
>
> **frase_impacto:** "Protege tu obra desde el primer día hasta la entrega."
>
> **titulo_bienvenida:** "Bienvenidos a la sección de Seguros Todo Riesgo Construcción"

#### Product Type: Pólizas Todo Riesgo Construcción
- **Definición:** Daños materiales directos sobre obras de ingeniería civil en ejecución. Ej: Bolívar, Equidad, Previsora, Mundial.
- **Copy sugerido para card:** "Cobertura integral para tu obra civil: daños materiales, responsabilidad civil y equipos de construcción."

---

### 6.8 Subcategoría: Pólizas Todo Riesgo Montaje

> **descripcion_subcategoria:** Cobertura especializada para la instalación y puesta en marcha de maquinaria industrial fija, desde la llegada de las partes hasta los períodos de prueba. Seguros Bolívar protege contra daños súbitos durante el montaje, con visitas programadas para identificar riesgos y recursos económicos para reparar equipos afectados antes de que entren en operación comercial.
>
> **frase_impacto:** "Del primer tornillo a la puesta en marcha, tu inversión protegida."
>
> **titulo_bienvenida:** "Bienvenidos a la sección de Seguros Todo Riesgo Montaje"

#### Product Type: Pólizas Todo Riesgo Montaje
- **Definición:** Coberturas para instalación, calibración y pruebas de maquinaria fija industrial. Ej: Bolívar.
- **Copy sugerido para card:** "Protección durante la instalación y puesta en marcha de tu maquinaria industrial."

---

### 6.9 Subcategoría: Responsabilidad Civil Hidrocarburos

> **descripcion_subcategoria:** Coberturas técnicas especializadas para empresas de exploración, producción, transporte y distribución de petróleo y gas. Seguros Bolívar resarce afectaciones patrimoniales y extrapatrimoniales a terceros y al medio ambiente, incluyendo contaminación accidental, gastos de defensa, limpieza de residuos y prevención de la propagación del siniestro en toda la cadena de hidrocarburos.
>
> **frase_impacto:** "Operaciones de alto riesgo requieren coberturas de alto nivel."
>
> **titulo_bienvenida:** "Bienvenidos a la sección de RC para Hidrocarburos"

#### Product Type: RC Hidrocarburos
- **Definición:** RCE y contaminación ambiental para empresas operadoras de la cadena de petróleo y gas. Ej: Bolívar.
- **Copy sugerido para card:** "Responsabilidad civil y ambiental para empresas en exploración, producción y transporte de hidrocarburos."

---

## 7. CONTROLES DE AUDITORÍA — REGLAS DE NO MEZCLA

Estas reglas son críticas para Claude Design, Mili y Claude Code. Ningún producto puede clasificarse en más de una categoría.

### Control 1 — Pensional vs. Vida individual
```
CORRECTO:   VIDA → ARL → Seguridad Social → Renta Vitalicia Bolívar
INCORRECTO: VIDA → Individual → Renta Vitalicia
```

### Control 2 — Mascotas bajo VIDA (no bajo GENERALES)
```
CORRECTO:   VIDA → Mascotas → Mascotas → Seguro para Mascotas SURA
INCORRECTO: GENERALES → Mascotas
```

### Control 3 — Indemnización al bolsillo vs. gasto clínico
```
CORRECTO indemnización:  VIDA → Individual → Auxilios y Respaldos Económicos → Plan Vive SURA
CORRECTO gasto clínico:  VIDA → Pólizas de Salud → Pólizas de Salud → Seguro de Salud SURA
INCORRECTO:              Mezclar Plan Vive con Pólizas de Salud
```

### Control 4 — Vehículo vs. Carga
```
CORRECTO vehículo: AUTOS → Vehículos Pesados → Seguro de Autos Pesados
CORRECTO carga:    GENERALES → Transporte de Mercancías → Transporte de Mercancías
INCORRECTO:        Clasificar seguro de carga bajo AUTOS
```

### Control 5 — Simetría de Cumplimiento
```
Cada subcategoría tiene un único product type homónimo:
Entidades Estatales → Entidades Estatales
Judiciales → Judiciales
Cumplimiento Particular → Cumplimiento Particular
RCE Derivado de Cumplimiento → RCE Derivado de Cumplimiento
Disposiciones Legales → Disposiciones Legales
Arrendamiento → Arrendamiento
INCORRECTO: Clasificar un Seguro de Arrendamiento bajo Cumplimiento Particular
```

### Control 6 — RCE de vehículo vs. RCE general
```
CORRECTO: Daños causados por un vehículo en movimiento → AUTOS (incluye RCE del automotor)
CORRECTO: Daños causados por predios, labores u operaciones empresariales → GENERALES → Empresas
INCORRECTO: Mezclar RC de vehículo con RC empresarial
```

---

## 8. GUÍA DE COPY PARA MILI

Cuando Mili responda preguntas sobre productos, debe usar el lenguaje y las distinciones de este manual:

### Frases que Mili DEBE usar
- "Este seguro indemniza directamente en efectivo, no paga facturas médicas" (Auxilios y Respaldos)
- "El beneficiario de esta póliza es el banco, no tu familia directamente" (Vida Deudor)
- "Este seguro cubre el vehículo físico, no la carga que transporta" (AUTOS)
- "Para proteger tu mercancía durante el transporte necesitas un seguro de transportes, no un seguro de autos" (distinción AUTOS vs. GENERALES)
- "Este seguro es obligatorio por ley para todos los empleadores colombianos" (ARL)

### Preguntas frecuentes con respuesta correcta

**"¿Cuál es la diferencia entre Pólizas de Salud y el Plan Vive de SURA?"**
→ Las Pólizas de Salud cubren los gastos médicos directamente (hospitalizaciones, cirugías, médicos). El Plan Vive te da dinero en efectivo cuando te diagnostican una enfermedad o te hospitalizan — puedes usarlo como quieras, no solo para pagar médicos.

**"¿El seguro de mi camión cubre también la mercancía que cargo?"**
→ No. El seguro de vehículos pesados cubre el chasis, la carrocería y los componentes del camión. Para proteger la mercancía necesitas un Seguro de Transporte de Mercancías por separado.

**"¿La póliza de mascotas es de salud o de vida?"**
→ Está bajo la categoría Vida, porque en M&L seguimos la lógica de protección del núcleo familiar completo — y las mascotas son parte de la familia.

---

## 9. TABLA DE REFERENCIA RÁPIDA — CATEGORÍA POR RIESGO

| Si el riesgo es... | Categoría correcta |
|---|---|
| Muerte o invalidez de una persona | VIDA → Individual |
| Deuda bancaria del asegurado | VIDA → Individual → Vida Deudor |
| Accidente (no enfermedad) | VIDA → AP |
| Gastos médicos clínicos | VIDA → Pólizas de Salud |
| Dinero en efectivo ante enfermedad | VIDA → Individual → Auxilios y Respaldos |
| Empleados de una empresa | VIDA → Vida Colectiva |
| Riesgo laboral / pensión | VIDA → ARL |
| Mascota | VIDA → Mascotas |
| Sepelio / funeral | VIDA → Exequial |
| Viaje internacional | VIDA → Pólizas de Asistencia en Viajes Internacionales |
| Automóvil particular | AUTOS → Vehículos Particulares |
| Bus, taxi, moto | AUTOS → Vehículos Comerciales |
| Camión / tractomula | AUTOS → Vehículos Pesados |
| Retroexcavadora / buldócer | AUTOS → Maquinaria y Equipos Móviles |
| Bicicleta / patineta / moto | AUTOS → Movilidad Personal |
| Vehículo financiado o en leasing | AUTOS → Crédito de Autos |
| Flota corporativa de vehículos | AUTOS → Pólizas Colectivas |
| Contrato con el Estado | CUMPLIMIENTO → Entidades Estatales |
| Proceso judicial / caución | CUMPLIMIENTO → Judiciales |
| Contrato entre privados | CUMPLIMIENTO → Cumplimiento Particular |
| Contrato de arriendo | CUMPLIMIENTO → Arrendamiento |
| Casa / apartamento | GENERALES → Pólizas de Hogar |
| Negocio / empresa (daños a terceros) | GENERALES → Empresas y/o Persona Natural |
| Mercancía en tránsito | GENERALES → Transporte de Mercancías |
| Error profesional (médico, abogado) | GENERALES → RC Profesional |
| Obra de construcción | GENERALES → Todo Riesgo Construcción |
| Instalación de maquinaria | GENERALES → Todo Riesgo Montaje |
| Conjunto residencial | GENERALES → Pólizas de Copropiedades |
| Empresa de petróleo/gas | GENERALES → RC Hidrocarburos |
| Institución educativa / renta estudiantil | GENERALES → Educativa |

---

## 10. TABLA RESUMEN — FRASES DE IMPACTO POR SUBCATEGORÍA

Para referencia rápida de Claude Design y Claude Code al generar banners:

| Subcategoría | frase_impacto |
|---|---|
| Individual | "Porque lo que más importa merece la mayor protección." |
| Vida Colectiva | "El mejor beneficio que le puedes dar a tu equipo." |
| AP (Accidentes Personales) | "Porque los accidentes no avisan." |
| Pólizas de Salud y Medicina Prepagada | "Tu salud no puede esperar. Protégela hoy." |
| ARL (Riesgos Laborales) | "Cumple con la ley y protege a quienes hacen posible tu empresa." |
| Mascotas | "Ellos también son familia. Protégelos." |
| Exequial | "Dale a tu familia la tranquilidad de no tener que preocuparse por nada." |
| Pólizas de Asistencia en Viajes Int. | "Viaja sin límites. Nosotros te cuidamos donde estés." |
| Vehículos Particulares | "Tu carro, protegido en cada kilómetro." |
| Vehículos Comerciales | "Tu negocio sobre ruedas, protegido en cada ruta." |
| Vehículos Pesados | "Cobertura tan robusta como tu flota." |
| Maquinaria y Equipos Móviles | "Tu maquinaria trabaja duro. Nosotros la protegemos." |
| Movilidad Personal | "Muévete libre. Llega siempre protegido." |
| Crédito de Autos | "Tu crédito vehicular, respaldado desde el primer día." |
| Pólizas Colectivas | "Una sola póliza para toda tu flota. Menos trámites, más cobertura." |
| Entidades Estatales | "Cada contrato con el Estado, respaldado con la garantía correcta." |
| Judiciales | "Respaldo jurídico cuando el proceso lo exige." |
| Cumplimiento Particular | "Tu contrato privado, blindado ante cualquier incumplimiento." |
| Arrendamiento | "Arrienda con confianza. Tu canon, garantizado." |
| Pólizas de Hogar | "Tu hogar es tu mayor patrimonio. Protégelo como merece." |
| Empresas y/o Persona Natural | "Porque un error no debería costarte todo lo que has construido." |
| Educativa | "La educación de tus hijos, protegida ante cualquier imprevisto." |
| Transporte de Mercancías | "Tu mercancía parte protegida y llega protegida." |
| RC Profesional | "Ejerce tu profesión con confianza. Nosotros cubrimos los errores." |
| Pólizas de Copropiedades | "Las zonas comunes de tu conjunto, protegidas como lo exige la ley." |
| Todo Riesgo Construcción | "Protege tu obra desde el primer día hasta la entrega." |
| Todo Riesgo Montaje | "Del primer tornillo a la puesta en marcha, tu inversión protegida." |
| RC Hidrocarburos | "Operaciones de alto riesgo requieren coberturas de alto nivel." |

# 11. CATEGORY LANDING PAGE GOVERNANCE (v2.1)

> **Nuevo alcance arquitectónico para Claude Design, Claude Code y Mili**
>
> A partir de esta versión, la arquitectura web de M&L incorpora un nuevo nivel de experiencia digital entre la Home y las subpáginas de subcategoría.
>
> Nueva jerarquía oficial:
>
> ```
> HOME
> → CATEGORY LANDING PAGE
> → SUBCATEGORY PAGE
> → PRODUCT TYPE
> → PRODUCT DETAIL / MODAL
> ```
>
> Este nuevo nivel NO reemplaza la arquitectura actual.
> La extiende.
>
> Toda funcionalidad existente debe seguir operando sin cambios.
>
> Esta sección define la gobernanza oficial para las nuevas landing pages de categoría matriz.

---

## 11.1 OBJETIVO

Las Category Landing Pages existen para:

* mejorar experiencia de navegación del usuario
* crear una experiencia premium intermedia entre Home y subcategorías
* aumentar conversión comercial
* reforzar branding institucional
* mejorar descubrimiento de productos
* consolidar SEO por categoría estratégica
* servir como punto de entrada natural para Mili y futuras automatizaciones IA

---

## 11.2 RUTAS OFICIALES

Cada categoría matriz tendrá una landing page propia.

Rutas oficiales:

```text
/vida/
/autos/
/cumplimiento/
/generales/
```

Estas rutas son obligatorias.

NO usar:

```text
/category/vida/
/categoria/vida/
/landing/vida/
```

Mantener consistencia con la arquitectura actual de URLs limpias.

---

## 11.3 REGLA DE NAVEGACIÓN HEADER

A partir de esta versión:

Los elementos principales del navbar:

```text
Vida
Autos
Cumplimiento
Generales
```

deben comportarse así:

### Click directo

Lleva a la landing page de categoría.

Ejemplo:

```text
Click en VIDA → /vida/
Click en AUTOS → /autos/
```

### Hover

Debe seguir mostrando el dropdown de subcategorías existente.

Ejemplo:

```text
VIDA
 ├── Individual
 ├── Vida Colectiva
 ├── AP
 ├── Salud
 ├── Mascotas
```

Regla obligatoria:

El nuevo comportamiento NO debe romper la navegación actual por subcategorías.

---

## 11.4 REGLA DE FOOTER

Los enlaces existentes del footer:

```text
Vida
Autos
Cumplimiento
Generales
```

deben apuntar a:

```text
/vida/
/autos/
/cumplimiento/
/generales/
```

No deben quedar como enlaces muertos.

---

## 11.5 CATEGORY LANDING PAGE METADATA

Cada categoría matriz debe tener metadata oficial propia.

Nueva estructura obligatoria:

```javascript
CATEGORY_META = {
  VIDA: {},
  AUTOS: {},
  CUMPLIMIENTO: {},
  GENERALES: {}
}
```

Campos obligatorios:

```javascript
slug
eyebrow
headline
subcopy
cta_primary
cta_secondary
banner_image
icon
short_pitch
```

---

## 11.6 METADATA OFICIAL POR CATEGORÍA

### VIDA

```yaml
slug: vida
eyebrow: PROTECCIÓN INTEGRAL
headline: Protección para cada etapa de tu vida y la de quienes más importan
subcopy: Soluciones en vida, salud, accidentes, mascotas y protección financiera diseñadas para personas, familias y empresas.
cta_primary: Explorar soluciones
cta_secondary: Hablar con un asesor
banner_image: vida
icon: heart-shield
short_pitch: Protección personal, familiar y financiera.
```

---

### AUTOS

```yaml
slug: autos
eyebrow: MOVILIDAD PROTEGIDA
headline: Movilidad protegida para personas, empresas y flotas
subcopy: Coberturas para vehículos particulares, comerciales, maquinaria, movilidad personal y soluciones de financiación.
cta_primary: Explorar soluciones
cta_secondary: Hablar con un asesor
banner_image: autos
icon: car-front
short_pitch: Protección para todo lo que se mueve contigo.
```

---

### CUMPLIMIENTO

```yaml
slug: cumplimiento
eyebrow: GARANTÍA JURÍDICA
headline: Garantías jurídicas y contractuales con respaldo asegurador
subcopy: Soluciones para contratos públicos, privados, cauciones judiciales, arrendamientos y obligaciones contractuales.
cta_primary: Explorar soluciones
cta_secondary: Hablar con un asesor
banner_image: cumplimiento
icon: shield-check
short_pitch: Seguridad contractual con respaldo experto.
```

---

### GENERALES

```yaml
slug: generales
eyebrow: PROTECCIÓN PATRIMONIAL
headline: Protección patrimonial para personas, empresas y operaciones
subcopy: Coberturas para hogar, transporte, responsabilidad civil, construcción, copropiedades y riesgos especializados.
cta_primary: Explorar soluciones
cta_secondary: Hablar con un asesor
banner_image: generales
icon: building
short_pitch: Protege lo que has construido.
```

---

## 11.7 REGLA DE RENDERIZADO

Las category landing pages NO deben implementarse como páginas hardcodeadas independientes.

Arquitectura obligatoria:

```text
shared renderer + shared metadata
```

Ejemplo recomendado:

```text
js/category-renderer.js
js/category-meta.js
```

Páginas:

```text
/vida/index.html
/autos/index.html
/cumplimiento/index.html
/generales/index.html
```

Cada página debe ser ligera y consumir renderer compartido.

Objetivo:

* evitar duplicación
* mantener consistencia
* facilitar mantenimiento
* soportar futuras categorías

---

## 11.8 SOURCE OF TRUTH

La información de subcategorías debe consumirse desde este manual.

NO hardcodear subcategorías en HTML.

El renderer debe derivar dinámicamente:

* categoría
* subcategorías
* descripciones
* frases de impacto
* product types
* contadores

Desde gobernanza + dataset activo.

---

## 11.9 ESTRUCTURA UX OBLIGATORIA

Cada landing page debe incluir:

### HERO PREMIUM

Banner principal con:

* imagen premium de categoría
* eyebrow
* headline
* subcopy
* CTA principal
* CTA secundaria

Las imágenes deben seguir identidad visual del home.

Ejemplo:

* VIDA → familia
* AUTOS → SUV / movilidad
* CUMPLIMIENTO → contratos / handshake
* GENERALES → hogar / patrimonio

---

### CATEGORY OVERVIEW

Sección descriptiva usando definición oficial de categoría.

Debe derivarse de:

```text
Definición oficial categoría matriz
```

No inventar textos inconsistentes.

---

### SUBCATEGORY SHOWCASE

Sección principal.

Cada subcategoría debe renderizarse como card premium.

Cada card debe mostrar:

* nombre subcategoría
* frase_impacto
* resumen descripcion_subcategoria
* contador de productos
* contador de aseguradoras
* CTA

CTA:

```text
Explorar opciones →
```

Click:

lleva directamente a la subpágina existente.

---

### CATEGORY SUMMARY STRIP

Resumen visual de soluciones disponibles.

Ejemplo:

VIDA:

* Vida Individual
* Vida Colectiva
* AP
* Salud
* Mascotas
* Exequial

AUTOS:

* Particulares
* Comerciales
* Pesados
* Maquinaria
* Movilidad
* Crédito

Objetivo:

facilitar descubrimiento rápido.

---

### TRUST / WHY M&L

Sección institucional obligatoria.

Ejemplo:

```text
+10 aliados aseguradores
+140 productos
comparación experta
acompañamiento personalizado
```

Debe consumir métricas reales cuando sea posible.

---

### CTA FINAL

Sección premium oscura.

Ejemplo:

```text
¿No sabes cuál solución elegir?
```

Botones:

```text
Hablar con Mili
Hablar con un asesor
```

---

## 11.10 DISEÑO VISUAL

Las landing pages deben seguir identidad visual oficial.

Requisitos:

* premium
* corporativo moderno
* consistente con home
* gradientes suaves
* glassmorphism ligero
* cards rounded
* spacing premium
* responsive
* alto impacto visual

NO crear una estética distinta.

---

## 11.11 COMPATIBILIDAD CON MILI

Estas páginas deben ser compatibles con futuras experiencias IA.

Mili podrá:

* recomendar subcategorías
* explicar diferencias
* redirigir a subcategorías
* sugerir productos según necesidad

Por lo tanto:

IDs, metadata y taxonomía deben permanecer consistentes.

---

## 11.12 REGLAS DE CLAUDE CODE

Claude Code debe:

* reutilizar componentes existentes cuando sea posible
* evitar duplicación de lógica
* preservar compatibilidad backward
* no romper subpáginas actuales
* no alterar filtros existentes
* no cambiar taxonomía actual
* no modificar SLUG_MAP salvo ampliaciones compatibles

---

## 11.13 REGLAS DE CLAUDE DESIGN

Claude Design debe:

* respetar copy oficial
* usar frases de impacto existentes
* no mezclar categorías
* no crear mensajes contradictorios con la taxonomía

---

## 11.14 COMPATIBILIDAD RETROACTIVA

Toda funcionalidad existente debe seguir funcionando:

* home
* subpages
* cards
* modal productos
* compare
* navbar
* footer
* Mili futura

Esta extensión es additive only.

Nunca breaking.
