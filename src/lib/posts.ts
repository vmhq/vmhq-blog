import { Post, parseFrontmatter } from "./parse-post";
import { createPost, isValidPost, sortPostsByNewest } from "./post-model";

const modules = import.meta.glob("../../posts/**/*.md", {
  query: "?raw",
  eager: true,
  import: "default",
}) as Record<string, string>;

const sortedPosts: Post[] = sortPostsByNewest(
  Object.values(modules)
    .map((raw) => {
      const { data, body } = parseFrontmatter(raw);
      return createPost(data, body);
    })
    .filter(isValidPost)
);
const postsBySlug = new Map(sortedPosts.map((post) => [post.slug, post]));
const postIndexesBySlug = new Map(sortedPosts.map((post, index) => [post.slug, index]));

export type { Post };
export function getAllPosts(): Post[] {
  return [...sortedPosts];
}

export function getPostBySlug(slug: string): Post | undefined {
  return postsBySlug.get(slug);
}

export function getAdjacentPosts(slug: string): { prev: Post | null; next: Post | null } {
  const idx = postIndexesBySlug.get(slug) ?? -1;
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? sortedPosts[idx - 1] : null,
    next: idx < sortedPosts.length - 1 ? sortedPosts[idx + 1] : null,
  };
}
