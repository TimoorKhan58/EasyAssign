# Task Assignment Application

A scalable, full-stack Task Management system with dynamic staff assignment.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Lucide Icons, React Router
- **Backend**: Node.js, Express, Prisma ORM, SQLite (dev) / PostgreSQL (prod)
- **Database**: SQLite (default for development)

## Setup & Run

### Prerequisites
- Node.js installed

### Steps

1. **Setup Backend**
   ```bash
   cd server
   npm install
   npm run generate  # Generate Prisma Client
   npm run db:push   # Push schema to DB
   npm start         # Runs on port 3000
   ```

2. **Setup Frontend**
   ```bash
   cd client
   npm install
   npm run dev       # Runs on port 5173
   ```

3. **Login Credentials (Dev)**
   - Use the registration API to create first user, or rely on Auto-Seeding (if implemented).
   - Default endpoints: `http://localhost:3000/api`

## Features
- **Admin**: Manage staff, Create tasks, View dashboard stats.
- **Staff**: View assigned tasks, Update status, Add comments.
