@echo off
echo Iniciando Nginx con SSL para APIDICAPI...
echo.

REM Verificar si Nginx está instalado
nginx -v >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Nginx no está instalado o no está en el PATH
    echo Por favor, instala Nginx y agrégalo al PATH del sistema
    echo.
    echo Descarga Nginx desde: http://nginx.org/en/download.html
    pause
    exit /b 1
)

REM Verificar si existen los certificados
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

REM Verificar si Nginx ya está ejecutándose
tasklist /FI "IMAGENAME eq nginx.exe" 2>NUL | find /I /N "nginx.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo Deteniendo Nginx existente...
    nginx -s stop
    timeout /t 2 >nul
)

REM Crear directorio logs si no existe
if not exist "logs" mkdir logs

REM Iniciar Nginx con la configuración personalizada
echo Iniciando Nginx...
nginx -c "%~dp0..\nginx\nginx.conf" -p "%~dp0.."

if errorlevel 1 (
    echo [ERROR] Error al iniciar Nginx
    echo Verifica la configuración en nginx/nginx.conf
    pause
    exit /b 1
)

echo.
echo [ÉXITO] Nginx iniciado correctamente
echo.
echo Configuración:
echo - HTTPS: https://localhost:4443
echo - Proxy a: http://localhost:6002
echo.
echo Para verificar el estado:
echo - nginx -t (verificar configuración)
echo - nginx -s reload (recargar configuración)
echo - nginx -s stop (detener Nginx)
echo.
echo Logs de Nginx:
echo - logs/nginx-access.log
echo - logs/nginx-error.log
echo.
pause 