# Detalles sobre Variables de Entorno y Configuración

## 📋 Variables de Entorno

### Variables Requeridas

#### Variables Básicas
| Variable | Tipo | Requerida | Descripción | Ejemplo |
|----------|------|-----------|-------------|---------|
| `NODE_ENV` | string | ✅ | Entorno de ejecución | `dev`, `prod`, `test` |
| `API_TOKEN` | string | ✅ | Token de autenticación | `tu_token_seguro` |
| `PORT` | number | ✅ | Puerto del servidor | `6002` |

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

### Configuración Global
```typescript
// src/config/rateLimit.config.ts
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

### Configuración por Endpoint

#### Last Hour Records
```typescript
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
    }
});
```

#### All Day Records
```typescript
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
    }
});
```

#### Records by ID
```typescript
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
    }
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
        'User-Agent': 'APIDICAPI/1.0.0'
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
        winston.format.json()
    ),
    transports: [
        // Logs generales
        new winston.transports.File({
            filename: `logs/combined-${date}.log`,
            maxsize: 5242880, // 5MB
            maxFiles: 5
        }),
        // Logs de errores
        new winston.transports.File({
            filename: `logs/error-${date}.log`,
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5
        })
    ]
});
```

### Configuración de Logs de Consultas
```typescript
// src/middleware/query-logger.middleware.ts
export const queryLoggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        
        logger.info({
            message: 'Client Query',
            endpoint: req.originalUrl,
            method: req.method,
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            responseTime: duration,
            statusCode: res.statusCode,
            timestamp: new Date().toISOString()
        });
    });
    
    next();
};
```

## 🔒 Configuración de Seguridad

### Configuración de CORS
```typescript
// src/app.ts
app.use(cors({
    origin: '*', // Permite todas las origenes
    methods: ['GET'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Configuración de Autenticación
```typescript
// src/middleware/auth.middleware.ts
export const validateToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.token;
    
    if (!token) {
        logger.warn('Request without token');
        return res.status(401).json({
            success: false,
            error: 'Token requerido',
            details: {
                message: 'Se requiere un Bearer Token para acceder a este endpoint'
            }
        });
    }
    
    if (token !== config.apiToken) {
        logger.warn(`Invalid token attempt: ${token}`);
        return res.status(401).json({
            success: false,
            error: 'Token inválido',
            details: {
                message: 'El Bearer Token proporcionado no es válido'
            }
        });
    }
    
    next();
};
```

## 🌐 Configuración de Nginx

### Configuración SSL
```nginx
# nginx/nginx.conf
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
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    
    # Proxy reverso
    location / {
        proxy_pass http://localhost:6002;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }
}
```

## 🔍 Validación de Configuración

### Script de Validación
```typescript
// src/config/env.config.ts
export const validateProductionConfig = () => {
    const requiredEnvVars = [
        'PORT', 
        'API_TOKEN', 
        'NODE_ENV', 
        'THEMIS_FRANCIA_URL',
        'THEMIS_FRANCIA_LOGIN',
        'THEMIS_FRANCIA_PASSWORD',
        'THEMIS_DICAPI_URL',
        'THEMIS_DICAPI_LOGIN',
        'THEMIS_DICAPI_PASSWORD'
    ];
    
    const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
    
    if (missingEnvVars.length > 0) {
        logger.error(`Faltan las siguientes variables de entorno: ${missingEnvVars.join(', ')}`);
        process.exit(1);
    }
};
```

### Verificación de Configuración
```bash
# Verificar variables de entorno
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

## 📝 Archivos de Configuración

### Estructura de Archivos
```
APIDICAPI/
├── .env                    # Variables de entorno desarrollo
├── .env.production         # Variables de entorno producción
├── .env.test              # Variables de entorno pruebas
├── src/config/
│   ├── api.config.ts       # Configuración de API externa
│   ├── env.config.ts       # Carga de variables de entorno
│   ├── rateLimit.config.ts # Configuración de rate limiting
│   └── production.config.ts # Configuración de producción (no usado)
├── nginx/
│   └── nginx.conf          # Configuración de Nginx
└── ecosystem.config.js     # Configuración de PM2 (opcional)
```

### Archivo de Configuración Principal
```typescript
// src/config/env.config.ts
export const config = {
    port: process.env.PORT,
    apiToken: process.env.API_TOKEN,
    nodeEnv: env,
    isProd: env === 'prod',
    isDev: env === 'dev',
    isTest: env === 'test',
    themisFrancia: {
        url: process.env.THEMIS_FRANCIA_URL,
        login: process.env.THEMIS_FRANCIA_LOGIN,
        password: process.env.THEMIS_FRANCIA_PASSWORD
    },
    themisDicapi: {
        url: process.env.THEMIS_DICAPI_URL,
        login: process.env.THEMIS_DICAPI_LOGIN,
        password: process.env.THEMIS_DICAPI_PASSWORD
    }
} as const;
```

## 🔄 Configuración de Entornos

### Mapeo de Entornos
```typescript
const ALLOWED_ENVIRONMENTS = ['dev', 'prod', 'test'] as const;
type Environment = typeof ALLOWED_ENVIRONMENTS[number];

const ENV_FILE_MAP: Record<Environment, string> = {
    dev: '.env',
    prod: '.env.production',
    test: '.env.test'
};
```

### Validación de Entorno
```typescript
const env = (process.env.NODE_ENV || 'dev') as Environment;
const envFile = ENV_FILE_MAP[env];

if (!ALLOWED_ENVIRONMENTS.includes(env)) {
    logger.error(`Entorno no válido: ${env}. Los entornos permitidos son: ${ALLOWED_ENVIRONMENTS.join(', ')}`);
    process.exit(1);
}
```

## 📊 Monitoreo de Configuración

### Log de Configuración
```typescript
logger.info({
    message: 'Configuración cargada',
    envFile,
    ambiente: config.nodeEnv,
    puerto: config.port,
    modo: config.isProd ? 'Producción' : config.isDev ? 'Desarrollo' : 'Pruebas',
    apiUrl: config.themisDicapi.url
});
```

### Métricas de Configuración
- **Entorno activo**: Desarrollo, Producción o Pruebas
- **Puerto configurado**: Puerto del servidor
- **URLs de API**: URLs de Themis configuradas
- **Rate limiting**: Límites configurados por endpoint
- **Timeouts**: Configuración de timeouts de HTTP

---

*Documentación de Configuración - APIDICAPI v1.0.0* 