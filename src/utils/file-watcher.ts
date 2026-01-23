import chokidar, { FSWatcher } from 'chokidar';
import path from 'node:path';

import { isDataFile } from './data-parser.ts';
import type { FileProcessorOptions } from '../application/use-cases/processFrontmatterFiles.ts';
import { pathUnjoin } from '../shared/path-unjoin.ts';
import type { IParser } from '../application/ports/IParser';
import type { ILogger } from '../application/ports/ILogger';
import type { IFileTimesProvider } from '../application/ports/IFileTimesProvider';
import type { IDataFilesProvider } from '../application/ports/IDataFilesProvider';
import { NodeParserAdapter } from '../infrastructure/parsers/NodeParserAdapter.ts';
import { ConsoleLogger } from '../infrastructure/logger/ConsoleLogger.ts';
import { NodeFileTimesProvider } from '../infrastructure/file-times/NodeFileTimesProvider.ts';
import { NodeDataFilesProvider } from '../infrastructure/data/NodeDataFilesProvider.ts';
import { NodeFileRepository } from '../infrastructure/file-repository/NodeFileRepository.ts';
import type { IFileRepository } from '../application/ports/IFileRepository';

export function makeWatchFrontmatterFiles(
  parser: IParser,
  logger: ILogger,
  fileTimesProvider: IFileTimesProvider,
  fileRepository: IFileRepository,
  dataFilesProvider: IDataFilesProvider
) {
  return async function watchFrontmatterFiles({
  inputFilePatterns,
  dataFilePatterns,
  data = {},
  addCreated = false,
  addModified = false,
  inputFolder = '',
  outputFolder = '',
}: FileProcessorOptions): Promise<FSWatcher[]> {
  if (inputFolder === outputFolder) {
    throw Error('input and output folders must be different for watch mode.');
  }
  const prefixedInputFilePatterns = inputFilePatterns.map((pattern) =>
    path.join(inputFolder, pattern)
  );
  const prefixedDataFilePatterns = dataFilePatterns.map((pattern) =>
    path.join(inputFolder, pattern)
  );
  let fileData = await dataFilesProvider.readDataFilesToObject(prefixedDataFilePatterns);
  const inputWatcher = chokidar.watch(prefixedInputFilePatterns);
  const dataWatcher = chokidar.watch(prefixedDataFilePatterns);
  dataWatcher.on('all', async (eventName, filePath) => {
    if (!isDataFile(filePath)) {
      return;
    }
    logger.info(`[data ] (${eventName}): ${filePath}`);
    fileData = await dataFilesProvider.readDataFilesToObject(prefixedDataFilePatterns);
  });
  inputWatcher.on('all', async (eventName, filePath) => {
    if (!filePath.endsWith('.md')) {
      return;
    }
    logger.info(`[input] (${eventName}): ${filePath}`);
    const newData = {
      ...fileData,
      ...data,
      ...(await fileTimesProvider.getFileTimes(filePath, addCreated, addModified)),
    };
    const newFileName = path.join(outputFolder, pathUnjoin(filePath, inputFolder));
    const md = await parser.fromFile(filePath);
    const updated = md.withData(newData);
    await fileRepository.save(updated, newFileName);
  });
  return [dataWatcher, inputWatcher];
}

}

// default wired function for convenience/backwards-compatibility
export async function watchFrontmatterFiles(options: FileProcessorOptions): Promise<FSWatcher[]> {
  const fn = makeWatchFrontmatterFiles(
    NodeParserAdapter,
    ConsoleLogger,
    NodeFileTimesProvider,
    NodeFileRepository,
    NodeDataFilesProvider
  );
  return fn(options);
}
