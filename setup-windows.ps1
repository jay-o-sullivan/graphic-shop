Write-Host "GraphicShop Setup Helper" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan
Write-Host

# Check if Node.js is installed
$nodeInstalled = $false
try {
    $nodeVersion = node --version
    $npmVersion = npm --version
    $nodeInstalled = $true
    Write-Host "Node.js $nodeVersion and npm $npmVersion are already installed." -ForegroundColor Green
}
catch {
    Write-Host "Node.js and npm are not installed or not in your PATH." -ForegroundColor Red
}

if (-not $nodeInstalled) {
    Write-Host
    Write-Host "Would you like to download and install Node.js now? (Y/N)" -ForegroundColor Yellow
    $response = Read-Host

    if ($response -eq "Y" -or $response -eq "y") {
        Write-Host "Downloading Node.js installer..." -ForegroundColor Cyan
        $downloadUrl = "https://nodejs.org/dist/v16.20.2/node-v16.20.2-x64.msi"
        $outFile = "$env:TEMP\node-installer.msi"

        try {
            Invoke-WebRequest -Uri $downloadUrl -OutFile $outFile
            Write-Host "Download complete. Starting installation..." -ForegroundColor Green

            Start-Process -FilePath "msiexec.exe" -ArgumentList "/i `"$outFile`" /quiet /passive" -Wait

            Write-Host
            Write-Host "Node.js installation completed." -ForegroundColor Green
            Write-Host "Please restart your terminal or computer to update your PATH environment variable." -ForegroundColor Yellow
            Write-Host "After restarting, run this script again to continue setup." -ForegroundColor Yellow
        }
        catch {
            Write-Host "Error downloading or installing Node.js: $_" -ForegroundColor Red
            Write-Host "Please download and install Node.js manually from https://nodejs.org/" -ForegroundColor Yellow
        }

        exit
    }
    else {
        Write-Host
        Write-Host "Please install Node.js and npm manually:" -ForegroundColor Yellow
        Write-Host "1. Download from https://nodejs.org/" -ForegroundColor Yellow
        Write-Host "2. Run the installer and follow the instructions" -ForegroundColor Yellow
        Write-Host "3. Restart your computer" -ForegroundColor Yellow
        Write-Host "4. Run this script again" -ForegroundColor Yellow

        exit
    }
}

# If we get here, Node.js is installed
Write-Host "Setting up GraphicShop..." -ForegroundColor Cyan

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Cyan
npm install

# Check if .env file exists
if (-not (Test-Path .\.env)) {
    Write-Host "Creating .env file from template..." -ForegroundColor Cyan
    Copy-Item .\.env.example .\.env
    Write-Host "Please edit the .env file with your specific configuration." -ForegroundColor Yellow
}

# Create required directories
if (-not (Test-Path .\public\uploads)) {
    New-Item -Path .\public\uploads -ItemType Directory -Force | Out-Null
    Write-Host "Created uploads directory." -ForegroundColor Green
}

if (-not (Test-Path .\public\images)) {
    New-Item -Path .\public\images -ItemType Directory -Force | Out-Null
    Write-Host "Created images directory." -ForegroundColor Green
}

# Run setup scripts
Write-Host "Fetching sample images..." -ForegroundColor Cyan
node scripts/fetch-sample-images.js

Write-Host "Initializing database..." -ForegroundColor Cyan
node scripts/init-db.js

Write-Host
Write-Host "Setup complete! You can now start the application:" -ForegroundColor Green
Write-Host "node server.js" -ForegroundColor White -BackgroundColor DarkGreen
