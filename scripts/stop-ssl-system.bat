@echo off
echo Deteniendo sistema completo APIDICAPI con SSL...
echo.

echo [1/2] Deteniendo aplicación Node.js...
pm2 stop apidicapi >nul 2>&1
pm2 delete apidicapi >nul 2>&1
echo [ÉXITO] Aplicación detenida

echo.
echo [2/2] Deteniendo Nginx...
nginx -s stop >nul 2>&1
timeout /t 2 >nul

REM Verificar que Nginx se haya detenido
tasklist /FI "IMAGENAME eq nginx.exe" 2>NUL | find /I /N "nginx.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo [ADVERTENCIA] Nginx aún está ejecutándose, forzando cierre...
    taskkill /F /IM nginx.exe >nul 2>&1
) else (
    echo [ÉXITO] Nginx detenido
)

echo.
echo ========================================
echo SISTEMA DETENIDO COMPLETAMENTE
echo ========================================
echo.
echo Para reiniciar el sistema:
echo - scripts/start-ssl-system.bat
echo.
pause 