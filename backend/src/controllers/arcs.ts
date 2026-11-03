import type { Request, Response } from 'express';
import { findArcs } from '../queries/arcs.js';

export async function listArcs(_request: Request, response: Response) {
  response.json(await findArcs());
}
