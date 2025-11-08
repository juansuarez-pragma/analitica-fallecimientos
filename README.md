# Colombia Analytics - Visualización Histórica de Mortalidad

Plataforma de visualización interactiva de datos históricos de mortalidad en Colombia. Permite explorar, filtrar y analizar estadísticas de defunciones con mapas de calor geográficos y gráficos analíticos.

## 🎯 Características

- **Mapa Interactivo de Colombia** con tecnología Leaflet + OpenStreetMap
- **17,455 Registros Reales** de muertes violentas en Colombia 2023
- **Heatmap (Mapa de Calor)** para visualizar densidad de eventos
- **Sistema de Filtros Avanzados**:
  - Por año (2023 - datos reales completos)
  - Por tipo de muerte (homicidios y suicidios)
  - Por género
  - Por rango de edad
  - Por departamento
- **Panel de Estadísticas** con gráficos interactivos
- **UI Moderna** con Tailwind CSS y componentes shadcn/ui
- **Responsive Design** para desktop y mobile
- **Dark/Light Mode** con tema personalizable

## 📊 Datos Incluidos

**Total**: 17,455 muertes violentas en Colombia 2023
- **Homicidios**: 14,260 casos (81.7%)
- **Suicidios**: 3,195 casos (18.3%)

**Fuente**: Instituto Nacional de Medicina Legal y Ciencias Forenses
**Disponible en**: datos.gov.co

## 🛠 Stack Tecnológico

### Core
- **React 18** - Framework de UI
- **TypeScript** - Type safety
- **Vite** - Build tool ultra-rápido
- **Tailwind CSS** - Estilos utility-first

### Mapas y Visualización
- **Leaflet** - Librería de mapas open source
- **React-Leaflet** - Componentes React para Leaflet
- **Leaflet.heat** - Plugin de heatmap
- **Recharts** - Gráficos interactivos

### Estado y Gestión
- **Zustand** - Estado global ligero
- **date-fns** - Manejo de fechas

## 🚀 Inicio Rápido

### Prerequisitos
- Node.js 18+
- npm o yarn

### Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# La aplicación estará disponible en http://localhost:5173
```

### Build para Producción

```bash
# Crear build optimizado
npm run build

# Preview del build
npm run preview
```

## 📁 Estructura del Proyecto

```
colombia-analytics/
├── src/
│   ├── components/
│   │   ├── ui/              # Componentes base (Button, Card, etc.)
│   │   ├── map/             # Componentes del mapa
│   │   │   ├── MapContainer.tsx
│   │   │   └── HeatmapLayer.tsx
│   │   ├── filters/         # Sistema de filtros
│   │   │   └── FilterPanel.tsx
│   │   ├── analytics/       # Gráficos y estadísticas
│   │   │   └── StatsPanel.tsx
│   │   └── layout/          # Layouts
│   │       └── MainLayout.tsx
│   ├── stores/              # Estado global (Zustand)
│   │   └── useAppStore.ts
│   ├── types/               # Definiciones de TypeScript
│   │   └── index.ts
│   ├── lib/                 # Utilidades
│   │   └── utils.ts
│   └── App.tsx              # Componente principal
├── public/
│   └── data/                # Datos JSON
│       ├── geo/             # GeoJSON de Colombia
│       └── deaths/          # Datasets de mortalidad
└── package.json
```

## 📊 Formato de Datos

Los datos se almacenan en formato JSON en `public/data/deaths/`. Ejemplo:

```json
{
  "year": 2024,
  "total": 3000,
  "data": [
    {
      "id": 1,
      "date": "2024-01-15",
      "type": "homicidio",
      "location": {
        "department": "Antioquia",
        "municipality": "Medellín",
        "lat": 6.2442,
        "lng": -75.5812
      },
      "demographics": {
        "age": 25,
        "gender": "M"
      }
    }
  ]
}
```

### Tipos de Muerte Soportados
- `natural` - Muerte natural
- `violenta` - Muerte violenta
- `homicidio` - Homicidio
- `suicidio` - Suicidio
- `accidente` - Accidente
- `indeterminada` - Causa indeterminada

## 🗂 Fuentes de Datos Recomendadas

### Para Datos Reales:

1. **DANE - Estadísticas Vitales**
   - https://www.dane.gov.co/index.php/estadisticas-por-tema/salud/nacimientos-y-defunciones
   - Descarga: CSVs de defunciones por año

2. **Medicina Legal - Datos Abiertos**
   - https://www.medicinalegal.gov.co/cifras-estadisticas
   - Categorías: Homicidios, suicidios, accidentes de tránsito

3. **Datos.gov.co**
   - https://www.datos.gov.co
   - Buscar: "defunciones", "mortalidad", "salud"

### Procesamiento de Datos

Para convertir CSVs a JSON, puedes crear un script de procesamiento o usar herramientas como `csv2json`.

## 🎨 Personalización

### Colores del Tema

Edita `src/index.css` para cambiar los colores:

```css
:root {
  --primary: 221.2 83.2% 53.3%;
  --secondary: 210 40% 96.1%;
  /* ... más variables */
}
```

### Estilo del Mapa

En `MapContainer.tsx`, puedes cambiar el tile provider:

```tsx
// Dark mode
<TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

// Terrain
<TileLayer url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png" />
```

### Gradiente del Heatmap

En `HeatmapLayer.tsx`:

```tsx
gradient: {
  0.0: 'blue',
  0.5: 'yellow',
  1.0: 'red',
}
```

## 📈 Próximas Features

- [ ] Integración con API REST para datos dinámicos
- [ ] Exportación de reportes (PDF, CSV)
- [ ] Comparación temporal (slider de años)
- [ ] Clustering de puntos
- [ ] Geocodificación automática
- [ ] Capa de departamentos (choropleth)
- [ ] Animaciones temporales
- [ ] Modo presentación

## 📝 Licencia

MIT License - siéntete libre de usar este proyecto para fines académicos.

---

**Nota**: Este proyecto actualmente usa datos de ejemplo generados aleatoriamente. Para uso en producción, integra datos reales de fuentes oficiales como DANE y Medicina Legal.
