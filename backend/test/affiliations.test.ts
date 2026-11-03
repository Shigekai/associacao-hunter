import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../src/app.js';
import { affiliations } from './mocks/seed.js';

describe('GET /affiliations', () => {
  it('lists the 10 affiliations by name', async () => {
    const response = await request(app).get('/affiliations');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(affiliations);
  });
});
