#!/usr/bin/env powershell
<#
.SYNOPSIS
    Quick startup script for College Bus Management System
.DESCRIPTION
    Automatically starts backend and frontend services
.EXAMPLE
    .\setup.ps1
#>

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "College Bus Management System - Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor Yellow
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js not found! Please install it first." -ForegroundColor Red
    exit 1
}
$nodeVersion = node --version
Write-Host "✓ Node.js $nodeVersion found" -ForegroundColor Green

# Check if backend node_modules exist
Write-Host ""
Write-Host "Setting up backend..." -ForegroundColor Yellow
if (!(Test-Path "backend/node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Cyan
    Push-Location backend
    npm install
    Pop-Location
} else {
    Write-Host "✓ Dependencies already installed" -ForegroundColor Green
}

# Check for .env file
Write-Host ""
Write-Host "Checking configuration..." -ForegroundColor Yellow
if (!(Test-Path "backend/.env")) {
    Write-Host "⚠ .env file not found in backend/" -ForegroundColor Yellow
    Write-Host "Creating default .env file..." -ForegroundColor Cyan
    @"
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=example
DB_NAME=college_bus_db
PORT=3000
ADMIN_EMAIL=harishmuthyala11@gmail.com
ADMIN_PASSWORD=admin11
"@ | Out-File -FilePath "backend/.env" -Encoding UTF8
    Write-Host "✓ .env file created with default values" -ForegroundColor Green
} else {
    Write-Host "✓ .env file found" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Services" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is available
Write-Host "Checking Docker..." -ForegroundColor Yellow
if (Get-Command docker -ErrorAction SilentlyContinue) {
    Write-Host "✓ Docker found" -ForegroundColor Green
    Write-Host ""
    Write-Host "Would you like to use Docker Compose? (y/n)" -ForegroundColor Cyan
    $useDocker = Read-Host
    
    if ($useDocker -eq 'y' -or $useDocker -eq 'yes') {
        Write-Host ""
        Write-Host "Starting Docker Compose services..." -ForegroundColor Cyan
        docker-compose up -d
        Write-Host "✓ Docker services started" -ForegroundColor Green
        Write-Host "⏳ Waiting for services to be ready..." -ForegroundColor Yellow
        Start-Sleep -Seconds 5
    }
} else {
    Write-Host "⚠ Docker not found. Will use local MySQL setup." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Starting backend server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$pwd\backend'; npm start"
Write-Host "✓ Backend started on http://localhost:3000" -ForegroundColor Green

Write-Host ""
Write-Host "Starting frontend server..." -ForegroundColor Cyan
Start-Sleep -Seconds 2
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$pwd\frontend'; npx http-server"
Write-Host "✓ Frontend starting on http://localhost:8080" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setup Complete! ✓" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📍 Frontend: http://localhost:8080" -ForegroundColor Green
Write-Host "📍 Backend API: http://localhost:3000/api" -ForegroundColor Green
Write-Host ""
Write-Host "👤 Admin Login:" -ForegroundColor Cyan
Write-Host "   Email: harishmuthyala11@gmail.com" -ForegroundColor Green
Write-Host "   Password: admin11" -ForegroundColor Green
Write-Host ""
Write-Host "Opening browser..." -ForegroundColor Yellow
Start-Process "http://localhost:8080"

Write-Host ""
Write-Host "Tip: Windows Defender Firewall may ask for permissions." -ForegroundColor Yellow
Write-Host "     Click 'Allow' to enable network access." -ForegroundColor Yellow
