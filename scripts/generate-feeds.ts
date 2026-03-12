import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

interface Post {
  slug: string;
  title: string;
  date: string;
  content: string;
}

const posts: Post[] = [
  {
    slug: "sobre-la-simplicidad",
    title: "Sobre la simplicidad",
    date: "2026-03-10",
    content: "La simplicidad no es la ausencia de complejidad, sino su resolución.",
  },
  {
    slug: "notas-sobre-la-escritura",
    title: "Notas sobre la escritura",
    date: "2026-03-05",
    content: "Escribir no es transcribir pensamientos. Es descubrirlos.",
  },
  {
    slug: "el-valor-del-silencio-digital",
    title: "El valor del silencio digital",
    date: "2026-02-20",
    content: "Hay una diferencia entre estar desconectado y estar en silencio.",
  },
];

const SITE_URL = "https://vmhq.blog";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function generateRSS(): string {
  const sorted = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const items = sorted
    .map(
      (post) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${SITE_URL}/post/${post.slug}</link>
      <guid>${SITE_URL}/post/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${escapeXml(post.content.slice(0, 200))}...</description>
    </item>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>vmhq</title>
    <link>${SITE_URL}</link>
    <description>Un espacio para pensar en voz alta.</description>
    <language>es</language>
${items}
  </channel>
</rss>`;
}

function generateSitemap(): string {
  const sorted = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const urls = [
    `  <url><loc>${SITE_URL}/</loc></url>`,
    `  <url><loc>${SITE_URL}/about</loc></url>`,
    ...sorted.map(
      (post) =>
        `  <url><loc>${SITE_URL}/post/${post.slug}</loc><lastmod>${post.date}</lastmod></url>`
    ),
  ].join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

const outDir = join(process.cwd(), "public");
mkdirSync(outDir, { recursive: true });

writeFileSync(join(outDir, "rss.xml"), generateRSS(), "utf-8");
console.log("Generated public/rss.xml");

writeFileSync(join(outDir, "sitemap.xml"), generateSitemap(), "utf-8");
console.log("Generated public/sitemap.xml");
