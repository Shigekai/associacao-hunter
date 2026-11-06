import clsx from 'clsx';
import Link from 'next/link';
import type { ComponentProps } from 'react';

type ButtonStyle = {
  variant: 'primary' | 'secondary' | 'inverse' | 'dashed';
  size?: 'md' | 'sm' | 'icon';
  className?: string;
};

export function buttonClassName({
  variant,
  size = 'md',
  className,
}: ButtonStyle) {
  return clsx(
    'flex cursor-pointer items-center justify-center uppercase',
    size === 'md' && 'h-13 rounded-md desktop:h-12',
    size === 'sm' && 'h-12 rounded-[10px] desktop:h-11',
    size === 'icon' && 'size-11 shrink-0 rounded-lg',
    variant === 'primary' &&
      'gap-2.5 border-[1.5px] border-ink bg-white text-body font-extrabold tracking-caps-xs text-ink font-stretch-112% hover:bg-ink hover:text-white',
    variant === 'secondary' &&
      'gap-2 border-[1.5px] border-ink bg-transparent font-mono text-label font-semibold tracking-caps text-ink hover:bg-white',
    variant === 'inverse' && 'text-white hover:bg-ink-hover',
    variant === 'dashed' &&
      'gap-2 border-[1.5px] border-dashed border-on-ink-subtle bg-transparent font-mono text-label font-semibold tracking-caps text-ink hover:bg-paper',
    className,
  );
}

type ButtonProps = ComponentProps<'button'> & ButtonStyle;

export function Button({ variant, size, className, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={buttonClassName({ variant, size, className })}
    />
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & ButtonStyle;

export function ButtonLink({
  variant,
  size,
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      {...props}
      className={buttonClassName({ variant, size, className })}
    />
  );
}
