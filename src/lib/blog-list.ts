// Shared post ordering for the blog category index (src/pages/category/blogs/).
// Mirrors the sibling-ordering rule in docs/cluster-map.md (priority, then
// newest date, then alphabetical) so the category list and any future
// hub "related deep dives" block stay consistent if that's built later.
import { getCollection, type CollectionEntry } from 'astro:content';

export async function getBlogPostsSorted(): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getCollection('blog');
  return posts.sort((a, b) => {
    const priorityDiff = a.data.priority - b.data.priority;
    if (priorityDiff !== 0) return priorityDiff;

    const dateA = a.data.date?.getTime();
    const dateB = b.data.date?.getTime();
    if (dateA != null && dateB != null && dateA !== dateB) return dateB - dateA;
    if (dateA != null && dateB == null) return -1;
    if (dateA == null && dateB != null) return 1;

    return a.data.title.localeCompare(b.data.title);
  });
}

export const BLOG_PAGE_SIZE = 10;
