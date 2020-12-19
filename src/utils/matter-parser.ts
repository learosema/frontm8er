import yaml from 'yaml';
import { promises as fsp } from 'fs';
import glob from 'glob';
import { promisify } from 'util';

/**
 * Class for parsing a markdown file into frontmatter and content
 */
export class MatterParser {
  /**
   * Creates a markdown file instance
   * @param fileName the file name
   * @param metaData the parsed frontmatter
   * @param content the content body
   * @param eol the line-ending style used (\n or \r\n)
   */
  constructor(
    public fileName: string,
    public metaData: Record<string, any>,
    public content: string,
    public eol = '\n'
  ) {}

  /**
   * Read file
   * @param fileName the file name
   * @returns the parser instance
   */
  static async fromFile(fileName: string): Promise<MatterParser> {
    const content = await fsp.readFile(fileName, 'utf8');
    return MatterParser.fromString(content, fileName);
  }

  /**
   * Read file from string
   * @param content contents of the frontmatter file
   * @param fileName the fileName to be used when saved
   * @returns {MatterParser} the parser instance
   */
  static fromString(content = '', fileName = 'output.md'): MatterParser {
    // determine line endings by looking at the first appearance of \n or \r\n
    const eol = (content.match(/\n|\r\n/) || ['\n'])[0];
    // normalize line endings in case of mixed LF/CRLF
    let normalizedContent = content.replace(/\n|\r\n/g, eol);
    const marker = '---' + eol;
    const metaData = {};
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
    filePatterns: string[]
  ): Promise<MatterParser[]> {
    const resolveInputFiles = Promise.all(
      filePatterns.map(
        (item: string) => promisify(glob)(item) as Promise<string[]>
      )
    );

    const inputFiles = (await resolveInputFiles).flat();
    return await Promise.all(
      inputFiles.map((fileName) => MatterParser.fromFile(fileName))
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
   */
  save(): Promise<void> {
    return fsp.writeFile(this.fileName, this.toString(), 'utf8');
  }
}
