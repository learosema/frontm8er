import fs, { promises } from 'fs';
import { FSWatcher, watch } from 'chokidar';
import { mocked } from 'ts-jest/utils';
import { watchFrontmatterFiles } from './file-watcher';

const origWF = promises.writeFile;

jest.mock('chokidar', () => ({
  watch: jest.fn(),
}));

type chokidarHandler = (
  eventName: 'add' | 'addDir' | 'change' | 'unlink' | 'unlinkDir',
  path: string,
  stats?: fs.Stats
) => void;

describe('file-watcher test', () => {
  test('test watching files', async () => {
    const virtualFS: Record<string, string> = {};
    const watchers: chokidarHandler[] = [];
    promises.writeFile = jest.fn();
    mocked(promises.writeFile).mockImplementation((path, data) => {
      virtualFS[path.toString()] = data.toString();
      return Promise.resolve();
    });

    mocked(watch).mockImplementation(() => {
      const watcher = {
        on: (_eventType: string, handler: chokidarHandler) => {
          watchers.push(handler);
        },
      } as Partial<FSWatcher>;
      return watcher as FSWatcher;
    });
    try {
      await watchFrontmatterFiles({
        inputFilePatterns: ['*.md'],
        dataFilePatterns: ['*.json'],
        inputFolder: 'test',
        outputFolder: 'output',
      });
      expect(watchers.length).toBe(2);
      const [dataWatcher, inputWatcher] = watchers;
      // trigger chokidar handlers manually
      await dataWatcher('change', 'test/test.json');
      await inputWatcher('change', 'test/lea.md');
    } catch (ex) {}

    promises.writeFile = origWF;
    mocked(watch).mockClear();
  });
});
