import type { ReactNode } from 'react';
import { SheetCard } from './SheetCard';
import { SheetCloseButton } from './SheetCloseButton';
import { SheetTitle } from './SheetDialog';

type SheetPlaceholderProps = {
  children: ReactNode;
};

export function SheetPlaceholder({ children }: SheetPlaceholderProps) {
  return (
    <SheetCard className="flex min-h-full flex-col desktop:min-h-150">
      <header className="flex items-center justify-between bg-ink py-1.5 pr-1.5 pl-4 desktop:py-5 desktop:pr-3.5 desktop:pl-7">
        <SheetTitle className="font-mono text-caption font-medium tracking-caps-lg text-on-ink-subtle uppercase desktop:text-label-sm">
          Ficha de registro
        </SheetTitle>
        <SheetCloseButton />
      </header>
      <div className="flex flex-1 items-center justify-center px-4 py-16">
        {children}
      </div>
    </SheetCard>
  );
}
