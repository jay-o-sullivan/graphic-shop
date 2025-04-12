@echo off
echo GraphicShop Starter
echo =================
echo.

REM Check if npm is available
WHERE npm >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed or not in your PATH
    echo.
    echo Please install Node.js from https://nodejs.org/
    echo Then restart your computer before running this script again.
    echo.
    pause
    exit /b 1
)

REM Check if node_modules exists
IF NOT EXIST node_modules (
    echo Installing dependencies (this might take a few minutes)...
    npm install
    IF %ERRORLEVEL% NEQ 0 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
)

echo Starting GraphicShop...
echo.
echo The application will be available at: http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

node server.js
pause
