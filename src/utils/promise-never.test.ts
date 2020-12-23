import { neverResolves } from './promise-never';

describe('neverResolves test', () => {
  test('neverResolves returns a promise that does not resolve', () => {
    const fn = jest.fn();
    const promise = neverResolves();
    promise.then(fn);
    expect(promise).toBeInstanceOf(Promise);
    expect(fn).not.toHaveBeenCalled();
  });
});
