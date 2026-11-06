import type { Metadata } from 'next';
import { getCharacterSheet } from '@/lib/api';
import { fullName } from '@/lib/utils';

export async function sheetMetadata(
  params: Promise<{ hunterId: string }>,
): Promise<Metadata> {
  try {
    const sheet = await getCharacterSheet((await params).hunterId);
    return { title: sheet ? fullName(sheet.character) : 'Não encontrado' };
  } catch {
    return {};
  }
}
