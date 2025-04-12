# GraphicShop Dependency Installer
# This script will install all required dependencies for GraphicShop

Write-Host "GraphicShop - Installing Dependencies" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "Node.js $nodeVersion is installed." -ForegroundColor Green
}
catch {
    Write-Host "ERROR: Node.js is not installed." -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    Write-Host "After installation, restart your computer and run this script again." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit
}

# Install dependencies
Write-Host "Installing required packages..." -ForegroundColor Cyan

# Core dependencies
Write-Host "Installing Express and core packages..." -ForegroundColor Yellow
npm install express sequelize mysql2 pg bcryptjs jsonwebtoken

# Web dependencies
Write-Host "Installing web-related packages..." -ForegroundColor Yellow
npm install ejs multer helmet compression cookie-parser

# Payment and email
Write-Host "Installing payment and email packages..." -ForegroundColor Yellow
npm install stripe nodemailer dotenv

# Dev dependencies
Write-Host "Installing developer tools..." -ForegroundColor Yellow
npm install --save-dev nodemon

Write-Host
Write-Host "All dependencies have been installed successfully!" -ForegroundColor Green
Write-Host
Write-Host "To start the application:" -ForegroundColor Cyan
Write-Host "1. Open Command Prompt or PowerShell" -ForegroundColor White
Write-Host "2. Navigate to the project directory: cd e:\code\graphic-shop" -ForegroundColor White
Write-Host "3. Run the server: node server.js" -ForegroundColor White
Write-Host "4. Open your browser and go to: http://localhost:3000" -ForegroundColor White

Read-Host "Press Enter to exit"
