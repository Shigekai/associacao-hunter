import type { LucideIcon } from 'lucide-react';

type IconTileProps = {
  icon: LucideIcon;
};

export function IconTile({ icon: Icon }: IconTileProps) {
  return (
    <span
      aria-hidden="true"
      className="flex size-9 shrink-0 items-center justify-center rounded-md border border-line-subtle bg-paper"
    >
      <Icon size={18} strokeWidth={1.75} />
    </span>
  );
}
