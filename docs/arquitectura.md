# Arquitectura, Tecnologías y Estructura

## 🏗️ Arquitectura del Sistema

### Diagrama de Arquitectura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Cliente API   │───▶│   APIDICAPI     │───▶│  Themis DICAPI  │
│                 │    │   (Proxy)       │    │  (Fuente datos) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │  Themis Francia │
                       │  (Backup)       │
                       └─────────────────┘
```

### Componentes del Sistema

#### 1. **Cliente API**
- Aplicaciones cliente que consumen la API
- Autenticación mediante Bearer Token
- Rate limiting por IP
- Validación de parámetros

#### 2. **APIDICAPI (Proxy Inteligente)**
- Servidor Node.js con Express
- Transformación y normalización de datos
- Manejo de errores y reintentos
- Logging estructurado

#### 3. **Themis DICAPI (Fuente Principal)**
- Sistema de tracking marítimo principal
- API REST para consulta de posiciones
- Autenticación por login/password
- Formato de datos específico

#### 4. **Themis Francia (Backup)**
- Sistema de respaldo
- Configuración alternativa
- Misma estructura de datos

## 🔧 Stack Tecnológico

### Backend
- **Node.js** 18.x - Runtime de JavaScript
- **TypeScript** 5.x - Superset tipado de JavaScript
- **Express.js** 5.x - Framework web minimalista
- **Winston** 3.x - Sistema de logging estructurado

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

### Proxy y SSL
- **Nginx** - Proxy reverso y SSL termination
- **Certificados SSL** - HTTPS seguro

## 📁 Estructura del Proyecto

```
APIDICAPI/
├── src/
│   ├── config/                 # Configuraciones
│   │   ├── api.config.ts       # Configuración de API externa
│   │   ├── env.config.ts       # Variables de entorno
│   │   ├── production.config.ts # Configuración de producción (no usado)
│   │   └── rateLimit.config.ts # Configuración de rate limiting
│   ├── controllers/            # Controladores de la aplicación
│   │   └── record.controller.ts # Controlador de registros
│   ├── interfaces/             # Interfaces TypeScript
│   │   └── record.interface.ts # Interfaces de datos
│   ├── middleware/             # Middlewares personalizados
│   │   ├── auth.middleware.ts  # Autenticación
│   │   └── query-logger.middleware.ts # Logging de consultas
│   ├── routes/                 # Definición de rutas
│   │   └── v1/
│   │       └── record.routes.ts # Rutas de la API v1
│   ├── services/               # Lógica de negocio
│   │   ├── http.client.ts      # Cliente HTTP con retry
│   │   └── record.service.ts   # Servicio de registros
│   ├── utils/                  # Utilidades
│   │   ├── errors.ts           # Clases de errores personalizadas
│   │   └── logger.ts           # Configuración de logging
│   ├── app.ts                  # Configuración de Express
│   └── index.ts                # Punto de entrada
├── docs/                       # Documentación
├── nginx/                      # Configuración de Nginx
├── scripts/                    # Scripts de inicio y configuración
├── ssl/                        # Certificados SSL
└── logs/                       # Archivos de log (generados)
```

## 🔄 Flujo de Datos

### 1. Petición del Cliente
```
Cliente → Bearer Token → Validación → Rate Limiting → Endpoint
```

### 2. Procesamiento de la API
```
Endpoint → Controller → Service → HTTP Client → Themis DICAPI
```

### 3. Transformación de Datos
```
Themis Response → Transform → Format → JSON Response → Cliente
```

### 4. Logging y Monitoreo
```
Cada paso → Winston Logger → Archivos diarios → Rotación automática
```

## 🔒 Arquitectura de Seguridad

### Capas de Seguridad

#### 1. **Autenticación**
- Bearer Token obligatorio
- Validación en cada endpoint
- Logging de intentos no autorizados

#### 2. **Rate Limiting**
- Límites globales y por endpoint
- Configuración por IP
- Headers de rate limit en respuestas

#### 3. **Validación de Entrada**
- Sanitización de parámetros
- Validación de tipos de datos
- Prevención de inyección

#### 4. **SSL/HTTPS**
- Certificados SSL válidos
- Headers de seguridad
- Proxy reverso con Nginx

## 📊 Configuración de Rate Limiting

Para detalles completos sobre la configuración de rate limiting, consulta la **[documentación de configuración](configuracion.md)**.

### Límites por Endpoint

| Endpoint | Ventana | Límite | Descripción |
|----------|---------|--------|-------------|
| Global | 15 min | 100 | Límite global por IP |
| `/last-hour` | 1 hora | 100 | Última hora |
| `/last/:hours` | 1 hora | 150 | Rango de horas |
| `/all-day` | 1 hora | 240 | Día completo |
| `/date-range` | 1 hora | 150 | Fecha específica |
| `/select-day` | 1 hora | 120 | Día dividido |
| `/records/:id` | 1 hora | 300 | Por ID |

## 🔄 Manejo de Errores y Reintentos

Para detalles completos sobre el manejo de errores y reintentos, consulta la **[documentación de configuración](configuracion.md)**.

### Estrategia de Reintentos

#### Tipos de Errores Manejados

- **Errores de Red**: Sin respuesta del servidor
- **Timeouts**: Petición excede 30 segundos
- **Errores 5xx**: Errores internos del servidor
- **MAX_ROWS_REACHED**: Límite de registros excedido

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
  "userAgent": "Mozilla/5.0..."
}
```

## 🌐 Configuración de Red

### Puertos y Protocolos

| Servicio | Puerto | Protocolo | Descripción |
|----------|--------|-----------|-------------|
| Aplicación | 6002 | HTTP | Servidor Node.js |
| Nginx HTTPS | 4443 | HTTPS | Proxy reverso SSL |
| Nginx HTTP | 80 | HTTP | Redirección a HTTPS |

### Configuración de Nginx

#### Proxy Reverso
```nginx
server {
    listen 4443 ssl;
    server_name localhost;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    location / {
        proxy_pass http://localhost:6002;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 📦 Dependencias del Proyecto

### Dependencias de Producción
```json
{
  "axios": "^1.9.0",
  "axios-retry": "^4.5.0",
  "cors": "^2.8.5",
  "dotenv": "^16.5.0",
  "express": "^5.1.0",
  "express-bearer-token": "^3.0.0",
  "express-rate-limit": "^7.5.0",
  "opossum": "^9.0.0",
  "winston": "^3.17.0"
}
```

### Dependencias de Desarrollo
```json
{
  "@types/cors": "^2.8.18",
  "@types/express": "^5.0.2",
  "@types/node": "^22.15.21",
  "cross-env": "^7.0.3",
  "ts-node": "^10.9.2",
  "typescript": "^5.8.3"
}
```

## 🔍 Monitoreo y Métricas

### Métricas Disponibles
- **Consultas por endpoint** - Volumen de peticiones
- **Tiempos de respuesta** - Performance de la API
- **Errores y excepciones** - Tasa de error
- **Rate limiting activado** - Límites excedidos
- **Reintentos de conexión** - Fallos de red

### Herramientas de Monitoreo
- **Logs estructurados** - Winston con formato JSON
- **Logs de Nginx** - Acceso y errores del proxy
- **Logs de consultas** - Auditoría de clientes
- **Rotación automática** - Gestión de archivos de log

## 📚 Documentación Relacionada

- **[Configuración](configuracion.md)** - Variables de entorno y configuración detallada
- **[Despliegue](despliegue.md)** - Guía de instalación y despliegue
- **[Endpoints](endpoints.md)** - Documentación completa de endpoints
- **[Guía del Cliente](CLIENT_GUIDE.md)** - Instrucciones para consumir la API
- **[Ejemplos de Uso](EXAMPLES.md)** - Casos prácticos y ejemplos de código

---

*Documentación de Arquitectura - APIDICAPI v1.0.0* 