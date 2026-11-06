import { Suspense } from 'react';
import type { SearchParams } from '@/lib/utils';
import { ResultsHeading } from './ResultsHeading';
import { ResultsLoader } from './ResultsLoader';
import { ResultsSkeleton } from './ResultsSkeleton';

type ResultsMainProps = {
  searchParams: Promise<SearchParams>;
};

export function ResultsMain({ searchParams }: ResultsMainProps) {
  return (
    <main className="page-container flex flex-col gap-3 pt-2 pb-8 desktop:gap-3.5 desktop:pb-12">
      <ResultsHeading />
      <Suspense fallback={<ResultsSkeleton />}>
        <ResultsLoader searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
