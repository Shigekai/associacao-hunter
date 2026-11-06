import { getAffiliations, getArcs, getNenCategories } from '@/lib/api';
import { SearchForm } from './SearchForm';

export async function SearchFormLoader() {
  const [arcs, nenCategories, affiliations] = await Promise.all([
    getArcs(),
    getNenCategories(),
    getAffiliations(),
  ]);

  return (
    <SearchForm
      arcs={arcs}
      nenCategories={nenCategories}
      affiliations={affiliations}
    />
  );
}
