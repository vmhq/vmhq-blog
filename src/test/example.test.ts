import { describe, it, expect } from "vitest";
import { getAllPosts, getPostBySlug, generateRSSFeed } from "@/lib/posts";
import { formatDate, readingTime } from "@/lib/formatters";

describe("getAllPosts", () => {
  it("returns posts sorted by date descending", () => {
    const posts = getAllPosts();
    expect(posts.length).toBeGreaterThan(0);
    for (let i = 1; i < posts.length; i++) {
      expect(new Date(posts[i - 1].date).getTime()).toBeGreaterThanOrEqual(
        new Date(posts[i].date).getTime()
      );
    }
  });

  it("each post has required fields", () => {
    const posts = getAllPosts();
    for (const post of posts) {
      expect(post.slug).toBeTruthy();
      expect(post.title).toBeTruthy();
      expect(post.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(post.content).toBeTruthy();
    }
  });
});

describe("getPostBySlug", () => {
  it("returns post for valid slug", () => {
    const post = getPostBySlug("sobre-la-simplicidad");
    expect(post).toBeDefined();
    expect(post!.title).toBe("Sobre la simplicidad");
  });

  it("returns undefined for invalid slug", () => {
    expect(getPostBySlug("nonexistent")).toBeUndefined();
  });
});

describe("formatDate", () => {
  it("formats date in Spanish locale", () => {
    const result = formatDate("2026-03-10");
    expect(result).toContain("2026");
    // Should contain Spanish month name
    expect(result.toLowerCase()).toContain("marzo");
  });
});

describe("readingTime", () => {
  it("returns at least 1 min", () => {
    expect(readingTime("short")).toBe("1 min de lectura");
  });

  it("estimates reading time for longer text", () => {
    const words = Array(400).fill("palabra").join(" ");
    expect(readingTime(words)).toBe("2 min de lectura");
  });
});

describe("generateRSSFeed", () => {
  it("generates valid RSS XML", () => {
    const rss = generateRSSFeed("https://example.com");
    expect(rss).toContain('<?xml version="1.0"');
    expect(rss).toContain("<rss version");
    expect(rss).toContain("<channel>");
    expect(rss).toContain("<item>");
    expect(rss).toContain("https://example.com/post/");
  });

  it("escapes XML entities in content", () => {
    const rss = generateRSSFeed("https://example.com");
    // Should not contain unescaped < or > in description (from markdown)
    expect(rss).not.toMatch(/<description>[^<]*<[^/][^<]*<\/description>/);
  });
});
