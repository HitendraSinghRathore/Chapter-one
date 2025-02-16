import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import config from './config';
import { closeDatabase, initModels, syncDatabase } from './database/postgres';

const port = config.get<number>('port');

(async () => {
  
  initModels();
  await syncDatabase();

  const server = app.listen(port, () => {
    console.log(`Server is running on port ${port} in ${config.get('nodeEnv')} mode.`);
  });
  
  
  process.on('SIGINT', async () => {
    console.log('SIGINT signal received. Closing server...');
    server.close(async () => {
      console.log('HTTP server closed.');
      await closeDatabase();
      process.exit(0);
    });
  });
  
  process.on('SIGTERM', async () => {
    console.log('SIGTERM signal received. Closing server...');
    server.close(async () => {
      console.log('HTTP server closed.');
      await closeDatabase();
      process.exit(0);
    });
  });
})();
