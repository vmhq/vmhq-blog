import { writeFileSync, mkdirSync, readdirSync, readFileSync } from "fs";
import { join, resolve } from "path";
import { Post, parseFrontmatter, getPostTimestamp, getPostLastMod } from "../src/lib/parse-post";

function collectMarkdownFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectMarkdownFiles(fullPath));
    } else if (entry.name.endsWith(".md")) {
      files.push(fullPath);
    }
  }
  return files;
}

function loadPosts(): Post[] {
  const postsDir = resolve(process.cwd(), "posts");
  return collectMarkdownFiles(postsDir)
    .map((file) => {
      const { data, body } = parseFrontmatter(readFileSync(file, "utf-8"));
      const post: Post = {
        slug: data.slug ?? "",
        title: data.title ?? "",
        date: data.date ?? "",
        time: data.time ?? undefined,
        content: body,
      };
      return post;
    })
    .filter((post) => {
      if (!post.slug || !post.title || !post.date) {
        console.warn(`Skipping post with missing required fields: slug="${post.slug}" title="${post.title}" date="${post.date}"`);
        return false;
      }
      return true;
    })
    .sort((a, b) => getPostTimestamp(b) - getPostTimestamp(a));
}

const SITE_URL = process.env.SITE_URL || "https://vmhq.blog";

console.log(`Using SITE_URL: ${SITE_URL}`);

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function safeTruncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  let truncated = str.slice(0, maxLen);
  // Avoid cutting in the middle of an escaped entity by backtracking to the last semicolon
  const lastAmp = truncated.lastIndexOf("&");
  const lastSemi = truncated.lastIndexOf(";");
  if (lastAmp > lastSemi) {
    truncated = truncated.slice(0, lastAmp);
  }
  return truncated + "...";
}

function generateRSS(posts: Post[]): string {
  const items = posts
    .map((post) => {
      const lastMod = getPostLastMod(post);
      const pubDate = new Date(lastMod).toUTCString();
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${SITE_URL}/post/${encodeURIComponent(post.slug)}</link>
      <guid isPermaLink="true">${SITE_URL}/post/${encodeURIComponent(post.slug)}</guid>
      <pubDate>${pubDate === "Invalid Date" ? lastMod : pubDate}</pubDate>
      <description>${escapeXml(safeTruncate(post.content, 200))}</description>
    </item>`;
    })
    .join("\n");

  const lastBuildDate = new Date().toUTCString();

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>vmhq</title>
    <link>${SITE_URL}</link>
    <description>Un espacio para pensar en voz alta.</description>
    <language>es</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${SITE_URL}/favicon.svg</url>
      <title>vmhq</title>
      <link>${SITE_URL}</link>
    </image>
${items}
  </channel>
</rss>`;
}

function generateSitemap(posts: Post[]): string {
  const now = new Date().toISOString().slice(0, 10);
  const urls = [
    `  <url><loc>${SITE_URL}/</loc><lastmod>${now}</lastmod></url>`,
    `  <url><loc>${SITE_URL}/about</loc><lastmod>${now}</lastmod></url>`,
    ...posts.map(
      (post) =>
        `  <url><loc>${SITE_URL}/post/${encodeURIComponent(post.slug)}</loc><lastmod>${getPostLastMod(post)}</lastmod></url>`
    ),
  ].join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

const posts = loadPosts();
const outDir = join(process.cwd(), "public");
mkdirSync(outDir, { recursive: true });

writeFileSync(join(outDir, "rss.xml"), generateRSS(posts), "utf-8");
console.log("Generated public/rss.xml");

writeFileSync(join(outDir, "sitemap.xml"), generateSitemap(posts), "utf-8");
console.log("Generated public/sitemap.xml");
