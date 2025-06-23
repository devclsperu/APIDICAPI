# Documentación de los Endpoints

## 🌐 Información General

### Base URL
- **Desarrollo**: `http://localhost:6002`
- **Producción**: `https://localhost:4443`
- **Pruebas**: `http://localhost:6003`

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
curl -X GET "https://localhost:4443/api/v1/records/last-hour" \
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
- **Rate Limit**: 150 peticiones/hora
- **Autenticación**: Requerida
- **Parámetros**:
  - `hours` (path): Número de horas (2-24)

#### Validaciones
- El parámetro `hours` debe ser un número entre 2 y 24
- Para 1 hora, usar el endpoint `/last-hour`

#### Ejemplo de Petición
```bash
curl -X GET "https://localhost:4443/api/v1/records/last/6" \
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
curl -X GET "https://localhost:4443/api/v1/records/all-day" \
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

### 4. GET /api/v1/records/date-range

Obtiene registros de una fecha específica.

#### Detalles
- **Método**: `GET`
- **URL**: `/api/v1/records/date-range`
- **Rate Limit**: 150 peticiones/hora
- **Autenticación**: Requerida
- **Parámetros**:
  - `date` (query): Fecha en formato DD-MM-YYYY

#### Validaciones
- El parámetro `date` es obligatorio
- Formato de fecha: DD-MM-YYYY
- La fecha debe ser válida

#### Ejemplo de Petición
```bash
curl -X GET "https://localhost:4443/api/v1/records/date-range?date=15-01-2024" \
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

### 5. GET /api/v1/records/select-day

Obtiene registros de un día específico dividido en mañana y tarde.

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
curl -X GET "https://localhost:4443/api/v1/records/select-day?date=15-01-2024" \
  -H "Authorization: Bearer tu_token_aqui"
```

#### Ejemplo de Respuesta
```json
{
  "success": true,
  "data": {
    "morning": [
      {
        "id": "BEACON_001",
        "longitude": -77.123456,
        "latitude": -12.345678,
        "transmissionDateTime": "2024/01/15 08:30:45",
        "course": 180.5,
        "speed": 12.3,
        "mobileName": "EMBARCACION_001",
        "mobileTypeName": "PESQUERO"
      }
    ],
    "afternoon": [
      {
        "id": "BEACON_002",
        "longitude": -77.234567,
        "latitude": -12.456789,
        "transmissionDateTime": "2024/01/15 14:25:30",
        "course": 90.0,
        "speed": 8.5,
        "mobileName": "EMBARCACION_002",
        "mobileTypeName": "MERCANTE"
      }
    ]
  }
}
```

### 6. GET /api/v1/records/:id

Obtiene registros específicos por ID de embarcación.

#### Detalles
- **Método**: `GET`
- **URL**: `/api/v1/records/:id`
- **Rate Limit**: 300 peticiones/hora
- **Autenticación**: Requerida
- **Parámetros**:
  - `id` (path): ID de la embarcación (beacon reference)

#### Validaciones
- El parámetro `id` es obligatorio
- No puede ser 'last-hour' o variaciones

#### Ejemplo de Petición
```bash
curl -X GET "https://localhost:4443/api/v1/records/BEACON_001" \
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
      "id": "BEACON_001",
      "longitude": -77.123456,
      "latitude": -12.345678,
      "transmissionDateTime": "2024/01/15 09:30:45",
      "course": 180.5,
      "speed": 12.3,
      "mobileName": "EMBARCACION_001",
      "mobileTypeName": "PESQUERO"
    }
  ]
}
```

## 📋 Estructura de Datos

### Record Object
```typescript
interface IRecord {
    id: string;                    // ID de la embarcación (beacon reference)
    longitude: number;             // Longitud geográfica
    latitude: number;              // Latitud geográfica
    transmissionDateTime: string;  // Fecha y hora de transmisión (YYYY/MM/DD HH:MM:SS)
    course: number;                // Rumbo en grados (0-360)
    speed: number;                 // Velocidad en nudos
    mobileName: string;            // Nombre de la embarcación
    mobileTypeName: string;        // Tipo de embarcación
}
```

### Response Object
```typescript
interface IRecordsResponse {
    success: boolean;              // Estado de la petición
    data: IRecord[];               // Array de registros
    error?: string;                // Mensaje de error (si aplica)
}
```

## 🚨 Códigos de Error

### 400 Bad Request
```json
{
  "success": false,
  "error": "Invalid parameter",
  "details": {
    "message": "Descripción del error",
    "received": "Valor recibido"
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Token requerido",
  "details": {
    "message": "Se requiere un Bearer Token para acceder a este endpoint"
  }
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Endpoint not found",
  "details": {
    "message": "The endpoint GET /api/v1/records/invalid does not exist",
    "availableEndpoints": [
      "GET /api/v1/records/last-hour - Get records from the last hour",
      "GET /api/v1/records/last/:hours - Get records from the last N hours (2-24)",
      "GET /api/v1/records/date-range - Get records from a specific day (requires query param: date in DD-MM-YYYY format)",
      "GET /api/v1/records/all-day - Get all transmissions from the current day",
      "GET /api/v1/records/:id - Get records by specific ID (requires id parameter)"
    ]
  }
}
```

### 413 Payload Too Large
```json
{
  "success": false,
  "error": "Límite de registros excedido",
  "details": {
    "message": "La consulta excedió el límite máximo de 150,000 registros",
    "maxRows": 150000,
    "suggestion": "Intenta usar un rango de tiempo más específico"
  }
}
```

### 429 Too Many Requests
```json
{
  "success": false,
  "error": "Demasiadas peticiones",
  "details": {
    "message": "Has excedido el límite de peticiones. Intenta nuevamente en 15 minutos.",
    "limit": 100,
    "windowMs": "15 minutos"
  }
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Error al procesar la solicitud",
  "data": []
}
```

## 🔄 Transformación de Datos

### Conversión de Zona Horaria
Los datos originales vienen en UTC y se convierten a hora local (-5 horas):

```typescript
// Ejemplo de transformación
const date = new Date(externalRecord.locDate.replace("_", "T") + "Z");
date.setHours(date.getHours() - 5); // UTC a hora local

const formattedDate = date
  .toISOString()
  .replace("T", " ")
  .replace("Z", "")
  .replace(/-/g, "/")
  .slice(0, 19); // YYYY/MM/DD HH:MM:SS
```

### Campos Transformados
- **locDate**: `2024-01-15_10:30:45` → `2024/01/15 10:30:45`
- **loc**: `[longitude, latitude]` → `longitude`, `latitude` (separados)
- **activeBeaconRef**: → `id`
- **heading**: → `course`
- **mobileName**: → `mobileName`
- **mobileTypeName**: → `mobileTypeName`

## 📊 Rate Limiting por Endpoint

| Endpoint | Ventana | Límite | Descripción |
|----------|---------|--------|-------------|
| `/last-hour` | 1 hora | 100 | Última hora |
| `/last/:hours` | 1 hora | 150 | Rango de horas |
| `/all-day` | 1 hora | 240 | Día completo |
| `/date-range` | 1 hora | 150 | Fecha específica |
| `/select-day` | 1 hora | 120 | Día dividido |
| `/records/:id` | 1 hora | 300 | Por ID |

## 🔍 Headers de Respuesta

### Headers Estándar
```
Content-Type: application/json
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642248000
```

### Headers de Seguridad (HTTPS)
```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
```

## 📝 Ejemplos de Uso

### JavaScript (Fetch API)
```javascript
const response = await fetch('https://localhost:4443/api/v1/records/last-hour', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer tu_token_aqui',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data);
```

### Python (Requests)
```python
import requests

response = requests.get(
    'https://localhost:4443/api/v1/records/last-hour',
    headers={
        'Authorization': 'Bearer tu_token_aqui',
        'Content-Type': 'application/json'
    }
)

data = response.json()
print(data)
```

### cURL
```bash
curl -X GET "https://localhost:4443/api/v1/records/last-hour" \
  -H "Authorization: Bearer tu_token_aqui" \
  -H "Content-Type: application/json"
```

---

*Documentación de Endpoints - APIDICAPI v1.0.0* 