const filterKeys = ['name', 'arcId', 'categoryId', 'affiliationId'] as const;

export type SearchFilters = Partial<
  Record<(typeof filterKeys)[number], string>
>;

export type SearchParams = Record<string, string | string[] | undefined>;

function filterParams(filters: SearchFilters) {
  const params = new URLSearchParams();
  for (const key of filterKeys) {
    const value = filters[key]?.trim();
    if (value) {
      params.set(key, value);
    }
  }
  return params;
}

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function readFilters(searchParams: SearchParams): SearchFilters {
  return Object.fromEntries(
    filterParams({
      name: firstValue(searchParams.name),
      arcId: firstValue(searchParams.arcId),
      categoryId: firstValue(searchParams.categoryId),
      affiliationId: firstValue(searchParams.affiliationId),
    }),
  );
}

export function withFilters(path: string, filters: SearchFilters) {
  const query = filterParams(filters).toString();
  return query ? `${path}?${query}` : path;
}

export function huntersPath(filters: SearchFilters, hunterId?: number) {
  return withFilters(
    hunterId === undefined ? '/hunters' : `/hunters/${hunterId}`,
    filters,
  );
}

export function fullName({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string | null;
}) {
  return [firstName, lastName].filter(Boolean).join(' ');
}

export function slugify(text: string) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
