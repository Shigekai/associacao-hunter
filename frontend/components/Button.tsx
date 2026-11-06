import clsx from 'clsx';
import Link from 'next/link';
import type { ComponentProps } from 'react';

type ButtonStyle = {
  variant: 'primary' | 'secondary';
  size?: 'md' | 'icon';
  className?: string;
};

export function buttonClassName({
  variant,
  size = 'md',
  className,
}: ButtonStyle) {
  return clsx(
    'flex cursor-pointer items-center justify-center border-[1.5px] border-ink text-ink uppercase',
    size === 'md' && 'h-13 rounded-md desktop:h-12',
    size === 'icon' && 'size-11 shrink-0 rounded-lg',
    variant === 'primary' &&
      'gap-2.5 bg-white text-body font-extrabold tracking-caps-xs font-stretch-112% hover:bg-ink hover:text-white',
    variant === 'secondary' &&
      'gap-2 bg-transparent font-mono text-label font-semibold tracking-caps hover:bg-white',
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
