import winston from 'winston';
import path from 'path';
import fs from 'fs';

// Asegurar que el directorio logs existe
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

// Función para obtener el nombre del archivo diario
const getDailyLogFileName = (type: string) => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const fileName = `${type}-${today}.log`;
    const fullPath = path.join(logsDir, fileName);
    console.log(`Creating log file: ${fullPath}`);
    return fullPath;
};

// Logger principal para la aplicación
export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        new winston.transports.File({ 
            filename: getDailyLogFileName('error'), 
            level: 'error' 
        }),
        new winston.transports.File({ 
            filename: getDailyLogFileName('combined')
        })
    ]
});

// Logger específico para consultas de clientes
export const clientLogger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
            return JSON.stringify({
                timestamp,
                level,
                message,
                ...meta
            });
        })
    ),
    transports: [
        new winston.transports.File({ 
            filename: getDailyLogFileName('client-queries'),
            level: 'info'
        })
    ]
});

// Función para loggear consultas de clientes
export const logClientQuery = (endpoint: string, params: any, responseTime: number, statusCode: number, clientIP: string) => {
    console.log(`Logging client query: ${endpoint} from ${clientIP}`);
    clientLogger.info('Client Query', {
        endpoint,
        params,
        responseTime: `${responseTime}ms`,
        statusCode,
        clientIP,
        timestamp: new Date().toISOString()
    });
}; 