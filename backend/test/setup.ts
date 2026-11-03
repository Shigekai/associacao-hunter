import { afterAll } from 'vitest';
import { pool } from '../src/database.js';

afterAll(() => pool.end());
