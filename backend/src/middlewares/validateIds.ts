import type { RequestHandler } from 'express';
import { HttpError } from '../httpError.js';

// Largest PostgreSQL INT: a bigger id would make the query itself fail with a 500.
const maxId = 2147483647;

function isValidId(value: unknown) {
  return typeof value === 'string' && /^[1-9]\d*$/.test(value) && Number(value) <= maxId;
}

export function validateIds(...names: string[]): RequestHandler {
  return (request, _response, next) => {
    for (const name of names) {
      const value = request.params[name] ?? request.query[name];
      // Empty means no filter: the search form sends its blank fields.
      if (value !== undefined && value !== '' && !isValidId(value)) {
        next(new HttpError(400, `Parâmetro inválido: ${name}`));
        return;
      }
    }
    next();
  };
}
