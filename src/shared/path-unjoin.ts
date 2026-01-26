import path from 'node:path';

/**
 * Reverse of path.join — returns `filePath` with `prefix` removed.
 * Handles mixed separators robustly across platforms.
 */
export function pathUnjoin(filePath: string, prefix: string): string {
  if (!prefix) return filePath;

  const normalizedPrefix = prefix.replace(/\\/g, '/').replace(/\/+$/g, '');

  const segments = normalizedPrefix
    .split('/')
    .map((s) => s.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&'))
    .join('[\\\\/]');
  const rx = new RegExp('^' + segments + '[\\\\/]?');
  return filePath.replace(rx, '');
}
