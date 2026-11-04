@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js 20 or newer is required to preview the website.
  echo Install Node.js from https://nodejs.org/ and try again.
  pause
  exit /b 1
)
node scripts\serve.mjs --open
if errorlevel 1 (
  echo.
  echo The website could not start. Check the error above.
  pause
)
