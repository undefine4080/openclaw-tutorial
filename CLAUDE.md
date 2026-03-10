# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a bilingual (English/Chinese) tutorial website for OpenClaw built with Astro. The site uses Astro's Content Collections to manage Markdown content in two languages with automatic routing and language switching.

## Development Commands

```bash
# Start development server (http://localhost:4321)
npm run dev

# Build for production (includes type checking and search index generation)
npm run build

# Preview production build locally
npm run preview

# Type check only
astro check
```

**Note:** Node.js >= 22 is required (see `package.json` engines field).

## Architecture

### Bilingual Content Structure

The site uses two parallel content collections defined in `src/content/config.ts`:

- **`posts`** - English tutorials
- **`posts-zh-cn`** - Chinese (Simplified) tutorials

Both collections use the same Zod schema, ensuring consistent frontmatter across languages. Each collection has its own dynamic route:
- English: `src/pages/posts/[slug].astro`
- Chinese: `src/pages/zh-cn/posts/[slug].astro`

### Content Schema

All posts must have this frontmatter (see `src/content/config.ts`):

```yaml
title: "Post Title"
description: "Brief description"
pubDate: YYYY-MM-DD
lastUpdated: YYYY-MM-DD  # optional
tags: ["tag1", "tag2"]
difficulty: "beginner" | "intermediate" | "advanced"
estimatedTime: "5 minutes"
prerequisites: ["Prereq 1", "Prereq 2"]
alternates:
  zhCN: "/zh-cn/posts/slug/"  # For English posts only
  # or
  en: "/posts/slug/"  # For Chinese posts only
```

**Critical:** The `alternates` field links translations. English posts reference their Chinese version via `zhCN`, and Chinese posts reference English via `en`.

### Language Switching

The `LangSwitch` component (`src/components/LangSwitch.astro`) handles language switching:

- Accepts `currentPath` prop (full path including `/zh-cn` prefix if Chinese)
- Automatically calculates the alternate language path
- Simple string manipulation: adds/removes `/zh-cn` prefix
- Active state determined by path prefix check

**Integration pattern:**
```astro
<LangSwitch currentPath={Astro.url.pathname} />
```

### Routing Pattern

Routes are organized by language:
```
src/pages/
├── index.astro              # English homepage
├── posts/
│   ├── index.astro          # English post list
│   └── [slug].astro         # English individual posts
└── zh-cn/
    ├── index.astro          # Chinese homepage
    └── posts/
        ├── index.astro      # Chinese post list
        └── [slug].astro     # Chinese individual posts
```

Both `[slug].astro` files are nearly identical except for:
- Collection name in `getCollection()` call
- Date locale formatting (`en-US` vs `zh-CN`)
- "All Tutorials" link language

### Content Collections

Posts are loaded using Astro's `getCollection()`:

```javascript
// English posts
const posts = await getCollection('posts');

// Chinese posts
const posts = await getCollection('posts-zh-cn');
```

The `getStaticPaths()` function in `[slug].astro` maps posts to routes:
```javascript
export async function getStaticPaths() {
  const posts = await getCollection('posts');
  return posts.map(post => ({
    params: { slug: post.id.replace('.md', '') },
    props: post,
  }));
}
```

## Build Process

The build script runs in sequence:
1. `astro check` - TypeScript/type validation
2. `astro build` - Generate static site to `dist/`
3. `pagefind --site dist` - Build search index (run automatically via `postbuild`)

**Output:** The `dist/` directory contains the complete static site ready for deployment.

## Adding New Content

When adding new tutorial posts:

1. Create Markdown file in appropriate collection (`src/content/posts/` or `src/content/posts-zh-cn/`)
2. Include all required frontmatter fields
3. Add `alternates` reference to the translation (if exists)
4. Content will be automatically routed at build time

**For bilingual content:** Always create both English and Chinese versions with cross-referenced `alternates` paths.

## Sitemap Integration

The sitemap integration is installed but commented out in `astro.config.mjs`. To enable:
1. Uncomment the import: `import sitemap from '@astrojs/sitemap';`
2. Uncomment the `integrations` array in config

## Deployment Target

Configured for Cloudflare Pages:
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `NODE_VERSION=22`

The `site` configuration in `astro.config.mjs` is set to `https://clawtutorial.net`.
