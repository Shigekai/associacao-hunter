import { pool } from '../database.js';

export type CharacterSummary = {
  id: number;
  firstName: string;
  lastName: string | null;
  birthDate: string | null;
  sex: string | null;
  birthplace: string;
  nenCategory: string | null;
  affiliations: string[];
  hatsus: string[];
  isLicensedHunter: boolean;
};

export type CharacterFilters = {
  name: string | null;
  arcId: number | null;
  categoryId: number | null;
  affiliationId: number | null;
};

// Seal rule shared by the list and the sheet: an active member of the Hunter Association. Needs `characters c`.
export const isLicensedHunterSql = `
  EXISTS (
    SELECT 1
    FROM affiliation_members am
    JOIN affiliations af ON af.id = am.affiliation_id
    WHERE am.character_id = c.id
      AND af.name = 'Associação Hunter'
      AND am.left_arc_id IS NULL
  )`;

// Backslash is LIKE's default escape: the search term matches literally, so '%' is not "everything".
function containsPattern(term: string) {
  return `%${term.replace(/[\\%_]/g, '\\$&')}%`;
}

export async function findCharacters({ name, arcId, categoryId, affiliationId }: CharacterFilters) {
  const { rows } = await pool.query<CharacterSummary>(
    `
    SELECT
      c.id,
      c.first_name AS "firstName",
      c.last_name AS "lastName",
      c.birth_date AS "birthDate",
      c.sex,
      birthplace.name AS birthplace,
      (
        SELECT nc.name
        FROM character_nen_categories cnc
        JOIN nen_categories nc ON nc.id = cnc.category_id
        WHERE cnc.character_id = c.id AND cnc.affinity_type = 'Principal'
        ORDER BY nc.id
        LIMIT 1
      ) AS "nenCategory",
      ARRAY(
        SELECT af.name
        FROM affiliation_members am
        JOIN affiliations af ON af.id = am.affiliation_id
        JOIN arcs joined_arc ON joined_arc.id = am.joined_arc_id
        WHERE am.character_id = c.id AND am.left_arc_id IS NULL
        ORDER BY joined_arc.start_chapter, af.name
      ) AS affiliations,
      ARRAY(
        SELECT a.name
        FROM abilities a
        JOIN nen_abilities na ON na.ability_id = a.id
        WHERE a.owner_id = c.id
        ORDER BY a.name
      ) AS hatsus,
      ${isLicensedHunterSql} AS "isLicensedHunter"
    FROM characters c
    JOIN locations birthplace ON birthplace.id = c.birthplace_id
    WHERE ($1::text IS NULL
        OR concat_ws(' ', c.first_name, c.last_name) ILIKE $1
        OR EXISTS (
          SELECT 1
          FROM character_nicknames cn
          WHERE cn.character_id = c.id AND cn.nickname ILIKE $1
        ))
      AND ($2::int IS NULL
        OR EXISTS (
          SELECT 1
          FROM character_arcs ca
          WHERE ca.character_id = c.id AND ca.arc_id = $2
        ))
      AND ($3::int IS NULL
        OR EXISTS (
          SELECT 1
          FROM character_nen_categories cnc
          WHERE cnc.character_id = c.id AND cnc.category_id = $3
        ))
      AND ($4::int IS NULL
        OR EXISTS (
          SELECT 1
          FROM affiliation_members am
          JOIN arcs joined_arc ON joined_arc.id = am.joined_arc_id
          LEFT JOIN arcs left_arc ON left_arc.id = am.left_arc_id
          LEFT JOIN arcs target_arc ON target_arc.id = $2
          WHERE am.character_id = c.id
            AND am.affiliation_id = $4
            -- With an arc, membership must cover it; leaving during the arc still counts.
            AND ($2::int IS NULL
              OR (joined_arc.start_chapter <= target_arc.start_chapter
                AND (left_arc.id IS NULL OR left_arc.start_chapter >= target_arc.start_chapter)))
        ))
    ORDER BY c.first_name, c.last_name
    `,
    [name === null ? null : containsPattern(name), arcId, categoryId, affiliationId],
  );
  return rows;
}
