import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import config from './config';

const port = config.get<number>('port');

app.listen(port, () => {
  console.log(`Server is running on port ${port} in ${config.get('nodeEnv')} mode.`);
});