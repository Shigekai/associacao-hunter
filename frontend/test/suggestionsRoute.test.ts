// @vitest-environment node
import { NextRequest } from 'next/server';
import { describe, expect, it, vi } from 'vitest';
import { GET } from '@/app/api/hunters/suggestions/route';
import { searchCharacters } from '@/lib/api';
import { character } from './mocks/lists';

vi.mock('@/lib/api');

function request(query: string) {
  return new NextRequest(`http://localhost/api/hunters/suggestions${query}`);
}

describe('GET /api/hunters/suggestions', () => {
  it('returns the total and the first five full names', async () => {
    vi.mocked(searchCharacters).mockResolvedValue([
      character(1, 'Chrollo', 'Lucilfer'),
      character(2, 'Gon', 'Freecss'),
      character(3, 'Hisoka', 'Morow'),
      character(4, 'Illumi', 'Zoldyck'),
      character(5, 'Killua', 'Zoldyck'),
      character(6, 'Kurapika', null),
      character(7, 'Leorio', 'Paradinight'),
    ]);

    const response = await GET(request('?name=o'));

    expect(searchCharacters).toHaveBeenCalledWith({ name: 'o' });
    expect(await response.json()).toEqual({
      total: 7,
      suggestions: [
        { id: 1, name: 'Chrollo Lucilfer' },
        { id: 2, name: 'Gon Freecss' },
        { id: 3, name: 'Hisoka Morow' },
        { id: 4, name: 'Illumi Zoldyck' },
        { id: 5, name: 'Killua Zoldyck' },
      ],
    });
  });

  it('names a character without a last name by the first name only', async () => {
    vi.mocked(searchCharacters).mockResolvedValue([
      character(6, 'Kurapika', null),
    ]);

    const response = await GET(request('?name=%20rato%20'));

    expect(searchCharacters).toHaveBeenCalledWith({ name: 'rato' });
    expect(await response.json()).toEqual({
      total: 1,
      suggestions: [{ id: 6, name: 'Kurapika' }],
    });
  });

  it.each(['', '?name=', '?name=%20%20'])(
    'answers an empty term (%j) without calling the API',
    async (query) => {
      const response = await GET(request(query));

      expect(searchCharacters).not.toHaveBeenCalled();
      expect(await response.json()).toEqual({ total: 0, suggestions: [] });
    },
  );

  it('answers an empty list when the API rejects the term', async () => {
    vi.mocked(searchCharacters).mockResolvedValue(null);

    const response = await GET(request('?name=gon'));

    expect(await response.json()).toEqual({ total: 0, suggestions: [] });
  });

  it('answers 502 when the API fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(searchCharacters).mockRejectedValue(
      new Error('API request failed: 500'),
    );

    const response = await GET(request('?name=gon'));

    expect(response.status).toBe(502);
  });
});
