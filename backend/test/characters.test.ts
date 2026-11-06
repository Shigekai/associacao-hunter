import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../src/app.js';
import type { CharacterSummary } from '../src/queries/characters.js';
import { affiliationIds, arcIds, categoryIds, characters } from './mocks/seed.js';

const allFirstNames = characters.map(({ firstName }) => firstName);

async function searchFirstNames(query: Record<string, string | number>) {
  const response = await request(app).get('/characters').query(query);

  expect(response.status).toBe(200);
  return response.body.map((character: { firstName: string }) => character.firstName);
}

async function findListed(firstName: string): Promise<CharacterSummary> {
  const response = await request(app).get('/characters').query({ name: firstName });

  expect(response.status).toBe(200);
  return response.body.find((character: CharacterSummary) => character.firstName === firstName);
}

describe('GET /characters', () => {
  it('lists every character by first name with the result card fields', async () => {
    const response = await request(app).get('/characters');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(characters);
  });

  it.each([
    { matches: 'a nickname', name: 'danchou', expected: ['Chrollo'] },
    { matches: 'a last name in any case', name: 'ZOLDYCK', expected: ['Illumi', 'Killua'] },
    { matches: 'the full name', name: 'gon freecss', expected: ['Gon'] },
    { matches: 'part of a first name', name: 'kil', expected: ['Killua'] },
    { matches: 'a character with no last name', name: 'neferpitou', expected: ['Neferpitou'] },
    { matches: 'a LIKE wildcard only literally', name: '%', expected: [] },
    { matches: 'a single-character wildcard only literally', name: '_', expected: [] },
    { matches: 'everyone when blank', name: '  ', expected: allFirstNames },
  ])('name "$name" matches $matches', async ({ name, expected }) => {
    expect(await searchFirstNames({ name })).toEqual(expected);
  });

  it('filters by Nen category', async () => {
    expect(await searchFirstNames({ categoryId: categoryIds['Transmutação'] })).toEqual(['Hisoka', 'Killua']);
  });

  it('filters by a secondary Nen category, which stays out of the card category', async () => {
    expect(await searchFirstNames({ categoryId: categoryIds['Intensificação'] })).toEqual(['Gon', 'Isaac', 'Killua']);
    expect((await findListed('Killua')).nenCategory).toBe('Transmutação');
  });

  it('filters by arc', async () => {
    expect(await searchFirstNames({ arcId: arcIds['Greed Island'] })).toEqual([
      'Chrollo',
      'Gon',
      'Hisoka',
      'Isaac',
      'Killua',
      'Kurapika',
      'Leorio',
    ]);
  });

  it('filters by affiliation in any arc', async () => {
    expect(await searchFirstNames({ affiliationId: affiliationIds['Trupe Fantasma'] })).toEqual(['Chrollo', 'Hisoka']);
  });

  it('counts a member who joins in the searched arc', async () => {
    const query = { affiliationId: affiliationIds['Associação Hunter'], arcId: arcIds['Greed Island'] };

    expect(await searchFirstNames(query)).toEqual(['Gon', 'Hisoka', 'Isaac', 'Killua', 'Kurapika', 'Leorio']);
  });

  it('drops a member who joins after the searched arc', async () => {
    const query = { affiliationId: affiliationIds['Associação Hunter'], arcId: arcIds['Yorknew City'] };

    expect(await searchFirstNames(query)).toEqual(['Gon', 'Hisoka', 'Illumi', 'Kurapika', 'Leorio']);
  });

  it('counts a member who leaves during the searched arc', async () => {
    const query = { affiliationId: affiliationIds['Trupe Fantasma'], arcId: arcIds['Yorknew City'] };

    expect(await searchFirstNames(query)).toEqual(['Chrollo', 'Hisoka']);
  });

  it('drops a member who left before the searched arc', async () => {
    const query = { affiliationId: affiliationIds['Trupe Fantasma'], arcId: arcIds['Greed Island'] };

    expect(await searchFirstNames(query)).toEqual(['Chrollo']);
  });

  it('combines the name with the other filters', async () => {
    const query = { name: 'zoldyck', categoryId: categoryIds['Manipulação'] };

    expect(await searchFirstNames(query)).toEqual(['Illumi']);
  });

  it('returns an empty list for an id that matches nothing', async () => {
    expect(await searchFirstNames({ arcId: 9999 })).toEqual([]);
  });

  it('lists only Nen abilities as hatsus', async () => {
    expect((await findListed('Killua')).hatsus).toEqual(['Palma Relâmpago', 'Raio', 'Velocidade Divina']);
  });

  it('lists current affiliations by the arc they were joined in, then by name', async () => {
    expect((await findListed('Killua')).affiliations).toEqual(['Família Zoldyck', 'Associação Hunter']);
    expect((await findListed('Kurapika')).affiliations).toEqual(['Associação Hunter', 'Clã Kurta', 'Família Nostrade']);
  });

  it('keeps a character with no known birthplace', async () => {
    expect((await findListed('Leorio')).birthplace).toBeNull();
  });

  it.each(['name=a&name=b', 'name=%00'])('rejects the name in ?%s', async (query) => {
    const response = await request(app).get(`/characters?${query}`);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Parâmetro inválido: name' });
  });

  it.each(['arcId', 'categoryId', 'affiliationId'])('validates the %s filter', async (filter) => {
    const response = await request(app).get(`/characters?${filter}=abc`);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: `Parâmetro inválido: ${filter}` });
  });
});
