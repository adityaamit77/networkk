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
    const contentModule = await import(`../../content/pages/${slug}.json`);
    const content = contentModule.default;
    const seoResult = SEOSchema.safeParse(content.seo);
    if (!seoResult.success) {
      console.error(`Invalid SEO data for page: ${slug}`, seoResult.error.flatten());
      throw new Error(`Invalid SEO data for page: ${slug}`);
    }
    return { ...content, seo: seoResult.data } as PageContent;
  } catch (error: any) {
    if (error?.code === 'MODULE_NOT_FOUND') {
      console.error(`Failed to load page: ${slug}`, error);
      return null;
    }
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
      console.error(`Invalid SEO data for insight: ${slug}`, seoResult.error.flatten());
      throw new Error(`Invalid SEO data for insight: ${slug}`);
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
        { label: 'Services', href: '/services' },
        { label: 'Executive Search', href: '/executive-search' },
        { label: 'Leadership Hiring', href: '/leadership-hiring' },
        { label: 'Talent Advisory', href: '/talent-advisory' },
        { label: 'D&I Consulting', href: '/diversity-inclusion' },
        { label: 'Career Transition', href: '/career-transition' },
        { label: 'Industries', href: '/industries' },
        { label: 'Insights', href: '/insights' },
        { label: 'Our Approach', href: '/our-approach' },
        { label: 'Case Studies', href: '/case-studies' },
        { label: 'Team', href: '/team' },
        { label: 'Careers', href: '/careers' },
        { label: 'Contact', href: '/contact', cta: true }
      ],
      footer: [
        { label: 'Executive Search', href: '/services/executive-search' },
        { label: 'Leadership Hiring', href: '/services/leadership-hiring' },
        { label: 'Our Approach', href: '/our-approach' },
        { label: 'Success Stories', href: '/success-stories' },
        { label: 'Careers', href: '/careers' }
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
