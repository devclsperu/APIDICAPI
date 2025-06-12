@echo off
echo Iniciando APIDICAPI en segundo plano...
echo.

REM Verificar si existe node_modules
if not exist "node_modules" (
    echo Instalando dependencias...
    npm install >nul 2>&1
    if errorlevel 1 (
        echo Error al instalar dependencias
        pause
        exit /b 1
    )
)

REM Verificar si existe dist
if not exist "dist" (
    echo Compilando TypeScript...
    npm run build >nul 2>&1
    if errorlevel 1 (
        echo Error al compilar
        pause
        exit /b 1
    )
)

REM Iniciar la aplicación en segundo plano
echo Iniciando servidor en segundo plano...
start /B npm start >nul 2>&1

echo Servidor iniciado en segundo plano.
echo Para detener el servidor, ejecuta: scripts/stop.bat
echo Para ver logs, revisa la carpeta logs/ 