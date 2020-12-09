#!/usr/bin/env node

const fs = require('fs');
const yaml = require('yaml');
const glob = require('glob');
const json5 = require('json5');

const args = process.argv.slice(2);
const data = {};
const dataFilePattern = /\.(json|json5|yml|yaml)$/;
const options = {
  addCreated: false,
  addModified: false,
};
const dataFiles = args.filter((item) => dataFilePattern.test(item));
const inputFiles = args.filter((item) => item.endsWith('.md'));

function displayHelp() {
  const help = [
    '',
    'frontm8er [-c] [-m] [--key=value] [jsonfiles.json|yaml] [markdownfiles.md]',
    'adds data to your markdown files.',
    '',
    '  -c, --add-created     takes created time from file and adds it to the frontmatter',
    '  -m, --add-modified    takes modified time from file and adds it to the frontmatter',
    '  --<key>=<value>       adds a key value pair to the front matter',
    '',
  ];
  help.forEach((item) => console.log(item));
  return;
}

args
  .filter((item) => item.startsWith('-'))
  .forEach((item) => {
    if (item === '--help' || item === '-h') {
      displayHelp();
      process.exit(0);
    }
    if (item === '--add-created' || item === '-c') {
      options.addCreated = true;
      return;
    }
    if (item === '--add-modified' || item === '-m') {
      options.addModified = true;
      return;
    }
    if (/^--.+=.*$/.test(item)) {
      const eqSign = item.indexOf('=');
      const key = item.slice(2, eqSign);
      const val = item.slice(eqSign + 1);
      data[key] = val;
    }
    console.error('Unkown option:', item);
  });

const resolveDataFiles = Promise.all(
  dataFiles.map((item) => {
    return new Promise((resolve, reject) => {
      glob(item, (err, files) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(files);
      });
    });
  })
);

const resolveInputFiles = Promise.all(
  inputFiles.map((item) => {
    return new Promise((resolve, reject) => {
      glob(item, (err, files) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(files);
      });
    });
  })
);

resolveDataFiles.then((files) => {
  const dataContents = files.flat().map((item) => {
    const content = fs.readFileSync(item, 'utf-8');
    if (/\.y(a|)ml$/.test(item)) {
      return yaml.parse(content);
    }
    if (/\.json(5|)$/.test(item)) {
      return json5.parse(content);
    }
  });
  Object.assign.apply(this, [data, ...dataContents]);
  resolveInputFiles.then((inputFiles) => {
    inputFiles.flat().forEach((inputFile) => {
      let content = fs.readFileSync(inputFile, 'utf-8');
      const eol = (content.match(/\n|\r\n/) || ['\n'])[0];
      const marker = '---' + eol;
      const fileData = { ...data };
      if (content.startsWith(marker)) {
        const frontMatterEnd = content.indexOf(marker, marker.length);
        const frontMatter = content.slice(marker.length, frontMatterEnd);
        content = content.slice(frontMatterEnd + marker.length);
        Object.assign(fileData, yaml.parse(frontMatter));
      }
      if (options.addCreated || options.addModified) {
        const stats = fs.statSync(inputFile);
        if (options.addCreated) {
          fileData['created'] = stats.ctime.toISOString();
        }
        if (options.addModified) {
          fileData['modified'] = stats.mtime.toISOString();
        }
      }
      const hasData = Object.keys(fileData).length > 0;
      if (hasData) {
        const frontmatter = (
          '---\n' +
          yaml.stringify(fileData) +
          '---\n'
        ).replace(/\n/g, eol);
        content = frontmatter + content;
      }
      fs.writeFileSync(inputFile, content, 'utf-8');
    });
  });
});
