import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { MaxRowsReachedError } from '../utils/errors';
import { IRecordsResponse } from '../interfaces/record.interface';
import { RecordService } from '../services/record.service';

export class RecordController {
    private recordService: RecordService;

    constructor() {
        this.recordService = new RecordService();
    }

    public async getLastHourRecords(req: Request, res: Response): Promise<void> {
        try {
            logger.info('Solicitud de registros de la última hora');
            const response = await this.recordService.getLastHourRecords();
            
            // La respuesta ya viene transformada del servicio con el formato deseado
            res.status(200).json(response);
            
            logger.info('Registros enviados exitosamente al cliente');
        } catch (error) {
            if (error instanceof MaxRowsReachedError) {
                logger.warn(`MAX_ROWS_REACHED error en getLastHourRecords: ${error.message}`);
                res.status(413).json({
                    success: false,
                    error: 'Límite de registros excedido',
                    details: {
                        message: error.message,
                        maxRows: error.maxRows,
                        suggestion: 'Intenta usar un rango de tiempo más específico'
                    }
                });
                return;
            }
            
            logger.error(`Error al obtener registros: ${error}`);
            const errorResponse: IRecordsResponse = {
                success: false,
                error: 'Error al procesar la solicitud',
                data: []
            };
            res.status(500).json(errorResponse);
        }
    }

    public async getRecordsById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            logger.info(`Solicitud de registros para el ID: ${id}`);
            
            const response = await this.recordService.getRecordsById(id);
            
            res.status(200).json(response);
            
            logger.info(`Registros para ID ${id} enviados exitosamente al cliente`);
        } catch (error) {
            if (error instanceof MaxRowsReachedError) {
                logger.warn(`MAX_ROWS_REACHED error en getRecordsById: ${error.message}`);
                res.status(413).json({
                    success: false,
                    error: 'Límite de registros excedido',
                    details: {
                        message: error.message,
                        maxRows: error.maxRows,
                        suggestion: 'Intenta usar un rango de fechas más específico o filtrar por período'
                    }
                });
                return;
            }
            
            logger.error(`Error al obtener registros por ID: ${error}`);
            const errorResponse: IRecordsResponse = {
                success: false,
                error: 'Error al procesar la solicitud',
                data: []
            };
            res.status(500).json(errorResponse);
        }
    }

    public getLastHoursRecords = async (req: Request, res: Response): Promise<void> => {
        try {
            const hours = parseInt(req.params.hours);
            const records = await this.recordService.getLastHoursRecords(hours);
            res.json({
                success: true,
                data: records
            });
        } catch (error) {
            if (error instanceof MaxRowsReachedError) {
                logger.warn(`MAX_ROWS_REACHED error en getLastHoursRecords: ${error.message}`);
                res.status(413).json({
                    success: false,
                    error: 'Límite de registros excedido',
                    details: {
                        message: error.message,
                        maxRows: error.maxRows,
                        suggestion: 'Intenta reducir el número de horas o usar un rango más específico'
                    }
                });
                return;
            }
            
            logger.error('Error al obtener registros de las últimas horas:', error);
            res.status(500).json({
                success: false,
                error: 'Error al obtener registros',
                details: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    };

    public async getRecordsByDateRange(req: Request, res: Response): Promise<void> {
        try {
            const { date } = req.query;
            logger.info(`Solicitud de registros para la fecha: ${date}`);
            
            // Convertir formato DD-MM-YYYY a YYYY-MM-DD y generar rango del día
            const parseCustomDate = (dateStr: string) => {
                const [day, month, year] = dateStr.split('-');
                return new Date(`${year}-${month}-${day}`);
            };

            const selectedDate = parseCustomDate(date as string);
            
            // Establecer inicio del día (00:00:00)
            const startOfDay = new Date(selectedDate);
            startOfDay.setHours(0, 0, 0, 0);
            
            // Establecer fin del día (23:59:59)
            const endOfDay = new Date(selectedDate);
            endOfDay.setHours(23, 59, 59, 999);

            // Convertir a formato ISO para el servicio
            const startDateTime = startOfDay.toISOString().slice(0, 19);
            const endDateTime = endOfDay.toISOString().slice(0, 19);
            
            const response = await this.recordService.getRecordsByDateRange(
                startDateTime,
                endDateTime
            );
            
            res.status(200).json(response);
            
            logger.info(`Registros de la fecha ${date} enviados exitosamente`);
        } catch (error) {
            if (error instanceof MaxRowsReachedError) {
                logger.warn(`MAX_ROWS_REACHED error en getRecordsByDateRange: ${error.message}`);
                res.status(413).json({
                    success: false,
                    error: 'Límite de registros excedido',
                    details: {
                        message: error.message,
                        maxRows: error.maxRows,
                        suggestion: 'Intenta usar la ruta /select-day que divide la consulta en dos partes'
                    }
                });
                return;
            }
            
            logger.error(`Error al obtener registros por fecha: ${error}`);
            res.status(500).json({
                success: false,
                error: 'Error al procesar la solicitud',
                details: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    }

    public async getAllDayRecords(req: Request, res: Response): Promise<void> {
        try {
            logger.info('Solicitud de todas las transmisiones del día actual');
            
            const response = await this.recordService.getAllDayRecords();
            
            res.status(200).json(response);
            
            logger.info('Todas las transmisiones del día actual enviadas exitosamente');
        } catch (error) {
            if (error instanceof MaxRowsReachedError) {
                logger.warn(`MAX_ROWS_REACHED error en getAllDayRecords: ${error.message}`);
                res.status(413).json({
                    success: false,
                    error: 'Límite de registros excedido',
                    details: {
                        message: error.message,
                        maxRows: error.maxRows,
                        suggestion: 'Intenta usar la ruta /select-day que divide la consulta en dos partes'
                    }
                });
                return;
            }
            
            logger.error(`Error al obtener todas las transmisiones del día: ${error}`);
            res.status(500).json({
                success: false,
                error: 'Error al procesar la solicitud',
                details: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    }

    public async selectDay(req: Request, res: Response): Promise<void> {
        try {
            const { date } = req.query;
            logger.info(`Solicitud de registros para el día completo: ${date}`);
            
            if (!date) {
                logger.warn('Missing date parameter in selectDay');
                res.status(400).json({
                    success: false,
                    error: 'Required parameter',
                    details: {
                        message: 'Date parameter is required (format: DD-MM-YYYY)',
                        received: { date }
                    }
                });
                return;
            }

            const response = await this.recordService.selectDay(date as string);
            
            res.status(200).json(response);
            
            logger.info(`Registros del día completo ${date} enviados exitosamente`);
        } catch (error) {
            if (error instanceof MaxRowsReachedError) {
                logger.warn(`MAX_ROWS_REACHED error en selectDay: ${error.message}`);
                res.status(413).json({
                    success: false,
                    error: 'Límite de registros excedido',
                    details: {
                        message: error.message,
                        maxRows: error.maxRows,
                        suggestion: 'Intenta reducir el rango de fechas o usar filtros más específicos'
                    }
                });
                return;
            }
            
            logger.error(`Error al obtener registros del día completo: ${error}`);
            res.status(500).json({
                success: false,
                error: 'Error al procesar la solicitud',
                details: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    }
} 