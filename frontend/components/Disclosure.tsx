import clsx from 'clsx';
import type { ReactNode } from 'react';

type DisclosureProps = {
  summary: ReactNode;
  summaryClassName?: string;
  className?: string;
  children: ReactNode;
};

export function Disclosure({
  summary,
  summaryClassName,
  className,
  children,
}: DisclosureProps) {
  return (
    <details
      className={clsx(
        'group details-content:h-0 details-content:overflow-hidden details-content:transition-[height,content-visibility] details-content:transition-discrete details-content:duration-250 open:details-content:h-auto motion-reduce:details-content:transition-none',
        className,
      )}
    >
      <summary
        className={clsx(
          'cursor-pointer list-none [&::-webkit-details-marker]:hidden',
          summaryClassName,
        )}
      >
        {summary}
      </summary>
      {children}
    </details>
  );
}
