# Weebly to Astro Blog Migration Instructions

This document provides detailed instructions for Claude Code to migrate blog posts from the Weebly export to the JMJ Cloud Astro website.

## File Locations

```
WEEBLY_EXPORT=/Users/jstokes/Library/CloudStorage/OneDrive-JMJCloud/Downloads-JMJ/665824841696696759ac71
ASTRO_SITE=/Users/jstokes/Library/CloudStorage/OneDrive-JMJCloud/GitHubRepos/JMJCLOUD-GitHub/jmj-website

Source Files:
- Blog HTML: ${WEEBLY_EXPORT}/blog.html
- Images: ${WEEBLY_EXPORT}/uploads/7/8/4/7/78474242/

Target Files:
- Blog Posts: ${ASTRO_SITE}/src/content/blog/*.md
- Images: ${ASTRO_SITE}/public/images/blog/
```

## Sample Post for Testing

Start with the **February 2021** post:
- **Title**: "Integrating APEX & ORDS with Microsoft Teams Messaging"
- **Date**: 2/4/2021
- **Post ID**: blog-post-875102139508192971
- **Slug**: integrating-apex-ords-with-microsoft-teams-messaging

## Target Blog Post Schema

Each blog post must be a Markdown file with this YAML frontmatter (defined in `src/content/config.ts`):

```yaml
---
title: string          # Required - Post title
date: YYYY-MM-DD       # Required - Publication date (convert from M/D/YYYY)
author: string         # Default: "JMJ Cloud" - Use "Jon Dixon" for original posts
tags: string[]         # Array of relevant tags
summary: string        # Required - Brief description (1-2 sentences)
draft: boolean         # Default: false
---
```

## HTML Structure Patterns

### Blog Post Container
```html
<div id="blog-post-{numeric_id}" class="blog-post">
  <div class="blog-header">
    <h2 class="blog-title">
      <a class="blog-title-link" href="http://UNSET/blog/{slug}">{Title}</a>
    </h2>
    <p class="blog-date">
      <span class="date-text">M/D/YYYY</span>
    </p>
  </div>
  <div class="blog-content">
    <!-- Content here -->
  </div>
</div>
```

### Content Element Patterns

| HTML Pattern | Markdown Conversion |
|--------------|---------------------|
| `<div class="paragraph">text</div>` | Plain paragraph |
| `<h2 class="wsite-content-title">text</h2>` | `## text` |
| `<strong>text</strong>` | `**text**` |
| `<a href="url">text</a>` | `[text](url)` |
| `<br />` | Line break or new paragraph |
| `&nbsp;` | Space (often remove) |
| `&rsquo;` / `&lsquo;` | ' (apostrophe) |
| `&ldquo;` / `&rdquo;` | " (quotes) |

### Image Patterns
```html
<img src="uploads/7/8/4/7/78474242/{filename}" alt="..." />
```
Convert to: `![Alt text](/images/blog/{filename})`

### Code Blocks (Ace Editor)
Code is embedded in JavaScript within `PlatformElementSettings`. Extract the `"code"` value:
```javascript
_Element.prototype.settings = new PlatformElementSettings({
  "syntax": "sql",  // or "javascript", "json", etc.
  "code": "SELECT * FROM dual;\\nSELECT 1 FROM dual;"
});
```
Convert to fenced code block:
````markdown
```sql
SELECT * FROM dual;
SELECT 1 FROM dual;
```
````

**Code escaping rules:**
- `\\n` → newline
- `\\t` → tab
- `\\/` → `/`
- `\\"` → `"`

## Migration Steps

### Step 1: Extract Post Content
1. Find the post in `blog.html` by searching for the post ID or title
2. Extract everything between `<div class="blog-content">` and the closing `</div>`

### Step 2: Extract Metadata
- **Title**: From `<a class="blog-title-link">`
- **Date**: From `<span class="date-text">` - Convert M/D/YYYY to YYYY-MM-DD
- **Slug**: From href attribute after `/blog/`

### Step 3: Convert Content to Markdown
1. Replace `<h2 class="wsite-content-title">` with `## `
2. Replace `<div class="paragraph">` with paragraphs
3. Convert `<strong>` to `**bold**`
4. Convert `<a href="">` to `[text](url)`
5. Extract code from Ace editor JavaScript blocks
6. Convert images and update paths
7. Clean up HTML entities

### Step 4: Copy Images
For each image reference in the post:
1. Find the source file in `${WEEBLY_EXPORT}/uploads/7/8/4/7/78474242/`
2. Prefer `_orig` versions (original quality) over thumbnails
3. Copy to `${ASTRO_SITE}/public/images/blog/`
4. Update the markdown image path to `/images/blog/{filename}`

### Step 5: Generate Summary
Create a 1-2 sentence summary describing the post content.

### Step 6: Assign Tags
Based on content, use relevant tags from:
- APEX, ORDS, Oracle, EBS
- REST, Integration, Microsoft Teams
- Authentication, OKTA, Azure
- AWS, PL/SQL, JavaScript, Cloud, Webhook

### Step 7: Create Markdown File
Save to `${ASTRO_SITE}/src/content/blog/{slug}.md`

## Sample Output: February 2021 Post

**File**: `src/content/blog/integrating-apex-ords-with-microsoft-teams-messaging.md`

```markdown
---
title: "Integrating APEX & ORDS with Microsoft Teams Messaging"
date: 2021-02-04
author: "Jon Dixon"
tags: ["APEX", "ORDS", "Microsoft Teams", "Integration", "REST", "Webhook"]
summary: "Learn how to integrate Oracle APEX and ORDS with Microsoft Teams using Inbound and Outbound Webhooks to send rich messages and create simple chatbots."
---

## Introduction

The use of Microsoft Teams grew exponentially in 2020. Thanks to Inbound and Outbound Webhook functionality in Teams and the killer combination of Oracle APEX and Oracle Rest Data Services (ORDS), it is easier than ever to incorporate Teams messaging into your APEX Applications.

![APEX ORDS Teams Integration](/images/blog/apex-ords-teams-title.png)

In this post, I will describe how you can send feature rich messages to users in Teams from your APEX Apps and how you can create simple Chatbots using Teams which can interact with your APEX Apps using ORDS.

## Background

Teams allows you to bring together people from around your organization into permanent or Ad-Hoc teams for increased collaboration...

[Continue converting the rest of the content...]
```

## Images to Copy for February 2021 Post

These images are referenced in the Teams integration post:
- `apex-ords-teams-title.png`
- `introdiction-teams-terminology_orig.png`
- `outbound-webhook-flowchart_orig.png`
- `outbound-webhook-example-bot-message_orig.png`
- `outbound-webhook-teams-setup_orig.png`
- `inbound-webhook-teams-setup_orig.png`
- `inbound-webhook-flow-chart_orig.png`
- `inbound-webhook-example1_orig.png`
- `inbound-webhook-example2_orig.png`
- `inbound-webhook-example3_orig.png`
- `inbound-webhook-usecase1_orig.png`
- `inbound-webhook-usecase2_orig.png`
- `inbound-webhook-usecase3_orig.png`

## Validation Checklist

After migration, verify:
- [ ] Frontmatter is valid YAML
- [ ] Date is in YYYY-MM-DD format
- [ ] All images exist in `public/images/blog/`
- [ ] All image paths in markdown start with `/images/blog/`
- [ ] Code blocks have appropriate language tags
- [ ] Internal links use `/blog/{slug}` format
- [ ] No broken HTML tags remain
- [ ] HTML entities are converted to characters
- [ ] Post renders correctly with `npm run dev`

## Commands for Claude Code

```bash
# Navigate to website directory
cd /Users/jstokes/Library/CloudStorage/OneDrive-JMJCloud/GitHubRepos/JMJCLOUD-GitHub/jmj-website

# Create blog images directory
mkdir -p public/images/blog

# Copy images for a post (example)
cp "/Users/jstokes/Library/CloudStorage/OneDrive-JMJCloud/Downloads-JMJ/665824841696696759ac71/uploads/7/8/4/7/78474242/apex-ords-teams-title.png" public/images/blog/

# Test locally
npm run dev
```

## Full Migration (After Sample Approved)

Once the February 2021 sample post is approved, migrate all posts by:

1. Parse `blog.html` to identify all `<div class="blog-post">` elements
2. For each post, extract metadata and content
3. Convert to markdown following patterns above
4. Copy all referenced images
5. Create markdown files with proper frontmatter
6. Test all posts render correctly

## Notes

- Original author for all posts is Jon Dixon
- Posts date from 2016 to 2021
- Topics focus on Oracle APEX, ORDS, EBS, and cloud integrations
- Some posts have PDF attachments in the uploads folder
- Code blocks use various languages: SQL, PL/SQL, JavaScript, JSON, shell
