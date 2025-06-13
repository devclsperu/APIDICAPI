import express, { Request, Response, NextFunction } from 'express';
import bearerToken from 'express-bearer-token';
import cors from 'cors';
import { logger } from './utils/logger';
import { queryLoggerMiddleware } from './middleware/query-logger.middleware';
import recordRoutes from './routes/v1/record.routes';
import { globalLimiter } from './config/rateLimit.config';
import './config/env.config';  // Importar la configuración de variables de entorno

const app = express();

// Configuración básica de CORS
app.use(cors({
    origin: '*', // Permite todas las origenes
    methods: ['GET'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para parsear JSON
app.use(express.json());

// Middleware para extraer el token Bearer
app.use(bearerToken());

// Aplicar rate limiting global
app.use(globalLimiter);

// Middleware para logging de consultas de clientes (debe ir antes de las rutas)
app.use(queryLoggerMiddleware);

// Middleware para logging de peticiones
app.use((req: Request, res: Response, next: NextFunction) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});

// Rutas (cada ruta tiene su propio rate limiting específico)
app.use('/api/v1/records', recordRoutes);

// Manejador de rutas no encontradas (404)
app.use((req: Request, res: Response) => {
    logger.warn(`Route not found: ${req.method} ${req.url}`);
    
    // Verificar si la ruta base es correcta
    if (!req.url.startsWith('/api/v1/records')) {
        res.status(404).json({
            success: false,
            error: 'Route not found',
            details: {
                message: 'The base route must start with /api/v1/records',
                availableRoutes: [
                    'GET /api/v1/records/last-hour',
                    'GET /api/v1/records/all-day',
                    'GET /api/v1/records/:id'
                ]
            }
        });
        return;
    }

    // Si la ruta base es correcta pero el endpoint no existe
    res.status(404).json({
        success: false,
        error: 'Endpoint not found',
        details: {
            message: `The endpoint ${req.method} ${req.url} does not exist`,
            availableEndpoints: [
                'GET /api/v1/records/last-hour - Get records from the last hour',
                'GET /api/v1/records/all-day - Get records from the current day',
                'GET /api/v1/records/:id - Get records by specific ID (requires id parameter)'
            ]
        }
    });
});

// Manejador de errores de validación de parámetros
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err.name === 'ValidationError') {
        logger.error(`Validation error: ${err.message}`);
        res.status(400).json({
            success: false,
            error: 'Validation error',
            details: {
                message: err.message,
                parameter: err.param,
                value: err.value
            }
        });
        return;
    }

    // Manejador de errores global
    logger.error(`Unhandled error: ${err.message}`);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

export default app;
