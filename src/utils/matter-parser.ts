import yaml from 'yaml';
import { access, glob, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

/**
 * Class for parsing a markdown file into frontmatter and content
 */
export class MatterParser {

  public fileName: string;
  public metaData: Record<string, any>;
  public content: string;
  public eol: string;

  /**
   * Creates a markdown file instance
   * @param fileName the file name
   * @param metaData the parsed frontmatter
   * @param content the content body
   * @param eol the line-ending style used (\n or \r\n)
   */
  constructor(
    fileName: string,
    metaData: Record<string, any>,
    content: string,
    eol = '\n',
  ) {
    this.fileName = fileName;
    this.metaData = metaData;
    this.content = content;
    this.eol = eol;
  }

  /**
   * Read file
   * @param fileName the file name
   * @returns the parser instance
   */
  static async fromFile(fileName: string, extractTitle = false): Promise<MatterParser> {
    const content = await readFile(fileName, 'utf8');
    return MatterParser.fromString(content, fileName, extractTitle);
  }

  /**
   * Read file from string
   * @param content contents of the frontmatter file
   * @param fileName the fileName to be used when saved
   * @returns {MatterParser} the parser instance
   */
  static fromString(content = '', fileName = 'output.md', extractTitle = false): MatterParser {
    // determine line endings by looking at the first appearance of \n or \r\n
    const eol = (content.match(/\n|\r\n/) || ['\n'])[0];
    const marker = '---' + eol;
    const metaData: Record<string, any> = {};

    if (extractTitle) {
      const title = content.match(/^# (.*)$/m)?.[1];
      if (title) {
        metaData.title = title;
      }
    }

    // normalize line endings in case of mixed LF/CRLF
    let normalizedContent = content.replace(/\n|\r\n/g, eol);
    if (normalizedContent.startsWith(marker)) {
      const frontMatterEnd = normalizedContent.indexOf(marker, marker.length);
      const frontMatter = normalizedContent.slice(
        marker.length,
        frontMatterEnd
      );
      normalizedContent = normalizedContent.slice(
        frontMatterEnd + marker.length
      );
      Object.assign(metaData, yaml.parse(frontMatter));
    }
    return new MatterParser(fileName, metaData, normalizedContent, eol);
  }

  /**
   * Resolves all frontmatter files from an array of file patterns
   *
   * @param inputFilePatterns array of file patterns, eg ['README.md','src/*.md']
   * @returns Array of MatterParser instances
   */
  static async fromFilePatterns(
    filePatterns: string[],
    extractTitle = false
  ): Promise<MatterParser[]> {
    const inputFiles = (await Array.fromAsync(filePatterns.map(async (pattern) => await Array.fromAsync(glob(pattern))))).flat()

    return await Promise.all(
      inputFiles
        .filter((fileName) => fileName.endsWith('.md'))
        .map((fileName) => MatterParser.fromFile(fileName, extractTitle))
    );
  }

  /**
   * Creates a clone of the instance and additionally adds data
   * @param data any data to be added to the file
   */
  withData(data: Record<string, any>): MatterParser {
    const { metaData, content, fileName, eol } = this;
    return new MatterParser(fileName, { ...metaData, ...data }, content, eol);
  }

  /**
   * Serializes the instance to string
   */
  toString(): string {
    const { content, metaData, eol } = this;
    if (Object.keys(metaData).length === 0) {
      return content;
    }
    const frontMatter = ('---\n' + yaml.stringify(metaData) + '---\n').replace(
      /\n/g,
      eol
    );
    return frontMatter + content;
  }

  /**
   * Save the file.
   *
   * @param fileName new filename; if not provided, the file is overwritten
   */
  async save(fileName?: string): Promise<void> {
    if (fileName) {
      this.fileName = fileName;
    }
    const dirName = path.dirname(this.fileName);
    let directoryExists = true;
    try {
      await access(dirName);
    } catch (ex) {
      directoryExists = false;
    }
    if (!directoryExists) {
      await mkdir(dirName, { recursive: true });
    }
    return await writeFile(this.fileName, this.toString(), 'utf8');
  }
}
