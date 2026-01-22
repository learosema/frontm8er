import path from 'node:path';

import { getFileTimes } from '../../domain/file-times.ts';
import { pathUnjoin } from '../../shared/path-unjoin.ts';
import type { IParser, IMatterDocument } from '../ports/IParser';
import type { ILogger } from '../ports/ILogger';

export type FileProcessorOptions = {
  inputFilePatterns: string[];
  dataFilePatterns: string[];
  data?: Record<string, any>;
  addCreated?: boolean;
  addModified?: boolean;
  addTitle?: boolean;
  inputFolder?: string;
  outputFolder?: string;
};

/**
 * Create a `processFrontmatterFiles` use-case bound to a specific `IParser`.
 * This enables dependency injection for testing or alternative adapters.
 */
export function makeProcessFrontmatterFiles(parser: IParser, logger: ILogger) {
  return async function processFrontmatterFiles({
    inputFilePatterns,
    dataFilePatterns,
    data = {},
    addCreated = false,
    addModified = false,
    addTitle = false,
    inputFolder = '',
    outputFolder = '',
  }: FileProcessorOptions): Promise<void> {
    const fileData: Record<string, any> = await parser.readDataFilesToObject(
      dataFilePatterns.map((filePattern) => path.join(inputFolder, filePattern))
    );
    const inputContents = await parser.fromFilePatterns(
      inputFilePatterns.map((filePattern) => path.join(inputFolder, filePattern)),
      addTitle
    );
    if (inputContents.length === 0) {
      throw new Error('no input files.');
    }
    await Promise.all(
      inputContents.map(async (md: IMatterDocument) => {
        const additionalData = {
          ...fileData,
          ...data,
          ...(await getFileTimes(md.fileName, addCreated, addModified)),
        };
        logger.info(`processing ${md.fileName}`);
        const outputFile = path.join(outputFolder, pathUnjoin(md.fileName, inputFolder));
        return await md.withData(additionalData).save(outputFile);
      })
    );
  };
}
