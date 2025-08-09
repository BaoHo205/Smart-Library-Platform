import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const MySQL_CONFIG = {
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'library_platform',
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
};

let pool: mysql.Pool;

const connect = async () => {
  try {
    // Add retry logic for Docker startup
    let retries = 5;
    while (retries > 0) {
      try {
        // Create connection pool
        pool = mysql.createPool(MySQL_CONFIG);

        // Test the connection
        const connection = await pool.getConnection();
        console.log('Connected to MySQL successfully!');
        // console.log(`Database: ${MySQL_CONFIG.database}`);
        // console.log(`Host: ${MySQL_CONFIG.host}:${MySQL_CONFIG.port}`);

        connection.release();
        break;
      } catch (error) {
        retries--;
        if (retries === 0) throw error;
        console.log(`Waiting for database... (${5 - retries}/5)`);
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }
  } catch (error) {
    console.error('Error connecting to MySQL:', error);
    throw error;
  }
};

const getPool = () => {
  if (!pool) {
    throw new Error('MySQL pool not initialized. Call connect() first.');
  }
  return pool;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const executeQuery = async (query: string, params?: any[] | any) => {
  try {
    const normalizedParams: unknown[] =
      params === undefined ? [] : Array.isArray(params) ? params : [params];

    const placeholders = (query.match(/\?/g) || []).length;
    if (placeholders !== normalizedParams.length) {
      console.error('[SQL PARAM MISMATCH]', {
        placeholders,
        paramsLength: normalizedParams.length,
        query,
        params: normalizedParams,
      });
      throw new Error(`SQL placeholder/param mismatch: expected ${placeholders}, got ${normalizedParams.length}`);
    }

    const [results] = await pool.execute(query, normalizedParams);
    return results;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
};

const disconnect = async () => {
  try {
    if (pool) {
      await pool.end();
      console.log('MySQL pool closed');
    }
  } catch (error) {
    console.error('Error closing MySQL pool:', error);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  await disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await disconnect();
  process.exit(0);
});

export default { connect, getPool, executeQuery, disconnect };
