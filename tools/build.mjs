// Builds the static pages in public/ from content/site.json.
// Run: npm run build
import { readFile, writeFile, access, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const pub = new URL('public/', root);
const site = JSON.parse(await readFile(new URL('content/site.json', root), 'utf8'));
const year = new Date().getFullYear();

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const exists = async rel => access(fileURLToPath(new URL(rel, pub))).then(() => true, () => false);

const brandMarkSvg = `<svg class="brand-mark" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
  <g fill="currentColor">
    <rect x="2" y="2" width="3.2" height="3.2" rx=".6"/>
    <rect x="6.4" y="2" width="3.2" height="3.2" rx=".6" opacity=".32"/>
    <rect x="10.8" y="2" width="3.2" height="3.2" rx=".6" opacity=".18"/>
    <rect x="2" y="6.4" width="3.2" height="3.2" rx=".6" opacity=".32"/>
    <rect x="6.4" y="6.4" width="3.2" height="3.2" rx=".6"/>
    <rect x="10.8" y="6.4" width="3.2" height="3.2" rx=".6" opacity=".42"/>
    <rect x="2" y="10.8" width="3.2" height="3.2" rx=".6" opacity=".18"/>
    <rect x="6.4" y="10.8" width="3.2" height="3.2" rx=".6" opacity=".42"/>
    <rect x="10.8" y="10.8" width="3.2" height="3.2" rx=".6"/>
  </g>
</svg>`;

// `current`: 'about' | 'research' | 'publications' | project id. `base`: '' or '../'
function sidebar(current, base) {
  const isProject = site.projects.some(p => p.id === current);
  const cur = cond => (cond ? ' aria-current="page"' : '');
  const researchCurrent = current === 'research' ? ' aria-current="page"' : isProject ? ' aria-current="true"' : '';
  const sub = site.projects.map(p =>
    `<li><a href="${base}projects/${p.id}.html"${cur(current === p.id)}>${esc(p.navTitle)}</a></li>`).join('');
  return `<header class="site-header">
  <a class="site-name" href="${base}index.html">${brandMarkSvg}<span>${esc(site.name)}</span></a>
  <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button>
  <nav class="site-nav" id="site-nav" aria-label="Main navigation">
    <div class="nav-group"><a class="nav-category" href="${base}index.html"${cur(current === 'about')}>About</a></div>
    <div class="nav-group"><a class="nav-category" href="${base}research.html"${researchCurrent}>Research</a><ul class="subnav">${sub}</ul></div>
    <div class="nav-group"><a class="nav-category" href="${base}publications.html"${cur(current === 'publications')}>Publications</a></div>
  </nav>
</header>`;
}

function page({ title, description = site.description, canonical = '', current, base = '', body }) {
  const canonTag = `\n<link rel="canonical" href="https://alexjiangzhe.com/${canonical}">`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="index, follow">${canonTag}
<meta name="theme-color" content="#f7f5f1">
<meta name="description" content="${esc(description)}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="https://alexjiangzhe.com/${canonical}">
<title>${esc(title)}</title>
<link rel="icon" href="${base}assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="${base}site.css">
<script src="${base}site.js" defer></script>
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
${sidebar(current, base)}
<main id="main" class="main">
${body}
<footer class="page-footer"><span>© ${year} Zhe Jiang</span></footer>
</main>
</body>
</html>
`;
}

const tags = list => `<ul class="tags" aria-label="Keywords">${list.map(t => `<li>${esc(t)}</li>`).join('')}</ul>`;

const icons = {
  email: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6.5 9 6.5 9-6.5"/>',
  orcid: '<circle cx="12" cy="12" r="9"/><path d="M9 10v6M9 7.5v.01M12.5 16v-6h1.8a3 3 0 0 1 0 6z"/>',
  github: '<path d="M9 19c-4 1.3-4-2-6-2.5m12 5v-3.5a3 3 0 0 0-.9-2.4c3-.3 6-1.4 6-6.5a5 5 0 0 0-1.4-3.5 4.6 4.6 0 0 0-.1-3.5s-1.1-.3-3.6 1.4a12.4 12.4 0 0 0-6.5 0C6 2.3 4.9 2.6 4.9 2.6a4.6 4.6 0 0 0-.1 3.5A5 5 0 0 0 3.4 9.6c0 5.1 3 6.2 6 6.5a3 3 0 0 0-.9 2.3V22"/>',
  researchgate: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 16V8h2.5a2.2 2.2 0 0 1 0 4.4H8m2.6 0L13 16M17.5 11h-2v3.2a1.8 1.8 0 0 0 1.8 1.8h.2"/>',
  download: '<path d="M12 4v11m-4.5-4.5L12 15l4.5-4.5M5 19h14"/>'
};
const icon = (name, cls = 'contact-icon') =>
  `<svg class="${cls}" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${icons[name]}</svg>`;

// ---------- About (index) ----------
const a = site.about;
const cvReady = await exists(a.cv.file);
const cvBox = cvReady
  ? `<a class="cv-box" href="${a.cv.file}" download><span>${esc(a.cv.label)}<small>${esc(a.cv.note)}</small></span>${icon('download', '')}</a>`
  : `<a class="cv-box" role="link" aria-disabled="true" title="The PDF will be available soon."><span>${esc(a.cv.label)}<small>PDF · coming soon</small></span>${icon('download', '')}</a>`;
const c = a.contact;
const contactLinks = [
  ['email', `mailto:${c.email}`, 'Email', c.email],
  ['orcid', c.orcid, 'ORCID', c.orcid.replace('https://orcid.org/', '')],
  ['github', c.github, 'GitHub', 'GitHub'],
  ['researchgate', c.researchgate, 'ResearchGate', 'ResearchGate']
].map(([k, href, label, text]) => {
  const ext = href.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : '';
  return `<a class="contact-link" href="${esc(href)}"${ext}>${icon(k)}<span><span class="sr-only">${label}: </span>${esc(text)}</span></a>`;
}).join('');

await writeFile(new URL('index.html', pub), page({
  title: `${site.name} — Cognition, brain & computation`,
  canonical: '',
  current: 'about',
  body: `<section class="about-content" aria-labelledby="page-title">
<h1 class="page-heading" id="page-title">${esc(a.heading)}</h1>
<div class="bio">${a.bio.map(p => `<p>${esc(p)}</p>`).join('')}</div>
<section class="about-section" aria-labelledby="edu-title"><h2 id="edu-title">Education</h2><ul>${a.education.map(e => `<li>${esc(e.what)} <span class="when">· ${esc(e.when)}</span></li>`).join('')}</ul></section>
<section class="about-section" id="cv" aria-labelledby="cv-title"><h2 id="cv-title">CV</h2>${cvBox}</section>
<section class="about-section" id="contact" aria-labelledby="contact-title"><h2 id="contact-title">Contact</h2><div class="contact-links">${contactLinks}</div></section>
</section>`
}));

// ---------- Research index ----------
await writeFile(new URL('research.html', pub), page({
  title: `Research — ${site.name}`,
  canonical: 'research.html',
  current: 'research',
  body: `<section class="project-index" aria-labelledby="page-title">
<h1 class="page-heading" id="page-title">Research</h1>
${site.projects.map(p => `<article class="entry">
<h2 class="entry-title"><a href="projects/${p.id}.html">${esc(p.title)}</a></h2>
<p class="entry-subtitle">${esc(p.subtitle)}</p>
${tags(p.tags)}
</article>`).join('\n')}
</section>`
}));

// ---------- Project pages ----------
await mkdir(new URL('projects/', pub), { recursive: true });
for (const [i, p] of site.projects.entries()) {
  const next = site.projects[(i + 1) % site.projects.length];
  await writeFile(new URL(`projects/${p.id}.html`, pub), page({
    title: `${p.title} — ${site.name}`,
    description: p.subtitle,
    canonical: `projects/${p.id}.html`,
    current: p.id,
    base: '../',
    body: `<article class="project-content">
<a class="back-link" href="../research.html">← Research</a>
<header class="project-header">
<h1>${esc(p.title)}</h1>
${tags(p.tags)}
<p class="status">${esc(p.status)}</p>
</header>
<figure class="project-hero"><img src="../${p.image}" alt="${esc(p.imageAlt)}" width="600" height="400" decoding="async"><figcaption>${esc(p.caption)}</figcaption></figure>
<div class="project-body">
<p class="question">${esc(p.question)}</p>
${p.body.map(t => `<p>${esc(t)}</p>`).join('\n')}
<dl class="details">${p.details.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
<p class="project-note">${esc(p.note)}</p>
</div>
<nav class="project-bottom" aria-label="Project navigation"><a href="../research.html">All research</a><a href="${next.id}.html">${esc(next.title)} →</a></nav>
</article>`
  }));
}

// ---------- Publications ----------
const pubs = site.publications;
await writeFile(new URL('publications.html', pub), page({
  title: `Publications — ${site.name}`,
  canonical: 'publications.html',
  current: 'publications',
  body: `<section class="project-index" aria-labelledby="page-title">
<h1 class="page-heading" id="page-title">Publications</h1>
${pubs.length ? pubs.map(x => `<article class="entry"><h2 class="entry-title">${esc(x.title)}</h2><p class="entry-subtitle">${esc(x.authors || '')}${x.venue ? ' · ' + esc(x.venue) : ''}</p>${x.tags ? tags(x.tags) : ''}</article>`).join('\n')
  : '<p class="empty-note">Publications will be listed here.</p>'}
</section>`
}));

// ---------- Old URLs → redirect ----------
for (const [file, target] of [['contact.html', 'index.html#contact'], ['cv.html', 'index.html#cv']]) {
  await writeFile(new URL(file, pub), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="refresh" content="0; url=${target}"><link rel="canonical" href="https://alexjiangzhe.com/${target}"><title>Redirecting — ${esc(site.name)}</title></head><body><p><a href="${target}">Continue</a></p></body></html>\n`);
}

// ---------- Sitemap ----------
const urls = ['', 'research.html', 'publications.html', ...site.projects.map(p => `projects/${p.id}.html`)];
await writeFile(new URL('sitemap.xml', pub), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>https://alexjiangzhe.com/${u}</loc></url>`).join('\n')}
</urlset>
`);

console.log(`Built ${4 + site.projects.length} pages. CV PDF ${cvReady ? 'found' : 'not found (download box shown as "coming soon")'}.`);
