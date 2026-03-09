import { defineConfig } from 'astro/config';
// import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://clawtutorial.net',
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