# Guía para Desplegar la API

## 📋 Requisitos Previos

### Software Requerido
- **Node.js** 18.x o superior
- **Nginx** (para SSL/HTTPS)
- **Git** (para clonar el repositorio)
- **Certificados SSL** válidos (para producción)

### Acceso a Redes
- **Acceso a Themis DICAPI**: `http://10.202.18.7:8081/uda`
- **Acceso a Themis Francia**: `https://themis-clsperu.cls.fr/uda`
- **Puertos disponibles**: 6002 (HTTP), 4443 (HTTPS)

### Permisos del Sistema
- **Permisos de escritura** en la carpeta del proyecto
- **Permisos de administrador** para configurar servicios
- **Acceso al firewall** para abrir puertos necesarios

## 🚀 Instalación Inicial

### 1. Clonar el Repositorio
```bash
git clone <url-del-repositorio>
cd APIDICAPI
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Compilar el Proyecto
```bash
npm run build
```

### 4. Verificar la Instalación
```bash
# Verificar que Node.js esté instalado
node --version

# Verificar que npm esté disponible
npm --version

# Verificar que TypeScript esté instalado
npx tsc --version
```

## ⚙️ Configuración de Entornos

Para configurar las variables de entorno, consulta la **[documentación de configuración](configuracion.md)**.

### Validación de Configuración

#### Verificar Variables de Entorno
```bash
# Verificar que todas las variables estén definidas
node -e "
const config = require('./dist/config/env.config.js');
console.log('Configuración cargada:', {
  nodeEnv: config.config.nodeEnv,
  port: config.config.port,
  isProd: config.config.isProd,
  themisUrl: config.config.themisDicapi.url
});
"
```

## 🔒 Configuración SSL/HTTPS

### Requisitos SSL
- **Certificados SSL** válidos (certificate.crt y private.key)
- **Nginx** instalado y en el PATH del sistema
- **Puerto 4443** disponible para HTTPS

### Configuración de Certificados

#### 1. Preparar Certificados
```bash
# Crear carpeta SSL si no existe
mkdir -p ssl/

# Copiar certificados a la carpeta ssl/
cp /path/to/certificate.crt ssl/
cp /path/to/private.key ssl/
```

#### 2. Verificar Certificados
```bash
# Verificar certificado
openssl x509 -in ssl/certificate.crt -text -noout

# Verificar clave privada
openssl rsa -in ssl/private.key -check
```

#### 3. Configurar Nginx
```nginx
# Archivo: nginx/nginx.conf
server {
    listen 4443 ssl;
    server_name localhost;
    
    ssl_certificate /path/to/APIDICAPI/ssl/certificate.crt;
    ssl_certificate_key /path/to/APIDICAPI/ssl/private.key;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # Headers de seguridad
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    
    location / {
        proxy_pass http://localhost:6002;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }
}
```

### Scripts de Configuración SSL

#### Configuración Automática
```bash
# Ejecutar script de configuración SSL
scripts/setup-ssl.bat
```

#### Verificación SSL
```bash
# Verificar que Nginx esté funcionando
nginx -t

# Verificar puertos SSL
netstat -an | findstr :4443

# Probar conexión HTTPS
curl -k https://localhost:4443/api/v1/records/last-hour
```

## 🚀 Despliegue por Entornos

### Desarrollo

#### 1. Configurar Entorno de Desarrollo
```bash
# Crear archivo .env
cp .env.example .env

# Editar variables de entorno
notepad .env
```

#### 2. Iniciar en Modo Desarrollo
```bash
# Inicio con hot reload
npm run dev

# Verificar que esté funcionando
curl http://localhost:6002/api/v1/records/last-hour
```

#### 3. Verificar Logs
```bash
# Ver logs en tiempo real
tail -f logs/combined-$(date +%Y-%m-%d).log
```

### Producción

#### 1. Preparar Entorno de Producción
```bash
# Compilar para producción
npm run build

# Verificar archivos compilados
ls -la dist/
```

#### 2. Configurar Variables de Producción
```bash
# Crear archivo .env.production
cp .env.example .env.production

# Editar con valores de producción
notepad .env.production
```

#### 3. Iniciar Sistema Completo
```bash
# Inicio con SSL
scripts/start-ssl-system.bat

# O inicio básico
scripts/start.bat
```

#### 4. Verificar Despliegue
```bash
# Verificar procesos
tasklist | findstr node
tasklist | findstr nginx

# Verificar puertos
netstat -an | findstr :6002
netstat -an | findstr :4443

# Probar endpoints
curl -H "Authorization: Bearer tu_token" https://localhost:4443/api/v1/records/last-hour
```

### Pruebas

#### 1. Configurar Entorno de Pruebas
```bash
# Crear archivo .env.test
cp .env.example .env.test

# Editar variables de pruebas
notepad .env.test
```

#### 2. Iniciar en Modo Pruebas
```bash
# Inicio en modo pruebas
npm run test

# Verificar en puerto 6003
curl http://localhost:6003/api/v1/records/last-hour
```

## 📦 Scripts de Despliegue

### Scripts Disponibles

#### Scripts Básicos
```bash
# Inicio del sistema completo
scripts/start.bat

# Parada del sistema
scripts/stop.bat

# Inicio con SSL/HTTPS
scripts/start-ssl-system.bat

# Parada del sistema SSL
scripts/stop-ssl-system.bat
```

#### Scripts de Componentes
```bash
# Solo servicio Node.js
scripts/start-service.bat

# Solo Nginx
scripts/start-nginx.bat

# Inicio en segundo plano
scripts/start-background.bat
```

#### Scripts de Configuración
```bash
# Configuración SSL
scripts/setup-ssl.bat

# Verificación de servicios
scripts/verify-services.bat
```

### Scripts Personalizados

#### Crear Script de Despliegue Automático
```batch
@echo off
REM deploy.bat - Script de despliegue automático

echo Iniciando despliegue de APIDICAPI...

REM Detener servicios existentes
call scripts\stop.bat

REM Compilar proyecto
echo Compilando proyecto...
npm run build

REM Verificar compilación
if not exist "dist\index.js" (
    echo Error: Compilación fallida
    exit /b 1
)

REM Iniciar servicios
echo Iniciando servicios...
call scripts\start-ssl-system.bat

REM Verificar servicios
timeout /t 5 /nobreak > nul
call scripts\verify-services.bat

echo Despliegue completado exitosamente!
```

## 🔧 Configuración de Servicios

### Configuración como Servicio de Windows

#### 1. Instalar PM2 (Opcional)
```bash
npm install -g pm2

# Crear archivo de configuración PM2
pm2 ecosystem
```

#### 2. Configuración PM2
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'APIDICAPI',
    script: 'dist/index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'prod'
    },
    env_production: {
      NODE_ENV: 'prod'
    }
  }]
};
```

#### 3. Iniciar con PM2
```bash
# Inicio en producción
pm2 start ecosystem.config.js --env production

# Verificar estado
pm2 status

# Ver logs
pm2 logs APIDICAPI
```

### Configuración de Firewall

#### Puertos Necesarios
```bash
# Puerto HTTP (desarrollo)
netsh advfirewall firewall add rule name="APIDICAPI HTTP" dir=in action=allow protocol=TCP localport=6002

# Puerto HTTPS (producción)
netsh advfirewall firewall add rule name="APIDICAPI HTTPS" dir=in action=allow protocol=TCP localport=4443

# Puerto Nginx (si es diferente)
netsh advfirewall firewall add rule name="Nginx" dir=in action=allow protocol=TCP localport=80
```

## 📊 Monitoreo del Despliegue

### Verificación de Servicios

#### Comandos de Verificación
```bash
# Verificar procesos
tasklist | findstr node
tasklist | findstr nginx

# Verificar puertos
netstat -an | findstr :6002
netstat -an | findstr :4443

# Verificar logs
dir logs\*.log
```

#### Script de Verificación Automática
```batch
@echo off
REM verify-services.bat

echo Verificando servicios APIDICAPI...

REM Verificar Node.js
tasklist | findstr node > nul
if %errorlevel% neq 0 (
    echo ERROR: Servicio Node.js no está ejecutándose
    exit /b 1
)

REM Verificar Nginx
tasklist | findstr nginx > nul
if %errorlevel% neq 0 (
    echo ERROR: Servicio Nginx no está ejecutándose
    exit /b 1
)

REM Verificar puertos
netstat -an | findstr :6002 > nul
if %errorlevel% neq 0 (
    echo ERROR: Puerto 6002 no está abierto
    exit /b 1
)

netstat -an | findstr :4443 > nul
if %errorlevel% neq 0 (
    echo ERROR: Puerto 4443 no está abierto
    exit /b 1
)

echo Todos los servicios están funcionando correctamente!
```

### Logs de Despliegue

#### Archivos de Log Importantes
```bash
# Logs de la aplicación
logs/combined-YYYY-MM-DD.log
logs/error-YYYY-MM-DD.log

# Logs de consultas de clientes
logs/client-queries-YYYY-MM-DD.log

# Logs de Nginx
logs/nginx-access.log
logs/nginx-error.log
```

#### Monitoreo en Tiempo Real
```bash
# Logs generales
tail -f logs/combined-$(date +%Y-%m-%d).log

# Logs de errores
tail -f logs/error-$(date +%Y-%m-%d).log

# Logs de Nginx
tail -f logs/nginx-access.log
```

## 🔄 Actualizaciones y Mantenimiento

### Proceso de Actualización

#### 1. Preparar Actualización
```bash
# Hacer backup de configuración
cp .env.production .env.production.backup
cp -r logs/ logs-backup/

# Obtener cambios del repositorio
git pull origin main
```

#### 2. Actualizar Dependencias
```bash
# Instalar nuevas dependencias
npm install

# Compilar proyecto
npm run build
```

#### 3. Reiniciar Servicios
```bash
# Parar servicios
scripts/stop.bat

# Iniciar servicios
scripts/start-ssl-system.bat

# Verificar funcionamiento
scripts/verify-services.bat
```

### Mantenimiento Programado

#### Limpieza de Logs
```bash
# Script de limpieza de logs antiguos
forfiles /p logs /s /m *.log /d -30 /c "cmd /c del @path"
```

#### Rotación de Certificados
```bash
# Verificar expiración de certificados
openssl x509 -in ssl/certificate.crt -noout -dates

# Renovar certificados antes de expirar
# Copiar nuevos certificados y reiniciar Nginx
```

## 🚨 Troubleshooting de Despliegue

### Problemas Comunes

#### 1. Error de Puerto en Uso
```
Error: listen EADDRINUSE: address already in use :::6002
```
**Solución:**
```bash
# Encontrar proceso usando el puerto
netstat -ano | findstr :6002

# Terminar proceso
taskkill /PID <PID> /F
```

#### 2. Error de Certificados SSL
```
nginx: [emerg] SSL_CTX_use_PrivateKey_file failed
```
**Solución:**
```bash
# Verificar permisos de archivos
ls -la ssl/

# Verificar formato de certificados
openssl x509 -in ssl/certificate.crt -text -noout
```

#### 3. Error de Variables de Entorno
```
Error: ThemisDICAPI credentials not configured
```
**Solución:**
```bash
# Verificar archivo .env
cat .env

# Verificar que NODE_ENV esté configurado
echo $NODE_ENV
```

#### 4. Error de Conectividad a Themis
```
Error: API request error: Connection timeout
```
**Solución:**
```bash
# Verificar conectividad de red
ping 10.202.18.7

# Verificar puerto
telnet 10.202.18.7 8081

# Verificar configuración de proxy si aplica
```

### Logs para Debugging

#### Comandos de Debugging
```bash
# Ver logs de inicio
tail -f logs/combined-$(date +%Y-%m-%d).log

# Ver errores específicos
grep -i error logs/error-$(date +%Y-%m-%d).log

# Ver logs de Nginx
tail -f logs/nginx-error.log
```

#### Verificación de Configuración
```bash
# Verificar configuración de Nginx
nginx -t

# Verificar variables de entorno
node -e "console.log(process.env.NODE_ENV)"

# Verificar archivos de configuración
ls -la .env*
```

## 📞 Soporte de Despliegue

### Contacto para Problemas
- **Email**: soporte@clsperu.com
- **Documentación**: `/docs/`
- **Issues**: GitHub Issues

### Información para Soporte
Al reportar problemas, incluir:
- **Versión de Node.js**: `node --version`
- **Sistema operativo**: `systeminfo`
- **Logs de error**: Archivos relevantes
- **Configuración**: Variables de entorno (sin credenciales)
- **Pasos para reproducir**: Comandos ejecutados

### Documentación Relacionada
- **[Configuración](configuracion.md)** - Variables de entorno y configuración detallada
- **[Arquitectura](arquitectura.md)** - Detalles técnicos del sistema
- **[Endpoints](endpoints.md)** - Documentación completa de endpoints

---

*Guía de Despliegue - APIDICAPI v1.0.0*
