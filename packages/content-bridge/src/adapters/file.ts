import type { ContentSource } from '../types.js';

// File-based content source (reads from JSON/MDX files)
export class FileContentSource implements ContentSource {
  constructor(private contentPath: string) {}

  async getPage(slug: string): Promise<any> {
    try {
      const { readFile } = await import('fs/promises');
      const { join } = await import('path');
      
      const filePath = join(this.contentPath, 'pages', `${slug}.json`);
      const content = await readFile(filePath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      console.error(`Failed to load page: ${slug}`, error);
      return null;
    }
  }

  async getPages(): Promise<any[]> {
    try {
      const { readdir, readFile } = await import('fs/promises');
      const { join } = await import('path');
      
      const pagesDir = join(this.contentPath, 'pages');
      const files = await readdir(pagesDir);
      const jsonFiles = files.filter(f => f.endsWith('.json'));
      
      const pages = await Promise.all(
        jsonFiles.map(async (file) => {
          const content = await readFile(join(pagesDir, file), 'utf-8');
          return JSON.parse(content);
        })
      );
      
      return pages;
    } catch (error) {
      console.error('Failed to load pages', error);
      return [];
    }
  }

  async getInsight(slug: string): Promise<any> {
    try {
      const { readFile } = await import('fs/promises');
      const { join } = await import('path');
      
      const filePath = join(this.contentPath, 'insights', `${slug}.json`);
      const content = await readFile(filePath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      console.error(`Failed to load insight: ${slug}`, error);
      return null;
    }
  }

  async getInsights(options: { limit?: number; offset?: number; category?: string } = {}): Promise<any> {
    try {
      const { readdir, readFile } = await import('fs/promises');
      const { join } = await import('path');
      
      const insightsDir = join(this.contentPath, 'insights');
      const files = await readdir(insightsDir);
      const jsonFiles = files.filter(f => f.endsWith('.json'));
      
      const insights = await Promise.all(
        jsonFiles.map(async (file) => {
          const content = await readFile(join(insightsDir, file), 'utf-8');
          return JSON.parse(content);
        })
      );
      
      // Filter by category if specified
      let filtered = insights;
      if (options.category) {
        filtered = insights.filter(insight => 
          insight.category?.toLowerCase() === options.category?.toLowerCase()
        );
      }
      
      // Sort by published date (newest first)
      filtered.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      
      // Apply pagination
      const offset = options.offset || 0;
      const limit = options.limit || filtered.length;
      const items = filtered.slice(offset, offset + limit);
      
      return {
        items,
        total: filtered.length,
        hasMore: offset + limit < filtered.length
      };
    } catch (error) {
      console.error('Failed to load insights', error);
      return { items: [], total: 0, hasMore: false };
    }
  }
}
