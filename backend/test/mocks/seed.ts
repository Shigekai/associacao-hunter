import type { Affiliation } from '../../src/queries/affiliations.js';
import type { Arc } from '../../src/queries/arcs.js';
import type { NenCategory } from '../../src/queries/nenCategories.js';

// Rows as the select endpoints return them (same order); ids follow the SERIAL order of seed.sql.
export const arcs: Arc[] = [
  { id: 1, name: 'Exame Hunter', startChapter: 1, endChapter: 38 },
  { id: 2, name: 'Família Zoldyck', startChapter: 39, endChapter: 43 },
  { id: 3, name: 'Torre Celestial', startChapter: 44, endChapter: 63 },
  { id: 4, name: 'Yorknew City', startChapter: 64, endChapter: 119 },
  { id: 5, name: 'Greed Island', startChapter: 120, endChapter: 185 },
  { id: 6, name: 'Chimera Ant', startChapter: 186, endChapter: 318 },
  { id: 7, name: 'Eleição do Presidente', startChapter: 319, endChapter: 339 },
  { id: 8, name: 'Expedição ao Continente Negro', startChapter: 340, endChapter: 348 },
  { id: 9, name: 'Concurso de Sucessão', startChapter: 349, endChapter: 400 },
  { id: 10, name: 'Arco Desconhecido', startChapter: 401, endChapter: null },
];

export const nenCategories: NenCategory[] = [
  { id: 1, name: 'Reforço' },
  { id: 2, name: 'Emissão' },
  { id: 3, name: 'Transformação' },
  { id: 4, name: 'Manipulação' },
  { id: 5, name: 'Materialização' },
  { id: 6, name: 'Especialização' },
  { id: 7, name: 'Reforço Focado' },
  { id: 8, name: 'Materialização Simbiótica' },
  { id: 9, name: 'Manipulação Coercitiva' },
  { id: 10, name: 'Especialização Divinatória' },
];

export const affiliations: Affiliation[] = [
  { id: 1, name: 'Associação Hunter', type: 'Organização' },
  { id: 5, name: 'Clã Kurta', type: 'Clã' },
  { id: 6, name: 'Família Nostrade', type: 'Máfia' },
  { id: 9, name: 'Família Real Kakin', type: 'Realeza' },
  { id: 3, name: 'Família Zoldyck', type: 'Família' },
  { id: 4, name: 'Formigas Quimera', type: 'Espécie/Grupo' },
  { id: 10, name: 'Jogadores de GI', type: 'Grupo' },
  { id: 7, name: 'Shadow Beasts', type: 'Máfia' },
  { id: 2, name: 'Trupe Fantasma', type: 'Gangue' },
  { id: 8, name: 'Zodíacos', type: 'Conselho' },
];

function idsByName(rows: { id: number; name: string }[]): Record<string, number> {
  return Object.fromEntries(rows.map(({ id, name }) => [name, id]));
}

export const arcIds = idsByName(arcs);
export const categoryIds = idsByName(nenCategories);
export const affiliationIds = idsByName(affiliations);
