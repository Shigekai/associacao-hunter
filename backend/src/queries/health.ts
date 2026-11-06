import { pool } from '../database.js';

export async function pingDatabase() {
  await pool.query('SELECT 1');
}
