@echo off
setlocal enabledelayedexpansion

echo GraphicShop - Dependency Installer
echo ===============================
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

echo Node.js is installed. Installing dependencies...
echo.

REM Create package.json if it doesn't exist
IF NOT EXIST package.json (
    echo Creating package.json file...
    echo {> package.json
    echo   "name": "graphic-shop",>> package.json
    echo   "version": "1.0.0",>> package.json
    echo   "description": "Freelance graphic design services platform",>> package.json
    echo   "main": "server.js",>> package.json
    echo   "scripts": {>> package.json
    echo     "start": "node server.js",>> package.json
    echo     "dev": "nodemon server.js",>> package.json
    echo     "setup": "node scripts/init-db.js">> package.json
    echo   },>> package.json
    echo   "dependencies": {},>> package.json
    echo   "devDependencies": {}>> package.json
    echo }>> package.json
)

REM Core dependencies
echo Installing Express and core packages...
call npm install express sequelize mysql2 pg bcryptjs jsonwebtoken
IF %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install core dependencies.
    echo Please check your internet connection and try again.
    pause
    exit /b 1
)

REM Web dependencies
echo Installing web-related packages...
call npm install ejs multer helmet compression cookie-parser
IF %ERRORLEVEL% NEQ 0 (
    echo WARNING: Failed to install web-related packages.
    echo The application may still work, but some features may be limited.
)

REM Payment and email
echo Installing payment and email packages...
call npm install stripe nodemailer dotenv
IF %ERRORLEVEL% NEQ 0 (
    echo WARNING: Failed to install payment and email packages.
    echo The application may still work with limited functionality.
)

REM Dev dependencies
echo Installing developer tools...
call npm install --save-dev nodemon
IF %ERRORLEVEL% NEQ 0 (
    echo WARNING: Failed to install developer tools.
    echo Development features may be limited.
)

REM Create essential directories with better feedback
echo Creating required directories...
FOR %%D IN (
    public\uploads
    public\images
    public\css
    public\js
    views
    views\partials
    views\admin
    models
    routes
    middleware
    utils
    config
    scripts
) DO (
    IF NOT EXIST %%D (
        echo Creating: %%D
        mkdir %%D 2>nul || (
            echo ERROR: Could not create directory %%D
        )
    )
)

echo.
echo All dependencies have been installed successfully!
echo.

REM Verify .env file exists
IF NOT EXIST .env (
    IF EXIST .env.example (
        echo Creating .env file from .env.example...
        copy .env.example .env
        echo Please update the .env file with your specific configuration.
    ) ELSE (
        echo Creating basic .env file...
        echo PORT=3000> .env
        echo DB_HOST=localhost>> .env
        echo DB_NAME=graphic_shop>> .env
        echo DB_USER=root>> .env
        echo DB_PASSWORD=>> .env
        echo JWT_SECRET=your_jwt_secret>> .env
        echo STRIPE_PUBLIC_KEY=your_stripe_public_key>> .env
        echo STRIPE_SECRET_KEY=your_stripe_secret_key>> .env
        echo EMAIL_HOST=smtp.example.com>> .env
        echo EMAIL_PORT=587>> .env
        echo EMAIL_USER=your_email@example.com>> .env
        echo EMAIL_PASS=your_email_password>> .env
        echo BASE_URL=http://localhost:3000>> .env
        echo Please update the .env file with your specific configuration.
    )
)

REM HOW TO RUN GRAPHICSHOP IN TERMINAL:
REM 1. Open Command Prompt (cmd) or PowerShell
REM 2. Navigate to the project directory by typing: cd e:\code\graphic-shop
REM 3. After installing dependencies, run: node server.js
REM 4. Access the application at: http://localhost:3000

echo.
echo Next steps:
echo 1. Update the .env file with your database and service credentials
echo 2. Run "node server.js" to start the application
echo.

pause
