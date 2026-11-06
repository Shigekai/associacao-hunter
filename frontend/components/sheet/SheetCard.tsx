import type { ReactNode } from 'react';

type SheetCardProps = {
  children: ReactNode;
};

export function SheetCard({ children }: SheetCardProps) {
  return (
    <div className="flex min-h-full flex-col bg-white desktop:mx-auto desktop:h-full desktop:min-h-140 desktop:max-w-modal desktop:overflow-hidden desktop:rounded-2xl desktop:shadow-modal">
      {children}
    </div>
  );
}
