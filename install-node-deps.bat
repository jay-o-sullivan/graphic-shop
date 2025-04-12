@echo off
echo GraphicShop - Node.js Dependencies Installer
echo =========================================
echo.

REM Check if Node.js is installed
WHERE node >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed!
    echo.
    echo These are Node.js packages and require Node.js to install.
    echo Please download and install Node.js from https://nodejs.org/
    echo After installing Node.js, run this script again.
    echo.
    pause
    exit /b 1
)

echo Node.js is installed. Installing dependencies...
echo.

node install.js

echo.
echo Installation process completed.
pause
