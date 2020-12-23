import fs from 'fs';
import { FSWatcher, watch } from 'chokidar';
import { mocked } from 'ts-jest/utils';
import { watchFrontmatterFiles } from './file-watcher';

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
    const watchers: Record<string, any>[] = [];

    mocked(watch).mockImplementation((paths: string | readonly string[]) => {
      const watcher = {
        on: (_eventType: string, handler: chokidarHandler) => {
          watchers.push({
            paths,
            handler,
          });
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
      console.log(watchers);
    } catch (ex) {}
  });
});
