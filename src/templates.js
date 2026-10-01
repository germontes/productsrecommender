// Page templates. Each returns a full HTML string; build.js writes them to /dist.
import { icon, stars } from './icons.js';

export const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const fmt = (tpl, vars) => tpl.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');
const ratingText = (r) => (Number.isInteger(r) ? r.toFixed(1) : String(r));

// ---------- URLs ----------
export const url = {
  home: (lang) => `/${lang}/`,
  section: (s, lang) => `/${lang}/${s[lang].slug}/`,
  category: (s, c, lang) => `/${lang}/${s[lang].slug}/${c[lang].slug}/`,
  product: (p, lang) => `/${lang}/p/${p[lang].slug}/`,
  page: (pg, lang) => `/${lang}/${pg[lang].slug}/`,
};

// ---------- Layout ----------
export function layout(ctx, o) {
  const { lang, t, site, data } = ctx;
  const other = lang === 'es' ? 'en' : 'es';
  const fullTitle = o.isHome ? `${site.name} | ${t.tagline}` : `${o.title} | ${site.name}`;
  const about = data.pages.find((p) => p.id === 'about');

  const navItems = [
    ...data.sections.map((s) => ({ id: s.id, href: url.section(s, lang), label: s[lang].name })),
    { id: 'about', href: url.page(about, lang), label: t.navHow },
  ];

  const alternates = o.alternates
    ? `<link rel="alternate" hreflang="es" href="${site.domain}${o.alternates.es}">
  <link rel="alternate" hreflang="en" href="${site.domain}${o.alternates.en}">
  <link rel="alternate" hreflang="x-default" href="${site.domain}${o.alternates.es}">`
    : '';

  const langSwitch = o.alternates
    ? `<div class="lang-switch">
          <span aria-current="true">${lang.toUpperCase()}</span><span class="lang-divider" aria-hidden="true">|</span><a href="${o.alternates[other]}" hreflang="${other}" lang="${other}" data-set-lang="${other}" aria-label="${esc(ctx.i18n[other].langName)}">${other.toUpperCase()}</a>
        </div>`
    : '';

  const jsonld = (o.jsonld || [])
    .map((j) => `<script type="application/ld+json">${JSON.stringify(j)}</script>`)
    .join('\n  ');

  return `<!doctype html>
<html lang="${lang}" class="no-js">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(fullTitle)}</title>
  <meta name="description" content="${esc(o.description)}">
  ${o.path ? `<link rel="canonical" href="${site.domain}${o.path}">` : '<meta name="robots" content="noindex">'}
  ${alternates}
  <meta property="og:type" content="${o.ogType || 'website'}">
  <meta property="og:site_name" content="${esc(site.name)}">
  <meta property="og:title" content="${esc(o.title || site.name)}">
  <meta property="og:description" content="${esc(o.description)}">
  ${o.path ? `<meta property="og:url" content="${site.domain}${o.path}">` : ''}
  <meta property="og:locale" content="${lang === 'es' ? 'es_ES' : 'en_US'}">
  <meta name="theme-color" content="#1f3a5f">
  <link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/css/styles.css">
  <script>document.documentElement.classList.replace('no-js','js');</script>
  ${jsonld}
</head>
<body>
  <a class="skip-link" href="#main">${esc(t.skip)}</a>
  <header class="site-header">
    <div class="container header-inner">
      <a class="logo" href="${url.home(lang)}">${esc(site.name)} <span class="logo-badge">50+</span></a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav">${icon('menu')}${esc(t.menu)}</button>
      <nav id="site-nav" class="site-nav" aria-label="${esc(t.navMain)}">
        <ul>
          ${navItems
            .map(
              (n) =>
                `<li><a href="${n.href}"${o.navActive === n.id ? ' aria-current="page"' : ''}>${esc(n.label)}</a></li>`
            )
            .join('\n          ')}
        </ul>
        ${langSwitch}
      </nav>
    </div>
  </header>

  <main id="main">
${o.body}
  </main>

  ${footer(ctx, o.hideFooterNewsletter)}
  <script src="/assets/js/main.js" defer></script>
  ${(o.scripts || []).map((s) => `<script src="${s}" defer></script>`).join('\n  ')}
</body>
</html>
`;
}

function footer(ctx, hideNewsletter) {
  const { lang, t, site, data } = ctx;
  const links = ['about', 'affiliate', 'privacy'].map((id) => data.pages.find((p) => p.id === id));
  return `<footer class="site-footer">
    <div class="container footer-grid">
      <div>${hideNewsletter ? '' : newsletter(ctx, 'footer')}</div>
      <div>
        <nav class="footer-links" aria-label="${esc(t.footerLinks)}">
          <ul>
            ${links.map((p) => `<li><a href="${url.page(p, lang)}">${esc(p[lang].title)}</a></li>`).join('\n            ')}
          </ul>
        </nav>
        <p class="footer-disclosure">${esc(t.footerDisclosure)}</p>
        <p class="copyright">© ${new Date().getFullYear()} ${esc(site.name)}</p>
      </div>
    </div>
  </footer>`;
}

// ---------- Components ----------
export function newsletter(ctx, idSuffix) {
  const { lang, t, data } = ctx;
  const privacy = data.pages.find((p) => p.id === 'privacy');
  return `<section class="newsletter" aria-labelledby="nl-title-${idSuffix}">
        <h2 id="nl-title-${idSuffix}">${esc(t.newsletterTitle)}</h2>
        <p>${esc(t.newsletterText)}</p>
        <form class="newsletter-form" data-thanks="${esc(t.newsletterThanks)}">
          <label for="nl-email-${idSuffix}">${esc(t.emailLabel)}</label>
          <div class="newsletter-row">
            <input id="nl-email-${idSuffix}" type="email" name="email" autocomplete="email" required>
            <button class="btn" type="submit">${esc(t.subscribe)}</button>
          </div>
          <label class="consent"><input type="checkbox" name="consent" required> <span>${esc(t.consent)} <a href="${url.page(privacy, lang)}">${esc(t.privacyLink)}</a>.</span></label>
          <p class="newsletter-msg" role="status"></p>
        </form>
      </section>`;
}

function breadcrumbs(ctx, items) {
  return `<nav class="breadcrumbs container" aria-label="${esc(ctx.t.breadcrumb)}">
      <ol>
        ${items
          .map((it, i) =>
            i === items.length - 1
              ? `<li><span aria-current="page">${esc(it.label)}</span></li>`
              : `<li><a href="${it.href}">${esc(it.label)}</a></li>`
          )
          .join('\n        ')}
      </ol>
    </nav>`;
}

function breadcrumbLd(ctx, items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.label,
      item: ctx.site.domain + it.href,
    })),
  };
}

function badge(ctx, p) {
  if (!p.badge) return '';
  return `<span class="badge badge-${p.badge}">${esc(ctx.t.badge[p.badge])}</span>`;
}

function rating(ctx, p) {
  return `<div class="rating">
            <span class="stars" aria-hidden="true">${stars(p.rating)}</span>
            <span class="rating-num"><span class="visually-hidden">${esc(fmt(ctx.t.ratingLabel, { rating: ratingText(p.rating) }))}</span><span aria-hidden="true">${ratingText(p.rating)}/5</span></span>
          </div>`;
}

function tier(ctx, p, withLabel = false) {
  const label = ctx.t.tiers[p.priceTier];
  const on = '$'.repeat(p.priceTier);
  const off = '$'.repeat(3 - p.priceTier);
  const visual = `<span aria-hidden="true">${on}<span class="tier-off">${off}</span>${withLabel ? ` · ${esc(label)}` : ''}</span>`;
  return `<span class="tier"><span class="visually-hidden">${esc(ctx.t.priceLabel)}: ${esc(label)}</span>${visual}</span>`;
}

function productImage(ctx, p) {
  const cat = ctx.data.categories.find((c) => c.id === p.category);
  if (p.image) {
    return `<div class="product-img"><img src="${p.image}" alt="${esc(p[ctx.lang].name)}" width="800" height="600" loading="lazy"></div>`;
  }
  return `<div class="product-img">${icon(cat.icon)}</div>`;
}

export function productCard(ctx, p, { heading = 'h3', ranked = false } = {}) {
  const L = p[ctx.lang];
  return `<article class="product-card" data-tier="${p.priceTier}">
          ${ranked ? `<span class="rank-num" aria-hidden="true">#${p.rank}</span>` : ''}
          ${productImage(ctx, p)}
          <div class="card-body">
            ${badge(ctx, p)}
            <${heading} class="card-title"><a href="${url.product(p, ctx.lang)}">${ranked ? `<span class="visually-hidden">#${p.rank}. </span>` : ''}${esc(L.name)}</a></${heading}>
            ${rating(ctx, p)}
            <p class="ideal"><strong>${esc(L.ideal50)}</strong></p>
            ${ranked ? `<p class="ideal">${esc(L.why50)}</p>` : ''}
            <div class="card-footer">
              ${tier(ctx, p)}
              <span class="fake-link" aria-hidden="true">${esc(ctx.t.readReview)} ${icon('arrow')}</span>
            </div>
          </div>
        </article>`;
}

function categoryCard(ctx, section, cat) {
  const C = cat[ctx.lang];
  return `<a class="category-card" href="${url.category(section, cat, ctx.lang)}">
          <span class="icon-wrap">${icon(cat.icon)}</span>
          <span><strong>${esc(C.name)}</strong><span>${esc(C.short)}</span></span>
        </a>`;
}

function buyBlock(ctx, p) {
  const t = ctx.t;
  return `<div class="buy-block">
              <a class="btn btn-lg" href="${esc(p.buyUrl)}" target="_blank" rel="sponsored noopener">${esc(fmt(t.buyButton, { store: p.store }))} ${icon('external')}<span class="visually-hidden"> ${esc(t.newTab)}</span></a>
              <p class="affiliate-note">${esc(t.affiliateNote)}</p>
            </div>`;
}

// ---------- Pages ----------
export function homePage(ctx) {
  const { lang, t, data } = ctx;
  const featured = data.products.filter((p) => p.featured);
  const about = data.pages.find((p) => p.id === 'about');
  const trustIcons = ['smile', 'shield', 'tag'];

  const body = `    <section class="hero">
      <div class="container">
        <h1>${esc(t.heroTitle)}</h1>
        <p>${esc(t.heroText)}</p>
      </div>
    </section>

    <section class="section" aria-labelledby="audiences-title">
      <div class="container">
        <h2 id="audiences-title">${esc(t.sectionsTitle)}</h2>
        <div class="grid grid-3">
          ${data.sections
            .map(
              (s) => `<a class="audience-card" href="${url.section(s, lang)}">
            <span class="icon-wrap">${icon(s.icon)}</span>
            <h3>${esc(s[lang].card)}</h3>
            <p>${esc(s[lang].cardText)}</p>
            <span class="fake-link">${esc(t.seeProducts)} ${icon('arrow')}</span>
          </a>`
            )
            .join('\n          ')}
        </div>
      </div>
    </section>

    <section class="section section-alt" aria-labelledby="featured-title">
      <div class="container">
        <h2 id="featured-title">${esc(t.featuredTitle)}</h2>
        <div class="grid grid-3">
        ${featured.map((p) => productCard(ctx, p)).join('\n        ')}
        </div>
      </div>
    </section>

    <section class="section" aria-labelledby="trust-title">
      <div class="container">
        <div class="section-head">
          <h2 id="trust-title">${esc(t.trustTitle)}</h2>
          <a href="${url.page(about, lang)}">${esc(t.trustMore)}</a>
        </div>
        <div class="grid grid-3">
          ${t.trust
            .map(
              (it, i) => `<div class="trust-item">
            <span class="icon-wrap">${icon(trustIcons[i])}</span>
            <h3>${esc(it.title)}</h3>
            <p>${esc(it.text)}</p>
          </div>`
            )
            .join('\n          ')}
        </div>
      </div>
    </section>

    <div class="section">
      <div class="container">
        ${newsletter(ctx, 'home')}
      </div>
    </div>`;

  return layout(ctx, {
    isHome: true,
    title: ctx.site.name,
    description: t.metaHome,
    path: url.home(lang),
    alternates: { es: url.home('es'), en: url.home('en') },
    hideFooterNewsletter: true,
    body,
    jsonld: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: ctx.site.name,
        url: ctx.site.domain + url.home(lang),
        inLanguage: lang,
      },
    ],
  });
}

export function sectionPage(ctx, section) {
  const { lang, t, data } = ctx;
  const S = section[lang];
  const unisex = data.sections.find((s) => s.id === 'unisex');
  const crumbs = [
    { label: t.home, href: url.home(lang) },
    { label: S.name, href: url.section(section, lang) },
  ];

  const groups = data.categories
    .map((cat) => {
      const items = data.products
        .filter((p) => p.gender === section.id && p.category === cat.id)
        .sort((a, b) => a.rank - b.rank);
      return `<section class="category-group" aria-labelledby="grp-${cat.id}">
          <div class="section-head">
            <h3 id="grp-${cat.id}">${esc(cat[lang].name)}</h3>
            <a href="${url.category(section, cat, lang)}">${esc(t.seeCategory)}</a>
          </div>
          <div class="grid grid-3">
        ${items.map((p) => productCard(ctx, p, { heading: 'h4' })).join('\n        ')}
          </div>
        </section>`;
    })
    .join('\n        ');

  const body = `    ${breadcrumbs(ctx, crumbs)}
    <div class="page-head container">
      <h1>${esc(S.title)}</h1>
      <p class="lead">${esc(S.intro)}</p>
    </div>

    <section class="section" aria-labelledby="cats-title">
      <div class="container">
        <h2 id="cats-title">${esc(t.categoriesTitle)}</h2>
        <div class="grid grid-4">
        ${data.categories.map((c) => categoryCard(ctx, section, c)).join('\n        ')}
        </div>
      </div>
    </section>

    <section class="section section-alt" aria-labelledby="all-title">
      <div class="container">
        <h2 id="all-title">${esc(t.allProductsTitle)}</h2>
        <div class="filters" role="group" aria-labelledby="filters-label">
          <span id="filters-label" class="filters-label">${esc(t.filterLabel)}:</span>
          <button class="chip" type="button" data-tier="all" aria-pressed="true">${esc(t.filterAll)}</button>
          ${[1, 2, 3]
            .map(
              (n) =>
                `<button class="chip" type="button" data-tier="${n}" aria-pressed="false"><span aria-hidden="true">${'$'.repeat(n)}</span> ${esc(t.tiers[n])}</button>`
            )
            .join('\n          ')}
        </div>
        <p class="filter-status" aria-live="polite" data-template="${esc(t.filterCount)}"></p>
        <div data-filter-root>
        <p class="filter-empty" hidden>${esc(t.filterEmpty)}</p>
        ${groups}
        </div>
        ${
          section.id !== 'unisex'
            ? `<p class="see-also"><a class="btn btn-outline" href="${url.section(unisex, lang)}">${esc(t.seeAlsoUnisex)} ${icon('arrow')}</a></p>`
            : ''
        }
      </div>
    </section>`;

  return layout(ctx, {
    title: S.title,
    description: S.intro,
    path: url.section(section, lang),
    alternates: { es: url.section(section, 'es'), en: url.section(section, 'en') },
    navActive: section.id,
    body,
    scripts: ['/assets/js/filters.js'],
    jsonld: [breadcrumbLd(ctx, crumbs)],
  });
}

export function categoryPage(ctx, section, cat) {
  const { lang, t, data } = ctx;
  const S = section[lang];
  const C = cat[lang];
  const items = data.products
    .filter((p) => p.gender === section.id && p.category === cat.id)
    .sort((a, b) => a.rank - b.rank);
  const crumbs = [
    { label: t.home, href: url.home(lang) },
    { label: S.name, href: url.section(section, lang) },
    { label: C.name, href: url.category(section, cat, lang) },
  ];
  const others = data.categories.filter((c) => c.id !== cat.id);

  const body = `    ${breadcrumbs(ctx, crumbs)}
    <div class="page-head container">
      <p class="lead" style="margin:0 0 4px;font-weight:700;color:var(--accent)">${esc(S.title)}</p>
      <h1>${esc(C.name)}</h1>
      <p class="lead">${esc(C.intro)}</p>
    </div>

    <section class="section" aria-label="Top 3">
      <div class="container ranked">
        ${items.map((p) => productCard(ctx, p, { heading: 'h2', ranked: true })).join('\n        ')}
      </div>
    </section>

    <section class="section section-alt" aria-labelledby="other-cats">
      <div class="container">
        <div class="section-head">
          <h2 id="other-cats">${esc(t.otherCategories)}</h2>
          <a href="${url.section(section, lang)}">${esc(t.backToSection)} ${esc(S.name)}</a>
        </div>
        <div class="grid grid-3">
        ${others.map((c) => categoryCard(ctx, section, c)).join('\n        ')}
        </div>
      </div>
    </section>`;

  return layout(ctx, {
    title: `${C.name} · ${S.name}`,
    description: C.intro,
    path: url.category(section, cat, lang),
    alternates: { es: url.category(section, cat, 'es'), en: url.category(section, cat, 'en') },
    navActive: section.id,
    body,
    jsonld: [
      breadcrumbLd(ctx, crumbs),
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: items.map((p) => ({
          '@type': 'ListItem',
          position: p.rank,
          url: ctx.site.domain + url.product(p, lang),
          name: p[lang].name,
        })),
      },
    ],
  });
}

export function productPage(ctx, p) {
  const { lang, t, data } = ctx;
  const L = p[lang];
  const section = data.sections.find((s) => s.id === p.gender);
  const cat = data.categories.find((c) => c.id === p.category);
  const related = data.products
    .filter((x) => x.gender === p.gender && x.category === p.category && x.id !== p.id)
    .sort((a, b) => a.rank - b.rank);
  const crumbs = [
    { label: t.home, href: url.home(lang) },
    { label: section[lang].name, href: url.section(section, lang) },
    { label: cat[lang].name, href: url.category(section, cat, lang) },
    { label: L.name, href: url.product(p, lang) },
  ];

  const body = `    ${breadcrumbs(ctx, crumbs)}
    <div class="container">
      <div class="product-hero">
        ${productImage(ctx, p)}
        <div class="product-info">
          ${badge(ctx, p)}
          <h1>${esc(L.name)}</h1>
          <div class="meta-row">
            ${rating(ctx, p)}
            ${tier(ctx, p, true)}
          </div>
          <p class="ideal">${esc(L.ideal50)}</p>
          <div class="why-box">
            <h2>${esc(t.why50)}</h2>
            <p>${esc(L.why50)}</p>
          </div>
          ${buyBlock(ctx, p)}
        </div>
      </div>

      <div class="detail-stack">
        <div class="pros-cons">
          <section class="panel panel-pros" aria-labelledby="pros-title">
            <h2 id="pros-title">${icon('check')}${esc(t.pros)}</h2>
            <ul class="check-list">${L.pros.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
          </section>
          <section class="panel panel-cons" aria-labelledby="cons-title">
            <h2 id="cons-title">${icon('alert')}${esc(t.cons)}</h2>
            <ul class="check-list">${L.cons.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
          </section>
        </div>

        <section class="panel" aria-labelledby="features-title">
          <h2 id="features-title">${esc(t.features)}</h2>
          <ul class="plain-list">${L.features.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
        </section>

        <div class="who-grid">
          <section class="panel" aria-labelledby="for-title">
            <h2 id="for-title">${esc(t.forWho)}</h2>
            <p>${esc(L.forWho)}</p>
          </section>
          <section class="panel" aria-labelledby="notfor-title">
            <h2 id="notfor-title">${esc(t.notForWho)}</h2>
            <p>${esc(L.notForWho)}</p>
          </section>
        </div>

        <div class="final-cta">
          <h2>${esc(L.name)}</h2>
          ${buyBlock(ctx, p)}
        </div>
      </div>
    </div>

    <section class="section" aria-labelledby="related-title">
      <div class="container">
        <h2 id="related-title">${esc(t.related)}</h2>
        <div class="grid grid-2">
        ${related.map((x) => productCard(ctx, x)).join('\n        ')}
        </div>
      </div>
    </section>`;

  return layout(ctx, {
    title: L.name,
    description: `${L.ideal50}. ${L.why50}`.slice(0, 160),
    path: url.product(p, lang),
    alternates: { es: url.product(p, 'es'), en: url.product(p, 'en') },
    navActive: section.id,
    ogType: 'article',
    body,
    jsonld: [
      breadcrumbLd(ctx, crumbs),
      {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: L.name,
        description: L.why50,
        category: cat[lang].name,
        review: {
          '@type': 'Review',
          reviewRating: { '@type': 'Rating', ratingValue: p.rating, bestRating: 5 },
          author: { '@type': 'Organization', name: ctx.site.name },
          reviewBody: L.why50,
        },
      },
    ],
  });
}

export function contentPage(ctx, page, html) {
  const { lang, t } = ctx;
  const P = page[lang];
  const crumbs = [
    { label: t.home, href: url.home(lang) },
    { label: P.title, href: url.page(page, lang) },
  ];
  const body = `    ${breadcrumbs(ctx, crumbs)}
    <div class="page-head container">
      <h1>${esc(P.title)}</h1>
    </div>
    <div class="container prose">
${html}
    </div>`;
  return layout(ctx, {
    title: P.title,
    description: P.description,
    path: url.page(page, lang),
    alternates: { es: url.page(page, 'es'), en: url.page(page, 'en') },
    navActive: page.id,
    body,
    jsonld: [breadcrumbLd(ctx, crumbs)],
  });
}

export function notFoundPage(ctx) {
  const { lang, t, data } = ctx;
  const en = ctx.i18n.en;
  const body = `    <div class="container notfound">
      <h1>${esc(t.notFoundTitle)}</h1>
      <p class="lead" style="margin-inline:auto">${esc(t.notFoundText)}</p>
      <p lang="en" style="color:var(--text-muted)">${esc(en.notFoundTitle)}. <a href="/en/">English version</a></p>
      <div class="btn-row">
        ${data.sections.map((s) => `<a class="btn" href="${url.section(s, lang)}">${esc(s[lang].card)}</a>`).join('\n        ')}
      </div>
    </div>`;
  return layout(ctx, {
    title: t.notFoundTitle,
    description: t.notFoundText,
    path: null,
    alternates: null,
    body,
  });
}
