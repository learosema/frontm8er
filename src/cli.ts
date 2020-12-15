#!/usr/bin/env node

import { processFrontmatterFiles } from './index';
import { parseCLI } from './utils/cli-parser';

function displayHelp(): void {
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

async function main(): Promise<void> {
  const options = parseCLI(process.argv.slice(2));
  if (!options) {
    displayHelp();
    process.exit(0);
  }
  try {
    await processFrontmatterFiles(options);
  } catch (err) {
    console.error(err);
  }
}

main();
