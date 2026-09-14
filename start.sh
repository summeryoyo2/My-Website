#!/bin/bash

# Web Server Launcher for Linux (Port 80)

PORT=80

echo "==================================================="
echo "  Starting Web Server on Port $PORT..."
echo "==================================================="
echo ""

# Port 80 requires root privileges on Linux (<1024)
if [ "$EUID" -ne 0 ]; then
  echo "[NOTICE] Port $PORT requires root privileges."
  echo "Prompts for sudo password if needed..."
  exec sudo "$0" "$@"
  exit
fi

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd "$SCRIPT_DIR"

if command -v node &> /dev/null; then
    echo "Launching server using Node.js..."
    node server.js $PORT
elif command -v python3 &> /dev/null; then
    echo "Launching server using Python 3..."
    python3 -m http.server $PORT
elif command -v python &> /dev/null; then
    echo "Launching server using Python..."
    python -m http.server $PORT
else
    echo "[ERROR] Neither Node.js nor Python is installed."
    echo "Please install Node.js or Python3."
    echo ""
    echo "To install Node.js:"
    echo "  Ubuntu/Debian: sudo apt update && sudo apt install -y nodejs"
    echo "  CentOS/RHEL:   sudo dnf install -y nodejs"
    echo "  Arch Linux:    sudo pacman -S nodejs"
    exit 1
fi
