import { config } from './env.config';

export const apiConfig = {
    baseURL: 'https://themis-clsperu.cls.fr/uda',
    timeout: 10000, // 10 segundos
    headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'login': config.apiLogin,
        'password': config.apiPassword,
        'application': 'umv'
    }
} as const; 