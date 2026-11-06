import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SearchFormLoader } from '@/components/search/SearchFormLoader';
import { getAffiliations, getArcs, getNenCategories } from '@/lib/api';
import { affiliations, arcs, nenCategories } from './mocks/lists';
import { mockRouter } from './mocks/router';

vi.mock('@/lib/api');
vi.mock('next/navigation');

function optionLabels(label: string) {
  const select = screen.getByLabelText(label) as HTMLSelectElement;
  return Array.from(select.options, (option) => option.textContent);
}

describe('SearchFormLoader', () => {
  it('fills the selects with the lists from the API, in order', async () => {
    mockRouter();
    vi.mocked(getArcs).mockResolvedValue(arcs);
    vi.mocked(getNenCategories).mockResolvedValue(nenCategories);
    vi.mocked(getAffiliations).mockResolvedValue(affiliations);

    render(await SearchFormLoader());

    expect(optionLabels('Arco')).toEqual([
      'Todos os arcos',
      'Exame Hunter',
      'Greed Island',
    ]);
    expect(optionLabels('Categoria Nen')).toEqual([
      'Todas',
      'Intensificação',
      'Transmutação',
    ]);
    expect(optionLabels('Filiação')).toEqual([
      'Todas',
      'Associação Hunter',
      'Família Zoldyck',
    ]);
  });
});
