import { config } from "../config/env.config";
import { HttpClient } from "./http.client";
import { logger } from "../utils/logger";
import {
  IRecordsResponse,
  IExternalRecord,
  IExternalRecordsResponse,
} from "../interfaces/record.interface";

export class RecordService {
  private readonly apiUrl: string;
  private readonly apiLogin: string;
  private readonly apiPassword: string;
  private readonly httpClient: HttpClient;

  constructor() {
    // Validar que las credenciales de themisDICAPI estén disponibles
    if (!config.themisDicapi.url || !config.themisDicapi.login || !config.themisDicapi.password) {
      throw new Error("ThemisDICAPI credentials not configured. Please check THEMIS_DICAPI_URL, THEMIS_DICAPI_LOGIN and THEMIS_DICAPI_PASSWORD environment variables.");
    }
    
    this.apiUrl = config.themisDicapi.url;
    this.apiLogin = config.themisDicapi.login;
    this.apiPassword = config.themisDicapi.password;
    this.httpClient = new HttpClient();
  }

  private transformRecord(externalRecord: IExternalRecord) {
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

  private getDateRange() {
    const to = new Date();
    const from = new Date();
    from.setMonth(from.getMonth() - 1);

    const formatDate = (date: Date) => {
      return date.toISOString().replace("T", "_").replace("Z", "").slice(0, 19);
    };

    return {
      from: formatDate(from),
      to: formatDate(to),
    };
  }

  private async makeRequest(
    params: Record<string, any>
  ): Promise<IRecordsResponse> {
    try {
      const url = `${this.apiUrl}/resources/positions`;

      // Construir y loggear el URI completo
      const queryParams = new URLSearchParams(params).toString();
      const fullUri = `${url}?${queryParams}`;

      logger.info(`Request URL: ${url}`);
      logger.info(`Complete query URI: ${fullUri}`);
      logger.info(`Request parameters: ${JSON.stringify(params)}`);
      logger.info(
        `Request headers: ${JSON.stringify({
          login: this.apiLogin,
          password: "****",
          application: "umv",
        })}`
      );

      const response = await this.httpClient.get(url, {
        ...params,
        // Asegurarnos de que estos campos siempre estén presentes
        fields:
          "activeBeaconRef,locDate,loc,speed,heading,mobileName,mobileTypeName",
        orderBy: "locDate",
      });

      if (!response || !response.data) {
        logger.error("Invalid API response:", response);
        throw new Error("Invalid API response");
      }

      const externalRecords = response.data;
      logger.info(`Response received with ${externalRecords.length} records`);

      const transformedRecords = externalRecords.map((record: any) =>
        this.transformRecord(record)
      );

      return {
        success: true,
        data: transformedRecords,
      };
    } catch (error: any) {
      logger.error(`Request error: ${error.message}`);
      if (error.response) {
        logger.error(`Status: ${error.response.status}`);
        logger.error(`Data: ${JSON.stringify(error.response.data)}`);
        logger.error(`Headers: ${JSON.stringify(error.response.headers)}`);
      }
      throw new Error(
        `API request error: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }

  public async getAllDayRecords(): Promise<IRecordsResponse> {
    logger.info('Obteniendo todas las transmisiones del día actual');
    
    // Obtener fecha actual
    const today = new Date();
    
    // Establecer inicio del día (00:00:00)
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);
    
    // Establecer fin del día (23:59:59)
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    // Formatear fechas al formato requerido por la API
    const formatDate = (date: Date) => {
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

    logger.info(`Parámetros para la consulta de todas las transmisiones del día:`, params);
    return this.makeRequest(params);
  }

  public async getLastHourRecords(): Promise<IRecordsResponse> {
    logger.info("Obteniendo registros de la última hora");

    const params = {
      since: 3600,
      dateType: "location",
      fields:
        "activeBeaconRef,locDate,loc,speed,heading,mobileName,mobileTypeName",
      orderBy: "locDate",
    };

    return this.makeRequest(params);
  }

  public async getRecordsById(id: string): Promise<IRecordsResponse> {
    logger.info(`Obteniendo registros para el ID: ${id}`);

    const { from, to } = this.getDateRange();

    const params = {
      fields:
        "activeBeaconRef,locDate,loc,speed,heading,mobileName,mobileTypeName",
      queryBy: "beaconRef",
      query: id,
      dateType: "location",
      from,
      to,
      orderBy: "locDate",
    };

    return this.makeRequest(params);
  }

  public async getLastHoursRecords(hours: number): Promise<IRecordsResponse> {
    logger.info(`Obteniendo registros de las últimas ${hours} horas`);

    const params = {
      since: hours * 3600, // Convertir horas a segundos
      dateType: "location",
      fields:
        "activeBeaconRef,locDate,loc,speed,heading,mobileName,mobileTypeName",
      orderBy: "locDate",
    };

    logger.info(`Parámetros para la consulta de ${hours} horas:`, params);
    return this.makeRequest(params);
  }

  public async getRecordsByDateRange(
    startDateTime: string,
    endDateTime: string
  ): Promise<IRecordsResponse> {
    logger.info(
      `Obteniendo registros del rango de fecha y hora: ${startDateTime} a ${endDateTime}`
    );

    // Convertir las fechas y horas a formato requerido por la API (YYYY-MM-DD_HH:mm:ss)
    const formatDateTime = (dateTime: string) => {
      const d = new Date(dateTime);
      return d.toISOString().replace("T", "_").replace("Z", "").slice(0, 19);
    };

    const params = {
      from: formatDateTime(startDateTime),
      to: formatDateTime(endDateTime),
      dateType: "location",
      fields:
        "activeBeaconRef,locDate,loc,speed,heading,mobileName,mobileTypeName",
      orderBy: "locDate",
    };

    logger.info(
      `Parámetros para la consulta por rango de fecha y hora:`,
      params
    );

    return this.makeRequest(params);
  }
}
