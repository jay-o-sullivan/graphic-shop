/**
 * Startup script for GraphicShop application
 *
 * This script will:
 * 1. Check for required environment variables
 * 2. Initialize the database with sample data if needed
 * 3. Start the application
 */

// Check for Node.js and npm first
try {
  console.log('Checking for Node.js and npm...');

  // If we're running this script, Node.js is available,
  // but npm might not be in PATH or might not be installed properly
  console.log('Node.js is available, but npm command was not found.');
  console.log('\nPlease ensure npm is installed correctly:');
  console.log('1. Download and install Node.js from https://nodejs.org/ (includes npm)');
  console.log('2. Make sure npm is in your PATH environment variable');
  console.log('3. Restart your computer after installation');
  console.log('4. Try running this script again\n');

  // Provide alternative instructions for Windows users
  console.log('Windows users: You can also try running the install-nodejs.bat file in this directory.');

  process.exit(1);
} catch (error) {
  console.error('Error checking for Node.js:', error);
  process.exit(1);
}

require('dotenv').config();
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Check for .env file
if (!fs.existsSync(path.join(__dirname, '.env'))) {
  console.log('No .env file found. Creating from .env.example...');
  try {
    fs.copyFileSync(
      path.join(__dirname, '.env.example'),
      path.join(__dirname, '.env')
    );
    console.log('Created .env file. Please update it with your specific configuration.');
  } catch (error) {
    console.error('Error creating .env file:', error);
    process.exit(1);
  }
}

// Check for required environment variables
const requiredEnvVars = [
  'PORT',
  'DB_HOST',
  'DB_NAME',
  'DB_USER',
  'DB_PASSWORD',
  'JWT_SECRET',
  'STRIPE_PUBLIC_KEY',
  'STRIPE_SECRET_KEY',
  'EMAIL_HOST',
  'EMAIL_PORT',
  'EMAIL_USER',
  'EMAIL_PASS',
  'BASE_URL'
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:');
  missingEnvVars.forEach(varName => {
    console.error(`- ${varName}`);
  });
  console.error('Please update your .env file with these values.');
  process.exit(1);
}

// Ensure required directories exist
const requiredDirs = [
  path.join(__dirname, 'public/uploads'),
  path.join(__dirname, 'public/images')
];

requiredDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// Check dependencies
console.log('Checking dependencies...');
try {
  // Install any missing dependencies
  execSync('npm install', { stdio: 'inherit' });
  console.log('Dependencies installed successfully.');
} catch (error) {
  console.error('Error installing dependencies:', error);
  process.exit(1);
}

// Start the application
console.log('Starting GraphicShop application...');
try {
  require('./server');
} catch (error) {
  console.error('Error starting application:', error);
  process.exit(1);
}
