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
exports.RecordService = void 0;
const axios_1 = __importDefault(require("axios"));
const logger_1 = require("../utils/logger");
class RecordService {
    constructor() {
        this.apiUrl = process.env.EXTERNAL_API_URL || "";
        this.apiLogin = process.env.API_LOGIN || "";
        this.apiPassword = process.env.API_PASSWORD || "";
    }
    transformRecord(externalRecord) {
        // Convertir transmissionDateTime a Date y restar 5 horas
        const date = new Date(externalRecord.locDate.replace("_", "T") + "Z");
        date.setHours(date.getHours() - 5);
        // Formatear fecha a YYYY/MM/DD HH:MM:SS
        const formattedDate = date
            .toISOString()
            .replace("T", " ")
            .replace("Z", "")
            .replace(/-/g, "/")
            .slice(0, 19);
        return {
            id: externalRecord.activeBeaconRef,
            longitude: externalRecord.loc[0],
            latitude: externalRecord.loc[1],
            transmissionDateTime: formattedDate,
            course: externalRecord.heading,
            speed: externalRecord.speed,
            mobileName: externalRecord.mobileName,
            mobileTypeName: externalRecord.mobileTypeName,
        };
    }
    getDateRange() {
        const to = new Date();
        const from = new Date();
        from.setMonth(from.getMonth() - 1);
        const formatDate = (date) => {
            return date.toISOString().replace("T", "_").replace("Z", "").slice(0, 19);
        };
        return {
            from: formatDate(from),
            to: formatDate(to),
        };
    }
    makeRequest(params) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const url = `${this.apiUrl}/resources/positions`;
                // Construir y loggear el URI completo
                const queryParams = new URLSearchParams(params).toString();
                const fullUri = `${url}?${queryParams}`;
                logger_1.logger.info(`URL de la petición: ${url}`);
                logger_1.logger.info(`URI completo de la consulta: ${fullUri}`);
                logger_1.logger.info(`Parámetros de la petición: ${JSON.stringify(params)}`);
                logger_1.logger.info(`Headers de la petición: ${JSON.stringify({
                    login: this.apiLogin,
                    password: "****",
                    application: "umv",
                })}`);
                const response = yield axios_1.default.get(url, {
                    headers: {
                        login: this.apiLogin,
                        password: this.apiPassword,
                        application: "umv",
                    },
                    params: Object.assign(Object.assign({}, params), { 
                        // Asegurarnos de que estos campos siempre estén presentes
                        fields: "activeBeaconRef,locDate,loc,speed,heading,mobileName,mobileTypeName", orderBy: "locDate" }),
                });
                if (!response.data || !response.data.data) {
                    logger_1.logger.error("Respuesta inválida de la API:", response.data);
                    throw new Error("Respuesta inválida de la API");
                }
                const externalRecords = response.data.data;
                logger_1.logger.info(`Respuesta recibida con ${externalRecords.length} registros`);
                const transformedRecords = externalRecords.map((record) => this.transformRecord(record));
                return {
                    success: true,
                    data: transformedRecords,
                };
            }
            catch (error) {
                logger_1.logger.error(`Error en la petición: ${error.message}`);
                if (error.response) {
                    logger_1.logger.error(`Status: ${error.response.status}`);
                    logger_1.logger.error(`Data: ${JSON.stringify(error.response.data)}`);
                    logger_1.logger.error(`Headers: ${JSON.stringify(error.response.headers)}`);
                }
                throw new Error(`Error en la petición a la API: ${((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || error.message}`);
            }
        });
    }
    getAllDayRecords() {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info('Obteniendo todas las transmisiones del día actual');
            // Obtener fecha actual
            const today = new Date();
            // Establecer inicio del día (00:00:00)
            const startOfDay = new Date(today);
            startOfDay.setHours(0, 0, 0, 0);
            // Establecer fin del día (23:59:59)
            const endOfDay = new Date(today);
            endOfDay.setHours(23, 59, 59, 999);
            // Formatear fechas al formato requerido por la API
            const formatDate = (date) => {
                return date.toISOString()
                    .replace('T', '_')
                    .replace('Z', '')
                    .slice(0, 19);
            };
            const params = {
                from: formatDate(startOfDay),
                to: formatDate(endOfDay),
                dateType: 'location',
                fields: 'activeBeaconRef,locDate,loc,speed,heading,mobileName,mobileTypeName',
                orderBy: 'locDate'
            };
            logger_1.logger.info(`Parámetros para la consulta de todas las transmisiones del día:`, params);
            return this.makeRequest(params);
        });
    }
    getLastHourRecords() {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info("Obteniendo registros de la última hora");
            const params = {
                since: 3600,
                dateType: "location",
                fields: "activeBeaconRef,locDate,loc,speed,heading,mobileName,mobileTypeName",
                orderBy: "locDate",
            };
            return this.makeRequest(params);
        });
    }
    getRecordsById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info(`Obteniendo registros para el ID: ${id}`);
            const { from, to } = this.getDateRange();
            const params = {
                fields: "activeBeaconRef,locDate,loc,speed,heading,mobileName,mobileTypeName",
                queryBy: "beaconRef",
                query: id,
                dateType: "location",
                from,
                to,
                orderBy: "locDate",
            };
            return this.makeRequest(params);
        });
    }
    getLastHoursRecords(hours) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info(`Obteniendo registros de las últimas ${hours} horas`);
            const params = {
                since: hours * 3600, // Convertir horas a segundos
                dateType: "location",
                fields: "activeBeaconRef,locDate,loc,speed,heading,mobileName,mobileTypeName",
                orderBy: "locDate",
            };
            logger_1.logger.info(`Parámetros para la consulta de ${hours} horas:`, params);
            return this.makeRequest(params);
        });
    }
    getRecordsByDateRange(startDateTime, endDateTime) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info(`Obteniendo registros del rango de fecha y hora: ${startDateTime} a ${endDateTime}`);
            // Convertir las fechas y horas a formato requerido por la API (YYYY-MM-DD_HH:mm:ss)
            const formatDateTime = (dateTime) => {
                const d = new Date(dateTime);
                return d.toISOString().replace("T", "_").replace("Z", "").slice(0, 19);
            };
            const params = {
                from: formatDateTime(startDateTime),
                to: formatDateTime(endDateTime),
                dateType: "location",
                fields: "activeBeaconRef,locDate,loc,speed,heading,mobileName,mobileTypeName",
                orderBy: "locDate",
            };
            logger_1.logger.info(`Parámetros para la consulta por rango de fecha y hora:`, params);
            return this.makeRequest(params);
        });
    }
}
exports.RecordService = RecordService;
