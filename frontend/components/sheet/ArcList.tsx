import { SectionHeading } from '@/components/SectionHeading';
import type { CharacterSheet } from '@/lib/api';
import { arcNumber } from '@/lib/utils';

type ArcListProps = {
  idPrefix: string;
  arcs: CharacterSheet['arcs'];
};

export function ArcList({ idPrefix, arcs }: ArcListProps) {
  const id = `${idPrefix}-arcs`;

  return (
    <section aria-labelledby={id} className="flex flex-col gap-3">
      <SectionHeading id={id}>Extras · Arcos</SectionHeading>
      <ol className="flex flex-wrap gap-2">
        {arcs.map((arc) => (
          <li
            key={arc.number}
            className="flex items-center gap-2 rounded-full border border-line px-3 py-1.75 text-note font-semibold"
          >
            <span className="font-mono text-caption font-normal text-ink-muted">
              {arcNumber(arc.number)}
            </span>
            {arc.name}
          </li>
        ))}
      </ol>
    </section>
  );
}
