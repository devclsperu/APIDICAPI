@echo off
chcp 65001 >nul

REM Cambiar al directorio raíz del proyecto
cd /d "%~dp0.."

echo ========================================
echo    DETENIENDO APIDICAPI
echo ========================================

REM Verificar si estamos en el directorio correcto
if not exist "package.json" (
    echo Error: No se encontró package.json. Asegúrate de estar en el directorio raíz del proyecto.
    pause
    exit /b 1
)

REM Detener la aplicación
echo Deteniendo la aplicación...
call pm2 stop apidicapi >nul 2>&1
call pm2 delete apidicapi >nul 2>&1

REM Verificar el estado
echo.
echo Verificando estado de la aplicación...
pm2 status

echo.
echo ========================================
echo    APLICACION DETENIDA EXITOSAMENTE
echo ========================================
echo.
echo Comandos útiles:
echo - Ver estado: npm run status
echo - Ver logs: npm run logs
echo - Iniciar: scripts\start.bat
echo - Reiniciar: scripts\restart.bat
echo.
pause 