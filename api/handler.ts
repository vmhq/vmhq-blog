import { commitFilesToRepo, fileExistsInRepo, GitHubError, type CommitFile } from "./github";
import {
  buildImagePaths,
  buildPostFilePath,
  buildPostMarkdown,
  isValidDate,
  isValidSlug,
  isValidTime,
  MAX_CONTENT_BYTES,
  MAX_IMAGE_BYTES,
  MAX_IMAGES_PER_POST,
  sanitizeImageFilename,
  santiagoDateTime,
  slugify,
} from "./publish";

export interface ApiEnv {
  BLOG_API_TOKEN: string;
  GITHUB_TOKEN: string;
  GITHUB_REPO: string;
  GITHUB_BRANCH: string;
  SITE_URL: string;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

function timingSafeEqual(a: string, b: string): boolean {
  const encoder = new TextEncoder();
  const bytesA = encoder.encode(a);
  const bytesB = encoder.encode(b);
  if (bytesA.length !== bytesB.length) return false;
  let diff = 0;
  for (let i = 0; i < bytesA.length; i++) diff |= bytesA[i] ^ bytesB[i];
  return diff === 0;
}

function isAuthorized(request: Request, env: ApiEnv): boolean {
  if (!env.BLOG_API_TOKEN) return false;
  const header = request.headers.get("Authorization") ?? "";
  if (!header.startsWith("Bearer ")) return false;
  return timingSafeEqual(header.slice("Bearer ".length).trim(), env.BLOG_API_TOKEN);
}

function toBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

async function handlePublishPost(request: Request, env: ApiEnv): Promise<Response> {
  if (!isAuthorized(request, env)) {
    return json({ error: "Unauthorized. Send Authorization: Bearer <BLOG_API_TOKEN>." }, 401);
  }

  const contentType = request.headers.get("Content-Type") ?? "";
  if (!contentType.includes("multipart/form-data")) {
    return json({ error: "Content-Type must be multipart/form-data." }, 400);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ error: "Invalid multipart/form-data body." }, 400);
  }

  const title = (form.get("title") ?? "").toString().trim();
  const content = (form.get("content") ?? "").toString().trim();
  if (!title) return json({ error: "Field 'title' is required." }, 400);
  if (!content) return json({ error: "Field 'content' is required." }, 400);
  if (new TextEncoder().encode(content).length > MAX_CONTENT_BYTES) {
    return json({ error: `Field 'content' exceeds ${MAX_CONTENT_BYTES} bytes.` }, 400);
  }

  const now = santiagoDateTime(new Date());
  const slug = (form.get("slug") ?? "").toString().trim() || slugify(title);
  const date = (form.get("date") ?? "").toString().trim() || now.date;
  const time = (form.get("time") ?? "").toString().trim() || now.time;

  if (!isValidSlug(slug)) {
    return json({ error: `Invalid slug '${slug}'. Use lowercase letters, digits and hyphens.` }, 400);
  }
  if (!isValidDate(date)) {
    return json({ error: `Invalid date '${date}'. Use YYYY-MM-DD.` }, 400);
  }
  if (!isValidTime(time)) {
    return json({ error: `Invalid time '${time}'. Use HH:MM:SS (24h).` }, 400);
  }

  const imageEntries = form.getAll("images").filter((entry): entry is File => entry instanceof File);
  if (imageEntries.length > MAX_IMAGES_PER_POST) {
    return json({ error: `Too many images. Maximum is ${MAX_IMAGES_PER_POST} per post.` }, 400);
  }

  const github = { token: env.GITHUB_TOKEN, repo: env.GITHUB_REPO, branch: env.GITHUB_BRANCH };
  const postPath = buildPostFilePath(slug, date);

  const files: CommitFile[] = [
    { path: postPath, text: buildPostMarkdown({ title, slug, date, time, content }) },
  ];
  const publishedImages: Array<{ filename: string; repoPath: string; markdownUrl: string }> = [];

  for (const image of imageEntries) {
    const sanitized = sanitizeImageFilename(image.name);
    if (!sanitized) {
      return json(
        { error: `Invalid image '${image.name}'. Allowed extensions: png, jpg, jpeg, webp, gif, avif.` },
        400
      );
    }
    if (image.size > MAX_IMAGE_BYTES) {
      return json({ error: `Image '${image.name}' exceeds ${MAX_IMAGE_BYTES} bytes.` }, 413);
    }
    const paths = buildImagePaths(slug, sanitized);
    files.push({ path: paths.repoPath, base64: toBase64(await image.arrayBuffer()) });
    publishedImages.push({ filename: image.name, ...paths });
  }

  try {
    if (await fileExistsInRepo(github, postPath)) {
      return json({ error: `A post with slug '${slug}' already exists for ${date} (${postPath}).` }, 409);
    }

    const commit = await commitFilesToRepo(
      github,
      files,
      `feat: add post "${title}" (published via API)`
    );

    return json(
      {
        slug,
        title,
        date,
        time,
        url: `${env.SITE_URL}/post/${slug}`,
        post_path: postPath,
        images: publishedImages,
        commit: commit.sha,
        note: "The site rebuilds from the new commit; the post will be live in a few minutes.",
      },
      201
    );
  } catch (error) {
    if (error instanceof GitHubError) {
      return json({ error: `Publishing failed while talking to GitHub: ${error.message}` }, 502);
    }
    throw error;
  }
}

export async function handleRequest(request: Request, env: ApiEnv): Promise<Response> {
  const url = new URL(request.url);

  if (url.pathname === "/api/health") {
    return json({ status: "ok" });
  }

  if (url.pathname === "/api/posts") {
    if (request.method !== "POST") {
      return json({ error: "Method not allowed. Use POST." }, 405);
    }
    return handlePublishPost(request, env);
  }

  return json({ error: "Not found." }, 404);
}
