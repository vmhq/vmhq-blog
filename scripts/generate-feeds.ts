import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { loadAllPosts } from "../api/posts-repo";
import { generateRSS, generateSitemap } from "../src/lib/feeds";

const SITE_URL = process.env.SITE_URL || "https://blog.vmhq.cl";

console.log(`Using SITE_URL: ${SITE_URL}`);

const posts = await loadAllPosts(process.cwd());
const outDir = join(process.cwd(), "public");
await mkdir(outDir, { recursive: true });

await writeFile(join(outDir, "rss.xml"), generateRSS(posts, SITE_URL), "utf-8");
console.log("Generated public/rss.xml");

await writeFile(join(outDir, "sitemap.xml"), generateSitemap(posts, SITE_URL), "utf-8");
console.log("Generated public/sitemap.xml");

