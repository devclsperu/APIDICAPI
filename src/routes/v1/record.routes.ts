import { Router, Request, Response, NextFunction } from 'express';
import { RecordController } from '../../controllers/record.controller';
import { validateToken } from '../../middleware/auth.middleware';
import { logger } from '../../utils/logger';
import { 
    lastHourLimiter, 
    allDayLimiter, 
    recordsByIdLimiter, 
    lastHoursLimiter, 
    selectDayLimiter
} from '../../config/rateLimit.config';

const router = Router();
const recordController = new RecordController();

// ========================================
// MIDDLEWARES DE VALIDACIÓN
// ========================================

/**
 * Valida que el parámetro de horas esté en el rango válido (2-24)
 */
const validateHoursParam = (req: Request, res: Response, next: NextFunction) => {
    const hours = parseInt(req.params.hours);
    if (isNaN(hours) || hours < 2 || hours > 24) {
        logger.warn(`Invalid hours parameter: ${req.params.hours}`);
        res.status(400).json({
            success: false,
            error: 'Invalid parameter',
            details: {
                message: 'The hours parameter must be a number between 2 and 24 (use /last-hour for 1 hour)',
                received: req.params.hours
            }
        });
        return;
    }
    next();
};

/**
 * Valida el formato de fecha DD-MM-YYYY y que sea una fecha válida
 */
const validateDateRange = (req: Request, res: Response, next: NextFunction) => {
    const { date } = req.query;
    
    // Validar que el parámetro exista
    if (!date) {
        logger.warn('Missing date parameter');
        res.status(400).json({
            success: false,
            error: 'Required parameter',
            details: {
                message: 'Date parameter is required (format: DD-MM-YYYY)',
                received: { date }
            }
        });
        return;
    }

    // Validar formato de fecha (DD-MM-YYYY)
    const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
    if (!dateRegex.test(date as string)) {
        logger.warn(`Invalid date format: date=${date}`);
        res.status(400).json({
            success: false,
            error: 'Invalid date format',
            details: {
                message: 'Date must be in DD-MM-YYYY format',
                received: { date }
            }
        });
        return;
    }

    // Validar que la fecha sea válida
    const parseCustomDate = (dateStr: string) => {
        // Convertir DD-MM-YYYY a YYYY-MM-DD
        const [day, month, year] = dateStr.split('-');
        return new Date(`${year}-${month}-${day}`);
    };

    const selectedDate = parseCustomDate(date as string);
    
    if (isNaN(selectedDate.getTime())) {
        logger.warn(`Invalid date: ${date}`);
        res.status(400).json({
            success: false,
            error: 'Invalid date',
            details: {
                message: 'The provided date is not valid',
                received: { date }
            }
        });
        return;
    }

    next();
};

/**
 * Valida que la ruta last-hour sea exacta sin parámetros adicionales
 */
const validateLastHourRoute = (req: Request, res: Response, next: NextFunction) => {
    // Verificar que la URL completa sea exactamente /api/v1/records/last-hour
    if (req.originalUrl === '/api/v1/records/last-hour') {
        next();
    } else {
        logger.warn(`Route not found: ${req.method} ${req.originalUrl}`);
        res.status(404).json({
            success: false,
            error: 'Endpoint not found',
            details: {
                message: `The endpoint ${req.method} ${req.originalUrl} does not exist`,
                availableEndpoints: [
                    'GET /api/v1/records/last-hour - Get records from the last hour',
                    'GET /api/v1/records/last/:hours - Get records from the last N hours (2-24)',
                    'GET /api/v1/records/select-day - Get records from a specific day (requires query param: date in DD-MM-YYYY format)',
                    'GET /api/v1/records/all-day - Get all transmissions from the current day',
                    'GET /api/v1/records/:id - Get records by specific ID (requires id parameter)'
                ]
            }
        });
    }
};

// ========================================
// RUTAS ESPECÍFICAS (SIN PARÁMETROS)
// ========================================

/**
 * GET /api/v1/records/last-hour
 * Obtiene registros de la última hora
 */
router.get('/last-hour', validateToken, lastHourLimiter, validateLastHourRoute, (req: Request, res: Response, next: NextFunction) => {
    // Verificación adicional para asegurar que no haya parámetros adicionales
    if (Object.keys(req.query).length > 0) {
        logger.warn(`Parameters not allowed in last-hour route: ${JSON.stringify(req.query)}`);
        res.status(400).json({
            success: false,
            error: 'Parameters not allowed',
            details: {
                message: 'The route /api/v1/records/last-hour does not accept additional parameters'
            }
        });
        return;
    }
    next();
}, recordController.getLastHourRecords.bind(recordController));

/**
 * GET /api/v1/records/all-day
 * Obtiene todas las transmisiones del día actual
 */
router.get('/all-day', validateToken, allDayLimiter, recordController.getAllDayRecords.bind(recordController));

/**
 * GET /api/v1/records/select-day
 * Obtiene registros de un día específico dividido en dos consultas
 */
router.get('/select-day', validateToken, selectDayLimiter, validateDateRange, recordController.selectDay.bind(recordController));

// ========================================
// RUTAS CON PARÁMETROS
// ========================================

/**
 * GET /api/v1/records/last/:hours
 * Obtiene registros de las últimas N horas (2-24)
 */
router.get('/last/:hours', validateToken, lastHoursLimiter, validateHoursParam, recordController.getLastHoursRecords.bind(recordController));

/**
 * GET /api/v1/records/:id
 * Obtiene registros por ID específico
 * DEBE IR AL FINAL para evitar conflictos con rutas específicas
 */
router.get('/:id', validateToken, recordsByIdLimiter, (req: Request, res: Response, next: NextFunction) => {
    // Verificar que el ID no sea 'last-hour' o alguna variación
    if (req.params.id.toLowerCase().includes('last-hour')) {
        logger.warn(`Attempt to access last-hour with variation: ${req.params.id}`);
        res.status(404).json({
            success: false,
            error: 'Endpoint not found',
            details: {
                message: `The endpoint ${req.method} /api/v1/records/${req.params.id} does not exist`,
                availableEndpoints: [
                    'GET /api/v1/records/last-hour - Get records from the last hour',
                    'GET /api/v1/records/last/:hours - Get records from the last N hours (2-24)',
                    'GET /api/v1/records/select-day - Get records from a specific day (requires query param: date in DD-MM-YYYY format)',
                    'GET /api/v1/records/all-day - Get all transmissions from the current day',
                    'GET /api/v1/records/:id - Get records by specific ID (requires id parameter)'
                ]
            }
        });
        return;
    }
    next();
}, recordController.getRecordsById.bind(recordController));

export default router; 