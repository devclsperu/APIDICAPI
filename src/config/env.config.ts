import dotenv from 'dotenv';
import path from 'path';
import { logger } from '../utils/logger';

// Definir los entornos permitidos
const ALLOWED_ENVIRONMENTS = ['dev', 'prod', 'test'] as const;
type Environment = typeof ALLOWED_ENVIRONMENTS[number];

// Mapeo de entornos a archivos
const ENV_FILE_MAP: Record<Environment, string> = {
    dev: '.env',
    prod: '.env.production',
    test: '.env.test'
};

// Determinar el entorno actual
const env = (process.env.NODE_ENV || 'dev') as Environment;
const envFile = ENV_FILE_MAP[env];

// Validar que el entorno sea válido
if (!ALLOWED_ENVIRONMENTS.includes(env)) {
    logger.error(`Entorno no válido: ${env}. Los entornos permitidos son: ${ALLOWED_ENVIRONMENTS.join(', ')}`);
    process.exit(1);
}

// Cargar el archivo de variables de entorno
const result = dotenv.config({ path: path.resolve(process.cwd(), envFile) });

if (result.error) {
    logger.error(`Error al cargar el archivo ${envFile}: ${result.error.message}`);
    process.exit(1);
}

// Validar variables de entorno requeridas
const requiredEnvVars = [
    'PORT', 
    'API_TOKEN', 
    'NODE_ENV', 
    // Variables para themisFrancia
    'THEMIS_FRANCIA_URL',
    'THEMIS_FRANCIA_LOGIN',
    'THEMIS_FRANCIA_PASSWORD',
    // Variables para themisDICAPI
    'THEMIS_DICAPI_URL',
    'THEMIS_DICAPI_LOGIN',
    'THEMIS_DICAPI_PASSWORD'
];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    logger.error(`Faltan las siguientes variables de entorno: ${missingEnvVars.join(', ')}`);
    process.exit(1);
}

// Validar que NODE_ENV coincida con el archivo cargado
if (process.env.NODE_ENV !== env) {
    logger.error(`NODE_ENV (${process.env.NODE_ENV}) no coincide con el archivo cargado (${envFile})`);
    process.exit(1);
}

// Exportar configuración
export const config = {
    port: process.env.PORT,
    apiToken: process.env.API_TOKEN,
    nodeEnv: env,
    isProd: env === 'prod',
    isDev: env === 'dev',
    isTest: env === 'test',
    // Configuración para themisFrancia
    themisFrancia: {
        url: process.env.THEMIS_FRANCIA_URL,
        login: process.env.THEMIS_FRANCIA_LOGIN,
        password: process.env.THEMIS_FRANCIA_PASSWORD
    },
    // Configuración para themisDICAPI
    themisDicapi: {
        url: process.env.THEMIS_DICAPI_URL,
        login: process.env.THEMIS_DICAPI_LOGIN,
        password: process.env.THEMIS_DICAPI_PASSWORD
    }
} as const;

// Log único de configuración
logger.info({
    message: 'Configuración cargada',
    envFile,
    ambiente: config.nodeEnv,
    puerto: config.port,
    modo: config.isProd ? 'Producción' : config.isDev ? 'Desarrollo' : 'Pruebas',
    apiUrl: config.themisDicapi.url
}); 