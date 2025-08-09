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

const createPublisherTable = `
CREATE TABLE IF NOT EXISTS Publisher (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
`;

const createBookTable = `
CREATE TABLE IF NOT EXISTS Book (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    thumbnail_url VARCHAR(255),
    isbn VARCHAR(255),
    quantity INT,
    page_count INT,
    publisher_id VARCHAR(36),
    description TEXT,
    status ENUM('available', 'borrowed', 'lost', 'damaged') DEFAULT 'available',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (publisher_id) REFERENCES Publisher(id) ON DELETE SET NULL ON UPDATE CASCADE
);`;

const createAuthorTable = `
CREATE TABLE IF NOT EXISTS Author (
    id VARCHAR(36) PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);`;

const createUserTable = `
    CREATE TABLE IF NOT EXISTS User (
                id VARCHAR(36) PRIMARY KEY,
                username VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                first_name VARCHAR(255),
                last_name VARCHAR(255),
                email VARCHAR(255) NOT NULL UNIQUE,
                role ENUM('member', 'staff', 'admin') DEFAULT 'member',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);`;

const createCategoryTable = `
CREATE TABLE IF NOT EXISTS Category (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);`;

const createBookAuthorTable = `
CREATE TABLE IF NOT EXISTS Book_Author (
                book_id VARCHAR(36) NOT NULL,
                author_id VARCHAR(36) NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY (book_id, author_id),
                FOREIGN KEY (book_id) REFERENCES Book(id) ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY (author_id) REFERENCES Author(id) ON DELETE CASCADE ON UPDATE CASCADE
            );`;

const createBookCategoryTable = `
            CREATE TABLE IF NOT EXISTS Book_Category (
                book_id VARCHAR(36) NOT NULL,
                category_id VARCHAR(36) NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY (book_id, category_id),
                FOREIGN KEY (book_id) REFERENCES Book(id) ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY (category_id) REFERENCES Category(id) ON DELETE CASCADE ON UPDATE CASCADE
            );`;

const createCheckoutTable = `
CREATE TABLE IF NOT EXISTS Checkout (
                id VARCHAR(36) PRIMARY KEY,
                user_id VARCHAR(36) NOT NULL,
                book_id VARCHAR(36) NOT NULL,
                checkout_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                due_date DATETIME NOT NULL,
                return_date DATETIME,
                is_returned BOOLEAN DEFAULT FALSE,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE RESTRICT ON UPDATE CASCADE,
                FOREIGN KEY (book_id) REFERENCES Book(id) ON DELETE RESTRICT ON UPDATE CASCADE
            );`;

const createReviewTable = `
            CREATE TABLE IF NOT EXISTS Review (
                id VARCHAR(36) PRIMARY KEY,
                book_id VARCHAR(36) NOT NULL,
                user_id VARCHAR(36) NOT NULL,
                comment TEXT,
                rating INT CHECK (rating >= 1 AND rating <= 5),
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (book_id) REFERENCES Book(id) ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE ON UPDATE CASCADE,
                UNIQUE (book_id, user_id)
            );`;

const createStaffLogsTable = `
CREATE TABLE IF NOT EXISTS Staff_Logs (
                id VARCHAR(36) PRIMARY KEY,
                staff_id VARCHAR(36) NOT NULL,
                action_type ENUM('checkout', 'return', 'add_book', 'delete_book', 'user_management', 'system_maintenance', 'other') NOT NULL,
                action_details TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (staff_id) REFERENCES User(id) ON DELETE RESTRICT ON UPDATE CASCADE
            );`;

const initializeDatabaseAndTables = async () => {
  try {
    // Create connection without database selection for creating DB
    const tempConnection = await mysql.createConnection({
      host: MySQL_CONFIG.host,
      port: MySQL_CONFIG.port,
      user: MySQL_CONFIG.user,
      password: MySQL_CONFIG.password,
      database: MySQL_CONFIG.database
    });

    await tempConnection.execute(
      `CREATE DATABASE IF NOT EXISTS \`${MySQL_CONFIG.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );

    // await tempConnection.execute(
    //     `USE ${MySQL_CONFIG.database}`
    // );

    await tempConnection.execute(createPublisherTable);
    console.log('✅ Table `Publisher` created/verified.');

    await tempConnection.execute(createAuthorTable);
    console.log('✅ Table `Author` created/verified.');

    await tempConnection.execute(createUserTable);
    console.log('✅ Table `User` created/verified.');

    await tempConnection.execute(createCategoryTable);
    console.log('✅ Table `Category` created/verified.');

    await tempConnection.execute(createBookTable);
    console.log('✅ Table `Book` created/verified.');

    await tempConnection.execute(createBookAuthorTable);
    console.log('✅ Table `Book_Author` created/verified.');

    await tempConnection.execute(createBookCategoryTable);
    console.log('✅ Table `Book_Category` created/verified.');

    await tempConnection.execute(createCheckoutTable);
    console.log('✅ Table `Checkout` created/verified.');

    await tempConnection.execute(createReviewTable);
    console.log('✅ Table `Review` created/verified.');

    await tempConnection.execute(createStaffLogsTable);
    console.log('✅ Table `Staff_Logs` created/verified.');

    console.log(`✅ Database '${MySQL_CONFIG.database}' created/verified`);
    await tempConnection.end();

  } catch (error) {
    console.error('❌ Error creating database:', error);
    throw error;
  }
};

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
        console.log('✅ Connected to MySQL successfully!');
        // console.log(`📍 Database: ${MySQL_CONFIG.database}`);
        // console.log(`🔗 Host: ${MySQL_CONFIG.host}:${MySQL_CONFIG.port}`);
        // console.log(`🏊 Pool: ${MySQL_CONFIG.connectionLimit} connections`);
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

export const executeQuery = async (query: string, params?: any[], existingConnection?: mysql.PoolConnection): Promise<[mysql.QueryResult, mysql.FieldPacket[]]> => {
  const pool = getPool();
  let connection: mysql.PoolConnection | undefined;
  try {
    if (existingConnection) {
      connection = existingConnection;
    } else {
      connection = await pool.getConnection(); // Get a new connection for a single query
    }

    const [rows, fields] = await connection.execute(query, params);
    return [rows, fields];
  } catch (error) {
    console.error('❌ Error executing query:', query, params, error);
    throw error;
  } finally {
    // ONLY release the connection if it was acquired by this function, 
    // NOT if it was passed in from a service function managing a transaction.
    if (connection && !existingConnection) {
      connection.release();
    }
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
