// Después de `vite build`:
//  1) escribe dist/sitemap.xml con todas las páginas indexables;
//  2) "prerenderiza": abre cada página con un navegador, extrae su contenido
//     y lo deja como HTML estático (visualmente oculto, accesible) dentro del
//     propio archivo. Así los buscadores y las IAs que NO ejecutan JavaScript
//     también leen el contenido real (la web es una app de React y, sin esto,
//     su HTML inicial está vacío). Al montar la app, ese bloque se elimina.
// Si el paso 2 falla por cualquier motivo, el sitio se publica igual (como
// antes); sólo se pierde el contenido estático.
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { preview } from 'vite';

const DIST = 'dist';
const SITE = 'https://outstudio.online';
const SKIP = new Set(['cotizar.html', '404.html']);

function htmlFiles(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (name === 'assets' || name === 'intro') continue;
      out.push(...htmlFiles(p));
    } else if (name.endsWith('.html')) out.push(p);
  }
  return out;
}

const files = htmlFiles(DIST).filter((f) => !SKIP.has(relative(DIST, f)));
const urlFor = (f) => {
  const rel = relative(DIST, f).replace(/\\/g, '/');
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return '/' + rel.slice(0, -'index.html'.length);
  return '/' + rel;
};

// 1) sitemap
const today = new Date().toISOString().slice(0, 10);
const priority = (u) => (u === '/' ? '1.0' : u.startsWith('/servicios/') ? '0.8' : '0.6');
const urls = files.map(urlFor).sort((a, b) => (a === '/' ? -1 : b === '/' ? 1 : a.localeCompare(b)));
writeFileSync(
  join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls
      .map((u) => `  <url><loc>${SITE}${u}</loc><lastmod>${today}</lastmod><priority>${priority(u)}</priority></url>`)
      .join('\n') +
    `\n</urlset>\n`,
);
console.log(`sitemap.xml: ${urls.length} URLs`);

// 2) prerender
let server;
let browser;
try {
  const { chromium } = await import('playwright');
  server = await preview({ preview: { port: 4399, strictPort: true, host: '127.0.0.1' }, build: { outDir: DIST }, logLevel: 'error' });
  browser = await chromium.launch(
    process.env.PRERENDER_CHROMIUM ? { executablePath: process.env.PRERENDER_CHROMIUM } : {},
  );
  let done = 0;
  for (const f of files) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
    await ctx.addInitScript(() => {
      try {
        sessionStorage.setItem('out-intro-seen', '1');
        sessionStorage.setItem('out-mango-dismissed-v2', '1');
      } catch {}
    });
    const page = await ctx.newPage();
    await page.goto(`http://127.0.0.1:4399${urlFor(f)}`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForSelector('#root > *', { timeout: 15000 });
    await page.waitForTimeout(2800);
    const html = await page.evaluate(() => {
      const clone = document.getElementById('root').cloneNode(true);
      clone
        .querySelectorAll('svg,iframe,video,script,style,canvas,img[alt=""],[aria-hidden="true"],button[aria-label^="Mango"],[role="dialog"]')
        .forEach((n) => n.remove());
      // Sólo atributos útiles para leer el contenido.
      clone.querySelectorAll('*').forEach((el) => {
        for (const a of [...el.attributes]) {
          if (!['href', 'alt', 'id', 'aria-label'].includes(a.name)) el.removeAttribute(a.name);
        }
      });
      return clone.innerHTML.replace(/\s{2,}/g, ' ').trim();
    });
    await ctx.close();
    if (html.length < 400) throw new Error(`Contenido vacío en ${urlFor(f)}`);
    const src = readFileSync(f, 'utf8');
    const marker = /(<div id="root"[^>]*><\/div>)/;
    if (!marker.test(src)) throw new Error(`Sin #root vacío en ${f}`);
    const block =
      `<div id="static-content" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap">${html}</div>`;
    writeFileSync(f, src.replace(marker, `$1\n    ${block}`));
    done++;
  }
  console.log(`prerender: ${done}/${files.length} páginas con contenido estático`);
} catch (err) {
  console.warn('prerender omitido (el sitio se publica igual):', err?.message ?? err);
} finally {
  await browser?.close();
  await server?.close?.();
}
process.exit(0);
