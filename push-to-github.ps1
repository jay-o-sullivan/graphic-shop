Write-Host "GraphicShop - GitHub Push Helper" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan
Write-Host

# Check if Git is installed
try {
    $gitVersion = git --version
    Write-Host "Git is installed: $gitVersion" -ForegroundColor Green
}
catch {
    Write-Host "ERROR: Git is not installed or not in your PATH." -ForegroundColor Red
    Write-Host "Please install Git from https://git-scm.com/downloads" -ForegroundColor Yellow
    Write-Host
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if the directory is already a git repository
if (-not (Test-Path .git)) {
    Write-Host "Initializing Git repository..." -ForegroundColor Yellow
    git init

    Write-Host "Creating .gitignore file..." -ForegroundColor Yellow
    @"
node_modules/
.env
.DS_Store
npm-debug.log
yarn-error.log
*.log
/public/uploads/
"@ | Out-File -FilePath .gitignore -Encoding utf8
}

Write-Host
Write-Host "Please enter your GitHub repository details:" -ForegroundColor Cyan
Write-Host "(If you haven't created a repository yet, please create one at https://github.com/new)" -ForegroundColor Yellow
Write-Host

$repoUrl = Read-Host "GitHub repository URL (e.g., https://github.com/username/repo.git)"

if ([string]::IsNullOrWhiteSpace($repoUrl)) {
    Write-Host "No repository URL provided. Exiting." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if remote origin exists
$remoteExists = git remote -v | Select-String "origin" -Quiet
if (-not $remoteExists) {
    Write-Host "Adding remote origin..." -ForegroundColor Yellow
    git remote add origin $repoUrl
}
else {
    Write-Host "Remote origin already exists. Updating..." -ForegroundColor Yellow
    git remote set-url origin $repoUrl
}

Write-Host
Write-Host "Adding all files to Git..." -ForegroundColor Yellow
git add .

Write-Host
Write-Host "Committing changes..." -ForegroundColor Yellow
$commitMsg = Read-Host "Enter commit message (or press Enter for default message)"

if ([string]::IsNullOrWhiteSpace($commitMsg)) {
    $commitMsg = "Initial commit of GraphicShop project"
}

git commit -m $commitMsg

Write-Host
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
$pushResult = git push -u origin master 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host
    Write-Host "Failed to push to 'master' branch. Trying 'main' branch instead..." -ForegroundColor Yellow
    git push -u origin main

    if ($LASTEXITCODE -ne 0) {
        Write-Host
        Write-Host "Failed to push to GitHub. You might need to:" -ForegroundColor Red
        Write-Host "1. Authenticate with GitHub" -ForegroundColor Yellow
        Write-Host "2. Check if your repository URL is correct" -ForegroundColor Yellow
        Write-Host "3. Create the repository on GitHub if it doesn't exist" -ForegroundColor Yellow
    }
}

Write-Host
Write-Host "Process completed. Check the output above for any errors." -ForegroundColor Cyan
Write-Host
Read-Host "Press Enter to exit"
