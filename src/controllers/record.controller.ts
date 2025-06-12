import { Request, Response } from 'express';
import { logger } from '../utils/logger';
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
            logger.error(`Error al obtener todas las transmisiones del día: ${error}`);
            res.status(500).json({
                success: false,
                error: 'Error al procesar la solicitud',
                details: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    }
} 