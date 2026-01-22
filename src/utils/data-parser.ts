import yaml from 'yaml';
import json5 from 'json5';
import { readFile } from 'node:fs/promises';

import { glob } from 'node:fs/promises'

const DATA_PATTERN = /\.(json|json5|yml|yaml)$/;

export function isDataFile(fileName: string): boolean {
  return DATA_PATTERN.test(fileName);
}

/**
 * Resolves all files from an array of file patterns
 *
 * @param {string[]} dataFilePatterns array of file patterns, eg. ['*.json', '*.yaml']
 * @returns {object[]} array of parsed files
 */
export async function readDataFiles(
  dataFilePatterns: string[]
): Promise<any[]> {
  
  const dataFiles = (
    await Array.fromAsync(
      dataFilePatterns.map(async (filePattern) => await Array.fromAsync(glob(filePattern)))
    )
  ).flat()
  
  const dataContents = dataFiles.flat().map(async (item) => {
    if (!isDataFile(item)) {
      return;
    }
    const content = await readFile(item, 'utf-8');
    if (/\.ya?ml$/.test(item)) {
      return yaml.parse(content);
    }
    return json5.parse(content);
  });
  return await Promise.all(dataContents);
}

export async function readDataFilesToObject(
  dataFilePatterns: string[]
): Promise<Record<string, any>> {
  const dataContents = await readDataFiles(dataFilePatterns);
  return Object.assign.apply(null, [{}, ...dataContents]);
}
