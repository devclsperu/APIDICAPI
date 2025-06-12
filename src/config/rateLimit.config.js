"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateRangeLimiter = exports.lastHoursLimiter = exports.recordsByIdLimiter = exports.allDayLimiter = exports.lastHourLimiter = exports.developmentLimiter = exports.strictLimiter = exports.recordsLimiter = exports.globalLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const logger_1 = require("../utils/logger");
// Configuración de rate limiting global
exports.globalLimiter = (0, express_rate_limit_1.default)({
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
    standardHeaders: true, // Incluir headers de rate limit en la respuesta
    legacyHeaders: false, // No incluir headers legacy
    handler: (req, res) => {
        logger_1.logger.warn(`Rate limit excedido para IP: ${req.ip}`);
        res.status(429).json({
            success: false,
            error: 'Demasiadas peticiones',
            details: {
                message: 'Has excedido el límite de peticiones. Intenta nuevamente en 15 minutos.',
                limit: 100,
                windowMs: '15 minutos'
            }
        });
    }
});
// Configuración de rate limiting específico para endpoints de registros
exports.recordsLimiter = (0, express_rate_limit_1.default)({
    windowMs: 1 * 60 * 1000, // 1 minuto
    max: 30, // máximo 30 peticiones por minuto
    message: {
        success: false,
        error: 'Demasiadas peticiones a registros',
        details: {
            message: 'Has excedido el límite de peticiones a registros. Intenta nuevamente en 1 minuto.',
            limit: 30,
            windowMs: '1 minuto'
        }
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        logger_1.logger.warn(`Rate limit de registros excedido para IP: ${req.ip}`);
        res.status(429).json({
            success: false,
            error: 'Demasiadas peticiones a registros',
            details: {
                message: 'Has excedido el límite de peticiones a registros. Intenta nuevamente en 1 minuto.',
                limit: 30,
                windowMs: '1 minuto'
            }
        });
    }
});
// Configuración de rate limiting para endpoints específicos (más restrictivo)
exports.strictLimiter = (0, express_rate_limit_1.default)({
    windowMs: 5 * 60 * 1000, // 5 minutos
    max: 10, // máximo 10 peticiones por 5 minutos
    message: {
        success: false,
        error: 'Demasiadas peticiones',
        details: {
            message: 'Has excedido el límite de peticiones. Intenta nuevamente en 5 minutos.',
            limit: 10,
            windowMs: '5 minutos'
        }
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        logger_1.logger.warn(`Rate limit estricto excedido para IP: ${req.ip}`);
        res.status(429).json({
            success: false,
            error: 'Demasiadas peticiones',
            details: {
                message: 'Has excedido el límite de peticiones. Intenta nuevamente en 5 minutos.',
                limit: 10,
                windowMs: '5 minutos'
            }
        });
    }
});
// Configuración de rate limiting para desarrollo (más permisivo)
exports.developmentLimiter = (0, express_rate_limit_1.default)({
    windowMs: 1 * 60 * 1000, // 1 minuto
    max: 1000, // máximo 1000 peticiones por minuto
    message: {
        success: false,
        error: 'Demasiadas peticiones',
        details: {
            message: 'Has excedido el límite de peticiones de desarrollo.',
            limit: 1000,
            windowMs: '1 minuto'
        }
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        logger_1.logger.warn(`Rate limit de desarrollo excedido para IP: ${req.ip}`);
        res.status(429).json({
            success: false,
            error: 'Demasiadas peticiones',
            details: {
                message: 'Has excedido el límite de peticiones de desarrollo.',
                limit: 1000,
                windowMs: '1 minuto'
            }
        });
    }
});
// Rate limiting específico para getLastHourRecords
exports.lastHourLimiter = (0, express_rate_limit_1.default)({
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
    legacyHeaders: false,
    handler: (req, res) => {
        logger_1.logger.warn(`Rate limit de last-hour excedido para IP: ${req.ip}`);
        res.status(429).json({
            success: false,
            error: 'Demasiadas peticiones a last-hour',
            details: {
                message: 'Has excedido el límite de peticiones a last-hour. Intenta nuevamente en 1 hora.',
                limit: 100,
                windowMs: '1 hora'
            }
        });
    }
});
// Rate limiting específico para getAllDayRecords
exports.allDayLimiter = (0, express_rate_limit_1.default)({
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
    legacyHeaders: false,
    handler: (req, res) => {
        logger_1.logger.warn(`Rate limit de all-day excedido para IP: ${req.ip}`);
        res.status(429).json({
            success: false,
            error: 'Demasiadas peticiones a all-day',
            details: {
                message: 'Has excedido el límite de peticiones a all-day. Intenta nuevamente en 1 hora.',
                limit: 240,
                windowMs: '1 hora'
            }
        });
    }
});
// Rate limiting específico para getRecordsById
exports.recordsByIdLimiter = (0, express_rate_limit_1.default)({
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
    legacyHeaders: false,
    handler: (req, res) => {
        logger_1.logger.warn(`Rate limit de records by ID excedido para IP: ${req.ip}`);
        res.status(429).json({
            success: false,
            error: 'Demasiadas peticiones a records by ID',
            details: {
                message: 'Has excedido el límite de peticiones a records by ID. Intenta nuevamente en 1 hora.',
                limit: 300,
                windowMs: '1 hora'
            }
        });
    }
});
// Rate limiting específico para getLastHoursRecords
exports.lastHoursLimiter = (0, express_rate_limit_1.default)({
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
    legacyHeaders: false,
    handler: (req, res) => {
        logger_1.logger.warn(`Rate limit de last hours excedido para IP: ${req.ip}`);
        res.status(429).json({
            success: false,
            error: 'Demasiadas peticiones a last hours',
            details: {
                message: 'Has excedido el límite de peticiones a last hours. Intenta nuevamente en 1 hora.',
                limit: 80,
                windowMs: '1 hora'
            }
        });
    }
});
// Rate limiting específico para getRecordsByDateRange
exports.dateRangeLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 240, // máximo 240 peticiones por hora
    message: {
        success: false,
        error: 'Demasiadas peticiones a date-range',
        details: {
            message: 'Has excedido el límite de peticiones a date-range. Intenta nuevamente en 1 hora.',
            limit: 240,
            windowMs: '1 hora'
        }
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        logger_1.logger.warn(`Rate limit de date-range excedido para IP: ${req.ip}`);
        res.status(429).json({
            success: false,
            error: 'Demasiadas peticiones a date-range',
            details: {
                message: 'Has excedido el límite de peticiones a date-range. Intenta nuevamente en 1 hora.',
                limit: 240,
                windowMs: '1 hora'
            }
        });
    }
});
