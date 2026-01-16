# Contributing to JMJ Cloud Website

This guide explains how to work with the JMJ Cloud website codebase and deploy changes.

## 🚀 Quick Start

### Prerequisites

- Node.js 20 or higher
- npm (comes with Node.js)
- Git

### Initial Setup

1. Clone the repository:
```bash
git clone https://github.com/JMJ-Cloud/jmj-cloud.github.io.git
cd jmj-cloud.github.io
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The site will be available at `http://localhost:4321` (or the next available port).

## 📝 Making Changes

### Development Workflow

1. **Create a new branch** (optional, but recommended for significant changes):
```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes** and test locally with `npm run dev`

3. **Build and verify**:
```bash
npm run build
```
This creates a production build in the `dist/` folder.

### Common Tasks

#### Adding a New Project

1. Create a new markdown file in `src/content/projects/`:
```bash
touch src/content/projects/your-project-slug.md
```

2. Add frontmatter and content:
```markdown
---
title: "Your Project Title"
status: "Active"  # or "Completed"
year: 2024
summary: "Brief project description"
technologies:
  - "Technology 1"
  - "Technology 2"
industry: "Industry Name"
metrics:
  - "Key metric 1"
  - "Key metric 2"
featured: true  # Shows on home page if true
order: 1  # Lower numbers appear first (for featured projects)
---

## Project Overview
Your content here...
```

3. The project will automatically appear in `/portfolio` and on the home page if `featured: true`

#### Updating Team Information

Edit `src/pages/about.astro` to update team member bios, photos, and details.

#### Adding Blog Posts

1. Create a new markdown file in `src/content/blog/`:
```bash
touch src/content/blog/your-post-slug.md
```

2. Add frontmatter and content:
```markdown
---
title: "Your Blog Post Title"
date: 2024-12-30
author: "Author Name"
tags: ["tag1", "tag2"]
summary: "Brief post description"
---

Your blog post content here...
```

## 🚢 Deployment

### Automatic Deployment (Recommended)

**The site automatically deploys to GitHub Pages when you push to the `main` branch.**

1. **Commit your changes**:
```bash
git add .
git commit -m "Description of your changes"
```

2. **Push to GitHub**:
```bash
git push origin main
```

3. **Wait for deployment** (usually 1-2 minutes):
   - GitHub Actions will automatically build and deploy your site
   - Monitor progress at: https://github.com/JMJ-Cloud/jmj-cloud.github.io/actions
   - Live site: https://jmjcloud.com

### Deployment Details

- **Build Process**: GitHub Actions workflow (`.github/workflows/deploy.yml`)
- **Build Command**: `npm run build`
- **Output Directory**: `dist/`
- **Deployment Method**: GitHub Pages with GitHub Actions
- **Deployment Time**: ~1-2 minutes after push

### Verifying Deployment

1. Check GitHub Actions: https://github.com/JMJ-Cloud/jmj-cloud.github.io/actions
2. Look for the latest workflow run
3. Green checkmark = successful deployment
4. Visit https://jmjcloud.com to see your changes live

## 🔧 Project Structure

```
jmjcloud-site/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment workflow
├── public/                     # Static assets (images, favicon, etc.)
├── src/
│   ├── components/             # Reusable Astro components
│   ├── content/
│   │   ├── blog/              # Blog posts (Markdown)
│   │   ├── projects/          # Project case studies (Markdown)
│   │   └── config.ts          # Content collections schema
│   ├── layouts/               # Page layouts
│   ├── pages/                 # Routes (index, about, portfolio, etc.)
│   └── styles/                # Global CSS
├── astro.config.mjs           # Astro configuration
├── package.json               # Dependencies and scripts
└── tsconfig.json              # TypeScript configuration
```

## 📚 Key Technologies

- **Astro 5.16.6** - Static site generator
- **TypeScript** - Type safety
- **Vanilla CSS** - Custom properties, no frameworks
- **GitHub Pages** - Hosting
- **GitHub Actions** - CI/CD

## 🎨 Code Style

- Use meaningful variable and function names
- Follow existing code formatting patterns
- Keep components small and focused
- Write semantic HTML
- Use CSS custom properties for theming

### Writing Style: Avoid Em Dashes

**Do not use em dashes (—) in content.** Replace them with appropriate punctuation:

| Instead of | Use | Example |
|------------|-----|---------|
| `**Bold** — description` | `**Bold:** description` | **REST APIs:** Synchronous calls for real-time operations |
| `word — elaboration` | `word, elaboration` | The system processes data, including validation and transformation |
| `concept — list follows` | `concept:` | Key features: speed, reliability, security |
| `thought — separate idea` | `thought. Separate idea` | The build completed. Deployment followed automatically |
| `aside — parenthetical` | `aside (parenthetical)` | Oracle ERP Cloud (formerly Fusion Applications) |

**Why?** Em dashes render inconsistently across devices and can appear as garbled characters in some email clients and RSS readers. Standard punctuation ensures reliable display everywhere.

## 🐛 Troubleshooting

### Build Fails

1. Clear node modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

2. Check for TypeScript errors:
```bash
npm run build
```

### Dev Server Won't Start

- Check if port 4321 is already in use
- Astro will automatically try the next available port
- Look for the actual port in the terminal output

### Changes Not Appearing on Live Site

1. Verify your changes were committed and pushed to `main`
2. Check GitHub Actions for deployment status
3. Wait 1-2 minutes for deployment to complete
4. Hard refresh your browser (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)

## 🤝 Git Commit Messages

Use clear, descriptive commit messages:

- `feat: Add new project case study`
- `fix: Correct team member bio`
- `docs: Update README with deployment instructions`
- `style: Improve mobile navigation layout`
- `refactor: Simplify project card component`

## 📞 Questions?

For questions or issues:
- Review this guide
- Check existing issues on GitHub
- Contact the team at info@jmjcloud.com
