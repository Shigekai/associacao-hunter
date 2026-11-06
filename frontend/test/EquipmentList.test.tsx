import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EquipmentList } from '@/components/sheet/EquipmentList';

function rowTerms(itemName: string) {
  const row = screen.getByText(itemName).closest('li')!;
  const mark = within(row).getByText('Marca de Nen', {
    selector: 'dt',
  }).nextElementSibling?.textContent;
  const conjuredBy = within(row).getByText('Conjurado por', {
    selector: 'dt',
  }).nextElementSibling?.textContent;
  return { mark, conjuredBy };
}

describe('EquipmentList', () => {
  it('shows conjured Nen items, Nen items without an ability, and common items', () => {
    render(
      <EquipmentList
        idPrefix="sheet-3"
        items={[
          {
            name: 'Corrente do Polegar',
            description: 'Corrente com uma cruz na ponta',
            isNen: true,
            conjuredBy: 'Corrente da Cura',
            categories: ['Intensificação', 'Materialização'],
          },
          {
            name: 'Colar do Paladino',
            description: 'Carta de Greed Island',
            isNen: true,
            conjuredBy: null,
            categories: [],
          },
          {
            name: 'Espadas de Madeira',
            description: 'Par de espadas',
            isNen: false,
            conjuredBy: null,
            categories: [],
          },
        ]}
      />,
    );

    expect(rowTerms('Corrente do Polegar')).toEqual({
      mark: 'IntensificaçãoMaterialização',
      conjuredBy: 'Corrente da Cura',
    });
    expect(rowTerms('Colar do Paladino')).toEqual({
      mark: 'Nen',
      conjuredBy: 'Não registrado',
    });
    expect(rowTerms('Espadas de Madeira')).toEqual({
      mark: 'Nenhuma',
      conjuredBy: '— item comum',
    });
  });

  it('shows an empty message when the character has no items', () => {
    render(<EquipmentList idPrefix="sheet-9" items={[]} />);

    expect(screen.getByText('Nenhum item registrado.')).toBeDefined();
    expect(screen.queryByRole('list')).toBeNull();
  });
});
