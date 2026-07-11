import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { parseFrontmatter, type Post } from "../src/lib/parse-post";
import { createPost, isValidPost, sortPostsByNewest } from "../src/lib/post-model";

async function collectMarkdownFiles(dir: string): Promise<string[]> {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }

  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectMarkdownFiles(fullPath)));
    } else if (entry.name.endsWith(".md")) {
      files.push(fullPath);
    }
  }
  return files;
}

export async function loadAllPosts(dataDir: string): Promise<Post[]> {
  const files = await collectMarkdownFiles(join(dataDir, "posts"));
  const posts = await Promise.all(
    files.map(async (file) => {
      const raw = await readFile(file, "utf-8");
      const { data, body } = parseFrontmatter(raw);
      return createPost(data, body);
    })
  );
  return sortPostsByNewest(posts.filter(isValidPost));
}
