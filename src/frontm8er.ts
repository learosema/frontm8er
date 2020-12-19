import { readDataFiles } from './utils/data-parser';
import { getFileTimes } from './utils/file-times';
import { MatterParser } from './utils/matter-parser';

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
async function processFrontmatterFiles({
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

export { MatterParser, readDataFiles, processFrontmatterFiles };
