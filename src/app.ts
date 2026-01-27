import express from 'express';
import fs from 'fs';

const app = express();

const data = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8'),
);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    stsuccessatus: true,
    results: data.length,
    data: {
      tours: data,
    },
  });
});

const port = 3000;
app.listen(port, '127.0.0.4', () => {
  console.log(`Server is running on port ${port}`);
});
 