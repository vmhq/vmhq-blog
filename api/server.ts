// Standalone Posts API server (Bun). No framework, no cloud dependency:
// run anywhere Bun runs with `bun run api/server.ts`.
import { handleRequest, type ApiEnv } from "./handler";
import { seedDataDirIfEmpty } from "./seed";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing required environment variable: ${name}`);
    process.exit(1);
  }
  return value;
}

const env: ApiEnv = {
  BLOG_API_TOKEN: requireEnv("BLOG_API_TOKEN"),
  DATA_DIR: process.env.DATA_DIR ?? "./data",
  SITE_URL: process.env.SITE_URL ?? "https://blog.vmhq.cl",
};

// Locally, seed from the repo's existing posts/ and public/images/posts/ so
// `bun run api` works out of the box. In Docker, Dockerfile.api points these
// at a baked-in /app/seed copy instead.
const seedPostsDir = process.env.SEED_POSTS_DIR ?? "posts";
const seedImagesDir = process.env.SEED_IMAGES_DIR ?? "public/images/posts";

await seedDataDirIfEmpty(env.DATA_DIR, seedPostsDir, seedImagesDir);

const port = Number(process.env.PORT ?? 8787);

Bun.serve({
  port,
  fetch: (request) => handleRequest(request, env),
});

console.log(`Posts API listening on http://localhost:${port} (data dir: ${env.DATA_DIR})`);
