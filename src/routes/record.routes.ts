import { Router, Request, Response, NextFunction } from 'express';
import { RecordController } from '../controllers/record.controller';
import { validateToken } from '../middleware/auth.middleware';
import { logger } from '../utils/logger';
import { 
    lastHourLimiter, 
    allDayLimiter, 
    recordsByIdLimiter, 
    lastHoursLimiter, 
    dateRangeLimiter 
} from '../config/rateLimit.config';

const router = Router();
const recordController = new RecordController();

// Middleware para validar el parámetro de horas
const validateHoursParam = (req: Request, res: Response, next: NextFunction) => {
    const hours = parseInt(req.params.hours);
    if (isNaN(hours) || hours < 2 || hours > 24) {
        logger.warn(`Parámetro de horas inválido: ${req.params.hours}`);
        res.status(400).json({
            success: false,
            error: 'Parámetro inválido',
            details: {
                message: 'El parámetro de horas debe ser un número entre 2 y 24 (use /last-hour para 1 hora)',
                received: req.params.hours
            }
        });
        return;
    }
    next();
};

// Middleware para validar fecha
const validateDateRange = (req: Request, res: Response, next: NextFunction) => {
    const { date } = req.query;
    
    // Validar que el parámetro exista
    if (!date) {
        logger.warn('Falta parámetro de fecha');
        res.status(400).json({
            success: false,
            error: 'Parámetro requerido',
            details: {
                message: 'Se requiere el parámetro date (formato: DD-MM-YYYY)',
                received: { date }
            }
        });
        return;
    }

    // Validar formato de fecha (DD-MM-YYYY)
    const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
    if (!dateRegex.test(date as string)) {
        logger.warn(`Formato de fecha inválido: date=${date}`);
        res.status(400).json({
            success: false,
            error: 'Formato de fecha inválido',
            details: {
                message: 'La fecha debe estar en formato DD-MM-YYYY',
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
        logger.warn(`Fecha inválida: ${date}`);
        res.status(400).json({
            success: false,
            error: 'Fecha inválida',
            details: {
                message: 'La fecha proporcionada no es válida',
                received: { date }
            }
        });
        return;
    }

    next();
};

// Middleware para validar que la ruta last-hour sea exacta
const validateLastHourRoute = (req: Request, res: Response, next: NextFunction) => {
    // Verificar que la URL completa sea exactamente /api/records/last-hour
    if (req.originalUrl === '/api/records/last-hour') {
        next();
    } else {
        logger.warn(`Ruta no encontrada: ${req.method} ${req.originalUrl}`);
        res.status(404).json({
            success: false,
            error: 'Endpoint no encontrado',
            details: {
                message: `El endpoint ${req.method} ${req.originalUrl} no existe`,
                availableEndpoints: [
                    'GET /api/records/last-hour - Obtiene registros de la última hora',
                    'GET /api/records/last/:hours - Obtiene registros de las últimas N horas (2-24)',
                    'GET /api/records/date-range - Obtiene registros de un día específico (requiere query param: date en formato DD-MM-YYYY)',
                    'GET /api/records/all-day - Obtiene todas las transmisiones del día actual',
                    'GET /api/records/:id - Obtiene registros por ID específico (requiere parámetro id)'
                ]
            }
        });
    }
};

// Ruta específica para last-hour (debe ir antes que la ruta con parámetro)
router.get('/last-hour', validateToken, lastHourLimiter, validateLastHourRoute, (req: Request, res: Response, next: NextFunction) => {
    // Verificación adicional para asegurar que no haya parámetros adicionales
    if (Object.keys(req.query).length > 0) {
        logger.warn(`Parámetros no permitidos en la ruta last-hour: ${JSON.stringify(req.query)}`);
        res.status(400).json({
            success: false,
            error: 'Parámetros no permitidos',
            details: {
                message: 'La ruta /api/records/last-hour no acepta parámetros adicionales'
            }
        });
        return;
    }
    next();
}, recordController.getLastHourRecords.bind(recordController));

// Ruta para obtener registros de las últimas N horas
router.get('/last/:hours', validateToken, lastHoursLimiter, validateHoursParam, recordController.getLastHoursRecords.bind(recordController));

// Nueva ruta para consulta por rango de fechas (DEBE IR ANTES QUE /:id)
router.get('/date-range', validateToken, dateRangeLimiter, validateDateRange, recordController.getRecordsByDateRange.bind(recordController));

// Nueva ruta para obtener todas las transmisiones del día actual (DEBE IR ANTES QUE /:id)
router.get('/all-day', validateToken, allDayLimiter, recordController.getAllDayRecords.bind(recordController));

// Ruta para obtener registros por ID específico (DEBE IR AL FINAL)
router.get('/:id', validateToken, recordsByIdLimiter, (req: Request, res: Response, next: NextFunction) => {
    // Verificar que el ID no sea 'last-hour' o alguna variación
    if (req.params.id.toLowerCase().includes('last-hour')) {
        logger.warn(`Intento de acceso a last-hour con variación: ${req.params.id}`);
        res.status(404).json({
            success: false,
            error: 'Endpoint no encontrado',
            details: {
                message: `El endpoint ${req.method} /api/records/${req.params.id} no existe`,
                availableEndpoints: [
                    'GET /api/records/last-hour - Obtiene registros de la última hora',
                    'GET /api/records/last/:hours - Obtiene registros de las últimas N horas (2-24)',
                    'GET /api/records/date-range - Obtiene registros de un día específico (requiere query param: date en formato DD-MM-YYYY)',
                    'GET /api/records/all-day - Obtiene todas las transmisiones del día actual',
                    'GET /api/records/:id - Obtiene registros por ID específico (requiere parámetro id)'
                ]
            }
        });
        return;
    }
    next();
}, recordController.getRecordsById.bind(recordController));

export default router; 