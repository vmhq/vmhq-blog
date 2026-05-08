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
