@echo off
echo GraphicShop - Startup Script
echo ========================
echo.

cd /d "%~dp0"
echo Current directory: %CD%

if not exist node_modules (
  echo Installing dependencies...
  call npm install
  if ERRORLEVEL 1 (
    echo Failed to install dependencies.
    echo Please make sure Node.js is installed correctly.
    pause
    exit /b 1
  )
)

echo Starting GraphicShop...
echo Server will be available at: http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

node server.js
pause
