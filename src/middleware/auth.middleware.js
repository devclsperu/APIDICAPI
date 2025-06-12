"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateToken = void 0;
const logger_1 = require("../utils/logger");
const env_config_1 = require("../config/env.config");
const validateToken = (req, res, next) => {
    const token = req.token;
    if (!token) {
        logger_1.logger.warn('Intento de acceso sin token');
        res.status(401).json({
            success: false,
            error: 'Token no proporcionado'
        });
        return;
    }
    if (token !== env_config_1.config.apiToken) {
        logger_1.logger.warn(`Intento de acceso con token inválido: ${token}`);
        res.status(403).json({
            success: false,
            error: 'Token inválido'
        });
        return;
    }
    logger_1.logger.info('Token validado correctamente');
    next();
};
exports.validateToken = validateToken;
