# Guía de Uso - APIDICAPI

Documentación técnica para clientes de la API privada de consulta de registros.

## Información General

- **URL Base**: `https://200.60.23.180:4443/api/v1/records`
- **Protocolo**: HTTPS
- **Autenticación**: Bearer Token
- **Formato de respuesta**: JSON
- **Rate Limiting**: 10 requests/segundo

## Autenticación

Todas las peticiones requieren autenticación mediante Bearer Token en el header:

```http
Authorization: Bearer YOUR_API_TOKEN
```

### Ejemplo con cURL:
```bash
curl -H "Authorization: Bearer YOUR_API_TOKEN" \
     https://200.60.23.180:4443/api/v1/records/last-hour
```

## Endpoints Disponibles

### 1. Registros de la Última Hora

**Endpoint**: `GET /api/v1/records/last-hour`

**Descripción**: Obtiene todos los registros de la última hora.

**Ejemplo de petición**:
```bash
curl -H "Authorization: Bearer YOUR_API_TOKEN" \
     https://200.60.23.180:4443/api/v1/records/last-hour
```

**Respuesta exitosa** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "beacon_123",
      "name": "Vehículo ABC-123",
      "type": "Camión",
      "location": {
        "lat": -12.0464,
        "lng": -77.0428
      },
      "speed": 45.5,
      "heading": 180,
      "timestamp": "2024-01-15T10:30:45.123Z"
    }
  ]
}
```

### 2. Registros de Todo el Día

**Endpoint**: `GET /api/v1/records/all-day`

**Descripción**: Obtiene todos los registros del día actual (00:00:00 a 23:59:59).

**Ejemplo de petición**:
```bash
curl -H "Authorization: Bearer YOUR_API_TOKEN" \
     https://200.60.23.180:4443/api/v1/records/all-day
```

### 3. Registros por ID Específico

**Endpoint**: `GET /api/v1/records/{id}`

**Descripción**: Obtiene registros de un vehículo específico por su ID.

**Parámetros**:
- `id` (path): ID del vehículo/beacon

**Ejemplo de petición**:
```bash
curl -H "Authorization: Bearer YOUR_API_TOKEN" \
     https://200.60.23.180:4443/api/v1/records/beacon_123
```

### 4. Registros de las Últimas N Horas

**Endpoint**: `GET /api/v1/records/last/{hours}`

**Descripción**: Obtiene registros de las últimas N horas (2-24 horas).

**Parámetros**:
- `hours` (path): Número de horas (2-24)

**Ejemplo de petición**:
```bash
curl -H "Authorization: Bearer YOUR_API_TOKEN" \
     https://200.60.23.180:4443/api/v1/records/last/6
```

### 5. Registros por Fecha Específica

**Endpoint**: `GET /api/v1/records/date-range?date=DD-MM-YYYY`

**Descripción**: Obtiene registros de una fecha específica.

**Parámetros**:
- `date` (query): Fecha en formato DD-MM-YYYY

**Ejemplo de petición**:
```bash
curl -H "Authorization: Bearer YOUR_API_TOKEN" \
     "https://200.60.23.180:4443/api/v1/records/date-range?date=15-01-2024"
```

## Estructura de Respuesta

### Respuesta Exitosa
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "name": "string",
      "type": "string",
      "location": {
        "lat": "number",
        "lng": "number"
      },
      "speed": "number",
      "heading": "number",
      "timestamp": "string (ISO 8601)"
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
- **429 Too Many Requests**: Rate limit excedido
- **500 Internal Server Error**: Error interno del servidor

## Manejo de Errores

### Errores Comunes y Soluciones

#### 1. Error 401 - Unauthorized
```json
{
  "success": false,
  "error": "Unauthorized",
  "details": {
    "message": "Invalid or missing authentication token"
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
  "error": "Too many requests",
  "details": {
    "message": "Rate limit exceeded. Try again later."
  }
}
```
**Solución**: Implementar retrasos entre peticiones (máximo 10 requests/segundo).

#### 4. Error 404 - Not Found
```json
{
  "success": false,
  "error": "Endpoint not found",
  "details": {
    "message": "The endpoint GET /api/v1/records/invalid does not exist",
    "availableEndpoints": [
      "GET /api/v1/records/last-hour",
      "GET /api/v1/records/all-day",
      "GET /api/v1/records/:id"
    ]
  }
}
```
**Solución**: Verificar que la URL del endpoint sea correcta.

## Mejores Prácticas

### 1. Rate Limiting
- Máximo 10 peticiones por segundo
- Implementar retrasos entre peticiones consecutivas
- Manejar errores 429 con reintentos exponenciales

### 2. Manejo de Errores
- Siempre verificar el campo `success` en las respuestas
- Implementar reintentos para errores temporales (5xx)
- No reintentar errores de cliente (4xx)

### 3. Validación de Respuestas
- Verificar que `response.success` sea `true`
- Validar la estructura de `response.data`
- Manejar casos donde `data` esté vacío

## Monitoreo y Logs

La API registra todas las peticiones con la siguiente información:
- Timestamp de la petición
- IP del cliente
- Endpoint consultado
- Parámetros enviados
- Tiempo de respuesta
- Código de estado HTTP

## Soporte Técnico

Para soporte técnico o reportar problemas:
- **Email**: [tu-email@empresa.com]
- **Horario**: Lunes a Viernes 8:00 AM - 6:00 PM
- **Respuesta**: Máximo 24 horas hábiles

## Changelog

### v1.0.0 (2024-01-15)
- ✅ Endpoints básicos implementados
- ✅ Autenticación por Bearer Token
- ✅ Rate limiting configurado
- ✅ Logs detallados
- ✅ Manejo de errores mejorado 