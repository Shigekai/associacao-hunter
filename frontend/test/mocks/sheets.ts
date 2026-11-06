import type { CharacterSheet } from '@/lib/api';

type SheetOverrides = Omit<Partial<CharacterSheet>, 'character'> & {
  character?: Partial<CharacterSheet['character']>;
};

export function ability(
  name: string,
  overrides: Partial<CharacterSheet['abilities'][number]> = {},
): CharacterSheet['abilities'][number] {
  return {
    name,
    description: `Descrição de ${name}`,
    hatsuType: 'Objeto materializado',
    auraCost: 3,
    categories: ['Materialização'],
    conditions: [],
    ...overrides,
  };
}

export function sheet(overrides: SheetOverrides = {}): CharacterSheet {
  return {
    ...overrides,
    character: {
      id: 3,
      firstName: 'Kurapika',
      lastName: null,
      nicknames: ['Bastardo das Correntes'],
      birthDate: '1983-04-04',
      sex: 'Masculino',
      isAlive: true,
      birthplace: 'Floresta Lukso',
      isLicensedHunter: true,
      ...overrides.character,
    },
    nen: overrides.nen ?? {
      categories: [
        { name: 'Materialização', affinityType: 'Principal' },
        { name: 'Especialização', affinityType: 'Secundária' },
      ],
      efficiency: [
        { category: 'Intensificação', percent: 60 },
        { category: 'Transmutação', percent: 80 },
        { category: 'Materialização', percent: 100 },
        { category: 'Especialização', percent: 0 },
        { category: 'Manipulação', percent: 60 },
        { category: 'Emissão', percent: 40 },
      ],
    },
    abilities: overrides.abilities ?? [
      ability('Corrente da Cura', {
        categories: ['Intensificação', 'Materialização'],
        conditions: [
          {
            description: 'Cura ferimentos graves só com os olhos escarlates',
            type: 'Restrição',
          },
        ],
      }),
      ability('Corrente do Julgamento'),
      ability('Corrente Ladra'),
    ],
    items: overrides.items ?? [
      {
        name: 'Corrente do Polegar',
        description: 'Corrente com uma cruz na ponta',
        isNen: true,
        conjuredBy: 'Corrente da Cura',
        categories: ['Intensificação', 'Materialização'],
      },
    ],
    affiliations: overrides.affiliations ?? [
      {
        name: 'Associação Hunter',
        type: 'Organização',
        role: 'Lista Negra',
        joinedArc: 'Exame Hunter',
        leftArc: null,
        isActive: true,
      },
    ],
    arcs: overrides.arcs ?? [
      { number: 1, name: 'Exame Hunter', startChapter: 1, endChapter: 43 },
      { number: 3, name: 'Yorknew City', startChapter: 64, endChapter: 119 },
    ],
  };
}
