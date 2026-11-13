// blog.ts
// Shared blog helpers.
import type { CollectionEntry } from 'astro:content';

// Posts older than this are shown in the archive unless frontmatter says otherwise.
const ARCHIVE_CUTOFF = new Date('2022-01-01');

// A post is archived when frontmatter sets `archived`, otherwise by its date.
export function isArchived(post: CollectionEntry<'blog'>): boolean {
  return post.data.archived ?? post.data.date < ARCHIVE_CUTOFF;
}
