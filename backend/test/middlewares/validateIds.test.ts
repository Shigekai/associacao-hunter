import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { testApp } from '../mocks/testApp.js';

const invalidIdError = { error: 'Parâmetro inválido: itemId' };

describe('validateIds', () => {
  it.each(['abc', '0', '-1', '1.5', '2147483648'])('rejects the query value %s', async (value) => {
    const response = await request(testApp).get('/items').query({ itemId: value });

    expect(response.status).toBe(400);
    expect(response.body).toEqual(invalidIdError);
  });

  it('rejects a repeated query parameter', async () => {
    const response = await request(testApp).get('/items?itemId=1&itemId=2');

    expect(response.status).toBe(400);
    expect(response.body).toEqual(invalidIdError);
  });

  it('rejects an invalid route parameter', async () => {
    const response = await request(testApp).get('/items/abc');

    expect(response.status).toBe(400);
    expect(response.body).toEqual(invalidIdError);
  });

  it.each(['7', '2147483647'])('accepts the query value %s', async (value) => {
    const response = await request(testApp).get('/items').query({ itemId: value });

    expect(response.status).toBe(200);
  });

  it('accepts a valid route parameter', async () => {
    const response = await request(testApp).get('/items/7');

    expect(response.status).toBe(200);
  });

  it('treats an empty or missing value as no filter', async () => {
    const empty = await request(testApp).get('/items?itemId=');
    const missing = await request(testApp).get('/items');

    expect(empty.status).toBe(200);
    expect(missing.status).toBe(200);
  });
});
