require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const corsOptions = {
  origin: ['http://127.0.0.1:5173'],
};

app.use(cors(corsOptions));

app.get('/api', (req, res) => {
  res.json({
    message: 'hello world',
  });
});

app.listen(8080, () => {
  console.log('Server started listening on port 8080...');
});
