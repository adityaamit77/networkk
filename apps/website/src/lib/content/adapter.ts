import type { BlockInstance } from '@networkk/content-bridge';

// Simplified content loading for Phase 1
export async function loadPageBySlug(slug: string) {
  try {
    const content = await import(`../../content/pages/${slug}.json`);
    return content.default;
  } catch (error) {
    console.error(`Failed to load page: ${slug}`, error);
    return null;
  }
}

export async function loadInsightBySlug(slug: string) {
  try {
    const content = await import(`../../content/insights/${slug}.json`);
    return content.default;
  } catch (error) {
    console.error(`Failed to load insight: ${slug}`, error);
    return null;
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
        { label: 'Services', href: '/services/executive-search' },
        { label: 'Industries', href: '/industries' },
        { label: 'Insights', href: '/insights' },
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' }
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
