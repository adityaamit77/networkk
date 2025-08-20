import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://networkk.com',
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap(),
    mdx(),
  ],
  output: 'hybrid',
  build: {
    format: 'directory',
  },
  vite: {
    resolve: {
      alias: {
        '@': '/src',
        '@/components': '/src/components',
        '@/lib': '/src/lib',
      },
    },
  },
  experimental: {
    contentCollectionCache: true,
  },
});
