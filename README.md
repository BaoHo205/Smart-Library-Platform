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
- **Dev Tools:** Docker, pnpm, ESLint, Prettier, Flyway

---

## 📁 Project Structure

```
Smart-Library-Platform/
├── frontend/    # Next.js app (UI, pages, components)
├── backend/     # Express.js API server
│   ├── flyway/  # SQL migrations
│   ├── compose.yaml
│   └── .env.sample
├── README.md
└── LICENSE
```

---

## 📋 Prerequisites

- **Node.js** (v18+)
- **pnpm** (v8+)
- **Git** (v2+)
- **Docker** & **Docker Compose**
- **MongoDB** (local or Atlas)

---

## ⚡ Useful Commands

### Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/Smart-Library-Platform.git
cd Smart-Library-Platform
```

### Start Database Services (Docker)

```bash
cd backend
docker-compose up -d
```
- To stop: `docker-compose down`
- To restart: `docker-compose restart`
- To remove containers and volumes: `docker-compose down -v`

### Install Dependencies

```bash
# Backend
cd backend
pnpm install

# Frontend
cd ../frontend
pnpm install
```

### Configure Environment Variables

```bash
cd backend
cp .env.sample .env
# Edit .env with your database and secret values
```

### Run the Backend Server

```bash
cd backend
pnpm dev        # Development mode
pnpm build      # Build for production
pnpm start      # Production mode
pnpm lint       # Run linter
pnpm lint:fix   # Auto-fix lint issues
```

### Run the Frontend Application

```bash
cd frontend
pnpm dev        # Development mode (http://localhost:3000)
pnpm build      # Build for production
pnpm start      # Production mode
pnpm lint       # Run linter
pnpm lint:fix   # Auto-fix lint issues
```

### Database Access & Verification

- **MySQL (Dockerized):**
  ```bash
  mysql -h localhost -P 6446 -u root -pftech2005 library_platform
  SHOW TABLES;
  ```
- **MongoDB (Local or Atlas):**
  ```bash
  mongo
  use library-platform
  db.users.find()
  ```

### Health Check & API Testing

- **Backend Health Check:**
  ```bash
  curl http://localhost:5000/
  ```
- **API Endpoint Example:**
  ```bash
  curl http://localhost:5000/api/v1/books
  ```

---

## 📝 Quick Start

1. `docker-compose up -d` (in backend) – Start databases
2. `pnpm install` (in backend & frontend) – Install dependencies
3. `cp .env.sample .env` (in backend) – Configure environment
4. `pnpm dev` (in backend & frontend) – Run servers
5. Visit [http://localhost:3000](http://localhost:3000) for the app

---

## 🔑 Default Accounts

- **Staff:**  
  Username: `staff`  
  Password: `123456`

- **User:**  
  Username: `user`  
  Password: `123456`

---

_Last updated: July 31, 2025_