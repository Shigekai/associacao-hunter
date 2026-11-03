import { pool } from '../database.js';

export type NenCategory = {
  id: number;
  name: string;
};

export async function findNenCategories() {
  const { rows } = await pool.query<NenCategory>(`
    SELECT id, name
    FROM nen_categories
    ORDER BY id
  `);
  return rows;
}
