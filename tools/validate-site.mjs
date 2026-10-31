import { readFile, readdir, lstat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../public/', import.meta.url));
const allowed = new Set(['.html', '.css', '.js', '.json', '.svg', '.webp', '.png', '.txt', '.xml']);
const files = [];
async function walk(dir) {
  for (const name of await readdir(dir)) {
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
  if (!allowed.has(path.extname(file)) && relative !== 'CNAME' && relative !== '.nojekyll') throw new Error(`Unexpected public file: ${relative}`);
  if (['.html', '.css', '.js', '.json', '.svg', '.txt', '.xml'].includes(path.extname(file))) {
    const text = await readFile(file, 'utf8');
    if (/\/Users\/|gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]+|-----BEGIN (?:RSA |OPENSSH |EC )?PRIVATE KEY-----/.test(text)) throw new Error(`Private path or credential pattern in ${relative}`);
    if (/noindex|nofollow/i.test(text) && path.extname(file) === '.html') throw new Error(`Preview-only robots directive in ${relative}`);
  }
}
const data = JSON.parse(await readFile(path.join(root, 'data/content.json'), 'utf8'));
if (new Set(data.projects.map(p => p.id)).size !== data.projects.length) throw new Error('Duplicate project id');
for (const project of data.projects) {
  for (const field of ['title', 'question', 'motivation', 'approach', 'contribution', 'currentWork', 'status']) if (!project[field]) throw new Error(`Missing ${field} in ${project.id}`);
  if (!project.methodDetails?.length || project.methodDetails.some(m => !m.name || !m.purpose)) throw new Error(`Missing method explanation: ${project.id}`);
  if (!files.includes(path.join(root, 'assets', project.image))) throw new Error(`Missing artwork: ${project.image}`);
}
for (const publication of data.publications) {
  if (!['Published', 'Accepted', 'Preprint', 'Under review'].includes(publication.status) || !/^https:\/\//.test(publication.url)) throw new Error('Invalid publication status or public link');
  if (!publication.title || !publication.authors || !publication.status || !publication.url) throw new Error('Incomplete publication record');
}
for (const page of ['index.html', 'research.html', 'publications.html', 'cv.html', 'contact.html']) {
  const html = await readFile(path.join(root, page), 'utf8');
  if (!html.includes('name="viewport"') || !html.includes('<title>') || !html.includes('rel="canonical"')) throw new Error(`Missing page metadata: ${page}`);
}
console.log(`Validated ${files.length} public files, ${data.projects.length} projects and ${data.publications.length} publication records.`);
console.log('Only public/ is packaged. Local research files and review documents are excluded.');
