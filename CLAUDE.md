# Claude Code Configuration for JMJ Cloud Website

This file contains instructions and context for Claude Code (or any AI assistant) working on this project.

## Project Overview

This is the JMJ Cloud company website - a static site built with Astro 5.16.6, deployed automatically to GitHub Pages. The site showcases Oracle ERP consulting services, project case studies, team information, and blog content.

**Live Site**: https://jmjcloud.com

## Design System

This site has a companion design system in **Claude Design** ("JMJ Cloud Design System"),
extracted directly from `src/styles/global.css` and the component library. It is the
documented, visual source of truth for the brand: colors, type, spacing, and the core
components (buttons, tags, forms, cards, header, footer, chat, hero).

**When building or restyling any UI in this repo:**

1. Invoke the `/jmj-cloud-design` skill first. It loads the brand tokens and the
   non-negotiable rules (dark theme, single electric-cyan accent `#00d4ff`, JetBrains
   Mono for headings/UI labels, IBM Plex Sans for body, the `.glow-border` hover, honeypot
   fields on intake forms, and no em dashes). The skill is account-global, so it is
   available from any session.
2. Reference the design tokens (`var(--accent-primary)`, `var(--space-4)`, etc.) defined
   in `src/styles/global.css`. Never hardcode hex values or font stacks.

**Keeping it in sync:** the design system's `tokens.css` mirrors `src/styles/global.css`.
If you change a token here (a color, a font, a spacing value), the design system is now
stale. Flag it, and re-sync `tokens.css` to the Claude Design project via the DesignSync
tool so the two do not drift. The design system is a reference/prototyping surface, not a
live library the site imports from.

## Initial Context Loading

When starting work on this project:

1. **Understand the Architecture**: Review the project structure and understand how it works:
   - Read `CONTRIBUTING.md` for development workflow
   - Examine `src/content/config.ts` to understand content collections (blog, projects)
   - Review `src/pages/index.astro` to see how the home page works
   - Check `.github/workflows/deploy.yml` to understand deployment
   - Look at `astro.config.mjs` for site configuration

2. **Ask Questions**: If anything about the architecture, build process, or deployment is unclear, ask questions before proceeding with changes.

3. **This is the basis for our conversation**: All subsequent work should build on this understanding of the codebase.

## Working Principles

### Reduce Hallucinations
**CRITICAL**: Never speculate about code you have not opened.

- If the user references a specific file, you MUST read the file before answering
- Investigate and read relevant files BEFORE answering questions about the codebase
- Never make claims about code before investigating unless you are certain of the correct answer
- Give grounded and hallucination-free answers based on actual file contents

### Use Parallel Tool Calls
Maximize efficiency by running independent operations in parallel:

- If calling multiple tools with no dependencies, make all calls in parallel
- Example: Reading 3 files? Run 3 Read tool calls simultaneously
- However, if tool calls depend on previous results, run them sequentially
- Never use placeholders or guess missing parameters in tool calls

### Adjust Eagerness (Balanced Approach)
Default to implementing changes when requested, but verify intent when ambiguous:

- **When clearly instructed**: Proceed with implementation directly
- **When intent is unclear**: Ask clarifying questions or provide recommendations first
- **When researching**: Use tools to discover missing details instead of guessing
- **When editing**: Only modify files when explicitly requested or clearly implied

### Tool Use Summaries
After completing tasks involving tool use, provide a quick summary:
- What files were changed
- What the changes accomplish
- Any important context or next steps

## Project-Specific Context

### Content Collections

**Projects** (`src/content/projects/`):
```yaml
title: string
status: "Active" | "Completed"
year: number (optional)
summary: string
technologies: string[]
industry: string
metrics: string[]
featured: boolean  # Shows on home page
order: number      # Display order (lower = first)
```

**Blog Posts** (`src/content/blog/`):
```yaml
title: string
date: date
author: string (default: "JMJ Cloud")
tags: string[]
summary: string
draft: boolean (default: false)
```

### Key Pages

- **Home** (`src/pages/index.astro`): Dynamically loads top 3 featured projects
- **Portfolio** (`src/pages/portfolio.astro`): Lists all projects
- **Project Detail** (`src/pages/portfolio/[...slug].astro`): Individual project pages
- **About** (`src/pages/about.astro`): Team member bios
- **Blog** (`src/pages/blog/index.astro` and `src/pages/blog/[...slug].astro`)

### Deployment

- **Automatic**: Every push to `main` branch triggers deployment
- **GitHub Actions**: `.github/workflows/deploy.yml` handles build and deploy
- **Build Command**: `npm run build`
- **Output**: `dist/` directory deployed to GitHub Pages
- **Deployment Time**: ~1-2 minutes
- **Monitor**: https://github.com/JMJ-Cloud/jmj-cloud.github.io/actions

### Important Conventions

1. **No Netlify References**: This project uses GitHub Pages exclusively. Do not add or reference Netlify.

2. **Git Commit Messages**: Follow conventional commit format:
   ```
   feat: Add new feature
   fix: Fix bug
   docs: Update documentation
   style: Format/styling changes
   refactor: Code refactoring
   ```

3. **Co-Author Attribution**: Include in commits:
   ```
   Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
   ```

4. **Featured Projects**: Only 3 projects with `featured: true` appear on home page, sorted by `order` field (ascending).

5. **Status Values**: Projects must use "Active" or "Completed" (enforced by Zod schema).

6. **Images**: Static assets go in `public/` directory (e.g., `public/images/`, `public/favicon.png`).

7. **No Em Dashes**: Never use em dashes (—) in content. Replace with appropriate punctuation:
   - `**Bold Heading** —` → `**Bold Heading:**` (colon for introductions)
   - `word — elaboration` → `word, elaboration` (comma for mid-sentence)
   - `concept — list` → `concept:` (colon before lists)
   - `thought — new idea` → `thought. New idea` (period for separate thoughts)
   - `term — definition` → `term (definition)` (parentheses for asides)

### Common Tasks

**Adding a Project**:
1. Create `src/content/projects/slug-name.md`
2. Add required frontmatter (title, status, year, summary, technologies, industry, metrics)
3. Set `featured: true` and `order` if it should appear on home page
4. Commit and push to deploy

**Updating Team Info**:
1. Edit `src/pages/about.astro`
2. Update member bio, title, or photo URL
3. Commit and push

**Changing Navigation**:
1. Edit `src/components/Header.astro` for desktop nav
2. Edit `src/components/MobileNav.astro` for mobile nav
3. Keep both in sync

### Technology Stack

- **Framework**: Astro 5.16.6 (static site generator)
- **Language**: TypeScript
- **Styling**: Vanilla CSS with CSS custom properties
- **Fonts**: IBM Plex Sans (body), JetBrains Mono (monospace)
- **Hosting**: GitHub Pages
- **CI/CD**: GitHub Actions
- **Package Manager**: npm
- **Node Version**: 20+

### File Structure

```
jmjcloud-site/
├── .github/workflows/deploy.yml  # Deployment automation
├── public/                        # Static assets
│   ├── images/                   # Project and service images
│   └── favicon.png               # Site favicon
├── src/
│   ├── components/               # Reusable UI components
│   ├── content/
│   │   ├── blog/                # Blog post markdown files
│   │   ├── projects/            # Project case study markdown files
│   │   └── config.ts            # Content collection schemas
│   ├── layouts/                 # Page layout components
│   ├── pages/                   # File-based routing
│   └── styles/                  # Global CSS
├── astro.config.mjs             # Astro configuration
├── CONTRIBUTING.md              # Developer guide
├── claude.md                    # This file
└── package.json                 # Dependencies and scripts
```

## Development Workflow

1. **Local Development**:
   ```bash
   npm run dev
   ```
   Site runs at `http://localhost:4321` (or next available port)

2. **Build for Production**:
   ```bash
   npm run build
   ```
   Output goes to `dist/` directory

3. **Deploy**:
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```
   GitHub Actions automatically builds and deploys

## Troubleshooting

- **Build fails**: Check TypeScript errors, verify content frontmatter matches schemas
- **Changes not live**: Check GitHub Actions status, wait 1-2 minutes, hard refresh browser
- **Port in use**: Astro auto-selects next available port, check terminal output
- **Content not appearing**: Verify `draft: false` (or omit, defaults to false)

## Questions to Ask Before Starting

When beginning work on this project, consider asking:

1. What is the goal of this task?
2. Which files or components will be affected?
3. Are there existing patterns in the codebase I should follow?
4. Should this change be deployed immediately or reviewed first?
5. Are there any constraints or requirements I should be aware of?

## Additional Resources

- **Astro Docs**: https://docs.astro.build
- **GitHub Pages Docs**: https://docs.github.com/pages
- **Repository**: https://github.com/JMJ-Cloud/jmj-cloud.github.io
- **Contributing Guide**: See `CONTRIBUTING.md` in this repository
