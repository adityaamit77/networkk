import type { SEO } from '@networkk/content-bridge';

export interface SEOProps extends SEO {
  titleTemplate?: string;
}

export function generateTitle(title: string, template?: string): string {
  if (!template) return title;
  return template.replace('%s', title);
}

export function generateMetaTags(seo: SEOProps) {
  const finalTitle = generateTitle(seo.title, seo.titleTemplate);
  
  const tags = [
    // Basic meta tags
    { name: 'description', content: seo.description },
    { name: 'robots', content: seo.noindex ? 'noindex,follow' : 'index,follow' },
    
    // Open Graph
    { property: 'og:title', content: finalTitle },
    { property: 'og:description', content: seo.description },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: seo.canonical },
    
    // Twitter
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: finalTitle },
    { name: 'twitter:description', content: seo.description },
  ];
  
  // Add image if provided
  if (seo.image) {
    tags.push(
      { property: 'og:image', content: seo.image },
      { name: 'twitter:image', content: seo.image }
    );
  }
  
  // Add keywords if provided
  if (seo.keywords?.length) {
    tags.push({ name: 'keywords', content: seo.keywords.join(', ') });
  }
  
  return tags;
}

export function generateJsonLd(type: string, data: Record<string, any>) {
  const baseData = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };
  
  return JSON.stringify(baseData, null, 0);
}

// Common JSON-LD schemas
export function createOrganizationSchema() {
  return generateJsonLd('Organization', {
    name: 'Networkk',
    url: 'https://networkk.com',
    logo: 'https://networkk.com/logo.png',
    description: 'Leading executive search and talent advisory firm',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-0123',
      contactType: 'customer service',
      email: 'hello@networkk.com'
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Business Ave',
      addressLocality: 'Mumbai',
      addressRegion: 'MH',
      postalCode: '400001',
      addressCountry: 'IN'
    },
    sameAs: [
      'https://linkedin.com/company/networkk',
      'https://twitter.com/networkk'
    ]
  });
}

export function createWebsiteSchema() {
  return generateJsonLd('WebSite', {
    name: 'Networkk',
    url: 'https://networkk.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://networkk.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  });
}

export function createBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return generateJsonLd('BreadcrumbList', {
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  });
}

export function createArticleSchema(article: {
  headline: string;
  description: string;
  author: string;
  datePublished: string;
  dateModified?: string;
  url: string;
  image?: string;
}) {
  return generateJsonLd('Article', {
    headline: article.headline,
    description: article.description,
    author: {
      '@type': 'Person',
      name: article.author
    },
    publisher: {
      '@type': 'Organization',
      name: 'Networkk',
      logo: {
        '@type': 'ImageObject',
        url: 'https://networkk.com/logo.png'
      }
    },
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    url: article.url,
    image: article.image,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url
    }
  });
}

export function createFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return generateJsonLd('FAQPage', {
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  });
}
