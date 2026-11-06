import clsx from 'clsx';
import { Hexagon } from 'lucide-react';
import type { CharacterSheet } from '@/lib/api';
import { labels } from '@/lib/labels';

type NenStatusProps = {
  idPrefix: string;
  nen: CharacterSheet['nen'];
};

const labelClassName =
  'font-mono text-micro font-medium tracking-caps-md text-ink-muted uppercase';

export function NenStatus({ idPrefix, nen }: NenStatusProps) {
  const id = `${idPrefix}-status`;
  const principal = nen.categories.find(
    (category) => category.affinityType === 'Principal',
  )?.name;

  return (
    <section
      aria-labelledby={`${id}-title`}
      className="flex flex-col gap-3 rounded-[10px] border border-line-subtle bg-panel p-4 desktop:bg-white desktop:p-3.5"
    >
      <h3
        id={`${id}-title`}
        className="font-mono text-label font-semibold tracking-caps-md uppercase desktop:text-label-sm desktop:font-medium desktop:text-ink-muted"
      >
        Status
      </h3>
      {nen.categories.length > 0 && (
        <dl className="grid grid-cols-2 gap-3 desktop:grid-cols-1 desktop:gap-2.5">
          {nen.categories.map((category) => (
            <div
              key={category.name}
              className="flex items-center gap-2 desktop:gap-2.5"
            >
              <Hexagon
                aria-hidden="true"
                strokeWidth={2}
                className={clsx(
                  'size-4.5 shrink-0 desktop:size-5',
                  category.affinityType === 'Principal'
                    ? 'fill-accent text-accent'
                    : 'text-ink',
                )}
              />
              <div className="flex min-w-0 flex-col gap-px">
                <dt className={labelClassName}>{category.affinityType}</dt>
                <dd className="text-body-sm font-bold">{category.name}</dd>
              </div>
            </div>
          ))}
        </dl>
      )}
      <div className="h-px bg-line-subtle" />
      <h4 id={`${id}-efficiency`} className={labelClassName}>
        Eficiência por categoria
      </h4>
      <ul
        aria-labelledby={`${id}-efficiency`}
        className="flex flex-col gap-2.5 desktop:gap-2.25"
      >
        {nen.efficiency.map(({ category, percent }, index) => {
          const isPrincipal = category === principal;
          return (
            <li key={category} className="flex flex-col gap-1">
              <div
                className={clsx(
                  'flex justify-between text-body-sm desktop:text-note',
                  isPrincipal && 'font-bold',
                )}
              >
                <span id={`${id}-${index}`}>{category}</span>
                <span
                  aria-hidden="true"
                  className={clsx(
                    'font-mono text-data',
                    isPrincipal && 'font-semibold',
                  )}
                >
                  {percent === null ? '—' : `${percent}%`}
                </span>
              </div>
              <meter
                aria-labelledby={`${id}-${index}`}
                aria-valuetext={percent === null ? labels.unknown : undefined}
                min={0}
                max={100}
                value={percent ?? 0}
                className={clsx(
                  'block h-1 w-full appearance-none rounded-[2px] bg-line-subtle [&::-moz-meter-bar]:rounded-[2px] [&::-webkit-meter-bar]:h-1 [&::-webkit-meter-bar]:rounded-[2px] [&::-webkit-meter-bar]:border-0 [&::-webkit-meter-bar]:bg-line-subtle [&::-webkit-meter-bar]:bg-none [&::-webkit-meter-optimum-value]:rounded-[2px] [&::-webkit-meter-optimum-value]:bg-none',
                  isPrincipal
                    ? '[&::-moz-meter-bar]:bg-accent [&::-webkit-meter-optimum-value]:bg-accent'
                    : '[&::-moz-meter-bar]:bg-ink [&::-webkit-meter-optimum-value]:bg-ink',
                )}
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
