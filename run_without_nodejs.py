import os
import sys
import subprocess
import platform
import webbrowser
import time
from pathlib import Path

def print_colored(text, color):
    """Print colored text if on Windows with colorama, or using ANSI on other platforms."""
    colors = {
        'red': '\033[91m',
        'green': '\033[92m',
        'yellow': '\033[93m',
        'blue': '\033[94m',
        'magenta': '\033[95m',
        'cyan': '\033[96m',
        'end': '\033[0m'
    }

    # Windows cmd doesn't support ANSI by default
    if platform.system() == 'Windows':
        try:
            # Try to use colorama if available
            from colorama import init, Fore
            init()
            color_map = {
                'red': Fore.RED,
                'green': Fore.GREEN,
                'yellow': Fore.YELLOW,
                'blue': Fore.BLUE,
                'magenta': Fore.MAGENTA,
                'cyan': Fore.CYAN,
                'end': Fore.RESET
            }
            print(f"{color_map.get(color, '')}{text}{color_map['end']}")
        except ImportError:
            # If colorama is not available, print without color
            print(text)
    else:
        # Use ANSI on other platforms
        print(f"{colors.get(color, '')}{text}{colors['end']}")

def check_nodejs():
    """Check if Node.js is installed and in PATH."""
    try:
        if platform.system() == 'Windows':
            subprocess.run(['where', 'node'], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        else:
            subprocess.run(['which', 'node'], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        return True
    except (subprocess.SubprocessError, FileNotFoundError):
        return False

def download_nodejs():
    """Provide instructions for downloading Node.js."""
    print_colored("\nNode.js is required to run GraphicShop.", "yellow")
    print_colored("\nPlease install Node.js:", "yellow")
    print("1. Download Node.js from https://nodejs.org/")
    print("2. Run the installer and follow the instructions")
    print("3. Restart your computer")
    print("4. Run this script again\n")

    # Try to open the Node.js website
    try:
        webbrowser.open("https://nodejs.org/")
        print_colored("Opened the Node.js website in your browser.", "green")
    except:
        print_colored("Please visit https://nodejs.org/ to download Node.js.", "yellow")

    input("\nPress Enter to exit...")
    sys.exit(1)

def setup_nodejs_app():
    """Provide instructions for setting up the Node.js application."""
    print_colored("\nSetting up GraphicShop...", "cyan")

    # Check if package.json exists
    if not Path("package.json").exists():
        print_colored("Error: package.json not found. Make sure you're in the correct directory.", "red")
        input("\nPress Enter to exit...")
        sys.exit(1)

    # Install dependencies
    print_colored("\nInstalling dependencies...", "cyan")
    try:
        subprocess.run(['npm', 'install'], check=True)
    except subprocess.SubprocessError:
        print_colored("Error installing dependencies. Please try running 'npm install' manually.", "red")
        input("\nPress Enter to exit...")
        sys.exit(1)

    # Run the application
    print_colored("\nStarting GraphicShop...", "green")
    try:
        # Use subprocess.Popen to start the server in the background
        process = subprocess.Popen(['node', 'server.js'])

        # Wait a bit for the server to start
        time.sleep(3)

        # Open the browser
        print_colored("\nOpening GraphicShop in your browser...", "green")
        webbrowser.open("http://localhost:3000")

        print_colored("\nGraphicShop is running. Press Ctrl+C to stop the server.", "green")

        # Wait for the process to finish (or be interrupted by Ctrl+C)
        process.wait()
    except KeyboardInterrupt:
        print_colored("\nStopping GraphicShop...", "yellow")
        process.terminate()
    except subprocess.SubprocessError:
        print_colored("\nError starting GraphicShop. Please try running 'node server.js' manually.", "red")

    input("\nPress Enter to exit...")

def main():
    """Main function."""
    print_colored("GraphicShop - Setup and Run", "cyan")
    print_colored("===========================\n", "cyan")

    # Check if Node.js is installed
    print_colored("Checking for Node.js...", "cyan")
    if not check_nodejs():
        download_nodejs()
    else:
        print_colored("Node.js is installed.", "green")
        setup_nodejs_app()

if __name__ == "__main__":
    main()
