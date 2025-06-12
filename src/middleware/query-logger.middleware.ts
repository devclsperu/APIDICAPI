import { Request, Response, NextFunction } from 'express';
import { logClientQuery } from '../utils/logger';

export const queryLoggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
    
    console.log(`Middleware: Request from ${clientIP} to ${req.originalUrl}`);
    
    // Capturar la respuesta original
    const originalSend = res.send;
    const originalJson = res.json;
    
    // Interceptar respuestas
    res.send = function(data: any) {
        const responseTime = Date.now() - startTime;
        const endpoint = req.originalUrl;
        const params = {
            query: req.query,
            params: req.params,
            method: req.method
        };
        
        console.log(`Middleware: Logging send response for ${endpoint}`);
        logClientQuery(endpoint, params, responseTime, res.statusCode, clientIP);
        
        return originalSend.call(this, data);
    };
    
    res.json = function(data: any) {
        const responseTime = Date.now() - startTime;
        const endpoint = req.originalUrl;
        const params = {
            query: req.query,
            params: req.params,
            method: req.method
        };
        
        console.log(`Middleware: Logging json response for ${endpoint}`);
        logClientQuery(endpoint, params, responseTime, res.statusCode, clientIP);
        
        return originalJson.call(this, data);
    };
    
    next();
}; 