import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import About from "@/pages/About";

describe("About", () => {
  it("renders the about heading", () => {
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    );
    const headings = screen.getAllByText("Acerca");
    expect(headings.length).toBeGreaterThanOrEqual(2); // heading + footer link
  });

  it("renders RSS feed link", () => {
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    );
    expect(screen.getByText("feed RSS")).toBeDefined();
  });

  it("sets document title", () => {
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    );
    expect(document.title).toBe("Acerca \u2014 vmhq");
  });
});
