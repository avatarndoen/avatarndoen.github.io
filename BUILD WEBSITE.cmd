@echo off
setlocal
cd /d "%~dp0"
set "PORTFOLIO_NODE=node"
where node >nul 2>nul
if errorlevel 1 set "PORTFOLIO_NODE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
"%PORTFOLIO_NODE%" scripts\build.mjs
if errorlevel 1 goto end
"%PORTFOLIO_NODE%" scripts\check.mjs
:end
echo.
echo The dist folder contains the generated website.
pause
