// Generates the static site into /dist from data/ + content/ + src/templates.js.
// Usage: node build.js
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  url, homePage, sectionPage, categoryPage, productPage, contentPage, notFoundPage,
} from './src/templates.js';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(ROOT, 'dist');
const readJson = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));

const site = readJson('data/site.json');
const i18n = readJson('data/i18n.json');
const { sections, categories } = readJson('data/categories.json');
const pages = readJson('data/pages.json');
const products = readJson('data/products.json').map((p) => ({ ...p, buyUrl: withAffiliateTag(p.affiliateUrl) }));
const data = { sections, categories, pages, products };

validate();

function withAffiliateTag(link) {
  const u = new URL(link);
  if (/amazon\./.test(u.hostname) && !u.searchParams.has('tag')) u.searchParams.set('tag', site.affiliateTag);
  return u.toString();
}

function validate() {
  const errors = [];
  const sectionIds = new Set(sections.map((s) => s.id));
  const categoryIds = new Set(categories.map((c) => c.id));
  const slugs = { es: new Set(), en: new Set() };
  for (const p of products) {
    if (!sectionIds.has(p.gender)) errors.push(`${p.id}: unknown gender "${p.gender}"`);
    if (!categoryIds.has(p.category)) errors.push(`${p.id}: unknown category "${p.category}"`);
    if (![1, 2, 3].includes(p.priceTier)) errors.push(`${p.id}: priceTier must be 1, 2 or 3`);
    if (p.rating < 1 || p.rating > 5) errors.push(`${p.id}: rating out of range`);
    for (const lang of site.languages) {
      if (!p[lang]?.slug) errors.push(`${p.id}: missing ${lang} content`);
      else if (slugs[lang].has(p[lang].slug)) errors.push(`${p.id}: duplicate ${lang} slug "${p[lang].slug}"`);
      else slugs[lang].add(p[lang].slug);
    }
  }
  if (errors.length) {
    console.error('Data errors:\n  ' + errors.join('\n  '));
    process.exit(1);
  }
}

const written = [];
function write(urlPath, html) {
  const file = urlPath.endsWith('.html') || urlPath.endsWith('.xml') || urlPath.endsWith('.txt') || urlPath.endsWith('.htaccess')
    ? path.join(DIST, urlPath)
    : path.join(DIST, urlPath, 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
  written.push(urlPath);
}

// Clean + copy static assets
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });
fs.cpSync(path.join(ROOT, 'assets'), path.join(DIST, 'assets'), { recursive: true });

const sitemap = []; // { es, en } path pairs

for (const lang of site.languages) {
  const ctx = { lang, t: i18n[lang], i18n, site, data };

  write(url.home(lang), homePage(ctx));
  if (lang === 'es') sitemap.push({ es: url.home('es'), en: url.home('en') });

  for (const s of sections) {
    write(url.section(s, lang), sectionPage(ctx, s));
    if (lang === 'es') sitemap.push({ es: url.section(s, 'es'), en: url.section(s, 'en') });
    for (const c of categories) {
      write(url.category(s, c, lang), categoryPage(ctx, s, c));
      if (lang === 'es') sitemap.push({ es: url.category(s, c, 'es'), en: url.category(s, c, 'en') });
    }
  }

  for (const p of products) {
    write(url.product(p, lang), productPage(ctx, p));
    if (lang === 'es') sitemap.push({ es: url.product(p, 'es'), en: url.product(p, 'en') });
  }

  for (const pg of pages) {
    const html = fs.readFileSync(path.join(ROOT, 'content', lang, `${pg.id}.html`), 'utf8');
    write(url.page(pg, lang), contentPage(ctx, pg, html));
    if (lang === 'es') sitemap.push({ es: url.page(pg, 'es'), en: url.page(pg, 'en') });
  }
}

write('404.html', notFoundPage({ lang: 'es', t: i18n.es, i18n, site, data }));

// Root: redirects to /es/ or /en/
write('index.html', `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${site.name}</title>
  <link rel="alternate" hreflang="es" href="${site.domain}/es/">
  <link rel="alternate" hreflang="en" href="${site.domain}/en/">
  <link rel="alternate" hreflang="x-default" href="${site.domain}/es/">
  <link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
  <script src="/assets/js/lang-redirect.js"></script>
  <style>body{font-family:system-ui,sans-serif;font-size:20px;text-align:center;padding:64px 16px}a{display:inline-block;margin:12px;padding:14px 28px;background:#1f3a5f;color:#fff;border-radius:8px;text-decoration:none}</style>
</head>
<body>
  <h1>${site.name}</h1>
  <p><a href="/es/" hreflang="es">Español</a><a href="/en/" hreflang="en">English</a></p>
</body>
</html>
`);

write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemap
  .flatMap((pair) =>
    ['es', 'en'].map(
      (lang) => `  <url>
    <loc>${site.domain}${pair[lang]}</loc>
    <xhtml:link rel="alternate" hreflang="es" href="${site.domain}${pair.es}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${site.domain}${pair.en}"/>
  </url>`
    )
  )
  .join('\n')}
</urlset>
`);

write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${site.domain}/sitemap.xml\n`);

// Hostinger (Apache) config — SPEC §12
write('.htaccess', `ErrorDocument 404 /404.html

RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}/$1 [L,R=301]
RewriteCond %{HTTP_HOST} ^www\\.(.*)$ [NC]
RewriteRule ^(.*)$ https://%1/$1 [L,R=301]

<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript image/svg+xml application/xml
</IfModule>

<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType image/svg+xml "access plus 1 month"
  ExpiresByType image/webp "access plus 1 year"
</IfModule>
`);

console.log(`Built ${written.length} files into dist/ (${products.length} products × ${site.languages.length} languages).`);
