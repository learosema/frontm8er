import { promises as fsp } from 'fs';

import { readDataFiles } from './utils/data-parser';
import { MatterParser } from './utils/matter-parser';

async function getFileTimes(
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

export type processFrontMatterFilesArguments = {
  inputFilePatterns: string[];
  dataFilePatterns: string[];
  data?: Record<string, any>;
  addCreated?: boolean;
  addModified?: boolean;
};

/**
 * Process front matter files
 */
export async function processFrontmatterFiles({
  inputFilePatterns,
  dataFilePatterns,
  data = {},
  addCreated = false,
  addModified = false,
}: processFrontMatterFilesArguments): Promise<void> {
  const dataContents: object[] = await readDataFiles(dataFilePatterns);
  const fileData: object = Object.assign.apply(null, [{}, ...dataContents]);
  const inputContents: MatterParser[] = await MatterParser.fromFilePatterns(
    inputFilePatterns
  );
  await Promise.all(
    inputContents.map(async (md) => {
      const additionalData = {
        ...fileData,
        ...data,
        ...(await getFileTimes(md.fileName, addCreated, addModified)),
      };
      console.info(`processing ${md.fileName}`);
      return await md.withData(additionalData).save();
    })
  );
}
