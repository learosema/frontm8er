const fsp = require('fs').promises;
const { processFrontmatterFiles } = require('./index');
const { MatterParser } = require('./utils/matter-parser');

let originalWriteFile,
  virtualFS = {};

describe('processFrontmatterFiles tests', () => {
  beforeEach(() => {
    originalWriteFile = fsp.writeFile;
    virtualFS = {};
    fsp.writeFile = jest.fn().mockImplementation((file, contents) => {
      virtualFS[file] = contents;
      Promise.resolve();
    });
  });

  afterEach(() => {
    fsp.writeFile = originalWriteFile;
  });

  test('processFrontmatterFiles does the things it should do.', async () => {
    await processFrontmatterFiles({
      inputFilePatterns: ['test/*.md'],
      dataFilePatterns: [
        'test/*.yaml',
        'test/*.json',
        'test/*.yml',
        'test/*.json5',
      ],
      data: { author: 'Lea Rosema' },
      addCreated: false,
      addModified: false,
    });
    expect(virtualFS['test/lea.md']).toBeDefined();
    const md = MatterParser.fromString(virtualFS['test/lea']);
    expect(md.metaData.author).toBe('Lea Rosema');
    expect(md.metaData.gender).toBe('female');
    expect(md.metaData.hobbies).toEqual(['sex', 'drugs', 'rocknroll']);
    expect(md.content).toBe(
      '\n# Hello World!\n\nLorem ipsum dolor sit amet.\n'
    );
  });

  test('processFrontmatterFiles does the things it should do. Also add created and modified times.', async () => {
    await processFrontmatterFiles({
      inputFilePatterns: ['test/*.md'],
      dataFilePatterns: [
        'test/*.yaml',
        'test/*.json',
        'test/*.yml',
        'test/*.json5',
      ],
      data: { author: 'Lea Rosema' },
      addCreated: true,
      addModified: true,
    });
    expect(virtualFS['test/lea.md']).toBeDefined();
    const md = MatterParser.fromString(virtualFS['test/lea']);
    expect(md.metaData.author).toBe('Lea Rosema');
    expect(md.metaData.gender).toBe('female');
    expect(md.metaData.hobbies).toEqual(['sex', 'drugs', 'rocknroll']);
    expect(md.content).toBe(
      '\n# Hello World!\n\nLorem ipsum dolor sit amet.\n'
    );
    expect(md.metaData.created).toBeDefined();
    expect(md.metaData.modified).toBeDefined();
  });

  test('processFrontmatterFiles does the things it should do. Also add modified time.', async () => {
    await processFrontmatterFiles({
      inputFilePatterns: ['test/*.md'],
      dataFilePatterns: [
        'test/*.yaml',
        'test/*.json',
        'test/*.yml',
        'test/*.json5',
      ],
      data: { author: 'Lea Rosema' },
      addCreated: false,
      addModified: true,
    });
    expect(virtualFS['test/lea.md']).toBeDefined();
    const md = MatterParser.fromString(virtualFS['test/lea']);
    expect(md.metaData.author).toBe('Lea Rosema');
    expect(md.metaData.gender).toBe('female');
    expect(md.metaData.hobbies).toEqual(['sex', 'drugs', 'rocknroll']);
    expect(md.content).toBe(
      '\n# Hello World!\n\nLorem ipsum dolor sit amet.\n'
    );
    expect(md.metaData.modified).toBeDefined();
  });

  test('processFrontmatterFiles does the things it should do. Also add created times.', async () => {
    await processFrontmatterFiles({
      inputFilePatterns: ['test/*.md'],
      dataFilePatterns: [
        'test/*.yaml',
        'test/*.json',
        'test/*.yml',
        'test/*.json5',
      ],
      data: { author: 'Lea Rosema' },
      addCreated: true,
      addModified: false,
    });
    expect(virtualFS['test/lea.md']).toBeDefined();
    const md = MatterParser.fromString(virtualFS['test/lea']);
    expect(md.metaData.author).toBe('Lea Rosema');
    expect(md.metaData.gender).toBe('female');
    expect(md.metaData.hobbies).toEqual(['sex', 'drugs', 'rocknroll']);
    expect(md.content).toBe(
      '\n# Hello World!\n\nLorem ipsum dolor sit amet.\n'
    );
    expect(md.metaData.created).toBeDefined();
  });
});
