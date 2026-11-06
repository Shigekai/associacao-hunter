import type { Metadata } from 'next';
import { SheetBody } from '@/components/sheet/SheetBody';
import { SheetDialog } from '@/components/sheet/SheetDialog';
import { sheetMetadata } from '@/components/sheet/sheetMetadata';

export function generateMetadata({
  params,
}: PageProps<'/hunters/[hunterId]'>): Promise<Metadata> {
  return sheetMetadata(params);
}

export default function SheetModal({
  params,
}: PageProps<'/hunters/[hunterId]'>) {
  return (
    <SheetDialog close="back">
      <SheetBody params={params} />
    </SheetDialog>
  );
}
