import { stat } from 'node:fs/promises';
import type { IFileTimesProvider } from '../../application/ports/IFileTimesProvider';

export const NodeFileTimesProvider: IFileTimesProvider = {
  async getFileTimes(fileName: string, addCreated: boolean, addModified: boolean) {
    const result: Record<string, string> = {};
    if (!addCreated && !addModified) return result;
    const stats = await stat(fileName);
    if (addCreated) result.created = stats.birthtime.toISOString();
    if (addModified) result.modified = stats.mtime.toISOString();
    return result;
  },
};
