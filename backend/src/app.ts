import cors from 'cors';
import express from 'express';
import { config } from './config.js';
import { routes } from './routes/index.js';

export const app = express();

// An array makes cors echo only a matching origin; a plain string is sent to every caller.
app.use(cors({ origin: [config.frontendUrl] }));
app.use(routes);
