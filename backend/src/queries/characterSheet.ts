import { pool } from '../database.js';
import { isLicensedHunterSql } from './characters.js';

type CharacterDetails = {
  id: number;
  firstName: string;
  lastName: string | null;
  nicknames: string[];
  birthDate: string | null;
  sex: string | null;
  isAlive: boolean;
  birthplace: string;
  isLicensedHunter: boolean;
};

type CharacterNenCategory = {
  name: string;
  affinityType: string;
};

type CategoryEfficiency = {
  category: string;
  percent: number | null;
};

type CharacterAbility = {
  name: string;
  description: string;
  hatsuType: string | null;
  auraCost: number | null;
  categories: string[];
  conditions: { description: string; type: string }[];
};

type CharacterItem = {
  name: string;
  description: string;
  isNen: boolean;
  conjuredBy: string | null;
  categories: string[];
};

type Membership = {
  name: string;
  type: string;
  role: string;
  joinedArc: string;
  leftArc: string | null;
  isActive: boolean;
};

type CharacterArc = {
  number: number;
  name: string;
  startChapter: number;
  endChapter: number | null;
};

export type CharacterSheet = {
  character: CharacterDetails;
  nen: {
    categories: CharacterNenCategory[];
    efficiency: CategoryEfficiency[];
  };
  abilities: CharacterAbility[];
  items: CharacterItem[];
  affiliations: Membership[];
  arcs: CharacterArc[];
};

async function findCharacter(characterId: number): Promise<CharacterDetails | undefined> {
  const { rows } = await pool.query<CharacterDetails>(
    `
    SELECT
      c.id,
      c.first_name AS "firstName",
      c.last_name AS "lastName",
      ARRAY(
        SELECT cn.nickname
        FROM character_nicknames cn
        WHERE cn.character_id = c.id
        ORDER BY cn.nickname
      ) AS nicknames,
      c.birth_date AS "birthDate",
      c.sex,
      c.is_alive AS "isAlive",
      birthplace.name AS birthplace,
      ${isLicensedHunterSql} AS "isLicensedHunter"
    FROM characters c
    JOIN locations birthplace ON birthplace.id = c.birthplace_id
    WHERE c.id = $1
    `,
    [characterId],
  );
  return rows[0];
}

async function findNenCategories(characterId: number) {
  const { rows } = await pool.query<CharacterNenCategory>(
    `
    SELECT nc.name, cnc.affinity_type AS "affinityType"
    FROM character_nen_categories cnc
    JOIN nen_categories nc ON nc.id = cnc.category_id
    WHERE cnc.character_id = $1
    ORDER BY (cnc.affinity_type = 'Principal') DESC, nc.id
    `,
    [characterId],
  );
  return rows;
}

async function findEfficiency(characterId: number) {
  const { rows } = await pool.query<CategoryEfficiency>(
    `
    WITH principal AS (
      SELECT cnc.category_id
      FROM character_nen_categories cnc
      WHERE cnc.character_id = $1 AND cnc.affinity_type = 'Principal'
      ORDER BY cnc.category_id
      LIMIT 1
    )
    SELECT
      nc.name AS category,
      CASE
        WHEN nc.id = principal.category_id THEN 100
        ELSE na.efficiency_percent
      END AS percent
    FROM nen_categories nc
    LEFT JOIN principal ON TRUE
    LEFT JOIN nen_affinities na
      ON na.source_category_id = principal.category_id AND na.target_category_id = nc.id
    ORDER BY nc.id
    `,
    [characterId],
  );
  return rows;
}

async function findAbilities(characterId: number) {
  const { rows } = await pool.query<CharacterAbility>(
    `
    SELECT
      a.name,
      a.description,
      na.hatsu_type AS "hatsuType",
      na.aura_cost AS "auraCost",
      ARRAY(
        SELECT nc.name
        FROM nen_ability_categories nac
        JOIN nen_categories nc ON nc.id = nac.category_id
        WHERE nac.nen_ability_id = a.id
        ORDER BY nc.id
      ) AS categories,
      COALESCE(
        (
          SELECT json_agg(
            json_build_object('description', cond.description, 'type', cond.type)
            ORDER BY cond.description
          )
          FROM nen_conditions cond
          WHERE cond.nen_ability_id = a.id
        ),
        '[]'
      ) AS conditions
    FROM abilities a
    LEFT JOIN nen_abilities na ON na.ability_id = a.id
    WHERE a.owner_id = $1
    ORDER BY a.name
    `,
    [characterId],
  );
  return rows;
}

async function findItems(characterId: number) {
  const { rows } = await pool.query<CharacterItem>(
    `
    SELECT
      i.name,
      i.description,
      i.is_nen AS "isNen",
      conjuring_ability.name AS "conjuredBy",
      ARRAY(
        SELECT nc.name
        FROM nen_ability_categories nac
        JOIN nen_categories nc ON nc.id = nac.category_id
        WHERE nac.nen_ability_id = i.conjured_by_id
        ORDER BY nc.id
      ) AS categories
    FROM items i
    LEFT JOIN abilities conjuring_ability ON conjuring_ability.id = i.conjured_by_id
    WHERE i.owner_id = $1
    ORDER BY i.name
    `,
    [characterId],
  );
  return rows;
}

async function findMemberships(characterId: number) {
  const { rows } = await pool.query<Membership>(
    `
    SELECT
      af.name,
      af.type,
      am.role,
      joined_arc.name AS "joinedArc",
      left_arc.name AS "leftArc",
      am.left_arc_id IS NULL AS "isActive"
    FROM affiliation_members am
    JOIN affiliations af ON af.id = am.affiliation_id
    JOIN arcs joined_arc ON joined_arc.id = am.joined_arc_id
    LEFT JOIN arcs left_arc ON left_arc.id = am.left_arc_id
    WHERE am.character_id = $1
    ORDER BY joined_arc.start_chapter, af.name
    `,
    [characterId],
  );
  return rows;
}

async function findArcs(characterId: number) {
  const { rows } = await pool.query<CharacterArc>(
    `
    SELECT numbered.number, numbered.name, numbered.start_chapter AS "startChapter", numbered.end_chapter AS "endChapter"
    -- Numbered before the join: in the same query the WHERE would number only this character's arcs.
    -- ROW_NUMBER is bigint, which pg returns as text.
    FROM (
      SELECT id, name, start_chapter, end_chapter, ROW_NUMBER() OVER (ORDER BY start_chapter, id)::int AS number
      FROM arcs
    ) numbered
    JOIN character_arcs ca ON ca.arc_id = numbered.id
    WHERE ca.character_id = $1
    ORDER BY numbered.number
    `,
    [characterId],
  );
  return rows;
}

export async function findCharacterSheet(characterId: number): Promise<CharacterSheet | null> {
  const [character, categories, efficiency, abilities, items, affiliations, arcs] = await Promise.all([
    findCharacter(characterId),
    findNenCategories(characterId),
    findEfficiency(characterId),
    findAbilities(characterId),
    findItems(characterId),
    findMemberships(characterId),
    findArcs(characterId),
  ]);
  if (!character) {
    return null;
  }
  return { character, nen: { categories, efficiency }, abilities, items, affiliations, arcs };
}
