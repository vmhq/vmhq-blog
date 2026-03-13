import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { getAllPosts } from "../src/lib/posts";

const SITE_URL = "https://vmhq.blog";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function generateRSS(): string {
  const sorted = getAllPosts();

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
  const sorted = getAllPosts();

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
