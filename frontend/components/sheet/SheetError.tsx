'use client';

import { catchError, type ErrorInfo } from 'next/error';
import { Button } from '@/components/Button';
import { SheetPlaceholder } from './SheetPlaceholder';

function SheetErrorFallback(_props: object, { retry }: ErrorInfo) {
  return (
    <SheetPlaceholder>
      <div
        role="alert"
        className="flex flex-col items-center gap-4 text-center"
      >
        <p className="font-mono text-label font-medium tracking-caps-xl text-ink-muted uppercase">
          Não foi possível carregar a ficha.
        </p>
        <Button
          type="button"
          variant="secondary"
          className="px-4"
          onClick={() => retry()}
        >
          Tentar novamente
        </Button>
      </div>
    </SheetPlaceholder>
  );
}

export const SheetError = catchError(SheetErrorFallback);
