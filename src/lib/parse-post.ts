export interface Post {
  slug: string;
  title: string;
  date: string;
  time?: string;
  content: string;
  description: string;
  readingTime: string;
  timestamp: number;
  lastModified: string;
}

export function parseFrontmatter(raw: string): { data: Record<string, string>; body: string } {
  if (!raw.startsWith("---\n") && !raw.startsWith("---\r\n")) {
    return { data: {}, body: raw };
  }

  const endMatch = /\r?\n---\r?\n/.exec(raw.slice(3));
  if (!endMatch) return { data: {}, body: raw };

  const end = 3 + endMatch.index;
  if (end === -1) return { data: {}, body: raw };
  const frontmatter = raw.slice(3, end).trim();
  const body = raw.slice(end + endMatch[0].length).trim();
  const data: Record<string, string> = {};
  for (const line of frontmatter.split("\n")) {
    const colonIdx = line.indexOf(":");
    if (colonIdx > 0) {
      data[line.slice(0, colonIdx).trim()] = stripWrappingQuotes(line.slice(colonIdx + 1).trim());
    }
  }
  return { data, body };
}

function stripWrappingQuotes(value: string): string {
  if (value.length < 2) return value;
  const first = value[0];
  const last = value[value.length - 1];
  if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
    return value.slice(1, -1);
  }
  return value;
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
