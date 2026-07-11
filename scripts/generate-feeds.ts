import { writeFileSync, mkdirSync, readdirSync, readFileSync, existsSync } from "fs";
import { join, resolve } from "path";
import { parseFrontmatter, type Post } from "../src/lib/parse-post";
import { createPost, isValidPost, sortPostsByNewest } from "../src/lib/post-model";
import { generateRSS, generateSitemap } from "../src/lib/feeds";

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
  if (!existsSync(postsDir)) return [];
  return sortPostsByNewest(collectMarkdownFiles(postsDir)
    .map((file) => {
      const { data, body } = parseFrontmatter(readFileSync(file, "utf-8"));
      return createPost(data, body);
    })
    .filter((post) => {
      if (!isValidPost(post)) {
        console.warn(`Skipping post with missing required fields: slug="${post.slug}" title="${post.title}" date="${post.date}"`);
        return false;
      }
      return true;
    }));
}

const SITE_URL = process.env.SITE_URL || "https://blog.vmhq.cl";

console.log(`Using SITE_URL: ${SITE_URL}`);

const posts = loadPosts();
const outDir = join(process.cwd(), "public");
mkdirSync(outDir, { recursive: true });

writeFileSync(join(outDir, "rss.xml"), generateRSS(posts, SITE_URL), "utf-8");
console.log("Generated public/rss.xml");

writeFileSync(join(outDir, "sitemap.xml"), generateSitemap(posts, SITE_URL), "utf-8");
console.log("Generated public/sitemap.xml");
