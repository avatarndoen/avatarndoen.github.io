@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js 20 or newer is required to build the website.
  echo Install Node.js from https://nodejs.org/ and try again.
  pause
  exit /b 1
)
node scripts\build.mjs
if errorlevel 1 goto end
node scripts\check.mjs
:end
echo.
echo The dist folder contains the generated website.
pause
