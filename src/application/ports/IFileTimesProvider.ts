/**
 * Port for obtaining file timestamp metadata.
 * Implementations may read from the filesystem or a mocked provider for tests.
 */
export interface IFileTimesProvider {
  /**
   * Return a map of timestamp keys (e.g. `created`, `modified`) when requested.
   * @param fileName file path to inspect
   * @param addCreated include `created` timestamp when true
   * @param addModified include `modified` timestamp when true
   */
  getFileTimes(fileName: string, addCreated: boolean, addModified: boolean): Promise<Record<string, string>>;
}
