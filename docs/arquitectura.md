# Arquitectura, Tecnologías y Estructura

## 🏗️ Arquitectura del Sistema

### Diagrama de Arquitectura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Cliente API   │───▶│     Nginx       │───▶│   APIDICAPI     │───▶│  Themis DICAPI  │
│   (HTTPS)       │    │  (Proxy/SSL)    │    │   (Backend)     │    │  (Fuente datos) │
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
                              │                        │
                              ▼                        ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │  Load Balancer  │    │  Themis Francia │
                       │  (Nginx)        │    │  (Fuente 2)     │
                       └─────────────────┘    └─────────────────┘
```

### Componentes del Sistema

#### 1. **Cliente API**
- Aplicaciones cliente que consumen la API
- Conexiones HTTPS seguras
- Autenticación mediante Bearer Token
- Rate limiting por IP

#### 2. **Nginx (Proxy y Balanceador)**
- **Proxy reverso** para la API
- **Terminación SSL** con certificados válidos
- **Balanceo de carga** para alta disponibilidad
- **Configuración optimizada** para rendimiento
- **Headers de seguridad** y compresión

#### 3. **APIDICAPI (Backend)**
- Servidor Node.js con Express y TypeScript
- **Código organizado** con buenas prácticas
- Transformación y normalización de datos
- Manejo de errores y reintentos
- Logging estructurado

#### 4. **Themis DICAPI (Fuente Principal)**
- Sistema de tracking marítimo principal
- API REST para consulta de posiciones
- Autenticación por login/password
- Formato de datos específico

#### 5. **Themis Francia (Backup)**
- Sistema de respaldo
- Configuración alternativa
- Misma estructura de datos

## 🔧 Stack Tecnológico

### Backend (Node.js + TypeScript)
- **Node.js** 18.x - Runtime de JavaScript
- **TypeScript** 5.x - Superset tipado de JavaScript
- **Express.js** 5.x - Framework web minimalista
- **Winston** 3.x - Sistema de logging estructurado

### Proxy y Servidor Web
- **Nginx** 1.27.5 - Proxy reverso y servidor web
- **SSL/TLS** - Certificados de seguridad
- **Load Balancing** - Balanceo de carga

### Seguridad y Control
- **express-bearer-token** - Middleware de autenticación
- **express-rate-limit** - Control de velocidad de peticiones
- **cors** - Configuración de Cross-Origin Resource Sharing

### HTTP y Comunicación
- **Axios** 1.x - Cliente HTTP para peticiones
- **axios-retry** 4.x - Reintentos automáticos
- **opossum** 9.x - Circuit breaker pattern

### Configuración y Entornos
- **dotenv** 16.x - Variables de entorno
- **cross-env** 7.x - Variables de entorno multiplataforma

## 📁 Estructura del Proyecto

```
APIDICAPI/
├── src/
│   ├── config/                 # Configuraciones
│   │   ├── api.config.ts       # Configuración de API externa
│   │   ├── env.config.ts       # Variables de entorno
│   │   └── rateLimit.config.ts # Configuración de rate limiting
│   ├── controllers/            # Controladores organizados por funcionalidad
│   │   └── record.controller.ts # Controlador de registros con documentación
│   ├── interfaces/             # Interfaces TypeScript
│   │   └── record.interface.ts # Interfaces de datos
│   ├── middleware/             # Middlewares personalizados
│   │   ├── auth.middleware.ts  # Autenticación
│   │   └── query-logger.middleware.ts # Logging de consultas
│   ├── routes/                 # Definición de rutas organizadas
│   │   └── v1/
│   │       └── record.routes.ts # Rutas con validaciones y rate limiting
│   ├── services/               # Lógica de negocio organizada
│   │   ├── http.client.ts      # Cliente HTTP con retry
│   │   └── record.service.ts   # Servicio de registros con documentación
│   ├── utils/                  # Utilidades
│   │   ├── errors.ts           # Clases de errores personalizadas
│   │   └── logger.ts           # Configuración de logging
│   ├── app.ts                  # Configuración de Express
│   └── index.ts                # Punto de entrada
├── nginx-1.27.5/               # Configuración de Nginx
│   ├── conf/                   # Archivos de configuración
│   ├── html/                   # Páginas de error
│   └── nginx.exe               # Ejecutable de Nginx
├── docs/                       # Documentación actualizada
│   ├── client/                 # Cliente de ejemplo
│   ├── README.md               # Documentación principal
│   ├── arquitectura.md         # Esta documentación
│   ├── endpoints.md            # Documentación de endpoints
│   ├── configuracion.md        # Configuración del sistema
│   ├── despliegue.md           # Guía de despliegue
│   ├── CLIENT_GUIDE.md         # Guía para clientes
│   └── EXAMPLES.md             # Ejemplos de uso
├── scripts/                    # Scripts de gestión
│   ├── start.bat               # Inicio del sistema
│   ├── stop.bat                # Parada del sistema
│   └── restart.bat             # Reinicio del sistema
├── package.json                # Dependencias y scripts
├── tsconfig.json               # Configuración de TypeScript
└── ecosystem.config.js         # Configuración de PM2
```

## 🔄 Flujo de Datos

### 1. Petición del Cliente
```
Cliente HTTPS → Nginx (SSL) → Bearer Token → Validación → Rate Limiting → Endpoint
```

### 2. Procesamiento de la API
```
Endpoint → Controller → Service → HTTP Client → Themis DICAPI
```

### 3. Transformación de Datos
```
Themis Response → Transform → Format → JSON Response → Nginx → Cliente HTTPS
```

### 4. Logging y Monitoreo
```
Cada paso → Winston Logger → Archivos diarios → Rotación automática
```

## 🏛️ Organización del Código

### Estructura de Controladores
Los controladores están organizados por funcionalidad con documentación JSDoc:

```typescript
// ========================================
// MÉTODOS DE CONSULTA POR TIEMPO
// ========================================

/**
 * Obtiene registros de la última hora
 * Endpoint: GET /api/v1/records/last-hour
 */
public async getLastHourRecords(req: Request, res: Response): Promise<void>

// ========================================
// MÉTODOS DE CONSULTA POR IDENTIFICADOR
// ========================================

/**
 * Obtiene registros por ID específico
 * Endpoint: GET /api/v1/records/:id
 */
public async getRecordsById(req: Request, res: Response): Promise<void>
```

### Estructura de Servicios
Los servicios están organizados con métodos privados y públicos:

```typescript
// ========================================
// MÉTODOS PRIVADOS - UTILIDADES
// ========================================

/**
 * Transforma un registro externo al formato interno
 */
private transformRecord(externalRecord: IExternalRecord)

// ========================================
// MÉTODOS PÚBLICOS - CONSULTAS POR TIEMPO
// ========================================

/**
 * Obtiene registros de la última hora
 */
public async getLastHourRecords(): Promise<IRecordsResponse>
```

### Estructura de Rutas
Las rutas están organizadas por tipo:

```typescript
// ========================================
// RUTAS ESPECÍFICAS (SIN PARÁMETROS)
// ========================================

/**
 * GET /api/v1/records/last-hour
 * Obtiene registros de la última hora
 */
router.get('/last-hour', ...)

// ========================================
// RUTAS CON PARÁMETROS
// ========================================

/**
 * GET /api/v1/records/last/:hours
 * Obtiene registros de las últimas N horas
 */
router.get('/last/:hours', ...)
```

## 🔒 Arquitectura de Seguridad

### Capas de Seguridad

#### 1. **Nginx (Capa Externa)**
- **SSL/TLS** con certificados válidos
- **Headers de seguridad** (HSTS, X-Frame-Options, etc.)
- **Compresión** de respuestas
- **Rate limiting** a nivel de proxy

#### 2. **Autenticación**
- Bearer Token obligatorio
- Validación en cada endpoint
- Logging de intentos no autorizados

#### 3. **Rate Limiting**
- Límites globales y por endpoint
- Configuración por IP
- Headers de rate limit en respuestas

#### 4. **Validación de Entrada**
- Sanitización de parámetros
- Validación de tipos de datos
- Prevención de inyección

## 📊 Configuración de Rate Limiting

### Límites por Endpoint (Actualizados)

| Endpoint | Ventana | Límite | Descripción |
|----------|---------|--------|-------------|
| Global | 15 min | 100 | Límite global por IP |
| `/last-hour` | 1 hora | 100 | Última hora |
| `/last/:hours` | 1 hora | 80 | Rango de horas |
| `/all-day` | 1 hora | 240 | Día completo |
| `/select-day` | 1 hora | 120 | Día específico |
| `/:id` | 1 hora | 300 | Por ID |

### Configuración de Rate Limiters

```typescript
// ========================================
// RATE LIMITERS GENERALES
// ========================================

/**
 * Rate limiter global para toda la aplicación
 * 100 peticiones por 15 minutos
 */
export const globalLimiter = rateLimit({...})

// ========================================
// RATE LIMITERS ESPECÍFICOS POR ENDPOINT
// ========================================

/**
 * Rate limiter para /last-hour
 * 100 peticiones por hora
 */
export const lastHourLimiter = rateLimit({...})
```

## 🔄 Manejo de Errores y Reintentos

### Estrategia de Reintentos

#### Tipos de Errores Manejados

- **Errores de Red**: Sin respuesta del servidor
- **Timeouts**: Petición excede 30 segundos
- **Errores 5xx**: Errores internos del servidor
- **MAX_ROWS_REACHED**: Límite de registros excedido

### Manejo de Errores Organizado

```typescript
try {
    // Lógica del endpoint
} catch (error) {
    if (error instanceof MaxRowsReachedError) {
        // Manejo específico para límite de registros
        res.status(413).json({...});
        return;
    }
    
    // Manejo general de errores
    logger.error(`Error en endpoint: ${error}`);
    res.status(500).json({...});
}
```

## 📈 Sistema de Logging

### Configuración de Winston

#### Niveles de Log
- **info**: Información general de operaciones
- **warn**: Advertencias y límites excedidos
- **error**: Errores y excepciones

#### Archivos de Log
- `combined-YYYY-MM-DD.log` - Logs generales
- `error-YYYY-MM-DD.log` - Solo errores
- `client-queries-YYYY-MM-DD.log` - Consultas de clientes

#### Formato de Log
```json
{
  "timestamp": "2024-01-15T10:30:45.123Z",
  "level": "info",
  "message": "Client Query",
  "endpoint": "/api/v1/records/last-hour",
  "ip": "192.168.1.100",
  "userAgent": "curl/7.68.0"
}
```

## ⚡ Optimizaciones Internas

### 1. Optimización Automática de `/all-day`

**Comportamiento Interno:**
El endpoint `/all-day` implementa una optimización automática transparente para el cliente:

#### Lógica de Decisión:
- **Antes de las 11:59:59**: Una sola petición HTTP a la API externa
- **Después de las 11:59:59**: Dos peticiones HTTP separadas (mañana + tarde)

#### División de Consultas:
```
Mañana: 00:00:00 a 11:59:59
Tarde:  12:00:00 a 23:59:59
```

#### Implementación:
```typescript
// En RecordService.getAllDayRecords()
const isAfterNoon = (currentHour > 11) || 
                   (currentHour === 11 && currentMinute > 59) || 
                   (currentHour === 11 && currentMinute === 59 && currentSecond > 59);

if (isAfterNoon) {
  return this.getAllDayRecordsDivided(); // 2 peticiones
} else {
  return this.getAllDayRecordsSingle();  // 1 petición
}
```

#### Beneficios:
- **Transparencia**: El cliente no percibe diferencia
- **Optimización**: Evita errores de límites de registros
- **Rendimiento**: Mejora la confiabilidad del sistema
- **Logging**: Registra internamente qué estrategia se usa

### 2. Transformación de Datos

**Ajuste de Zona Horaria:**
```typescript
// En RecordService.transformRecord()
const date = new Date(externalRecord.locDate.replace("_", "T") + "Z");
date.setHours(date.getHours() - 5); // Ajuste a zona horaria local
```

**Formato de Fecha:**
```typescript
// Conversión de ISO a formato YYYY/MM/DD HH:MM:SS
const formattedDate = date
  .toISOString()
  .replace("T", " ")
  .replace("Z", "")
  .replace(/-/g, "/")
  .slice(0, 19);
```

### 3. Manejo de Errores Interno

**Error MAX_ROWS_REACHED:**
```typescript
// En RecordService.makeRequest()
if (error.response.data && error.response.data.errors) {
  const maxRowsError = error.response.data.errors.find((err: any) => 
    err.key === 'MAX_ROWS_REACHED'
  );
  
  if (maxRowsError) {
    const maxRows = parseInt(maxRowsError.args[0]) || 150000;
    throw new MaxRowsReachedError(maxRows);
  }
}
```

**Respuesta Estructurada:**
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

### 4. Logging Detallado

**Niveles de Log:**
- `INFO`: Operaciones normales
- `WARN`: Advertencias (rate limits, optimizaciones)
- `ERROR`: Errores del sistema

**Prefijos Especiales:**
- `OPTIMIZACIÓN INTERNA`: Para comportamientos automáticos
- `MAX_ROWS_REACHED`: Para errores de límites

**Ejemplos de Logs:**
```
[2024-01-20 14:30:25] [INFO] [RecordService] Obteniendo registros de la última hora
[2024-01-20 14:30:26] [INFO] [OPTIMIZACIÓN INTERNA] Después de las 11:59:59 - dividiendo consulta en dos partes
[2024-01-20 14:30:27] [WARN] [MAX_ROWS_REACHED] Límite de 150000 registros alcanzado
```

## 🔧 Configuración del Sistema

### Variables de Entorno

**ThemisDICAPI:**
```env
THEMIS_DICAPI_URL=https://api.themis.com
THEMIS_DICAPI_LOGIN=usuario
THEMIS_DICAPI_PASSWORD=password
```

**Servidor:**
```env
# Desarrollo
PORT=3000
NODE_ENV=development

# Producción
PORT=6002
NODE_ENV=production
```

### Nginx como Proxy Reverso

**Configuración SSL:**
```nginx
server {
    listen 443 ssl;
    server_name www.apidicapi.com.pe;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    location /api/ {
        proxy_pass http://localhost:6002;  # Puerto de producción
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🚀 Beneficios de la Nueva Organización

### 1. **Legibilidad Mejorada**
- Código más fácil de leer y entender
- Secciones claramente definidas
- Comentarios descriptivos

### 2. **Mantenibilidad**
- Estructura clara para futuras modificaciones
- Separación de responsabilidades
- Documentación integrada

### 3. **Colaboración**
- Código más accesible para otros desarrolladores
- Convenciones consistentes
- Documentación JSDoc

### 4. **Escalabilidad**
- Fácil agregar nuevos endpoints
- Estructura modular
- Configuración centralizada

### 5. **Optimización Automática**
- Comportamientos inteligentes transparentes
- Evita errores de límites de registros
- Mejora la confiabilidad del sistema

## 📋 Consideraciones de Desarrollo

### Mantenimiento

**Al modificar optimizaciones:**
- Actualizar documentación interna
- Mantener transparencia para el cliente
- Probar ambos escenarios (antes/después de 11:59:59)
- Verificar logs de optimización

### Escalabilidad

**Puntos de atención:**
- Rate limiting por endpoint
- División automática de consultas
- Manejo de errores de límites
- Logging detallado para debugging

### Seguridad

**Medidas implementadas:**
- Autenticación Bearer Token
- Rate limiting por IP
- Validación de parámetros
- Sanitización de datos

---

*APIDICAPI - Arquitectura Organizada y Documentada*
*Versión 1.1.0 - Node.js, TypeScript y Nginx* 