import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../src/app.js';
import { arcs } from './mocks/seed.js';

describe('GET /arcs', () => {
  it('lists the 7 arcs by start chapter, from the Hunter Exam (1–43) to the ongoing arc', async () => {
    const response = await request(app).get('/arcs');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(arcs);
  });
});
