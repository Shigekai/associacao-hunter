import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../src/app.js';
import type { CharacterSheet } from '../src/queries/characterSheet.js';
import { characterIds, nenCategories } from './mocks/seed.js';

const gonSheet: CharacterSheet = {
  character: {
    id: 1,
    firstName: 'Gon',
    lastName: 'Freecss',
    nicknames: [],
    birthDate: '1987-05-05',
    sex: 'Masculino',
    isAlive: true,
    birthplace: 'Ilha da Baleia',
    isLicensedHunter: true,
  },
  nen: {
    categories: [{ name: 'Reforço', affinityType: 'Principal' }],
    efficiency: [
      { category: 'Reforço', percent: 100 },
      { category: 'Emissão', percent: 80 },
      { category: 'Transformação', percent: 80 },
      { category: 'Manipulação', percent: null },
      { category: 'Materialização', percent: null },
      { category: 'Especialização', percent: 0 },
      { category: 'Reforço Focado', percent: null },
      { category: 'Materialização Simbiótica', percent: null },
      { category: 'Manipulação Coercitiva', percent: null },
      { category: 'Especialização Divinatória', percent: null },
    ],
  },
  abilities: [
    {
      name: 'Jajanken',
      description: 'Ataque baseado em pedra-papel-tesoura',
      hatsuType: 'Ataque Fisico',
      auraCost: 500,
      categories: ['Reforço'],
      conditions: [{ description: 'Dizer "Pedra, Papel, Tesoura" em voz alta', type: 'Tempo/Fala' }],
    },
  ],
  items: [
    { name: 'Licença Hunter', description: 'Cartão de altíssimo valor e acesso', isNen: false, conjuredBy: null, categories: [] },
    { name: 'Vara de Pescar', description: 'Vara antiga usada por Ging', isNen: false, conjuredBy: null, categories: [] },
  ],
  affiliations: [
    { name: 'Associação Hunter', type: 'Organização', role: 'Hunter', joinedArc: 'Exame Hunter', leftArc: null, isActive: true },
  ],
  arcs: [
    { number: 1, name: 'Exame Hunter', startChapter: 1, endChapter: 38 },
    { number: 5, name: 'Greed Island', startChapter: 120, endChapter: 185 },
  ],
};

async function getSheet(firstName: string): Promise<CharacterSheet> {
  const response = await request(app).get(`/characters/${characterIds[firstName]}`);

  expect(response.status).toBe(200);
  return response.body;
}

describe('GET /characters/:characterId', () => {
  it('returns the whole sheet: seal, efficiency from the main category, abilities, items, affiliations and numbered arcs', async () => {
    expect(await getSheet('Gon')).toEqual(gonSheet);
  });

  it('lists nicknames, conditions by description and the ability that conjured an item', async () => {
    const sheet = await getSheet('Chrollo');

    expect(sheet.character.nicknames).toEqual(['Danchou']);
    expect(sheet.abilities[0].conditions.map(({ description }) => description)).toEqual([
      'Colocar a mão no livro aberto',
      'Explicar a habilidade para a vítima',
      'Saber o nome do alvo',
      'Ver a habilidade sendo usada antes',
    ]);
    expect(sheet.items).toContainEqual({
      name: 'Bandit Secret',
      description: 'Livro contendo habilidades roubadas',
      isNen: true,
      conjuredBy: 'Skill Hunter',
      categories: ['Especialização'],
    });
  });

  it('reads an affinity pair in its stored direction only', async () => {
    const { nen } = await getSheet('Chrollo');

    expect(nen.efficiency).toContainEqual({ category: 'Manipulação', percent: 80 });
    expect(nen.efficiency).toContainEqual({ category: 'Reforço', percent: null });
  });

  it('returns an ability without conditions with an empty list', async () => {
    const { abilities } = await getSheet('Meruem');

    expect(abilities[0].conditions).toEqual([]);
  });

  it('returns a Nen item that no ability conjured without categories', async () => {
    const { items } = await getSheet('Killua');

    expect(items).toContainEqual({
      name: 'Anel de Paladino',
      description: 'Remove maldições',
      isNen: true,
      conjuredBy: null,
      categories: [],
    });
  });

  it('keeps a membership that ended, without the seal', async () => {
    const sheet = await getSheet('Isaac');

    expect(sheet.character.isLicensedHunter).toBe(false);
    expect(sheet.character.isAlive).toBe(false);
    expect(sheet.affiliations).toEqual([
      { name: 'Associação Hunter', type: 'Organização', role: 'Presidente', joinedArc: 'Exame Hunter', leftArc: 'Chimera Ant', isActive: false },
    ]);
  });

  it('returns empty sections and every efficiency as null without a main category', async () => {
    const sheet = await getSheet('Ging');

    expect(sheet.nen).toEqual({
      categories: [],
      efficiency: nenCategories.map(({ name }) => ({ category: name, percent: null })),
    });
    expect(sheet.abilities).toEqual([]);
    expect(sheet.affiliations).toEqual([]);
    expect(sheet.arcs).toEqual([]);
  });

  it('answers 404 for a character that does not exist', async () => {
    const response = await request(app).get('/characters/9999');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Personagem não encontrado' });
  });

  it('validates the character id', async () => {
    const response = await request(app).get('/characters/abc');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Parâmetro inválido: characterId' });
  });
});
