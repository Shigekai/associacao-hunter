# Naming

- English, descriptive names. Default: `camelCase` (variables, functions, files).
- `PascalCase`: React components (and their files) and TypeScript types.
- Next.js special files keep the required names (`page.tsx`, `layout.tsx`).
- URL routes: lowercase English (`/hunters/[hunterId]`).
- Database: `snake_case`, plural tables, `id` as primary key. Foreign key: `<entity>_id`, or `<role>_id` when the role is clearer (`owner_id`, `winner_id`). A specialization keeps its parent's key (`nen_abilities.ability_id`). PostgreSQL lowercases unquoted names, so camelCase would need quotes in every query. The API returns camelCase.
- User-facing content (data values, UI text): Portuguese.
