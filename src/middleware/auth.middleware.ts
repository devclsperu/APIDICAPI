import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { config } from '../config/env.config';

export const validateToken = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.token;
    
    if (!token) {
        logger.warn('Intento de acceso sin token');
        res.status(401).json({
            success: false,
            error: 'Token no proporcionado'
        });
        return;
    }

    if (token !== config.apiToken) {
        logger.warn(`Intento de acceso con token inválido: ${token}`);
        res.status(403).json({
            success: false,
            error: 'Token inválido'
        });
        return;
    }

    logger.info('Token validado correctamente');
    next();
}; 