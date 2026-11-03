import type { Affiliation } from '../../src/queries/affiliations.js';
import type { Arc } from '../../src/queries/arcs.js';
import type { CharacterSummary } from '../../src/queries/characters.js';
import type { NenCategory } from '../../src/queries/nenCategories.js';

// Rows as the select endpoints return them (same order); ids follow the SERIAL order of seed.sql.
export const arcs: Arc[] = [
  { id: 1, name: 'Exame Hunter', startChapter: 1, endChapter: 43 },
  { id: 2, name: 'Torre Celestial', startChapter: 44, endChapter: 63 },
  { id: 3, name: 'Yorknew City', startChapter: 64, endChapter: 119 },
  { id: 4, name: 'Greed Island', startChapter: 120, endChapter: 185 },
  { id: 5, name: 'Formigas Quimera', startChapter: 186, endChapter: 318 },
  { id: 6, name: 'Eleição do Presidente', startChapter: 319, endChapter: 339 },
  { id: 7, name: 'Concurso de Sucessão', startChapter: 340, endChapter: null },
];

export const nenCategories: NenCategory[] = [
  { id: 1, name: 'Intensificação' },
  { id: 2, name: 'Transmutação' },
  { id: 3, name: 'Materialização' },
  { id: 4, name: 'Especialização' },
  { id: 5, name: 'Manipulação' },
  { id: 6, name: 'Emissão' },
];

export const affiliations: Affiliation[] = [
  { id: 1, name: 'Associação Hunter', type: 'Organização' },
  { id: 5, name: 'Clã Kurta', type: 'Clã' },
  { id: 6, name: 'Família Nostrade', type: 'Máfia' },
  { id: 3, name: 'Família Zoldyck', type: 'Família' },
  { id: 4, name: 'Formigas Quimera', type: 'Espécie' },
  { id: 2, name: 'Trupe Fantasma', type: 'Gangue' },
];

// Rows as GET /characters returns them with no filter, ordered by first name.
export const characters: CharacterSummary[] = [
  { id: 7, firstName: 'Chrollo', lastName: 'Lucilfer', birthDate: null, sex: 'Masculino', birthplace: 'Meteor City', nenCategory: 'Especialização', affiliations: ['Trupe Fantasma'], hatsus: ['Caçador de Habilidades', 'Pano Fun Fun'], isLicensedHunter: false },
  { id: 1, firstName: 'Gon', lastName: 'Freecss', birthDate: '1987-05-05', sex: 'Masculino', birthplace: 'Ilha da Baleia', nenCategory: 'Intensificação', affiliations: ['Associação Hunter'], hatsus: ['Jajanken', 'Transformação por Restrição'], isLicensedHunter: true },
  { id: 5, firstName: 'Hisoka', lastName: 'Morow', birthDate: '1972-06-06', sex: 'Masculino', birthplace: null, nenCategory: 'Transmutação', affiliations: ['Associação Hunter'], hatsus: ['Bungee Gum', 'Textura Surpresa'], isLicensedHunter: true },
  { id: 6, firstName: 'Illumi', lastName: 'Zoldyck', birthDate: null, sex: 'Masculino', birthplace: 'Montanha Kukuroo', nenCategory: 'Manipulação', affiliations: ['Associação Hunter', 'Família Zoldyck'], hatsus: ['Alteração Corporal', 'Controle de Cadáveres', 'Feitiço Hipnótico', 'Pessoas-Agulha'], isLicensedHunter: true },
  { id: 8, firstName: 'Isaac', lastName: 'Netero', birthDate: null, sex: 'Masculino', birthplace: null, nenCategory: 'Intensificação', affiliations: [], hatsus: ['Bodhisattva Guanyin de Cem Formas'], isLicensedHunter: false },
  { id: 2, firstName: 'Killua', lastName: 'Zoldyck', birthDate: '1987-07-07', sex: 'Masculino', birthplace: 'Montanha Kukuroo', nenCategory: 'Transmutação', affiliations: ['Família Zoldyck', 'Associação Hunter'], hatsus: ['Palma Relâmpago', 'Raio', 'Velocidade Divina'], isLicensedHunter: true },
  { id: 3, firstName: 'Kurapika', lastName: null, birthDate: '1982-04-04', sex: 'Masculino', birthplace: 'Floresta Lukso', nenCategory: 'Materialização', affiliations: ['Associação Hunter', 'Clã Kurta', 'Família Nostrade'], hatsus: ['Corrente da Cura', 'Corrente do Julgamento', 'Corrente Ladra', 'Corrente Prisão', 'Corrente Rabdomante', 'Tempo do Imperador'], isLicensedHunter: true },
  { id: 4, firstName: 'Leorio', lastName: 'Paradinight', birthDate: '1980-03-03', sex: 'Masculino', birthplace: null, nenCategory: 'Emissão', affiliations: ['Associação Hunter'], hatsus: ['Soco Remoto'], isLicensedHunter: true },
  { id: 9, firstName: 'Neferpitou', lastName: null, birthDate: null, sex: null, birthplace: 'NGL', nenCategory: 'Especialização', affiliations: [], hatsus: ['Doutor Blythe', 'Marionetista', 'Terpsichora'], isLicensedHunter: false },
];

function idsByName(rows: { id: number; name: string }[]): Record<string, number> {
  return Object.fromEntries(rows.map(({ id, name }) => [name, id]));
}

export const arcIds = idsByName(arcs);
export const categoryIds = idsByName(nenCategories);
export const affiliationIds = idsByName(affiliations);
export const characterIds: Record<string, number> = Object.fromEntries(
  characters.map(({ id, firstName }) => [firstName, id]),
);
