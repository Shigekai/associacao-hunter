import { vi } from 'vitest';

export function mockFetch(result: Response | Error) {
  const fetchMock = vi.fn<typeof fetch>(() =>
    result instanceof Error ? Promise.reject(result) : Promise.resolve(result),
  );
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

type PendingRequest = {
  url: string;
  signal: AbortSignal | undefined;
  respond: (response: Response) => void;
};

export function mockFetchQueue() {
  const requests: PendingRequest[] = [];
  const fetchMock = vi.fn<typeof fetch>(
    (input, init) =>
      new Promise((resolve, reject) => {
        const signal = init?.signal ?? undefined;
        signal?.addEventListener('abort', () =>
          reject(new DOMException('Aborted', 'AbortError')),
        );
        requests.push({ url: String(input), signal, respond: resolve });
      }),
  );
  vi.stubGlobal('fetch', fetchMock);
  return { fetchMock, requests };
}
