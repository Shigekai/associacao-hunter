import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HunterCard } from '@/components/results/HunterCard';
import type { CharacterSummary } from '@/lib/api';
import type { SearchFilters } from '@/lib/utils';
import { character } from './mocks/lists';

function renderCard(
  overrides: Partial<CharacterSummary> = {},
  filters: SearchFilters = {},
) {
  render(
    <HunterCard
      character={character(3, 'Kurapika', null, overrides)}
      filters={filters}
    />,
  );
}

function datum(label: string) {
  return screen.getByText(label, { selector: 'dt' }).nextElementSibling
    ?.textContent;
}

describe('HunterCard', () => {
  it.each([
    [true, 'Licenciado'],
    [false, 'Não licenciado'],
  ])('shows the license (licensed: %s)', (isLicensedHunter, label) => {
    renderCard({ isLicensedHunter });

    expect(screen.getByText(label)).toBeDefined();
  });

  it('shows the birthplace', () => {
    renderCard({ birthplace: 'Floresta Lukso' });

    expect(screen.getByText('Floresta Lukso')).toBeDefined();
  });

  it('shows the Nen category', () => {
    renderCard({ nenCategory: 'Materialização' });

    expect(datum('Nen')).toBe('Materialização');
  });

  it('names an unknown birthplace and Nen category', () => {
    renderCard({ birthplace: null, nenCategory: null });

    expect(datum('Nen')).toBe('Desconhecido');
    expect(screen.getAllByText('Desconhecido')).toHaveLength(2);
  });

  it.each([
    [[], 'Nenhuma'],
    [['Associação Hunter'], 'Associação Hunter'],
  ])('shows %j as a single affiliation line', (affiliations, value) => {
    renderCard({ affiliations });

    expect(datum('Filiação')).toBe(value);
    expect(screen.queryByRole('group')).toBeNull();
  });

  it('folds two or more affiliations behind a summary', () => {
    renderCard({
      affiliations: ['Associação Hunter', 'Clã Kurta', 'Família Nostrade'],
    });

    const disclosure = screen.getByRole('group');
    expect(within(disclosure).getByText('3 filiações')).toBeDefined();
    expect(
      within(disclosure)
        .getAllByRole('listitem')
        .map((item) => item.textContent),
    ).toEqual(['Associação Hunter', 'Clã Kurta', 'Família Nostrade']);
    expect(screen.queryByText('Filiação', { selector: 'dt' })).toBeNull();
  });

  it('links to the hunter sheet with the same filters', () => {
    renderCard({}, { name: 'Kurapika' });

    expect(
      screen
        .getByRole('link', { name: 'Abrir ficha de Kurapika' })
        .getAttribute('href'),
    ).toBe('/hunters/3?name=Kurapika');
  });
});
