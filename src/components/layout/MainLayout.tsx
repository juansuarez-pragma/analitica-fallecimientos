import { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
  sidebar?: ReactNode;
  statsPanel?: ReactNode;
}

export default function MainLayout({ children, sidebar, statsPanel }: MainLayoutProps) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Sidebar izquierdo - Filtros */}
      {sidebar && (
        <aside className="w-80 border-r bg-card overflow-y-auto">
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-2">Colombia Analytics</h1>
            <p className="text-sm text-muted-foreground mb-6">
              Muertes Violentas en Colombia 2023<br/>
              <span className="text-xs">Homicidios y Suicidios - Medicina Legal</span>
            </p>
            {sidebar}
          </div>
        </aside>
      )}

      {/* Área principal - Mapa */}
      <main className="flex-1 relative">
        {children}
      </main>

      {/* Panel derecho - Estadísticas */}
      {statsPanel && (
        <aside className="w-96 border-l bg-card overflow-y-auto">
          <div className="p-6">
            {statsPanel}
          </div>
        </aside>
      )}
    </div>
  );
}
