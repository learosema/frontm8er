import { pathUnjoin } from '../../shared/path-unjoin.ts';

describe('domain pathUnjoin', () => {
  test('removes linux prefix without trailing slash', () => {
    const inputFolder = 'src/input';
    const file = 'content/file.txt';
    const joinedFile = 'src/input/content/file.txt';
    const unjoined = pathUnjoin(joinedFile, inputFolder);
    expect(unjoined).toEqual(file);
  });

  test('removes windows-style prefix with backslashes', () => {
    const inputFolder = 'src\\input\\';
    const file = 'content\\file.txt';
    const joinedFile = 'src\\input\\content\\file.txt';
    const unjoined = pathUnjoin(joinedFile, inputFolder);
    expect(unjoined).toEqual(file);
  });
});
