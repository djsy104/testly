const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const cors = require('cors');
const corsOptions = {
  origin: ['http://127.0.0.1:5173'],
};

// Connect DB
const connectDB = require('./config/database');
// const authenticatedUser = require('./middleware/authentication');

app.use(cors(corsOptions));

// Routers
const authRouter = require('./routes/authRouter');

// Routes
app.use('/api/auth', authRouter);

const startServer = async () => {
  try {
    connectDB();
    app.listen(port, () => console.log(`Server is listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

startServer();
