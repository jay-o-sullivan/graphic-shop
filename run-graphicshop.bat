@echo off
echo GraphicShop - Quick Start
echo =======================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed on this system.
    echo.
    echo Please install Node.js before running GraphicShop:
    echo 1. Download Node.js from https://nodejs.org/
    echo 2. Run the installer and follow the instructions
    echo 3. Restart your computer
    echo 4. Run this script again
    echo.
    echo Press any key to exit...
    pause >nul
    exit /b 1
)

REM Now run the application directly with node
echo Starting GraphicShop...
echo.
echo If this is your first time running GraphicShop, setup may take a moment.
echo.

REM Run the application with Node.js directly
node server.js

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: GraphicShop encountered a problem.
    echo.
)

echo.
echo GraphicShop has stopped running.
echo Press any key to exit...
pause >nul
