import { Router } from 'express';
import { listAffiliations } from '../controllers/affiliations.js';
import { listArcs } from '../controllers/arcs.js';
import { listCharacters, showCharacterSheet } from '../controllers/characters.js';
import { checkHealth } from '../controllers/health.js';
import { listNenCategories } from '../controllers/nenCategories.js';
import { validateIds } from '../middlewares/validateIds.js';

export const routes = Router();

routes.get('/health', checkHealth);
routes.get('/arcs', listArcs);
routes.get('/nen-categories', listNenCategories);
routes.get('/affiliations', listAffiliations);
routes.get('/characters', validateIds('arcId', 'categoryId', 'affiliationId'), listCharacters);
routes.get('/characters/:characterId', validateIds('characterId'), showCharacterSheet);
