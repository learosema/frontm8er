const fsp = require('fs').promises;
const { readDataFiles } = require('./utils/data-parser');
const { MatterParser } = require('./utils/matter-parser');

export async function getFileTimes() {
  const stats = await fsp.stat(md.fileName);
  return {
    created: stats.birthtime.toISOString(),
    modified: stats.mtime.toISOString()
  };
}

function processFrontmatterFiles({
  inputFilePatterns,
  dataFilePatterns,
  data = {},
  addCreated = false,
  addModified = false,
}) {
  const dataContents = await readDataFiles(dataFilePatterns);
  Object.assign.apply(this, [data, ...dataContents]);
  const inputContents = await MatterParser.fromFilePatterns(inputFilePatterns);
  await Promise.all(
    inputContents.map(async (md) => {
      const additionalData = { ...data };
      if (addCreated || addModified) {
        const times = await getFileTimes();
        if (addCreated) {
          additionalData.created = times.created;
        }
        if (addModified) {
          additionalData.modified = times.modified;
        }
      }
      return await md.withData(additionalData).save();
    })
  );
}

module.exports = { getFileTimes, processFrontmatterFiles };