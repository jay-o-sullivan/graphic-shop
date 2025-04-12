@echo off
echo GraphicShop - Node.js Installer
echo =============================
echo.

echo This script will download and install Node.js, which is required for GraphicShop.
echo.

echo Would you like to download and install Node.js now? (Y/N)
set /p confirm=
if /i "%confirm%"=="Y" goto :download
echo Installation cancelled.
goto :end

:download
echo.
echo Downloading Node.js installer...
powershell -Command "(New-Object Net.WebClient).DownloadFile('https://nodejs.org/dist/v18.18.2/node-v18.18.2-x64.msi', 'node-installer.msi')"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Error downloading Node.js installer.
    echo Please download Node.js manually from https://nodejs.org/
    goto :end
)

echo.
echo Starting installation...
echo This may take a few minutes. Please wait...
start /wait msiexec /i node-installer.msi /qn

echo.
echo Node.js installation completed.
echo Please restart your computer before running GraphicShop.
echo After restarting, try running run_without_nodejs.py again.

:end
echo.
echo Press any key to exit...
pause >nul
