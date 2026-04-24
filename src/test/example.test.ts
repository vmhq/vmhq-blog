import { describe, it, expect } from "vitest";
import { getAllPosts, getPostBySlug, getAdjacentPosts } from "@/lib/posts";
import { parseFrontmatter, getPostTimestamp, getPostLastMod } from "@/lib/parse-post";
import { formatDate, readingTime } from "@/lib/formatters";
import { getInitialTheme, getResolvedTheme, applyTheme } from "@/lib/theme";

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

describe("getAllPosts", () => {
  it("returns posts sorted by timestamp descending", () => {
    const posts = getAllPosts();
    expect(posts.length).toBeGreaterThan(0);
    for (let i = 1; i < posts.length; i++) {
      expect(getPostTimestamp(posts[i - 1])).toBeGreaterThanOrEqual(getPostTimestamp(posts[i]));
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
    const posts = getAllPosts();
    const first = posts[0];
    expect(first).toBeDefined();
    const post = getPostBySlug(first.slug);
    expect(post).toBeDefined();
    expect(post!.title).toBe(first.title);
  });

  it("returns undefined for invalid slug", () => {
    expect(getPostBySlug("nonexistent")).toBeUndefined();
  });
});

describe("getAdjacentPosts", () => {
  it("returns prev and next for a middle post", () => {
    const posts = getAllPosts();
    if (posts.length < 3) return;
    const middle = posts[1];
    const adjacent = getAdjacentPosts(middle.slug);
    expect(adjacent.prev).toBeDefined();
    expect(adjacent.next).toBeDefined();
  });

  it("returns null next for oldest post", () => {
    const posts = getAllPosts();
    const oldest = posts[posts.length - 1];
    const adjacent = getAdjacentPosts(oldest.slug);
    expect(adjacent.next).toBeNull();
  });

  it("returns null prev for newest post", () => {
    const posts = getAllPosts();
    const newest = posts[0];
    const adjacent = getAdjacentPosts(newest.slug);
    expect(adjacent.prev).toBeNull();
  });

  it("returns both null for unknown slug", () => {
    const adjacent = getAdjacentPosts("unknown-slug-12345");
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
