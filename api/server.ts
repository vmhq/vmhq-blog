// Standalone Posts API server (Bun). No framework, no cloud dependency:
// run anywhere Bun runs with `bun run api/server.ts`.
import { handleRequest, type ApiEnv } from "./handler";

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
  GITHUB_TOKEN: requireEnv("GITHUB_TOKEN"),
  GITHUB_REPO: process.env.GITHUB_REPO ?? "vmhq/vmhq-blog",
  GITHUB_BRANCH: process.env.GITHUB_BRANCH ?? "main",
  SITE_URL: process.env.SITE_URL ?? "https://blog.vmhq.cl",
};

const port = Number(process.env.PORT ?? 8787);

Bun.serve({
  port,
  fetch: (request) => handleRequest(request, env),
});

console.log(`Posts API listening on http://localhost:${port} (repo: ${env.GITHUB_REPO}@${env.GITHUB_BRANCH})`);
