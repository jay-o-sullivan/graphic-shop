@echo off
echo GraphicShop - Requirements Installer
echo =================================
echo.

REM Check if Node.js is installed
WHERE node >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed.
    echo Please install Node.js from https://nodejs.org/
    echo After installation, restart your computer and run this script again.
    pause
    exit /b
)

echo Running dependency installer...
node install-from-requirements.js

pause
