import { readDataFilesToObject } from '../../../src/utils/data-parser.ts';
import { MatterParser } from '../../../src/utils/matter-parser.ts';
import type { IParser, IMatterDocument } from '../../../src/application/ports/IParser';

class MatterDocumentAdapter implements IMatterDocument {
  private inner: MatterParser;
  constructor(m: MatterParser) {
    this.inner = m;
  }
  get fileName() {
    return this.inner.fileName;
  }
  get metaData() {
    return this.inner.metaData;
  }
  get content() {
    return this.inner.content;
  }
  get eol() {
    return this.inner.eol;
  }
  withData(data: Record<string, any>): IMatterDocument {
    return new MatterDocumentAdapter(this.inner.withData(data));
  }
  async save(fileName?: string): Promise<void> {
    return this.inner.save(fileName);
  }
}

export const NodeParserAdapter: IParser = {
  async readDataFilesToObject(dataFilePatterns: string[]) {
    return readDataFilesToObject(dataFilePatterns);
  },
  async fromFile(fileName: string, extractTitle = false) {
    const m = await MatterParser.fromFile(fileName, extractTitle);
    return new MatterDocumentAdapter(m);
  },
  async fromFilePatterns(filePatterns: string[], extractTitle = false) {
    const arr = await MatterParser.fromFilePatterns(filePatterns, extractTitle);
    return arr.map((m) => new MatterDocumentAdapter(m));
  },
};
