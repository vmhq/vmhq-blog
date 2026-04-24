import { Post, parseFrontmatter, getPostTimestamp } from "./parse-post";

const modules = import.meta.glob("../../posts/**/*.md", {
  query: "?raw",
  eager: true,
  import: "default",
}) as Record<string, string>;

const posts: Post[] = Object.values(modules).map((raw) => {
  const { data, body } = parseFrontmatter(raw);
  return {
    slug: data.slug ?? "",
    title: data.title ?? "",
    date: data.date ?? "",
    time: data.time ?? undefined,
    content: body,
  };
});

export type { Post };
export function getAllPosts(): Post[] {
  return [...posts].sort((a, b) => getPostTimestamp(b) - getPostTimestamp(a));
}

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getAdjacentPosts(slug: string): { prev: Post | null; next: Post | null } {
  const sorted = getAllPosts(); // newest first
  const idx = sorted.findIndex((p) => p.slug === slug);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? sorted[idx - 1] : null,           // más reciente
    next: idx < sorted.length - 1 ? sorted[idx + 1] : null, // más antiguo
  };
}
