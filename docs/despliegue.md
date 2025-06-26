# Guía para Desplegar la API

## 📋 Requisitos Previos

### Software Requerido
- **Node.js** 18.x o superior
- **Nginx** 1.27.5 (incluido en el proyecto)
- **Git** (para clonar el repositorio)
- **Certificados SSL** válidos (para producción)
- **PM2** (opcional, para gestión de procesos)

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

# Verificar que Nginx esté disponible
./nginx-1.27.5/nginx.exe -v
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

## 🔒 Configuración SSL/HTTPS con Nginx

### Requisitos SSL
- **Certificados SSL** válidos (certificate.crt y private.key)
- **Nginx** incluido en el proyecto (nginx-1.27.5/)
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
# Archivo: nginx-1.27.5/conf/nginx.conf
server {
    listen 4443 ssl;
    server_name localhost;
    
    # Certificados SSL
    ssl_certificate /path/to/APIDICAPI/ssl/certificate.crt;
    ssl_certificate_key /path/to/APIDICAPI/ssl/private.key;
    
    # Configuración SSL
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # Headers de seguridad
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Compresión
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Proxy a la aplicación Node.js
    location / {
        proxy_pass http://localhost:6002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }
    
    # Redirección HTTP a HTTPS
    server {
        listen 80;
        server_name localhost;
        return 301 https://$server_name$request_uri;
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
./nginx-1.27.5/nginx.exe -t

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
tail -f logs/combined.log
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

#### 3. Configurar PM2 (Opcional)
```bash
# Instalar PM2 globalmente
npm install -g pm2

# Configurar PM2
pm2 start ecosystem.config.js

# Verificar estado
pm2 status
pm2 logs APIDICAPI
```

## 🛠️ Scripts de Gestión

### Scripts Incluidos

#### 1. Inicio del Sistema
```bash
# Ejecutar script de inicio
scripts/start.bat
```

Este script:
- Inicia Nginx como proxy reverso
- Inicia la aplicación Node.js
- Verifica que ambos servicios estén funcionando

#### 2. Parada del Sistema
```bash
# Ejecutar script de parada
scripts/stop.bat
```

Este script:
- Detiene la aplicación Node.js
- Detiene Nginx
- Limpia procesos residuales

#### 3. Reinicio del Sistema
```bash
# Ejecutar script de reinicio
scripts/restart.bat
```

Este script:
- Ejecuta stop.bat
- Espera 5 segundos
- Ejecuta start.bat

### Gestión Manual

#### Iniciar Nginx
```bash
# Iniciar Nginx
./nginx-1.27.5/nginx.exe

# Verificar estado
./nginx-1.27.5/nginx.exe -t
```

#### Iniciar Aplicación Node.js
```bash
# Iniciar en modo producción
npm start

# O con PM2
pm2 start ecosystem.config.js
```

#### Verificar Servicios
```bash
# Verificar puertos
netstat -an | findstr :6002
netstat -an | findstr :4443

# Verificar procesos
tasklist | findstr nginx
tasklist | findstr node
```

## 📊 Monitoreo y Logs

### Estructura de Logs

```
APIDICAPI/
├── logs/
│   ├── combined.log          # Logs generales
│   ├── error.log             # Solo errores
│   ├── client-queries.log    # Consultas de clientes
│   └── nginx/                # Logs de Nginx
│       ├── access.log        # Acceso a Nginx
│       └── error.log         # Errores de Nginx
```

### Comandos de Monitoreo

#### Ver Logs en Tiempo Real
```bash
# Logs de la aplicación
tail -f logs/combined.log

# Logs de errores
tail -f logs/error.log

# Logs de consultas de clientes
tail -f logs/client-queries.log

# Logs de Nginx
tail -f logs/nginx/access.log
```

#### Verificar Estado del Sistema
```bash
# Verificar memoria y CPU
tasklist /FI "IMAGENAME eq node.exe"
tasklist /FI "IMAGENAME eq nginx.exe"

# Verificar puertos
netstat -an | findstr :6002
netstat -an | findstr :4443
```

## 🔧 Configuración de Firewall

### Puertos Requeridos

| Puerto | Protocolo | Servicio | Descripción |
|--------|-----------|----------|-------------|
| 6002 | TCP | HTTP | Aplicación Node.js |
| 4443 | TCP | HTTPS | Nginx SSL |
| 80 | TCP | HTTP | Redirección a HTTPS |

### Configuración de Windows Firewall
```powershell
# Abrir puerto 6002
netsh advfirewall firewall add rule name="APIDICAPI HTTP" dir=in action=allow protocol=TCP localport=6002

# Abrir puerto 4443
netsh advfirewall firewall add rule name="APIDICAPI HTTPS" dir=in action=allow protocol=TCP localport=4443

# Abrir puerto 80 (redirección)
netsh advfirewall firewall add rule name="APIDICAPI HTTP Redirect" dir=in action=allow protocol=TCP localport=80
```

## 🚨 Troubleshooting

### Problemas Comunes

#### 1. Puerto 6002 en Uso
```bash
# Verificar qué proceso usa el puerto
netstat -ano | findstr :6002

# Terminar proceso si es necesario
taskkill /PID <PID> /F
```

#### 2. Puerto 4443 en Uso
```bash
# Verificar qué proceso usa el puerto
netstat -ano | findstr :4443

# Terminar proceso si es necesario
taskkill /PID <PID> /F
```

#### 3. Nginx No Inicia
```bash
# Verificar configuración
./nginx-1.27.5/nginx.exe -t

# Verificar logs de error
tail -f logs/nginx/error.log
```

#### 4. Aplicación Node.js No Inicia
```bash
# Verificar variables de entorno
node -e "console.log(process.env.NODE_ENV)"

# Verificar logs de error
tail -f logs/error.log
```

### Verificación de Funcionamiento

#### 1. Probar Endpoint HTTP
```bash
curl -X GET "http://localhost:6002/api/v1/records/last-hour" \
  -H "Authorization: Bearer tu_token_aqui"
```

#### 2. Probar Endpoint HTTPS
```bash
curl -X GET "https://localhost:4443/api/v1/records/last-hour" \
  -H "Authorization: Bearer tu_token_aqui"
```

#### 3. Verificar SSL
```bash
# Verificar certificado
openssl s_client -connect localhost:4443 -servername localhost

# Verificar headers de seguridad
curl -I https://localhost:4443/api/v1/records/last-hour
```

## 📈 Optimización de Rendimiento

### Configuración de Nginx

#### Optimización de Buffer
```nginx
# Agregar a la configuración de Nginx
client_body_buffer_size 128k;
client_max_body_size 10m;
client_header_buffer_size 1k;
large_client_header_buffers 4 4k;
```

#### Optimización de Proxy
```nginx
# Agregar a la configuración de location
proxy_buffering on;
proxy_buffer_size 4k;
proxy_buffers 8 4k;
proxy_busy_buffers_size 8k;
```

### Configuración de Node.js

#### Optimización de Memoria
```bash
# Iniciar con más memoria
node --max-old-space-size=2048 dist/index.js

# O con PM2
pm2 start ecosystem.config.js --node-args="--max-old-space-size=2048"
```

#### Optimización de Logs
```typescript
// Configurar nivel de log en producción
const logLevel = process.env.NODE_ENV === 'production' ? 'warn' : 'info';
```

## 🔄 Actualizaciones

### Proceso de Actualización

#### 1. Preparar Actualización
```bash
# Hacer backup de configuración
cp .env .env.backup
cp nginx-1.27.5/conf/nginx.conf nginx-1.27.5/conf/nginx.conf.backup
```

#### 2. Actualizar Código
```bash
# Obtener cambios
git pull origin main

# Instalar dependencias
npm install

# Compilar
npm run build
```

#### 3. Reiniciar Servicios
```bash
# Reiniciar sistema
scripts/restart.bat

# Verificar funcionamiento
curl https://localhost:4443/api/v1/records/last-hour
```

---

*Guía de Despliegue Actualizada - APIDICAPI v1.1.0*
