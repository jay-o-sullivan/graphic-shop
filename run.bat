@echo off
echo Starting GraphicShop...
echo.

if not exist node_modules (
  echo Node modules not found. Attempting to install dependencies...
  call npm install
  if errorlevel 1 (
    echo.
    echo Error installing dependencies. You may need to install Node.js.
    echo Download Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
  )
)

echo.
echo Starting server...
node server.js
pause
