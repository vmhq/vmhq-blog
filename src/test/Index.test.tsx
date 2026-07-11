import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { Post } from "@/lib/parse-post";

const SAMPLE_POSTS: Post[] = [
  {
    slug: "hello-world",
    title: "Hello world",
    date: "2026-03-01",
    content: "Hello world content",
    description: "Hello world content",
    readingTime: "1 min de lectura",
    timestamp: 1,
    lastModified: "2026-03-01",
  },
];

async function renderIndex(posts: Post[]) {
  vi.resetModules();
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => posts }));
  const { default: Index } = await import("@/pages/Index");
  return render(
    <MemoryRouter>
      <Index />
    </MemoryRouter>
  );
}

describe("Index", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders post list once posts are loaded", async () => {
    await renderIndex(SAMPLE_POSTS);
    await waitFor(() => expect(screen.getByText(SAMPLE_POSTS[0].title)).toBeDefined());
  });

  it("renders empty message when there are no posts", async () => {
    await renderIndex([]);
    await waitFor(() => expect(screen.getByText("No hay posts disponibles.")).toBeDefined());
  });

  it("sets document title", async () => {
    await renderIndex(SAMPLE_POSTS);
    expect(document.title).toBe("vmhq");
  });
});
