import { promises as fsp } from 'fs';

import { readDataFiles } from './utils/data-parser';
import { MatterParser } from './utils/matter-parser';

async function getFileTimes(fileName, addCreated, addModified) {
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

/**
 * Process front matter files
 */
export async function processFrontmatterFiles({
  inputFilePatterns,
  dataFilePatterns,
  data = {},
  addCreated = false,
  addModified = false,
}): Promise<void> {
  const dataContents: object[] = await readDataFiles(dataFilePatterns);
  const fileData: object = Object.assign.apply(this, [{}, ...dataContents]);
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
      return await md.withData(additionalData).save();
    })
  );
}
