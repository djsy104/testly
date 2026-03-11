const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') }); // Loads environmental variables first so modules can see them as needed

// Core framework and middleware
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8080;
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

app.set('trust proxy', 1);

app.use(helmet());

// Parses incoming JSON and attaches it to req.body for access
app.use(express.json({ limit: '10kb' })); // Limits the size of JSON body to prevent malicious payloads

// Rate limit only auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/auth', authLimiter);

// For front-end hosts
const corsOptions = {
  origin: ['http://127.0.0.1:5173', 'http://localhost:5173', 'https://testly-react.onrender.com'],
};
app.use(cors(corsOptions));

// Database connection
const connectDB = require('./config/database');

// Importing Routes
const authRouter = require('./routes/authRouter');
const testsRouter = require('./routes/testsRouter');

// Used to ensure routes are only accessed by the correct user
const authenticateUser = require('./middleware/authentication');

// Mounting Routes
app.use('/api/auth', authRouter);
app.use('/api/tests', authenticateUser, testsRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Error handling middleware
const notFoundMiddleware = require('./middleware/notFound');
const errorHandlerMiddleware = require('./middleware/errorHandler');

app.use(notFoundMiddleware); // For unknown routes
app.use(errorHandlerMiddleware); // Centralized error handler

const startServer = async () => {
  try {
    // Server only starts if DB is ready
    await connectDB();
    app.listen(port, () => console.log(`Server is listening on port ${port}...`));
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

startServer();
