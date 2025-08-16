import { z } from 'zod';

// SEO Schema
export const SEOSchema = z.object({
  title: z.string().min(10).max(60),
  description: z.string().min(120).max(160),
  canonical: z.string().url(),
  noindex: z.boolean().default(false),
  image: z.string().url().optional(),
  keywords: z.array(z.string()).optional(),
});

// Block Layout Schema
export const LayoutSchema = z.object({
  colSpan: z.number().min(1).max(12).default(12),
  rowSpan: z.number().min(1).default(1),
  order: z.number().optional(),
});

// Base Block Schema
export const BaseBlockSchema = z.object({
  id: z.string(),
  type: z.string(),
  layout: LayoutSchema.optional(),
});

// Hero Block Schema
export const HeroSchema = z.object({
  title: z.string().min(10).max(90),
  subtitle: z.string().max(160).optional(),
  media: z.object({
    image: z.string().url(),
    alt: z.string().min(5),
    ratio: z.enum(['16:9', '4:3', '1:1']).default('16:9'),
  }).optional(),
  ctas: z.array(z.object({
    label: z.string().min(3),
    href: z.string(),
    variant: z.enum(['primary', 'secondary', 'outline']).default('primary'),
  })).max(2),
  backgroundType: z.enum(['image', 'gradient', 'solid']).default('solid'),
  textAlign: z.enum(['left', 'center', 'right']).default('center'),
});

// Tiles Grid Schema
export const TilesGridSchema = z.object({
  heading: z.string().min(5).max(50),
  description: z.string().max(200).optional(),
  items: z.array(z.object({
    title: z.string().max(30),
    description: z.string().max(120),
    icon: z.string().optional(),
    href: z.string(),
  })).min(3).max(12),
  columns: z.enum(['2', '3', '4']).default('3'),
});

// Testimonials Schema
export const TestimonialsSchema = z.object({
  heading: z.string().min(5).max(50),
  items: z.array(z.object({
    quote: z.string().min(50).max(300),
    author: z.object({
      name: z.string(),
      title: z.string(),
      company: z.string(),
      image: z.string().url().optional(),
    }),
  })).min(1).max(6),
  layout: z.enum(['grid', 'carousel']).default('grid'),
});

// Metrics Band Schema
export const MetricsBandSchema = z.object({
  heading: z.string().max(50).optional(),
  items: z.array(z.object({
    value: z.string().max(10),
    label: z.string().max(30),
    description: z.string().max(100).optional(),
  })).min(2).max(6),
});

// FAQ Schema
export const FAQSchema = z.object({
  heading: z.string().min(5).max(50),
  items: z.array(z.object({
    question: z.string().min(10).max(200),
    answer: z.string().min(20).max(500),
  })).min(3),
  jsonLd: z.boolean().default(true),
});

// CTA Schema
export const CTASchema = z.object({
  heading: z.string().min(10).max(60),
  description: z.string().max(200).optional(),
  primaryCta: z.object({
    label: z.string(),
    href: z.string(),
  }),
  secondaryCta: z.object({
    label: z.string(),
    href: z.string(),
  }).optional(),
  backgroundType: z.enum(['solid', 'gradient']).default('solid'),
});

// Block Instance Schema
export const BlockInstanceSchema = BaseBlockSchema.extend({
  type: z.enum([
    'Hero',
    'TilesGrid', 
    'Testimonials',
    'MetricsBand',
    'FAQ',
    'CTA',
    'InsightsPreview',
    'LogosStrip',
    'Timeline',
    'CaseStudyList',
  ]),
  props: z.any(), // Will be validated by specific block schema
  children: z.array(z.lazy(() => BlockInstanceSchema)).optional(),
});

// Page Schema
export const PageSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(10).max(90),
  status: z.enum(['draft', 'review', 'published', 'archived']).default('draft'),
  seo: SEOSchema,
  blocks: z.array(BlockInstanceSchema),
  publishedAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Insight Schema (for blog posts)
export const InsightSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(10).max(90),
  excerpt: z.string().min(50).max(200),
  content: z.string().min(100),
  author: z.object({
    name: z.string(),
    title: z.string().optional(),
    image: z.string().url().optional(),
  }),
  publishedAt: z.date(),
  category: z.string(),
  tags: z.array(z.string()),
  readingTime: z.number(),
  seo: SEOSchema,
  featuredImage: z.object({
    url: z.string().url(),
    alt: z.string(),
    caption: z.string().optional(),
  }).optional(),
});

// Export type inference
export type SEO = z.infer<typeof SEOSchema>;
export type BlockLayout = z.infer<typeof LayoutSchema>;
export type BlockInstance = z.infer<typeof BlockInstanceSchema>;
export type Page = z.infer<typeof PageSchema>;
export type Insight = z.infer<typeof InsightSchema>;

// Block Props Types
export type HeroProps = z.infer<typeof HeroSchema>;
export type TilesGridProps = z.infer<typeof TilesGridSchema>;
export type TestimonialsProps = z.infer<typeof TestimonialsSchema>;
export type MetricsBandProps = z.infer<typeof MetricsBandSchema>;
export type FAQProps = z.infer<typeof FAQSchema>;
export type CTAProps = z.infer<typeof CTASchema>;
