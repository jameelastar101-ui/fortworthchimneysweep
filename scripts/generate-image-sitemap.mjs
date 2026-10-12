// Builds dist/image-sitemap.xml from the built HTML output. @astrojs/sitemap
// (used for sitemap-index.xml / sitemap-0.xml) has no image-extension support,
// so this is the "dedicated image sitemap" the migration brief allows for as
// the alternative (docs/astro-migration-brief.md, Image migration step 5).
//
// Scans every built page for <img src="/images/..."> — real content images
// placed in public/images/ — and groups them by the page's own canonical URL.
// astro:assets output (hashed /_astro/... paths, e.g. the header logo) is
// deliberately excluded: those hashes change per build and aren't meant to be
// indexed as standalone images.
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const SITE = 'https://fortworthchimneysweep.com';
const DIST = 'dist';

const htmlFiles = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (name.endsWith('.html')) htmlFiles.push(p);
  }
};
walk(DIST);

const canonicalRe = /<link rel="canonical" href="([^"]+)"/;
const imgRe = /<img\b[^>]*\bsrc="(\/images\/[^"]+)"[^>]*>/g;
const altRe = /\balt="([^"]*)"/;

const xmlEscape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const urls = [];
for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  const canonicalMatch = html.match(canonicalRe);
  if (!canonicalMatch) continue;
  const canonical = canonicalMatch[1];

  const images = [];
  let m;
  while ((m = imgRe.exec(html))) {
    const src = m[1];
    const alt = m[0].match(altRe)?.[1] ?? '';
    if (!images.some((i) => i.src === src)) images.push({ src, alt });
  }
  if (images.length > 0) urls.push({ canonical, images });
}

const body = urls
  .map(
    ({ canonical, images }) => `  <url>
    <loc>${xmlEscape(canonical)}</loc>
${images
  .map(
    (img) => `    <image:image>
      <image:loc>${xmlEscape(new URL(img.src, SITE).href)}</image:loc>${
      img.alt ? `\n      <image:title>${xmlEscape(img.alt)}</image:title>` : ''
    }
    </image:image>`,
  )
  .join('\n')}
  </url>`,
  )
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${body}
</urlset>
`;

writeFileSync(join(DIST, 'image-sitemap.xml'), xml);
console.log(`Wrote dist/image-sitemap.xml with ${urls.length} page(s) / ${urls.reduce((n, u) => n + u.images.length, 0)} image(s).`);
