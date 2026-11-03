import type { Request, Response } from 'express';
import { HttpError } from '../httpError.js';
import { findCharacterSheet } from '../queries/characterSheet.js';
import { findCharacters } from '../queries/characters.js';

// validateIds already rejected anything but a valid id, an empty value or no value.
function optionalId(value: unknown) {
  return typeof value === 'string' && value !== '' ? Number(value) : null;
}

export async function listCharacters(request: Request, response: Response) {
  const { name, arcId, categoryId, affiliationId } = request.query;
  // A repeated ?name= arrives as an array; PostgreSQL text cannot hold a NUL byte.
  if (name !== undefined && (typeof name !== 'string' || name.includes('\0'))) {
    throw new HttpError(400, 'Parâmetro inválido: name');
  }

  response.json(
    await findCharacters({
      name: name?.trim() || null,
      arcId: optionalId(arcId),
      categoryId: optionalId(categoryId),
      affiliationId: optionalId(affiliationId),
    }),
  );
}

export async function showCharacterSheet(request: Request, response: Response) {
  // validateIds already rejected anything but a valid id.
  const sheet = await findCharacterSheet(Number(request.params.characterId));
  if (!sheet) {
    throw new HttpError(404, 'Personagem não encontrado');
  }
  response.json(sheet);
}
