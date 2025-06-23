@echo off
chcp 65001 >nul

REM Cambiar al directorio raíz del proyecto
cd /d "%~dp0.."

echo ========================================
echo    REINICIANDO APIDICAPI
echo ========================================

REM Verificar si estamos en el directorio correcto
if not exist "package.json" (
    echo Error: No se encontró package.json. Asegúrate de estar en el directorio raíz del proyecto.
    pause
    exit /b 1
)

REM Verificar si el directorio dist existe
echo Verificando archivos compilados...
if not exist "dist" (
    echo El directorio dist no existe. Ejecutando build...
    call npm run build
    if errorlevel 1 (
        echo Error al compilar el proyecto
        pause
        exit /b 1
    )
)

REM Verificar si el archivo principal existe
if not exist "dist\index.js" (
    echo Error: No se encontró dist\index.js. Ejecutando build...
    call npm run build
    if errorlevel 1 (
        echo Error al compilar el proyecto
        pause
        exit /b 1
    )
)

REM Crear directorio de logs si no existe
if not exist "logs" (
    echo Creando directorio de logs...
    mkdir logs
)

echo Reiniciando la aplicación con PM2...
call pm2 restart apidicapi >nul 2>&1
if errorlevel 1 (
    echo La aplicación no estaba ejecutándose. Iniciando con PM2...
    call pm2 start ecosystem.config.js --env production
)

REM Esperar un momento y verificar el estado
timeout /t 3 /nobreak >nul
echo.
echo Verificando estado de la aplicación...
pm2 status

echo.
echo ========================================
echo    APLICACION REINICIADA EXITOSAMENTE
echo ========================================
echo.
echo Comandos útiles:
echo - Ver estado: npm run status
echo - Ver logs: npm run logs
echo - Detener: scripts\stop.bat
echo - Iniciar: scripts\start.bat
echo.
pause 