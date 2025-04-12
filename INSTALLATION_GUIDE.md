# GraphicShop Installation Guide

## Prerequisites: Installing Node.js

Before you can run GraphicShop, you need to install Node.js:

1. **Download Node.js**:
   - Go to [https://nodejs.org/](https://nodejs.org/)
   - Download the LTS (Long Term Support) version for Windows

2. **Run the installer**:
   - Double-click the downloaded file (e.g., `node-v18.18.2-x64.msi`)
   - Follow the installation wizard
   - Make sure to check the option to add Node.js to your PATH

3. **Restart your computer**:
   - This ensures that the PATH environment variable is updated

4. **Verify installation**:
   - After restarting, open Command Prompt or PowerShell
   - Type `node --version` and press Enter
   - You should see the version number (e.g., v18.18.2)
   - Type `npm --version` and press Enter
   - You should see the npm version number

## Installing GraphicShop Dependencies

After installing Node.js and restarting your computer:

1. Open Command Prompt or PowerShell
2. Navigate to the GraphicShop directory:
   ```
   cd e:\code\graphic-shop
   ```
3. Install all dependencies:
   ```
   npm install express sequelize mysql2 pg bcryptjs jsonwebtoken ejs multer helmet compression cookie-parser stripe nodemailer dotenv
   npm install --save-dev nodemon
   ```

## Starting the Application

After installing Node.js and all dependencies:

1. Open Command Prompt or PowerShell
2. Navigate to the GraphicShop directory:
   ```
   cd e:\code\graphic-shop
   ```
3. Start the server:
   ```
   node server.js
   ```
4. Open your web browser and go to:
   ```
   http://localhost:3000
   ```

## Troubleshooting

- **"node is not recognized"**:
  - Make sure you've installed Node.js and restarted your computer
  - Check if Node.js is in your PATH by going to System Properties > Environment Variables

- **"Cannot find module 'express'"**:
  - Make sure you've installed all dependencies as described above

- **Database connection errors**:
  - Ensure your database server (MySQL or PostgreSQL) is running
  - Check the connection settings in your .env file
