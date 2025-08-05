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
}

let pool: mysql.Pool;

const createDatabaseIfNotExists = async () => {
    try {
        // Create connection without database selection for creating DB
        const tempConnection = await mysql.createConnection({
            host: MySQL_CONFIG.host,
            port: MySQL_CONFIG.port,
            user: MySQL_CONFIG.user,
            password: MySQL_CONFIG.password
        });
        
        await tempConnection.execute(
            `CREATE DATABASE IF NOT EXISTS \`${MySQL_CONFIG.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
        );
        
        console.log(`✅ Database '${MySQL_CONFIG.database}' created`);
        await tempConnection.end();
        
    } catch (error) {
        console.error('❌ Error creating database:', error);
        throw error;
    }
};

const connect = async () => {
    try {
        // Create database first
        await createDatabaseIfNotExists();
        
        // Create connection pool
        pool = mysql.createPool(MySQL_CONFIG);
        
        // Test the connection
        const connection = await pool.getConnection();
        if (!connection) {
            throw new Error('Failed to get a connection from the pool');
        }
        else {
            console.log('✅ Connected to MySQL successfully!');
        }
        // console.log(`📍 Database: ${MySQL_CONFIG.database}`);
        // console.log(`🔗 Host: ${MySQL_CONFIG.host}:${MySQL_CONFIG.port}`);
        // console.log(`🏊 Pool: ${MySQL_CONFIG.connectionLimit} connections`);
        
        connection.release();
        
    } catch (error) {
        console.error('❌ Error connecting to MySQL:', error);
        throw error;
    }
};

const getPool = () => {
    if (!pool) {
        throw new Error('MySQL pool not initialized. Call connect() first.');
    }
    return pool;
};

const executeQuery = async (query: string, params?: any[]) => {
    try {
        const [results] = await pool.execute(query, params);
        return results;
    } catch (error) {
        console.error('❌ Error executing query:', error);
        throw error;
    }
};

const disconnect = async () => {
    try {
        if (pool) {
            await pool.end();
            console.log('👋 MySQL pool closed');
        }
    } catch (error) {
        console.error('❌ Error closing MySQL pool:', error);
    }
};

// Graceful shutdown
process.on('SIGINT', async () => {
    await disconnect();
});

process.on('SIGTERM', async () => {
    await disconnect();
});

export { connect, getPool, executeQuery, disconnect };
export default { connect };