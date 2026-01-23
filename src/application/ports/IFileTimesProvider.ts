export interface IFileTimesProvider {
  getFileTimes(fileName: string, addCreated: boolean, addModified: boolean): Promise<Record<string, string>>;
}
