import {
  Activity,
  Calendar,
  MapPin,
  User,
  type LucideIcon,
} from 'lucide-react';
import { IconTile } from '@/components/IconTile';
import { SectionHeading } from '@/components/SectionHeading';
import type { CharacterSheet } from '@/lib/api';
import { labels, situation } from '@/lib/labels';
import { birthDay } from '@/lib/utils';

type PersonalDataProps = {
  idPrefix: string;
  character: CharacterSheet['character'];
};

type DatumProps = {
  icon: LucideIcon;
  label: string;
  value: string;
};

function Datum({ icon, label, value }: DatumProps) {
  return (
    <div className="relative flex items-center gap-3 border-b border-line-faint py-2.5 last:border-b-0 desktop:min-h-9 desktop:flex-col desktop:items-start desktop:justify-center desktop:gap-0.5 desktop:border-b-0 desktop:py-0 desktop:pl-12">
      <dt className="flex w-36 shrink-0 items-center gap-3 font-mono text-micro font-medium tracking-caps-md text-ink-muted uppercase desktop:w-auto">
        <span className="desktop:absolute desktop:top-1/2 desktop:left-0 desktop:-translate-y-1/2">
          <IconTile icon={icon} />
        </span>
        {label}
      </dt>
      <dd className="text-body font-semibold">{value}</dd>
    </div>
  );
}

export function PersonalData({ idPrefix, character }: PersonalDataProps) {
  const id = `${idPrefix}-personal`;

  return (
    <section aria-labelledby={id} className="flex flex-col gap-2 desktop:gap-3">
      <SectionHeading id={id}>Dados pessoais</SectionHeading>
      <dl className="flex flex-col desktop:grid desktop:grid-cols-2 desktop:gap-x-5 desktop:gap-y-3">
        <Datum
          icon={Calendar}
          label="Nascimento"
          value={
            character.birthDate ? birthDay(character.birthDate) : labels.unknown
          }
        />
        <Datum
          icon={User}
          label="Sexo"
          value={character.sex ?? labels.unknown}
        />
        <Datum
          icon={Activity}
          label="Situação"
          value={situation(character.isAlive, character.sex)}
        />
        <Datum
          icon={MapPin}
          label="Natural de"
          value={character.birthplace ?? labels.unknown}
        />
      </dl>
    </section>
  );
}
