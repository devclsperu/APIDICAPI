import axios from 'axios';
import { apiConfig } from '../config/api.config';
import { logger } from '../utils/logger';

export class HttpClient {
    private client: any;

    constructor() {
        this.client = axios.create(apiConfig);

        // Interceptor para logging de peticiones
        this.client.interceptors.request.use(
            (config: any) => {
                logger.info(`Petición a ${config.method?.toUpperCase()} ${config.url}`);
                return config;
            },
            (error: any) => {
                logger.error(`Error en petición: ${error.message}`);
                return Promise.reject(error);
            }
        );

        // Interceptor para logging de respuestas
        this.client.interceptors.response.use(
            (response: any) => {
                logger.info(`Respuesta de ${response.config.method?.toUpperCase()} ${response.config.url}: ${response.status}`);
                return response;
            },
            (error: any) => {
                logger.error(`Error en respuesta: ${error.message}`);
                if (error.response) {
                    logger.error(`Status: ${error.response.status}, Data: ${JSON.stringify(error.response.data)}`);
                }
                return Promise.reject(error);
            }
        );
    }

    public async get(url: string, params?: any): Promise<any> {
        try {
            const response = await this.client.get(url, { params });
            return response.data;
        } catch (error) {
            logger.error(`Error en GET ${url}: ${error}`);
            throw error;
        }
    }

} 