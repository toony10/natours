import dotenv from 'dotenv';
dotenv.config({ path: `./config.env` });

import { app } from './app';

const port: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
app.listen(port, '127.0.0.1', () => {
  console.log(`Server is running on port ${port}`);
});