export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" });
}

export function readingTime(content: string): string {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min de lectura`;
}
