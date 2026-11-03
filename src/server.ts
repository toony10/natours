import dotenv from 'dotenv';
dotenv.config({ path: `./config.env` });

import { app } from './app';
import mongoose from 'mongoose';

const dbUrl = process.env.DATABASE?.replace('<db_password>', process.env.DB_PASSWORD as string);

mongoose.connect(dbUrl as string)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err: Error) => {
    console.log(err);
  });

const port: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
app.listen(port, '127.0.0.1', () => {
  console.log(`Server is running on port ${port}`);
});