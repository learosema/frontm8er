# frontm8er

Quick and dirty tool to add data to your markdown files.

## CLI Usage

```sh
npm i frontm8er -g

# Display help
frontm8er --help

# Adds author field for every markdown file
frontm8er --author="Lea Rosema" content/*.md

# Adds created and modified time and author field for every markdown file
frontm8er -c -m --author="Lea Rosema" content/*.md

# Pulls data from json file and adds it to the markdown file
frontm8er data.json content/*.md

# Watch mode: watch content folder, write to output folder add author and additional data.yaml to files
frontm8er -i content -o output './**/*.md' data/data.yaml --author="Lea Rosema" --watch
```

## Supported data formats

Supported data formats are yaml, JSON and [json5](https://json5.org/)

## API Usage

```sh
import { processFrontmatterFiles } from 'frontm8er';

await processFrontmatterFiles({
  inputFilePatterns: ['content/*.md'],
  dataFilePatterns: ['content/data.json'],
  data: {
    author: 'Lea Rosema'
  }
});
```

## Running the CLI while in development mode

```sh
node -r esm -r ts-node/register src/cli --help
```
