import type { Metadata } from 'next';
import { ResultsMain } from '@/components/results/ResultsMain';

export const metadata: Metadata = {
  title: 'Resultados',
};

export default function HuntersPage({ searchParams }: PageProps<'/hunters'>) {
  return <ResultsMain searchParams={searchParams} />;
}
