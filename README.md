# Smart Library Platform

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.5.3-blue.svg)

A modern, full-stack library management system built with Next.js and Express.js, designed to streamline library operations and enhance user experience.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

## 🎯 Overview

The Smart Library Platform is a comprehensive digital solution designed to modernize library management systems. It provides librarians and patrons with intuitive tools for book management, user administration, and seamless library operations.

### Key Objectives

- Digitize library catalog and inventory management
- Streamline book borrowing and return processes
- Provide real-time availability tracking
- Enable user self-service capabilities
- Generate comprehensive reporting and analytics

## ✨ Features

### For Librarians

- 📚 **Catalog Management** - Add, edit, and organize book collections
- 👥 **User Administration** - Manage patron accounts and permissions
- 📊 **Analytics Dashboard** - Track borrowing patterns and inventory metrics
- 🔍 **Advanced Search** - Multi-criteria book and user search functionality
- 📋 **Reports Generation** - Automated reporting for library operations

### For Patrons

- 🔍 **Book Discovery** - Intuitive search and browse functionality
- 📱 **Account Management** - View borrowing history and account status
- 🔔 **Notifications** - Due date reminders and availability alerts
- ⭐ **Reviews & Ratings** - Community-driven book recommendations

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Databases     │
│   (Next.js)     │◄──►│   (Express.js)  │◄──►│   MongoDB       │
│   Port: 3000    │    │   Port: 5000    │    │   MySQL         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technology Stack

**Frontend:**

- Next.js 15.4.5 (React Framework)
- React 19.1.0
- TypeScript 5.x
- Tailwind CSS 4.x
- ESLint & Prettier

**Backend:**

- Node.js
- Express.js 4.x
- TypeScript 5.5.3

**Databases:**

- **MongoDB**
- **MySQL**

**DevOps & Tools:**

- Git & GitHub
- ESLint & Prettier
- Nodemon (Development)
- pnpm (Package Manager)
- Dotenv (Environment Variables)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **pnpm** (v8.0.0 or higher)
- **Git** (v2.0.0 or higher)
- **Docker** (v20.0.0 or higher) and **Docker Compose**
- **MongoDB** (v6.0 or higher) or MongoDB Atlas account _(for MongoDB, Docker not required)_

```bash
# Verify installations
node --version
pnpm --version
git --version
docker --version
docker-compose --version
```

**Note:** MySQL is provided via Docker container, so no local MySQL installation is required.

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/Smart-Library-Platform.git
cd Smart-Library-Platform
```

### 2. Start Docker Services (Database)

First, start the Docker services for the databases:

```bash
# Navigate to backend directory
cd backend

# Start Docker services (MySQL with Flyway migrations)
docker-compose up -d

# Verify containers are running
docker-compose ps
```

This will start:

- **MySQL Server** on port `6446` (mapped from container port 3306)
- **Flyway Migration Service** to set up the database schema automatically

### 3. Install Dependencies

```bash
# Install backend dependencies (if not already in backend directory)
cd backend
pnpm install

# Install frontend dependencies
cd ../frontend
pnpm install
```

### 4. Environment Configuration

Copy the sample environment file and configure your settings:

```bash
# Copy environment sample (backend)
cd backend
cp .env.sample .env

# Edit with your actual values
nano .env  # or use your preferred editor
```

Configure both database connections in your `backend/.env` file:

```env
# Backend Configuration
PORT=5000
NODE_ENV=development
APP_NAME="Smart Library Platform Backend"
APP_VERSION=1.0.0

# MongoDB Configuration (with Connection Pool)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
# Or local: mongodb://localhost:27017/library-platform

# MySQL Configuration (Dockerized Database)
MYSQL_HOST=localhost
MYSQL_PORT=6446
MYSQL_USER=root
MYSQL_PASSWORD=ftech2005
MYSQL_DATABASE=library_platform

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7

# CORS Configuration
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
CORS_CREDENTIALS=true
```

### 5. Database Setup

#### MongoDB Setup

```bash
# For development, you can use MongoDB Atlas (recommended)
# Update MONGODB_URI in your .env file with your Atlas connection string

# Or start MongoDB locally (if using local installation)
mongod
```

#### MySQL Setup (Dockerized)

The MySQL database is already running in Docker from step 2. The Docker setup includes:

- **MySQL Server**: Running on port `6446`
- **Database**: `library_platform` (auto-created)
- **User**: `root` with password `ftech2005`
- **Flyway Migrations**: Automatically applied on startup

To verify the database is working:

```bash
# Connect to the dockerized MySQL database
mysql -h localhost -P 6446 -u root -pftech2005 library_platform

# Or check tables
mysql -h localhost -P 6446 -u root -pftech2005 -e "SHOW TABLES;" library_platform
```

## 🎮 Usage

### Development Mode

**Step 1: Ensure Docker services are running**

```bash
cd backend
docker-compose ps  # Check if containers are running
# If not running: docker-compose up -d
```

**Step 2: Start the backend server**

```bash
# Terminal 1: Backend (make sure you're in backend directory)
cd backend
pnpm dev
```

**Step 3: Start the frontend**

```bash
# Terminal 2: Frontend (in a new terminal)
cd frontend
pnpm dev
```

### Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Health Check:** http://localhost:5000/
- **MySQL Database:** localhost:6446 (user: root, password: ftech2005)

### Expected Output

When starting the backend, you should see:

```
🚀 Starting Smart Library Platform Backend...
✅ Connected to MongoDB successfully!
✅ Connected to MySQL successfully!
📋 App: Smart Library Platform Backend
🎉 Server running at http://localhost:5000
```

### Docker Management

**Useful Docker commands:**

```bash
# Check container status
docker-compose ps

# View container logs
docker-compose logs db
docker-compose logs flyway

# Stop all services
docker-compose down

# Restart services
docker-compose restart

# Stop and remove containers with volumes (⚠️ This will delete data)
docker-compose down -v
```

### Scripts Available

**Backend:**

```bash
pnpm dev          # Start development server with nodemon
pnpm build        # Build TypeScript to JavaScript
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm lint:fix     # Fix ESLint issues
```

**Frontend:**

```bash
pnpm dev          # Start development server (port 3000)
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run Next.js linting
pnpm lint:fix     # Fix linting issues
```

## 📖 API Documentation

### Base URL

```
http://localhost:5000/api/v1
```

<!-- ### Health Check
```http
GET /               # Basic server info
```

### Authentication (MySQL)
```http
POST /auth/login    # User login
POST /auth/register # User registration
POST /auth/logout   # User logout
```

### Books Management (MySQL)
```http
GET    /books          # Get all books
GET    /books/:id      # Get book by ID
POST   /books          # Create new book
PUT    /books/:id      # Update book
DELETE /books/:id      # Delete book
```

### Users Management (MySQL)
```http
GET    /users          # Get all users
GET    /users/:id      # Get user by ID
PUT    /users/:id      # Update user
DELETE /users/:id      # Delete user
```

### Reviews & Analytics (MongoDB)
```http
GET    /reviews        # Get book reviews
POST   /reviews        # Create review
GET    /analytics      # Get library analytics
POST   /logs           # Create activity log
``` -->

## 📁 Project Structure

```
Smart-Library-Platform/
├── frontend/                   # Next.js frontend application
│   ├── src/
│   │   ├── app/               # Next.js app router
│   │   │   └── page.tsx       # Home page
│   │   ├── components/        # Reusable UI components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── services/          # API service layer
│   │   ├── store/             # State management
│   │   └── types/             # TypeScript type definitions
│   ├── public/                # Static assets
│   ├── package.json           # Frontend dependencies
│   ├── next.config.js         # Next.js configuration
│   └── tailwind.config.js     # Tailwind CSS configuration
├── backend/                    # Express.js backend application
│   ├── src/
│   │   ├── index.ts           # Main application entry point
│   │   ├── controllers/       # Request handlers
│   │   ├── models/            # Database models
│   │   ├── routes/            # API routes
│   │   ├── middleware/        # Custom middleware
│   │   ├── services/          # Business logic
│   │   └── database/          # Database connections
│   │       ├── mongodb/       # MongoDB connection with pooling
│   │       │   └── connection.ts
│   │       └── mysql/         # MySQL connection with pooling
│   │           └── connection.ts
│   ├── compose.yaml           # Docker Compose for MySQL & Flyway
│   ├── flyway/                # Database migration files
│   │   ├── flyway.toml        # Flyway configuration
│   │   └── migrations/        # SQL migration scripts
│   ├── package.json           # Backend dependencies
│   ├── tsconfig.json          # TypeScript configuration
│   └── .env                   # Environment variables
├── docs/                       # Documentation
├── .env.sample                 # Environment configuration sample
├── .gitignore                 # Git ignore rules
├── README.md                  # Project documentation
└── LICENSE                    # MIT License
```

## 🗄️ Database Strategy

### Connection Pooling Configuration

**MongoDB Connection Pool:**

- Max Pool Size: 10 connections
- Min Pool Size: 2 connections
- Max Idle Time: 30 seconds
- Server Selection Timeout: 5 seconds
- Socket Timeout: 45 seconds
- Buffer Commands: Disabled

**MySQL Connection Pool:**

- Connection Limit: 10 connections
- Max Idle: 10 connections
- Idle Timeout: 60 seconds
- Queue Limit: 0 (unlimited)
- Keep Alive: Enabled
- Wait for Connections: Enabled

### Data Distribution Strategy

**MySQL (Relational Data):**

- User accounts and authentication
- Book catalog and metadata
- Borrowing transactions and history
- Library inventory management
- Staff and administrative data

**MongoDB (Flexible/Analytics Data):**

- User activity logs and sessions
- Book reviews and ratings
- Search analytics and recommendations
- System logs and monitoring data
- Temporary/cache data

### Benefits of Dual Database Approach

1. **Performance Optimization**: Use the right database for the right data type
2. **Scalability**: Scale databases independently based on usage patterns
3. **Data Integrity**: Relational data in MySQL, flexible data in MongoDB
4. **Analytics**: MongoDB for complex queries and aggregations
5. **Backup Strategy**: Different backup strategies for different data types

## 👨‍💻 Development

### Database Management

```bash
# Check database connections
curl http://localhost:5000/

# MongoDB operations (if using local MongoDB)
mongo library-platform         # Access MongoDB shell
use library-platform          # Switch to database
db.users.find()               # Query collections

# MySQL operations (Dockerized)
mysql -h localhost -P 6446 -u root -pftech2005 library_platform
SHOW TABLES;
SELECT * FROM users;
```

### Troubleshooting

#### Docker Issues

```bash
docker-compose down -v
docker-compose up -d

# Check if ports are already in use
lsof -i :6446  # Check MySQL port
lsof -i :5000  # Check backend port
lsof -i :3000  # Check frontend port
```

### Code Style

This project uses ESLint and Prettier for code formatting:

```bash
# Backend linting
cd backend
pnpm lint
pnpm lint:fix

# Frontend linting
cd frontend
pnpm lint
pnpm lint:fix
```

### Git Workflow

1. Create feature branch: `git checkout -b feature/your-feature-name`
2. Make changes and commit: `git commit -m "feat: add new feature"`
3. Push branch: `git push origin feature/your-feature-name`
4. Create Pull Request

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions or modifications
- `chore:` Maintenance tasks

## 🧪 Testing

```bash
# Run backend tests
cd backend
pnpm test

# Run frontend tests
cd frontend
pnpm test

# Run tests with coverage
pnpm test:coverage

# Test database connections
curl http://localhost:5000/
```

## 🚀 Deployment

### Production Build

```bash
# Build backend
cd backend
pnpm build

# Build frontend
cd frontend
pnpm build
```

### Environment Variables

Ensure all production environment variables are set:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your-production-mongodb-uri
MYSQL_HOST=your-production-mysql-host
MYSQL_DATABASE=library_platform_prod
JWT_SECRET=your-production-jwt-secret-very-long-and-secure
CORS_ORIGIN=https://yourdomain.com
```

### Deployment Platforms

- **Frontend:** Vercel, Netlify
- **Backend:** Railway, Render, Heroku, DigitalOcean
- **Databases:**
  - **MongoDB:** MongoDB Atlas
  - **MySQL:** PlanetScale, AWS RDS, Google Cloud SQL

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help

- 📖 [Documentation](docs/)
- 💬 [GitHub Issues](https://github.com/YOUR_USERNAME/Smart-Library-Platform/issues)
- 📧 Email: support@smartlibrary.com

### Project Status

This project is actively maintained. For feature requests and bug reports, please use the GitHub Issues page.

---

**Made with ❤️ by [Your Name/Team]**

_Last updated: July 31, 2025_
