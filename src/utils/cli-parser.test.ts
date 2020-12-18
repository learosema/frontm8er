import { parseCLI } from './cli-parser';

describe('cli parser test', () => {
  test('input files', () => {
    const options = parseCLI(['data.json', '*.md']);
    expect(options).not.toBeNull();
    expect(options?.inputFilePatterns).toEqual(['*.md']);
    expect(options?.dataFilePatterns).toEqual(['data.json']);
  });

  test('--add-created option', () => {
    const o1 = parseCLI(['-c', 'data.json', '*.md']);
    expect(o1).not.toBeNull();
    expect(o1?.addCreated).toBe(true);
    const o2 = parseCLI(['--add-created', 'data.json', '*.md']);
    expect(o2).not.toBeNull();
    expect(o2?.addCreated).toBe(true);
  });

  test('--add-modified option', () => {
    const o1 = parseCLI(['-m', 'data.json', '*.md']);
    expect(o1).not.toBeNull();
    expect(o1?.addModified).toBe(true);
    const o2 = parseCLI(['--add-modified', 'data.json', '*.md']);
    expect(o2).not.toBeNull();
    expect(o2?.addModified).toBe(true);
  });

  test('--key=value option', () => {
    const options = parseCLI(['--key=value', 'data.json', '*.md']);
    expect(options?.data).toStrictEqual({ key: 'value' });
  });

  test('no input files', () => {
    const options = parseCLI([]);
    expect(options).toBe(null);
  });

  test('help', () => {
    expect(parseCLI(['--help'])).toBe(null);
    expect(parseCLI(['-h'])).toBe(null);
  });

  test('unknown option', () => {
    expect(parseCLI(['--unknown-option'])).toBe(null);
  });
});
