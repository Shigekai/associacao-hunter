import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../src/app.js';
import { affiliationIds, arcIds, categoryIds, characters } from './mocks/seed.js';

const allFirstNames = characters.map(({ firstName }) => firstName);

async function searchFirstNames(query: Record<string, string | number>) {
  const response = await request(app).get('/characters').query(query);

  expect(response.status).toBe(200);
  return response.body.map((character: { firstName: string }) => character.firstName);
}

describe('GET /characters', () => {
  it('lists every character by first name with the result card fields', async () => {
    const response = await request(app).get('/characters');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(characters);
  });

  it.each([
    { matches: 'a nickname', name: 'bisky', expected: ['Biscuit'] },
    { matches: 'a last name in any case', name: 'FREECSS', expected: ['Ging', 'Gon'] },
    { matches: 'the full name', name: 'gon freecss', expected: ['Gon'] },
    { matches: 'part of a first name', name: 'kil', expected: ['Killua'] },
    { matches: 'a character with no last name', name: 'meruem', expected: ['Meruem'] },
    { matches: 'a LIKE wildcard only literally', name: '%', expected: [] },
    { matches: 'a single-character wildcard only literally', name: '_', expected: [] },
    { matches: 'everyone when blank', name: '  ', expected: allFirstNames },
  ])('name "$name" matches $matches', async ({ name, expected }) => {
    expect(await searchFirstNames({ name })).toEqual(expected);
  });

  it('filters by Nen category', async () => {
    expect(await searchFirstNames({ categoryId: categoryIds['Transformação'] })).toEqual(['Hisoka', 'Killua']);
  });

  it('filters by arc', async () => {
    expect(await searchFirstNames({ arcId: arcIds['Greed Island'] })).toEqual(['Gon', 'Hisoka']);
  });

  it('filters by affiliation in any arc', async () => {
    expect(await searchFirstNames({ affiliationId: affiliationIds['Trupe Fantasma'] })).toEqual(['Chrollo', 'Hisoka']);
  });

  it('counts a member who joins in the searched arc', async () => {
    const query = { affiliationId: affiliationIds['Associação Hunter'], arcId: arcIds['Exame Hunter'] };

    expect(await searchFirstNames(query)).toEqual(['Gon']);
  });

  it('counts a member who leaves during the searched arc', async () => {
    const query = { affiliationId: affiliationIds['Trupe Fantasma'], arcId: arcIds['Yorknew City'] };

    expect(await searchFirstNames(query)).toEqual(['Chrollo', 'Hisoka']);
  });

  it('drops a member who left before the searched arc', async () => {
    const query = { affiliationId: affiliationIds['Trupe Fantasma'], arcId: arcIds['Greed Island'] };

    expect(await searchFirstNames(query)).toEqual([]);
  });

  it('filters by affiliation during the searched arc', async () => {
    const query = { affiliationId: affiliationIds['Associação Hunter'], arcId: arcIds['Greed Island'] };

    expect(await searchFirstNames(query)).toEqual(['Gon']);
  });

  it('combines the name with the other filters', async () => {
    const query = { name: 'freecss', categoryId: categoryIds['Reforço'] };

    expect(await searchFirstNames(query)).toEqual(['Gon']);
  });

  it('returns an empty list for an id that matches nothing', async () => {
    expect(await searchFirstNames({ arcId: 9999 })).toEqual([]);
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
