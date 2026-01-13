# Blog Migration Instructions for Claude Code

## Overview

Migrate remaining blog posts from https://www.jmjcloud.com to the Astro site at `/Users/jstokes/Library/CloudStorage/OneDrive-JMJCloud/ClaudeProjects/JmjWebsite/jmjcloud-site/`.

**CRITICAL**: Migrate posts **word-for-word** with all original images. Do NOT summarize or rewrite content.

## Completed

- 2021: 3 posts (done)
- 2020: 9 posts (done)

## Remaining Years to Migrate

- **2019**: ~10 posts
- **2018**: ~8 posts
- **2017**: ~12 posts
- **2016**: ~13 posts

## Migration Process for Each Post

### Step 1: Find Post URLs

Fetch the archive page for each month/year to get exact URLs:
```
https://www.jmjcloud.com/blog/archives/MM-YYYY
```

Example: `https://www.jmjcloud.com/blog/archives/01-2019`

### Step 2: Fetch Original Content

Use WebFetch with this exact prompt to preserve original content:
```
Return the COMPLETE original blog post text word-for-word. Include every single paragraph and sentence exactly as written. Do not skip any content. Include all code samples. Return the full raw content.
```

Also extract all image URLs from the response (paths starting with `/uploads/`).

### Step 3: Create Image Directory

Create a directory for the post's images:
```
public/images/blog/{post-slug}/
```

### Step 4: Download Images

Download all images using curl:
```bash
cd "public/images/blog/{post-slug}"
curl -s "https://www.jmjcloud.com{image-path}" -o {filename}.png
```

### Step 5: Create Markdown File

Create the post at `src/content/blog/{post-slug}.md` with this frontmatter structure:

```yaml
---
title: "Exact Title from Original Post"
date: YYYY-MM-DD
author: "Jon Dixon"  # or "Matt Paine" if specified
tags: ["Tag1", "Tag2", "Tag3"]
summary: "First 1-2 sentences from the original post introduction"
---
```

**Content Rules:**
- Copy the original text **exactly** as written
- Use proper markdown formatting (##, ###, -, **, etc.)
- Reference images as: `![Alt text](/images/blog/{post-slug}/{filename}.png)`
- End with author attribution: `---\n\nJon Dixon, Co-Founder JMJ Cloud`

### Step 6: Build and Verify

After each batch of posts:
```bash
cd "/Users/jstokes/Library/CloudStorage/OneDrive-JMJCloud/ClaudeProjects/JmjWebsite/jmjcloud-site"
npm run build
```

### Step 7: Commit and Push

After each year is complete:
```bash
git add -A
git commit -m "Add YYYY blog posts with original content and images

Migrated X posts from YYYY:
- Post Title 1
- Post Title 2
...

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"

git push
```

## Known Blog Posts by Year

### 2019 Posts (check archive pages to confirm URLs)
- December: Check `/blog/archives/12-2019`
- November: Check `/blog/archives/11-2019`
- October: Check `/blog/archives/10-2019`
- Continue through all months...

### 2018 Posts
- Check archive pages for each month

### 2017 Posts
- Check archive pages for each month

### 2016 Posts
- Check archive pages for each month

## Image Naming Convention

Keep original filenames from the source, or rename to descriptive names like:
- `intro-image.png`
- `step1-configuration.png`
- `diagram-overview.png`

## Common Issues

1. **404 errors**: Some posts may have been removed. Skip those and note them.
2. **Permission denied on curl**: Use `-o filename` instead of `-O`
3. **Image not found**: Check if URL has query parameters (remove `?timestamp` part)

## Quality Checklist

For each post, verify:
- [ ] Original text preserved word-for-word
- [ ] All images downloaded and referenced correctly
- [ ] Frontmatter has correct date, author, tags, summary
- [ ] Code blocks have language identifiers (sql, javascript, json, etc.)
- [ ] Post builds without errors

## Execution Strategy

1. Process one year at a time
2. Fetch all post URLs for the year first
3. Download all content and images
4. Create all markdown files
5. Build and verify
6. Commit and push
7. Move to next year

## Start Command

Begin by fetching the 2019 archive pages to discover all posts:
```
WebFetch: https://www.jmjcloud.com/blog/archives/12-2019
WebFetch: https://www.jmjcloud.com/blog/archives/11-2019
... etc
```

Then proceed with the migration process for each discovered post.
