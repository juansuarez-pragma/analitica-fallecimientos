import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';
import type { DeathRecord } from '@/types';

interface HeatmapLayerProps {
  data: DeathRecord[];
  radius?: number;
  blur?: number;
  maxZoom?: number;
}

export default function HeatmapLayer({
  data,
  radius = 25,
  blur = 15,
  maxZoom = 17,
}: HeatmapLayerProps) {
  const map = useMap();

  useEffect(() => {
    if (!map || data.length === 0) return;

    // Convertir datos a formato de leaflet.heat: [lat, lng, intensity]
    const heatPoints: [number, number, number][] = data.map((record) => [
      record.location.lat,
      record.location.lng,
      1, // Intensidad (puede ser ajustada según el tipo de muerte)
    ]);

    // Crear capa de heatmap
    // @ts-ignore - leaflet.heat no tiene tipos oficiales completos
    const heatLayer = L.heatLayer(heatPoints, {
      radius,
      blur,
      maxZoom,
      gradient: {
        0.0: 'blue',
        0.2: 'cyan',
        0.4: 'lime',
        0.6: 'yellow',
        0.8: 'orange',
        1.0: 'red',
      },
    });

    heatLayer.addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, data, radius, blur, maxZoom]);

  return null;
}
