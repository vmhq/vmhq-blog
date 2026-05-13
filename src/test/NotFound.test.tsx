import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NotFound from "@/pages/NotFound";

describe("NotFound", () => {
  it("renders 404 message", () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );
    expect(screen.getByText("404")).toBeDefined();
    expect(screen.getByText("Página no encontrada")).toBeDefined();
    expect(screen.getByText(/no existe o fue movido/)).toBeDefined();
  });

  it("renders link to home", () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );
    const link = screen.getByText("Volver al inicio");
    expect(link).toBeDefined();
    expect(link.getAttribute("href")).toBe("/");
  });
});
