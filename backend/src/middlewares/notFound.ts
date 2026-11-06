import type { RequestHandler } from 'express';
import { HttpError } from '../httpError.js';

export const notFound: RequestHandler = (_request, _response, next) => {
  next(new HttpError(404, 'Rota não encontrada'));
};
