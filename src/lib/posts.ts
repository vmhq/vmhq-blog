import * as React from "react";
import type { Post } from "./parse-post";

export type { Post };

let cachedPosts: Promise<Post[]> | null = null;

export function invalidatePostsCache(): void {
  cachedPosts = null;
}

function loadPosts(): Promise<Post[]> {
  if (!cachedPosts) {
    cachedPosts = fetch("/api/posts")
      .then((response) => {
        if (!response.ok) throw new Error(`Failed to load posts (${response.status})`);
        return response.json() as Promise<Post[]>;
      })
      .catch((error) => {
        cachedPosts = null;
        throw error;
      });
  }
  return cachedPosts;
}

export interface UsePostsResult {
  posts: Post[];
  loading: boolean;
  error: Error | null;
}

export function usePosts(): UsePostsResult {
  const [state, setState] = React.useState<UsePostsResult>({ posts: [], loading: true, error: null });

  React.useEffect(() => {
    let cancelled = false;
    loadPosts()
      .then((posts) => {
        if (!cancelled) setState({ posts, loading: false, error: null });
      })
      .catch((error: Error) => {
        if (!cancelled) setState({ posts: [], loading: false, error });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

export function getAdjacentPosts(posts: Post[], slug: string): { prev: Post | null; next: Post | null } {
  const idx = posts.findIndex((post) => post.slug === slug);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? posts[idx - 1] : null,
    next: idx < posts.length - 1 ? posts[idx + 1] : null,
  };
}
