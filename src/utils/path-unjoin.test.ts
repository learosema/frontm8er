import { pathUnjoin } from './path-unjoin';

describe('path.unjoin tests', () => {
  test('pathUnjoin with linux-style path without trailing slash', () => {
    const inputFolder = 'src/input';
    const file = 'content/file.txt';
    const joinedFile = 'src/input/content/file.txt';
    const unjoined = pathUnjoin(joinedFile, inputFolder);
    expect(unjoined).toEqual(file);
  });

  test('pathUnjoin with linux-style path with trailing slash', () => {
    const inputFolder = 'src/input/';
    const file = 'content/file.txt';
    const joinedFile = 'src/input/content/file.txt';
    const unjoined = pathUnjoin(joinedFile, inputFolder);
    expect(unjoined).toEqual(file);
  });

  test('pathUnjoin with windows-style path without trailing slash', () => {
    const inputFolder = 'src\\input';
    const file = 'content\\file.txt';
    const joinedFile = 'src\\input\\content\\file.txt';
    const unjoined = pathUnjoin(joinedFile, inputFolder);
    expect(unjoined).toEqual(file);
  });

  test('pathUnjoin with windows-style path with trailing slash', () => {
    const inputFolder = 'src\\input\\';
    const file = 'content\\file.txt';
    const joinedFile = 'src\\input\\content\\file.txt';
    const unjoined = pathUnjoin(joinedFile, inputFolder);
    expect(unjoined).toEqual(file);
  });
});
