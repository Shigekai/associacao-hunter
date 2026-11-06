import { notFound } from 'next/navigation';
import {
  getAffiliations,
  getArcs,
  getNenCategories,
  searchCharacters,
} from '@/lib/api';
import { recordCount } from '@/lib/labels';
import { readFilters, type SearchParams } from '@/lib/utils';
import { FilterChips } from './FilterChips';
import { HunterCard } from './HunterCard';
import { resultsGridClassName } from './resultsGrid';

type ResultsLoaderProps = {
  searchParams: Promise<SearchParams>;
};

export async function ResultsLoader({ searchParams }: ResultsLoaderProps) {
  const filters = readFilters(await searchParams);
  const [characters, arcs, nenCategories, affiliations] = await Promise.all([
    searchCharacters(filters),
    filters.arcId ? getArcs() : null,
    filters.categoryId ? getNenCategories() : null,
    filters.affiliationId ? getAffiliations() : null,
  ]);
  if (!characters?.length) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-5 desktop:gap-7">
      <div className="flex flex-col gap-3 desktop:flex-row desktop:items-center desktop:justify-between desktop:gap-4">
        <FilterChips
          filters={filters}
          lists={{ arcs, nenCategories, affiliations }}
        />
        <p className="shrink-0 font-mono text-label-sm font-medium tracking-caps text-ink-muted uppercase desktop:text-label">
          {recordCount(characters.length)}
        </p>
      </div>
      <ul className={resultsGridClassName}>
        {characters.map((character) => (
          <li key={character.id}>
            <HunterCard character={character} filters={filters} />
          </li>
        ))}
      </ul>
    </div>
  );
}
