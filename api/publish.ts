export const SPANISH_MONTHS = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
] as const;

export const ALLOWED_IMAGE_EXTENSIONS = ["png", "jpg", "jpeg", "webp", "gif", "avif"] as const;
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const MAX_IMAGES_PER_POST = 10;
export const MAX_CONTENT_BYTES = 200 * 1024;

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/;

export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s_-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function isValidSlug(slug: string): boolean {
  return SLUG_PATTERN.test(slug) && slug.length <= 120;
}

export function isValidDate(date: string): boolean {
  if (!DATE_PATTERN.test(date)) return false;
  const [year, month, day] = date.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
}

export function isValidTime(time: string): boolean {
  return TIME_PATTERN.test(time);
}

export function santiagoDateTime(now: Date): { date: string; time: string } {
  const date = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Santiago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
  const time = new Intl.DateTimeFormat("en-GB", {
    timeZone: "America/Santiago",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).format(now);
  return { date, time };
}

export function buildPostFilePath(slug: string, date: string): string {
  const [year, month, day] = date.split("-");
  const monthName = SPANISH_MONTHS[Number(month) - 1];
  return `posts/${year}/${monthName}/${slug.replace(/-/g, "_")}_${day}_${month}.md`;
}

export function sanitizeImageFilename(filename: string): string | null {
  const basename = filename.split(/[\\/]/).pop() ?? "";
  const dotIdx = basename.lastIndexOf(".");
  if (dotIdx <= 0) return null;
  const extension = basename.slice(dotIdx + 1).toLowerCase();
  if (!(ALLOWED_IMAGE_EXTENSIONS as readonly string[]).includes(extension)) return null;
  const name = slugify(basename.slice(0, dotIdx));
  if (!name) return null;
  return `${name}.${extension}`;
}

export function buildImagePaths(slug: string, sanitizedFilename: string): {
  dataPath: string;
  markdownUrl: string;
} {
  const finalName = `${slug}-${sanitizedFilename}`;
  return {
    dataPath: `images/posts/${finalName}`,
    markdownUrl: `/images/posts/${finalName}`,
  };
}

export interface PostFields {
  title: string;
  slug: string;
  date: string;
  time: string;
  content: string;
}

export function buildPostMarkdown(fields: PostFields): string {
  return [
    "---",
    `title: ${fields.title}`,
    `slug: ${fields.slug}`,
    `date: ${fields.date}`,
    `time: ${fields.time}`,
    "---",
    "",
    fields.content.trim(),
    "",
  ].join("\n");
}
