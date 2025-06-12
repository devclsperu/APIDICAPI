@echo off
echo Deteniendo APIDICAPI...

REM Buscar y terminar procesos de Node.js que ejecuten la aplicación
taskkill /F /IM node.exe /FI "WINDOWTITLE eq APIDICAPI*" >nul 2>&1
taskkill /F /IM node.exe /FI "COMMANDLINE eq *dist/index.js*" >nul 2>&1

REM También buscar por puerto 3000 (puerto por defecto)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo Servidor detenido.
pause 