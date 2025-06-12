@echo off
echo Configurando SSL para APIDICAPI...
echo.

REM Crear directorio ssl si no existe
if not exist "ssl" (
    echo Creando directorio ssl...
    mkdir ssl
)

REM Crear directorio logs para nginx si no existe
if not exist "logs" (
    echo Creando directorio logs...
    mkdir logs
)

echo.
echo ========================================
echo CONFIGURACIÓN DE CERTIFICADOS SSL
echo ========================================
echo.
echo Coloca tus certificados SSL en la carpeta ssl/:
echo.
echo 1. certificate.crt - Tu certificado público
echo 2. private.key - Tu clave privada
echo.
echo Ubicación esperada:
echo - ssl/certificate.crt
echo - ssl/private.key
echo.

REM Verificar si existen los certificados
if not exist "ssl\certificate.crt" (
    echo [ADVERTENCIA] No se encontró ssl/certificate.crt
    echo Por favor, coloca tu certificado público en ssl/certificate.crt
)

if not exist "ssl\private.key" (
    echo [ADVERTENCIA] No se encontró ssl/private.key
    echo Por favor, coloca tu clave privada en ssl/private.key
)

if exist "ssl\certificate.crt" if exist "ssl\private.key" (
    echo [ÉXITO] Certificados SSL encontrados
    echo.
    echo Configuración completada:
    echo - HTTPS: https://localhost:4443
    echo - Proxy a: http://localhost:6002
    echo.
    echo Para iniciar Nginx con SSL:
    echo 1. Ejecuta: scripts/start-nginx.bat
    echo 2. Ejecuta: scripts/start-service.bat (para la aplicación)
) else (
    echo [ERROR] Faltan certificados SSL
    echo Por favor, coloca los certificados y ejecuta este script nuevamente
)

echo.
pause 