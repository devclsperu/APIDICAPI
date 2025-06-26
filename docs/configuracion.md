# Detalles sobre Variables de Entorno y Configuración

## 📋 Variables de Entorno

### Variables Requeridas

#### Variables Básicas
| Variable | Tipo | Requerida | Descripción | Ejemplo |
|----------|------|-----------|-------------|---------|
| `NODE_ENV` | string | ✅ | Entorno de ejecución | `dev`, `prod`, `test` |
| `API_TOKEN` | string | ✅ | Token de autenticación | `tu_token_seguro` |
| `PORT` | number | ✅ | Puerto del servidor | `3000` (dev), `6002` (prod) |

#### Variables Themis DICAPI
| Variable | Tipo | Requerida | Descripción | Ejemplo |
|----------|------|-----------|-------------|---------|
| `THEMIS_DICAPI_URL` | string | ✅ | URL base de la API | `http://10.202.18.7:8081/uda` |
| `THEMIS_DICAPI_LOGIN` | string | ✅ | Usuario de autenticación | `OPERADORCLS` |
| `THEMIS_DICAPI_PASSWORD` | string | ✅ | Contraseña de autenticación | `OpCLS2022!` |

#### Variables Themis Francia (Backup)
| Variable | Tipo | Requerida | Descripción | Ejemplo |
|----------|------|-----------|-------------|---------|
| `THEMIS_FRANCIA_URL` | string | ✅ | URL base de la API | `https://themis-clsperu.cls.fr/uda` |
| `THEMIS_FRANCIA_LOGIN` | string | ✅ | Usuario de autenticación | `tu_login_francia` |
| `THEMIS_FRANCIA_PASSWORD` | string | ✅ | Contraseña de autenticación | `tu_password_francia` |

### Configuración por Entornos

#### Desarrollo (`.env`)
```env
# Entorno básico
NODE_ENV=dev
API_TOKEN=tu_token_desarrollo
PORT=3000

# Configuración para themisFrancia (API original)
THEMIS_FRANCIA_URL=https://themis-clsperu.cls.fr/uda
THEMIS_FRANCIA_LOGIN=tu_login_francia
THEMIS_FRANCIA_PASSWORD=tu_password_francia

# Configuración para themisDICAPI (nueva API)
THEMIS_DICAPI_URL=http://10.202.18.7:8081/uda
THEMIS_DICAPI_LOGIN=OPERADORCLS
THEMIS_DICAPI_PASSWORD=OpCLS2022!
```

#### Producción (`.env.production`)
```env
# Entorno básico
NODE_ENV=prod
API_TOKEN=tu_token_produccion_seguro
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

#### Pruebas (`.env.test`)
```env
# Entorno básico
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

## ⚙️ Configuración de Rate Limiting

### Estructura Organizada

La configuración de rate limiting está organizada en dos secciones principales:

#### 1. Rate Limiters Generales
```typescript
// src/config/rateLimit.config.ts

// ========================================
// RATE LIMITERS GENERALES
// ========================================

/**
 * Rate limiter global para toda la aplicación
 * 100 peticiones por 15 minutos
 */
export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // máximo 100 peticiones por ventana de tiempo
    message: {
        success: false,
        error: 'Demasiadas peticiones',
        details: {
            message: 'Has excedido el límite de peticiones. Intenta nuevamente en 15 minutos.',
            limit: 100,
            windowMs: '15 minutos'
        }
    },
    standardHeaders: true,
    legacyHeaders: false
});
```

#### 2. Rate Limiters Específicos por Endpoint

| Endpoint | Rate Limit | Ventana | Configuración |
|----------|------------|---------|---------------|
| `/last-hour` | 100 peticiones | 1 hora | `lastHourLimiter` |
| `/last/:hours` | 80 peticiones | 1 hora | `lastHoursLimiter` |
| `/all-day` | 240 peticiones | 1 hora | `allDayLimiter` |
| `/select-day` | 120 peticiones | 1 hora | `selectDayLimiter` |
| `/:id` | 300 peticiones | 1 hora | `recordsByIdLimiter` |

### Configuración por Endpoint

#### Last Hour Records
```typescript
/**
 * Rate limiter para /last-hour
 * 100 peticiones por hora
 */
export const lastHourLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 100, // máximo 100 peticiones por hora
    message: {
        success: false,
        error: 'Demasiadas peticiones a last-hour',
        details: {
            message: 'Has excedido el límite de peticiones a last-hour. Intenta nuevamente en 1 hora.',
            limit: 100,
            windowMs: '1 hora'
        }
    },
    standardHeaders: true,
    legacyHeaders: false
});
```

#### Last Hours Records
```typescript
/**
 * Rate limiter para /last/:hours
 * 80 peticiones por hora
 */
export const lastHoursLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 80, // máximo 80 peticiones por hora
    message: {
        success: false,
        error: 'Demasiadas peticiones a last hours',
        details: {
            message: 'Has excedido el límite de peticiones a last hours. Intenta nuevamente en 1 hora.',
            limit: 80,
            windowMs: '1 hora'
        }
    },
    standardHeaders: true,
    legacyHeaders: false
});
```

#### All Day Records
```typescript
/**
 * Rate limiter para /all-day
 * 240 peticiones por hora
 */
export const allDayLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 240, // máximo 240 peticiones por hora
    message: {
        success: false,
        error: 'Demasiadas peticiones a all-day',
        details: {
            message: 'Has excedido el límite de peticiones a all-day. Intenta nuevamente en 1 hora.',
            limit: 240,
            windowMs: '1 hora'
        }
    },
    standardHeaders: true,
    legacyHeaders: false
});
```

#### Select Day Records
```typescript
/**
 * Rate limiter para /select-day
 * 120 peticiones por hora
 */
export const selectDayLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 120, // máximo 120 peticiones por hora
    message: {
        success: false,
        error: 'Demasiadas peticiones a select-day',
        details: {
            message: 'Has excedido el límite de peticiones a select-day. Intenta nuevamente en 1 hora.',
            limit: 120,
            windowMs: '1 hora'
        }
    },
    standardHeaders: true,
    legacyHeaders: false
});
```

#### Records by ID
```typescript
/**
 * Rate limiter para /:id
 * 300 peticiones por hora
 */
export const recordsByIdLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 300, // máximo 300 peticiones por hora
    message: {
        success: false,
        error: 'Demasiadas peticiones a records by ID',
        details: {
            message: 'Has excedido el límite de peticiones a records by ID. Intenta nuevamente en 1 hora.',
            limit: 300,
            windowMs: '1 hora'
        }
    },
    standardHeaders: true,
    legacyHeaders: false
});
```

## 🔧 Configuración de HTTP Client

### Configuración de Axios
```typescript
// src/services/http.client.ts
const httpClient = axios.create({
    timeout: 30000, // 30 segundos
    headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'APIDICAPI/1.1.0'
    }
});
```

### Configuración de Reintentos
```typescript
// Configuración de axios-retry
axiosRetry(httpClient, {
    retries: 3, // Número máximo de reintentos
    retryDelay: (retryCount) => {
        // Backoff exponencial: 1s, 2s, 4s
        return Math.min(1000 * Math.pow(2, retryCount - 1), 10000);
    },
    retryCondition: (error) => {
        // Reintentar solo en errores de red y 5xx
        return (
            !error.response || 
            error.code === 'ECONNABORTED' || 
            (error.response && error.response.status >= 500)
        );
    }
});
```

## 📊 Configuración de Logging

### Configuración de Winston
```typescript
// src/utils/logger.ts
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    defaultMeta: { service: 'APIDICAPI' },
    transports: [
        // Archivo para todos los logs
        new winston.transports.File({ 
            filename: 'logs/combined.log',
            maxsize: 5242880, // 5MB
            maxFiles: 5
        }),
        // Archivo solo para errores
        new winston.transports.File({ 
            filename: 'logs/error.log', 
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5
        })
    ]
});
```

## 🏗️ Configuración de Nginx

### Configuración de Proxy Reverso
```nginx
# nginx-1.27.5/conf/nginx.conf

server {
    listen 4443 ssl;
    server_name localhost;
    
    # Certificados SSL
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
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

## 🔒 Configuración de Seguridad

### Headers de Seguridad
```typescript
// src/app.ts
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    }
}));
```

### Configuración CORS
```typescript
// src/app.ts
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://www.apidicapi.com.pe'] 
        : ['http://localhost:3000', 'http://localhost:6002'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## 📈 Configuración de Monitoreo

### Métricas de Rate Limiting
```typescript
// Middleware para monitorear rate limiting
app.use((req, res, next) => {
    const rateLimitInfo = {
        endpoint: req.path,
        method: req.method,
        ip: req.ip,
        timestamp: new Date().toISOString(),
        userAgent: req.get('User-Agent')
    };
    
    logger.info('Rate Limit Check', rateLimitInfo);
    next();
});
```

### Logs de Consultas de Clientes
```typescript
// src/middleware/query-logger.middleware.ts
export const logClientQuery = (req: Request, res: Response, next: NextFunction) => {
    const queryLog = {
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        endpoint: req.path,
        queryParams: req.query,
        pathParams: req.params
    };
    
    logger.info('Client Query', queryLog);
    next();
};
```

## 🚀 Configuración de Producción

### Variables de Entorno de Producción
```env
# .env.production
NODE_ENV=prod
API_TOKEN=token_super_seguro_produccion
PORT=6002

# Configuración optimizada para producción
THEMIS_DICAPI_URL=http://10.202.18.7:8081/uda
THEMIS_DICAPI_LOGIN=OPERADORCLS
THEMIS_DICAPI_PASSWORD=OpCLS2022!

# Logging en producción
LOG_LEVEL=warn
LOG_FILE_PATH=logs/production.log
```

### Configuración de PM2
```javascript
// ecosystem.config.js
module.exports = {
    apps: [{
        name: 'APIDICAPI',
        script: 'dist/index.js',
        instances: 'max',
        exec_mode: 'cluster',
        env: {
            NODE_ENV: 'production',
            PORT: 6002
        },
        error_file: 'logs/pm2-error.log',
        out_file: 'logs/pm2-out.log',
        log_file: 'logs/pm2-combined.log',
        time: true,
        max_memory_restart: '1G',
        restart_delay: 4000,
        max_restarts: 10
    }]
};
```

---

*Configuración Actualizada - APIDICAPI v1.1.0* 