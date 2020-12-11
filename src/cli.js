#!/usr/bin/env node

const { processFrontmatterFiles } = require('.');
const { parseCLI } = require('./utils/cli-parser');

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
}

const options = parseCLI(process.argv[2]);
if (!options) {
  displayHelp();
  return;
}
processFrontmatterFiles(options);
