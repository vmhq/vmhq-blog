import { writeFileSync, mkdirSync, readdirSync, readFileSync } from "fs";
import { join, resolve } from "path";

interface Post {
  slug: string;
  title: string;
  date: string;
  time?: string;
  content: string;
}

function parseFrontmatter(raw: string): { data: Record<string, string>; body: string } {
  if (!raw.startsWith("---")) return { data: {}, body: raw };
  const end = raw.indexOf("---", 3);
  if (end === -1) return { data: {}, body: raw };
  const frontmatter = raw.slice(3, end).trim();
  const body = raw.slice(end + 3).trim();
  const data: Record<string, string> = {};
  for (const line of frontmatter.split("\n")) {
    const colonIdx = line.indexOf(":");
    if (colonIdx > 0) {
      data[line.slice(0, colonIdx).trim()] = line.slice(colonIdx + 1).trim();
    }
  }
  return { data, body };
}

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

function getPostTimestamp(post: Pick<Post, "date" | "time">): number {
  if (!post.date) return 0;
  const normalized = post.date.includes("T")
    ? post.date
    : post.time
      ? `${post.date}T${post.time}`
      : `${post.date}T00:00:00`;
  const ts = new Date(normalized).getTime();
  return Number.isNaN(ts) ? 0 : ts;
}

function getPostLastMod(post: Pick<Post, "date" | "time">): string {
  return post.time ? `${post.date}T${post.time}` : post.date;
}

function loadPosts(): Post[] {
  const postsDir = resolve(process.cwd(), "posts");
  return collectMarkdownFiles(postsDir)
    .map((file) => {
      const { data, body } = parseFrontmatter(readFileSync(file, "utf-8"));
      return {
        slug: data.slug ?? "",
        title: data.title ?? "",
        date: data.date ?? "",
        time: data.time ?? undefined,
        content: body,
      };
    })
    .sort((a, b) => getPostTimestamp(b) - getPostTimestamp(a));
}

// Resolve site URL from Vercel environment variables at build time.
// VERCEL_PROJECT_PRODUCTION_URL is the primary production domain assigned to
// the project (e.g. "vmhq-blog.vercel.app" or a custom domain like "vmhq.blog").
// VERCEL_URL is the unique deployment URL for preview/branch deploys.
// The fallback guarantees the script still works in local development.
const SITE_URL = (() => {
  const raw =
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.VERCEL_URL ??
    "localhost:8080";
  // Vercel env vars don't include the protocol
  return raw.startsWith("http") ? raw : `https://${raw}`;
})();

console.log(`Using SITE_URL: ${SITE_URL}`);

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function generateRSS(posts: Post[]): string {
  const items = posts
    .map(
      (post) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${SITE_URL}/post/${post.slug}</link>
      <guid>${SITE_URL}/post/${post.slug}</guid>
      <pubDate>${new Date(getPostLastMod(post)).toUTCString()}</pubDate>
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

function generateSitemap(posts: Post[]): string {
  const urls = [
    `  <url><loc>${SITE_URL}/</loc></url>`,
    `  <url><loc>${SITE_URL}/about</loc></url>`,
    ...posts.map(
      (post) =>
        `  <url><loc>${SITE_URL}/post/${post.slug}</loc><lastmod>${getPostLastMod(post)}</lastmod></url>`
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
