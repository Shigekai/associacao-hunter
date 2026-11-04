import clsx from 'clsx';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export const controlClassName = clsx(
  'h-12 w-full rounded-md border-[1.5px] border-ink bg-white pl-3.5 text-base text-ink placeholder:text-ink-subtle desktop:h-11 desktop:text-body',
);

type FieldProps = {
  id: string;
  label: string;
  icon: LucideIcon;
  children: ReactNode;
};

export function Field({ id, label, icon: Icon, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="flex items-center gap-1.5 font-mono text-label font-medium tracking-caps text-ink-muted uppercase"
      >
        <Icon size={14} />
        {label}
      </label>
      <div className="relative">{children}</div>
    </div>
  );
}
