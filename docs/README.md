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

### Desarrollo (con hot reload)
```bash
npm run dev
```
- Usa archivo: `.env`
- NODE_ENV: `dev`
- Puerto por defecto: 6002

### Producción
```bash
npm run build
npm start
```
- Usa archivo: `.env.production`
- NODE_ENV: `prod`
- Puerto por defecto: 6002

### Pruebas
```bash
npm run test
```
- Usa archivo: `.env.test`
- NODE_ENV: `test`
- Puerto por defecto: 6003

## Variables de entorno

### Desarrollo (`.env`)
```env
NODE_ENV=dev
API_TOKEN=tu_token_desarrollo
PORT=6002

# Configuración para themisFrancia (API original)
THEMIS_FRANCIA_URL=https://themis-clsperu.cls.fr/uda
THEMIS_FRANCIA_LOGIN=tu_login_francia
THEMIS_FRANCIA_PASSWORD=tu_password_francia

# Configuración para themisDICAPI (nueva API)
THEMIS_DICAPI_URL=http://10.202.18.7:8081/uda
THEMIS_DICAPI_LOGIN=OPERADORCLS
THEMIS_DICAPI_PASSWORD=OpCLS2022!
```

### Producción (`.env.production`)
```env
NODE_ENV=prod
API_TOKEN=tu_token_produccion
PORT=6002

# Configuración para themisFrancia (API original)
THEMIS_FRANCIA_URL=https://themis-clsperu.cls.fr/uda
THEMIS_FRANCIA_LOGIN=tu_login_francia_prod
THEMIS_FRANCIA_PASSWORD=tu_password_francia_prod

# Configuración para themisDICAPI (nueva API)
THEMIS_DICAPI_URL=http://10.202.18.7:8081/uda
THEMIS_DICAPI_LOGIN=OPERADORCLS
THEMIS_DICAPI_PASSWORD=OpCLS2022!
```

### Pruebas (`.env.test`)
```env
NODE_ENV=test
API_TOKEN=tu_token_pruebas
PORT=6003

# Configuración para themisFrancia (API original)
THEMIS_FRANCIA_URL=https://themis-clsperu.cls.fr/uda
THEMIS_FRANCIA_LOGIN=tu_login_francia_test
THEMIS_FRANCIA_PASSWORD=tu_password_francia_test

# Configuración para themisDICAPI (nueva API)
THEMIS_DICAPI_URL=http://10.202.18.7:8081/uda
THEMIS_DICAPI_LOGIN=OPERADORCLS
THEMIS_DICAPI_PASSWORD=OpCLS2022!
```

## Endpoints

- `GET /api/v1/records/last-hour` - Registros de la última hora
- `GET /api/v1/records/all-day` - Registros de todo el día
- `GET /api/v1/records/:id` - Registro por ID
- `GET /api/v1/records/last/:hours` - Registros de las últimas N horas
- `GET /api/v1/records/date-range?date=DD-MM-YYYY` - Registros por fecha específica

## Configuración de Timeouts y Reintentos

La API utiliza **axios-retry** para manejar automáticamente los fallos temporales de red y del servidor externo.

### Configuración actual:

```typescript
// Timeout de peticiones
timeout: 30000, // 30 segundos

// Configuración de reintentos
retries: 3, // Número máximo de reintentos
retryDelay: (retryCount) => {
    // Backoff exponencial: 1s, 2s, 4s
    return Math.min(1000 * Math.pow(2, retryCount - 1), 10000);
},
retryCondition: (error) => {
    // Reintentar solo en:
    return (
        !error.response || // Errores de red
        error.code === 'ECONNABORTED' || // Timeouts
        (error.response && error.response.status >= 500) // Errores del servidor (5xx)
    );
}
```

### Comportamiento de reintentos:

1. **Primer intento**: Petición inicial
2. **Reintento 1**: Después de 1 segundo (si falla)
3. **Reintento 2**: Después de 2 segundos (si falla)
4. **Reintento 3**: Después de 4 segundos (si falla)
5. **Fallback**: Si todos fallan, se devuelve error

### Condiciones de reintento:

- ✅ **Errores de red**: Sin respuesta del servidor
- ✅ **Timeouts**: Petición excede 30 segundos
- ✅ **Errores 5xx**: Errores internos del servidor
- ❌ **Errores 4xx**: No se reintenta (errores del cliente)
- ❌ **Errores de validación**: No se reintenta

### Logging de reintentos:

```json
{
  "timestamp": "2024-01-15T10:30:45.123Z",
  "level": "info",
  "message": "Retry attempt 2 for https://themis-clsperu.cls.fr/uda/resources/positions"
}
```

### Beneficios:

- **Mayor robustez**: Manejo automático de fallos temporales
- **Mejor experiencia**: Menos errores por problemas de red
- **Logging detallado**: Seguimiento completo de reintentos
- **Configuración flexible**: Fácil ajuste de timeouts y reintentos

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
  "endpoint": "/api/v1/records/last-hour",
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

## **5. Comandos para ejecutar:**

```bash
# Instalar cross-env
npm install --save-dev cross-env

# Desarrollo
npm run dev        # Usa .env

# Producción
npm run build      # Compila
npm start          # Usa .env.production

# Pruebas
npm run test       # Usa .env.test
```

## **✅ Beneficios de esta configuración:**

1. **✅ Automático**: `npm start` usa `.env.production` sin configuración manual
2. **✅ Compatible**: Funciona en Windows, Linux y macOS
3. **✅ Separado**: Diferentes configuraciones para cada entorno
4. **✅ Claro**: Cada comando usa el archivo correcto
5. **✅ Seguro**: Credenciales separadas por entorno

¿Quieres que proceda con estos cambios? 