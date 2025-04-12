/**
 * GraphicShop Dependency Installer
 * This script installs all dependencies listed in requirements.txt
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  reset: '\x1b[0m'
};

// Print colored console messages
function print(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Main function to install dependencies
function installDependencies() {
  print('GraphicShop - Installing Dependencies from requirements.txt', 'cyan');
  print('======================================================', 'cyan');
  console.log('');

  // Check if requirements.txt exists
  const requirementsPath = path.join(__dirname, 'requirements.txt');
  if (!fs.existsSync(requirementsPath)) {
    print('ERROR: requirements.txt not found!', 'red');
    return;
  }

  // Read and parse requirements file
  const requirements = fs.readFileSync(requirementsPath, 'utf8')
    .split('\n')
    .filter(line => line.trim() && !line.startsWith('#'))
    .map(line => line.trim());

  const devDependencies = [];
  const regularDependencies = [];

  // Separate dev dependencies from regular dependencies
  requirements.forEach(dep => {
    if (dep === 'nodemon') {
      devDependencies.push(dep);
    } else {
      regularDependencies.push(dep);
    }
  });

  // Install regular dependencies
  if (regularDependencies.length > 0) {
    print('Installing regular dependencies...', 'yellow');
    try {
      execSync(`npm install ${regularDependencies.join(' ')}`, { stdio: 'inherit' });
      print('Regular dependencies installed successfully!', 'green');
    } catch (error) {
      print('Error installing regular dependencies.', 'red');
    }
  }

  // Install dev dependencies
  if (devDependencies.length > 0) {
    print('\nInstalling development dependencies...', 'yellow');
    try {
      execSync(`npm install --save-dev ${devDependencies.join(' ')}`, { stdio: 'inherit' });
      print('Development dependencies installed successfully!', 'green');
    } catch (error) {
      print('Error installing development dependencies.', 'red');
    }
  }

  console.log('');
  print('All dependencies have been installed!', 'green');
  console.log('');
  print('To start the application:', 'cyan');
  console.log('1. Navigate to the project directory: cd e:\\code\\graphic-shop');
  console.log('2. Run the server: node server.js');
  console.log('3. Access the application at: http://localhost:3000');
}

// Run the installer
installDependencies();
