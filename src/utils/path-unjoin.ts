import path from 'path';

/**
 * Reverse function of path.join
 *
 * @param filePath a path joined via path.join
 * @param prefix the prefixed path
 * @returns the file path without the prefix
 */
export function pathUnjoin(filePath: string, prefix: string) {
  if (prefix === '') {
    return filePath;
  }

  const osDependantPrefix = prefix.replace(/\/|\\/g, path.sep);
  return !osDependantPrefix.endsWith(path.sep)
    ? filePath.slice(osDependantPrefix.length + path.sep.length)
    : filePath.slice(osDependantPrefix.length);
}
