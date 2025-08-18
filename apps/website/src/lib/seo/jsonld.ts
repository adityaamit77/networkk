export interface OrganizationOptions {
  name: string;
  url: string;
  logo: string;
}

export function organization({ name, url, logo }: OrganizationOptions) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    logo,
  };
}

export interface WebsiteOptions {
  name: string;
  url: string;
  searchUrl?: string;
}

export function website({ name, url, searchUrl }: WebsiteOptions) {
  const data: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
  };
  if (searchUrl) {
    data.potentialAction = {
      '@type': 'SearchAction',
      target: `${searchUrl}{search_term_string}`,
      'query-input': 'required name=search_term_string',
    };
  }
  return data;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function breadcrumbList(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
