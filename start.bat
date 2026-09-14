@echo off
title MyWebsite Server (Port 80)
echo ===================================================
echo   Starting Web Server on Port 80...
echo ===================================================
echo.

:: Check Administrator privileges
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Port 80 usually requires Administrator privileges!
    echo If the server fails to start with EACCES error, please:
    echo 1. Right-click 'start.bat'
    echo 2. Select 'Run as administrator'
    echo.
)

:: Try launching with Node.js first, then Python fallback
where node >nul 2>&1
if %errorlevel% == 0 (
    echo Launching server using Node.js...
    node server.js 80
) else (
    where python >nul 2>&1
    if %errorlevel% == 0 (
        echo Launching server using Python...
        python -m http.server 80
    ) else (
        echo [ERROR] Neither Node.js nor Python was found on your system.
        echo Please install Node.js (https://nodejs.org) or Python (https://www.python.org).
        echo.
        pause
        exit /b 1
    )
)

pause
