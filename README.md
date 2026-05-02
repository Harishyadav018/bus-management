# College Bus Management System

> **🎉 Recent Updates:** Alert fetch issues have been fixed! Dashboard now shows proper error messages. See [FIXES_APPLIED.md](FIXES_APPLIED.md) for details.

A comprehensive college bus management system with real-time GPS tracking, passenger management, and emergency alert functionality.

## 📚 Documentation

- **[STARTUP.md](STARTUP.md)** ⭐ **START HERE** - Quick 30-second startup guide with fixes
- **[FIXES_APPLIED.md](FIXES_APPLIED.md)** - Detailed explanation of all fixes applied
- **[QUICKSTART.md](QUICKSTART.md)** - 5-minute quick start guide
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Detailed setup with 3 options
- **[INSTALL_MYSQL.md](INSTALL_MYSQL.md)** - MySQL installation guide
- **setup.ps1** - Automated startup script

## 🚀 Quick Start (5 minutes)

### Option 1: Docker (Recommended - Easiest)

```powershell
# Install Docker Desktop: https://www.docker.com/products/docker-desktop
# Then run:
docker-compose up

# In new terminal:
cd frontend && npx http-server

# Open: http://localhost:8080
```

### Option 2: Local Setup

```powershell
# 1. Install MySQL: https://dev.mysql.com/downloads/mysql/
# 2. Update backend/.env with MySQL password

# Terminal 1 - Backend
cd backend
npm install
npm start

# Terminal 2 - Frontend
cd frontend
npx http-server

# Open: http://localhost:8080
```

## 🔐 Default Admin Credentials

```
Email: harishmuthyala11@gmail.com
Password: admin11
Role: admin
```

## 📋 Project Structure

```
college_bus_management_system/
├── backend/                   # Express API server
│   ├── server.js             # Main server
│   ├── db.js                 # Database connection
│   ├── schema.sql            # Database tables
│   ├── package.json          # Dependencies
│   ├── .env                  # Configuration
│   └── Dockerfile
├── frontend/                  # Web application
│   ├── index.html            # Home page
│   ├── login.html            # Authentication
│   ├── admin-dashboard.html
│   ├── driver-dashboard.html
│   ├── manage-routes.html
│   ├── tracking.html
│   ├── js/
│   │   ├── auth.js           # Login logic
│   │   ├── tracking.js       # GPS tracking
│   │   ├── routes.js         # Route management
│   │   └── panic.js          # Emergency alerts
│   └── css/
│       └── style.css
├── docker-compose.yml        # Docker configuration
└── SETUP_GUIDE.md           # Complete setup guide
```

## 🌐 Service URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:8080 |
| Backend API | http://localhost:3000/api |
| MySQL | localhost:3306 |

## 🧑‍💼 User Roles

1. **Admin** - Manage everything (routes, registrations, alerts)
2. **Driver** - Manage bus route and stops
3. **Student** - Track bus and send emergency alerts
4. **Parent** - Monitor child's location and get notifications

## 📋 Requirements

### Docker Method (Easiest)
- Docker Desktop
- Windows/Mac/Linux

### Local Method
- Node.js 18+ (✓ v24.13.0 installed)
- MySQL 8.0+ Server
- npm (comes with Node.js)

## ⚙️ Configuration

Edit `backend/.env` to change:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=example
DB_NAME=college_bus_db
PORT=3000
```

## 🆘 Troubleshooting

**Services won't start?**
- Check port availability: 3000, 3306, 8080
- See [SETUP_GUIDE.md Troubleshooting](SETUP_GUIDE.md#troubleshooting)

**Database connection error?**
- Verify MySQL is running
- Check credentials in backend/.env
- See [INSTALL_MYSQL.md](INSTALL_MYSQL.md)

**API not responding?**
- Test: `curl http://localhost:3000/api/routes`
- Check backend console for errors

## 📞 Available Commands

```powershell
# Start everything
docker-compose up                    # With Docker
./setup.ps1                          # Automated setup

# Backend
cd backend && npm start              # Start API
cd backend && npm install            # Install dependencies

# Frontend
cd frontend && npx http-server       # Start server

# Docker commands
docker-compose down                  # Stop services
docker-compose logs backend          # View logs
docker-compose restart               # Restart services
```

## ✨ Features

✅ User Registration & Authentication (Student, Parent, Driver, Admin)
✅ Admin Approval System for New Users
✅ Real-Time GPS Bus Tracking
✅ Route Management
✅ Emergency Panic Alerts
✅ Parent Notifications
✅ Dashboard for Each Role
✅ Location History
✅ Response Status Tracking

## 🔧 Technology Stack

- **Frontend**: HTML5, CSS3, Tailwind CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Authentication**: bcryptjs password hashing
- **API**: RESTful API with CORS
- **Containerization**: Docker & Docker Compose

## 📝 Notes

- Backend automatically creates database and tables on first run
- Frontend auto-detects API at `http://localhost:3000` in development
- Static files are served from the `frontend/` directory
- Passwords are bcrypt hashed for security
- CORS is enabled for development

## 🔒 Security

- Passwords are bcrypt hashed with salt
- CORS configured for local development
- Database credentials in environment variables
- Role-based access control for admin features

## 📖 Next Steps

1. Choose your setup method (Docker or Local)
2. Follow [QUICKSTART.md](QUICKSTART.md) or [SETUP_GUIDE.md](SETUP_GUIDE.md)
3. Start all services
4. Login with admin credentials
5. Create test users for each role
6. Explore all features

---

**For detailed setup instructions, see [SETUP_GUIDE.md](SETUP_GUIDE.md)**
