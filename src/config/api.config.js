"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiConfig = void 0;
const env_config_1 = require("./env.config");
exports.apiConfig = {
    baseURL: 'https://themis-clsperu.cls.fr/uda',
    timeout: 10000, // 10 segundos
    headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'login': env_config_1.config.apiLogin,
        'password': env_config_1.config.apiPassword,
        'application': 'umv'
    }
};
