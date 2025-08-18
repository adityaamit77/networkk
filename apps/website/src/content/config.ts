import { defineCollection, z } from 'astro:content';

const insights = defineCollection({
  type: 'content',
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    excerpt: z.string(),
    image: z.string().optional(),
    author: z.string(),
    category: z.string(),
    tags: z.array(z.string()),
    featured: z.boolean().optional(),
    seo: z.object({
      title: z.string(),
      description: z.string(),
      canonical: z.string(),
      noindex: z.boolean().optional(),
      keywords: z.array(z.string())
    }).optional(),
    publishedAt: z.string(),
    createdAt: z.string().optional(),
    updatedAt: z.string()
  })
});

export const collections = { insights };
