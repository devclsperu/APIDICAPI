"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const logger_1 = require("../utils/logger");
// Definir los entornos permitidos
const ALLOWED_ENVIRONMENTS = ['dev', 'prod', 'test'];
// Mapeo de entornos a archivos
const ENV_FILE_MAP = {
    dev: '.env',
    prod: '.env.production',
    test: '.env.test'
};
// Determinar el entorno actual
const env = (process.env.NODE_ENV || 'dev');
const envFile = ENV_FILE_MAP[env];
// Validar que el entorno sea válido
if (!ALLOWED_ENVIRONMENTS.includes(env)) {
    logger_1.logger.error(`Entorno no válido: ${env}. Los entornos permitidos son: ${ALLOWED_ENVIRONMENTS.join(', ')}`);
    process.exit(1);
}
// Cargar el archivo de variables de entorno
const result = dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), envFile) });
if (result.error) {
    logger_1.logger.error(`Error al cargar el archivo ${envFile}: ${result.error.message}`);
    process.exit(1);
}
// Validar variables de entorno requeridas
const requiredEnvVars = [
    'PORT',
    'API_TOKEN',
    'API_LOGIN',
    'API_PASSWORD',
    'NODE_ENV',
    'EXTERNAL_API_URL'
];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingEnvVars.length > 0) {
    logger_1.logger.error(`Faltan las siguientes variables de entorno: ${missingEnvVars.join(', ')}`);
    process.exit(1);
}
// Validar que NODE_ENV coincida con el archivo cargado
if (process.env.NODE_ENV !== env) {
    logger_1.logger.error(`NODE_ENV (${process.env.NODE_ENV}) no coincide con el archivo cargado (${envFile})`);
    process.exit(1);
}
// Exportar configuración
exports.config = {
    port: process.env.PORT,
    apiToken: process.env.API_TOKEN,
    apiLogin: process.env.API_LOGIN,
    apiPassword: process.env.API_PASSWORD,
    nodeEnv: env,
    isProd: env === 'prod',
    isDev: env === 'dev',
    isTest: env === 'test',
    externalApiUrl: process.env.EXTERNAL_API_URL
};
// Log único de configuración
logger_1.logger.info({
    message: 'Configuración cargada',
    envFile,
    ambiente: exports.config.nodeEnv,
    puerto: exports.config.port,
    modo: exports.config.isProd ? 'Producción' : exports.config.isDev ? 'Desarrollo' : 'Pruebas',
    apiUrl: exports.config.externalApiUrl
});
