const fs = require('fs').promises;
const yaml = require('yaml');
const glob = require('glob');
const json5 = require('json5');
const { promisify } = require('util');

/**
 * Resolves all files from an array of file patterns
 *
 * @param {string[]} dataFilePatterns array of file patterns, eg. ['*.json', '*.yaml']
 * @returns {object[]} array of parsed files
 */
async function readDataFiles(dataFilePatterns) {
  const resolveDataFiles = Promise.all(
    dataFilePatterns.map((item) => promisify(glob)(item))
  );
  const dataFiles = (await resolveDataFiles).flat();
  const dataContents = dataFiles.flat().map(async (item) => {
    const content = await fs.readFile(item, 'utf-8');
    if (/\.ya?ml$/.test(item)) {
      return yaml.parse(content);
    }
    if (/\.json5?$/.test(item)) {
      return json5.parse(content);
    }
    return {};
  });
  return await Promise.all(dataContents);
}

module.exports = { readDataFiles };
