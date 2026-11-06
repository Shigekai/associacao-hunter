import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AbilityList } from '@/components/sheet/AbilityList';
import { ability } from './mocks/sheets';

describe('AbilityList', () => {
  it('shows up to 3 abilities without a disclosure', () => {
    render(
      <AbilityList
        idPrefix="sheet-1"
        abilities={[
          ability('Jajanken'),
          ability('Transformação por Restrição'),
        ]}
      />,
    );

    expect(screen.getByText('2 de 2')).toBeDefined();
    expect(
      screen.getAllByRole('heading', { level: 4 }).map((h) => h.textContent),
    ).toEqual(['Jajanken', 'Transformação por Restrição']);
    expect(screen.queryByRole('group')).toBeNull();
  });

  it('folds abilities past the third inside a disclosure', () => {
    render(
      <AbilityList
        idPrefix="sheet-3"
        abilities={[
          ability('Corrente da Cura'),
          ability('Corrente do Julgamento'),
          ability('Corrente Ladra'),
          ability('Corrente da Radiestesia'),
          ability('Corrente Prisão'),
          ability('Tempo do Imperador'),
        ]}
      />,
    );

    expect(screen.getByText('3 de 6')).toBeDefined();
    expect(screen.getByText('6 de 6')).toBeDefined();

    const disclosure = screen.getByRole('group');
    expect(within(disclosure).getByText('Ver as 6 habilidades')).toBeDefined();
    expect(within(disclosure).getByText('Ver menos')).toBeDefined();
    expect(
      within(disclosure)
        .getAllByRole('heading', { level: 4, hidden: true })
        .map((h) => h.textContent),
    ).toEqual([
      'Corrente da Radiestesia',
      'Corrente Prisão',
      'Tempo do Imperador',
    ]);
  });

  it('shows an empty message without a counter when there are no abilities', () => {
    render(<AbilityList idPrefix="sheet-9" abilities={[]} />);

    expect(screen.getByText('Nenhuma habilidade registrada.')).toBeDefined();
    expect(screen.getByRole('heading', { level: 3 }).textContent).toBe(
      'Habilidades',
    );
  });
});
