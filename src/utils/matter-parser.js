const yaml = require('yaml');
const fsp = require('fs').promises;
const glob = require('glob');
const { promisify } = require('util');
const { EOL } = require('os');

/**
 * Class for parsing a markdown file into frontmatter and content
 */
class MatterParser {
  /**
   * Creates a markdown file instance
   * @param {string} fileName the file name
   * @param {object} metaData the parsed frontmatter
   * @param {string} content the content body
   * @param {string} eol the line-ending style used (\n or \r\n)
   */
  constructor(fileName, metaData, content, eol = EOL) {
    this.fileName = fileName;
    this.metaData = metaData;
    this.content = content;
    this.eol = eol;
  }

  /**
   * Read file
   * @param {string} fileName the file name
   * @returns {Promise<MatterParser>} the parser instance
   */
  static async fromFile(fileName) {
    const content = await fsp.readFile(fileName, 'utf8');
    return MatterParser.fromString(content, fileName);
  }

  /**
   * Read file from string
   * @param {string} content contents of the frontmatter file
   * @param {string} fileName the fileName to be used when saved
   * @returns {MatterParser} the parser instance
   */
  static fromString(content = '', fileName = 'output.md') {
    // determine line endings by looking at the first appearance of \n or \r\n
    const eol = (content.match(/\n|\r\n/) || [EOL])[0];
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
   * @param {string[]} inputFilePatterns array of file patterns, eg ['README.md','src/*.md']
   * @returns {object[]} Array of objects containing {fileName, metaData, content}
   */
  static async fromFilePatterns(filePatterns) {
    const resolveInputFiles = Promise.all(
      filePatterns.map((item) => promisify(glob)(item))
    );
    const inputFiles = (await resolveInputFiles).flat();
    return await Promise.all(
      inputFiles.map((fileName) => MatterParser.fromFile(fileName))
    );
  }

  withData(data) {
    const { metaData, content, fileName, eol } = this;
    return new MatterParser(fileName, { ...metaData, ...data }, content, eol);
  }

  toString() {
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

  save() {
    return fsp.writeFile(this.fileName, this.toString(), 'utf8');
  }
}

module.exports = { MatterParser };
