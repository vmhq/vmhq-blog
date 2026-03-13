export interface Post {
  slug: string;
  title: string;
  date: string;
  content: string;
}

function parseFrontmatter(raw: string): { data: Record<string, string>; body: string } {
  if (!raw.startsWith("---")) return { data: {}, body: raw };
  const end = raw.indexOf("---", 3);
  if (end === -1) return { data: {}, body: raw };
  const frontmatter = raw.slice(3, end).trim();
  const body = raw.slice(end + 3).trim();
  const data: Record<string, string> = {};
  for (const line of frontmatter.split("\n")) {
    const colonIdx = line.indexOf(":");
    if (colonIdx > 0) {
      data[line.slice(0, colonIdx).trim()] = line.slice(colonIdx + 1).trim();
    }
  }
  return { data, body };
}

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
    content: body,
  };
});

export function getAllPosts(): Post[] {
  return [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
