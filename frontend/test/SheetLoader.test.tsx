import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SheetLoader } from '@/components/sheet/SheetLoader';
import { sheetMetadata } from '@/components/sheet/sheetMetadata';
import { getCharacterSheet } from '@/lib/api';
import { mockNotFound, notFoundError } from './mocks/notFound';
import { sheet } from './mocks/sheets';

vi.mock('@/lib/api');
vi.mock('next/navigation');

function loadSheet(hunterId: string) {
  return SheetLoader({ params: Promise.resolve({ hunterId }) });
}

describe('SheetLoader', () => {
  it('renders the character sheet', async () => {
    vi.mocked(getCharacterSheet).mockResolvedValue(
      sheet({
        character: { id: 1, firstName: 'Gon', lastName: 'Freecss' },
        arcs: [],
      }),
    );

    render(await loadSheet('1'));

    expect(getCharacterSheet).toHaveBeenCalledWith('1');
    expect(
      screen.getByRole('heading', { level: 2, name: 'Gon Freecss' }),
    ).toBeDefined();
    expect(screen.queryByRole('region', { name: 'Extras · Arcos' })).toBeNull();
  });

  it('calls notFound when the character does not exist', async () => {
    mockNotFound();
    vi.mocked(getCharacterSheet).mockResolvedValue(null);

    await expect(loadSheet('9999')).rejects.toBe(notFoundError);
  });
});

describe('sheetMetadata', () => {
  it('uses the full name as the page title', async () => {
    vi.mocked(getCharacterSheet).mockResolvedValue(
      sheet({ character: { firstName: 'Killua', lastName: 'Zoldyck' } }),
    );

    expect(await sheetMetadata(Promise.resolve({ hunterId: '2' }))).toEqual({
      title: 'Killua Zoldyck',
    });
  });

  it('returns Não encontrado when the character does not exist', async () => {
    vi.mocked(getCharacterSheet).mockResolvedValue(null);

    expect(await sheetMetadata(Promise.resolve({ hunterId: '9999' }))).toEqual({
      title: 'Não encontrado',
    });
  });

  it('falls back to empty metadata when the API fails so SheetError can catch it', async () => {
    vi.mocked(getCharacterSheet).mockRejectedValue(new Error('API down'));

    expect(await sheetMetadata(Promise.resolve({ hunterId: '3' }))).toEqual({});
  });
});
