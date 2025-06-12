"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpClient = void 0;
const axios_1 = __importDefault(require("axios"));
const api_config_1 = require("../config/api.config");
const logger_1 = require("../utils/logger");
class HttpClient {
    constructor() {
        this.client = axios_1.default.create(api_config_1.apiConfig);
        // Interceptor para logging de peticiones
        this.client.interceptors.request.use((config) => {
            var _a;
            logger_1.logger.info(`Petición a ${(_a = config.method) === null || _a === void 0 ? void 0 : _a.toUpperCase()} ${config.url}`);
            return config;
        }, (error) => {
            logger_1.logger.error(`Error en petición: ${error.message}`);
            return Promise.reject(error);
        });
        // Interceptor para logging de respuestas
        this.client.interceptors.response.use((response) => {
            var _a;
            logger_1.logger.info(`Respuesta de ${(_a = response.config.method) === null || _a === void 0 ? void 0 : _a.toUpperCase()} ${response.config.url}: ${response.status}`);
            return response;
        }, (error) => {
            logger_1.logger.error(`Error en respuesta: ${error.message}`);
            if (error.response) {
                logger_1.logger.error(`Status: ${error.response.status}, Data: ${JSON.stringify(error.response.data)}`);
            }
            return Promise.reject(error);
        });
    }
    get(url, params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.client.get(url, { params });
                return response.data;
            }
            catch (error) {
                logger_1.logger.error(`Error en GET ${url}: ${error}`);
                throw error;
            }
        });
    }
}
exports.HttpClient = HttpClient;
