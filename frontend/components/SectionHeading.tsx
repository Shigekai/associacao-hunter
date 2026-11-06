import clsx from 'clsx';
import type { ReactNode } from 'react';

type SectionHeadingProps = {
  id: string;
  complement?: ReactNode;
  className?: string;
  children: ReactNode;
};

export function SectionHeading({
  id,
  complement,
  className,
  children,
}: SectionHeadingProps) {
  return (
    <h3
      id={id}
      className={clsx(
        'flex justify-between gap-4 border-b-[1.5px] border-ink pb-2 font-mono text-label font-semibold tracking-caps-md uppercase',
        className,
      )}
    >
      <span>{children}</span>
      {complement && (
        <span className="font-medium text-ink-muted">{complement}</span>
      )}
    </h3>
  );
}
