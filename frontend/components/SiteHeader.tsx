import { Emblem } from '@/components/Emblem';

export function SiteHeader() {
  return (
    <header className="mx-auto flex h-14 w-full max-w-page items-center gap-2.5 px-4 desktop:h-16 desktop:gap-3 desktop:px-10">
      <Emblem className="h-auto w-6.5 desktop:w-7.5" />
      <span className="font-mono text-label font-semibold tracking-caps-lg uppercase desktop:text-data">
        Associação Hunter
      </span>
    </header>
  );
}
