import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AbilityCard } from '@/components/sheet/AbilityCard';
import { ability } from './mocks/sheets';

function datum(label: string) {
  return screen.getByText(label, { selector: 'dt' }).nextElementSibling
    ?.textContent;
}

describe('AbilityCard', () => {
  it('shows the name, hatsu tag, description, categories and conditions', () => {
    render(
      <AbilityCard
        ability={ability('Jajanken', {
          hatsuType: 'Ataque',
          description: 'Golpe inspirado no pedra-papel-tesoura',
          categories: ['Intensificação', 'Transmutação', 'Emissão'],
          conditions: [
            { description: 'Concentrar a aura.', type: 'Restrição' },
            { description: 'Recitar o canto.', type: 'Gatilho' },
          ],
        })}
      />,
    );

    expect(
      screen.getByRole('heading', { level: 4, name: 'Jajanken' }),
    ).toBeDefined();
    expect(screen.getByText('Ataque')).toBeDefined();
    expect(
      screen.getByText('Golpe inspirado no pedra-papel-tesoura'),
    ).toBeDefined();
    expect(datum('Categorias')).toBe('Intensificação · Transmutação · Emissão');
    expect(datum('Condições')).toBe('Concentrar a aura. Recitar o canto.');
  });

  it('omits the hatsu tag, categories and conditions when absent', () => {
    render(
      <AbilityCard
        ability={ability('Eco Rítmico', {
          hatsuType: null,
          categories: [],
          conditions: [],
        })}
      />,
    );

    expect(screen.queryByText('Objeto materializado')).toBeNull();
    expect(screen.queryByText('Categorias', { selector: 'dt' })).toBeNull();
    expect(screen.queryByText('Condições', { selector: 'dt' })).toBeNull();
  });
});
