import { promises as fs } from 'fs';
import { resolve } from 'path';


export async function readFileAsync(path: string): Promise<string> {
  return await fs.readFile(path, "binary");
}

export async function readDirectoryAsync(dir: string): Promise<string[]> {
  return await fs.readdir(dir);
}

export async function isDirectoryAsync(path: string): Promise<boolean> {
  return (await fs.lstat(path)).isDirectory();
}

export async function traverseDirectoryAsync(
    dir: string, 
    fn: (filePath: string) => Promise<any | void>
  ): Promise<any| void> {
  const files = await readDirectoryAsync(dir)
  for (const file of files) {
    const path = resolve(dir, file);
    if (await isDirectoryAsync(path)) {
      await traverseDirectoryAsync(path, fn);
    } else {
      await fn(path);
    }
  }
}

