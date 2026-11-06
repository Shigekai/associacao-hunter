import { Package } from 'lucide-react';
import { IconTile } from '@/components/IconTile';
import { SectionHeading } from '@/components/SectionHeading';
import { Tag } from '@/components/Tag';
import type { CharacterSheet } from '@/lib/api';
import { labels } from '@/lib/labels';

type Item = CharacterSheet['items'][number];

type EquipmentListProps = {
  idPrefix: string;
  items: Item[];
};

const columnsClassName =
  'desktop:grid desktop:grid-cols-[minmax(0,1fr)_140px_120px] desktop:gap-4';

const termClassName =
  'font-mono text-micro font-medium tracking-caps-md text-ink-muted uppercase desktop:sr-only';

function NenMark({ item }: { item: Item }) {
  if (item.categories.length > 0) {
    return (
      <span className="flex flex-wrap gap-1">
        {item.categories.map((category) => (
          <Tag key={category}>{category}</Tag>
        ))}
      </span>
    );
  }
  if (item.isNen) {
    return <Tag>{labels.nenMark}</Tag>;
  }
  return <Tag variant="dashed">{labels.none}</Tag>;
}

function ConjuredBy({ item }: { item: Item }) {
  if (!item.isNen) {
    return <span className="text-ink-muted">{labels.commonItem}</span>;
  }
  if (!item.conjuredBy) {
    return <span className="text-ink-muted">{labels.notRegistered}</span>;
  }
  return <span className="font-semibold">{item.conjuredBy}</span>;
}

export function EquipmentList({ idPrefix, items }: EquipmentListProps) {
  const id = `${idPrefix}-equipment`;

  return (
    <section aria-labelledby={id} className="flex flex-col">
      <SectionHeading id={id} className="desktop:mb-1">
        Equipamento
      </SectionHeading>
      {items.length === 0 ? (
        <p className="pt-3 text-body-sm text-ink-muted">{labels.noItems}</p>
      ) : (
        <>
          <div
            aria-hidden="true"
            className={`hidden py-2 font-mono text-micro font-medium tracking-caps-md text-ink-muted uppercase ${columnsClassName}`}
          >
            <span className="pl-12">Item</span>
            <span>Marca de Nen</span>
            <span>Conjurado por</span>
          </div>
          <ul>
            {items.map((item) => (
              <li
                key={item.name}
                className={`flex flex-col gap-2.5 border-t border-line-faint py-3.5 first:border-t-0 desktop:items-center desktop:py-3 desktop:first:border-t ${columnsClassName}`}
              >
                <div className="grid grid-cols-[36px_minmax(0,1fr)] items-center gap-x-3 gap-y-2.5 desktop:gap-y-0.5">
                  <span className="desktop:row-span-2">
                    <IconTile icon={Package} />
                  </span>
                  <p className="text-body font-bold">{item.name}</p>
                  <p className="col-span-2 text-note text-ink-muted desktop:col-span-1 desktop:col-start-2">
                    {item.description}
                  </p>
                </div>
                <dl className="grid grid-cols-2 gap-3 desktop:contents">
                  <div>
                    <dt className={termClassName}>Marca de Nen</dt>
                    <dd className="mt-1 desktop:mt-0">
                      <NenMark item={item} />
                    </dd>
                  </div>
                  <div>
                    <dt className={termClassName}>Conjurado por</dt>
                    <dd className="mt-1 text-body-sm desktop:mt-0">
                      <ConjuredBy item={item} />
                    </dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
