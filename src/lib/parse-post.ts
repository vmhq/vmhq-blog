export interface Post {
  slug: string;
  title: string;
  date: string;
  time?: string;
  content: string;
}

export function parseFrontmatter(raw: string): { data: Record<string, string>; body: string } {
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

export function getPostTimestamp(post: Pick<Post, "date" | "time">): number {
  if (!post.date) return 0;
  const normalized = post.date.includes("T")
    ? post.date
    : post.time
      ? `${post.date}T${post.time}`
      : `${post.date}T00:00:00`;
  const ts = new Date(normalized).getTime();
  return Number.isNaN(ts) ? 0 : ts;
}

export function getPostLastMod(post: Pick<Post, "date" | "time">): string {
  return post.time ? `${post.date}T${post.time}` : post.date;
}
