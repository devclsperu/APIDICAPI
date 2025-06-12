"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./utils/logger");
const app_1 = __importDefault(require("./app"));
const env_config_1 = require("./config/env.config");
app_1.default.listen(env_config_1.config.port, () => {
    logger_1.logger.info(`Servidor iniciado en http://localhost:${env_config_1.config.port}`);
});
