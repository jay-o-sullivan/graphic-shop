/**
 * GraphicShop Node.js Dependencies Installer
 */
const { execSync } = require('child_process');
const fs = require('fs');

console.log('GraphicShop - Installing Node.js Dependencies');
console.log('=======================================');
console.log();

// Read requirements.txt and parse it to get the actual dependencies
try {
  const content = fs.readFileSync('./requirements.txt', 'utf8');
  const dependencies = content
    .split('\n')
    .filter(line =>
      line.trim() &&
      !line.startsWith('#') &&
      !line.startsWith('//') &&
      !line.includes('To install')
    )
    .map(line => line.trim());

  // Separate regular and dev dependencies
  const devDependencies = dependencies.filter(dep => dep === 'nodemon');
  const regularDependencies = dependencies.filter(dep => dep !== 'nodemon');

  // Install regular dependencies
  if (regularDependencies.length > 0) {
    console.log('Installing regular dependencies...');
    execSync(`npm install ${regularDependencies.join(' ')}`, { stdio: 'inherit' });
  }

  // Install dev dependencies
  if (devDependencies.length > 0) {
    console.log('\nInstalling development dependencies...');
    execSync(`npm install --save-dev ${devDependencies.join(' ')}`, { stdio: 'inherit' });
  }

  console.log('\nAll dependencies installed successfully!');
  console.log('\nTo start the application:');
  console.log('  node server.js');
} catch (error) {
  console.error('Error installing dependencies:', error.message);
}
