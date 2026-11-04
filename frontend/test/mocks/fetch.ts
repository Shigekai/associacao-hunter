import { vi } from 'vitest';

export function mockFetch(result: Response | Error) {
  const fetchMock = vi.fn<typeof fetch>(() =>
    result instanceof Error ? Promise.reject(result) : Promise.resolve(result),
  );
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}
