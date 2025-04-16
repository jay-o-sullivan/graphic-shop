const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

// Create a temporary deployment directory
const tempDir = path.join(__dirname, "deploy-temp");
const distDir = path.join(__dirname, "dist");

// Simple command execution function
function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return reject(error);
      }
      if (stderr) console.error(`stderr: ${stderr}`);
      if (stdout) console.log(`stdout: ${stdout}`);
      resolve();
    });
  });
}

// Clean up function
function cleanup() {
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

async function deploy() {
  try {
    cleanup(); // Clean up any previous deployment temp dir

    // Create temp directory
    fs.mkdirSync(tempDir, { recursive: true });

    // Copy dist files to temp directory
    fs.cpSync(distDir, tempDir, { recursive: true });

    // Initialize git in temp directory
    process.chdir(tempDir);
    await runCommand("git init");
    await runCommand('git config user.name "GitHub Pages Deploy"');
    await runCommand('git config user.email "deploy@example.com"');

    // Add files and commit
    await runCommand("git add .");
    await runCommand('git commit -m "Deploy to GitHub Pages"');

    // Push to gh-pages branch
    await runCommand(
      "git push -f https://github.com/jay-o-sullivan/graphic-shop.git main:gh-pages"
    );

    console.log("Deployment complete!");

    // Return to original directory and clean up
    process.chdir(__dirname);
    cleanup();
  } catch (error) {
    console.error("Deployment failed:", error);
    process.chdir(__dirname);
    cleanup();
  }
}

deploy();
