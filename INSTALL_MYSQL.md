# Installing MySQL on Windows

Choose the method that works best for you:

## Method 1: Official MySQL Installer (Recommended)

1. Download: https://dev.mysql.com/downloads/mysql/
2. Choose "Windows (x86, 64-bit), MSI Installer"
3. Run installer and follow wizard:
   - Select "Setup Type" → Custom
   - Select MySQL Server (latest version)
   - Configuration Type → Development Machine
   - Port → 3306
   - MySQL Root Password → `example` (or your choice)
4. Complete installation
5. MySQL will start automatically as a Windows Service

## Method 2: Using Chocolatey (If Installed)

```powershell
# Run as Administrator
choco install mysql -y

# Start service
net start MySQL80  # or MySQL57/MySQL-5.7 depending on version
```

## Method 3: Using WSL2 + Docker

If you have Windows Subsystem for Linux 2:
1. Install Docker Desktop with WSL2 backend
2. Run `docker-compose up` from project root

## Method 4: Cloud MySQL Alternative

If local installation is difficult:
- Use **PlanetScale** (Free tier MySQL): https://planetscale.com
- Use **ClearDB** (Free tier): https://www.cleardb.com
- Use **AWS RDS** (Free tier): https://aws.amazon.com/rds/

---

## Verify MySQL Installation

```powershell
# Check if MySQL is running
mysql --version

# Or check Windows Services
Get-Service MySQL* | Select-Object Status, Name
```

## Initialize Database

After MySQL is installed and running:

```powershell
# Open MySQL command line
mysql -u root -p

# Enter password (default: "example" or what you set)

# Then paste into MySQL prompt:
SOURCE C:\Users\haris.HARISH\OneDrive\Documents\college_bus_management_system\backend\schema.sql
```

## Update .env File (If Using Custom Password)

Edit `backend/.env`:
```
DB_PASSWORD=your_password_here
```

---

## Common Issues & Solutions

### "mysql: command not found"
- MySQL not installed
- MySQL not in PATH
- Solution: Add MySQL to PATH or use full path: `C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql`

### "Access denied for user 'root'"
- Wrong password in `.env` file
- Solution: Update `DB_PASSWORD` in `.env` to match MySQL installation

### "Can't connect to MySQL server"
- MySQL service not running
- Solution: Start MySQL from Windows Services or: `net start MySQL80`

### Port 3306 already in use
- Another MySQL instance or service using it
- Solution: Check Services or run: `netstat -ano | findstr :3306`

---

## Next Steps

After MySQL is installed and running:

1. Update `.env` file with your MySQL credentials
2. Run backend: `cd backend && npm start`
3. Run frontend: `cd frontend && npx http-server`
4. Open: `http://localhost:8080`

---

## Alternative: Docker Compose (Easiest)

If you have Docker Desktop installed:

```powershell
# This handles MySQL automatically
docker-compose up
```

---

Need help? Check the detailed SETUP_GUIDE.md file.
