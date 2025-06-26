# Guía de Uso - APIDICAPI

Documentación técnica para clientes de la API privada de consulta de registros.

## Información General

- **URL Base**: `https://www.apidicapi.com.pe/api/v1/records`
- **Protocolo**: HTTPS
- **Autenticación**: Bearer Token
- **Formato de respuesta**: JSON
- **Rate Limiting**: Configurado por endpoint

## Autenticación

Todas las peticiones requieren autenticación mediante Bearer Token en el header:

```http
Authorization: Bearer YOUR_API_TOKEN
```

### Ejemplo con cURL:
```bash
curl -H "Authorization: Bearer YOUR_API_TOKEN" \
     https://www.apidicapi.com.pe/api/v1/records/last-hour
```

## Endpoints Disponibles

### 1. Registros de la Última Hora

**Endpoint**: `GET /api/v1/records/last-hour`

**Descripción**: Obtiene todos los registros de la última hora.

**Rate Limit**: 100 peticiones/hora

**Ejemplo de petición**:
```bash
curl -H "Authorization: Bearer YOUR_API_TOKEN" \
     https://www.apidicapi.com.pe/api/v1/records/last-hour
```

**Respuesta exitosa** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "BEACON_001",
      "longitude": -77.123456,
      "latitude": -12.345678,
      "transmissionDateTime": "2024/01/15 10:30:45",
      "course": 180.5,
      "speed": 12.3,
      "mobileName": "EMBARCACION_001",
      "mobileTypeName": "PESQUERO"
    }
  ]
}
```

### 2. Registros de las Últimas N Horas

**Endpoint**: `GET /api/v1/records/last/{hours}`

**Descripción**: Obtiene registros de las últimas N horas (2-24 horas).

**Rate Limit**: 80 peticiones/hora

**Parámetros**:
- `hours` (path): Número de horas (2-24)

**Ejemplo de petición**:
```bash
curl -H "Authorization: Bearer YOUR_API_TOKEN" \
     https://www.apidicapi.com.pe/api/v1/records/last/6
```

### 3. Registros de Todo el Día

**Endpoint**: `GET /api/v1/records/all-day`

**Descripción**: Obtiene todos los registros del día actual (00:00:00 a 23:59:59).

**Rate Limit**: 240 peticiones/hora

**Ejemplo de petición**:
```bash
curl -H "Authorization: Bearer YOUR_API_TOKEN" \
     https://www.apidicapi.com.pe/api/v1/records/all-day
```

### 4. Registros de Día Específico (Optimizado)

**Endpoint**: `GET /api/v1/records/select-day`

**Descripción**: Obtiene todos los registros de una fecha específica dividiendo la consulta en dos partes (mañana y tarde) para mejor rendimiento y evitar límites de registros.

**Rate Limit**: 120 peticiones/hora

**Parámetros**:
- `date` (query): Fecha en formato DD-MM-YYYY

**Ejemplo de petición**:
```bash
curl -H "Authorization: Bearer YOUR_API_TOKEN" \
     "https://www.apidicapi.com.pe/api/v1/records/select-day?date=15-01-2024"
```

**Respuesta exitosa** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "BEACON_001",
      "longitude": -77.123456,
      "latitude": -12.345678,
      "transmissionDateTime": "2024/01/15 10:30:45",
      "course": 180.5,
      "speed": 12.3,
      "mobileName": "EMBARCACION_001",
      "mobileTypeName": "PESQUERO"
    }
  ]
}
```

### 5. Registros por ID Específico

**Endpoint**: `GET /api/v1/records/{id}`

**Descripción**: Obtiene registros de un vehículo/embarcación específico por su ID.

**Rate Limit**: 300 peticiones/hora

**Parámetros**:
- `id` (path): ID del vehículo/beacon

**Ejemplo de petición**:
```bash
curl -H "Authorization: Bearer YOUR_API_TOKEN" \
     https://www.apidicapi.com.pe/api/v1/records/BEACON_001
```

## Estructura de Respuesta

### Respuesta Exitosa
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "longitude": "number",
      "latitude": "number",
      "transmissionDateTime": "string (YYYY/MM/DD HH:MM:SS)",
      "course": "number",
      "speed": "number",
      "mobileName": "string",
      "mobileTypeName": "string"
    }
  ]
}
```

### Respuesta de Error
```json
{
  "success": false,
  "error": "string",
  "details": {
    "message": "string",
    "parameter": "string (opcional)",
    "value": "any (opcional)"
  }
}
```

## Códigos de Estado HTTP

- **200 OK**: Petición exitosa
- **400 Bad Request**: Parámetros inválidos o faltantes
- **401 Unauthorized**: Token de autenticación inválido o faltante
- **404 Not Found**: Endpoint no encontrado
- **413 Payload Too Large**: Límite de registros excedido
- **429 Too Many Requests**: Rate limit excedido
- **500 Internal Server Error**: Error interno del servidor

## Códigos de Error

### Error 413 - Límite de Registros Excedido

**Descripción**: La consulta excede el límite máximo de registros permitidos (150,000).

**Respuesta de error**:
```json
{
  "success": false,
  "error": "Límite de registros excedido",
  "details": {
    "message": "Se han encontrado más de 150000 registros",
    "maxRows": 150000,
    "suggestion": "Intenta usar un rango de fechas más específico o usar /select-day"
  }
}
```

**Soluciones recomendadas**:
- Usar la ruta `/select-day` que divide la consulta en dos partes
- Reducir el rango de tiempo de la consulta
- Usar filtros más específicos
- Consultar por períodos más cortos

### Error 429 - Rate Limit Excedido

**Descripción**: Se ha excedido el límite de peticiones para el endpoint.

**Respuesta de error**:
```json
{
  "success": false,
  "error": "Demasiadas peticiones a [endpoint]",
  "details": {
    "message": "Has excedido el límite de peticiones a [endpoint]. Intenta nuevamente en 1 hora.",
    "limit": 100,
    "windowMs": "1 hora"
  }
}
```

### Error 500 - Error Interno del Servidor

**Descripción**: Error interno en el procesamiento de la solicitud.

**Respuesta de error**:
```json
{
  "success": false,
  "error": "Error al procesar la solicitud",
  "details": "Descripción específica del error"
}
```

## Manejo de Errores

### Errores Comunes y Soluciones

#### 1. Error 401 - Unauthorized
```json
{
  "success": false,
  "error": "Token requerido",
  "details": {
    "message": "Se requiere un Bearer Token para acceder a este endpoint"
  }
}
```
**Solución**: Verificar que el token sea válido y esté incluido en el header.

#### 2. Error 400 - Bad Request
```json
{
  "success": false,
  "error": "Invalid parameter",
  "details": {
    "message": "The hours parameter must be a number between 2 and 24",
    "received": "25"
  }
}
```
**Solución**: Verificar que los parámetros cumplan con las validaciones.

#### 3. Error 429 - Too Many Requests
```json
{
  "success": false,
  "error": "Demasiadas peticiones a last-hour",
  "details": {
    "message": "Has excedido el límite de peticiones a last-hour. Intenta nuevamente en 1 hora.",
    "limit": 100,
    "windowMs": "1 hora"
  }
}
```
**Solución**: Implementar retrasos entre peticiones según los límites por endpoint.

#### 4. Error 404 - Not Found
```json
{
  "success": false,
  "error": "Endpoint not found",
  "details": {
    "message": "The endpoint GET /api/v1/records/invalid does not exist",
    "availableEndpoints": [
      "GET /api/v1/records/last-hour - Get records from the last hour",
      "GET /api/v1/records/last/:hours - Get records from the last N hours (2-24)",
      "GET /api/v1/records/select-day - Get records from a specific day",
      "GET /api/v1/records/all-day - Get all transmissions from the current day",
      "GET /api/v1/records/:id - Get records by specific ID"
    ]
  }
}
```
**Solución**: Verificar que la URL del endpoint sea correcta.

## Rate Limiting por Endpoint

| Endpoint | Rate Limit | Ventana de Tiempo |
|----------|------------|-------------------|
| `/last-hour` | 100 peticiones | 1 hora |
| `/last/:hours` | 80 peticiones | 1 hora |
| `/all-day` | 240 peticiones | 1 hora |
| `/select-day` | 120 peticiones | 1 hora |
| `/:id` | 300 peticiones | 1 hora |

## Mejores Prácticas

### 1. Rate Limiting
- Respetar los límites específicos por endpoint
- Implementar retrasos entre peticiones consecutivas
- Manejar errores 429 con reintentos exponenciales
- Usar diferentes endpoints según la necesidad

### 2. Manejo de Errores
- Siempre verificar el campo `success` en las respuestas
- Implementar reintentos para errores temporales (5xx)
- No reintentar errores de cliente (4xx)
- Manejar específicamente el error 413 con `/select-day`

### 3. Validación de Respuestas
- Verificar que `response.success` sea `true`
- Validar la estructura de `response.data`
- Manejar casos donde `data` esté vacío
- Verificar el formato de fecha en `transmissionDateTime`

### 4. Optimización de Consultas
- Usar `/last-hour` para datos recientes
- Usar `/select-day` para fechas específicas (evita límites)
- Usar `/all-day` para el día actual completo
- Usar `/:id` para consultas específicas por embarcación

## Monitoreo y Logs

La API registra todas las peticiones con la siguiente información:
- Timestamp de la petición
- IP del cliente
- Endpoint consultado
- Parámetros enviados
- Tiempo de respuesta
- Código de estado HTTP
- Rate limiting activado

## Soporte Técnico

Para soporte técnico o reportar problemas:
- **Email**: soporte@clsperu.com
- **Horario**: Lunes a Viernes 8:00 AM - 6:00 PM
- **Respuesta**: Máximo 24 horas hábiles
- **Documentación**: https://www.apidicapi.com.pe/docs

## Changelog

### v1.1.0 (2024-01-20)
- ✅ Nuevo dominio: https://www.apidicapi.com.pe
- ✅ Eliminada ruta `/date-range` (usar `/select-day`)
- ✅ Rate limiting optimizado por endpoint
- ✅ Estructura de respuesta actualizada
- ✅ Documentación mejorada

### v1.0.0 (2024-01-15)
- ✅ Endpoints básicos implementados
- ✅ Autenticación por Bearer Token
- ✅ Rate limiting configurado
- ✅ Logs detallados
- ✅ Manejo de errores mejorado 