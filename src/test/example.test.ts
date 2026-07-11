import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import type { Post } from "@/lib/parse-post";
import { parseFrontmatter, getPostTimestamp, getPostLastMod } from "@/lib/parse-post";
import { formatDate, markdownToPlainText, readingTime, summarizeMarkdown } from "@/lib/formatters";
import { createPost, isValidPost, sortPostsByNewest } from "@/lib/post-model";
import { getInitialTheme, getResolvedTheme, applyTheme } from "@/lib/theme";
import { getAdjacentPosts } from "@/lib/posts";

describe("parseFrontmatter", () => {
  it("parses basic frontmatter", () => {
    const raw = `---\ntitle: Hello\nslug: hello\ndate: 2026-01-01\n---\nBody content`;
    const { data, body } = parseFrontmatter(raw);
    expect(data.title).toBe("Hello");
    expect(data.slug).toBe("hello");
    expect(data.date).toBe("2026-01-01");
    expect(body).toBe("Body content");
  });

  it("returns raw content when no frontmatter", () => {
    const raw = "No frontmatter here";
    const { data, body } = parseFrontmatter(raw);
    expect(Object.keys(data).length).toBe(0);
    expect(body).toBe("No frontmatter here");
  });

  it("handles colons in values", () => {
    const raw = `---\ntitle: Title: with colon\n---\nBody`;
    const { data } = parseFrontmatter(raw);
    expect(data.title).toBe("Title: with colon");
  });

  it("strips wrapping quotes from values", () => {
    const raw = `---\ntitle: "Quoted title"\nslug: 'quoted-slug'\n---\nBody`;
    const { data } = parseFrontmatter(raw);
    expect(data.title).toBe("Quoted title");
    expect(data.slug).toBe("quoted-slug");
  });

  it("does not treat inline dashes as the frontmatter closing marker", () => {
    const raw = `---\ntitle: Hello\n---\nFirst paragraph\n\n--- inline separator`;
    const { body } = parseFrontmatter(raw);
    expect(body).toContain("--- inline separator");
  });
});

describe("getPostTimestamp", () => {
  it("returns timestamp for date+time", () => {
    const ts = getPostTimestamp({ date: "2026-01-01", time: "12:00:00" });
    expect(ts).toBeGreaterThan(0);
  });

  it("returns 0 for empty date", () => {
    expect(getPostTimestamp({ date: "" })).toBe(0);
  });

  it("returns 0 for invalid date", () => {
    expect(getPostTimestamp({ date: "not-a-date" })).toBe(0);
  });
});

describe("getPostLastMod", () => {
  it("includes time when present", () => {
    expect(getPostLastMod({ date: "2026-01-01", time: "12:00:00" })).toBe("2026-01-01T12:00:00");
  });

  it("returns date only when time absent", () => {
    expect(getPostLastMod({ date: "2026-01-01" })).toBe("2026-01-01");
  });
});

const SAMPLE_POSTS: Post[] = [
  {
    slug: "newest",
    title: "Newest",
    date: "2026-03-03",
    content: "Newest content",
    description: "Newest content",
    readingTime: "1 min de lectura",
    timestamp: 3,
    lastModified: "2026-03-03",
  },
  {
    slug: "middle",
    title: "Middle",
    date: "2026-03-02",
    content: "Middle content",
    description: "Middle content",
    readingTime: "1 min de lectura",
    timestamp: 2,
    lastModified: "2026-03-02",
  },
  {
    slug: "oldest",
    title: "Oldest",
    date: "2026-03-01",
    content: "Oldest content",
    description: "Oldest content",
    readingTime: "1 min de lectura",
    timestamp: 1,
    lastModified: "2026-03-01",
  },
];

describe("usePosts", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("fetches posts from /api/posts and exposes them once loaded", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => SAMPLE_POSTS })
    );

    const { usePosts } = await import("@/lib/posts");
    const { result } = renderHook(() => usePosts());

    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.posts).toEqual(SAMPLE_POSTS);
    expect(result.current.error).toBeNull();
    expect(fetch).toHaveBeenCalledWith("/api/posts");
  });

  it("exposes an error when the request fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 500 }));

    const { usePosts } = await import("@/lib/posts");
    const { result } = renderHook(() => usePosts());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.posts).toEqual([]);
    expect(result.current.error).toBeInstanceOf(Error);
  });
});

describe("getAdjacentPosts", () => {
  it("returns prev and next for a middle post", () => {
    const adjacent = getAdjacentPosts(SAMPLE_POSTS, "middle");
    expect(adjacent.prev?.slug).toBe("newest");
    expect(adjacent.next?.slug).toBe("oldest");
  });

  it("returns null next for the oldest post", () => {
    const adjacent = getAdjacentPosts(SAMPLE_POSTS, "oldest");
    expect(adjacent.next).toBeNull();
  });

  it("returns null prev for the newest post", () => {
    const adjacent = getAdjacentPosts(SAMPLE_POSTS, "newest");
    expect(adjacent.prev).toBeNull();
  });

  it("returns both null for an unknown slug", () => {
    const adjacent = getAdjacentPosts(SAMPLE_POSTS, "unknown-slug-12345");
    expect(adjacent.prev).toBeNull();
    expect(adjacent.next).toBeNull();
  });
});

describe("formatDate", () => {
  it("formats date in Spanish locale", () => {
    const result = formatDate("2026-03-10");
    expect(result).toContain("2026");
    expect(result.toLowerCase()).toContain("marzo");
  });
});

describe("readingTime", () => {
  it("returns at least 1 min for short text", () => {
    expect(readingTime("short")).toBe("1 min de lectura");
  });

  it("estimates reading time for longer text", () => {
    const words = Array(400).fill("palabra").join(" ");
    expect(readingTime(words)).toBe("2 min de lectura");
  });

  it("returns 1 min for empty string", () => {
    expect(readingTime("")).toBe("1 min de lectura");
  });
});

describe("markdown formatters", () => {
  it("converts markdown to plain text", () => {
    const markdown = "# Title\n\n![Alt](/image.png)\n[Link text](https://example.com) and `code`.";
    expect(markdownToPlainText(markdown)).toBe("Title Link text and .");
  });

  it("summarizes markdown without cutting the last word when possible", () => {
    const summary = summarizeMarkdown("One two three four five", 13);
    expect(summary).toBe("One two three...");
  });
});

describe("post model", () => {
  it("creates derived post metadata", () => {
    const post = createPost(
      { slug: "hello", title: "Hello", date: "2026-01-01", time: "12:00:00" },
      "Hello world"
    );

    expect(post.description).toBe("Hello world");
    expect(post.readingTime).toBe("1 min de lectura");
    expect(post.timestamp).toBeGreaterThan(0);
    expect(post.lastModified).toBe("2026-01-01T12:00:00");
    expect(isValidPost(post)).toBe(true);
  });

  it("sorts posts by newest timestamp", () => {
    const older = createPost({ slug: "older", title: "Older", date: "2026-01-01" }, "Older");
    const newer = createPost({ slug: "newer", title: "Newer", date: "2026-01-02" }, "Newer");
    expect(sortPostsByNewest([older, newer]).map((post) => post.slug)).toEqual(["newer", "older"]);
  });
});

describe("theme", () => {
  it("getInitialTheme defaults to system when localStorage is empty", () => {
    expect(getInitialTheme()).toBe("system");
  });

  it("getInitialTheme reads valid stored theme", () => {
    localStorage.setItem("theme", "dark");
    expect(getInitialTheme()).toBe("dark");
  });

  it("getResolvedTheme returns light when theme is light", () => {
    expect(getResolvedTheme("light")).toBe("light");
  });

  it("getResolvedTheme returns dark when theme is dark", () => {
    expect(getResolvedTheme("dark")).toBe("dark");
  });

  it("applyTheme sets dark class on html element", () => {
    applyTheme("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    applyTheme("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });
});
