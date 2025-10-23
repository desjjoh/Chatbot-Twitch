import fs from 'fs/promises';

export async function fileExists(p: string): Promise<boolean> {
  return fs
    .access(p)
    .then(() => true)
    .catch(() => false);
}

export async function fileTooBig(p: string, max_size: number): Promise<boolean> {
  const stat = await fs.stat(p);
  const sizeMB = stat.size / (1024 * 1024);
  return sizeMB >= max_size;
}

export function formatBlock(data: Record<string, any>): string {
  const KEY_WIDTH = 10;
  return Object.entries(data)
    .map(([k, v]) => {
      const val =
        typeof v === 'object' ? JSON.stringify(v, null, 2).replace(/^/gm, '\t') : JSON.stringify(v);
      return `\t${k.toUpperCase().padEnd(KEY_WIDTH)} : ${val}`;
    })
    .join('\n');
}
