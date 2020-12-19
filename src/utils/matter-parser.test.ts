import { promises as fsp } from 'fs';
import { MatterParser } from './matter-parser';

describe('MatterParser parsing', () => {
  test('MatterParser.fromFile loads a file from the file system', async () => {
    const file = await MatterParser.fromFile('test/lea.md');
    expect(file.fileName).toBe('test/lea.md');
    expect(file.metaData.author).toBe('Lea Rosema');
    expect(file.metaData.hobbies).toEqual(['sex', 'drugs', 'rocknroll']);
    expect(file.content).toBe(
      '\n# Hello World!\n\nLorem ipsum dolor sit amet.\n'
    );
  });

  test('MatterParser.fromFile uses linux format if the file contains no EOLs', async () => {
    const readFile = fsp.readFile;
    fsp.readFile = jest.fn().mockImplementation(() => Promise.resolve('test'));
    const file = await MatterParser.fromFile('test/no-data-no-eol.md');
    expect(file.eol).toBe('\n');
    fsp.readFile = readFile;
  });

  test('MatterParser.fromFile metaData object is empty when file has no front matter', async () => {
    const readFile = fsp.readFile;
    fsp.readFile = jest.fn().mockImplementation(() => Promise.resolve('test'));
    const file = await MatterParser.fromFile('test/no-data-no-eol.md');
    expect(Object.keys(file.metaData).length).toBe(0);
    fsp.readFile = readFile;
  });

  test('MatterParser.fromString parses string into MatterParser instance', () => {
    const content = '---\nauthor: Lea Rosema\n---\nHello World!\n';
    const md = MatterParser.fromString(content);
    expect(md.metaData.author).toBe('Lea Rosema');
    expect(md.content).toBe('Hello World!\n');
  });

  test('MatterParser.withData creates a new MatterParser instance with additional data to the data object', async () => {
    const file = await MatterParser.fromFile('test/lea.md');
    const newFile = file.withData({ favoriteColour: 'hotpink' });
    expect(newFile.metaData.author).toBe('Lea Rosema');
    expect(newFile.metaData.hobbies).toEqual(['sex', 'drugs', 'rocknroll']);
    expect(newFile.metaData.favoriteColour).toBe('hotpink');
    expect(file.metaData.favoriteColour).toBeUndefined();
  });

  test('MatterParser.toString serializes MatterParser file correctly', () => {
    const md = new MatterParser(
      'test.md',
      { author: 'Lea Rosema' },
      'Hello World\n'
    );
    const mdString = '---\nauthor: Lea Rosema\n---\nHello World\n';
    expect(md.toString()).toBe(mdString);
  });

  test('MatterParser.fromString without parameters creates instance with empty content and metadata.', () => {
    const md = MatterParser.fromString();
    expect(md.content).toBe('');
    expect(md.metaData).toStrictEqual({});
  });

  test('MatterParser.toString serializes just the content if metaData is empty', () => {
    const md = new MatterParser('test.md', {}, 'Hello World\n');
    const mdString = 'Hello World\n';
    expect(md.toString()).toBe(mdString);
  });

  test('MatterParser.save saves all the things', async () => {
    const writeFile = fsp.writeFile;
    fsp.writeFile = jest.fn().mockImplementation(() => Promise.resolve());
    const md = new MatterParser(
      'test.md',
      { author: 'Lea Rosema' },
      'Hello World\n'
    );
    await md.withData({ gender: 'female' }).save();
    expect(fsp.writeFile).toHaveBeenCalled();
    fsp.writeFile = writeFile;
  });

  test('MatterParser.fromFilePatterns can batch-read all the MatterParser files', async () => {
    const files = await MatterParser.fromFilePatterns(['test/*.md']);
    expect(files.length).toBe(1);
    expect(files[0].fileName).toBe('test/lea.md');
    expect(files[0].metaData.author).toBe('Lea Rosema');
  });
});
