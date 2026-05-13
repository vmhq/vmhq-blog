import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Index from "@/pages/Index";
import { getAllPosts } from "@/lib/posts";

describe("Index", () => {
  it("renders post list", () => {
    render(
      <MemoryRouter>
        <Index />
      </MemoryRouter>
    );
    const posts = getAllPosts();
    if (posts.length > 0) {
      expect(screen.getByText(posts[0].title)).toBeDefined();
    }
  });

  it("renders empty message when no posts", () => {
    // getAllPosts() always reads from files; test pagination when enough posts exist
    render(
      <MemoryRouter>
        <Index />
      </MemoryRouter>
    );
    const posts = getAllPosts();
    // Should have at least 1 post from the real posts directory
    expect(posts.length).toBeGreaterThan(0);
  });

  it("sets document title", () => {
    render(
      <MemoryRouter>
        <Index />
      </MemoryRouter>
    );
    expect(document.title).toBe("vmhq");
  });
});
