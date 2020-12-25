import fs, { promises as fsp } from 'fs';
import { FSWatcher, watch } from 'chokidar';
import { mocked } from 'ts-jest/utils';
import { watchFrontmatterFiles } from './file-watcher';

const writeFile = fsp.writeFile;
const access = fsp.access;
const mkdir = fsp.mkdir;

jest.mock('chokidar', () => ({
  watch: jest.fn(),
}));

type chokidarHandler = (
  eventName: 'add' | 'addDir' | 'change' | 'unlink' | 'unlinkDir',
  path: string,
  stats?: fs.Stats
) => void;

describe('file-watcher test', () => {
  let virtualFS: Record<string, string> = {};
  const watchers: chokidarHandler[] = [];

  beforeEach(() => {
    virtualFS = {};
    fsp.writeFile = jest.fn().mockImplementation((path, data) => {
      const normalizedPath = (path.toString() || '').replace(/\/|\\/g, '/');
      virtualFS[normalizedPath] = data.toString();
      return Promise.resolve();
    });
    fsp.access = jest.fn().mockImplementation(() => Promise.resolve());
    fsp.mkdir = jest.fn().mockImplementation(() => Promise.resolve());
    mocked(watch).mockImplementation(() => {
      const watcher = {
        on: (_eventType: string, handler: chokidarHandler) => {
          watchers.push(handler);
        },
      } as Partial<FSWatcher>;
      return watcher as FSWatcher;
    });
  });

  afterEach(() => {
    mocked(watch).mockClear();
    fsp.writeFile = writeFile;
    fsp.mkdir = mkdir;
    fsp.access = access;
  });

  test('watchFrontmatterFiles without input and output folders specified should throw an error.', () => {
    return expect(
      watchFrontmatterFiles({
        inputFilePatterns: ['lea.md'],
        dataFilePatterns: ['*.*'],
      })
    ).rejects.toThrowError();
  });

  test('watchFrontmatterFiles starts 2 file system watchers', async () => {
    await watchFrontmatterFiles({
      inputFilePatterns: ['lea.md'],
      dataFilePatterns: ['*.*'],
      inputFolder: 'test',
      outputFolder: 'output',
    });
    expect(watchers.length).toBe(2);
    const [dataWatcher, inputWatcher] = watchers;
    // trigger chokidar handlers manually
    await dataWatcher('change', 'test/test.json');
    await dataWatcher('change', 'test/lea.md');
    await inputWatcher('change', 'test/lea.md');
    await dataWatcher('change', 'test/test.json');
    await inputWatcher('change', 'test/test.json');
    expect(Object.keys(virtualFS)).toEqual(['output/lea.md']);
    fsp.writeFile = writeFile;
    mocked(watch).mockClear();
  });
});
