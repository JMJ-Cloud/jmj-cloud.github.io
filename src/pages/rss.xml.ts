import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import MarkdownIt from 'markdown-it';
import sanitizeHtml from 'sanitize-html';

const md = new MarkdownIt();
const siteUrl = 'https://jmjcloud.com';

function resolveRelativeUrls(html: string): string {
  return html
    .replace(/src="\/(?!\/)/g, `src="${siteUrl}/`)
    .replace(/href="\/(?!\/)/g, `href="${siteUrl}/`);
}

function renderMarkdown(markdown: string): string {
  const html = md.render(markdown);
  const sanitized = sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ['src', 'alt', 'title', 'width', 'height'],
    },
  });
  return resolveRelativeUrls(sanitized);
}

export async function GET(context: APIContext) {
  const posts = await getCollection('blog', ({ data }) => !data.draft);

  const items = posts
    .map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.summary,
      link: `/blog/${post.slug}/`,
      content: renderMarkdown(post.body ?? ''),
    }))
    .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  return rss({
    title: 'JMJ Cloud',
    description:
      'Blog posts from JMJ Cloud, covering Oracle APEX, ORDS, EBS, and Cloud ERP.',
    site: context.site!,
    items,
  });
}
