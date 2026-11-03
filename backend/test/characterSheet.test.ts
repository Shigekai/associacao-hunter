import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../src/app.js';
import type { CharacterSheet } from '../src/queries/characterSheet.js';
import { characterIds } from './mocks/seed.js';

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
    categories: [{ name: 'Intensificação', affinityType: 'Principal' }],
    efficiency: [
      { category: 'Intensificação', percent: 100 },
      { category: 'Transmutação', percent: 80 },
      { category: 'Materialização', percent: 60 },
      { category: 'Especialização', percent: 0 },
      { category: 'Manipulação', percent: 60 },
      { category: 'Emissão', percent: 80 },
    ],
  },
  abilities: [
    {
      name: 'Jajanken',
      description:
        'Golpe inspirado no pedra-papel-tesoura: pedra é um soco de Intensificação, tesoura uma lâmina de Transmutação e papel um disparo de Emissão',
      hatsuType: 'Ataque',
      auraCost: 3,
      categories: ['Intensificação', 'Transmutação', 'Emissão'],
      conditions: [
        { description: 'Concentrar a aura leva tempo e deixa a guarda aberta', type: 'Restrição' },
        { description: 'Recitar o canto do pedra-papel-tesoura antes do golpe', type: 'Gatilho' },
      ],
    },
    {
      name: 'Transformação por Restrição',
      description:
        'Por um juramento feito em desespero, Gon envelhece até a idade capaz de vencer Neferpitou e libera todo o seu potencial',
      hatsuType: 'Estado ativado',
      auraCost: 5,
      categories: ['Intensificação'],
      conditions: [{ description: 'Entrega todo o potencial de Nen em troca do poder imediato', type: 'Custo' }],
    },
  ],
  items: [
    {
      name: 'Vara de Pescar',
      description: 'Vara de pesca telescópica que Gon usa como arma desde o Exame Hunter',
      isNen: false,
      conjuredBy: null,
      categories: [],
    },
  ],
  affiliations: [
    { name: 'Associação Hunter', type: 'Organização', role: 'Hunter', joinedArc: 'Exame Hunter', leftArc: null, isActive: true },
  ],
  arcs: [
    { number: 1, name: 'Exame Hunter', startChapter: 1, endChapter: 43 },
    { number: 2, name: 'Torre Celestial', startChapter: 44, endChapter: 63 },
    { number: 3, name: 'Yorknew City', startChapter: 64, endChapter: 119 },
    { number: 4, name: 'Greed Island', startChapter: 120, endChapter: 185 },
    { number: 5, name: 'Formigas Quimera', startChapter: 186, endChapter: 318 },
    { number: 6, name: 'Eleição do Presidente', startChapter: 319, endChapter: 339 },
    { number: 7, name: 'Concurso de Sucessão', startChapter: 340, endChapter: null },
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

    expect(sheet.character.nicknames).toEqual(['Chro', 'Danchou']);
    expect(sheet.abilities[0].conditions.map(({ description }) => description)).toEqual([
      'Cumprir as três condições em até uma hora',
      'Fazer perguntas sobre a habilidade e ouvir a resposta',
      'O dono põe a mão na capa do livro',
      'Ver a habilidade sendo usada',
    ]);
    expect(sheet.items).toContainEqual({
      name: 'Segredo do Ladrão',
      description: 'Livro materializado que guarda as habilidades roubadas, uma por página',
      isNen: true,
      conjuredBy: 'Caçador de Habilidades',
      categories: ['Especialização'],
    });
  });

  it('reads the efficiency outward from the main category', async () => {
    const { nen } = await getSheet('Chrollo');

    // Gon (Intensificação) gets 0 in Especialização; this direction of the pair is 40.
    expect(nen.efficiency).toEqual([
      { category: 'Intensificação', percent: 40 },
      { category: 'Transmutação', percent: 60 },
      { category: 'Materialização', percent: 80 },
      { category: 'Especialização', percent: 100 },
      { category: 'Manipulação', percent: 80 },
      { category: 'Emissão', percent: 60 },
    ]);
  });

  it('lists the main category before a secondary one, and the categories of the ability that conjured an item', async () => {
    const sheet = await getSheet('Kurapika');

    expect(sheet.nen.categories).toEqual([
      { name: 'Materialização', affinityType: 'Principal' },
      { name: 'Especialização', affinityType: 'Secundária' },
    ]);
    expect(sheet.abilities).toHaveLength(6);
    expect(sheet.items).toContainEqual({
      name: 'Corrente do Polegar',
      description: 'Corrente com uma cruz na ponta, ligada ao polegar direito',
      isNen: true,
      conjuredBy: 'Corrente da Cura',
      categories: ['Intensificação', 'Materialização'],
    });
  });

  it('returns an ability without conditions with an empty list', async () => {
    const { abilities } = await getSheet('Hisoka');

    expect(abilities[0]).toMatchObject({ name: 'Bungee Gum', conditions: [] });
  });

  it('returns an ability outside Nen without hatsu fields', async () => {
    const { abilities } = await getSheet('Killua');

    expect(abilities).toContainEqual({
      name: 'Eco Rítmico',
      description: 'Técnica de assassino: passos em ritmo variado criam imagens residuais para confundir o adversário',
      hatsuType: null,
      auraCost: null,
      categories: [],
      conditions: [],
    });
  });

  it('returns a Nen item that no ability conjured without categories', async () => {
    const { items } = await getSheet('Killua');

    expect(items).toContainEqual({
      name: 'Colar do Paladino',
      description: 'Carta de Greed Island que vira um colar e anula maldições',
      isNen: true,
      conjuredBy: null,
      categories: [],
    });
  });

  it('keeps a membership that ended, without the seal, and the data the story leaves out as null', async () => {
    const sheet = await getSheet('Isaac');

    expect(sheet.character).toMatchObject({
      isLicensedHunter: false,
      isAlive: false,
      birthDate: null,
      birthplace: null,
    });
    expect(sheet.affiliations).toEqual([
      { name: 'Associação Hunter', type: 'Organização', role: 'Presidente', joinedArc: 'Exame Hunter', leftArc: 'Formigas Quimera', isActive: false },
    ]);
  });

  it('returns no items and a membership that starts and ends in the same arc', async () => {
    const sheet = await getSheet('Neferpitou');

    expect(sheet.character.sex).toBeNull();
    expect(sheet.items).toEqual([]);
    expect(sheet.affiliations).toEqual([
      { name: 'Formigas Quimera', type: 'Espécie', role: 'Guarda Real', joinedArc: 'Formigas Quimera', leftArc: 'Formigas Quimera', isActive: false },
    ]);
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
