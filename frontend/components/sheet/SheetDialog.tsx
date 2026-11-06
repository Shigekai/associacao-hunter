'use client';

import { useRouter } from 'next/navigation';
import {
  createContext,
  useContext,
  useId,
  useLayoutEffect,
  useRef,
  type ComponentProps,
  type ReactNode,
} from 'react';

const SheetTitleIdContext = createContext<string | undefined>(undefined);

export function SheetTitle(props: Omit<ComponentProps<'h2'>, 'id'>) {
  return <h2 {...props} id={useContext(SheetTitleIdContext)} />;
}

type SheetDialogProps = {
  close: 'back' | 'list';
  children: ReactNode;
};

export function SheetDialog({ close, children }: SheetDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const titleId = useId();
  const promoted = useRef(false);

  useLayoutEffect(() => {
    const dialog = ref.current;
    if (!dialog) {
      return;
    }
    function navigate() {
      if (close === 'back') {
        router.back();
      } else {
        router.replace(`/hunters${window.location.search}`);
      }
    }
    if (!promoted.current && !dialog.open) {
      navigate();
      return;
    }
    promoted.current = true;
    dialog.removeAttribute('open');
    dialog.showModal();
    dialog.focus();
    dialog.addEventListener('close', navigate);
    return () => {
      dialog.removeEventListener('close', navigate);
      dialog.close();
    };
  }, [close, router]);

  return (
    <dialog
      ref={ref}
      open
      tabIndex={-1}
      aria-labelledby={titleId}
      className="fixed inset-0 z-50 m-0 size-full max-h-none max-w-none overflow-y-auto overscroll-contain border-0 bg-white p-0 text-ink outline-none backdrop:bg-transparent desktop:bg-veil desktop:px-6 desktop:py-8"
    >
      <SheetTitleIdContext value={titleId}>{children}</SheetTitleIdContext>
    </dialog>
  );
}
