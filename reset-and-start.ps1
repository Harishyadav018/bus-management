# Reset Database and Restart Backend
# This script deletes the college_bus_db database and restarts the backend
# which will automatically recreate it with the new admin credentials

Write-Host "🔄 Resetting College Bus Database..." -ForegroundColor Cyan
Write-Host "`nThis will:" -ForegroundColor Yellow
Write-Host "  1. Delete the college_bus_db database"
Write-Host "  2. Restart the backend"
Write-Host "  3. Recreate database with new admin: admin@college.edu / admin"
Write-Host ""

# Check if MySQL is running
Write-Host "⏳ Checking MySQL..." -ForegroundColor Yellow
$mysqlCheck = Get-Process mysqld -ErrorAction SilentlyContinue
if (-not $mysqlCheck) {
    Write-Host "⚠️  MySQL doesn't appear to be running" -ForegroundColor Yellow
    Write-Host "   Make sure MySQL is running before proceeding"
    Read-Host "Press Enter to continue anyway, or Ctrl+C to exit"
}

# Delete the database using MySQL command line
Write-Host "`n🗑️  Dropping old database..." -ForegroundColor Yellow
$mysqlPath = "mysql"
$result = & $mysqlPath -u root -e "DROP DATABASE IF EXISTS college_bus_db;" 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Database dropped successfully" -ForegroundColor Green
} else {
    Write-Host "⚠️  Could not drop database (might not exist, or MySQL issue)" -ForegroundColor Yellow
}

# Kill any running backend processes
Write-Host "`n⏹️  Stopping any running backend processes..." -ForegroundColor Yellow
$nodeProcesses = Get-Process node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    $nodeProcesses | Stop-Process -Force
    Write-Host "✅ Stopped Node.js processes" -ForegroundColor Green
    Start-Sleep -Seconds 2
} else {
    Write-Host "   (No running Node.js processes found)" -ForegroundColor Gray
}

# Start the backend
Write-Host "`n🚀 Starting backend..." -ForegroundColor Yellow
Write-Host "   Backend will initialize fresh database with admin credentials:" -ForegroundColor Cyan
Write-Host "   📧 Email: admin@college.edu" -ForegroundColor Green
Write-Host "   🔐 Password: admin" -ForegroundColor Green
Write-Host ""

cd backend
npm start
