import type { Affiliation, Arc, NenCategory } from '@/lib/api';
import { labels } from '@/lib/labels';
import type { SearchFilters } from '@/lib/utils';

export type FilterLists = {
  arcs: Arc[] | null;
  nenCategories: NenCategory[] | null;
  affiliations: Affiliation[] | null;
};

type FilterChip = {
  label: string;
  value: string;
};

function selectChip(
  label: string,
  id: string | undefined,
  options: { id: number; name: string }[] | null,
  emptyValue: string,
): FilterChip | null {
  if (!id) {
    return { label, value: emptyValue };
  }
  const option = options?.find((item) => String(item.id) === id);
  return option ? { label, value: option.name } : null;
}

function filterChips(filters: SearchFilters, lists: FilterLists) {
  return [
    filters.name ? { label: 'Nome', value: filters.name } : null,
    selectChip('Arco', filters.arcId, lists.arcs, labels.allArcs),
    selectChip('Nen', filters.categoryId, lists.nenCategories, labels.all),
    selectChip(
      'Filiação',
      filters.affiliationId,
      lists.affiliations,
      labels.all,
    ),
  ].filter((chip) => chip !== null);
}

type FilterChipsProps = {
  filters: SearchFilters;
  lists: FilterLists;
};

export function FilterChips({ filters, lists }: FilterChipsProps) {
  return (
    <ul
      aria-label="Filtros aplicados"
      tabIndex={0}
      className="-mx-4 flex snap-x snap-mandatory scroll-px-4 scrollbar-none gap-2 overflow-x-auto px-4 font-mono text-caption leading-3.25 font-medium tracking-caps whitespace-nowrap text-white uppercase desktop:mx-0 desktop:flex-wrap desktop:overflow-visible desktop:px-0 desktop:text-label-sm desktop:leading-3.5 [&::-webkit-scrollbar]:hidden"
    >
      {filterChips(filters, lists).map((chip) => (
        <li
          key={chip.label}
          className="shrink-0 snap-start rounded-full bg-ink px-2.5 py-1.5"
        >
          {chip.label} · {chip.value}
        </li>
      ))}
    </ul>
  );
}
