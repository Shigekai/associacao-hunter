-- Translated from the BD1 seed (changes in docs/database.md). Content stays in Portuguese (user-facing).
-- Foreign keys are resolved by natural key subselects, never hardcoded ids.
-- TODO: characters are looked up by first_name only, not by their (first_name, last_name) key;
-- fix before two characters share a first name.

INSERT INTO locations (name, type, description) VALUES
('Ilha da Baleia', 'Ilha', 'Pequena ilha no oceano, lar de Gon'),
('Yorknew City', 'Cidade', 'Metrópole gigante conhecida por leilões'),
('NGL', 'País', 'Neo Green Life, local com aversão a tecnologia'),
('República de Padokea', 'País', 'País que abriga a Montanha Kukuroo'),
('Heavens Arena', 'Prédio', 'Torre de 251 andares focada em lutas'),
('Greed Island', 'Ilha/Jogo', 'Ilha real onde ocorre o jogo Greed Island'),
('Meteor City', 'Cidade', 'Cidade ferro-velho isolada da sociedade'),
('Montanha Kukuroo', 'Montanha', 'Lar da famosa família de assassinos Zoldyck'),
('Zaban City', 'Cidade', 'Local do exame Hunter de 287'),
('Império Kakin', 'País', 'Novo império central no arco de Sucessão');

INSERT INTO affiliations (name, type, description) VALUES
('Associação Hunter', 'Organização', 'Grupo global de Hunters licenciados'),
('Trupe Fantasma', 'Gangue', 'Famosa gangue de criminosos classe A'),
('Família Zoldyck', 'Família', 'Família de assassinos profissionais'),
('Formigas Quimera', 'Espécie/Grupo', 'Espécie altamente agressiva e evolutiva'),
('Clã Kurta', 'Clã', 'Povo pacífico com olhos escarlates'),
('Família Nostrade', 'Máfia', 'Família mafiosa que foca em guarda-costas'),
('Shadow Beasts', 'Máfia', 'A elite combatente dos 10 Dons'),
('Zodíacos', 'Conselho', 'Os 12 principais conselheiros da Associação'),
('Família Real Kakin', 'Realeza', 'Família que governa o império Kakin'),
('Jogadores de GI', 'Grupo', 'Pessoas que jogam ativamente Greed Island');

INSERT INTO affiliation_locations (affiliation_id, location_id) VALUES
((SELECT id FROM affiliations WHERE name = 'Família Zoldyck'), (SELECT id FROM locations WHERE name = 'República de Padokea')),
((SELECT id FROM affiliations WHERE name = 'Família Zoldyck'), (SELECT id FROM locations WHERE name = 'Montanha Kukuroo')),
((SELECT id FROM affiliations WHERE name = 'Trupe Fantasma'), (SELECT id FROM locations WHERE name = 'Meteor City')),
((SELECT id FROM affiliations WHERE name = 'Formigas Quimera'), (SELECT id FROM locations WHERE name = 'NGL')),
((SELECT id FROM affiliations WHERE name = 'Associação Hunter'), (SELECT id FROM locations WHERE name = 'Zaban City')),
((SELECT id FROM affiliations WHERE name = 'Família Real Kakin'), (SELECT id FROM locations WHERE name = 'Império Kakin'));

INSERT INTO characters (first_name, last_name, birth_date, sex, is_alive, birthplace_id) VALUES
('Gon', 'Freecss', '1987-05-05', 'Masculino', TRUE, (SELECT id FROM locations WHERE name = 'Ilha da Baleia')),
('Killua', 'Zoldyck', '1987-07-07', 'Masculino', TRUE, (SELECT id FROM locations WHERE name = 'Montanha Kukuroo')),
('Kurapika', 'Kurta', '1982-04-04', 'Masculino', TRUE, (SELECT id FROM locations WHERE name = 'Zaban City')),
('Leorio', 'Paradinight', '1978-03-03', 'Masculino', TRUE, (SELECT id FROM locations WHERE name = 'Zaban City')),
('Hisoka', 'Morow', '1973-06-06', 'Masculino', TRUE, (SELECT id FROM locations WHERE name = 'Zaban City')),
('Chrollo', 'Lucilfer', '1973-11-11', 'Masculino', TRUE, (SELECT id FROM locations WHERE name = 'Meteor City')),
('Isaac', 'Netero', '1890-01-01', 'Masculino', FALSE, (SELECT id FROM locations WHERE name = 'Zaban City')),
('Meruem', NULL, '1999-05-01', 'Masculino', FALSE, (SELECT id FROM locations WHERE name = 'NGL')),
('Ging', 'Freecss', '1967-08-08', 'Masculino', TRUE, (SELECT id FROM locations WHERE name = 'Ilha da Baleia')),
('Biscuit', 'Krueger', '1943-09-09', 'Feminino', TRUE, (SELECT id FROM locations WHERE name = 'Greed Island'));

INSERT INTO character_nicknames (character_id, nickname) VALUES
((SELECT id FROM characters WHERE first_name = 'Killua' AND last_name = 'Zoldyck'), 'Killu'),
((SELECT id FROM characters WHERE first_name = 'Hisoka' AND last_name = 'Morow'), 'O Mágico'),
((SELECT id FROM characters WHERE first_name = 'Chrollo' AND last_name = 'Lucilfer'), 'Danchou'),
((SELECT id FROM characters WHERE first_name = 'Isaac' AND last_name = 'Netero'), 'Presidente Netero'),
((SELECT id FROM characters WHERE first_name = 'Biscuit' AND last_name = 'Krueger'), 'Bisky');

INSERT INTO arcs (name, description, start_chapter, end_chapter) VALUES
('Exame Hunter', 'Onde os protagonistas fazem o teste', 1, 38),
('Família Zoldyck', 'Resgate do Killua na montanha', 39, 43),
('Torre Celestial', 'Treinamento de Nen', 44, 63),
('Yorknew City', 'Confronto com a Trupe Fantasma', 64, 119),
('Greed Island', 'O jogo feito por Ging', 120, 185),
('Chimera Ant', 'Surgimento da rainha das formigas', 186, 318),
('Eleição do Presidente', 'Decisão do próximo presidente', 319, 339),
('Expedição ao Continente Negro', 'Preparativos para a jornada', 340, 348),
('Concurso de Sucessão', 'Batalha real no navio Baleia Negra', 349, 400),
('Arco Desconhecido', 'História futura de HxH', 401, NULL);

-- Membership that predates the story starts in the first arc (Exame Hunter).
INSERT INTO affiliation_members (character_id, affiliation_id, role, joined_arc_id, left_arc_id) VALUES
((SELECT id FROM characters WHERE first_name = 'Gon'), (SELECT id FROM affiliations WHERE name = 'Associação Hunter'), 'Hunter', (SELECT id FROM arcs WHERE name = 'Exame Hunter'), NULL),
((SELECT id FROM characters WHERE first_name = 'Killua'), (SELECT id FROM affiliations WHERE name = 'Família Zoldyck'), 'Herdeiro', (SELECT id FROM arcs WHERE name = 'Exame Hunter'), NULL),
((SELECT id FROM characters WHERE first_name = 'Chrollo'), (SELECT id FROM affiliations WHERE name = 'Trupe Fantasma'), 'Líder', (SELECT id FROM arcs WHERE name = 'Exame Hunter'), NULL),
((SELECT id FROM characters WHERE first_name = 'Hisoka'), (SELECT id FROM affiliations WHERE name = 'Trupe Fantasma'), 'Membro #4', (SELECT id FROM arcs WHERE name = 'Exame Hunter'), (SELECT id FROM arcs WHERE name = 'Yorknew City')),
((SELECT id FROM characters WHERE first_name = 'Isaac'), (SELECT id FROM affiliations WHERE name = 'Associação Hunter'), 'Presidente', (SELECT id FROM arcs WHERE name = 'Exame Hunter'), (SELECT id FROM arcs WHERE name = 'Chimera Ant'));

INSERT INTO character_arcs (character_id, arc_id) VALUES
((SELECT id FROM characters WHERE first_name = 'Gon'), (SELECT id FROM arcs WHERE name = 'Exame Hunter')),
((SELECT id FROM characters WHERE first_name = 'Killua'), (SELECT id FROM arcs WHERE name = 'Família Zoldyck')),
((SELECT id FROM characters WHERE first_name = 'Kurapika'), (SELECT id FROM arcs WHERE name = 'Yorknew City')),
((SELECT id FROM characters WHERE first_name = 'Gon'), (SELECT id FROM arcs WHERE name = 'Greed Island')),
((SELECT id FROM characters WHERE first_name = 'Meruem'), (SELECT id FROM arcs WHERE name = 'Chimera Ant')),
((SELECT id FROM characters WHERE first_name = 'Hisoka'), (SELECT id FROM arcs WHERE name = 'Yorknew City')),
((SELECT id FROM characters WHERE first_name = 'Hisoka'), (SELECT id FROM arcs WHERE name = 'Greed Island')),
((SELECT id FROM characters WHERE first_name = 'Chrollo'), (SELECT id FROM arcs WHERE name = 'Yorknew City'));

INSERT INTO abilities (name, description, owner_id) VALUES
('Jajanken', 'Ataque baseado em pedra-papel-tesoura', (SELECT id FROM characters WHERE first_name = 'Gon')),
('Kanmuru', 'Permite reagir na velocidade do raio', (SELECT id FROM characters WHERE first_name = 'Killua')),
('Emperor Time', '100% de eficiência em todas categorias', (SELECT id FROM characters WHERE first_name = 'Kurapika')),
('Bungee Gum', 'Aura com propriedades de goma e borracha', (SELECT id FROM characters WHERE first_name = 'Hisoka')),
('Skill Hunter', 'Rouba a habilidade de outras pessoas', (SELECT id FROM characters WHERE first_name = 'Chrollo')),
('100-Type Guanyin', 'Estátua gigante dourada', (SELECT id FROM characters WHERE first_name = 'Isaac')),
('Aura Cannons', 'Raios de energia pura concentrada', (SELECT id FROM characters WHERE first_name = 'Meruem')),
('Warp Punch', 'Soco que viaja através de portais', (SELECT id FROM characters WHERE first_name = 'Leorio')),
('Cookie-chan', 'Massagista que recupera fadiga', (SELECT id FROM characters WHERE first_name = 'Biscuit')),
('Nen Stitches', 'Fios de nen que costuram ferimentos', (SELECT id FROM characters WHERE first_name = 'Hisoka'));

INSERT INTO nen_abilities (ability_id, hatsu_type, aura_cost) VALUES
((SELECT id FROM abilities WHERE name = 'Jajanken'), 'Ataque Fisico', 500),
((SELECT id FROM abilities WHERE name = 'Kanmuru'), 'Aprimoramento', 1000),
((SELECT id FROM abilities WHERE name = 'Emperor Time'), 'Status Ativo', 2000),
((SELECT id FROM abilities WHERE name = 'Bungee Gum'), 'Armadilha/Fisico', 150),
((SELECT id FROM abilities WHERE name = 'Skill Hunter'), 'Conjuração de Livro', 300),
((SELECT id FROM abilities WHERE name = '100-Type Guanyin'), 'Emissão/Manipulação', 5000),
((SELECT id FROM abilities WHERE name = 'Aura Cannons'), 'Ataque à Distância', 10000),
((SELECT id FROM abilities WHERE name = 'Warp Punch'), 'Ataque Remoto', 400),
((SELECT id FROM abilities WHERE name = 'Cookie-chan'), 'Suporte', 800),
((SELECT id FROM abilities WHERE name = 'Nen Stitches'), 'Cura/Utilidade', 100);

INSERT INTO items (name, description, is_nen, owner_id, conjured_by_id) VALUES
('Vara de Pescar', 'Vara antiga usada por Ging', FALSE, (SELECT id FROM characters WHERE first_name = 'Gon'), NULL),
('Ioiô Zoldyck', 'Ioiô ultra pesado (50kg)', FALSE, (SELECT id FROM characters WHERE first_name = 'Killua'), NULL),
('Licença Hunter', 'Cartão de altíssimo valor e acesso', FALSE, (SELECT id FROM characters WHERE first_name = 'Gon'), NULL),
('Correntes de Kurapika', 'Cinco correntes para propósitos variados', TRUE, (SELECT id FROM characters WHERE first_name = 'Kurapika'), NULL),
('Cartas de Baralho', 'Baralho afiado', FALSE, (SELECT id FROM characters WHERE first_name = 'Hisoka'), NULL),
('Bandit Secret', 'Livro contendo habilidades roubadas', TRUE, (SELECT id FROM characters WHERE first_name = 'Chrollo'), (SELECT id FROM abilities WHERE name = 'Skill Hunter')),
('Board do Greed Island', 'Console de videogame para rodar o GI', TRUE, (SELECT id FROM characters WHERE first_name = 'Ging'), NULL),
('Faca de Ben', 'Faca envenenada histórica', FALSE, (SELECT id FROM characters WHERE first_name = 'Chrollo'), NULL),
('Anel de Paladino', 'Remove maldições', TRUE, (SELECT id FROM characters WHERE first_name = 'Killua'), NULL),
('Olhos Escarlates', 'Olhos do clã Kurta extraídos', FALSE, (SELECT id FROM characters WHERE first_name = 'Kurapika'), NULL);

-- items.name is unique per owner only; this lookup breaks once a second owner has the same item name.
INSERT INTO item_arcs (item_id, arc_id) VALUES
((SELECT id FROM items WHERE name = 'Vara de Pescar'), (SELECT id FROM arcs WHERE name = 'Exame Hunter')),
((SELECT id FROM items WHERE name = 'Ioiô Zoldyck'), (SELECT id FROM arcs WHERE name = 'Greed Island')),
((SELECT id FROM items WHERE name = 'Licença Hunter'), (SELECT id FROM arcs WHERE name = 'Exame Hunter')),
((SELECT id FROM items WHERE name = 'Correntes de Kurapika'), (SELECT id FROM arcs WHERE name = 'Yorknew City')),
((SELECT id FROM items WHERE name = 'Board do Greed Island'), (SELECT id FROM arcs WHERE name = 'Greed Island'));

INSERT INTO ability_arcs (ability_id, arc_id) VALUES
((SELECT id FROM abilities WHERE name = 'Bungee Gum'), (SELECT id FROM arcs WHERE name = 'Torre Celestial')),
((SELECT id FROM abilities WHERE name = 'Jajanken'), (SELECT id FROM arcs WHERE name = 'Greed Island')),
((SELECT id FROM abilities WHERE name = 'Kanmuru'), (SELECT id FROM arcs WHERE name = 'Chimera Ant')),
((SELECT id FROM abilities WHERE name = 'Skill Hunter'), (SELECT id FROM arcs WHERE name = 'Yorknew City')),
((SELECT id FROM abilities WHERE name = '100-Type Guanyin'), (SELECT id FROM arcs WHERE name = 'Chimera Ant'));

INSERT INTO nen_categories (name, description) VALUES
('Reforço', 'Aumenta as capacidades naturais e cura do corpo.'),
('Emissão', 'Capacidade de separar a aura do corpo e dispará-la.'),
('Transformação', 'Muda as propriedades físicas da aura (ex: fogo, raio).'),
('Manipulação', 'Permite controlar pessoas ou objetos com aura.'),
('Materialização', 'Cria objetos físicos tangíveis a partir de aura.'),
('Especialização', 'Qualquer habilidade que não se encaixa nas outras.'),
('Reforço Focado', 'Subcategoria de aumento exclusivo de força física.'),
('Materialização Simbiótica', 'Criação de itens que exigem a aura de outras pessoas.'),
('Manipulação Coercitiva', 'Controle mental absoluto sobre o alvo.'),
('Especialização Divinatória', 'Categoria especial focada em ver o futuro e passado.');

INSERT INTO nen_conditions (description, type, nen_ability_id) VALUES
('Dizer "Pedra, Papel, Tesoura" em voz alta', 'Tempo/Fala', (SELECT id FROM abilities WHERE name = 'Jajanken')),
('Acumular eletricidade previamente', 'Carga Física', (SELECT id FROM abilities WHERE name = 'Kanmuru')),
('Reduz tempo de vida', 'Penalidade Severa', (SELECT id FROM abilities WHERE name = 'Emperor Time')),
('Explicar a habilidade para a vítima', 'Risco Informacional', (SELECT id FROM abilities WHERE name = 'Skill Hunter')),
('Colocar a mão no livro aberto', 'Restrição Motora', (SELECT id FROM abilities WHERE name = 'Skill Hunter')),
('Ver a habilidade sendo usada antes', 'Condição Visual', (SELECT id FROM abilities WHERE name = 'Skill Hunter')),
('Orar com as mãos juntas antes de atacar', 'Tempo/Gesto', (SELECT id FROM abilities WHERE name = '100-Type Guanyin')),
('Saber o nome do alvo', 'Informacional', (SELECT id FROM abilities WHERE name = 'Skill Hunter')),
('Contato visual contínuo', 'Condição Visual', (SELECT id FROM abilities WHERE name = 'Bungee Gum')),
('Apenas usar durante o modo Scarlet Eyes', 'Biológica', (SELECT id FROM abilities WHERE name = 'Emperor Time'));

INSERT INTO nen_ability_categories (nen_ability_id, category_id) VALUES
((SELECT id FROM abilities WHERE name = 'Jajanken'), (SELECT id FROM nen_categories WHERE name = 'Reforço')),
((SELECT id FROM abilities WHERE name = 'Kanmuru'), (SELECT id FROM nen_categories WHERE name = 'Transformação')),
((SELECT id FROM abilities WHERE name = 'Bungee Gum'), (SELECT id FROM nen_categories WHERE name = 'Transformação')),
((SELECT id FROM abilities WHERE name = 'Skill Hunter'), (SELECT id FROM nen_categories WHERE name = 'Especialização')),
((SELECT id FROM abilities WHERE name = '100-Type Guanyin'), (SELECT id FROM nen_categories WHERE name = 'Emissão'));

INSERT INTO character_nen_categories (character_id, category_id, affinity_type) VALUES
((SELECT id FROM characters WHERE first_name = 'Gon'), (SELECT id FROM nen_categories WHERE name = 'Reforço'), 'Principal'),
((SELECT id FROM characters WHERE first_name = 'Killua'), (SELECT id FROM nen_categories WHERE name = 'Transformação'), 'Principal'),
((SELECT id FROM characters WHERE first_name = 'Hisoka'), (SELECT id FROM nen_categories WHERE name = 'Transformação'), 'Principal'),
((SELECT id FROM characters WHERE first_name = 'Chrollo'), (SELECT id FROM nen_categories WHERE name = 'Especialização'), 'Principal'),
((SELECT id FROM characters WHERE first_name = 'Kurapika'), (SELECT id FROM nen_categories WHERE name = 'Materialização'), 'Principal');

INSERT INTO nen_affinities (source_category_id, target_category_id, efficiency_percent) VALUES
((SELECT id FROM nen_categories WHERE name = 'Reforço'), (SELECT id FROM nen_categories WHERE name = 'Emissão'), 80),
((SELECT id FROM nen_categories WHERE name = 'Reforço'), (SELECT id FROM nen_categories WHERE name = 'Transformação'), 80),
((SELECT id FROM nen_categories WHERE name = 'Reforço'), (SELECT id FROM nen_categories WHERE name = 'Especialização'), 0),
((SELECT id FROM nen_categories WHERE name = 'Transformação'), (SELECT id FROM nen_categories WHERE name = 'Materialização'), 80),
((SELECT id FROM nen_categories WHERE name = 'Especialização'), (SELECT id FROM nen_categories WHERE name = 'Manipulação'), 80);

INSERT INTO fights (fighter_a_id, fighter_b_id, winner_id, location_id, fought_on, duration_minutes) VALUES
((SELECT id FROM characters WHERE first_name = 'Hisoka'), (SELECT id FROM characters WHERE first_name = 'Gon'), (SELECT id FROM characters WHERE first_name = 'Hisoka'), (SELECT id FROM locations WHERE name = 'Heavens Arena'), '1999-07-10', 15),
((SELECT id FROM characters WHERE first_name = 'Chrollo'), (SELECT id FROM characters WHERE first_name = 'Hisoka'), (SELECT id FROM characters WHERE first_name = 'Chrollo'), (SELECT id FROM locations WHERE name = 'Heavens Arena'), '2000-05-15', 30),
((SELECT id FROM characters WHERE first_name = 'Isaac'), (SELECT id FROM characters WHERE first_name = 'Meruem'), (SELECT id FROM characters WHERE first_name = 'Meruem'), (SELECT id FROM locations WHERE name = 'NGL'), '2000-08-01', 45),
((SELECT id FROM characters WHERE first_name = 'Kurapika'), (SELECT id FROM characters WHERE first_name = 'Chrollo'), NULL, (SELECT id FROM locations WHERE name = 'Yorknew City'), '1999-09-04', 10),
((SELECT id FROM characters WHERE first_name = 'Killua'), (SELECT id FROM characters WHERE first_name = 'Gon'), NULL, (SELECT id FROM locations WHERE name = 'Ilha da Baleia'), '1998-10-10', 5);
