import express, { Request, Response } from 'express';
import winston from 'winston';

// Configuración del logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
    logger.info('Acceso a la ruta principal');
    res.json({ message: '¡Hola Mundo!' });
});

app.listen(port, () => {
    logger.info(`Servidor corriendo en http://localhost:${port}`);
}); 