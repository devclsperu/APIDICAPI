import { config } from './env.config';
import axios from 'axios';

export const apiConfig = {
    baseURL: config.themisDicapi.url,
    timeout: 30000, // 30 segundos (aumentado de 10)
    headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'login': config.themisDicapi.login,
        'password': config.themisDicapi.password,
        'application': 'umv'
    }
} as const;

// Configuración para reintentos
export const retryConfig = {
    retries: 3, // Número de reintentos
    retryDelay: (retryCount: number) => {
        // Backoff exponencial: 1s, 2s, 4s
        return Math.min(1000 * Math.pow(2, retryCount - 1), 10000);
    },
    retryCondition: (error: any) => {
        // Reintentar en errores de red, timeouts y códigos 5xx
        return (
            axios.isAxiosError(error) &&
            (
                !error.response || // Error de red
                error.code === 'ECONNABORTED' || // Timeout
                (error.response && error.response.status >= 500) // Errores del servidor
            )
        );
    },
    onRetry: (retryCount: number, error: any, requestConfig: any) => {
        console.log(`Retry attempt ${retryCount} for ${requestConfig.url}`);
    }
} as const; 