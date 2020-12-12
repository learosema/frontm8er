const fsp = require('fs').promises;
const { readDataFiles } = require('./utils/data-parser');
const { MatterParser } = require('./utils/matter-parser');

async function getFileTimes(fileName, addCreated, addModified) {
  const result = {};
  if (!addCreated && !addModified) {
    return result;
  }
  const stats = await fsp.stat(fileName);
  if (addCreated) {
    result.created = stats.birthtime.toISOString();
  }
  if (addModified) {
    result.modified = stats.mtime.toISOString();
  }
}

async function processFrontmatterFiles({
  inputFilePatterns,
  dataFilePatterns,
  data = {},
  addCreated = false,
  addModified = false,
}) {
  const dataContents = await readDataFiles(dataFilePatterns);
  const fileData = Object.assign.apply(this, [{}, ...dataContents]);
  const inputContents = await MatterParser.fromFilePatterns(inputFilePatterns);
  await Promise.all(
    inputContents.map(async (md) => {
      const additionalData = {
        ...fileData,
        ...data,
        ...getFileTimes(md.fileName, addCreated, addModified),
      };
      return await md.withData(additionalData).save();
    })
  );
}

module.exports = { getFileTimes, processFrontmatterFiles };
