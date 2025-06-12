# APIDICAPI

API simple para consultar registros externos con soporte HTTPS.

## Instalación

```bash
npm install
```

## Compilar

```bash
npm run build
```

## Ejecutar

### Opción 1: Comando directo (con consola)
```bash
npm start
```

### Opción 2: Archivo ejecutable (Windows)
Doble clic en `scripts/start.bat`

### Opción 3: Ejecutar en segundo plano (Windows)
Doble clic en `scripts/start-background.bat`
- La aplicación se ejecuta sin mostrar consola
- Para detener: ejecutar `scripts/stop.bat`

### Opción 4: Como servicio de Windows (Recomendado)
Doble clic en `scripts/start-service.bat`
- La aplicación se ejecuta como servicio de Windows
- Se reinicia automáticamente si se cae
- Inicia automáticamente al arrancar Windows
- Comandos PM2:
  - `pm2 status` - Ver estado
  - `pm2 logs apidicapi` - Ver logs
  - `pm2 stop apidicapi` - Detener
  - `pm2 restart apidicapi` - Reiniciar

### Opción 5: Sistema completo con HTTPS (Recomendado para producción)
1. **Configurar certificados SSL**:
   - Doble clic en `scripts/setup-ssl.bat`
   - Coloca tus certificados en `ssl/certificate.crt` y `ssl/private.key`

2. **Iniciar sistema completo**:
   - Doble clic en `scripts/start-ssl-system.bat`
   - Esto inicia tanto la aplicación como Nginx con SSL

3. **Acceso**:
   - **HTTPS**: https://localhost:4443/api/records
   - **HTTP directo**: http://localhost:6002/api/records

4. **Para detener**:
   - Doble clic en `scripts/stop-ssl-system.bat`

## Variables de entorno

Crea un archivo `.env` con:

```env
API_TOKEN=tu_token_aqui
API_LOGIN=tu_login_aqui
API_PASSWORD=tu_password_aqui
EXTERNAL_API_URL=https://themis-clsperu.cls.fr/uda
PORT=6002
```

## Endpoints

- `GET /api/records/last-hour` - Registros de la última hora
- `GET /api/records/all-day` - Registros de todo el día
- `GET /api/records/:id` - Registro por ID
- `GET /api/records/last/:hours` - Registros de las últimas N horas
- `GET /api/records/date-range?from=DD-MM-YYYY_HH:mm:ss&to=DD-MM-YYYY_HH:mm:ss` - Registros por rango de fechas

## Configuración SSL/HTTPS

### Requisitos:
- **Nginx** instalado y en el PATH del sistema
- **Certificados SSL** (certificate.crt y private.key)

### Configuración:
- **Puerto HTTPS**: 4443
- **Puerto aplicación**: 6002
- **Proxy**: Nginx redirige HTTPS:4443 → HTTP:6002

### Características SSL:
- TLS 1.2 y 1.3
- Headers de seguridad (HSTS, X-Frame-Options, etc.)
- Rate limiting en Nginx
- Compresión gzip
- Logs separados para Nginx

## Sistema de Logs

La aplicación genera archivos de log diarios en la carpeta `logs/`:

### Archivos de log diarios:
- `client-queries-YYYY-MM-DD.log` - Consultas de clientes del día
- `combined-YYYY-MM-DD.log` - Logs generales de la aplicación
- `error-YYYY-MM-DD.log` - Errores de la aplicación
- `nginx-access.log` - Logs de acceso de Nginx
- `nginx-error.log` - Logs de error de Nginx

### Formato de logs de clientes:
```json
{
  "timestamp": "2024-01-15T10:30:45.123Z",
  "level": "info",
  "message": "Client Query",
  "endpoint": "/api/records/last-hour",
  "params": {
    "query": {},
    "params": {},
    "method": "GET"
  },
  "responseTime": "150ms",
  "statusCode": 200,
  "clientIP": "192.168.1.100"
}
```

### Información registrada:
- **Endpoint**: URL consultada
- **Parámetros**: Query params y route params
- **Tiempo de respuesta**: En milisegundos
- **Código de estado**: HTTP status code
- **IP del cliente**: Dirección IP del cliente
- **Timestamp**: Fecha y hora exacta 