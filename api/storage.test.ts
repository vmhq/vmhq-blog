import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileExists, StorageError, writeFiles } from "./storage";

let dataDir: string;

beforeEach(async () => {
  dataDir = await mkdtemp(join(tmpdir(), "vmhq-storage-test-"));
});

afterEach(async () => {
  await rm(dataDir, { recursive: true, force: true });
});

describe("writeFiles", () => {
  it("writes text and binary files, creating directories as needed", async () => {
    await writeFiles(
      { dataDir },
      [
        { path: "posts/2026/enero/a.md", text: "hola" },
        { path: "images/posts/a.png", base64: Buffer.from("img").toString("base64") },
      ]
    );

    expect(await readFile(join(dataDir, "posts/2026/enero/a.md"), "utf-8")).toBe("hola");
    expect(await readFile(join(dataDir, "images/posts/a.png"), "utf-8")).toBe("img");
  });

  it("rejects paths that escape the data dir", async () => {
    await expect(
      writeFiles({ dataDir }, [{ path: "../outside.md", text: "nope" }])
    ).rejects.toThrow(StorageError);
  });
});

describe("fileExists", () => {
  it("returns false for missing files and true after writing", async () => {
    expect(await fileExists({ dataDir }, "posts/x.md")).toBe(false);
    await writeFiles({ dataDir }, [{ path: "posts/x.md", text: "x" }]);
    expect(await fileExists({ dataDir }, "posts/x.md")).toBe(true);
  });

  it("returns false rather than throwing for a path that escapes the data dir", async () => {
    expect(await fileExists({ dataDir }, "../outside.md")).toBe(false);
  });
});
