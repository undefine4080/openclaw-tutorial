# ClawTutorial.net 🦞

OpenClaw Tutorials & Troubleshooting - Run OpenClaw in 5 minutes. Fix common issues in 30 seconds.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📋 Requirements

- Node.js >= 22
- npm or pnpm

## 🛠️ Tech Stack

- **Framework**: Astro
- **Deployment**: Cloudflare Pages
- **Search**: Pagefind (local search)
- **Analytics**: Google Analytics (optional)

## 📁 Project Structure

```
src/
├── content/          # Markdown content
│   ├── posts/       # English posts
│   └── posts-zh-cn/ # Chinese posts
├── layouts/         # Page layouts
├── pages/          # Route pages
└── components/     # Reusable components
public/             # Static assets
```

## 🎯 Features

- ✅ Bilingual (English & Chinese)
- ✅ SEO optimized with sitemap
- ✅ Fast static generation
- ✅ Mobile responsive
- ✅ Dark mode support (coming soon)
- ✅ Search functionality (coming soon)

## 📝 Content Guidelines

All content follows this structure:

1. **TL;DR** - 30-second summary
2. **Requirements** - Prerequisites
3. **Steps** - Step-by-step instructions
4. **Expected Output** - Success criteria
5. **Common Issues** - Troubleshooting
6. **Next Steps** - Internal links

## 🚢 Deployment

This site is designed for Cloudflare Pages:

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variable: `NODE_VERSION=22`

## 📄 License

MIT License - feel free to use this as a template for your own tutorial sites.

## 🙏 Acknowledgments

- Built with [Astro](https://astro.build)
- Inspired by [OpenClaw](https://github.com/openclaw/openclaw)
- Not officially affiliated with the OpenClaw project

---

**Note**: This is an independent tutorial resource. For official OpenClaw documentation, visit the [GitHub repository](https://github.com/openclaw/openclaw).