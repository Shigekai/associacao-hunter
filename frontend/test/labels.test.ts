import { describe, expect, it } from 'vitest';
import {
  recordCount,
  showAllAbilities,
  shownOf,
  situation,
} from '@/lib/labels';

describe('recordCount', () => {
  it.each([
    [1, '1 registro'],
    [9, '9 registros'],
  ])('counts %i as %j', (total, label) => {
    expect(recordCount(total)).toBe(label);
  });
});

describe('situation', () => {
  it.each([
    [true, 'Masculino', 'Vivo'],
    [false, 'Masculino', 'Morto'],
    [true, 'Feminino', 'Viva'],
    [false, 'Feminino', 'Morta'],
    [true, null, 'Vivo'],
  ])('formats alive=%s, sex=%j as %j', (isAlive, sex, label) => {
    expect(situation(isAlive, sex)).toBe(label);
  });
});

describe('sheet ability labels', () => {
  it('formats the counter and the disclosure button', () => {
    expect(shownOf(3, 6)).toBe('3 de 6');
    expect(showAllAbilities(6)).toBe('Ver as 6 habilidades');
  });
});
