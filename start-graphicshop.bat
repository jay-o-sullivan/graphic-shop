@echo off
echo GraphicShop - Startup Script
echo ==========================
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Node.js is not installed or not in your PATH.
    echo.
    echo Would you like to install Node.js now? (Y/N)
    set /p InstallNode=
    if /i "%InstallNode%"=="Y" (
        call install-nodejs.bat
        echo.
        echo Please restart your computer after Node.js installation.
        echo Then run this script again.
        echo.
        echo Press any key to exit...
        pause >nul
        exit /b
    ) else (
        echo.
        echo GraphicShop requires Node.js to run.
        echo Please install Node.js and try again.
        echo.
        echo Press any key to exit...
        pause >nul
        exit /b 1
    )
)

:: Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Node.js is installed, but npm is not found.
    echo This could indicate a problem with your Node.js installation.
    echo.
    echo Would you like to reinstall Node.js? (Y/N)
    set /p ReinstallNode=
    if /i "%ReinstallNode%"=="Y" (
        call install-nodejs.bat
        echo.
        echo Please restart your computer after Node.js installation.
        echo Then run this script again.
        echo.
        echo Press any key to exit...
        pause >nul
        exit /b
    ) else (
        echo.
        echo GraphicShop requires npm to run.
        echo Press any key to exit...
        pause >nul
        exit /b 1
    )
)

:: If we get here, both Node.js and npm are installed
echo Node.js and npm are installed. Starting GraphicShop...
echo.

:: Check if node_modules exists
if not exist node_modules (
    echo Installing dependencies...
    npm install
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo Error installing dependencies.
        echo Press any key to exit...
        pause >nul
        exit /b 1
    )
)

:: Run the application
node start.js

echo.
echo GraphicShop has stopped running.
echo Press any key to exit...
pause >nul
