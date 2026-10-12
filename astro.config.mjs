// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://fortworthchimneysweep.com',
  output: 'static',
  // WordPress URLs all end in a trailing slash — keep them identical.
  trailingSlash: 'always',
  build: { format: 'directory' },
  // mdx() lets a blog post embed <OptionalImage> (src/components/OptionalImage.astro)
  // so an image slot can render only when its file exists on disk — plain .md
  // has no way to run that existsSync check. Existing posts stay .md; this is
  // additive, not a behavior change for them.
  integrations: [sitemap(), mdx()],
  vite: {
    plugins: [tailwindcss()],
  },
});
