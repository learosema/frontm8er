import path from 'node:path';

/**
 * Reverse function of path.join. Handles mixed separators robustly.
 *
 * @param filePath a path joined via path.join (may use either separator)
 * @param prefix the prefixed path (may use either separator)
 * @returns the file path without the prefix
 */
export function pathUnjoin(filePath: string, prefix: string): string {
  if (!prefix) return filePath;

  // Normalize the prefix to forward slashes and trim trailing separators
  const normalizedPrefix = prefix.replace(/\\/g, '/').replace(/\/\/+$/g, '');

  // Build a regex that matches the prefix with either '/' or '\\' as separators
  const segments = normalizedPrefix
    .split('/')
    .map((s) => s.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&'))
    .join('[\\\\/]');
  const rx = new RegExp('^' + segments + '[\\\\/]?');
  return filePath.replace(rx, '');
}
