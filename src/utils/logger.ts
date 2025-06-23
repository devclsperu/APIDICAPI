import winston from 'winston';
import path from 'path';
import fs from 'fs';

// Asegurar que el directorio logs existe con estructura organizada
const logsDir = path.join(process.cwd(), 'logs');
const appDir = path.join(logsDir, 'app');
const queriesDir = path.join(appDir, 'queries');
const combinedDir = path.join(appDir, 'combined');
const errorsDir = path.join(appDir, 'errors');

// Crear directorios si no existen
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}
if (!fs.existsSync(appDir)) {
    fs.mkdirSync(appDir, { recursive: true });
}
if (!fs.existsSync(queriesDir)) {
    fs.mkdirSync(queriesDir, { recursive: true });
}
if (!fs.existsSync(combinedDir)) {
    fs.mkdirSync(combinedDir, { recursive: true });
}
if (!fs.existsSync(errorsDir)) {
    fs.mkdirSync(errorsDir, { recursive: true });
}

// Función para obtener el timestamp en formato peruano
const getPeruTimestamp = () => {
    const now = new Date();
    const peruTime = new Date(now.getTime() - (5 * 60 * 60 * 1000)); // UTC-5
    return peruTime.toISOString().replace('T', ' ').substring(0, 19);
};

// Función para obtener el nombre del archivo diario para logs de la aplicación
const getAppLogFileName = (type: string) => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const fileName = `${type}-${today}.log`;
    let fullPath;
    
    switch(type) {
        case 'error':
            fullPath = path.join(errorsDir, fileName);
            break;
        case 'combined':
            fullPath = path.join(combinedDir, fileName);
            break;
        default:
            fullPath = path.join(combinedDir, fileName);
    }
    
    console.log(`Creating app log file: ${fullPath}`);
    return fullPath;
};

// Función para obtener el nombre del archivo diario para consultas de clientes
const getClientLogFileName = () => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const fileName = `client-queries-${today}.log`;
    const fullPath = path.join(queriesDir, fileName);
    console.log(`Creating client log file: ${fullPath}`);
    return fullPath;
};

// Logger principal para la aplicación
export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({
            format: () => getPeruTimestamp()
        }),
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
            filename: getAppLogFileName('error'), 
            level: 'error' 
        }),
        new winston.transports.File({ 
            filename: getAppLogFileName('combined')
        })
    ]
});

// Logger específico para consultas de clientes
export const clientLogger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({
            format: () => getPeruTimestamp()
        }),
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
            filename: getClientLogFileName(),
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
        timestamp: getPeruTimestamp()
    });
}; 