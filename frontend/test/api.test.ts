import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getAffiliations,
  getArcs,
  getCharacterSheet,
  getNenCategories,
  isApiReady,
  searchCharacters,
} from '@/lib/api';
import { mockFetch } from './mocks/fetch';
import { sheet } from './mocks/sheets';

describe('API reads', () => {
  beforeEach(() => {
    vi.stubEnv('API_URL', 'http://api.test');
  });

  it.each([
    ['arcs', getArcs, '/arcs'],
    ['Nen categories', getNenCategories, '/nen-categories'],
    ['affiliations', getAffiliations, '/affiliations'],
  ])('reads the %s', async (_, read, path) => {
    const fetchMock = mockFetch(Response.json([{ id: 1, name: 'Item' }]));

    expect(await read()).toEqual([{ id: 1, name: 'Item' }]);
    expect(fetchMock).toHaveBeenCalledWith(
      `http://api.test${path}`,
      expect.anything(),
    );
  });

  it('searches characters by the filters present', async () => {
    const fetchMock = mockFetch(Response.json([]));

    await searchCharacters({ name: 'Gon Freecss', arcId: '4', categoryId: '' });

    expect(fetchMock).toHaveBeenCalledWith(
      'http://api.test/characters?name=Gon+Freecss&arcId=4',
      expect.anything(),
    );
  });

  it('lists every character without filters', async () => {
    const fetchMock = mockFetch(Response.json([]));

    await searchCharacters({});

    expect(fetchMock).toHaveBeenCalledWith(
      'http://api.test/characters',
      expect.anything(),
    );
  });

  it('answers null when the API rejects the search (400)', async () => {
    mockFetch(new Response(null, { status: 400 }));

    expect(await searchCharacters({ arcId: 'abc' })).toBeNull();
  });

  it('throws when the API answers an error', async () => {
    mockFetch(new Response(null, { status: 500 }));

    await expect(getArcs()).rejects.toThrow('API request failed: 500 /arcs');
  });

  it('throws when the character search answers an error', async () => {
    mockFetch(new Response(null, { status: 500 }));

    await expect(searchCharacters({ name: 'Gon' })).rejects.toThrow(
      'API request failed: 500 /characters?name=Gon',
    );
  });

  it('reads a character sheet', async () => {
    const kurapika = sheet();
    const fetchMock = mockFetch(Response.json(kurapika));

    expect(await getCharacterSheet('3')).toEqual(kurapika);
    expect(fetchMock).toHaveBeenCalledWith(
      'http://api.test/characters/3',
      expect.anything(),
    );
  });

  it.each([404, 400])(
    'answers null when the character sheet answers %i',
    async (status) => {
      mockFetch(new Response(null, { status }));

      expect(await getCharacterSheet('9999')).toBeNull();
    },
  );

  it('throws when the character sheet answers an error', async () => {
    mockFetch(new Response(null, { status: 500 }));

    await expect(getCharacterSheet('3')).rejects.toThrow(
      'API request failed: 500 /characters/3',
    );
  });
});

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
