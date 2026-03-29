import { defineConfig } from 'astro/config';
import cloudflare from "@astrojs/cloudflare";
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
  //     i18n: {
  //       defaultLocale: 'en',
  //       locales: {
  //         en: 'en-US',
  //         'zh-cn': 'zh-CN',
  //       },
  //     },
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

  output: "hybrid",
  adapter: cloudflare()
});