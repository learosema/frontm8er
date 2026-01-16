#!/usr/bin/env node
import parseArgs from 'minimist';

import { processFrontmatterFiles } from './frontm8er';
import { version } from '../package.json';
import { watchFrontmatterFiles } from './utils/file-watcher';

const KNOWN_OPTIONS = [
  '_',
  'c',
  'add-created',
  'm',
  'add-modified',
  'i',
  'input-folder',
  'o',
  'output-folder',
  'w',
  'watch',
  'v',
  'version',
];

function displayHelp(): void {
  const help = [
    '',
    'frontm8er [-c] [-m] [--key=value] [jsonfiles.json|yaml] [markdownfiles.md]',
    'adds data to your markdown files.',
    '',
    '  -h, --help            display help',
    '  -v, --version         display version',
    '  -i, --input-folder    specify input folder',
    '  -o, --output-folder   specify output folder',
    '  -c, --add-created     takes created time from file and adds it to the frontmatter',
    '  -m, --add-modified    takes modified time from file and adds it to the frontmatter',
    '  -w, --watch           run the whole thing in watch mode',
    '  --<key>=<value>       adds a key value pair to the front matter',
    '',
  ];
  help.forEach((item) => console.info(item));
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2), { boolean: true });
  if (options.help) {
    displayHelp();
    process.exit(0);
  }
  if (options.version || options.v) {
    console.info(version);
    process.exit(0);
  }
  if (!options) {
    displayHelp();
    process.exit(0);
  }
  let returnValue = 0;
  const watchMode = options.w || options.watch;
  const data: Record<string, string> = {};
  for (const [key, value] of Object.entries(options)) {
    if (KNOWN_OPTIONS.includes(key)) {
      continue;
    }
    data[key] = value;
  }
  const params = {
    addCreated: options.c || options['add-created'],
    addModified: options.m || options['add-modified'],
    data,
    inputFilePatterns: options._,
    dataFilePatterns: options._,
    inputFolder: options.i || options['input-folder'],
    outputFolder: options.o || options['output-folder'],
  };

  try {
    await processFrontmatterFiles(params);
    if (watchMode) {
      await watchFrontmatterFiles(params);
    }
  } catch (err) {
    console.error(err);
    returnValue = -1;
  }
  if (!watchMode || returnValue < 0) {
    process.exit(returnValue);
  }
}

main();
