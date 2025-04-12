@echo off
echo GraphicShop - GitHub Push Helper
echo =============================
echo.

REM Check if Git is installed
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Git is not installed or not in your PATH.
    echo Please install Git from https://git-scm.com/downloads
    echo.
    pause
    exit /b 1
)

REM Check if the directory is already a git repository
if not exist .git (
    echo Initializing Git repository...
    git init

    echo Creating .gitignore file...
    echo node_modules/ > .gitignore
    echo .env >> .gitignore
    echo .DS_Store >> .gitignore
    echo npm-debug.log >> .gitignore
    echo yarn-error.log >> .gitignore
    echo *.log >> .gitignore
    echo /public/uploads/ >> .gitignore
)

echo.
echo Please enter your GitHub repository details:
echo (If you haven't created a repository yet, please create one at https://github.com/new)
echo.

set /p REPO_URL="GitHub repository URL (e.g., https://github.com/username/repo.git): "

if "%REPO_URL%"=="" (
    echo No repository URL provided. Exiting.
    pause
    exit /b 1
)

REM Check if remote origin exists
git remote -v | findstr "origin" >nul
if %ERRORLEVEL% NEQ 0 (
    echo Adding remote origin...
    git remote add origin %REPO_URL%
) else (
    echo Remote origin already exists. Updating...
    git remote set-url origin %REPO_URL%
)

echo.
echo Adding all files to Git...
git add .

echo.
echo Committing changes...
set /p COMMIT_MSG="Enter commit message (or press Enter for default message): "

if "%COMMIT_MSG%"=="" (
    set COMMIT_MSG="Initial commit of GraphicShop project"
)

git commit -m %COMMIT_MSG%

echo.
echo Pushing to GitHub...
git push -u origin master

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Failed to push to GitHub. You might need to:
    echo 1. Authenticate with GitHub
    echo 2. Check if your repository URL is correct
    echo 3. Use 'main' branch instead of 'master' for newer repositories
    echo.
    echo Trying to push to 'main' branch instead...
    git push -u origin main
)

echo.
echo Process completed. Check the output above for any errors.
echo.
pause
