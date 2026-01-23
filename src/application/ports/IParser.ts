import type { FileEntity } from '../../domain/entities/FileEntity';

export interface IParser {
  readDataFilesToObject(dataFilePatterns: string[]): Promise<Record<string, any>>;
  fromFile(fileName: string, extractTitle?: boolean): Promise<FileEntity>;
  fromFilePatterns(filePatterns: string[], extractTitle?: boolean): Promise<FileEntity[]>;
}
