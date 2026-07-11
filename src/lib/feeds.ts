import type { Post } from "./parse-post";
import { summarizeMarkdown } from "./formatters";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function generateRSS(posts: Post[], siteUrl: string): string {
  const items = posts
    .map((post) => {
      const pubDate = new Date(post.lastModified).toUTCString();
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${siteUrl}/post/${encodeURIComponent(post.slug)}</link>
      <guid isPermaLink="true">${siteUrl}/post/${encodeURIComponent(post.slug)}</guid>
      <pubDate>${pubDate === "Invalid Date" ? post.lastModified : pubDate}</pubDate>
      <description>${escapeXml(summarizeMarkdown(post.content, 200))}</description>
    </item>`;
    })
    .join("\n");

  const lastBuildDate = new Date().toUTCString();

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>vmhq</title>
    <link>${siteUrl}</link>
    <description>Un espacio para pensar en voz alta.</description>
    <language>es</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${siteUrl}/favicon.svg</url>
      <title>vmhq</title>
      <link>${siteUrl}</link>
    </image>
${items}
  </channel>
</rss>`;
}

export function generateSitemap(posts: Post[], siteUrl: string): string {
  const now = new Date().toISOString().slice(0, 10);
  const urls = [
    `  <url><loc>${siteUrl}/</loc><lastmod>${now}</lastmod></url>`,
    `  <url><loc>${siteUrl}/about</loc><lastmod>${now}</lastmod></url>`,
    ...posts.map(
      (post) =>
        `  <url><loc>${siteUrl}/post/${encodeURIComponent(post.slug)}</loc><lastmod>${post.lastModified}</lastmod></url>`
    ),
  ].join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}
