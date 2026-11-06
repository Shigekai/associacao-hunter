import { Emblem } from '@/components/Emblem';
import type { CharacterSheet } from '@/lib/api';
import { labels } from '@/lib/labels';
import { fullName } from '@/lib/utils';
import { SheetCloseButton } from './SheetCloseButton';
import { SheetTitle } from './SheetDialog';

type SheetHeaderProps = Pick<CharacterSheet, 'character' | 'affiliations'>;

function hunterRole(affiliations: SheetHeaderProps['affiliations']) {
  const role = affiliations.find(
    (affiliation) =>
      affiliation.name === 'Associação Hunter' && affiliation.isActive,
  )?.role;
  return role === 'Hunter' ? undefined : role;
}

export function SheetHeader({ character, affiliations }: SheetHeaderProps) {
  const nickname = character.nicknames[0];
  const role = hunterRole(affiliations);

  return (
    <header className="grid grid-cols-[minmax(0,1fr)_auto] gap-y-2.5 bg-ink pt-1.5 pr-1.5 pb-4.5 pl-4 text-white desktop:grid-cols-[minmax(0,1fr)_auto_auto] desktop:items-center desktop:gap-x-6 desktop:gap-y-2 desktop:py-5 desktop:pr-3.5 desktop:pl-7">
      <p className="col-start-1 row-start-1 self-center font-mono text-caption font-medium tracking-caps-lg text-on-ink-subtle uppercase desktop:self-end desktop:text-label-sm">
        Ficha de registro
      </p>
      <div className="col-span-2 row-start-2 flex flex-col gap-1.5 pr-2.5 desktop:col-span-1 desktop:flex-row desktop:flex-wrap desktop:items-baseline desktop:gap-x-4 desktop:pr-0">
        <SheetTitle className="text-3xl leading-none font-black tracking-[0.01em] uppercase font-stretch-125% desktop:text-name-lg">
          {fullName(character)}
        </SheetTitle>
        {nickname && (
          <p className="text-body text-on-ink-muted italic desktop:text-base">
            “{nickname}”
          </p>
        )}
      </div>
      {character.isLicensedHunter && (
        <div className="col-span-2 row-start-3 flex items-center gap-2.5 desktop:col-span-1 desktop:col-start-2 desktop:row-span-2 desktop:row-start-1 desktop:gap-3">
          <span className="flex h-8 w-12.5 items-center justify-center rounded-xs bg-white desktop:h-9.5 desktop:w-14.5">
            <Emblem aria-hidden="true" className="h-auto w-10 desktop:w-12" />
          </span>
          <div className="flex flex-col gap-0.5 font-mono uppercase desktop:gap-0.75">
            <p className="text-caption font-medium tracking-caps-md text-on-ink-muted desktop:text-label-sm">
              {labels.licensedHunter}
            </p>
            {role && (
              <p className="text-micro tracking-caps-sm text-on-ink-subtle desktop:text-caption">
                {role}
              </p>
            )}
          </div>
        </div>
      )}
      <SheetCloseButton className="col-start-2 row-start-1 desktop:col-start-3 desktop:row-span-2" />
    </header>
  );
}
