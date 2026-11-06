import { ArrowRight, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { CharacterPortrait } from '@/components/CharacterPortrait';
import { Disclosure } from '@/components/Disclosure';
import { Emblem } from '@/components/Emblem';
import type { CharacterSummary } from '@/lib/api';
import { affiliationCount, labels } from '@/lib/labels';
import { fullName, huntersPath, type SearchFilters } from '@/lib/utils';

type CardDatumProps = {
  label: string;
  value: string;
};

function CardDatum({ label, value }: CardDatumProps) {
  return (
    <div className="flex flex-col gap-px desktop:grid desktop:grid-cols-[72px_minmax(0,1fr)] desktop:items-baseline desktop:gap-x-2.5">
      <dt className="font-mono text-micro font-medium tracking-caps text-ink-muted uppercase desktop:text-caption">
        {label}
      </dt>
      <dd className="text-note font-semibold">{value}</dd>
    </div>
  );
}

type HunterCardProps = {
  character: CharacterSummary;
  filters: SearchFilters;
};

export function HunterCard({ character, filters }: HunterCardProps) {
  const name = fullName(character);
  const { affiliations } = character;

  return (
    <article className="relative isolate grid min-h-54 grid-cols-[108px_minmax(0,1fr)] overflow-hidden rounded-xl border border-line bg-white transition-[border-color,box-shadow] duration-150 active:border-ink motion-reduce:transition-none desktop:min-h-60.75 desktop:grid-cols-[132px_minmax(0,1fr)] desktop:hover:border-ink desktop:hover:shadow-card-hover">
      <CharacterPortrait
        name={name}
        alt=""
        sizes="(min-width: 1024px) 240px, 210px"
        className="border-r border-line"
      />
      <div className="flex flex-col px-3.5 pt-3.5 pb-3 desktop:px-4.5 desktop:py-4">
        <p className="font-mono text-micro font-medium tracking-caps-md text-ink-muted uppercase desktop:text-caption">
          {character.isLicensedHunter ? labels.licensed : labels.notLicensed}
        </p>
        <h2 className="mt-2 text-name-sm font-black uppercase font-stretch-125% desktop:mt-2.5 desktop:text-name">
          <Link
            href={huntersPath(filters, character.id)}
            aria-label={`Abrir ficha de ${name}`}
            className="decoration-2 underline-offset-3 after:absolute after:inset-0 desktop:hover:underline"
          >
            {name}
          </Link>
        </h2>
        <p className="mt-1 hidden text-note text-ink-muted desktop:block">
          {character.birthplace ?? labels.unknown}
        </p>
        <dl className="mt-3 flex flex-col gap-2 border-t border-line-subtle pt-2.5 desktop:mt-3.5 desktop:gap-1.5 desktop:pt-3">
          <CardDatum
            label="Nen"
            value={character.nenCategory ?? labels.unknown}
          />
          {affiliations.length < 2 && (
            <CardDatum
              label="Filiação"
              value={affiliations[0] ?? labels.none}
            />
          )}
        </dl>
        {affiliations.length >= 2 && (
          <Disclosure
            className="relative z-10 mt-2 border-t border-line-subtle desktop:mt-2.5 desktop:pt-1.5"
            summaryClassName="-mx-1.5 flex min-h-11 items-center justify-between gap-2 rounded-sm px-1.5 font-mono text-micro font-medium tracking-caps text-ink-muted uppercase active:bg-paper desktop:min-h-8 desktop:text-caption desktop:hover:bg-paper"
            summary={
              <>
                {affiliationCount(affiliations.length)}
                <ChevronDown
                  size={18}
                  className="text-ink transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none desktop:size-4"
                />
              </>
            }
          >
            <ul className="mb-2 flex flex-col gap-1.5 desktop:mt-1 desktop:mb-1.5">
              {affiliations.map((affiliation) => (
                <li
                  key={affiliation}
                  className="flex items-center gap-2 text-note font-semibold before:size-1 before:shrink-0 before:rounded-[1px] before:bg-ink"
                >
                  {affiliation}
                </li>
              ))}
            </ul>
          </Disclosure>
        )}
        <span
          aria-hidden="true"
          className="mt-auto flex items-center gap-1.5 self-start pt-1.5 font-mono text-micro font-semibold tracking-caps-md uppercase desktop:pt-3 desktop:text-caption"
        >
          Ver ficha
          <ArrowRight size={14} />
        </span>
      </div>
      <Emblem
        aria-hidden="true"
        className="absolute right-3 bottom-3 -z-10 h-auto w-16 opacity-12 desktop:right-3.5 desktop:bottom-3.5 desktop:w-20"
      />
    </article>
  );
}
