import express from 'express';
import { HttpError } from '../../src/httpError.js';
import { errorHandler } from '../../src/middlewares/errorHandler.js';
import { validateIds } from '../../src/middlewares/validateIds.js';

export const testApp = express();

testApp.get('/items', validateIds('itemId'), (_request, response) => {
  response.json({ ok: true });
});
testApp.get('/items/:itemId', validateIds('itemId'), (_request, response) => {
  response.json({ ok: true });
});
testApp.get('/http-error', () => {
  throw new HttpError(404, 'Item não encontrado');
});
testApp.get('/crash', () => {
  throw new Error('detalhe interno do banco');
});
testApp.use(errorHandler);
