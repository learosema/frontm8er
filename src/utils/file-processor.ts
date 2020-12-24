import path from 'path';

import { readDataFilesToObject } from './data-parser';
import { MatterParser } from './matter-parser';
import { getFileTimes } from './file-times';
import { pathUnjoin } from './path-unjoin';

export type FileProcessorOptions = {
  inputFilePatterns: string[];
  dataFilePatterns: string[];
  data?: Record<string, any>;
  addCreated?: boolean;
  addModified?: boolean;
  inputFolder?: string;
  outputFolder?: string;
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
  inputFolder = '',
  outputFolder = '',
}: FileProcessorOptions): Promise<void> {
  const fileData: Record<string, any> = await readDataFilesToObject(
    dataFilePatterns.map((filePattern) => path.join(inputFolder, filePattern))
  );
  const inputContents: MatterParser[] = await MatterParser.fromFilePatterns(
    inputFilePatterns.map((filePattern) => path.join(inputFolder, filePattern))
  );
  if (inputContents.length === 0) {
    throw new Error('no input files.');
  }
  await Promise.all(
    inputContents.map(async (md) => {
      const additionalData = {
        ...fileData,
        ...data,
        ...(await getFileTimes(md.fileName, addCreated, addModified)),
      };
      console.info(`processing ${md.fileName}`);
      const outputFile = path.join(
        outputFolder,
        pathUnjoin(md.fileName, inputFolder)
      );
      return await md.withData(additionalData).save(outputFile);
    })
  );
}
