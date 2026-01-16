---
title: "JMJ Cloud Website Development"
status: "Active"
date: 2024-08-15
year: 2025
summary: "Building and evolving our company website using modern web technologies and parallel AI-assisted development. Two team members simultaneously develop features using Claude Code, demonstrating collaborative AI workflows."
technologies:
  - "Astro 5.16.6"
  - "TypeScript"
  - "Content Collections"
  - "CSS Custom Properties"
  - "GitHub Actions"
  - "Microsoft Clarity"
  - "Google Analytics 4"
industry: "Professional Services"
metrics:
  - "Zero-JavaScript by default for fast performance"
  - "Custom domain with automated HTTPS"
  - "GDPR-compliant analytics with cookie consent"
  - "15+ portfolio case studies published"
  - "Parallel AI-assisted development workflow"
featured: false
order: 2
---

## Project Overview

At JMJ Cloud, we believe in practicing what we preach. When it was time to build our company website, we chose to showcase our technical capabilities by developing a modern, performant web application using cutting-edge technologies. This project demonstrates our ability to select appropriate technology stacks, implement best practices, and deliver enterprise-grade solutions, even for our own marketing presence.

Built with Claude Code assistance, this website serves as both our digital storefront and a real-world case study in AI-assisted software development.

## Technical Requirements

When planning our website, we established clear technical requirements that would guide our technology choices:

### Performance & SEO
- Blazing-fast page loads with minimal JavaScript
- Excellent Core Web Vitals scores
- Search engine optimization built-in from day one
- Static generation for maximum performance

### Developer Experience
- Type-safe content management
- Easy content updates without full rebuilds
- Hot module reloading for rapid development
- Clear component architecture

### User Experience
- Modern design with professional animations
- Secure contact form with spam protection
- Mobile-first responsive design
- Accessible to all users (WCAG compliance)

### Maintainability
- Minimal dependencies to reduce security surface area
- Clear code structure for future updates
- Git-based workflow with automated deployment
- Comprehensive documentation

## Technology Decisions

### Why Astro 5.16.6?

Astro was the clear choice for this project due to several key advantages:

**Zero-JavaScript by Default**
Astro ships zero JavaScript to the browser by default, resulting in blazing-fast page loads. JavaScript is only included where explicitly needed, keeping our bundle sizes minimal and our performance scores high.

**Island Architecture**
When we do need interactivity (like our typing animations or contact form), Astro's island architecture allows partial hydration. Only the interactive components load JavaScript, while the rest of the page remains pure HTML and CSS.

**Content Collections**
Built-in content collections provide type-safe content management with Zod schema validation. Our blog posts and project case studies are validated at build time, catching errors before deployment.

**Excellent SEO**
Static site generation ensures search engines can easily crawl and index our content. Every page is pre-rendered HTML with proper meta tags and semantic markup.

### Why TypeScript?

TypeScript brings several benefits to our development workflow:

- **Type Safety:** Catch errors at build time rather than runtime
- **Better IDE Support:** Autocomplete and inline documentation
- **Refactoring Confidence:** Change code with confidence that types will catch issues
- **Documentation:** Types serve as living documentation of our component APIs

### Why Minimal Dependencies?

We deliberately kept our dependency footprint small:

- **Security:** Fewer dependencies = smaller attack surface
- **Performance:** Less code to parse and execute
- **Maintenance:** Fewer packages to update and monitor
- **Reliability:** Less likely to encounter breaking changes

Our `package.json` includes only essential packages: Astro, TypeScript, and a handful of Astro integrations. No heavy frameworks or unnecessary libraries.

## Key Features

### Content Collections with Type Safety

Our blog posts and project case studies use Astro's Content Collections with Zod schemas for validation:

```typescript
// Every project has validated frontmatter
interface ProjectSchema {
  title: string;
  status: 'Active' | 'Completed';
  year: number;
  summary: string;
  technologies: string[];
  industry: string;
  metrics: string[];
  featured: boolean;
  order: number;
}
```

This ensures content consistency and catches errors at build time. Authors can write in Markdown while maintaining strict type safety.

### Custom Animation Components

We built custom animation components to create an engaging user experience:

**TypingText Component**
The hero section features a typing animation that displays "Enterprise Oracle. Modern Speed." with a terminal cursor effect. Built with vanilla JavaScript, it's accessible with proper ARIA labels and respects user preferences for reduced motion.

**TerminalText Component**
Additional sections use terminal-style text animations to reinforce our technical authenticity. These animations enhance the experience without blocking content or harming performance.

### Secure Contact Form

Our contact form includes multiple layers of security:

**Server-Side Validation**
All form inputs are validated on the server before processing. We never trust client-side validation alone.

**Honeypot Field**
An invisible field traps bots. Legitimate users never see it, but bots often fill it out, allowing us to silently reject spam submissions.

**Proper Error Handling**
Users receive clear feedback for validation errors, and we log failed submissions for monitoring potential attacks.

### Performance Optimizations

Every aspect of the site is optimized for performance:

**CSS Custom Properties**
We use CSS variables for consistent theming across the site. This approach provides a single source of truth for colors, spacing, and typography while keeping our CSS maintainable.

**Minimal JavaScript Footprint**
Most pages ship zero JavaScript. Interactive pages only include the specific components that need hydration.

**Optimized Assets**
Images are properly sized and compressed. We use modern formats where supported and include appropriate fallbacks.

## Development Approach

### AI-Assisted Development with Claude Code

This website was built using Claude Code (Claude Sonnet 4.5), showcasing how AI can accelerate professional web development while maintaining high quality standards:

**Component Development**
Claude Code created all major Astro components:
- `ServiceCard.astro` - Displays service offerings with icons and descriptions
- `ProjectCard.astro` - Showcases portfolio projects with metrics and technologies
- `BlogPostCard.astro` - Renders blog post previews with dates and summaries
- `TypingText.astro` - Custom typing animation for hero sections
- `TerminalText.astro` - Terminal-style text animations

**Responsive Navigation**
Built comprehensive navigation system:
- `Header.astro` - Desktop navigation with active state highlighting
- `MobileNav.astro` - Mobile drawer navigation with smooth animations
- Accessibility features including proper ARIA labels and keyboard navigation

**Content Architecture**
Implemented Content Collections with Zod schemas for type-safe content management. This ensures all blog posts and project case studies follow consistent structures and catch validation errors at build time.

**Debugging Assistance**
Resolved real-world challenges like Astro's scoped CSS limitations when styling child components. The solution involved using `is:global` directive to apply styles across component boundaries, a pattern now documented for future reference.

**UI Refinements**
Iterative improvements throughout development:
- Adjusted icon sizes from 48px to 80px for better visual hierarchy
- Styled hero tagline with custom colors matching brand guidelines
- Separated Technical Expertise into dedicated page for better information architecture
- Reordered project cards to feature most relevant work first

**Git Workflow**
All commits are co-authored with Claude Sonnet 4.5, demonstrating transparent AI-assisted development. Each commit includes clear messages describing the changes and rationale.

### Iterative Development Process

Development followed a phased approach:

**Phase 1: Core Pages**
Established foundational pages (Home, About, Resume, Contact) with consistent layout and navigation.

**Phase 2: Blog System**
Implemented Content Collections for blog posts with dynamic routing and listing pages.

**Phase 3: Project Showcase**
Created detailed project case studies with filterable cards and comprehensive project pages.

**Phase 4: Architecture Refinement**
Separated Technical Expertise into dedicated page, improving navigation and information hierarchy.

**Phase 5: UI Enhancements**
Refined visual design with icon adjustments, hero styling, and project ordering optimizations.

**Ongoing: Continuous Improvement**
Regular content additions, performance monitoring, and user experience refinements based on real-world usage.

### Parallel AI-Assisted Development

A defining characteristic of this project is how Matt and Jamie simultaneously develop features using Claude Code. Rather than traditional pair programming or sequential development, both team members work independently with their own Claude Code sessions, each tackling different aspects of the website.

**How It Works:**
- Each developer runs Claude Code in their own terminal session
- Work happens on separate feature branches or coordinated commits to main
- Claude Code maintains context within each session, understanding the codebase structure and previous changes
- Git handles merge coordination, with conflicts resolved collaboratively when they arise

**Real-World Example:**
While Jamie implemented the cookie consent banner and analytics integration (Microsoft Clarity and Google Analytics), Matt could simultaneously work on portfolio content updates or component refinements. Both developers push changes that Claude Code helped create, with co-authorship attribution in every commit.

**Benefits Observed:**
- **Doubled Development Velocity:** Two streams of AI-assisted work happening concurrently
- **Consistent Code Quality:** Claude Code enforces the same patterns and standards regardless of which developer is working
- **Reduced Context Switching:** Each developer maintains deep focus on their current task while their AI assistant handles implementation details
- **Natural Knowledge Transfer:** Both developers see each other's Claude-assisted commits, learning new patterns and approaches

This workflow demonstrates that AI-assisted development scales beyond individual productivity gains. Teams can multiply their effectiveness by running parallel Claude Code sessions, each maintaining full context of the evolving codebase.

### Recent Enhancements (January 2025)

**Custom Domain with HTTPS**
Configured jmjcloud.com as the primary domain with automated SSL certificate provisioning through GitHub Pages. The setup required DNS A records pointing to GitHub's servers and a CNAME file in the repository for proper domain verification.

**GDPR-Compliant Analytics**
Implemented a privacy-first analytics solution with Microsoft Clarity and Google Analytics 4:
- Created `CookieConsent.astro` component with Accept/Decline options
- Analytics scripts only load after explicit user consent
- Consent preference stored in localStorage and respected on subsequent visits
- Custom events coordinate consent state across analytics providers
- Environment variables keep tracking IDs secure and configurable per environment

**Content Quality Improvements**
Systematic cleanup of punctuation across all portfolio posts, replacing em dashes with appropriate alternatives (colons, commas, parentheses) for improved readability. This bulk operation across 14 files demonstrated Claude Code's ability to apply consistent editorial standards at scale.

**UI Refinements**
- Renamed "Latest Projects" to "Featured Projects" on the home page for clarity
- Updated featured project selection to highlight key case studies
- Fixed project card layout to keep content compact at the top with unused space at the bottom
- Improved visual consistency across card components

### Deployment Workflow

Our deployment process is streamlined and automated:

**Git-Based Workflow**
All changes are committed to Git with clear, descriptive messages. We maintain a clean commit history that serves as documentation of the project's evolution.

**GitHub Pages Auto-Deployment**
Every push to the `main` branch triggers an automatic deployment via GitHub Actions. The workflow builds the Astro site and deploys to GitHub Pages, ensuring our live site always reflects the latest code. This provides free, reliable hosting directly from our Git repository.

**Local Development**
Running `npm run dev` starts a local development server with hot module reloading. Changes appear instantly in the browser, enabling rapid iteration.

**Testing & Validation**
TypeScript and Zod schemas catch errors at build time. The Astro build process validates all content and ensures no broken links or missing assets.

## Current Status & Progress

✅ **Core Website Pages Complete**
Home, About, Resume, Expertise, Blog, Contact, and individual project detail pages are all live and functional.

✅ **Custom Domain Live**
jmjcloud.com configured with automated HTTPS through GitHub Pages.

✅ **Privacy-First Analytics**
Microsoft Clarity and Google Analytics 4 implemented with GDPR-compliant cookie consent banner.

✅ **Blog System with Content Collections**
Type-safe blog system accepting Markdown posts with frontmatter validation and automatic routing.

✅ **Project Showcase with Case Studies**
Portfolio section displays 15+ active and completed projects with detailed case studies, metrics, and technology stacks.

✅ **Contact Form with Bot Protection**
Secure contact form with server-side validation, honeypot field, and proper error handling.

✅ **Responsive Navigation System**
Desktop and mobile navigation with accessibility features, smooth animations, and active state highlighting.

✅ **Parallel Development Workflow**
Matt and Jamie actively developing features simultaneously using independent Claude Code sessions.

🔄 **Ongoing Content Additions**
Regularly adding new blog posts and project case studies as we complete client engagements.

🔄 **Analytics-Driven Optimization**
Using Clarity session recordings and GA4 data to identify UX improvements and content opportunities.

## Why This Matters

### Demonstrating Technical Excellence

This project showcases our ability to:

- **Select Modern Technology Stacks:** Chose Astro and TypeScript for their performance and developer experience benefits
- **Balance Performance with Functionality:** Achieved zero-JavaScript by default while still providing rich interactions where needed
- **Build Secure, Production-Ready Applications:** Implemented form validation, bot protection, and proper error handling from day one
- **Practice Quality Software Development:** Applied best practices including type safety, semantic HTML, and accessibility standards
- **Maintain and Iterate on Live Systems:** Continuously improve the site based on real-world usage and feedback

### Showcasing AI-Assisted Development

This website proves that AI can be a powerful development partner:

**Rapid Prototyping**
Claude Code built components efficiently, accelerating development without sacrificing quality. What might take hours of research and implementation happened in minutes.

**Problem Solving**
Real debugging scenarios (like Astro scoped CSS challenges) were resolved collaboratively. Claude Code understood the framework's architecture and provided targeted solutions.

**Best Practices**
TypeScript types, accessibility features, and semantic HTML were enforced throughout. AI assistance helped maintain high standards consistently.

**Clear Documentation**
Code includes proper comments and structure, making it easy for future developers to understand and modify.

**Iterative Refinement**
Continuous improvements based on real feedback, with AI understanding context from previous changes and suggesting complementary enhancements.

### Real-World Development Patterns

This project demonstrates production-ready practices:

- **Git Workflow:** Meaningful commits with co-authoring attribution
- **Responsive Design:** Mobile-first approach ensuring excellent experience on all devices
- **Performance Optimization:** Speed considered from the start, not as an afterthought
- **Security Built-In:** Validation and protection mechanisms integrated during development, not bolted on later
- **Scalable Content Management:** System that grows with the business without requiring architectural changes

## Technical Insights

### Lessons Learned

**Astro Scoped CSS**
Discovered that Astro's scoped CSS provides excellent component isolation but requires `is:global` directive when styling child component elements from parent components.

**Content Collections Benefits**
Type-safe content management caught errors early and provided excellent developer experience with autocomplete and validation.

**Zero-JavaScript Philosophy**
Shipping minimal JavaScript dramatically improved performance metrics while still allowing rich interactions through careful island architecture.

**AI-Assisted Development**
Claude Code accelerated development while maintaining high quality, proving that AI can be an effective partner for professional software development.

## Lessons Learned

### Deployment Strategy: GitHub Pages

Our deployment approach demonstrates cost-effective infrastructure choices and automation best practices:

**Why GitHub Pages:**
- **100% Free:** No bandwidth limits or build minute restrictions for public repositories
- **Native Git Integration:** Direct deployment from our existing GitHub repository
- **GitHub Actions:** Full control over build process with customizable workflows
- **Simplicity:** Repository, build, and hosting all in one platform
- **Reliability:** Backed by GitHub's infrastructure and uptime guarantees
- **Open Source Friendly:** Perfect for showcasing open development practices

**Technical Implementation:**
1. Created GitHub Actions workflow for automated Astro builds
2. Named repository `jmj-cloud.github.io` for clean root URL hosting
3. Configured `astro.config.mjs` with proper site URL
4. Set GitHub Pages to deploy from GitHub Actions
5. Every push to main triggers automatic build and deployment

**Key Takeaway:**
For static sites built with Astro, GitHub Pages provides everything needed without ongoing costs. This decision demonstrates our commitment to cost-effective solutions and reinforces our philosophy of choosing appropriate tools for each use case.

Building with standard web technologies (Astro, TypeScript, static HTML/CSS) provides maximum platform flexibility and portability.

## Looking Forward

As we continue developing the JMJ Cloud website, we're focused on:

- **Analytics Insights:** Leveraging Microsoft Clarity session recordings and Google Analytics data to understand visitor behavior and optimize content
- **Additional Case Studies:** Adding more detailed project showcases as we complete client work
- **Blog Content:** Publishing technical articles and insights from our Oracle Cloud engagements
- **Performance Optimization:** Continuously monitoring and improving Core Web Vitals scores
- **Feature Enhancements:** Adding interactive demos and tools relevant to our Oracle Cloud expertise
- **Expanded AI Workflows:** Documenting and refining our parallel Claude Code development practices for broader team adoption

This website serves as both our digital presence and a living demonstration of how modern web technologies and AI-assisted development can deliver enterprise-grade results efficiently. The parallel development workflow with Claude Code proves that AI assistance scales effectively across teams, not just individual developers.
