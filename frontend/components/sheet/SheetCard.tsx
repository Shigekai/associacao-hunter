import clsx from 'clsx';
import type { ReactNode } from 'react';

type SheetCardProps = {
  className?: string;
  children: ReactNode;
};

export function SheetCard({ className, children }: SheetCardProps) {
  return (
    <div
      className={clsx(
        'bg-white desktop:mx-auto desktop:max-w-modal desktop:overflow-hidden desktop:rounded-2xl desktop:shadow-modal',
        className,
      )}
    >
      {children}
    </div>
  );
}
