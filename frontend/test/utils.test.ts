import { describe, expect, it } from 'vitest';
import {
  arcNumber,
  birthDay,
  huntersPath,
  readFilters,
  slugify,
} from '@/lib/utils';

describe('readFilters', () => {
  it('drops empty values, as a native GET sends them', () => {
    expect(
      readFilters({ name: '', arcId: '', categoryId: '', affiliationId: '' }),
    ).toEqual({});
  });

  it('keeps the first of a repeated value', () => {
    expect(readFilters({ arcId: ['4', '1'] })).toEqual({ arcId: '4' });
  });

  it('trims the name and ignores unknown keys', () => {
    expect(readFilters({ name: '  Gon ', page: '2' })).toEqual({
      name: 'Gon',
    });
  });
});

describe('huntersPath', () => {
  it('links to the results without a query when no filter is set', () => {
    expect(huntersPath({ name: ' ', arcId: '' })).toBe('/hunters');
  });

  it('writes the filters in a fixed order', () => {
    expect(
      huntersPath({ affiliationId: '3', name: 'Gon Freecss', arcId: '4' }),
    ).toBe('/hunters?name=Gon+Freecss&arcId=4&affiliationId=3');
  });

  it('links to a hunter with the same filters', () => {
    expect(huntersPath({ name: 'Kurapika' }, 3)).toBe(
      '/hunters/3?name=Kurapika',
    );
    expect(huntersPath({}, 3)).toBe('/hunters/3');
  });
});

describe('slugify', () => {
  it.each([
    ['Isaac Netero', 'isaac-netero'],
    ['Associação Hunter', 'associacao-hunter'],
  ])('turns %j into %j', (text, slug) => {
    expect(slugify(text)).toBe(slug);
  });
});

describe('birthDay', () => {
  it('formats the day and month in UTC without the year', () => {
    expect(birthDay('1983-04-04')).toBe('4 de abril');
  });
});

describe('arcNumber', () => {
  it.each([
    [5, '05'],
    [12, '12'],
  ])('pads %i as %j', (number, padded) => {
    expect(arcNumber(number)).toBe(padded);
  });
});
