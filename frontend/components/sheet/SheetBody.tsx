import { Suspense } from 'react';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { SheetError } from './SheetError';
import { SheetLoader } from './SheetLoader';
import { SheetPlaceholder } from './SheetPlaceholder';

type SheetBodyProps = {
  params: Promise<{ hunterId: string }>;
};

export function SheetBody({ params }: SheetBodyProps) {
  return (
    <SheetError>
      <Suspense
        fallback={
          <SheetPlaceholder>
            <LoadingIndicator />
          </SheetPlaceholder>
        }
      >
        <SheetLoader params={params} />
      </Suspense>
    </SheetError>
  );
}
