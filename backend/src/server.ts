import { app } from './app.js';
import { config } from './config.js';

app.listen(config.port, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Backend listening on http://localhost:${config.port}`);
});
