# Smart Library Platform

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.5.3-blue.svg)

A full-stack library management system for physical and digital libraries. Supports book search, borrowing, returning, reviews, staff administration, and analytics using MySQL and MongoDB.

---

## 🚀 Tech Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** Express.js, Node.js, TypeScript
- **Databases:** MySQL (relational), MongoDB (NoSQL)
- **Dev Tools:** Docker, npm, ESLint, Prettier, Flyway

---

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
---

## 📋 Prerequisites

- **Node.js** (v18+)
- **npm** (v9+)
- **Git** (v2+)
- **Docker** & **Docker Compose**
- **MongoDB** (local or Atlas)

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/BaoHo205/Smart-Library-Platform.git
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
npm install

# Install frontend dependencies
cd ../frontend
npm install
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
npm run dev
```

**Step 3: Start the frontend**

```bash
# Terminal 2: Frontend (in a new terminal)
cd frontend
npm run dev
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

## 🔑 Default Accounts

- **Staff:**  
  Username: `staff`  
  Password: `123456`

- **User:**  
  Username: `user`  
  Password: `123456`

---

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
npm run dev          # Start development server with nodemon
npm run build        # Build TypeScript to JavaScript
npm start            # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
```

**Frontend:**

```bash
npm run dev          # Start development server (port 3000)
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run Next.js linting
npm run lint:fix     # Fix linting issues
```
---

### Code Style

This project uses ESLint and Prettier for code formatting:

```bash
# Backend linting
cd backend
npm run lint
npm run lint:fix

# Frontend linting
cd frontend
npm run lint
npm run lint:fix
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
npm test

# Run frontend tests
cd frontend
npm test

# Run tests with coverage
npm run test:coverage

# Test database connections
curl http://localhost:5000/
```

## 🚀 Deployment

### Production Build

```bash
# Build backend
cd backend
npm run build

# Build frontend
cd frontend
npm run build
```

## 📝 Quick Start

1. `docker-compose up -d` (in backend) – Start databases
2. `npm install` (in backend & frontend) – Install dependencies
3. `cp .env.sample .env` (in backend) – Configure environment
4. Open **two terminals**:
   - Terminal 1: `cd backend && npm run dev`
   - Terminal 2: `cd frontend && npm run dev`
5. Visit [http://localhost:3000](http://localhost:3000) for the app

---

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
- 💬 [GitHub Issues](https://github.com/BaoHo205/Smart-Library-Platform/issues)
- 📧 Email: support@smartlibrary.com

### Project Status

This project is actively maintained. For feature requests and bug reports, please use the GitHub Issues page.

---

**Made with ❤️ by FTECH**