import type { ErrorRequestHandler } from 'express';
import { HttpError } from '../httpError.js';

// Express only treats a middleware as an error handler when it declares all four parameters.
export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof HttpError) {
    response.status(error.status).json({ error: error.message });
    return;
  }
  // Express throws a URIError for a route param it cannot decode (e.g. /items/%ZZ).
  if (error instanceof URIError) {
    response.status(400).json({ error: 'Parâmetro inválido' });
    return;
  }
  console.error('Unhandled error', error);
  response.status(500).json({ error: 'Erro interno do servidor' });
};
