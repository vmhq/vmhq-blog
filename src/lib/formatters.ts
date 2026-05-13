const dateFormatter = new Intl.DateTimeFormat("es-ES", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export function formatDate(dateStr: string): string {
  const normalized = dateStr.includes("T") ? dateStr : `${dateStr}T00:00:00`;
  return dateFormatter.format(new Date(normalized));
}

export function readingTime(content: string): string {
  const trimmed = content.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min de lectura`;
}

export function markdownToPlainText(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/^[\s-]*[-*+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/[*_~|]/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z0-9#]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function summarizeMarkdown(markdown: string, maxLength = 160): string {
  const plainText = markdownToPlainText(markdown);
  if (plainText.length <= maxLength) return plainText;

  const truncated = plainText.slice(0, maxLength).trimEnd();
  const lastSpace = truncated.lastIndexOf(" ");
  const safeText = lastSpace > maxLength * 0.6 ? truncated.slice(0, lastSpace) : truncated;
  return `${safeText}...`;
}
