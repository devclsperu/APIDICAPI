@echo off
echo Iniciando sistema completo APIDICAPI con SSL...
echo.

REM Verificar certificados SSL
if not exist "ssl\certificate.crt" (
    echo [ERROR] No se encontró ssl/certificate.crt
    echo Ejecuta primero: scripts/setup-ssl.bat
    pause
    exit /b 1
)

if not exist "ssl\private.key" (
    echo [ERROR] No se encontró ssl/private.key
    echo Ejecuta primero: scripts/setup-ssl.bat
    pause
    exit /b 1
)

echo [1/3] Iniciando aplicación Node.js...
call scripts\start-service.bat

echo.
echo [2/3] Iniciando Nginx con SSL...
call scripts\start-nginx.bat

echo.
echo [3/3] Verificando servicios...
timeout /t 3 >nul

REM Verificar que la aplicación esté ejecutándose
pm2 status | find "apidicapi" >nul
if errorlevel 1 (
    echo [ERROR] La aplicación no está ejecutándose
) else (
    echo [ÉXITO] Aplicación ejecutándose en puerto 6002
)

REM Verificar que Nginx esté ejecutándose
tasklist /FI "IMAGENAME eq nginx.exe" 2>NUL | find /I /N "nginx.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo [ÉXITO] Nginx ejecutándose en puerto 4443
) else (
    echo [ERROR] Nginx no está ejecutándose
)

echo.
echo ========================================
echo SISTEMA INICIADO COMPLETAMENTE
echo ========================================
echo.
echo Acceso a la API:
echo - HTTPS: https://localhost:4443/api/records
echo - HTTP (directo): http://localhost:6002/api/records
echo.
echo Endpoints disponibles:
echo - https://localhost:4443/api/records/last-hour
echo - https://localhost:4443/api/records/all-day
echo - https://localhost:4443/api/records/:id
echo - https://localhost:4443/api/records/last/:hours
echo - https://localhost:4443/api/records/date-range
echo.
echo Para detener todo:
echo - scripts/stop-ssl-system.bat
echo.
pause 