import clsx from 'clsx';
import type { ReactNode } from 'react';

type TagProps = {
  variant?: 'solid' | 'dashed';
  className?: string;
  children: ReactNode;
};

export function Tag({ variant = 'solid', className, children }: TagProps) {
  return (
    <span
      className={clsx(
        'inline-block rounded-sm border px-2 py-1 font-mono text-caption leading-tight font-medium tracking-caps-sm uppercase',
        variant === 'solid' && 'border-ink',
        variant === 'dashed' &&
          'border-dashed border-on-ink-subtle text-ink-muted',
        className,
      )}
    >
      {children}
    </span>
  );
}
