import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import { testApp } from '../mocks/testApp.js';

describe('errorHandler', () => {
  it('answers an HttpError with its status and message', async () => {
    const response = await request(testApp).get('/http-error');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Item não encontrado' });
  });

  it('answers a route param Express cannot decode with 400', async () => {
    const response = await request(testApp).get('/items/%ZZ');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Parâmetro inválido' });
  });

  it('logs an unexpected error and answers a generic 500 without its message', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    const response = await request(testApp).get('/crash');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Erro interno do servidor' });
    expect(consoleError).toHaveBeenCalledWith(
      'Unhandled error',
      expect.objectContaining({ message: 'detalhe interno do banco' }),
    );
    consoleError.mockRestore();
  });
});
