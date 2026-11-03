import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../src/app.js';
import { nenCategories } from './mocks/seed.js';

describe('GET /nen-categories', () => {
  it('lists the 6 categories by id, in Nen hexagon order', async () => {
    const response = await request(app).get('/nen-categories');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(nenCategories);
  });
});
