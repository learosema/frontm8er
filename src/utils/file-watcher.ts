import chokidar from 'chokidar';
import path from 'path';

import { readDataFilesToObject } from './data-parser';
import { FileProcessorOptions } from './file-processor';
import { getFileTimes } from './file-times';
import { MatterParser } from './matter-parser';
import { pathUnjoin } from './path-unjoin';

export async function watchFrontmatterFiles({
  inputFilePatterns,
  dataFilePatterns,
  data = {},
  addCreated = false,
  addModified = false,
  inputFolder = '',
  outputFolder = '',
}: FileProcessorOptions) {
  const prefixedInputFilePatterns = inputFilePatterns.map((pattern) =>
    path.join(inputFolder, pattern)
  );
  const prefixedDataFilePatterns = dataFilePatterns.map((pattern) =>
    path.join(inputFolder, pattern)
  );

  let fileData = await readDataFilesToObject(prefixedDataFilePatterns);
  const inputWatcher = chokidar.watch(prefixedInputFilePatterns);
  const dataWatcher = chokidar.watch(prefixedDataFilePatterns);
  dataWatcher.on('all', async (eventName, filePath) => {
    console.info(`[data ] (${eventName}): ${filePath}`);
    fileData = await readDataFilesToObject(prefixedDataFilePatterns);
  });
  inputWatcher.on('all', async (eventName, filePath) => {
    console.info(`[input] (${eventName}): ${filePath}`);
    const newData = {
      ...fileData,
      ...data,
      ...(await getFileTimes(filePath, addCreated, addModified)),
    };
    const newFileName = path.join(
      outputFolder,
      pathUnjoin(filePath, inputFolder)
    );
    const md = await MatterParser.fromFile(filePath);
    md.withData(newData).save(newFileName);
  });
}
