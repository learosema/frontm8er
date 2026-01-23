import { readDataFilesToObject } from '../../../src/utils/data-parser.ts';
import type { IDataFilesProvider } from '../../application/ports/IDataFilesProvider';

export const NodeDataFilesProvider: IDataFilesProvider = {
  async readDataFilesToObject(dataFilePatterns: string[]) {
    return readDataFilesToObject(dataFilePatterns);
  },
};
