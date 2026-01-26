import { MatterParser } from '../../../src/utils/matter-parser.ts';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

describe('FileEntity (MatterParser) domain tests', () => {
  const sample = `---\nname: Test\n---\n# Hello\nWorld\n`;

  test('withData returns new instance and merges metadata', () => {
    const m = MatterParser.fromString(sample, 'a.md');
    const withAdded = m.withData({ added: 123 });
    expect(withAdded).not.toBe(m);
    expect(withAdded.metaData.name).toBe('Test');
    expect(withAdded.metaData.added).toBe(123);
    // original unchanged
    expect(m.metaData.added).toBeUndefined();
  });

  test('toString emits frontmatter when metadata present', () => {
    const m = MatterParser.fromString(sample, 'a.md');
    const s = m.toString();
    expect(s.startsWith('---')).toBe(true);
    expect(s).toContain('name: Test');
    expect(s).toContain('# Hello');
  });

  test('save writes file to disk', async () => {
    const tmp = path.join('test', 'tmp', 'file-entity.test.md');
    const m = MatterParser.fromString(sample, tmp);
    await m.save(tmp);
    const persisted = await readFile(tmp, 'utf8');
    expect(persisted).toContain('# Hello');
  });
});
