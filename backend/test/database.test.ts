import { describe, expect, it } from 'vitest';
import { pool } from '../src/database.js';

describe('database', () => {
  it('returns DATE values as YYYY-MM-DD text', async () => {
    const { rows } = await pool.query(`SELECT '1987-05-05'::date AS day`);

    expect(rows[0].day).toBe('1987-05-05');
  });
});
