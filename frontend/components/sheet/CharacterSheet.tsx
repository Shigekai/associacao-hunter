import { CharacterPortrait } from '@/components/CharacterPortrait';
import type { CharacterSheet as Sheet } from '@/lib/api';
import { fullName } from '@/lib/utils';
import { AbilityList } from './AbilityList';
import { ArcList } from './ArcList';
import { EquipmentList } from './EquipmentList';
import { NenStatus } from './NenStatus';
import { PersonalData } from './PersonalData';
import { SheetCard } from './SheetCard';
import { SheetHeader } from './SheetHeader';

type CharacterSheetProps = {
  sheet: Sheet;
};

export function CharacterSheet({ sheet }: CharacterSheetProps) {
  const name = fullName(sheet.character);
  const idPrefix = `sheet-${sheet.character.id}`;

  return (
    <SheetCard>
      <SheetHeader
        character={sheet.character}
        affiliations={sheet.affiliations}
      />
      <div className="flex flex-col gap-7 px-4 pt-4 pb-10 desktop:grid desktop:grid-cols-[290px_minmax(0,1fr)_340px] desktop:gap-0 desktop:p-0">
        <div className="desktop:col-start-3 desktop:row-start-1 desktop:border-l desktop:border-line-subtle desktop:px-5 desktop:pt-5 desktop:pb-7">
          <CharacterPortrait
            name={name}
            alt={`Retrato de ${name}`}
            sizes="(min-width: 1024px) 520px, 100vw"
            className="h-100 rounded-[10px] border border-line desktop:h-135"
          />
        </div>
        <div className="desktop:col-start-1 desktop:row-start-1 desktop:border-r desktop:border-line-subtle desktop:bg-panel desktop:p-5">
          <NenStatus idPrefix={idPrefix} nen={sheet.nen} />
        </div>
        <div className="contents desktop:col-start-2 desktop:row-start-1 desktop:flex desktop:min-w-0 desktop:flex-col desktop:gap-7 desktop:px-7 desktop:pt-6 desktop:pb-7">
          <PersonalData idPrefix={idPrefix} character={sheet.character} />
          <AbilityList idPrefix={idPrefix} abilities={sheet.abilities} />
          <EquipmentList idPrefix={idPrefix} items={sheet.items} />
          {sheet.arcs.length > 0 && (
            <ArcList idPrefix={idPrefix} arcs={sheet.arcs} />
          )}
        </div>
      </div>
    </SheetCard>
  );
}
