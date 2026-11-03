import { Router } from 'express';
import { checkHealth } from '../controllers/health.js';

export const routes = Router();

routes.get('/health', checkHealth);
