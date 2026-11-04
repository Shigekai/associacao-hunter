import type { ReactNode } from 'react';
import { Emblem } from '@/components/Emblem';

export function SearchLicense({ children }: { children: ReactNode }) {
  return (
    <section
      aria-label="Licença de consulta"
      className="rounded-[14px] border-[1.5px] border-ink bg-license shadow-card-sm desktop:shadow-card"
    >
      <div className="flex flex-col gap-7.5 rounded-t-[12.5px] bg-ink px-3.75 pt-7.25 pb-2.5 text-white desktop:gap-8.5 desktop:px-4.5 desktop:pt-8.25 desktop:pb-2.75">
        <div className="mx-6 flex h-31 items-center justify-center rounded-xs bg-white desktop:mx-7.5 desktop:h-35">
          <Emblem className="h-auto w-33.5 desktop:w-40" />
        </div>
        <div className="flex flex-col gap-1 px-2 desktop:gap-1.25 desktop:px-3">
          <span className="font-mono text-caption font-medium tracking-caps-lg text-on-ink-muted uppercase desktop:text-label">
            Licença de consulta
          </span>
          <span className="text-name-sm font-black tracking-[0.02em] uppercase font-stretch-125% desktop:text-xl/none">
            Associação Hunter
          </span>
          <span className="font-mono text-caption tracking-caps-md text-on-ink-muted uppercase desktop:text-label">
            Base de registros
          </span>
        </div>
      </div>
      {children}
    </section>
  );
}
