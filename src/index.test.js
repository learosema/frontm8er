const glob = require('glob');

describe('processFrontmatterFiles tests', () => {
  beforeAll(() => {
    jest.mock('glob', () =>
      jest.fn().mockImplementation((pattern) => {
        if (pattern.endsWith('.json')) {
          return Promise.resolve(['data.json']);
        }
        if (pattern.endsWith('.md')) {
          return Promise.resolve(['article.md']);
        }
      })
    );
  });

  afterAll(() => {
    glob.mockClear();
  });

  test('processFrontmatterFiles does the things it should do.', () => {
    // todo...
    processFrontmatterFiles({
      inputFilePatterns: '*.md',
    });
  });
});
