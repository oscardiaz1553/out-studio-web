// Genera los HTML de entrada (portada, proyectos, contacto y una página por
// servicio) con todo el SEO de <head>: título, descripción, canonical, Open
// Graph, Twitter y datos estructurados (JSON-LD). La fuente del contenido de
// los servicios es src/data/services.json. Ejecutar con: node scripts/gen-seo-pages.mjs
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const data = JSON.parse(readFileSync('src/data/services.json', 'utf8'));
const { site, pages } = data;
const ORG_ID = `${site.url}/#organization`;
const OG = `${site.url}/og.png`;

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const ld = (obj) => `    <script type="application/ld+json">${JSON.stringify(obj)}</script>`;

const organization = {
  '@context': 'https://schema.org',
  '@type': ['Organization', 'ProfessionalService'],
  '@id': ORG_ID,
  name: site.name,
  alternateName: ['Out', 'Out Studio Colombia'],
  url: `${site.url}/`,
  logo: `${site.url}/logo-out.png`,
  image: OG,
  description:
    'Estudio de desarrollo web en Colombia: tiendas Shopify, e-commerce, sitios WordPress, landing pages, apps y branding a medida, con código propio.',
  email: site.email,
  telephone: site.phone,
  slogan: 'Never the usual.',
  address: { '@type': 'PostalAddress', addressLocality: site.locality, addressCountry: site.country },
  areaServed: { '@type': 'Country', name: 'Colombia' },
  founder: {
    '@type': 'Person',
    name: 'Oscar Díaz',
    jobTitle: 'UX/UI Specialist y desarrollador WordPress y Shopify',
  },
  knowsAbout: ['Desarrollo web', 'Tiendas Shopify', 'E-commerce', 'WordPress', 'Diseño UX/UI', 'Branding'],
  // sameAs: agregar aquí el perfil de Google Business y las redes de Out
  // cuando existan (URLs completas), para reforzar la identidad de la marca.
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Servicios de Out Studio',
    itemListElement: pages.map((p) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: p.h1, url: `${site.url}/servicios/${p.slug}/` },
    })),
  },
};

const website = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${site.url}/#website`,
  url: `${site.url}/`,
  name: site.name,
  alternateName: 'Out',
  inLanguage: 'es-CO',
  publisher: { '@id': ORG_ID },
};

function head({ title, description, path, extra = [], robots = 'index, follow, max-image-preview:large' }) {
  const url = `${site.url}${path}`;
  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}" />
    <meta name="robots" content="${robots}" />
    <link rel="canonical" href="${url}" />
    <link rel="alternate" hreflang="es-CO" href="${url}" />
    <link rel="alternate" hreflang="x-default" href="${url}" />
    <meta name="theme-color" content="#1B2FCC" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
    <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192.png" />
    <link rel="apple-touch-icon" href="/favicon-180.png" />
    <meta property="og:site_name" content="${site.name}" />
    <meta property="og:locale" content="es_CO" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${OG}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Out Studio: desarrollo web y tiendas Shopify en Colombia" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(title)}" />
    <meta name="twitter:description" content="${esc(description)}" />
    <meta name="twitter:image" content="${OG}" />
${extra.join('\n')}
  </head>
`;
}

const body = (entry, slug) => `  <body>
    <div id="root"${slug ? ` data-slug="${slug}"` : ''}></div>
    <script type="module" src="/src/${entry}.tsx"></script>
  </body>
</html>
`;

// --- Portada
writeFileSync(
  'index.html',
  head({
    title: 'Desarrollo web y tiendas Shopify en Colombia | Out Studio',
    description:
      'Estudio de desarrollo web en Colombia: tiendas Shopify, e-commerce, sitios WordPress, landing pages y apps a medida con código propio. Cotiza en 24 a 48 h.',
    path: '/',
    extra: [ld(organization), ld(website)],
  }) + body('main'),
);

// --- Proyectos y contacto
writeFileSync(
  'proyectos.html',
  head({
    title: 'Proyectos de desarrollo web y tiendas online | Out Studio',
    description:
      'Casos de Out Studio: sitios web, tiendas Shopify y apps desarrollados a medida para marcas y negocios en Colombia.',
    path: '/proyectos.html',
    extra: [
      ld({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${site.url}/` },
          { '@type': 'ListItem', position: 2, name: 'Proyectos', item: `${site.url}/proyectos.html` },
        ],
      }),
    ],
  }) + body('proyectos'),
);
writeFileSync(
  'contacto.html',
  head({
    title: 'Contacto y cotización de proyectos web | Out Studio',
    description:
      'Escríbenos para cotizar tu sitio web, tienda Shopify, landing page o app. Respondemos en 24 a 48 horas. Out Studio, Colombia.',
    path: '/contacto.html',
    extra: [
      ld({
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        url: `${site.url}/contacto.html`,
        mainEntity: { '@id': ORG_ID },
      }),
    ],
  }) + body('contacto'),
);

// --- Una página por servicio
for (const p of pages) {
  const url = `${site.url}/servicios/${p.slug}/`;
  const html =
    head({
      title: p.metaTitle,
      description: p.metaDescription,
      path: `/servicios/${p.slug}/`,
      extra: [
        ld({
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: p.h1,
          description: p.metaDescription,
          url,
          serviceType: p.nav,
          provider: { '@id': ORG_ID },
          areaServed: { '@type': 'Country', name: 'Colombia' },
        }),
        ld({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${site.url}/` },
            { '@type': 'ListItem', position: 2, name: p.nav, item: url },
          ],
        }),
        ld({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: p.faq.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        }),
      ],
    }) + body('servicio', p.slug);
  mkdirSync(`servicios/${p.slug}`, { recursive: true });
  writeFileSync(`servicios/${p.slug}/index.html`, html);
}
console.log(`OK: portada, proyectos, contacto y ${pages.length} servicios`);
