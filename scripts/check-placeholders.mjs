// Scans the built site for leftover "[PLACEHOLDER]" copy.
// Warns always; fails the build only for Netlify production deploys.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const found = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(html|xml|json|txt)$/.test(name) && readFileSync(p, 'utf8').includes('[PLACEHOLDER]')) found.push(p);
  }
};
walk('dist');

if (found.length) {
  console.warn(`\n⚠ Placeholder copy still present in ${found.length} built file(s):\n  ${found.join('\n  ')}\n`);
  if (process.env.CONTEXT === 'production') {
    console.error('Refusing to ship placeholder copy to production.');
    process.exit(1);
  }
}
