import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const projects = await getCollection('projects');

  const blogItems = posts.map((post) => ({
    title: post.data.title,
    pubDate: post.data.date,
    description: post.data.summary,
    link: `/blog/${post.slug}/`,
  }));

  const projectItems = projects.map((project) => ({
    title: project.data.title,
    pubDate: project.data.date,
    description: project.data.summary,
    link: `/portfolio/${project.slug}/`,
  }));

  const items = [...blogItems, ...projectItems].sort(
    (a, b) => b.pubDate.getTime() - a.pubDate.getTime()
  );

  return rss({
    title: 'JMJ Cloud',
    description:
      'Blog posts and project case studies from JMJ Cloud, covering Oracle APEX, ORDS, EBS, and Cloud ERP.',
    site: context.site!,
    items,
  });
}
