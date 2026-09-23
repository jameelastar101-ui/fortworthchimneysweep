import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const faq = z.array(z.object({ question: z.string(), answer: z.string() }));

// Entry ids come from the filename, so `chimney-repair-fort-worth-tx.md` renders at
// /chimney-repair-fort-worth-tx/. `slug` is kept in frontmatter as a guard: pages
// assert it matches the URL inventory in astro-migration-brief.md.
const services = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    metaDescription: z.string(),
    ogImage: z.string(),
    phone: z.string(),
    faqs: faq.optional(), // drives both the FAQ accordion and FAQPage schema
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    date: z.coerce.date(),
    metaDescription: z.string(),
    faqs: faq.optional(),
  }),
});

export const collections = { services, blog };
