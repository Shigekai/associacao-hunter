import { notFound } from 'next/navigation';
import { getCharacterSheet } from '@/lib/api';
import { CharacterSheet } from './CharacterSheet';

type SheetLoaderProps = {
  params: Promise<{ hunterId: string }>;
};

export async function SheetLoader({ params }: SheetLoaderProps) {
  const { hunterId } = await params;
  const sheet = await getCharacterSheet(hunterId);
  if (!sheet) {
    notFound();
  }
  return <CharacterSheet sheet={sheet} />;
}
