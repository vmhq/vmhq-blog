import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mkdtemp, rm, writeFile, mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { handleRequest, type ApiEnv } from "./handler";

let dataDir: string;
let env: ApiEnv;

beforeEach(async () => {
  dataDir = await mkdtemp(join(tmpdir(), "vmhq-api-test-"));
  env = { BLOG_API_TOKEN: "secret-token", DATA_DIR: dataDir, SITE_URL: "https://example.test" };
});

afterEach(async () => {
  await rm(dataDir, { recursive: true, force: true });
});

async function seedPost(relativePath: string, frontmatter: Record<string, string>, body: string) {
  const fullPath = join(dataDir, "posts", relativePath);
  await mkdir(join(fullPath, ".."), { recursive: true });
  const front = Object.entries(frontmatter)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");
  await writeFile(fullPath, `---\n${front}\n---\n${body}\n`, "utf-8");
}

describe("GET /api/health", () => {
  it("responds ok without auth", async () => {
    const res = await handleRequest(new Request("http://x/api/health"), env);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: "ok" });
  });
});

describe("GET /api/posts", () => {
  it("returns an empty array when there is no data yet", async () => {
    const res = await handleRequest(new Request("http://x/api/posts"), env);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([]);
  });

  it("returns parsed posts sorted newest first, without auth", async () => {
    await seedPost("2026/enero/a.md", { slug: "a", title: "A", date: "2026-01-01" }, "Body A");
    await seedPost("2026/febrero/b.md", { slug: "b", title: "B", date: "2026-02-01" }, "Body B");

    const res = await handleRequest(new Request("http://x/api/posts"), env);
    const posts = await res.json();
    expect(posts.map((p: { slug: string }) => p.slug)).toEqual(["b", "a"]);
  });
});

describe("POST /api/posts", () => {
  function publishRequest(form: FormData, token?: string) {
    return new Request("http://x/api/posts", {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    });
  }

  it("rejects requests without a valid bearer token", async () => {
    const form = new FormData();
    form.set("title", "Hello");
    form.set("content", "World");
    const res = await handleRequest(publishRequest(form), env);
    expect(res.status).toBe(401);
  });

  it("writes the post to DATA_DIR and makes it available via GET /api/posts", async () => {
    const form = new FormData();
    form.set("title", "Mi Post");
    form.set("content", "Contenido del post");
    form.set("slug", "mi-post");
    form.set("date", "2026-05-10");

    const publishRes = await handleRequest(publishRequest(form, "secret-token"), env);
    expect(publishRes.status).toBe(201);
    const body = await publishRes.json();
    expect(body.post_path).toBe("posts/2026/mayo/mi_post_10_05.md");

    const listRes = await handleRequest(new Request("http://x/api/posts"), env);
    const posts = await listRes.json();
    expect(posts).toHaveLength(1);
    expect(posts[0].slug).toBe("mi-post");
  });

  it("returns 409 for a duplicate slug/date", async () => {
    const form = () => {
      const f = new FormData();
      f.set("title", "Dup");
      f.set("content", "Contenido");
      f.set("slug", "dup");
      f.set("date", "2026-05-10");
      return f;
    };
    await handleRequest(publishRequest(form(), "secret-token"), env);
    const res = await handleRequest(publishRequest(form(), "secret-token"), env);
    expect(res.status).toBe(409);
  });
});

describe("GET /rss.xml and /sitemap.xml", () => {
  it("generate feeds from DATA_DIR on demand", async () => {
    await seedPost("2026/enero/a.md", { slug: "a", title: "A", date: "2026-01-01" }, "Body A");

    const rss = await handleRequest(new Request("http://x/rss.xml"), env);
    expect(rss.headers.get("Content-Type")).toContain("application/rss+xml");
    expect(await rss.text()).toContain("<title>A</title>");

    const sitemap = await handleRequest(new Request("http://x/sitemap.xml"), env);
    expect(sitemap.headers.get("Content-Type")).toContain("application/xml");
    expect(await sitemap.text()).toContain("https://example.test/post/a");
  });
});

describe("GET /images/posts/:file", () => {
  it("serves an image written under DATA_DIR/images/posts", async () => {
    await mkdir(join(dataDir, "images", "posts"), { recursive: true });
    await writeFile(join(dataDir, "images", "posts", "foo.png"), Buffer.from([1, 2, 3]));

    const res = await handleRequest(new Request("http://x/images/posts/foo.png"), env);
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("image/png");
  });

  it("rejects path traversal attempts", async () => {
    const res = await handleRequest(new Request("http://x/images/posts/..%2F..%2Fetc%2Fpasswd"), env);
    expect(res.status).toBe(404);
  });

  it("returns 404 for missing files", async () => {
    const res = await handleRequest(new Request("http://x/images/posts/missing.png"), env);
    expect(res.status).toBe(404);
  });
});
