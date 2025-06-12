"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_bearer_token_1 = __importDefault(require("express-bearer-token"));
const cors_1 = __importDefault(require("cors"));
const logger_1 = require("./utils/logger");
const record_routes_1 = __importDefault(require("./routes/record.routes"));
const rateLimit_config_1 = require("./config/rateLimit.config");
require("./config/env.config"); // Importar la configuración de variables de entorno
const app = (0, express_1.default)();
// Configuración básica de CORS
app.use((0, cors_1.default)({
    origin: '*', // Permite todas las origenes
    methods: ['GET'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// Middleware para parsear JSON
app.use(express_1.default.json());
// Middleware para extraer el token Bearer
app.use((0, express_bearer_token_1.default)());
// Aplicar rate limiting global
app.use(rateLimit_config_1.globalLimiter);
// Middleware para logging de peticiones
app.use((req, res, next) => {
    logger_1.logger.info(`${req.method} ${req.url}`);
    next();
});
// Rutas (cada ruta tiene su propio rate limiting específico)
app.use('/api/records', record_routes_1.default);
// Manejador de rutas no encontradas (404)
app.use((req, res) => {
    logger_1.logger.warn(`Ruta no encontrada: ${req.method} ${req.url}`);
    // Verificar si la ruta base es correcta
    if (!req.url.startsWith('/api/records')) {
        res.status(404).json({
            success: false,
            error: 'Ruta no encontrada',
            details: {
                message: 'La ruta base debe comenzar con /api/records',
                availableRoutes: [
                    'GET /api/records/last-hour',
                    'GET /api/records/all-day',
                    'GET /api/records/:id'
                ]
            }
        });
        return;
    }
    // Si la ruta base es correcta pero el endpoint no existe
    res.status(404).json({
        success: false,
        error: 'Endpoint no encontrado',
        details: {
            message: `El endpoint ${req.method} ${req.url} no existe`,
            availableEndpoints: [
                'GET /api/records/last-hour - Obtiene registros de la última hora',
                'GET /api/records/all-day - Obtiene registros de todo el día',
                'GET /api/records/:id - Obtiene registros por ID específico (requiere parámetro id)'
            ]
        }
    });
});
// Manejador de errores de validación de parámetros
app.use((err, req, res, next) => {
    if (err.name === 'ValidationError') {
        logger_1.logger.error(`Error de validación: ${err.message}`);
        res.status(400).json({
            success: false,
            error: 'Error de validación',
            details: {
                message: err.message,
                parameter: err.param,
                value: err.value
            }
        });
        return;
    }
    // Manejador de errores global
    logger_1.logger.error(`Error no manejado: ${err.message}`);
    res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
    });
});
exports.default = app;
