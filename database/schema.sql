-- Hunter x Hunter Nen system. 1:1 translation of the BD1 schema (see docs/database.md).
-- Requires PostgreSQL >= 15 (UNIQUE NULLS NOT DISTINCT).
-- A CHECK only fails when it evaluates to FALSE, so nullable columns
-- (end_chapter, left_on, winner_id) pass their CHECKs when NULL.

CREATE TABLE locations (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    type        VARCHAR(50)  NOT NULL,
    description VARCHAR(255) NOT NULL
);

CREATE TABLE affiliations (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    type        VARCHAR(50)  NOT NULL,
    description VARCHAR(255) NOT NULL
);

CREATE TABLE affiliation_locations (
    affiliation_id INT NOT NULL REFERENCES affiliations (id) ON DELETE CASCADE,
    location_id    INT NOT NULL REFERENCES locations (id)    ON DELETE CASCADE,
    PRIMARY KEY (affiliation_id, location_id)
);

CREATE TABLE characters (
    id            SERIAL PRIMARY KEY,
    first_name    VARCHAR(100) NOT NULL,
    last_name     VARCHAR(100),
    birth_date    DATE,
    sex           VARCHAR(20) CHECK (sex IN ('Masculino', 'Feminino', 'Outro')),
    is_alive      BOOLEAN NOT NULL DEFAULT TRUE,
    birthplace_id INT NOT NULL REFERENCES locations (id),
    -- Without NULLS NOT DISTINCT, two ('Meruem', NULL) rows would be accepted.
    UNIQUE NULLS NOT DISTINCT (first_name, last_name)
);

CREATE TABLE character_nicknames (
    character_id INT NOT NULL REFERENCES characters (id) ON DELETE CASCADE,
    nickname     VARCHAR(100) NOT NULL,
    PRIMARY KEY (character_id, nickname)
);

CREATE TABLE arcs (
    id            SERIAL PRIMARY KEY,
    name          VARCHAR(100) NOT NULL UNIQUE,
    description   VARCHAR(255) NOT NULL,
    start_chapter INT NOT NULL CHECK (start_chapter > 0),
    end_chapter   INT, -- NULL = ongoing arc
    CHECK (end_chapter >= start_chapter)
);

CREATE TABLE affiliation_members (
    character_id   INT NOT NULL REFERENCES characters (id)   ON DELETE CASCADE,
    affiliation_id INT NOT NULL REFERENCES affiliations (id) ON DELETE CASCADE,
    role           VARCHAR(50) NOT NULL,
    joined_on      DATE NOT NULL,
    left_on        DATE, -- NULL = active member
    PRIMARY KEY (character_id, affiliation_id),
    CHECK (left_on >= joined_on)
);

CREATE TABLE character_arcs (
    character_id INT NOT NULL REFERENCES characters (id) ON DELETE CASCADE,
    arc_id       INT NOT NULL REFERENCES arcs (id)       ON DELETE CASCADE,
    PRIMARY KEY (character_id, arc_id)
);

CREATE TABLE abilities (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255) NOT NULL,
    owner_id    INT NOT NULL REFERENCES characters (id)
);

-- Partial, disjoint specialization of abilities: shares the superclass key.
CREATE TABLE nen_abilities (
    ability_id INT PRIMARY KEY REFERENCES abilities (id) ON DELETE CASCADE,
    hatsu_type VARCHAR(50),
    aura_cost  INT NOT NULL CHECK (aura_cost >= 0)
);

-- Weak entity of characters: name is a partial key, unique per owner only.
CREATE TABLE items (
    id             SERIAL PRIMARY KEY,
    name           VARCHAR(100) NOT NULL,
    description    VARCHAR(255) NOT NULL,
    is_nen         BOOLEAN NOT NULL DEFAULT FALSE,
    owner_id       INT NOT NULL REFERENCES characters (id),
    conjured_by_id INT REFERENCES abilities (id),
    UNIQUE (owner_id, name)
);

CREATE TABLE item_arcs (
    item_id INT NOT NULL REFERENCES items (id) ON DELETE CASCADE,
    arc_id  INT NOT NULL REFERENCES arcs (id)  ON DELETE CASCADE,
    PRIMARY KEY (item_id, arc_id)
);

CREATE TABLE ability_arcs (
    ability_id INT NOT NULL REFERENCES abilities (id) ON DELETE CASCADE,
    arc_id     INT NOT NULL REFERENCES arcs (id)      ON DELETE CASCADE,
    PRIMARY KEY (ability_id, arc_id)
);

CREATE TABLE nen_categories (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255) NOT NULL
);

-- Weak entity of nen_abilities: description is a partial key, unique per ability only.
CREATE TABLE nen_conditions (
    id             SERIAL PRIMARY KEY,
    description    VARCHAR(255) NOT NULL,
    type           VARCHAR(50)  NOT NULL,
    nen_ability_id INT NOT NULL REFERENCES nen_abilities (ability_id) ON DELETE CASCADE,
    UNIQUE (nen_ability_id, description)
);

CREATE TABLE nen_ability_categories (
    nen_ability_id INT NOT NULL REFERENCES nen_abilities (ability_id) ON DELETE CASCADE,
    category_id    INT NOT NULL REFERENCES nen_categories (id)        ON DELETE CASCADE,
    PRIMARY KEY (nen_ability_id, category_id)
);

CREATE TABLE character_nen_categories (
    character_id  INT NOT NULL REFERENCES characters (id)     ON DELETE CASCADE,
    category_id   INT NOT NULL REFERENCES nen_categories (id) ON DELETE CASCADE,
    affinity_type VARCHAR(20) NOT NULL CHECK (affinity_type IN ('Principal', 'Secundária')),
    PRIMARY KEY (character_id, category_id)
);

CREATE TABLE nen_affinities (
    source_category_id INT NOT NULL REFERENCES nen_categories (id) ON DELETE CASCADE,
    target_category_id INT NOT NULL REFERENCES nen_categories (id) ON DELETE CASCADE,
    efficiency_percent INT NOT NULL CHECK (efficiency_percent BETWEEN 0 AND 100),
    PRIMARY KEY (source_category_id, target_category_id),
    CHECK (source_category_id <> target_category_id)
);

-- Ternary relationship: character x character x location.
CREATE TABLE fights (
    id               SERIAL PRIMARY KEY,
    fighter_a_id     INT NOT NULL REFERENCES characters (id),
    fighter_b_id     INT NOT NULL REFERENCES characters (id),
    winner_id        INT REFERENCES characters (id), -- NULL = no winner
    location_id      INT NOT NULL REFERENCES locations (id),
    fought_on        DATE NOT NULL,
    duration_minutes INT NOT NULL CHECK (duration_minutes > 0),
    CHECK (fighter_a_id <> fighter_b_id),
    CHECK (winner_id IN (fighter_a_id, fighter_b_id))
);
