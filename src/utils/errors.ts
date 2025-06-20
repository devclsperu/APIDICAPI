export class MaxRowsReachedError extends Error {
  public readonly maxRows: number;
  public readonly isMaxRowsError: boolean = true;

  constructor(maxRows: number) {
    super(`La consulta excede el límite máximo de ${maxRows.toLocaleString()} registros`);
    this.name = 'MaxRowsReachedError';
    this.maxRows = maxRows;
  }
}

export class APIError extends Error {
  public readonly statusCode: number;
  public readonly isAPIError: boolean = true;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
  }
} 