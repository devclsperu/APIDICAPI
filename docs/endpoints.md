# Documentación de los Endpoints

## 🌐 Información General

### Base URL
- **Desarrollo**: `http://localhost:3000`
- **Producción**: `https://www.apidicapi.com.pe`
- **Pruebas**: `http://localhost:6002`

### Autenticación
Todos los endpoints requieren autenticación mediante **Bearer Token** en el header `Authorization`.

```http
Authorization: Bearer tu_token_aqui
```

### Formato de Respuesta
Todos los endpoints devuelven respuestas en formato JSON con la siguiente estructura:

```json
{
  "success": true,
  "data": [
    {
      "id": "BEACON_REF",
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

### Códigos de Estado HTTP
- **200 OK**: Petición exitosa
- **400 Bad Request**: Parámetros inválidos
- **401 Unauthorized**: Token inválido o faltante
- **404 Not Found**: Endpoint no encontrado
- **413 Payload Too Large**: Límite de registros excedido
- **429 Too Many Requests**: Rate limit excedido
- **500 Internal Server Error**: Error interno del servidor

## 📊 Endpoints Disponibles

### 1. GET /api/v1/records/last-hour

Obtiene los registros de posicionamiento de la última hora.

#### Detalles
- **Método**: `GET`
- **URL**: `/api/v1/records/last-hour`
- **Rate Limit**: 100 peticiones/hora
- **Autenticación**: Requerida
- **Parámetros**: Ninguno

#### Ejemplo de Petición
```bash
curl -X GET "https://www.apidicapi.com.pe/api/v1/records/last-hour" \
  -H "Authorization: Bearer tu_token_aqui"
```

#### Ejemplo de Respuesta
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
    },
    {
      "id": "BEACON_002",
      "longitude": -77.234567,
      "latitude": -12.456789,
      "transmissionDateTime": "2024/01/15 10:25:30",
      "course": 90.0,
      "speed": 8.5,
      "mobileName": "EMBARCACION_002",
      "mobileTypeName": "MERCANTE"
    }
  ]
}
```

#### Respuesta de Error
```json
{
  "success": false,
  "error": "Token requerido",
  "details": {
    "message": "Se requiere un Bearer Token para acceder a este endpoint"
  }
}
```

### 2. GET /api/v1/records/last/:hours

Obtiene los registros de posicionamiento de las últimas N horas.

#### Detalles
- **Método**: `GET`
- **URL**: `/api/v1/records/last/:hours`
- **Rate Limit**: 80 peticiones/hora
- **Autenticación**: Requerida
- **Parámetros**:
  - `hours` (path): Número de horas (2-24)

#### Validaciones
- El parámetro `hours` debe ser un número entre 2 y 24
- Para 1 hora, usar el endpoint `/last-hour`

#### Ejemplo de Petición
```bash
curl -X GET "https://www.apidicapi.com.pe/api/v1/records/last/6" \
  -H "Authorization: Bearer tu_token_aqui"
```

#### Ejemplo de Respuesta
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

#### Respuesta de Error (Parámetro Inválido)
```json
{
  "success": false,
  "error": "Invalid parameter",
  "details": {
    "message": "The hours parameter must be a number between 2 and 24 (use /last-hour for 1 hour)",
    "received": "25"
  }
}
```

### 3. GET /api/v1/records/all-day

Obtiene todas las transmisiones del día actual.

#### Detalles
- **Método**: `GET`
- **URL**: `/api/v1/records/all-day`
- **Rate Limit**: 240 peticiones/hora
- **Autenticación**: Requerida
- **Parámetros**: Ninguno

#### Ejemplo de Petición
```bash
curl -X GET "https://www.apidicapi.com.pe/api/v1/records/all-day" \
  -H "Authorization: Bearer tu_token_aqui"
```

#### Ejemplo de Respuesta
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

### 4. GET /api/v1/records/select-day

Obtiene registros de una fecha específica dividiendo la consulta en dos partes (mañana y tarde) para optimizar el rendimiento y evitar límites de registros.

#### Detalles
- **Método**: `GET`
- **URL**: `/api/v1/records/select-day`
- **Rate Limit**: 120 peticiones/hora
- **Autenticación**: Requerida
- **Parámetros**:
  - `date` (query): Fecha en formato DD-MM-YYYY

#### Validaciones
- El parámetro `date` es obligatorio
- Formato de fecha: DD-MM-YYYY
- La fecha debe ser válida

#### Ejemplo de Petición
```bash
curl -X GET "https://www.apidicapi.com.pe/api/v1/records/select-day?date=15-01-2024" \
  -H "Authorization: Bearer tu_token_aqui"
```

#### Ejemplo de Respuesta
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

#### Respuesta de Error (Fecha Inválida)
```json
{
  "success": false,
  "error": "Invalid date format",
  "details": {
    "message": "Date must be in DD-MM-YYYY format",
    "received": { "date": "2024-01-15" }
  }
}
```

### 5. GET /api/v1/records/:id

Obtiene registros específicos por ID de beacon/embarcación.

#### Detalles
- **Método**: `GET`
- **URL**: `/api/v1/records/:id`
- **Rate Limit**: 300 peticiones/hora
- **Autenticación**: Requerida
- **Parámetros**:
  - `id` (path): ID del beacon/embarcación

#### Validaciones
- El parámetro `id` es obligatorio
- No puede ser 'last-hour' o variaciones

#### Ejemplo de Petición
```bash
curl -X GET "https://www.apidicapi.com.pe/api/v1/records/BEACON_001" \
  -H "Authorization: Bearer tu_token_aqui"
```

#### Ejemplo de Respuesta
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

## 🔧 Configuración de Rate Limiting

Cada endpoint tiene configurado un rate limiter específico para proteger contra abuso:

| Endpoint | Rate Limit | Ventana de Tiempo |
|----------|------------|-------------------|
| `/last-hour` | 100 peticiones | 1 hora |
| `/last/:hours` | 80 peticiones | 1 hora |
| `/all-day` | 240 peticiones | 1 hora |
| `/select-day` | 120 peticiones | 1 hora |
| `/:id` | 300 peticiones | 1 hora |

### Respuesta de Rate Limit Excedido
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

## 🚨 Manejo de Errores

### Error de Límite de Registros (MAX_ROWS_REACHED)
Cuando se excede el límite de registros permitidos por la API externa:

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

### Error de Endpoint No Encontrado
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

## 📝 Notas Importantes

1. **Autenticación**: Todos los endpoints requieren un Bearer Token válido
2. **Formato de Fecha**: Para `/select-day` usar formato DD-MM-YYYY
3. **Optimización**: `/select-day` divide la consulta en dos partes para evitar límites
4. **Rate Limiting**: Cada endpoint tiene límites específicos configurados
5. **Logs**: Todas las consultas son registradas para auditoría
6. **SSL**: En producción, todas las conexiones son HTTPS
7. **Proxy**: La API está detrás de Nginx como proxy reverso y balanceador

---

*Documentación de Endpoints - APIDICAPI v1.0.0* 