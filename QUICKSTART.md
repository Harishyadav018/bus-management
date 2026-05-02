# Quick Start - College Bus Management System

## 🚀 Fastest Way to Run (5 minutes)

### Step 1: Install Docker Desktop
- Download: https://www.docker.com/products/docker-desktop
- Install and run it

### Step 2: Run the Project
```powershell
# In project root directory
docker-compose up
```

### Step 3: Start Frontend (in new PowerShell)
```powershell
cd frontend
npx http-server
```

### Step 4: Open Browser
```
http://localhost:8080
```

### Step 5: Login with Admin Account
- **Email**: harishmuthyala11@gmail.com
- **Password**: admin11

---

## ⚙️ Alternative: Without Docker (Local MySQL)

### Prerequisites
1. **MySQL Server** - https://dev.mysql.com/downloads/mysql/
2. **Node.js** - Already installed ✓

### Steps
```powershell
# Terminal 1 - Start MySQL (depends on your setup)
# Windows Services: MySQL80 service should be running
# Or: mysql.server start (if configured in PATH)

# Terminal 2 - Start Backend
cd backend
npm install  # if not done
npm start

# Terminal 3 - Start Frontend
cd frontend
npx http-server

# Terminal 4 - Open Browser
http://localhost:8080
```

---

## 📝 Default Test Accounts

### Admin
- **Email**: harishmuthyala11@gmail.com
- **Password**: admin11
- **Role**: admin

### For Testing Other Roles
Register new accounts from the login page with roles:
- Student
- Parent  
- Driver

---

## 🔍 Check If Services Are Running

```powershell
# Backend (should return JSON)
curl http://localhost:3000/api/routes

# Frontend (should load in browser)
http://localhost:8080
```

---

## 🛑 Stop Services

```powershell
# Docker
docker-compose down

# Node processes
Get-Process -ProcessName node | Stop-Process -Force
```

---

## 📞 Need Help?

1. Read **SETUP_GUIDE.md** for detailed instructions
2. Check **Troubleshooting** section in SETUP_GUIDE.md
3. Verify ports are not in use (3000, 3306, 8080)
4. Check error messages in terminal

---

## 📁 Important Files

- `docker-compose.yml` - Container configuration
- `backend/server.js` - API server
- `backend/db.js` - Database connection
- `backend/schema.sql` - Database tables
- `backend/package.json` - Dependencies
- `frontend/index.html` - Home page
- `frontend/js/auth.js` - Login logic

---

## 🎯 Available Pages

After login, you can access:
- **Admin Dashboard** - Manage everything
- **Driver Dashboard** - Manage routes & stops
- **Parent Dashboard** - Track child's bus
- **Student Dashboard** - Track bus & send alerts
- **Route Management** - Create/edit routes
- **Registrations** - Approve/reject users
- **Notifications** - View alerts
- **Tracking** - Real-time GPS tracking
