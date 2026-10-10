# Auditoría SEO de outstudio.online (10 oct 2026)

Hecha con la skill `claude-seo` (v2.4.2) sobre el código del sitio. Desde el
entorno de trabajo no se puede abrir el sitio publicado, así que **no hay datos
de campo** (posiciones, Core Web Vitals reales, backlinks, indexación). Todo lo
de abajo sale del código y de la build.

## Antes de los cambios (qué estaba mal)

| Prioridad | Hallazgo |
|---|---|
| Crítico | El HTML inicial de cada página estaba **vacío** (`<div id="root">`): toda la web es una app de React. Google ejecuta JavaScript, pero Bing, las IAs (ChatGPT, Perplexity…) y muchos rastreadores no. |
| Crítico | No había `robots.txt` ni `sitemap.xml`. |
| Crítico | Sólo existía **una** página real con contenido (la portada). Para "tienda Shopify", "desarrollo web" o "e-commerce" no había ninguna página que respondiera esas búsquedas. |
| Alto | Título de la portada sin palabras clave ("…imposibles de ignorar"). Proyectos y Contacto con el nombre viejo "Out.". |
| Alto | Sin `canonical`, sin datos estructurados (JSON-LD), sin `og:image` completo ni Twitter Cards completas. |
| Alto | Imagen para compartir (og.png) con la marca anterior. |
| Medio | El H1 no decía de qué trata el negocio; la página de contacto no tenía H1. |
| Medio | 45 MB publicados (videos y PNG sin uso, hasta 14 MB). |
| Medio | Sin página 404 propia. |
| Bajo | Enlaces internos sólo por anclas (#servicios): ninguna página de servicio a la que enlazar. |

## Qué se hizo

1. **Contenido estático para buscadores** (`scripts/postbuild-seo.mjs`): tras cada build se abre cada página con un navegador y se guarda su contenido como HTML dentro del archivo (oculto a la vista, legible para rastreadores). Al cargar la app se elimina.
2. **6 páginas de servicio** con contenido propio, preguntas frecuentes, enlaces cruzados y llamado a cotizar: `/servicios/desarrollo-web/`, `/tiendas-shopify/`, `/sitios-wordpress/`, `/landing-pages/`, `/apps-y-software-a-medida/`, `/branding/`. Contenido en `src/data/services.json`.
3. **SEO de `<head>`** en todas las páginas (`scripts/gen-seo-pages.mjs`): título y descripción con palabras clave, canonical, hreflang es-CO, Open Graph, Twitter Cards, robots.
4. **Datos estructurados**: Organization/ProfessionalService (con `areaServed` Colombia), WebSite, Service, BreadcrumbList, FAQPage, ContactPage.
5. `robots.txt` (permite rastreadores de IA y bloquea `/cotizar.html`), `sitemap.xml` (se genera en cada build), `llms.txt`, `404.html`.
6. Imagen para compartir nueva (1200×630) y logo de 512 px para los datos estructurados.
7. Portada: H1 con palabras clave, línea visible "Desarrollo web y tiendas Shopify · Colombia", enlaces desde Servicios a cada página y desde el pie.
8. Se retiraron ~26 MB de archivos sin uso (los originales quedan en `source-assets/`).

## Lo que sigue (necesita acciones de Oscar)

1. **Google Search Console**: verificar `outstudio.online` y enviar `https://outstudio.online/sitemap.xml`. Solicitar indexación de la portada y de las 6 páginas de servicio.
2. **Bing Webmaster Tools** (alimenta a Copilot y a otras IAs): igual, e importar desde Search Console.
3. **Perfil de Google**: nombre exacto "Out Studio" (igual en la web), categoría principal "Diseñador de sitios web", sitio web `https://outstudio.online`, área de servicio Colombia, reseñas con el enlace de Google. Cuando exista la URL del perfil, agregarla a `sameAs` en `scripts/gen-seo-pages.mjs`.
4. **Autoridad (lo que más mueve posiciones)**: enlaces desde sitios de los clientes ("Desarrollo web: Out Studio"), directorios (Clutch, Sortlist, directorios de Colombia), LinkedIn y redes con el mismo nombre.
5. **Contenido**: un artículo al mes sobre lo que la gente busca ("Shopify vs WooCommerce en Colombia", "cuánto cuesta una tienda online en Colombia", "pasarelas de pago para tu tienda"). Páginas por ciudad sólo si hay contenido real y distinto en cada una.
6. **Casos de estudio** con resultados medibles (con permiso de los clientes).
7. Revisar de verdad en Search Console a las 2 a 4 semanas: impresiones, consultas y páginas indexadas.

## Sobre el nombre

"Out" solo es demasiado genérico para posicionar. Se recomienda usar **"Out Studio"**
de forma consistente (web, Google, redes, firma de correo) y dejar que el título de
cada página lleve las palabras clave ("Desarrollo web y tiendas Shopify en Colombia | Out Studio").
En el perfil de Google no conviene agregar palabras clave al nombre: Google lo prohíbe
y puede suspender el perfil; la categoría y la descripción hacen ese trabajo.
