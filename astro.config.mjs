import { defineConfig } from 'astro/config';
// import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://openclawtutorial.online',
  markdown: {
    remarkPlugins: [],
    rehypePlugins: [],
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
  // integrations: [
  //   sitemap({
  //     changefreq: 'weekly',
  //     priority: 0.7,
  //     lastmod: new Date(),
  //   }),
  // ],
  vite: {
    build: {
      rollupOptions: {
        output: {
          assetFileNames: 'assets/[hash][extname]',
        },
      },
    },
  },
  experimental: {
    clientPrerender: true,
  },
});