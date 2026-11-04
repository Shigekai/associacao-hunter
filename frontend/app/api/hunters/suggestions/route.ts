import type { NextRequest } from 'next/server';
import { searchCharacters } from '@/lib/api';

const suggestionLimit = 5;

export type NameSuggestions = {
  total: number;
  suggestions: { id: number; name: string }[];
};

export async function GET(request: NextRequest) {
  const name = request.nextUrl.searchParams.get('name')?.trim() ?? '';
  if (!name) {
    return Response.json({
      total: 0,
      suggestions: [],
    } satisfies NameSuggestions);
  }

  try {
    const characters = await searchCharacters(name);
    return Response.json({
      total: characters.length,
      suggestions: characters
        .slice(0, suggestionLimit)
        .map(({ id, firstName, lastName }) => ({
          id,
          name: [firstName, lastName].filter(Boolean).join(' '),
        })),
    } satisfies NameSuggestions);
  } catch (error) {
    console.error('Name suggestions failed', error);
    return Response.json(
      { error: 'Falha ao consultar a API' },
      { status: 502 },
    );
  }
}
