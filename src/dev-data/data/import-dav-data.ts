import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Tour } from './../../models/toure.model';

dotenv.config({ path: path.join(__dirname, '../../../config.env') });

// connect to DB
const dbUrl = process.env.DATABASE?.replace('<db_password>', process.env.DB_PASSWORD as string);

mongoose.connect(dbUrl as string)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err: Error) => {
    console.log(err);
  });

// read json file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));


// import data into DB
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data imported successfully!');
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit();
  }
};

// delete all data from DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data deleted successfully!');
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit();
  }
};

if(process.argv[2] === '--import') {
  importData();
} else if(process.argv[2] === '--delete') {
  deleteData();
}