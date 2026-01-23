export interface FileEntity {
  fileName: string;
  metaData: Record<string, any>;
  content: string;
  eol: string;
  withData(data: Record<string, any>): FileEntity;
  save(fileName?: string): Promise<void>;
}
