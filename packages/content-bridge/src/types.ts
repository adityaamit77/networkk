// Re-export all schemas and types
export * from './blockSchemas.js';

// Content source interface
export interface ContentSource {
  getPage(slug: string): Promise<any>;
  getPages(): Promise<any[]>;
  getInsight(slug: string): Promise<any>;
  getInsights(options?: { limit?: number; offset?: number; category?: string }): Promise<any>;
}

// Preview context
export interface PreviewContext {
  token?: string;
  enabled: boolean;
  timestamp?: number;
}

// Navigation item
export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
  external?: boolean;
}

// Site configuration
export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  url: string;
  logo: string;
  favicon: string;
  navigation: {
    header: NavItem[];
    footer: NavItem[];
  };
  social: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  analytics: {
    gtag?: string;
    gtm?: string;
  };
}
