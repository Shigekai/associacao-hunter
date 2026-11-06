import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ResultsHeading } from '@/components/results/ResultsHeading';
import { ResultsLoader } from '@/components/results/ResultsLoader';
import { ResultsSkeleton } from '@/components/results/ResultsSkeleton';

export const metadata: Metadata = {
  title: 'Resultados',
};

export default function HuntersPage({ searchParams }: PageProps<'/hunters'>) {
  return (
    <main className="page-container flex flex-col gap-3 pt-2 pb-8 desktop:gap-3.5 desktop:pb-12">
      <ResultsHeading />
      <Suspense fallback={<ResultsSkeleton />}>
        <ResultsLoader searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
