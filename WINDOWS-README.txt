GraphicShop - Setup Instructions for Windows
===========================================

If you're seeing this file, you might have encountered issues running GraphicShop.
Follow these steps to get GraphicShop running on your Windows system:

1. INSTALL NODE.JS
------------------
Node.js is required to run GraphicShop. To install it:

a) AUTOMATIC INSTALLATION:
   - Double-click the "install-nodejs.bat" file in this folder
   - Follow the prompts to download and install Node.js
   - Restart your computer after installation completes

b) MANUAL INSTALLATION:
   - Go to https://nodejs.org/
   - Download the "LTS" (Long Term Support) version
   - Run the installer and follow the instructions
   - Make sure to check the option to add Node.js to your PATH
   - Restart your computer after installation

2. START GRAPHICSHOP
--------------------
After installing Node.js and restarting your computer:

- Double-click the "start-graphicshop.bat" file in this folder
- The script will check for Node.js, install dependencies if needed, and start the application

3. ACCESSING GRAPHICSHOP
------------------------
Once the application is running, you can access it by opening your web browser and going to:
http://localhost:3000

4. TROUBLESHOOTING
------------------
If you encounter issues:

- Make sure you've restarted your computer after installing Node.js
- Check that you're running the scripts as an administrator
- If you see errors about missing modules, try running "npm install" in Command Prompt
- If you see database errors, make sure MySQL is installed and running

For more detailed instructions, refer to the README.md file in this directory.

Need more help? Contact support at support@graphicshop.com
