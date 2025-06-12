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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecordController = void 0;
const logger_1 = require("../utils/logger");
const record_service_1 = require("../services/record.service");
class RecordController {
    constructor() {
        this.getLastHoursRecords = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const hours = parseInt(req.params.hours);
                const records = yield this.recordService.getLastHoursRecords(hours);
                res.json({
                    success: true,
                    data: records
                });
            }
            catch (error) {
                logger_1.logger.error('Error al obtener registros de las últimas horas:', error);
                res.status(500).json({
                    success: false,
                    error: 'Error al obtener registros',
                    details: error instanceof Error ? error.message : 'Error desconocido'
                });
            }
        });
        this.recordService = new record_service_1.RecordService();
    }
    getLastHourRecords(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.logger.info('Solicitud de registros de la última hora');
                const response = yield this.recordService.getLastHourRecords();
                // La respuesta ya viene transformada del servicio con el formato deseado
                res.status(200).json(response);
                logger_1.logger.info('Registros enviados exitosamente al cliente');
            }
            catch (error) {
                logger_1.logger.error(`Error al obtener registros: ${error}`);
                const errorResponse = {
                    success: false,
                    error: 'Error al procesar la solicitud',
                    data: []
                };
                res.status(500).json(errorResponse);
            }
        });
    }
    getRecordsById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                logger_1.logger.info(`Solicitud de registros para el ID: ${id}`);
                const response = yield this.recordService.getRecordsById(id);
                res.status(200).json(response);
                logger_1.logger.info(`Registros para ID ${id} enviados exitosamente al cliente`);
            }
            catch (error) {
                logger_1.logger.error(`Error al obtener registros por ID: ${error}`);
                const errorResponse = {
                    success: false,
                    error: 'Error al procesar la solicitud',
                    data: []
                };
                res.status(500).json(errorResponse);
            }
        });
    }
    getRecordsByDateRange(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { date } = req.query;
                logger_1.logger.info(`Solicitud de registros para la fecha: ${date}`);
                // Convertir formato DD-MM-YYYY a YYYY-MM-DD y generar rango del día
                const parseCustomDate = (dateStr) => {
                    const [day, month, year] = dateStr.split('-');
                    return new Date(`${year}-${month}-${day}`);
                };
                const selectedDate = parseCustomDate(date);
                // Establecer inicio del día (00:00:00)
                const startOfDay = new Date(selectedDate);
                startOfDay.setHours(0, 0, 0, 0);
                // Establecer fin del día (23:59:59)
                const endOfDay = new Date(selectedDate);
                endOfDay.setHours(23, 59, 59, 999);
                // Convertir a formato ISO para el servicio
                const startDateTime = startOfDay.toISOString().slice(0, 19);
                const endDateTime = endOfDay.toISOString().slice(0, 19);
                const response = yield this.recordService.getRecordsByDateRange(startDateTime, endDateTime);
                res.status(200).json(response);
                logger_1.logger.info(`Registros de la fecha ${date} enviados exitosamente`);
            }
            catch (error) {
                logger_1.logger.error(`Error al obtener registros por fecha: ${error}`);
                res.status(500).json({
                    success: false,
                    error: 'Error al procesar la solicitud',
                    details: error instanceof Error ? error.message : 'Error desconocido'
                });
            }
        });
    }
    getAllDayRecords(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.logger.info('Solicitud de todas las transmisiones del día actual');
                const response = yield this.recordService.getAllDayRecords();
                res.status(200).json(response);
                logger_1.logger.info('Todas las transmisiones del día actual enviadas exitosamente');
            }
            catch (error) {
                logger_1.logger.error(`Error al obtener todas las transmisiones del día: ${error}`);
                res.status(500).json({
                    success: false,
                    error: 'Error al procesar la solicitud',
                    details: error instanceof Error ? error.message : 'Error desconocido'
                });
            }
        });
    }
}
exports.RecordController = RecordController;
