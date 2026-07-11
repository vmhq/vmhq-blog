import { describe, expect, it } from "vitest";
import {
  buildImagePaths,
  buildPostFilePath,
  buildPostMarkdown,
  isValidDate,
  isValidSlug,
  isValidTime,
  sanitizeImageFilename,
  santiagoDateTime,
  slugify,
} from "./publish";

describe("slugify", () => {
  it("removes accents and lowercases", () => {
    expect(slugify("Tecnología y Educación")).toBe("tecnologia-y-educacion");
  });

  it("handles enie and punctuation", () => {
    expect(slugify("¿Mañana será mejor?")).toBe("manana-sera-mejor");
  });

  it("collapses separators", () => {
    expect(slugify("hola   mundo -- otra_vez")).toBe("hola-mundo-otra-vez");
  });
});

describe("isValidSlug", () => {
  it("accepts hyphenated lowercase slugs", () => {
    expect(isValidSlug("mi-post-2026")).toBe(true);
  });

  it("rejects uppercase, spaces and edge hyphens", () => {
    expect(isValidSlug("Mi-Post")).toBe(false);
    expect(isValidSlug("mi post")).toBe(false);
    expect(isValidSlug("-mi-post")).toBe(false);
    expect(isValidSlug("")).toBe(false);
  });
});

describe("isValidDate", () => {
  it("accepts real calendar dates", () => {
    expect(isValidDate("2026-07-09")).toBe(true);
  });

  it("rejects impossible dates and bad formats", () => {
    expect(isValidDate("2026-02-30")).toBe(false);
    expect(isValidDate("2026-13-01")).toBe(false);
    expect(isValidDate("09-07-2026")).toBe(false);
  });
});

describe("isValidTime", () => {
  it("accepts 24h times", () => {
    expect(isValidTime("03:25:00")).toBe(true);
    expect(isValidTime("23:59:59")).toBe(true);
  });

  it("rejects out-of-range times", () => {
    expect(isValidTime("24:00:00")).toBe(false);
    expect(isValidTime("12:60:00")).toBe(false);
    expect(isValidTime("12:00")).toBe(false);
  });
});

describe("santiagoDateTime", () => {
  it("converts UTC instants to America/Santiago local date and time", () => {
    // July: Chile is on UTC-4, so 03:00 UTC is 23:00 the previous day.
    const { date, time } = santiagoDateTime(new Date("2026-07-09T03:00:00Z"));
    expect(date).toBe("2026-07-08");
    expect(time).toBe("23:00:00");
  });
});

describe("buildPostFilePath", () => {
  it("uses Spanish month folders and underscore filenames", () => {
    expect(buildPostFilePath("mi-nuevo-post", "2026-07-09")).toBe(
      "posts/2026/julio/mi_nuevo_post_09_07.md"
    );
  });
});

describe("sanitizeImageFilename", () => {
  it("slugifies the base name and keeps the extension", () => {
    expect(sanitizeImageFilename("Mi Foto Ñoña.PNG")).toBe("mi-foto-nona.png");
  });

  it("rejects disallowed extensions", () => {
    expect(sanitizeImageFilename("script.svg")).toBeNull();
    expect(sanitizeImageFilename("archivo.exe")).toBeNull();
    expect(sanitizeImageFilename("sin-extension")).toBeNull();
  });
});

describe("buildImagePaths", () => {
  it("prefixes the slug and targets images/posts under the data dir", () => {
    expect(buildImagePaths("mi-post", "foto.png")).toEqual({
      dataPath: "images/posts/mi-post-foto.png",
      markdownUrl: "/images/posts/mi-post-foto.png",
    });
  });
});

describe("buildPostMarkdown", () => {
  it("renders frontmatter without quotes and trims the body", () => {
    const markdown = buildPostMarkdown({
      title: "Título: con dos puntos",
      slug: "titulo-con-dos-puntos",
      date: "2026-07-09",
      time: "10:30:00",
      content: "\nHola **mundo**.\n",
    });
    expect(markdown).toBe(
      [
        "---",
        "title: Título: con dos puntos",
        "slug: titulo-con-dos-puntos",
        "date: 2026-07-09",
        "time: 10:30:00",
        "---",
        "",
        "Hola **mundo**.",
        "",
      ].join("\n")
    );
  });
});
