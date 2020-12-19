import { promises as fsp } from 'fs';

export async function getFileTimes(
  fileName: string,
  addCreated: boolean,
  addModified: boolean
): Promise<Record<string, string>> {
  const result: Record<string, string> = {};
  if (!addCreated && !addModified) {
    return result;
  }
  const stats = await fsp.stat(fileName);
  if (addCreated) {
    result.created = stats.birthtime.toISOString();
  }
  if (addModified) {
    result.modified = stats.mtime.toISOString();
  }
  return result;
}
