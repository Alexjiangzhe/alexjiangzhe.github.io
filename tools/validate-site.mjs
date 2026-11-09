import { readFile, readdir, lstat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../public/', import.meta.url));
const siteFile = fileURLToPath(new URL('../content/site.json', import.meta.url));
const allowed = new Set(['.html', '.css', '.js', '.json', '.svg', '.webp', '.png', '.jpg', '.jpeg', '.pdf', '.txt', '.xml']);
const files = [];
async function walk(dir) {
  for (const name of await readdir(dir)) {
    if (name === '.DS_Store') continue;
    const file = path.join(dir, name);
    const info = await lstat(file);
    if (info.isSymbolicLink()) throw new Error(`Symlink is not publishable: ${name}`);
    if (info.isDirectory()) await walk(file);
    else files.push(file);
  }
}
await walk(root);
for (const file of files) {
  const relative = path.relative(root, file);
  if (!allowed.has(path.extname(file)) && relative !== 'CNAME' && relative !== '.nojekyll') {
    throw new Error(`Unexpected public file: ${relative}`);
  }
  if (['.html', '.css', '.js', '.json', '.svg', '.txt', '.xml'].includes(path.extname(file))) {
    const text = await readFile(file, 'utf8');
    if (/\/Users\/|gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]+|-----BEGIN (?:RSA |OPENSSH |EC )?PRIVATE KEY-----/.test(text)) {
      throw new Error(`Private path or credential pattern in ${relative}`);
    }
    if (/noindex|nofollow/i.test(text) && path.extname(file) === '.html') {
      throw new Error(`Preview-only robots directive in ${relative}`);
    }
  }
}
const site = JSON.parse(await readFile(siteFile, 'utf8'));
if (new Set(site.projects.map(p => p.id)).size !== site.projects.length) {
  throw new Error('Duplicate project id');
}
for (const p of site.projects) {
  for (const field of ['id', 'title', 'subtitle', 'question', 'status', 'image']) {
    if (!p[field]) throw new Error(`Missing ${field} in ${p.id}`);
  }
  if (!files.includes(path.join(root, p.image))) throw new Error(`Missing artwork: ${p.image}`);
  if (!files.includes(path.join(root, 'projects', `${p.id}.html`))) throw new Error(`Missing project page: ${p.id}`);
}
for (const page of ['index.html', 'research.html', 'publications.html', 'cv.html', 'contact.html']) {
  const html = await readFile(path.join(root, page), 'utf8');
  if (!html.includes('name="viewport"') || !html.includes('<title>') || !html.includes('rel="canonical"')) {
    throw new Error(`Missing page metadata: ${page}`);
  }
}
console.log(`Validated ${files.length} public files and ${site.projects.length} projects.`);
console.log('Only public/ is packaged. Local research files and review documents are excluded.');
