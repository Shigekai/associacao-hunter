import type { Request, Response } from 'express';
import { findNenCategories } from '../queries/nenCategories.js';

export async function listNenCategories(_request: Request, response: Response) {
  response.json(await findNenCategories());
}
