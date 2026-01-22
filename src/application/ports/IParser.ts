export interface IMatterDocument {
  fileName: string;
  metaData: Record<string, any>;
  content: string;
  eol: string;
  withData(data: Record<string, any>): IMatterDocument;
  save(fileName?: string): Promise<void>;
}

export interface IParser {
  readDataFilesToObject(dataFilePatterns: string[]): Promise<Record<string, any>>;
  fromFile(fileName: string, extractTitle?: boolean): Promise<IMatterDocument>;
  fromFilePatterns(filePatterns: string[], extractTitle?: boolean): Promise<IMatterDocument[]>;
}
