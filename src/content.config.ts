import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Cluster/linking fields. Values per page live in docs/cluster-map.md.
const clusterFields = {
  cluster: z
    .enum(['repair', 'leaks', 'caps', 'animals', 'sweep-inspection', 'dryer-vent'])
    .optional(),
  role: z.enum(['pillar', 'hub', 'spoke']).optional(),
  hub: z.string().optional(), // slug of the parent hub or pillar
  related: z.array(z.string()).max(3).default([]), // cross-cluster links only
  hubAnchor: z.string().optional(), // link text other pages use when linking TO this page
  priority: z.number().default(100), // sibling ordering; lower shows first
};

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
    relatedPosts: z.array(z.string()).max(3).default([]), // blog slugs to link from this page
    ...clusterFields,
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
    ogImage: z.string().optional(), // falls back to the site default OG image
    faqs: faq.optional(),
    ...clusterFields,
  }),
});

export const collections = { services, blog };
