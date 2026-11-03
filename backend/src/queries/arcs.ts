import { pool } from '../database.js';

export type Arc = {
  id: number;
  name: string;
  startChapter: number;
  endChapter: number | null;
};

export async function findArcs() {
  const { rows } = await pool.query<Arc>(`
    SELECT id, name, start_chapter AS "startChapter", end_chapter AS "endChapter"
    FROM arcs
    ORDER BY start_chapter, id
  `);
  return rows;
}
