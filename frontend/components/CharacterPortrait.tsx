import clsx from 'clsx';
import { Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { slugify } from '@/lib/utils';

type CharacterPortraitProps = {
  name: string;
  alt: string;
  sizes: string;
  className?: string;
};

function portraitSrc(name: string) {
  const file = `${slugify(name)}.jpg`;
  return existsSync(path.join(process.cwd(), 'public', 'characters', file))
    ? `/characters/${file}`
    : null;
}

export function CharacterPortrait({
  name,
  alt,
  sizes,
  className,
}: CharacterPortraitProps) {
  const src = portraitSrc(name);

  return (
    <div className={clsx('relative overflow-hidden', className)}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          quality={85}
          className="object-cover object-top"
        />
      ) : (
        <div
          role={alt ? 'img' : undefined}
          aria-label={alt || undefined}
          className="absolute inset-0 flex items-center justify-center halftone text-ink-muted"
        >
          <ImageIcon
            size={20}
            strokeWidth={1.75}
            className="desktop:size-5.5"
          />
        </div>
      )}
    </div>
  );
}
