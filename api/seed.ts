import { cp, mkdir, readdir } from "node:fs/promises";

async function isEmptyDir(dir: string): Promise<boolean> {
  try {
    const entries = await readdir(dir);
    return entries.length === 0;
  } catch {
    return true;
  }
}

async function seedInto(destDir: string, sourceDir: string | undefined): Promise<void> {
  if (!sourceDir) return;
  if (!(await isEmptyDir(destDir))) return;
  try {
    await mkdir(destDir, { recursive: true });
    await cp(sourceDir, destDir, { recursive: true });
    console.log(`Seeded ${destDir} from ${sourceDir}`);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return;
    console.warn(`Seed of ${destDir} skipped: ${(error as Error).message}`);
  }
}

export async function seedDataDirIfEmpty(
  dataDir: string,
  seedPostsDir: string | undefined,
  seedImagesDir: string | undefined
): Promise<void> {
  await seedInto(`${dataDir}/posts`, seedPostsDir);
  await seedInto(`${dataDir}/images/posts`, seedImagesDir);
}
