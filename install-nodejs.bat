@echo off
echo GraphicShop - Node.js Installer
echo =============================
echo.

echo This script will help you install Node.js which is required for GraphicShop.
echo.

:: Check if PowerShell is available
where powershell >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo PowerShell is not available on this system.
    echo Please install Node.js manually from https://nodejs.org/
    echo.
    echo Press any key to exit...
    pause >nul
    exit /b 1
)

:: Run the NodeJS installation using PowerShell
echo Launching PowerShell to download and install Node.js...
echo.
powershell -ExecutionPolicy Bypass -Command ^
    "$nodeUrl = 'https://nodejs.org/dist/v18.18.2/node-v18.18.2-x64.msi'; ^
    $nodeInstaller = '$env:TEMP\node_installer.msi'; ^
    Write-Host 'Downloading Node.js...'; ^
    Invoke-WebRequest -Uri $nodeUrl -OutFile $nodeInstaller; ^
    Write-Host 'Installing Node.js...'; ^
    Start-Process -FilePath 'msiexec.exe' -ArgumentList '/i', $nodeInstaller, '/quiet', '/passive' -Wait; ^
    Write-Host 'Node.js installation complete!' -ForegroundColor Green; ^
    Write-Host 'Please restart your computer to complete the setup.' -ForegroundColor Yellow"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo There was an error installing Node.js.
    echo Please install Node.js manually from https://nodejs.org/
) else (
    echo.
    echo Node.js has been installed. Please restart your computer,
    echo then try running GraphicShop again.
)

echo.
echo Press any key to exit...
pause >nul
