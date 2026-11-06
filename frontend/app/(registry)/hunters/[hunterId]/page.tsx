import type { Metadata } from 'next';
import { ResultsMain } from '@/components/results/ResultsMain';
import { SheetBody } from '@/components/sheet/SheetBody';
import { SheetDialog } from '@/components/sheet/SheetDialog';
import { sheetMetadata } from '@/components/sheet/sheetMetadata';

export function generateMetadata({
  params,
}: PageProps<'/hunters/[hunterId]'>): Promise<Metadata> {
  return sheetMetadata(params);
}

export default function HunterPage({
  params,
  searchParams,
}: PageProps<'/hunters/[hunterId]'>) {
  return (
    <>
      <ResultsMain searchParams={searchParams} />
      <SheetDialog close="list">
        <SheetBody params={params} />
      </SheetDialog>
    </>
  );
}
