const fsp = require('fs').promises;
const { readDataFiles } = require('./data');
const { Markdown } = require('./markdown');

export async function processFiles({
  inputFilePatterns,
  dataFilePatterns,
  data,
  addCreated,
  addModified,
}) {
  const dataContents = await readDataFiles(dataFilePatterns);
  Object.assign.apply(this, [data, ...dataContents]);
  const inputContents = await Markdown.fromFilePatterns(inputFilePatterns);
  await Promise.all(
    inputContents.map(async (md) => {
      const additionalData = { ...data };
      if (addCreated || addModified) {
        const stats = await fsp.stat(md.fileName);
        if (addCreated) {
          additionalData['created'] = stats.birthtime.toISOString();
        }
        if (addModified) {
          additionalData['modified'] = stats.mtime.toISOString();
        }
      }
      return await md.withData(additionalData).save();
    })
  );
}
