import { beforeEach, describe, expect, it, vi } from 'vitest';
import { isApiReady } from '@/lib/api';
import { mockFetch } from './mocks/fetch';

describe('isApiReady', () => {
  beforeEach(() => {
    vi.stubEnv('API_URL', 'http://api.test');
  });

  it('reports ready when /health answers 200', async () => {
    const fetchMock = mockFetch(new Response(null, { status: 200 }));

    expect(await isApiReady()).toBe(true);
    expect(fetchMock).toHaveBeenCalledWith(
      'http://api.test/health',
      expect.anything(),
    );
  });

  it('accepts API_URL with a trailing slash', async () => {
    vi.stubEnv('API_URL', 'http://api.test/');
    const fetchMock = mockFetch(new Response(null, { status: 200 }));

    await isApiReady();

    expect(fetchMock).toHaveBeenCalledWith(
      'http://api.test/health',
      expect.anything(),
    );
  });

  it('reports not ready when /health answers 503', async () => {
    mockFetch(new Response(null, { status: 503 }));

    expect(await isApiReady()).toBe(false);
  });

  it('reports not ready when the request fails', async () => {
    mockFetch(new TypeError('fetch failed'));

    expect(await isApiReady()).toBe(false);
  });

  it('requires API_URL', async () => {
    vi.stubEnv('API_URL', '');

    await expect(isApiReady()).rejects.toThrow(
      'Missing environment variable: API_URL',
    );
  });
});
