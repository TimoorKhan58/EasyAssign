# Task Assignment System - Documentation

This guide provides a step-by-step explanation of how to set up, run, and use the Task Assignment Application.

## 1. Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Node.js**: Version 16 or higher (v18+ recommended).
- **npm**: Comes with Node.js.
- **Git**: To clone/manage the repository.

## 2. Installation

### Backend Setup (Server)

1. Open your terminal.
2. Navigate to the server directory:
   ```bash
   cd d:/EasyAssign/server
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Initialize the Database (SQLite):
   ```bash
   npm run generate   # Generates the Prisma Client
   npm run db:push    # Pushes the schema to the local SQLite database (dev.db)
   ```
5. Seed the Database (Create default Admin and Staff users):
   ```bash
   npm run seed
   ```

### Frontend Setup (Client)

1. Open a **new** terminal window.
2. Navigate to the client directory:
   ```bash
   cd d:/EasyAssign/client
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
   *Note: If you encounter issues, try clearing cache or deleting `node_modules` and re-running install.*

## 3. Running the Application

You need to run both the backend and frontend servers simultaneously.

**Step 1: Start the Backend**
In your server terminal:
```bash
npm start
```
*The server will start on `http://localhost:3000`.*

**Step 2: Start the Frontend**
In your client terminal:
```bash
npm run dev
```
*The application will be accessible at `http://localhost:5175` (or similar port shown in terminal).*

## 4. Using the Application

### Login Credentials
The system comes with pre-created users (from the seed step):

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@company.com` | `admin123` |
| **Staff** | `staff@company.com` | `staff123` |

### Scenario 1: Admin Workflow (Manage Tasks & Staff)

1. **Log In**: Go to the login page and sign in as **Admin**.
2. **Dashboard**: Only Admins see the full dashboard with stats (Total Tasks, Overdue, etc.).
3. **Add Staff**:
    - Click **Staff** in the sidebar.
    - Click **Add Staff**.
    - Enter details (Name: "John Doe", Email: "john@example.com", Password: "password").
    - Click **Create Account**.
4. **Create a Task**:
    - Click **Tasks** in the sidebar.
    - Click **New Task**.
    - detailed form appears.
    - Title: "Fix Login Bug".
    - Priority: "High".
    - Assign To: Select "John Doe" (or other staff).
    - Click **Create Task**.

### Scenario 2: Staff Workflow (Complete Tasks)

1. **Log In**: Sign out and sign in as **Staff** (e.g., `staff@company.com` or the new user you created).
2. **View Tasks**: You will see a list of tasks assigned specifically to you.
3. **Task Details**:
    - Click on any task card to open the **Task Details** page.
4. **Update Status**:
    - On the details page, look at the sidebar.
    - Click **In Progress** to mark you are working on it.
    - Click **Completed** when done.
5. **Add Comments**:
    - Type a message in the comment box: "Fixed the issue, deploying now."
    - Press **Enter** or the Send icon.

## 5. Troubleshooting

- **White Screen / Blank Page**:
    - Check the browser console (F12) for errors.
    - Ensure the Backend server is running.
- **"Failed to fetch" Error**:
    - This usually means the Backend server is not running or the port is blocked.
- **Database Errors**:
    - Run `npm run db:push` in the server folder to reset/update the schema if you made changes.

## 6. Project Structure

- **`/server`**: Backend API (Node.js/Express)
    - **`prisma/`**: Database schema and seed script.
    - **`controllers/`**: Logic for Auth, Users, Tasks.
    - **`routes/`**: API endpoints definition.
- **`/client`**: Frontend App (React/Vite)
    - **`src/pages/`**: Main views (Dashboard, Tasks, Staff, Login).
    - **`src/context/`**: Auth state management.
    - **`src/services/`**: API connection logic.
