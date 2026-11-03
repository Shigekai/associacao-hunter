import type { Request, Response } from 'express';
import { findAffiliations } from '../queries/affiliations.js';

export async function listAffiliations(_request: Request, response: Response) {
  response.json(await findAffiliations());
}
