import { Tag } from '@/components/Tag';
import type { CharacterSheet } from '@/lib/api';

type AbilityCardProps = {
  ability: CharacterSheet['abilities'][number];
};

const termClassName =
  'font-mono text-micro font-medium tracking-caps-md text-ink-muted uppercase';

export function AbilityCard({ ability }: AbilityCardProps) {
  const categories = ability.categories.join(' · ');
  const conditions = ability.conditions
    .map((condition) => condition.description)
    .join(' ');

  return (
    <article className="flex flex-col gap-2.5 rounded-[10px] border border-line-subtle p-3.5 desktop:px-4">
      <div className="flex flex-col items-start gap-2.5 desktop:flex-row desktop:items-center">
        <h4 className="text-highlight font-stretch-112% desktop:flex-1">
          {ability.name}
        </h4>
        {ability.hatsuType && <Tag>{ability.hatsuType}</Tag>}
      </div>
      <p className="text-body-sm text-ink-muted">{ability.description}</p>
      {(categories || conditions) && (
        <dl className="flex flex-col gap-2 desktop:gap-1.5">
          {categories && (
            <div className="desktop:grid desktop:grid-cols-[96px_minmax(0,1fr)] desktop:items-baseline desktop:gap-x-3">
              <dt className={termClassName}>Categorias</dt>
              <dd className="mt-0.5 text-note font-semibold desktop:mt-0">
                {categories}
              </dd>
            </div>
          )}
          {conditions && (
            <div className="desktop:grid desktop:grid-cols-[96px_minmax(0,1fr)] desktop:items-baseline desktop:gap-x-3">
              <dt className={termClassName}>Condições</dt>
              <dd className="mt-0.5 text-note desktop:mt-0">{conditions}</dd>
            </div>
          )}
        </dl>
      )}
    </article>
  );
}
