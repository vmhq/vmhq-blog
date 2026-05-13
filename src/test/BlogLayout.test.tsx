import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import * as React from "react";
import BlogLayout from "@/components/BlogLayout";

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe("BlogLayout", () => {
  it("renders children content", () => {
    renderWithRouter(
      <BlogLayout>
        <p>Test content</p>
      </BlogLayout>
    );
    expect(screen.getByText("Test content")).toBeDefined();
  });

  it("renders site title link", () => {
    renderWithRouter(
      <BlogLayout>
        <p>Content</p>
      </BlogLayout>
    );
    expect(screen.getByText("vmhq")).toBeDefined();
  });

  it("renders skip-to-content link", () => {
    renderWithRouter(
      <BlogLayout>
        <p>Content</p>
      </BlogLayout>
    );
    expect(screen.getByText("Ir al contenido principal")).toBeDefined();
  });

  it("renders footer with current year", () => {
    renderWithRouter(
      <BlogLayout>
        <p>Content</p>
      </BlogLayout>
    );
    const year = String(new Date().getFullYear());
    expect(screen.getByText(new RegExp(`© vmhq ${year}`))).toBeDefined();
  });

  it("renders navigation links in footer", () => {
    renderWithRouter(
      <BlogLayout>
        <p>Content</p>
      </BlogLayout>
    );
    expect(screen.getByText("Acerca")).toBeDefined();
    expect(screen.getByText("RSS")).toBeDefined();
    expect(screen.getByText("GitHub")).toBeDefined();
  });

  it("has theme toggle button with accessible label", () => {
    renderWithRouter(
      <BlogLayout>
        <p>Content</p>
      </BlogLayout>
    );
    expect(screen.getByLabelText(/Cambiar tema/)).toBeDefined();
  });

  it("initializes theme from localStorage", () => {
    localStorage.setItem("theme", "dark");
    renderWithRouter(
      <BlogLayout>
        <p>Content</p>
      </BlogLayout>
    );
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });
});
