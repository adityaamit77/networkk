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
export const BlockInstanceSchemaBase: z.ZodType<any> = BaseBlockSchema.extend({
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
  blocks: z.array(z.lazy(() => BlockInstanceSchema)),
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

// ... existing code ...

// Timeline Schema for company history, methodology steps
export const TimelineSchema = z.object({
  heading: z.string().min(5).max(50),
  description: z.string().max(200).optional(),
  items: z.array(z.object({
    date: z.string(),
    title: z.string().max(50),
    description: z.string().max(300),
    icon: z.string().optional(),
    media: z.object({
      image: z.string().url().optional(),
      alt: z.string().min(5).optional(),
    }).optional(),
  })).min(2),
  layout: z.enum(['vertical', 'horizontal']).default('vertical'),
});

// Team Profiles Schema for leadership team
export const TeamProfilesSchema = z.object({
  heading: z.string().min(5).max(50),
  description: z.string().max(200).optional(),
  members: z.array(z.object({
    name: z.string(),
    title: z.string(),
    bio: z.string().max(500),
    image: z.string().url(),
    socialLinks: z.object({
      linkedin: z.string().url().optional(),
      twitter: z.string().url().optional(),
      email: z.string().email().optional(),
    }).optional(),
  })).min(1),
  layout: z.enum(['grid', 'list']).default('grid'),
});

// Process Steps Schema for methodology visualization
export const ProcessStepsSchema = z.object({
  heading: z.string().min(5).max(50),
  description: z.string().max(200).optional(),
  steps: z.array(z.object({
    number: z.number(),
    title: z.string().max(30),
    description: z.string().max(200),
    icon: z.string().optional(),
  })).min(3).max(8),
  layout: z.enum(['horizontal', 'vertical']).default('horizontal'),
});

// Case Study Schema
export const CaseStudySchema = z.object({
  heading: z.string().min(5).max(50),
  description: z.string().max(200).optional(),
  studies: z.array(z.object({
    title: z.string().max(60),
    industry: z.string(),
    challenge: z.string().max(300),
    solution: z.string().max(300),
    results: z.string().max(300),
    testimonial: z.object({
      quote: z.string().max(200).optional(),
      author: z.string().optional(),
      title: z.string().optional(),
    }).optional(),
    image: z.string().url().optional(),
  })).min(1),
  layout: z.enum(['grid', 'list', 'carousel']).default('grid'),
});

// Contact Form Schema
export const ContactFormSchema = z.object({
  heading: z.string().min(5).max(50),
  description: z.string().max(200).optional(),
  fields: z.array(z.object({
    name: z.string(),
    label: z.string(),
    type: z.enum(['text', 'email', 'tel', 'textarea', 'select', 'checkbox']),
    required: z.boolean().default(false),
    options: z.array(z.object({
      label: z.string(),
      value: z.string(),
    })).optional(),
  })),
  submitLabel: z.string().default('Submit'),
  successMessage: z.string().default('Thank you for your message. We will get back to you shortly.'),
});

// Location Map Schema
export const LocationMapSchema = z.object({
  heading: z.string().min(5).max(50).optional(),
  locations: z.array(z.object({
    name: z.string(),
    address: z.string(),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number(),
    }),
    phone: z.string().optional(),
    email: z.string().email().optional(),
  })).min(1),
  mapHeight: z.string().default('400px'),
});

// Events List Schema
export const EventsListSchema = z.object({
  heading: z.string().min(5).max(50),
  description: z.string().max(200).optional(),
  events: z.array(z.object({
    title: z.string().max(100),
    date: z.string(),
    time: z.string().optional(),
    location: z.string().optional(),
    description: z.string().max(300),
    speakers: z.array(z.object({
      name: z.string(),
      title: z.string().optional(),
      image: z.string().url().optional(),
    })).optional(),
    registrationLink: z.string().url().optional(),
    isPast: z.boolean().default(false),
  })),
  showPastEvents: z.boolean().default(false),
});

// Logos Strip Schema
export const LogosStripSchema = z.object({
  heading: z.string().min(5).max(50).optional(),
  description: z.string().max(200).optional(),
  logos: z.array(z.object({
    name: z.string(),
    image: z.string().url(),
    url: z.string().url().optional(),
  })).min(3),
  grayscale: z.boolean().default(true),
});

// Filterable Grid Schema
export const FilterableGridSchema = z.object({
  heading: z.string().min(5).max(50),
  description: z.string().max(200).optional(),
  filters: z.array(z.object({
    name: z.string(),
    options: z.array(z.object({
      label: z.string(),
      value: z.string(),
    })),
  })).optional(),
  items: z.array(z.object({
    title: z.string().max(100),
    description: z.string().max(200),
    image: z.string().url().optional(),
    link: z.string().url(),
    tags: z.array(z.string()).optional(),
    category: z.string().optional(),
  })).min(1),
  layout: z.enum(['grid', 'list']).default('grid'),
  itemsPerPage: z.number().default(9),
});

// Update BlockInstanceSchema to include new block types
export const BlockInstanceSchema: z.ZodType = BaseBlockSchema.extend({
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
    'TeamProfiles',
    'ProcessSteps',
    'CaseStudy',
    'ContactForm',
    'LocationMap',
    'EventsList',
    'FilterableGrid'
  ]),
  props: z.any(), // Will be validated by specific block schema
  children: z.array(z.lazy(() => BlockInstanceSchema)).optional(),
});

// ... existing code ...

// Add new types exports
export type TimelineProps = z.infer<typeof TimelineSchema>;
export type TeamProfilesProps = z.infer<typeof TeamProfilesSchema>;
export type ProcessStepsProps = z.infer<typeof ProcessStepsSchema>;
export type CaseStudyProps = z.infer<typeof CaseStudySchema>;
export type ContactFormProps = z.infer<typeof ContactFormSchema>;
export type LocationMapProps = z.infer<typeof LocationMapSchema>;
export type EventsListProps = z.infer<typeof EventsListSchema>;
export type LogosStripProps = z.infer<typeof LogosStripSchema>;
export type FilterableGridProps = z.infer<typeof FilterableGridSchema>;
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
