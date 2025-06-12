@echo off
echo Instalando APIDICAPI como servicio de Windows...
echo.

REM Verificar si existe node_modules
if not exist "node_modules" (
    echo Instalando dependencias...
    npm install >nul 2>&1
)

REM Verificar si existe dist
if not exist "dist" (
    echo Compilando TypeScript...
    npm run build >nul 2>&1
)

REM Verificar si PM2 está instalado
pm2 --version >nul 2>&1
if errorlevel 1 (
    echo Instalando PM2...
    npm install -g pm2 >nul 2>&1
)

REM Crear configuración de PM2
echo Creando configuración de PM2...
(
echo module.exports = {
echo   apps: [{
echo     name: 'apidicapi',
echo     script: './dist/index.js',
echo     instances: 1,
echo     exec_mode: 'fork',
echo     env: {
echo       NODE_ENV: 'production',
echo       PORT: 6002
echo     },
echo     error_file: './logs/pm2-error.log',
echo     out_file: './logs/pm2-out.log',
echo     log_file: './logs/pm2-combined.log',
echo     time: true,
echo     autorestart: true,
echo     max_restarts: 10,
echo     min_uptime: '10s'
echo   }]
echo };
) > ecosystem.config.js

REM Iniciar con PM2
echo Iniciando servicio...
pm2 start ecosystem.config.js >nul 2>&1

REM Configurar para inicio automático
pm2 save >nul 2>&1
pm2 startup >nul 2>&1

echo Servicio iniciado correctamente.
echo.
echo Configuración:
echo - Aplicación: http://localhost:6002
echo - HTTPS (con Nginx): https://localhost:4443
echo.
echo Para ver estado: pm2 status
echo Para ver logs: pm2 logs apidicapi
echo Para detener: pm2 stop apidicapi
echo Para reiniciar: pm2 restart apidicapi
pause 