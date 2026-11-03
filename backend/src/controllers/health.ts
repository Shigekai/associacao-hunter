import type { Request, Response } from 'express';
import { pingDatabase } from '../queries/health.js';

export async function checkHealth(_request: Request, response: Response) {
  try {
    await pingDatabase();
    response.json({ status: 'ok', database: 'ok' });
  } catch (error) {
    console.error('Health check failed', error);
    response.status(503).json({ status: 'error', database: 'unreachable' });
  }
}
