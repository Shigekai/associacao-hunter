import clsx from 'clsx';
import type { ComponentProps } from 'react';

type ButtonProps = ComponentProps<'button'> & {
  variant: 'primary' | 'secondary';
};

export function Button({ variant, className, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={clsx(
        'flex h-13 cursor-pointer items-center justify-center rounded-md border-[1.5px] border-ink text-ink uppercase desktop:h-12',
        variant === 'primary' &&
          'gap-2.5 bg-white text-body font-extrabold tracking-caps-xs font-stretch-112% hover:bg-ink hover:text-white',
        variant === 'secondary' &&
          'gap-2 bg-transparent font-mono text-label font-semibold tracking-caps hover:bg-white',
        className,
      )}
    />
  );
}
