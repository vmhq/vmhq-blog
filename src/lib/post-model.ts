import { getPostLastMod, getPostTimestamp, type Post } from "./parse-post";
import { readingTime, summarizeMarkdown } from "./formatters";

interface RawPostData {
  slug?: string;
  title?: string;
  date?: string;
  time?: string;
}

export function createPost(data: RawPostData, content: string): Post {
  const basePost = {
    slug: data.slug ?? "",
    title: data.title ?? "",
    date: data.date ?? "",
    time: data.time || undefined,
    content,
  };

  return {
    ...basePost,
    description: summarizeMarkdown(content),
    readingTime: readingTime(content),
    timestamp: getPostTimestamp(basePost),
    lastModified: getPostLastMod(basePost),
  };
}

export function isValidPost(post: Post): boolean {
  return Boolean(post.slug && post.title && post.date);
}

export function sortPostsByNewest(posts: Post[]): Post[] {
  return [...posts].sort((a, b) => b.timestamp - a.timestamp);
}
