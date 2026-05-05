@echo off
set currentDir=%~dp0
echo Starting server.....
cd %currentDir%server
echo %cd%
start start_server.bat
timeout /t 2 /nobreak
echo Done
echo Starting frontend.....
cd %currentDir%frontend
echo %cd%
start start_frontend.bat
timeout /t 2 /nobreak
echo Done