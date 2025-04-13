@echo off
echo GraphicShop - Installing Dependencies
echo ================================
echo.

echo Installing sqlite3 and other required packages...
npm install sqlite3 sequelize express ejs dotenv

echo.
echo Dependencies installed. Starting the application...
echo.
start.bat
