import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ResultsLoader } from '@/components/results/ResultsLoader';
import {
  getAffiliations,
  getArcs,
  getNenCategories,
  searchCharacters,
} from '@/lib/api';
import type { SearchParams } from '@/lib/utils';
import { affiliations, arcs, character, nenCategories } from './mocks/lists';
import { mockNotFound, notFoundError } from './mocks/notFound';

vi.mock('@/lib/api');
vi.mock('next/navigation');

function results(searchParams: SearchParams) {
  return ResultsLoader({ searchParams: Promise.resolve(searchParams) });
}

function chipLabels() {
  const chips = screen.getByRole('list', { name: 'Filtros aplicados' });
  return within(chips)
    .getAllByRole('listitem')
    .map((chip) => chip.textContent);
}

describe('ResultsLoader', () => {
  it('reads only the characters when no select filter is set', async () => {
    vi.mocked(searchCharacters).mockResolvedValue([character(1, 'Gon', null)]);

    render(await results({ name: '', arcId: '' }));

    expect(searchCharacters).toHaveBeenCalledWith({});
    expect(getArcs).not.toHaveBeenCalled();
    expect(getNenCategories).not.toHaveBeenCalled();
    expect(getAffiliations).not.toHaveBeenCalled();
    expect(chipLabels()).toEqual([
      'Arco · Todos',
      'Nen · Todas',
      'Filiação · Todas',
    ]);
  });

  it('reads only the lists of the active filters', async () => {
    vi.mocked(searchCharacters).mockResolvedValue([character(1, 'Gon', null)]);
    vi.mocked(getArcs).mockResolvedValue(arcs);

    render(await results({ arcId: '4' }));

    expect(searchCharacters).toHaveBeenCalledWith({ arcId: '4' });
    expect(getArcs).toHaveBeenCalledOnce();
    expect(getNenCategories).not.toHaveBeenCalled();
    expect(getAffiliations).not.toHaveBeenCalled();
  });

  it('names every applied filter', async () => {
    vi.mocked(searchCharacters).mockResolvedValue([
      character(2, 'Killua', 'Zoldyck'),
    ]);
    vi.mocked(getArcs).mockResolvedValue(arcs);
    vi.mocked(getNenCategories).mockResolvedValue(nenCategories);
    vi.mocked(getAffiliations).mockResolvedValue(affiliations);

    render(
      await results({
        name: 'Killua',
        arcId: '4',
        categoryId: '2',
        affiliationId: '3',
      }),
    );

    expect(chipLabels()).toEqual([
      'Nome · Killua',
      'Arco · Greed Island',
      'Nen · Transmutação',
      'Filiação · Família Zoldyck',
    ]);
  });

  it('leaves out a chip whose id is not in the list', async () => {
    vi.mocked(searchCharacters).mockResolvedValue([character(1, 'Gon', null)]);
    vi.mocked(getArcs).mockResolvedValue(arcs);

    render(await results({ arcId: '99' }));

    expect(chipLabels()).toEqual(['Nen · Todas', 'Filiação · Todas']);
  });

  it('counts the records and shows one card each, in the API order', async () => {
    vi.mocked(searchCharacters).mockResolvedValue([
      character(6, 'Illumi', 'Zoldyck'),
      character(2, 'Killua', 'Zoldyck'),
    ]);

    render(await results({ name: 'zo' }));

    expect(screen.getByText('2 registros')).toBeDefined();
    expect(
      screen
        .getAllByRole('link', { name: /^Abrir ficha/ })
        .map((link) => link.getAttribute('aria-label')),
    ).toEqual([
      'Abrir ficha de Illumi Zoldyck',
      'Abrir ficha de Killua Zoldyck',
    ]);
  });

  it.each([
    ['an invalid search (400)', null],
    ['an empty list', []],
  ])('calls notFound on %s', async (_, answer) => {
    mockNotFound();
    vi.mocked(searchCharacters).mockResolvedValue(answer);

    await expect(results({ name: 'xyz' })).rejects.toBe(notFoundError);
  });
});
