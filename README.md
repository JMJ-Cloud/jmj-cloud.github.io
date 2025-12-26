# JMJ Cloud Website

Modern company website for JMJ Cloud - Oracle technology consulting company specializing in ERP Cloud, APEX, and E-Business Suite.

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

## 📁 Project Structure

```
jmjcloud-site/
├── src/
│   ├── components/       # Reusable Astro components
│   ├── content/
│   │   └── blog/        # Markdown blog posts
│   ├── layouts/         # Page layouts
│   ├── pages/           # Routes (index, about, resume, blog)
│   └── styles/          # Global CSS
├── public/
│   └── images/          # Static assets (logos, photos)
└── package.json
```

## 🎨 Features

- **Dark Technical Theme** - Cyan accents on dark backgrounds
- **Responsive Design** - Mobile-first with breakpoints at 768px, 1024px
- **Blog System** - Markdown-based content with syntax highlighting
- **Team Profiles** - LinkedIn integration for team photos
- **Project Showcase** - Portfolio/resume page with project cards
- **Service Cards** - Visual representation of core offerings

## 📝 Content Management

### Adding Blog Posts

Create a new markdown file in `src/content/blog/`:

```markdown
---
title: "Your Post Title"
date: 2024-12-26
author: "Your Name"
tags: ["APEX", "Oracle", "Cloud"]
summary: "Brief description of the post"
---

Your content here...
```

### Updating Projects

Edit the `latestProjects` array in `src/pages/index.astro` and/or the project cards in `src/pages/resume.astro`.

### Updating Team Members

Edit team member information in `src/pages/about.astro`.

## 🚢 Deployment

### Deploy to Netlify (Recommended)

1. Push this repository to GitHub
2. Go to [Netlify](https://app.netlify.com/)
3. Click "Add new site" → "Import an existing project"
4. Connect your GitHub repository
5. Build settings (auto-detected):
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click "Deploy site"

Your site will auto-deploy on every push to main!

### Deploy to Vercel

1. Push to GitHub
2. Go to [Vercel](https://vercel.com/)
3. Import your GitHub repository
4. Vercel auto-detects Astro settings
5. Click "Deploy"

### Deploy to Cloudflare Pages

1. Push to GitHub
2. Go to [Cloudflare Pages](https://pages.cloudflare.com/)
3. Connect your GitHub repository
4. Build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`
5. Click "Save and Deploy"

## 🛠️ Technologies

- **Astro 4.x** - Static site generator
- **TypeScript** - Type safety
- **Vanilla CSS** - Custom properties, no frameworks
- **Google Fonts** - JetBrains Mono, IBM Plex Sans

## 📄 License

Copyright © 2024 JMJ Cloud
