import { logger } from '../utils/logger';

// Configuración específica para producción
export const productionConfig = {
    // Configuración del servidor
    server: {
        port: process.env.PORT || 3000,
        host: process.env.HOST || '0.0.0.0',
        trustProxy: true,
    },

    // Configuración de seguridad
    security: {
        cors: {
            origin: process.env.CORS_ORIGIN || '*',
            methods: ['GET'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: false
        },
        rateLimit: {
            // Rate limiting más estricto para producción
            global: {
                windowMs: 15 * 60 * 1000, // 15 minutos
                max: parseInt(process.env.RATE_LIMIT_GLOBAL_MAX || '100')
            },
            // Límites específicos por endpoint
            endpoints: {
                lastHour: {
                    windowMs: 60 * 60 * 1000, // 1 hora
                    max: 50
                },
                allDay: {
                    windowMs: 60 * 60 * 1000,
                    max: 120
                },
                recordsById: {
                    windowMs: 60 * 60 * 1000,
                    max: 150
                },
                lastHours: {
                    windowMs: 60 * 60 * 1000,
                    max: 40
                },
                dateRange: {
                    windowMs: 60 * 60 * 1000,
                    max: 120
                }
            }
        }
    },

    // Configuración de logging
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        file: {
            enabled: true,
            path: process.env.LOG_FILE_PATH || './logs/production.log',
            maxSize: '20m',
            maxFiles: '14d'
        },
        console: {
            enabled: true
        }
    },

    // Configuración de la API externa
    externalApi: {
        url: process.env.EXTERNAL_API_URL || 'https://themis-clsperu.cls.fr/uda',
        timeout: 30000, // 30 segundos
        retries: 3,
        retryDelay: 1000
    },

    // Configuración de rendimiento
    performance: {
        maxOldSpaceSize: parseInt(process.env.NODE_OPTIONS?.match(/--max-old-space-size=(\d+)/)?.[1] || '2048'),
        compression: true,
        etag: true
    },

    // Configuración de monitoreo
    monitoring: {
        healthCheck: {
            enabled: true,
            path: '/health',
            interval: 30000 // 30 segundos
        },
        metrics: {
            enabled: true,
            path: '/metrics'
        }
    }
};

// Función para validar configuración de producción
export const validateProductionConfig = () => {
    const errors: string[] = [];

    // Validar variables críticas
    if (!process.env.API_TOKEN || process.env.API_TOKEN === 'your_production_api_token_here') {
        errors.push('API_TOKEN debe ser configurado para producción');
    }

    if (!process.env.API_LOGIN || process.env.API_LOGIN === 'your_production_login_here') {
        errors.push('API_LOGIN debe ser configurado para producción');
    }

    if (!process.env.API_PASSWORD || process.env.API_PASSWORD === 'your_production_password_here') {
        errors.push('API_PASSWORD debe ser configurado para producción');
    }

    if (!process.env.EXTERNAL_API_URL) {
        errors.push('EXTERNAL_API_URL debe ser configurado para producción');
    }

    // Validar configuración de rate limiting
    if (productionConfig.security.rateLimit.global.max > 200) {
        errors.push('Rate limit global demasiado alto para producción');
    }

    if (errors.length > 0) {
        logger.error('Errores en configuración de producción:', errors);
        throw new Error(`Configuración de producción inválida: ${errors.join(', ')}`);
    }

    logger.info('Configuración de producción validada correctamente');
};

// Función para obtener rate limiters de producción
export const getProductionRateLimiters = () => {
    const { endpoints } = productionConfig.security.rateLimit;
    
    return {
        lastHour: {
            windowMs: endpoints.lastHour.windowMs,
            max: endpoints.lastHour.max
        },
        allDay: {
            windowMs: endpoints.allDay.windowMs,
            max: endpoints.allDay.max
        },
        recordsById: {
            windowMs: endpoints.recordsById.windowMs,
            max: endpoints.recordsById.max
        },
        lastHours: {
            windowMs: endpoints.lastHours.windowMs,
            max: endpoints.lastHours.max
        },
        dateRange: {
            windowMs: endpoints.dateRange.windowMs,
            max: endpoints.dateRange.max
        }
    };
}; 