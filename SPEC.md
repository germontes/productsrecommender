# SPEC — Portal de recomendación de productos 50+

> Estado: **Borrador v0.3** · Fecha: 2026-09-27
> Documento fuente de verdad antes de construir el sitio. Cualquier cambio de alcance se registra aquí primero.

---

## 1. Resumen

Sitio web **sencillo y minimalista** que recomienda los **mejores productos para personas mayores de 50 años**, separado primero por **Hombres / Mujeres / Unisex** y luego por **categorías**. Cada producto tiene una **página de reseña** con un botón de compra que usa **enlaces de afiliado** (Amazon u otras tiendas). El sitio es **bilingüe (Español / Inglés)**.

**Principios de diseño:** legibilidad ante todo, pocas opciones por pantalla, alto contraste, botones grandes y cero distracciones (sin pop-ups, sin carruseles automáticos).

---

## 2. Decisiones tomadas

| Tema | Decisión |
|---|---|
| Objetivo | Monetización por **afiliados** |
| Idioma | **Bilingüe ES / EN** |
| Tecnología | **HTML + CSS + JS simple**, sin frameworks. Productos en un archivo **JSON** |
| Origen de datos | Productos **agregados manualmente** |
| Navegación | **Hombres / Mujeres / Unisex primero** → categorías |
| Secciones | **Hombres** · **Mujeres** · **Unisex** (productos útiles para cualquier persona, ej. tensiómetro, tablet) |
| Categorías | Salud y bienestar · Fitness y movilidad · Tecnología fácil · Cuidado personal y hogar (las mismas en las 3 secciones) |
| Inicio | Hero con mensaje breve · Tres tarjetas grandes (Para él / Para ella / Para todos) · Productos destacados |
| Detalle de producto | **Sí**, página de reseña por producto |
| Paleta | **Limpio y clásico** (blanco, casi negro, azul marino) |
| Tipografía | **Sans-serif muy legible** (Atkinson Hyperlegible) |
| Accesibilidad | **Alto contraste (WCAG AA+) y botones grandes (≥ 48px)** |
| Tarjeta de producto | Calificación (estrellas) · Línea "Por qué es ideal 50+" · Badge (Mejor opción / Económico) |
| Funciones extra v1 | **Filtros por precio** (solo en páginas Hombres / Mujeres / Unisex) · **Boletín por email** |
| Cantidad al lanzar | **Top 3 por categoría** (4 categorías × 3 secciones × 3 = **36 productos**) |
| Hosting | **Hostinger** |
| Nombre | **Products Recommender** (el mismo en ES y EN) |
| Dominio | **productsrecommender.com** (ya adquirido) |

---

## 3. Público objetivo

- Personas de **50+ años** que buscan productos útiles, de calidad y fáciles de usar.
- También **familiares que buscan regalos** para padres o abuelos. Es un público secundario muy relevante para afiliados.
- Uso probable en **móvil y tablet**, a veces con vista cansada o poca experiencia técnica.

**Qué necesitan:** confianza (¿por qué este producto?), claridad (sin jerga) y rapidez (llegar al producto en ≤ 3 clics).

---

## 4. Arquitectura del sitio

### 4.1 Mapa del sitio

```
Inicio
├── Hombres
│   ├── Salud y bienestar       → 3 productos → página de reseña c/u
│   ├── Fitness y movilidad     → 3 productos
│   ├── Tecnología fácil        → 3 productos
│   └── Cuidado personal y hogar→ 3 productos
├── Mujeres
│   └── (mismas 4 categorías)
├── Unisex
│   └── (mismas 4 categorías)
├── Acerca de / Cómo elegimos
├── Aviso de afiliados
├── Política de privacidad
└── 404
```

### 4.2 Estructura de URLs

Cada idioma tiene su propia carpeta para que el SEO funcione bien y el enlace sea fácil de compartir.

| Página | Español | English |
|---|---|---|
| Inicio | `/es/` | `/en/` |
| Sección | `/es/hombres/` · `/es/mujeres/` · `/es/unisex/` | `/en/men/` · `/en/women/` · `/en/unisex/` |
| Categoría | `/es/hombres/salud-bienestar/` | `/en/men/health-wellness/` |
| Producto | `/es/p/<slug>/` | `/en/p/<slug>/` |
| Acerca de | `/es/acerca/` | `/en/about/` |
| Afiliados | `/es/aviso-afiliados/` | `/en/affiliate-disclosure/` |
| Privacidad | `/es/privacidad/` | `/en/privacy/` |

- La raíz `/` detecta el idioma del navegador y redirige a `/es/` o `/en/`, con la opción de elegir manualmente.
- Slugs de categorías:

| Categoría | slug ES | slug EN |
|---|---|---|
| Salud y bienestar | `salud-bienestar` | `health-wellness` |
| Fitness y movilidad | `fitness-movilidad` | `fitness-mobility` |
| Tecnología fácil | `tecnologia-facil` | `easy-tech` |
| Cuidado personal y hogar | `cuidado-hogar` | `personal-care-home` |

---

## 5. Páginas

### 5.1 Encabezado y pie (comunes)

**Encabezado**
- Logo / nombre del sitio a la izquierda (enlaza al inicio).
- Navegación: **Hombres · Mujeres · Unisex · Cómo elegimos**.
- Selector de idioma **ES | EN**, que lleva a la misma página en el otro idioma.
- En móvil: menú hamburguesa con un botón grande que dice "Menú" (texto visible, no solo un ícono).

**Pie**
- Aviso corto de afiliados: *"Podemos recibir una comisión si compras a través de nuestros enlaces, sin costo extra para ti."*
- Enlaces: Aviso de afiliados · Privacidad · Acerca de.
- Formulario del boletín (versión compacta).
- © Año · Nombre del sitio.

### 5.2 Inicio

1. **Hero:** titular + subtítulo en 1–2 líneas.
   - Ej. ES: *"Los mejores productos para vivir los 50+ con comodidad"* / *"Seleccionados y probados, explicados sin complicaciones."*
2. **Tres tarjetas grandes lado a lado** (apiladas en móvil): **"Para él"**, **"Para ella"** y **"Para todos"** (Unisex), cada una con imagen, título y botón.
3. **Productos destacados:** de 4 a 6 tarjetas (productos con `featured: true`).
4. **Bloque de confianza:** "Cómo elegimos", con 3 puntos cortos (facilidad de uso, calidad y valor).
5. **Boletín:** "Recibe nuevas recomendaciones cada mes".

### 5.3 Página de sección (Hombres / Mujeres / Unisex)

- Título: *"Para hombres 50+"* · *"Para mujeres 50+"* · *"Unisex: para todos 50+"*.
- La página Unisex incluye una línea que explica qué hay en ella: *"Productos útiles para cualquier persona, sin importar el género."*
- **Grid de 4 categorías** (tarjeta con ícono, nombre y descripción de 1 línea).
- Debajo, **todos los productos de la sección** (12), agrupados por categoría y con **filtro por precio** (ver §9.1).
- En Hombres y Mujeres, un enlace discreto al final: *"Ver también productos Unisex"*.

### 5.4 Página de categoría

- Migas de pan: Inicio › Hombres › Salud y bienestar.
- Título + intro breve (2–3 líneas): qué se debe buscar en esta categoría a los 50+.
- **Top 3 productos** en formato ranking (#1, #2, #3), con tarjetas más grandes que en el listado general.
- Sin filtro por precio (solo hay 3 productos; ver §9.1).

### 5.5 Página de producto (reseña)

1. Migas de pan.
2. **Imagen grande** del producto.
3. Nombre, **badge** (Mejor opción / Económico) y **calificación** (estrellas + número, ej. ★★★★½ 4.5/5).
4. **"Por qué es ideal a los 50+"**: 2–3 frases.
5. **Botón principal grande:** "Ver precio en Amazon" (abre en una pestaña nueva, `rel="sponsored noopener"`).
6. **Pros / Contras** en dos columnas (una sola columna en móvil).
7. **Características clave:** lista de 3–5 puntos.
8. **Para quién es / para quién no es.**
9. Botón de compra repetido al final.
10. **Productos relacionados:** los otros 2 de la misma categoría.
11. Nota de afiliado junto al botón.

### 5.6 Páginas legales y de soporte

- **Cómo elegimos / Acerca de:** criterios de selección y quién está detrás del sitio. Genera confianza.
- **Aviso de afiliados:** texto requerido por Amazon Associates (ver §10.2).
- **Privacidad:** datos del boletín, cookies y analítica.
- **404:** mensaje amable + botones a Hombres / Mujeres / Unisex.

---

## 6. Diseño visual

### 6.1 Paleta: "Limpio y clásico"

| Token | Valor | Uso | Contraste sobre blanco |
|---|---|---|---|
| `--bg` | `#FFFFFF` | Fondo | — |
| `--surface` | `#F5F7FA` | Fondo de secciones y tarjetas | — |
| `--text` | `#1A1A1A` | Texto principal | ~17:1 |
| `--text-muted` | `#4A4A4A` | Texto secundario | ~9:1 |
| `--accent` | `#1F3A5F` | Botones, enlaces, badge "Mejor opción" | ~11:1 |
| `--accent-hover` | `#2C4F7C` | Hover de botones | ~8:1 |
| `--success` | `#1E6B45` | Badge "Económico" | ~6.5:1 |
| `--star` | `#B7791F` | Estrellas (gráfico, siempre acompañado del número) | ~3.3:1 (ok para gráficos) |
| `--border` | `#D9DEE5` | Bordes y separadores | — |
| `--focus` | `#F2A900` | Anillo de foco del teclado (3px) | — |

Sin modo oscuro en v1.

### 6.2 Tipografía

- **Fuente:** [Atkinson Hyperlegible](https://fonts.google.com/specimen/Atkinson+Hyperlegible) (Google Fonts), diseñada para baja visión. Respaldo: `system-ui, sans-serif`.
- **Tamaño base:** 18px (móvil) / 19px (escritorio). Nunca menos de 16px.
- **Escala:** H1 40px · H2 30px · H3 24px · texto 18px · texto pequeño 16px.
- **Interlineado:** 1.6. **Ancho máximo de línea:** ~70 caracteres.

### 6.3 Componentes

- **Botón primario:** fondo azul marino, texto blanco, **altura mínima 52px**, padding horizontal 24px, esquinas 8px y texto descriptivo (nunca solo "Clic aquí").
- **Tarjeta de producto:** imagen 4:3 · badge (opcional) · nombre · estrellas + número · línea "Ideal 50+" · botón "Ver reseña". Toda la tarjeta es clicable.
- **Badge:** pastilla con texto (no solo color): "★ Mejor opción" / "$ Económico".
- **Espaciado:** generoso, con una escala de 8px (8/16/24/32/48/64).
- **Grid:** 1 columna en móvil, 2 en tablet y 3 en escritorio. Contenedor máximo de 1200px.
- **Sin:** carruseles automáticos, pop-ups, textos en mayúsculas largos ni animaciones llamativas.

### 6.4 Accesibilidad (requisitos)

- Contraste **WCAG 2.2 AA como mínimo** (la paleta cumple AAA en el texto principal).
- Áreas de clic de **≥ 48×48px** y separación entre ellas.
- Foco de teclado **muy visible** (anillo ámbar de 3px).
- `alt` descriptivo en todas las imágenes; HTML semántico (`header`, `nav`, `main`, `footer`).
- Enlaces subrayados dentro del texto.
- El sitio debe funcionar con zoom del navegador al 200% sin romperse.
- Respeta `prefers-reduced-motion`.
- Atributo `lang="es"` / `lang="en"` correcto en cada página.

---

## 7. Modelo de datos

Un solo archivo `data/products.json` con todos los productos. El texto de cada idioma va dentro de `es` y `en`.

```json
{
  "id": "tensiometro-omron-m3",
  "gender": "hombres",
  "category": "salud-bienestar",
  "rank": 1,
  "rating": 4.5,
  "badge": "top",
  "priceTier": 2,
  "featured": true,
  "image": "/assets/img/products/tensiometro-omron-m3.webp",
  "affiliateUrl": "https://www.amazon.com/dp/XXXXXXXX?tag=TUTAG-20",
  "store": "Amazon",
  "es": {
    "slug": "tensiometro-omron-m3",
    "name": "Tensiómetro de brazo Omron M3",
    "ideal50": "Pantalla grande y un solo botón",
    "why50": "Texto para la sección 'Por qué es ideal a los 50+'.",
    "features": ["...", "..."],
    "pros": ["...", "..."],
    "cons": ["..."],
    "forWho": "...",
    "notForWho": "..."
  },
  "en": {
    "slug": "omron-m3-blood-pressure-monitor",
    "name": "Omron M3 Upper Arm Blood Pressure Monitor",
    "ideal50": "Large display and one-button operation",
    "why50": "...",
    "features": ["..."],
    "pros": ["..."],
    "cons": ["..."],
    "forWho": "...",
    "notForWho": "..."
  }
}
```

**Valores permitidos**
- `gender`: `hombres` | `mujeres` | `unisex`. Un producto útil para cualquier persona va en `unisex` y **no se duplica** en Hombres ni Mujeres.
- `category`: `salud-bienestar` | `fitness-movilidad` | `tecnologia-facil` | `cuidado-hogar`.
- `badge`: `top` | `budget` | `null`.
- `priceTier`: `1` ($, económico) | `2` ($$, medio) | `3` ($$$, premium).
- `rating`: de 1.0 a 5.0 en pasos de 0.5 (calificación propia).

Los textos de la interfaz (menús, botones, títulos fijos) van en `data/i18n.json`.

---

## 8. Bilingüe (ES / EN)

- **Páginas estáticas separadas por idioma** (`/es/...` y `/en/...`), no traducción con JS en el navegador. Así se indexan bien en Google.
- Cada página incluye `<link rel="alternate" hreflang="es|en|x-default">`.
- El selector de idioma lleva a la **página equivalente** (no al inicio).
- La preferencia de idioma se recuerda en `localStorage` (solo para la redirección desde `/`).

---

## 9. Funciones

### 9.1 Filtro por precio

- Botones tipo "chip": **Todos · $ Económico · $$ Medio · $$$ Premium** (basados en `priceTier`).
- Funciona en el navegador con JS y sin recargar la página. Sin JS se muestran todos los productos.
- **Ubicación:** solo en las **páginas de sección (Hombres / Mujeres / Unisex)**, que muestran 12 productos cada una. No aparece en las páginas de categoría mientras tengan 3 productos; se puede añadir si más adelante crecen.
- Al filtrar, los grupos de categoría que queden vacíos se ocultan, y un mensaje indica cuántos productos se muestran (ej. "Mostrando 4 de 12").
- No se muestran precios exactos (se desactualizan y Amazon restringe mostrarlos sin su API); el nivel $/$$/$$$ es orientativo.

### 9.2 Boletín por email

- Formulario: campo de email + botón "Suscribirme" + casilla de consentimiento + enlace a Privacidad.
- Proveedor externo con formulario embebido o endpoint (sin backend propio). Candidatos: **MailerLite**, **Brevo** o **Hostinger Reach**. → ver Q5.
- Doble confirmación (double opt-in) activada.
- Ubicación: al final del Inicio y en el pie de todas las páginas.

---

## 10. SEO, afiliados y legal

### 10.1 SEO

- `<title>` y `meta description` únicos por página y por idioma.
- Etiquetas Open Graph (para compartir en WhatsApp y Facebook, muy usados por este público).
- Datos estructurados **JSON-LD `Product` + `Review`** en páginas de producto y `BreadcrumbList` en todas.
- `sitemap.xml` con alternativas hreflang + `robots.txt`.
- Imágenes en **WebP**, con `width`/`height` y `loading="lazy"`.

### 10.2 Afiliados

- Todos los enlaces de compra llevan `rel="sponsored noopener"` y `target="_blank"`.
- Texto obligatorio de Amazon Associates en el Aviso de afiliados y en el pie:
  - ES: *"Como Afiliado de Amazon, obtengo ingresos por las compras adscritas que cumplen los requisitos aplicables."*
  - EN: *"As an Amazon Associate I earn from qualifying purchases."*
- Nota visible cerca de cada botón de compra.
- **Imágenes de producto:** Amazon no permite copiar sus fotos sin su API. Opciones: fotos propias, imágenes del fabricante con permiso o SiteStripe/API. → ver Q2.

### 10.3 Privacidad

- Política de privacidad que cubra boletín, analítica y cookies de terceros.
- Si se usa analítica, preferir una sin cookies (ej. Plausible, Umami o Cloudflare Web Analytics) para evitar un banner de cookies.

---

## 11. Tecnología y estructura de archivos

**Enfoque:** HTML/CSS/JS sin frameworks + un **pequeño script de generación (Node.js)** que lee `products.json` y produce las páginas estáticas de cada producto, categoría y sección en ambos idiomas.

> ¿Por qué un script? Con 36 productos × 2 idiomas se necesitan **72 páginas de producto + 24 de categoría + 6 de sección**. Escribirlas a mano sería lento y propenso a errores. Generarlas desde el JSON mantiene todo sincronizado y bueno para SEO. El resultado sigue siendo HTML puro que se sube a Hostinger.

```
Productsrecommender/
├── SPEC.md
├── package.json              # scripts: build / serve / start (sin dependencias)
├── build.js                  # valida los datos y genera /dist
├── serve.js                  # servidor local de vista previa (http://localhost:8080)
├── data/
│   ├── site.json             # nombre, dominio, tag de afiliado de Amazon
│   ├── products.json
│   ├── categories.json       # secciones (H/M/Unisex) y categorías por idioma
│   ├── pages.json            # páginas de contenido (acerca, afiliados, privacidad)
│   └── i18n.json             # textos de la interfaz
├── src/
│   ├── templates.js          # plantillas: layout, inicio, sección, categoría, producto, página, 404
│   └── icons.js              # íconos SVG y estrellas
├── content/{es,en}/          # textos largos de las páginas de contenido
├── assets/
│   ├── css/styles.css
│   ├── js/main.js            # menú móvil, idioma recordado, boletín (demo)
│   ├── js/filters.js
│   ├── js/lang-redirect.js
│   └── img/
└── dist/                     # salida lista para subir a Hostinger (incluye .htaccess, sitemap.xml, robots.txt)
```

> Las plantillas son funciones JS (`src/templates.js`) en lugar de archivos `.html`, para no depender de ningún motor de plantillas.

**Uso local:** `npm start` (genera y sirve) · `npm run build` (solo genera). Si el servidor ya está corriendo, basta con `npm run build` y recargar el navegador.

---

## 12. Hosting: Hostinger

- Plan web compartido o superior. El sitio es estático y no necesita PHP ni base de datos.
- Despliegue: subir el contenido de `/dist` a `public_html/` por **File Manager**, **FTP** o **Git deploy** de hPanel.
- Activar **SSL gratuito** y forzar HTTPS.
- `.htaccess` con: redirección a HTTPS, página 404 personalizada, caché de assets y compresión gzip/brotli.
- Dominio: **productsrecommender.com** (ya adquirido). Conectarlo en hPanel y redirigir `www` → dominio raíz (o al revés, pero solo una versión canónica).

---

## 13. Nombre y marca

- **Nombre:** Products Recommender. Se usa igual en ambos idiomas (no se traduce).
- **Dominio:** productsrecommender.com
- En el encabezado aparece como logo tipográfico, y el `<title>` de cada página termina en `| Products Recommender`.
- Como el nombre no menciona a las personas 50+, el hero y la `meta description` del inicio deben dejar claro el enfoque (ej. *"Los mejores productos para vivir los 50+ con comodidad"*).

---

## 14. Preguntas abiertas

| # | Pregunta | Impacto |
|---|---|---|
| ~~Q1~~ | ~~Nombre y dominio~~ → **Resuelto:** Products Recommender · productsrecommender.com | — |
| Q2 | **Imágenes de producto:** ¿fotos propias, del fabricante o usar la API/SiteStripe de Amazon? | Legal y visual |
| ~~Q3~~ | ~~Ubicación del filtro de precio~~ → **Resuelto:** solo en páginas de sección (Hombres / Mujeres / Unisex) | — |
| ~~Q4~~ | ~~Productos unisex~~ → **Resuelto:** nueva sección **Unisex** con las mismas 4 categorías; esos productos no se duplican | — |
| Q5 | **Proveedor del boletín:** MailerLite, Brevo o Hostinger Reach | Formulario y privacidad |
| Q6 | **Tienda de Amazon objetivo:** amazon.com (EE. UU.), amazon.com.mx, amazon.es… ¿una por idioma? | Enlaces y cuenta de afiliado |
| Q7 | **¿Analítica?** ¿Cuál? (recomendado: una sin cookies) | Privacidad y banner |
| Q8 | **Logo:** ¿solo tipográfico (recomendado para v1) o diseñado? | Diseño |

---

## 15. Plan de implementación

### Fase 0: Cerrar decisiones
- [x] Q1 (nombre y dominio), Q3 (filtro de precio) y Q4 (sección Unisex).
- [ ] Responder Q2 y Q5–Q8.
- [ ] Crear la cuenta de Amazon Associates (y otras tiendas si aplica).
- [ ] Elegir los 36 productos (top 3 × 4 categorías × 3 secciones) y llenar una hoja con los datos del §7.

### Fase 1: Base del proyecto
- [ ] Estructura de carpetas (§11) y `package.json`.
- [ ] `styles.css` con tokens de diseño (§6), tipografía, grid y componentes base.
- [ ] `layout.html` con encabezado, pie, selector de idioma y aviso de afiliados.
- [ ] `i18n.json` y `categories.json` completos.

### Fase 2: Generador y plantillas
- [ ] `build.js`: leer JSON → renderizar plantillas → escribir `/dist/es/...` y `/dist/en/...`.
- [ ] Plantillas: inicio, sección, categoría, producto, página genérica y 404.
- [ ] Migas de pan, `hreflang`, meta tags, Open Graph y JSON-LD.
- [ ] `sitemap.xml` y `robots.txt` generados.

### Fase 3: Contenido
- [ ] Cargar 3 productos de ejemplo por completo para validar el diseño.
- [ ] Cargar los 36 productos en ES y EN.
- [ ] Escribir las intros de categoría, "Cómo elegimos", el Aviso de afiliados y la Privacidad.
- [ ] Optimizar las imágenes a WebP.

### Fase 4: Funciones
- [ ] Filtro por precio (`filters.js`) con degradación elegante sin JS.
- [ ] Formulario del boletín conectado al proveedor elegido.
- [ ] Redirección de idioma desde `/`.

### Fase 5: Calidad
- [ ] Revisión de accesibilidad: contraste, teclado, zoom al 200% y lector de pantalla básico.
- [ ] Lighthouse ≥ 95 en Rendimiento, Accesibilidad, Buenas prácticas y SEO.
- [ ] Pruebas en móvil (iOS/Android), tablet y escritorio.
- [ ] Verificar que todos los enlaces de afiliado tienen el tag correcto.

### Fase 6: Publicación en Hostinger
- [ ] Dominio + SSL.
- [ ] Subir `/dist` a `public_html` y añadir `.htaccess`.
- [ ] Enviar el sitemap a Google Search Console.
- [ ] Prueba final en producción.

---

## 16. Fuera de alcance en v1 (ideas futuras)

- Buscador de productos.
- Modo oscuro y control para agrandar el texto (A / A+ / A++).
- Precios en tiempo real vía Amazon PA-API.
- Comparador de productos lado a lado.
- Guías de regalo ("Regalos para papá 60+", Día de las Madres, Navidad).
- Blog / artículos.
- Más de 3 productos por categoría y subcategorías.
