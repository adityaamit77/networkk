import type { BlockInstance } from '@networkk/content-bridge';
import { SEOSchema } from '@networkk/content-bridge';
import { z } from 'zod';

export type SEO = z.infer<typeof SEOSchema>;
export interface PageBlock {
  id: string;
  type: string;
  props: any;
  layout?: any;
  children?: any[];
}

export interface PageContent {
  slug: string;
  title: string;
  status?: string;
  seo: SEO;
  blocks: PageBlock[];
  [key: string]: unknown;
}

export interface InsightContent {
  slug: string;
  title: string;
  excerpt?: string;
  content?: string;
  seo: SEO;
  [key: string]: unknown;
}

// Simplified content loading for Phase 1
export async function loadPageBySlug(slug: string): Promise<PageContent | null> {
  try {
    const modules = import.meta.glob('../../content/pages/**/*.json', { eager: true }) as Record<string, any>;
    const match = Object.entries(modules).find(([path]) =>
      path.replace('../../content/pages/', '').replace('.json', '') === slug
    );

    if (!match) {
      console.error(`Failed to load page: ${slug}`, 'Module not found');
      return null;
    }

    const [, module] = match;
    const content = module.default || module;
    const seoResult = SEOSchema.safeParse(content.seo);
    if (!seoResult.success) {
      // Don't fail the whole build for invalid/missing SEO frontmatter.
      // Log details and synthesize a minimal fallback SEO object so pages can render.
      console.warn(`Invalid SEO data for page: ${slug}`, seoResult.error.flatten());
      const site = await getSiteConfig();
      const fallbackSeo: Partial<SEO> = {
        title: content.title ? `${content.title} - ${site.name}` : site.name,
        description: (content.excerpt ?? site.description ?? '').toString(),
        canonical: `${site.url.replace(/\/$/, '')}/${slug}/`,
        noindex: false,
        image: undefined,
        keywords: (content.seo && (content.seo as any).keywords) ?? []
      };
      return { ...content, seo: { ...fallbackSeo, ...(content.seo || {}) } as SEO } as PageContent;
    }
    return { ...content, seo: seoResult.data } as PageContent;
  } catch (error) {
    console.error(`Failed to load page: ${slug}`, error);
    throw error;
  }
}

export async function loadInsightBySlug(slug: string): Promise<InsightContent | null> {
  try {
    const contentModule = await import(`../../content/insights/${slug}.json`);
    const content = contentModule.default;
    const seoResult = SEOSchema.safeParse(content.seo);
    if (!seoResult.success) {
      console.warn(`Invalid SEO data for insight: ${slug}`, seoResult.error.flatten());
      const site = await getSiteConfig();
      const fallbackSeo: Partial<SEO> = {
        title: content.title ? `${content.title} - ${site.name}` : site.name,
        description: (content.excerpt ?? site.description ?? '').toString(),
        canonical: `${site.url.replace(/\/$/, '')}/insights/${slug}/`,
        noindex: false,
        image: undefined,
        keywords: (content.seo && (content.seo as any).keywords) ?? []
      };
      return { ...content, seo: { ...fallbackSeo, ...(content.seo || {}) } as SEO } as InsightContent;
    }
    return { ...content, seo: seoResult.data } as InsightContent;
  } catch (error: any) {
    if (error?.code === 'MODULE_NOT_FOUND') {
      console.error(`Failed to load insight: ${slug}`, error);
      return null;
    }
    console.error(`Failed to load insight: ${slug}`, error);
    throw error;
  }
}

// Validate block data against schemas
export function validateBlockData(block: BlockInstance): boolean {
  // TODO: Add Zod validation here
  // For now, just basic validation
  return !!(block.id && block.type && block.props);
}

// Get site configuration
export async function getSiteConfig() {
  return {
    name: 'Networkk',
    tagline: 'Executive Search & Leadership Hiring Experts',
    description: 'Transform your business with top-tier executive talent',
    url: 'https://networkk.com',
    logo: '/logo.png',
    favicon: '/favicon.svg',
    navigation: {
      header: [
        { label: 'Home', href: '/' },
        { label: 'Services', href: '/services' },
        { label: 'Industries', href: '/industries' },
        { label: 'Insights', href: '/insights' },
        { label: 'Success Stories', href: '/success-stories' },
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact', cta: true }
      ],
      footer: [
        { label: 'Executive Search', href: '/services/executive-search' },
        { label: 'Leadership Hiring', href: '/services/leadership-hiring' },
        { label: 'Talent Advisory', href: '/services/talent-advisory' },
        { label: 'Career Transition', href: '/services/career-transition' },
        { label: 'Our Approach', href: '/our-approach' },
        { label: 'Why Choose Us', href: '/why-choose-us' },
        { label: 'Events', href: '/events' },
        { label: 'Partner With Us', href: '/partner-with-us' },
        { label: 'Careers', href: '/careers' },
        { label: 'Privacy', href: '/privacy' },
        { label: 'Terms', href: '/terms' },
        { label: 'Sitemap', href: '/sitemap' }
      ]
    },
    social: {
      linkedin: 'https://linkedin.com/company/networkk',
      twitter: 'https://twitter.com/networkk'
    },
    contact: {
      email: 'hello@networkk.com',
      phone: '+91 22 1234 5678',
      address: '123 Business District, Mumbai 400001, India'
    },
    analytics: {
      gtag: 'G-XXXXXXXXXX'
    }
  };
}
