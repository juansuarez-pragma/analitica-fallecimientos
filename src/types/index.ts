// Location types
export interface Location {
  department: string;
  municipality: string;
  lat: number;
  lng: number;
}

// Death types
export type DeathType =
  | 'natural'
  | 'violenta'
  | 'accidente'
  | 'suicidio'
  | 'homicidio'
  | 'indeterminada';

export type DeathSubtype =
  | 'accidente_transito'
  | 'ahogamiento'
  | 'caida'
  | 'intoxicacion'
  | 'arma_fuego'
  | 'arma_blanca'
  | 'otro';

// Demographics
export interface Demographics {
  age: number;
  gender: 'M' | 'F' | 'O';
}

// Death record
export interface DeathRecord {
  id: string | number;
  date: string; // ISO 8601 format
  type: DeathType;
  subtype?: DeathSubtype;
  location: Location;
  demographics: Demographics;
  source?: string;
}

// Dataset
export interface DeathDataset {
  year: number;
  total: number;
  data: DeathRecord[];
  metadata?: {
    source: string;
    lastUpdated: string;
    description?: string;
  };
}

// Filter state
export interface FilterState {
  years: number[];
  deathTypes: DeathType[];
  departments: string[];
  municipalities: string[];
  ageRange: [number, number];
  gender: ('M' | 'F' | 'O')[];
  dateRange: [Date | null, Date | null];
}

// Map view state
export interface MapViewState {
  latitude: number;
  longitude: number;
  zoom: number;
  bearing?: number;
  pitch?: number;
}

// Statistics
export interface Statistics {
  total: number;
  byType: Record<DeathType, number>;
  byDepartment: Record<string, number>;
  byMonth: Record<string, number>;
  byAge: Record<string, number>;
  byGender: Record<string, number>;
}
