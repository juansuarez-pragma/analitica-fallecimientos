import { useState } from 'react';
import { MapContainer as LeafletMap, TileLayer, ZoomControl } from 'react-leaflet';
import { useAppStore } from '@/stores/useAppStore';
import HeatmapLayer from './HeatmapLayer';
import 'leaflet/dist/leaflet.css';

export default function MapContainer() {
  const { filteredRecords } = useAppStore();
  const [showHeatmap, setShowHeatmap] = useState(true);

  // Centro de Colombia
  const center: [number, number] = [4.5709, -74.2973];

  return (
    <div className="relative w-full h-full">
      <LeafletMap
        center={center}
        zoom={6}
        className="w-full h-full"
        zoomControl={false}
      >
        {/* Capa de mapa base - OpenStreetMap */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Control de zoom */}
        <ZoomControl position="topright" />

        {/* Capa de heatmap */}
        {showHeatmap && <HeatmapLayer data={filteredRecords} />}
      </LeafletMap>

      {/* Controles de UI personalizados */}
      <div className="absolute top-4 left-4 z-[1000]">
        <div className="bg-card rounded-lg shadow-lg p-4 space-y-2">
          <h3 className="text-sm font-semibold">Visualización</h3>
          <label className="flex items-center space-x-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={showHeatmap}
              onChange={(e) => setShowHeatmap(e.target.checked)}
              className="rounded"
            />
            <span>Mapa de calor</span>
          </label>
        </div>
      </div>

      {/* Contador de registros */}
      <div className="absolute bottom-4 left-4 z-[1000]">
        <div className="bg-card rounded-lg shadow-lg px-4 py-2">
          <p className="text-sm">
            <span className="font-semibold">{filteredRecords.length}</span>{' '}
            {filteredRecords.length === 1 ? 'registro' : 'registros'}
          </p>
        </div>
      </div>
    </div>
  );
}
