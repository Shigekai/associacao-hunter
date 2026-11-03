import { pool } from '../database.js';

export type Affiliation = {
  id: number;
  name: string;
  type: string;
};

export async function findAffiliations() {
  const { rows } = await pool.query<Affiliation>(`
    SELECT id, name, type
    FROM affiliations
    ORDER BY name
  `);
  return rows;
}
