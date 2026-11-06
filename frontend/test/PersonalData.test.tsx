import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PersonalData } from '@/components/sheet/PersonalData';
import { situation } from '@/lib/labels';
import { birthDay } from '@/lib/utils';
import { sheet } from './mocks/sheets';

function datum(label: string) {
  return screen.getByText(label, { selector: 'dt' }).nextElementSibling
    ?.textContent;
}

describe('PersonalData', () => {
  it('shows the birth day, sex, situation and birthplace', () => {
    const { character } = sheet();
    render(<PersonalData idPrefix="sheet-3" character={character} />);

    expect(datum('Nascimento')).toBe(birthDay('1983-04-04'));
    expect(datum('Sexo')).toBe('Masculino');
    expect(datum('Situação')).toBe(situation(true, 'Masculino'));
    expect(datum('Natural de')).toBe('Floresta Lukso');
  });

  it('names missing fields as unknown', () => {
    const { character } = sheet({
      character: { birthDate: null, sex: null, birthplace: null },
    });
    render(<PersonalData idPrefix="sheet-9" character={character} />);

    expect(datum('Nascimento')).toBe('Desconhecido');
    expect(datum('Sexo')).toBe('Desconhecido');
    expect(datum('Natural de')).toBe('Desconhecido');
  });
});
