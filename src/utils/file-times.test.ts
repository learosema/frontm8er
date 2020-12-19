import { getFileTimes } from './file-times';

const ISO_8601_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;

describe('file times test', () => {
  test('getFileTimes with both options false', async () => {
    const options = await getFileTimes('test/lea.md', false, false);
    expect(options).toStrictEqual({});
  });

  test('getFileTimes with both options true', async () => {
    const options = await getFileTimes('test/lea.md', true, true);
    expect(options).toBeDefined();
    expect(options.created).toMatch(ISO_8601_PATTERN);
    expect(options.modified).toMatch(ISO_8601_PATTERN);
  });

  test('getFileTimes with addCreated: true', async () => {
    const options = await getFileTimes('test/lea.md', true, false);
    expect(options).toBeDefined();
    expect(options.created).toMatch(ISO_8601_PATTERN);
    expect(options.modified).toBeUndefined();
  });

  test('getFileTimes with addModified: true', async () => {
    const options = await getFileTimes('test/lea.md', false, true);
    expect(options).toBeDefined();
    expect(options.created).toBeUndefined();
    expect(options.modified).toMatch(ISO_8601_PATTERN);
  });
});
