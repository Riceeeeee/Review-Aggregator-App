@echo off
REM File: run-all.bat
REM Chạy backend, frontend và scraper service cùng lúc trong 3 cửa sổ CMD

REM Lấy đường dẫn thư mục hiện tại (thư mục chứa file .bat)
set "ROOT=%~dp0"

echo Starting backend, frontend and scraper service...
echo.

REM ===== BACKEND (port 4000) =====
REM cd vào thư mục backend và chạy npm start
start "backend" cmd /k "cd /d "%ROOT%backend" && npm start"

REM ===== FRONTEND (Vite React, port 5173 mặc định) =====
REM cd vào thư mục frontend và chạy npm run dev
start "frontend" cmd /k "cd /d "%ROOT%frontend" && npm run dev"

REM ===== SCRAPER SERVICE (port 3001) =====
start "scraper-service" cmd /k "cd /d "%ROOT%scraper-service" && npm run dev"

echo All services started.
pause
