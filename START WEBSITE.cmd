@echo off
setlocal
cd /d "%~dp0"
set "PORTFOLIO_NODE=node"
where node >nul 2>nul
if errorlevel 1 set "PORTFOLIO_NODE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
"%PORTFOLIO_NODE%" scripts\serve.mjs --open
if errorlevel 1 (
  echo.
  echo The website could not start. Read the message above.
  echo If Node.js is missing, install Node.js 20 or newer.
  pause
)
