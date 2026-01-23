/**
 * Port for reading supplemental data files (JSON/YAML) and merging into an object.
 * This is separate from `IParser` which is focused on parsing content files.
 */
export interface IDataFilesProvider {
  /**
   * Read data files matching the provided patterns and merge into a single object.
   * @param dataFilePatterns glob patterns (already prefixed by input folder when called)
   */
  readDataFilesToObject(dataFilePatterns: string[]): Promise<Record<string, any>>;
}
