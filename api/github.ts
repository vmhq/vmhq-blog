const GITHUB_API = "https://api.github.com";

export interface CommitTextFile {
  path: string;
  text: string;
}

export interface CommitBinaryFile {
  path: string;
  base64: string;
}

export type CommitFile = CommitTextFile | CommitBinaryFile;

export class GitHubError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = "GitHubError";
  }
}

interface GitHubClientOptions {
  token: string;
  repo: string;
  branch: string;
}

async function ghFetch(
  options: GitHubClientOptions,
  path: string,
  init?: { method?: string; body?: unknown }
): Promise<Response> {
  const response = await fetch(`${GITHUB_API}/repos/${options.repo}${path}`, {
    method: init?.method ?? "GET",
    headers: {
      Authorization: `Bearer ${options.token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "vmhq-blog-posts-api",
      ...(init?.body !== undefined ? { "Content-Type": "application/json" } : {}),
    },
    body: init?.body !== undefined ? JSON.stringify(init.body) : undefined,
  });
  return response;
}

async function ghJson<T>(
  options: GitHubClientOptions,
  path: string,
  init?: { method?: string; body?: unknown }
): Promise<T> {
  const response = await ghFetch(options, path, init);
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new GitHubError(
      `GitHub API ${init?.method ?? "GET"} ${path} failed (${response.status}): ${detail.slice(0, 300)}`,
      response.status
    );
  }
  return (await response.json()) as T;
}

export async function fileExistsInRepo(
  options: GitHubClientOptions,
  path: string
): Promise<boolean> {
  const response = await ghFetch(
    options,
    `/contents/${encodeURIComponent(path).replace(/%2F/g, "/")}?ref=${options.branch}`
  );
  if (response.status === 404) return false;
  if (!response.ok) {
    throw new GitHubError(`GitHub API contents check failed (${response.status})`, response.status);
  }
  return true;
}

export async function commitFilesToRepo(
  options: GitHubClientOptions,
  files: CommitFile[],
  message: string
): Promise<{ sha: string }> {
  const ref = await ghJson<{ object: { sha: string } }>(
    options,
    `/git/ref/heads/${options.branch}`
  );
  const parentSha = ref.object.sha;

  const parentCommit = await ghJson<{ tree: { sha: string } }>(
    options,
    `/git/commits/${parentSha}`
  );

  const treeEntries: Array<{ path: string; mode: "100644"; type: "blob"; content?: string; sha?: string }> = [];
  for (const file of files) {
    if ("text" in file) {
      treeEntries.push({ path: file.path, mode: "100644", type: "blob", content: file.text });
    } else {
      const blob = await ghJson<{ sha: string }>(options, "/git/blobs", {
        method: "POST",
        body: { content: file.base64, encoding: "base64" },
      });
      treeEntries.push({ path: file.path, mode: "100644", type: "blob", sha: blob.sha });
    }
  }

  const tree = await ghJson<{ sha: string }>(options, "/git/trees", {
    method: "POST",
    body: { base_tree: parentCommit.tree.sha, tree: treeEntries },
  });

  const commit = await ghJson<{ sha: string }>(options, "/git/commits", {
    method: "POST",
    body: { message, tree: tree.sha, parents: [parentSha] },
  });

  await ghJson(options, `/git/refs/heads/${options.branch}`, {
    method: "PATCH",
    body: { sha: commit.sha },
  });

  return { sha: commit.sha };
}
