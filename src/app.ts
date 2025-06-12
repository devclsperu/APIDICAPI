import express, { Request, Response, NextFunction } from 'express';
import bearerToken from 'express-bearer-token';
import cors from 'cors';
import { logger } from './utils/logger';
import { queryLoggerMiddleware } from './middleware/query-logger.middleware';
import recordRoutes from './routes/record.routes';
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
app.use('/api/records', recordRoutes);

// Manejador de rutas no encontradas (404)
app.use((req: Request, res: Response) => {
    logger.warn(`Ruta no encontrada: ${req.method} ${req.url}`);
    
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
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err.name === 'ValidationError') {
        logger.error(`Error de validación: ${err.message}`);
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
    logger.error(`Error no manejado: ${err.message}`);
    res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
    });
});

export default app;
