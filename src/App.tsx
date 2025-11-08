import { useEffect, useState } from 'react';
import MainLayout from './components/layout/MainLayout';
import MapContainer from './components/map/MapContainer';
import FilterPanel from './components/filters/FilterPanel';
import StatsPanel from './components/analytics/StatsPanel';
import { useAppStore } from './stores/useAppStore';

function App() {
  const { setDeathRecords } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Cargar datos reales de homicidios 2023
    async function loadData() {
      try {
        setLoading(true);
        const response = await fetch('/data/deaths/deaths-2023.json');

        if (!response.ok) {
          throw new Error('Error cargando datos');
        }

        const dataset = await response.json();
        console.log(`Cargados ${dataset.total} registros de homicidios en Colombia 2023`);
        console.log('Fuente:', dataset.metadata.source);

        setDeathRecords(dataset.data);
        setLoading(false);
      } catch (err) {
        console.error('Error cargando datos:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
        setLoading(false);
      }
    }

    loadData();
  }, [setDeathRecords]);

  // Mostrar loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-lg text-foreground">Cargando datos de muertes violentas 2023...</p>
          <p className="text-sm text-muted-foreground mt-2">
            Homicidios y Suicidios - Instituto Nacional de Medicina Legal
          </p>
        </div>
      </div>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center p-8 bg-destructive/10 rounded-lg">
          <p className="text-lg text-destructive mb-2">Error al cargar datos</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <MainLayout
      sidebar={<FilterPanel />}
      statsPanel={<StatsPanel />}
    >
      <MapContainer />
    </MainLayout>
  );
}

export default App;
