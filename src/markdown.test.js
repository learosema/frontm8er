const { Markdown } = require('./markdown');
const fsp = require('fs').promises;

describe('Markdown parsing', () => {
  test('Markdown.fromFile loads a file from the file system', async () => {
    const file = await Markdown.fromFile('test/lea.md');
    expect(file.fileName).toBe('test/lea.md');
    expect(file.metaData.author).toBe('Lea Rosema');
    expect(file.metaData.hobbies).toEqual(['sex', 'drugs', 'rocknroll']);
    expect(file.content).toBe(
      '\n# Hello World!\n\nLorem ipsum dolor sit amet.\n'
    );
  });

  test('Markdown.fromFile uses linux format if the file contains no EOLs', async () => {
    const readFile = fsp.readFile;
    fsp.readFile = jest.fn().mockImplementation(() => Promise.resolve('test'));
    const file = await Markdown.fromFile('test/no-data-no-eol.md');
    expect(file.eol).toBe('\n');
    fsp.readFile = readFile;
  });

  test('Markdown.fromFile metaData object is empty when file has no front matter', async () => {
    const readFile = fsp.readFile;
    fsp.readFile = jest.fn().mockImplementation(() => Promise.resolve('test'));
    const file = await Markdown.fromFile('test/no-data-no-eol.md');
    expect(Object.keys(file.metaData).length).toBe(0);
    fsp.readFile = readFile;
  });

  test('Markdown.withData creates a new Markdown instance with additional data to the data object', async () => {
    const file = await Markdown.fromFile('test/lea.md');
    const newFile = file.withData({ favoriteColour: 'hotpink' });
    expect(newFile.metaData.author).toBe('Lea Rosema');
    expect(newFile.metaData.hobbies).toEqual(['sex', 'drugs', 'rocknroll']);
    expect(newFile.metaData.favoriteColour).toBe('hotpink');
    expect(file.metaData.favoriteColour).toBeUndefined();
  });

  test('Markdown.toString serializes markdown file correctly', () => {
    const md = new Markdown(
      'test.md',
      { author: 'Lea Rosema' },
      'Hello World\n'
    );
    const mdString = '---\nauthor: Lea Rosema\n---\nHello World\n';
    expect(md.toString()).toBe(mdString);
  });

  test('Markdown.toString serializes just the content if metaData is empty', () => {
    const md = new Markdown('test.md', {}, 'Hello World\n');
    const mdString = 'Hello World\n';
    expect(md.toString()).toBe(mdString);
  });

  test('Markdown.save saves all the things', async () => {
    const writeFile = fsp.writeFile;
    fsp.writeFile = jest.fn().mockImplementation(() => Promise.resolve());
    const md = new Markdown(
      'test.md',
      { author: 'Lea Rosema' },
      'Hello World\n'
    );
    await md.withData({ gender: 'female' }).save();
    expect(fsp.writeFile).toHaveBeenCalled();
    fsp.writeFile = writeFile;
  });

  test('Markdown.fromFilePatterns can batch-read all the markdown files', async () => {
    const files = await Markdown.fromFilePatterns(['test/*.md']);
    expect(files.length).toBe(1);
    expect(files[0].fileName).toBe('test/lea.md');
    expect(files[0].metaData.author).toBe('Lea Rosema');
  });
});
