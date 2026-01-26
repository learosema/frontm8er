import { getFileTimes } from '../../domain/file-times.ts';

jest.mock('node:fs/promises', () => ({
  stat: jest.fn(),
}));

import { stat as mockedStat } from 'node:fs/promises';

describe('domain getFileTimes (unit)', () => {
  const birth = new Date('2020-01-01T00:00:00Z');
  const mod = new Date('2020-02-02T12:34:56Z');

  beforeEach(() => {
    (mockedStat as jest.Mock).mockResolvedValue({ birthtime: birth, mtime: mod });
  });

  test('returns empty when both flags false', async () => {
    const res = await getFileTimes('any.md', false, false);
    expect(res).toStrictEqual({});
  });

  test('returns created and modified when both true', async () => {
    const res = await getFileTimes('any.md', true, true);
    expect(res.created).toBe(birth.toISOString());
    expect(res.modified).toBe(mod.toISOString());
  });

  test('returns only created when addModified false', async () => {
    const res = await getFileTimes('any.md', true, false);
    expect(res.created).toBe(birth.toISOString());
    expect(res.modified).toBeUndefined();
  });
});
