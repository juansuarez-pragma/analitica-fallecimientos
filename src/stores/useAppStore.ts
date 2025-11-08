import { create } from 'zustand';
import type { DeathRecord, FilterState, MapViewState, DeathType } from '../types';

interface AppState {
  // Data
  deathRecords: DeathRecord[];
  filteredRecords: DeathRecord[];

  // Filters
  filters: FilterState;

  // Map
  mapViewState: MapViewState;

  // UI State
  selectedRecord: DeathRecord | null;
  isLoading: boolean;

  // Actions
  setDeathRecords: (records: DeathRecord[]) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
  setMapViewState: (viewState: Partial<MapViewState>) => void;
  setSelectedRecord: (record: DeathRecord | null) => void;
  applyFilters: () => void;
}

const initialFilters: FilterState = {
  years: [],
  deathTypes: [],
  departments: [],
  municipalities: [],
  ageRange: [0, 100],
  gender: [],
  dateRange: [null, null],
};

const initialMapViewState: MapViewState = {
  latitude: 4.5709, // Centro de Colombia
  longitude: -74.2973,
  zoom: 5.5,
  bearing: 0,
  pitch: 0,
};

export const useAppStore = create<AppState>((set, get) => ({
  deathRecords: [],
  filteredRecords: [],
  filters: initialFilters,
  mapViewState: initialMapViewState,
  selectedRecord: null,
  isLoading: false,

  setDeathRecords: (records) => {
    set({ deathRecords: records, filteredRecords: records });
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
    get().applyFilters();
  },

  resetFilters: () => {
    set({ filters: initialFilters });
    get().applyFilters();
  },

  setMapViewState: (viewState) => {
    set((state) => ({
      mapViewState: { ...state.mapViewState, ...viewState },
    }));
  },

  setSelectedRecord: (record) => {
    set({ selectedRecord: record });
  },

  applyFilters: () => {
    const { deathRecords, filters } = get();

    let filtered = [...deathRecords];

    // Filter by years
    if (filters.years.length > 0) {
      filtered = filtered.filter((record) => {
        const year = new Date(record.date).getFullYear();
        return filters.years.includes(year);
      });
    }

    // Filter by death types
    if (filters.deathTypes.length > 0) {
      filtered = filtered.filter((record) =>
        filters.deathTypes.includes(record.type)
      );
    }

    // Filter by departments
    if (filters.departments.length > 0) {
      filtered = filtered.filter((record) =>
        filters.departments.includes(record.location.department)
      );
    }

    // Filter by municipalities
    if (filters.municipalities.length > 0) {
      filtered = filtered.filter((record) =>
        filters.municipalities.includes(record.location.municipality)
      );
    }

    // Filter by age range
    filtered = filtered.filter(
      (record) =>
        record.demographics.age >= filters.ageRange[0] &&
        record.demographics.age <= filters.ageRange[1]
    );

    // Filter by gender
    if (filters.gender.length > 0) {
      filtered = filtered.filter((record) =>
        filters.gender.includes(record.demographics.gender)
      );
    }

    // Filter by date range
    if (filters.dateRange[0] && filters.dateRange[1]) {
      filtered = filtered.filter((record) => {
        const recordDate = new Date(record.date);
        return (
          recordDate >= filters.dateRange[0]! &&
          recordDate <= filters.dateRange[1]!
        );
      });
    }

    set({ filteredRecords: filtered });
  },
}));
