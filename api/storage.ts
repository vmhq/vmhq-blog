import { mkdir, stat, writeFile } from "node:fs/promises";
import { dirname, resolve, sep } from "node:path";

export interface StorageOptions {
  dataDir: string;
}

export interface WriteTextFile {
  path: string;
  text: string;
}

export interface WriteBinaryFile {
  path: string;
  base64: string;
}

export type WriteFile = WriteTextFile | WriteBinaryFile;

export class StorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StorageError";
  }
}

function resolveWithinDataDir(dataDir: string, relativePath: string): string {
  const root = resolve(dataDir);
  const target = resolve(root, relativePath);
  if (target !== root && !target.startsWith(root + sep)) {
    throw new StorageError(`Path '${relativePath}' escapes the data directory.`);
  }
  return target;
}

export async function fileExists(options: StorageOptions, relativePath: string): Promise<boolean> {
  try {
    await stat(resolveWithinDataDir(options.dataDir, relativePath));
    return true;
  } catch {
    return false;
  }
}

export async function writeFiles(options: StorageOptions, files: WriteFile[]): Promise<void> {
  for (const file of files) {
    const fullPath = resolveWithinDataDir(options.dataDir, file.path);
    await mkdir(dirname(fullPath), { recursive: true });
    if ("text" in file) {
      await writeFile(fullPath, file.text, "utf-8");
    } else {
      await writeFile(fullPath, Buffer.from(file.base64, "base64"));
    }
  }
}
