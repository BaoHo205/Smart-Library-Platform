import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoDBConnection from './database/mongodb/connection';
import mysqlConnection from './database/mysql/connection';
import authRouter from './routes/authRoutes';
import authMiddleware from './middleware/authMiddleware';
import cookieParser from 'cookie-parser';
import apiRouter from './routes/apiRoutes';

import * as swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger-output.json';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const appName = process.env.APP_NAME || 'Smart Library Platform';

app.use(
  cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.get('/', (req: Request, res: Response) => {
  res.send(`Hello World from ${appName}! Let's get an HD!`);
});

app.use('/auth', authRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(authMiddleware.verifyJWT); // require jwt for all routes below
app.use('/api/v1', apiRouter);
// app.use('/api/books', bookRouter)

const run = async () => {
  try {
    console.log('🚀 Starting Smart Library Platform Backend...');

    // Connect to MongoDB
    await mongoDBConnection.connect();

    // Connect to MySQL
    await mysqlConnection.connect();

    // Start Express server
    app.listen(port, () => {
      console.log(`📋 App: ${appName}`);
      console.log(`🎉 Server running at http://localhost:${port}`);
      console.log(`API Docs: http://localhost:${port}/api-docs`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the application
run();
