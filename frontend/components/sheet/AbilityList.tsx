import { ChevronDown } from 'lucide-react';
import { buttonClassName } from '@/components/Button';
import { Disclosure } from '@/components/Disclosure';
import { SectionHeading } from '@/components/SectionHeading';
import type { CharacterSheet } from '@/lib/api';
import { labels, showAllAbilities, shownOf } from '@/lib/labels';
import { AbilityCard } from './AbilityCard';

type AbilityListProps = {
  idPrefix: string;
  abilities: CharacterSheet['abilities'];
};

const visibleCount = 3;

export function AbilityList({ idPrefix, abilities }: AbilityListProps) {
  const id = `${idPrefix}-abilities`;
  const total = abilities.length;
  const visible = abilities.slice(0, visibleCount);
  const folded = abilities.slice(visibleCount);

  return (
    <section
      aria-labelledby={id}
      className="group/abilities flex flex-col gap-3"
    >
      <SectionHeading
        id={id}
        complement={
          total === 0 ? undefined : folded.length === 0 ? (
            shownOf(total, total)
          ) : (
            <>
              <span className="group-has-open/abilities:hidden">
                {shownOf(visible.length, total)}
              </span>
              <span className="hidden group-has-open/abilities:inline">
                {shownOf(total, total)}
              </span>
            </>
          )
        }
      >
        Habilidades
      </SectionHeading>
      {total === 0 && (
        <p className="text-body-sm text-ink-muted">{labels.noAbilities}</p>
      )}
      {visible.map((ability) => (
        <AbilityCard key={ability.name} ability={ability} />
      ))}
      {folded.length > 0 && (
        <Disclosure
          summaryClassName={buttonClassName({ variant: 'dashed', size: 'sm' })}
          summary={
            <>
              <span className="group-open:hidden">
                {showAllAbilities(total)}
              </span>
              <span className="hidden group-open:inline">
                {labels.showLess}
              </span>
              <ChevronDown
                size={16}
                strokeWidth={2}
                className="transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
              />
            </>
          }
        >
          <div className="flex flex-col gap-3 pt-3">
            {folded.map((ability) => (
              <AbilityCard key={ability.name} ability={ability} />
            ))}
          </div>
        </Disclosure>
      )}
    </section>
  );
}
