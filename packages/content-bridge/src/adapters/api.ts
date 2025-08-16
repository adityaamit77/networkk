import type { ContentSource } from '../types.js';

// API-based content source (reads from CMS API)
export class ApiContentSource implements ContentSource {
  constructor(
    private baseUrl: string,
    private apiKey?: string
  ) {}

  private async fetchApi(endpoint: string): Promise<any> {
    const url = `${this.baseUrl}/api/${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }
    
    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  }

  async getPage(slug: string): Promise<any> {
    try {
      return await this.fetchApi(`pages/${slug}`);
    } catch (error) {
      console.error(`Failed to load page from API: ${slug}`, error);
      return null;
    }
  }

  async getPages(): Promise<any[]> {
    try {
      const response = await this.fetchApi('pages');
      return response.items || [];
    } catch (error) {
      console.error('Failed to load pages from API', error);
      return [];
    }
  }

  async getInsight(slug: string): Promise<any> {
    try {
      return await this.fetchApi(`insights/${slug}`);
    } catch (error) {
      console.error(`Failed to load insight from API: ${slug}`, error);
      return null;
    }
  }

  async getInsights(options: { limit?: number; offset?: number; category?: string } = {}): Promise<any> {
    try {
      const params = new URLSearchParams();
      
      if (options.limit) params.set('limit', options.limit.toString());
      if (options.offset) params.set('offset', options.offset.toString());
      if (options.category) params.set('category', options.category);
      
      const endpoint = `insights${params.toString() ? '?' + params.toString() : ''}`;
      return await this.fetchApi(endpoint);
    } catch (error) {
      console.error('Failed to load insights from API', error);
      return { items: [], total: 0, hasMore: false };
    }
  }
}
