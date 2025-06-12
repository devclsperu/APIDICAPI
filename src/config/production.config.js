"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductionRateLimiters = exports.validateProductionConfig = exports.getProductionConfig = exports.productionConfig = void 0;
const logger_1 = require("../utils/logger");
const windows_server_config_1 = require("./windows-server.config");
// Configuración específica para producción
exports.productionConfig = {
    // Configuración del servidor
    server: {
        port: process.env.PORT || 3000,
        host: process.env.HOST || '0.0.0.0',
        trustProxy: true, // Importante para rate limiting con proxy
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
            // Límites específicos por endpoint (ajustar según necesidades de producción)
            endpoints: {
                lastHour: {
                    windowMs: 60 * 60 * 1000, // 1 hora
                    max: 50 // Reducido para producción
                },
                allDay: {
                    windowMs: 60 * 60 * 1000,
                    max: 120 // Reducido para producción
                },
                recordsById: {
                    windowMs: 60 * 60 * 1000,
                    max: 150 // Reducido para producción
                },
                lastHours: {
                    windowMs: 60 * 60 * 1000,
                    max: 40 // Reducido para producción
                },
                dateRange: {
                    windowMs: 60 * 60 * 1000,
                    max: 120 // Reducido para producción
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
        maxOldSpaceSize: parseInt(((_b = (_a = process.env.NODE_OPTIONS) === null || _a === void 0 ? void 0 : _a.match(/--max-old-space-size=(\d+)/)) === null || _b === void 0 ? void 0 : _b[1]) || '2048'),
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
// Función para obtener la configuración apropiada según la plataforma
const getProductionConfig = () => {
    if (process.platform === 'win32') {
        logger_1.logger.info('Detectado Windows Server - usando configuración optimizada para Windows');
        (0, windows_server_config_1.configureWindowsOptimizations)();
        return windows_server_config_1.windowsServerConfig;
    }
    logger_1.logger.info('Usando configuración de producción estándar');
    return exports.productionConfig;
};
exports.getProductionConfig = getProductionConfig;
// Función para validar configuración de producción
const validateProductionConfig = () => {
    if (process.platform === 'win32') {
        return (0, windows_server_config_1.validateWindowsServerConfig)();
    }
    const errors = [];
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
    if (exports.productionConfig.security.rateLimit.global.max > 200) {
        errors.push('Rate limit global demasiado alto para producción');
    }
    if (errors.length > 0) {
        logger_1.logger.error('Errores en configuración de producción:', errors);
        throw new Error(`Configuración de producción inválida: ${errors.join(', ')}`);
    }
    logger_1.logger.info('Configuración de producción validada correctamente');
};
exports.validateProductionConfig = validateProductionConfig;
// Función para obtener rate limiters de producción
const getProductionRateLimiters = () => {
    const config = (0, exports.getProductionConfig)();
    const { endpoints } = config.security.rateLimit;
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
exports.getProductionRateLimiters = getProductionRateLimiters;
