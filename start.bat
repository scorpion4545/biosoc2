@echo off
echo ========================================
echo Starting BioSoc-DTU Application
echo ========================================
echo.

echo Starting Backend Server...
start cmd /k "cd server && npm start"

timeout /t 3 /nobreak > nul

echo Starting Frontend Server...
start cmd /k "npm run dev"

echo.
echo ========================================
echo Both servers are starting!
echo.
echo Backend API: http://localhost:3001
echo Frontend: http://localhost:5173
echo Admin Panel: http://localhost:5173/admin
echo ========================================
echo.
echo Press any key to exit this window...
pause > nul
