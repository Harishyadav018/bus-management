# College Bus Management System - Setup Guide

## Overview
Your project has:
- **Frontend**: Static HTML/CSS/JS files (index.html, login.html, etc.)
- **Backend**: Node.js Express API (port 3000)
- **Database**: MySQL database required

## Quick Setup (Recommended)

### Option 1: Using Docker (EASIEST - All-in-One)

**Prerequisites:**
- Install Docker Desktop from: https://www.docker.com/products/docker-desktop

**Steps:**
1. Open PowerShell in the project root directory
2. Run:
```powershell
docker-compose up
```

This will automatically:
- Start MySQL database on port 3306
- Start Node.js backend on port 3000
- Initialize the database with schema

3. In a new PowerShell window, navigate to the frontend directory:
```powershell
cd frontend
npx http-server
```

4. Open browser: `http://localhost:8080`

---

### Option 2: Using Local MySQL (Advanced)

**Prerequisites:**
- Install MySQL Server from: https://dev.mysql.com/downloads/mysql/
- Install Node.js (already have v24.13.0 ✓)

**Steps:**

#### 1. Set up MySQL Database
```powershell
# Start MySQL server (depends on your installation)
# Option A: Run MySQL from Services (Windows)
# Option B: Command line if MySQL is configured
mysql -u root -p

# Then paste this in MySQL:
SOURCE backend/schema.sql
```

#### 2. Configure Environment Variables
Create `.env` file in `backend/` folder:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=college_bus_db
PORT=3000
ADMIN_EMAIL=harishmuthyala11@gmail.com
ADMIN_PASSWORD=admin11
```

#### 3. Start Backend
```powershell
cd backend
npm install
npm start
```

#### 4. Start Frontend
```powershell
cd frontend
npx http-server
```

#### 5. Access Application
Open browser: `http://localhost:8080`

---

### Option 3: Using WSL + Docker (Alternative)

If you have WSL2 (Windows Subsystem for Linux):
1. Install Docker Desktop with WSL2 backend
2. Follow Option 1 steps

---

## What Happens When Running

### Docker Compose (`docker-compose up`)
- **MySQL Service** starts on `localhost:3306`
  - Database: `college_bus_db`
  - User: `root`
  - Password: `example`
  
- **Backend Service** starts on `localhost:3000`
  - Runs `npm install` automatically
  - Initializes database tables
  - Waits for MySQL to be healthy before starting

### Frontend Server
- Runs on `localhost:8080` (or next available port)
- Serves static HTML/CSS/JS files
- Frontend connects to backend at `http://localhost:3000/api`

---

## Testing the Setup

### Default Admin Credentials
- **Email**: harishmuthyala11@gmail.com
- **Password**: admin11
- **Role**: admin

### Available Roles
1. **Admin** - Manage routes, approve registrations, view alerts
2. **Student** - Register, track bus, view routes, send panic alerts
3. **Parent** - Register, track child's bus, receive notifications
4. **Driver** - Manage route stops, update location, view passengers

---

## Troubleshooting

### Port Already in Use
```powershell
# Kill process on port 3000 (backend)
Get-Process -ProcessName node | Stop-Process -Force

# Kill process on port 3306 (MySQL in Docker)
docker-compose down
```

### MySQL Connection Issues
- Verify credentials in `.env` file
- Ensure MySQL service is running
- Check if port 3306 is available
- Reset connection: `docker-compose restart db`

### Frontend Not Loading
- Ensure `http-server` is running
- Check browser console for API errors (F12)
- Verify backend is responding: `curl http://localhost:3000/api`

### Backend API Not Working
```powershell
# Test API endpoint
curl http://localhost:3000/api/routes

# View backend logs
npm start  # will show detailed errors
```

---

## File Structure
```
college_bus_management_system/
├── backend/
│   ├── server.js          # Express server
│   ├── db.js              # MySQL connection & schema
│   ├── schema.sql         # Database tables
│   ├── package.json       # Dependencies
│   ├── Dockerfile         # Docker build config
│   └── .env               # Environment variables
├── frontend/
│   ├── index.html         # Home page
│   ├── login.html         # Login/Registration
│   ├── admin-dashboard.html
│   ├── driver-dashboard.html
│   ├── parent-dashboard.html
│   ├── js/
│   │   ├── auth.js        # Login logic
│   │   ├── tracking.js    # Bus tracking
│   │   ├── routes.js      # Route management
│   │   └── panic.js       # Panic alerts
│   └── css/
│       └── style.css
└── docker-compose.yml     # Docker setup
```

---

## Quick Commands Reference

```powershell
# Start everything with Docker
docker-compose up

# Stop services
docker-compose down

# View logs
docker-compose logs backend
docker-compose logs db

# Access MySQL in Docker
docker exec -it college_bus_management_system-db-1 mysql -u root -p example college_bus_db

# Start frontend server
cd frontend && npx http-server

# Start backend manually
cd backend && npm start

# Install backend dependencies
cd backend && npm install
```

---

## Next Steps

1. Choose Option 1 (Docker) or Option 2/3 (Local MySQL)
2. Follow the steps for your chosen option
3. Access the application in your browser
4. Login with admin credentials to test

Need help? Check the error messages and refer to the Troubleshooting section above.
