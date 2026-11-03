import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../../src/app.js';

describe('notFound', () => {
  it('answers an unknown route with 404', async () => {
    const response = await request(app).get('/nada');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Rota não encontrada' });
  });
});
