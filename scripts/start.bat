@echo off
echo Iniciando APIDICAPI...
echo.

REM Verificar si existe node_modules
if not exist "node_modules" (
    echo Instalando dependencias...
    npm install
    if errorlevel 1 (
        echo Error al instalar dependencias
        pause
        exit /b 1
    )
)

REM Verificar si existe dist
if not exist "dist" (
    echo Compilando TypeScript...
    npm run build
    if errorlevel 1 (
        echo Error al compilar
        pause
        exit /b 1
    )
)

REM Iniciar la aplicación
echo Iniciando servidor...
npm start

pause 