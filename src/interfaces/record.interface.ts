export interface ILocation {
    lat: number;
    lon: number;
}

export interface IRecord {
    id: string;
    longitude: number;
    latitude: number;
    transmissionDateTime: string;
    course: number;
    speed: number;
    mobileName: string;
    mobileTypeName: string;
}

export interface IRecordsResponse {
    success: boolean;
    data: IRecord[];
    error?: string;
}

// Interfaz para la respuesta de la API externa
export interface IExternalRecord {
    id: string;
    loc: [number, number];
    locDate: string;
    heading: number;
    speed: number;
    activeBeaconRef: string;
    mobileName: string;
    mobileTypeName: string;
}

export interface IExternalRecordsResponse {
    data: IExternalRecord[];
} 