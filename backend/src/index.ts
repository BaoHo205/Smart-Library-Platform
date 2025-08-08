import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import mongoDBConnection from './database/mongodb/connection';
import mysqlConnection from './database/mysql/connection';
import bookRoutes from './routes/BookRoute';
import readingSessionRoutes from './routes/ReadingSessionRoute';

dotenv.config(); // Load environment variables from a .env file

const app = express();
const port = process.env.PORT || 5000;
const appName = process.env.APP_NAME || 'Smart Library Platform';

// Middleware
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
  res.send(`Hello World from ${appName}! Let's get an HD!`);
});

// API Routes
app.use('/api/books', bookRoutes);
app.use('/api/reading', readingSessionRoutes);

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
      console.log(`📚 Reading Session API: http://localhost:${port}/api/reading`);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the application
run();
