# JMJ Cloud Website Redesign — Claude Code Specification

## Project Overview

Build a new website for JMJ Cloud, an Oracle technology consulting company. This is Phase 1: Home page and Blog functionality only.

**Company tagline:** "Oracle Technology Delivered"

**Target:** Local development for stakeholder review

---

## Technical Stack

- **Framework:** Astro 4.x
- **Styling:** Vanilla CSS with CSS custom properties (no Tailwind)
- **Content:** Astro Content Collections for blog posts (Markdown)
- **JavaScript:** Minimal, only where needed for interactions
- **Fonts:** Google Fonts (loaded locally for performance)

---

## Design Direction

### Aesthetic: Dark Technical

Think terminal aesthetics meets modern design agency. The look should feel like it was built by people who write PL/SQL for a living but have taste.

**Key characteristics:**
- Dark background (near-black, not pure #000)
- Monospace fonts for headings and accents
- Code-inspired visual elements (subtle grid lines, terminal-style borders)
- Accent color: Electric blue or cyan (Oracle-adjacent but more vibrant)
- High contrast text for readability
- Subtle glow effects on interactive elements
- Clean, generous spacing

### Color Palette

```css
:root {
  /* Backgrounds */
  --bg-primary: #0a0a0f;
  --bg-secondary: #12121a;
  --bg-elevated: #1a1a24;
  --bg-code: #0d0d12;
  
  /* Text */
  --text-primary: #e8e8ed;
  --text-secondary: #9898a8;
  --text-muted: #5a5a6e;
  
  /* Accents */
  --accent-primary: #00d4ff;
  --accent-secondary: #0099cc;
  --accent-glow: rgba(0, 212, 255, 0.15);
  
  /* Borders */
  --border-subtle: #2a2a3a;
  --border-accent: #00d4ff;
  
  /* Status */
  --success: #00ff88;
  --warning: #ffaa00;
}
```

### Typography

```css
/* Display/Headings - Monospace with character */
--font-display: 'JetBrains Mono', 'Fira Code', monospace;

/* Body - Clean, readable sans-serif */
--font-body: 'IBM Plex Sans', -apple-system, sans-serif;

/* Code snippets */
--font-code: 'JetBrains Mono', monospace;
```

**Font sizes (fluid/responsive):**
- Hero headline: clamp(2.5rem, 5vw, 4rem)
- Section headlines: clamp(1.75rem, 3vw, 2.5rem)
- Body: 1rem (16px) minimum
- Small/meta: 0.875rem

### Visual Elements

1. **Subtle grid background** — Faint horizontal/vertical lines suggesting a terminal or blueprint
2. **Glowing borders** — Interactive elements get a subtle cyan glow on hover
3. **Code block styling** — Blog posts should have beautiful syntax highlighting
4. **Animated cursor/caret** — Blinking cursor after the tagline
5. **Staggered fade-in** — Elements animate in on page load with slight delays

---

## Responsive Design Requirements

The site must work well on:
- **Desktop:** 1200px+
- **Tablet:** 768px - 1199px
- **Mobile:** 320px - 767px

**Approach:**
- Mobile-first CSS
- Single column on mobile, multi-column on larger screens
- Navigation collapses to hamburger menu on mobile
- Touch-friendly tap targets (minimum 44px)
- No horizontal scrolling at any breakpoint

---

## Project Structure

```
jmjcloud-site/
├── src/
│   ├── content/
│   │   ├── config.ts              # Content collection schemas
│   │   └── blog/                  # Markdown blog posts
│   │       ├── apex-18-release.md
│   │       ├── ords-best-practices.md
│   │       └── ebs-cloud-coexistence.md
│   ├── components/
│   │   ├── Header.astro           # Site header with nav
│   │   ├── Footer.astro           # Site footer
│   │   ├── MobileNav.astro        # Mobile navigation drawer
│   │   ├── ServiceCard.astro      # Service offering card
│   │   ├── BlogPostCard.astro     # Blog post preview card
│   │   ├── TerminalText.astro     # Animated typing effect
│   │   └── GridBackground.astro   # Subtle grid overlay
│   ├── layouts/
│   │   ├── BaseLayout.astro       # HTML shell, meta, fonts
│   │   └── BlogPost.astro         # Blog post layout
│   ├── pages/
│   │   ├── index.astro            # Home page
│   │   └── blog/
│   │       ├── index.astro        # Blog listing
│   │       └── [...slug].astro    # Individual blog posts
│   └── styles/
│       ├── global.css             # Reset, variables, base styles
│       └── syntax.css             # Code syntax highlighting
├── public/
│   ├── fonts/                     # Self-hosted Google Fonts
│   ├── images/
│   │   └── jmj-logo.svg           # Company logo (create simple version)
│   └── favicon.svg
├── astro.config.mjs
├── package.json
└── README.md
```

---

## Page Specifications

### Home Page (`/`)

**Sections in order:**

#### 1. Hero Section
- Large headline: "JMJ Cloud" with blinking cursor after it
- Subheadline: "Oracle Technology Delivered"
- Brief value proposition (1-2 sentences): "We build and extend Oracle solutions — ERP Cloud, APEX, E-Business Suite — with modern architecture and clean code."
- Primary CTA button: "View Our Work" (links to /blog for now, will link to /projects later)
- Secondary link: "Get in Touch" (links to mailto or contact section)

**Visual treatment:**
- Centered or left-aligned text
- Subtle grid background
- Fade-in animation on load

#### 2. Services Section
- Section headline: "What We Do"
- Three service cards in a row (stack vertically on mobile):

**Card 1: Oracle ERP Cloud**
- Icon: Cloud symbol
- Brief description: "Implementation, integrations, extensions, and reporting for Oracle Cloud ERP and HCM."

**Card 2: Oracle APEX & ORDS**
- Icon: Code/brackets symbol  
- Brief description: "Custom application development, REST APIs, and modernization using Oracle's low-code platform."

**Card 3: E-Business Suite**
- Icon: Database/server symbol
- Brief description: "EBS extensions, integrations, cloud coexistence, and migration planning."

**Visual treatment:**
- Cards have subtle border, slight glow on hover
- Monospace font for card titles
- Icons should be simple line-art style (use SVG)

#### 3. Recent Posts Section
- Section headline: "Latest Insights"
- Display 3 most recent blog posts as cards
- Each card shows: title, date, excerpt (first 150 chars), "Read more →" link
- "View All Posts →" link at bottom

#### 4. Footer
- Logo (small)
- Copyright: "© 2025 JMJ Cloud Inc."
- Links: About (placeholder #), Blog (/blog), Contact (mailto:)
- Social: LinkedIn icon linking to https://www.linkedin.com/company/jmjcloud

---

### Blog Listing Page (`/blog`)

**Layout:**
- Page headline: "Blog"
- Subheadline: "Technical insights on Oracle APEX, ORDS, EBS, and Cloud ERP"
- Grid of blog post cards (2 columns on desktop, 1 on mobile)
- Each card shows: title, date, tags, excerpt
- Sorted by date descending (newest first)

---

### Blog Post Page (`/blog/[slug]`)

**Layout:**
- Back link: "← Back to Blog"
- Post title (large)
- Meta line: Date • Author • Tags
- Article content (rendered Markdown)
- Syntax highlighting for code blocks
- Footer with "Back to Blog" link

**Typography for article:**
- Max-width of ~700px for readability
- Generous line-height (1.7)
- Proper spacing between paragraphs and headings
- Code blocks with dark background, horizontal scroll if needed

---

## Content Collection Schema

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    author: z.string().default('JMJ Cloud'),
    tags: z.array(z.string()).default([]),
    summary: z.string(),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  blog: blogCollection,
};
```

---

## Sample Blog Posts to Create

Create 3 sample blog posts with real-ish content (can be placeholder but should look legitimate):

### Post 1: `apex-18-release.md`
```yaml
---
title: "What's New in Oracle APEX 24.1"
date: 2024-11-15
author: "JMJ Cloud"
tags: ["APEX", "Oracle", "Release Notes"]
summary: "A look at the key features and improvements in the latest Oracle APEX release."
---
```
Write 3-4 paragraphs about APEX features (can be generic but technical-sounding).

### Post 2: `ords-security-best-practices.md`
```yaml
---
title: "Securing ORDS REST Services: A Practical Guide"
date: 2024-10-22
author: "JMJ Cloud"
tags: ["ORDS", "Security", "REST"]
summary: "Best practices for authentication and authorization when exposing Oracle data via ORDS."
---
```
Write about OAuth, roles, privileges — reference the kind of content already on the JMJ Cloud blog.

### Post 3: `ebs-apex-integration.md`
```yaml
---
title: "Extending E-Business Suite with APEX"
date: 2024-09-10
author: "JMJ Cloud"
tags: ["EBS", "APEX", "Integration"]
summary: "How to build modern web interfaces on top of your Oracle EBS data using APEX and ORDS."
---
```
Write about the architecture pattern of APEX sitting alongside EBS.

---

## Component Specifications

### Header.astro

```
┌─────────────────────────────────────────────────────────────────┐
│  [Logo]  JMJ Cloud              Home   Blog   About   Contact   │
└─────────────────────────────────────────────────────────────────┘
```

- Fixed/sticky on scroll
- Logo on left, nav on right
- On mobile: Logo left, hamburger menu icon right
- Background becomes more opaque on scroll (subtle effect)

### Footer.astro

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  JMJ Cloud                              Blog                    │
│  Oracle Technology Delivered            About                   │
│                                         Contact                 │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│  © 2025 JMJ Cloud Inc.                          [LinkedIn]      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### BlogPostCard.astro

Props: `title`, `date`, `summary`, `slug`, `tags`

```
┌─────────────────────────────────────────┐
│  Nov 15, 2024                           │
│                                         │
│  What's New in Oracle APEX 24.1         │
│                                         │
│  A look at the key features and         │
│  improvements in the latest release...  │
│                                         │
│  APEX  •  Oracle  •  Release Notes      │
│                                         │
│  Read more →                            │
└─────────────────────────────────────────┘
```

- Subtle border
- Hover: border glows cyan, slight lift (transform)
- Tags displayed as small pills

### ServiceCard.astro

Props: `title`, `description`, `icon`

```
┌─────────────────────────────────────────┐
│                                         │
│              [Icon]                     │
│                                         │
│         Oracle ERP Cloud                │
│                                         │
│  Implementation, integrations,          │
│  extensions, and reporting for          │
│  Oracle Cloud ERP and HCM.              │
│                                         │
└─────────────────────────────────────────┘
```

- Icon is simple SVG (inline)
- Title in monospace font
- Hover effect: glow border

---

## CSS Architecture

### global.css structure:

```css
/* 1. CSS Reset (minimal) */
/* 2. Custom Properties (colors, fonts, spacing) */
/* 3. Base element styles (body, headings, links, etc.) */
/* 4. Utility classes (.container, .visually-hidden, etc.) */
/* 5. Animation keyframes */
```

### Key CSS patterns:

**Container:**
```css
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}
```

**Glow effect:**
```css
.glow-border {
  border: 1px solid var(--border-subtle);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.glow-border:hover {
  border-color: var(--accent-primary);
  box-shadow: 0 0 20px var(--accent-glow);
}
```

**Staggered animation:**
```css
.fade-in {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeIn 0.6s ease forwards;
}

.fade-in:nth-child(1) { animation-delay: 0.1s; }
.fade-in:nth-child(2) { animation-delay: 0.2s; }
.fade-in:nth-child(3) { animation-delay: 0.3s; }

@keyframes fadeIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

## Responsive Breakpoints

```css
/* Mobile first - base styles are mobile */

/* Tablet */
@media (min-width: 768px) {
  /* 2-column layouts, larger fonts */
}

/* Desktop */
@media (min-width: 1024px) {
  /* 3-column service cards, full nav */
}

/* Large desktop */
@media (min-width: 1200px) {
  /* Max container width kicks in */
}
```

---

## Accessibility Requirements

- All images have alt text
- Color contrast meets WCAG AA (already covered with high-contrast dark theme)
- Focus states visible on all interactive elements
- Skip-to-content link for keyboard users
- Semantic HTML (nav, main, article, header, footer)
- Hamburger menu is keyboard accessible

---

## Instructions for Claude Code

1. **Initialize the project:**
   ```bash
   npm create astro@latest jmjcloud-site -- --template minimal
   cd jmjcloud-site
   ```

2. **Set up the folder structure** as specified above

3. **Create global.css** with all CSS custom properties, reset, and base styles

4. **Create components** in this order:
   - GridBackground.astro (background effect)
   - Header.astro
   - Footer.astro
   - ServiceCard.astro
   - BlogPostCard.astro

5. **Create layouts:**
   - BaseLayout.astro (includes Header, Footer, global styles)
   - BlogPost.astro (extends BaseLayout for article pages)

6. **Set up content collection** in `src/content/config.ts`

7. **Create sample blog posts** in `src/content/blog/`

8. **Build pages:**
   - index.astro (home page)
   - blog/index.astro (blog listing)
   - blog/[...slug].astro (blog post template)

9. **Add fonts** — either via Google Fonts link or download to public/fonts

10. **Test responsive behavior** at 375px, 768px, 1024px, 1440px widths

11. **Verify:**
    - `npm run dev` starts without errors
    - Home page displays correctly
    - Blog listing shows all posts
    - Individual blog posts render Markdown correctly
    - Navigation works on all pages
    - Mobile menu opens/closes properly

---

## Logo

Create a simple SVG logo:
- Text "JMJ" in monospace font (JetBrains Mono)
- Accent color for one letter or underline
- Keep it minimal — this is a consulting company, not a startup

Alternatively, just use styled text "JMJ Cloud" as the logo for now.

---

## Future Phases (Not in Scope Now)

- Projects page with project cards
- About page with founder bios
- Contact page with form
- Search functionality
- RSS feed for blog
- Deployment to OCI Object Storage

---

## Success Criteria

Phase 1 is complete when:
- [ ] Site runs locally with `npm run dev`
- [ ] Home page matches design spec
- [ ] Three sample blog posts exist and display correctly
- [ ] Blog listing page works
- [ ] Individual blog post pages render Markdown with syntax highlighting
- [ ] Site is responsive from 375px to 1440px+
- [ ] Mobile navigation works
- [ ] No console errors
- [ ] Lighthouse accessibility score ≥ 90
