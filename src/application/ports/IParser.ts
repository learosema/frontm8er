import type { FileEntity } from '../../domain/entities/FileEntity';

/**
 * Parsing port — responsibility: parse data files and content files into domain entities.
 * Implementations wrap parsing libraries and return `FileEntity` domain objects.
 */
export interface IParser {
  /** Parse a single content file into a `FileEntity`. */
  fromFile(fileName: string, extractTitle?: boolean): Promise<FileEntity>;
  /** Parse multiple files matching patterns into `FileEntity[]`. */
  fromFilePatterns(filePatterns: string[], extractTitle?: boolean): Promise<FileEntity[]>;
}
