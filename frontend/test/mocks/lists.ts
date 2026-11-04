import type {
  Affiliation,
  Arc,
  CharacterSummary,
  NenCategory,
} from '@/lib/api';
import type { NameSuggestions } from '@/app/api/hunters/suggestions/route';

export const arcs: Arc[] = [
  { id: 1, name: 'Exame Hunter', startChapter: 1, endChapter: 43 },
  { id: 4, name: 'Greed Island', startChapter: 120, endChapter: 185 },
];

export const nenCategories: NenCategory[] = [
  { id: 1, name: 'Intensificação' },
  { id: 2, name: 'Transmutação' },
];

export const affiliations: Affiliation[] = [
  { id: 1, name: 'Associação Hunter', type: 'Organização' },
  { id: 3, name: 'Família Zoldyck', type: 'Família' },
];

export function character(
  id: number,
  firstName: string,
  lastName: string | null,
): CharacterSummary {
  return {
    id,
    firstName,
    lastName,
    birthDate: null,
    sex: null,
    birthplace: null,
    nenCategory: null,
    affiliations: [],
    hatsus: [],
    isLicensedHunter: false,
  };
}

export function nameSuggestions(total: number, names: string[]) {
  return Response.json({
    total,
    suggestions: names.map((name, index) => ({ id: index + 1, name })),
  } satisfies NameSuggestions);
}
