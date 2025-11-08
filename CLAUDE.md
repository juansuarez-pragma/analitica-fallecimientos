# Colombia Analytics - Guía para Claude Code

Este documento proporciona contexto esencial para instancias de Claude Code trabajando en este repositorio.

## 🎯 Resumen del Proyecto

**Colombia Analytics** es una aplicación web profesional de nivel académico para visualizar datos históricos de mortalidad en Colombia. Muestra **17,455 registros reales de muertes violentas del 2023** (14,260 homicidios + 3,195 suicidios) en un mapa interactivo con visualización de mapa de calor y capacidades completas de filtrado.

**Fuente de Datos**: Instituto Nacional de Medicina Legal y Ciencias Forenses vía datos.gov.co
**Tecnología**: Stack 100% open-source (React + Leaflet + OpenStreetMap)
**Propósito**: Visualización académica de datos reales del gobierno colombiano

## 🚀 Comandos Esenciales

```bash
# Desarrollo
npm run dev              # Iniciar servidor de desarrollo (http://localhost:5173)
npm run build            # Build de producción
npm run preview          # Previsualizar build de producción

# Procesamiento de Datos
node scripts/process-all-deaths.cjs    # Procesar datos combinados de homicidios + suicidios
node scripts/process-homicides.cjs     # Procesar solo datos de homicidios

# Descargar datos frescos desde datos.gov.co
curl -s "https://www.datos.gov.co/resource/vtub-3de2.json?\$where=a_o_del_hecho='2023'&\$limit=15000" \
  -o public/data/raw/homicidios-2023-raw.json

curl -s "https://www.datos.gov.co/resource/f75u-mirk.json?\$where=a_o_del_hecho='2023'&\$limit=5000" \
  -o public/data/raw/suicidios-2023-raw.json
```

## 🏗 Arquitectura

### Stack Tecnológico
- **React 18** + **TypeScript** - Framework de UI con seguridad de tipos
- **Vite** - Herramienta de build (HMR rápido, builds optimizados)
- **Leaflet** + **React-Leaflet** - Mapas open-source (NO Mapbox)
- **Leaflet.heat** - Plugin de visualización de mapa de calor
- **Zustand** - Gestión de estado global liviana
- **Tailwind CSS v3** - Estilos utility-first
- **Recharts** - Gráficos de visualización de datos
- **OpenStreetMap** - Tiles de mapa gratuitos (no requiere API key)

### Patrones Arquitectónicos Clave

**1. Gestión de Estado Centralizada (Zustand)**
- Store único en `src/stores/useAppStore.ts`
- Gestiona: registros de muertes, filtros, datos filtrados, estado de vista del mapa
- Auto-aplica filtros reactivamente cuando el estado de filtros cambia

**2. Estructura de Componentes**
```
src/components/
├── ui/              # Componentes base reutilizables (Button, Card, etc.)
├── map/             # Visualización del mapa
│   ├── MapContainer.tsx    # Configuración del mapa Leaflet
│   └── HeatmapLayer.tsx    # Overlay de mapa de calor (usa plugin leaflet.heat)
├── filters/         # FilterPanel con todos los controles de filtros
├── analytics/       # StatsPanel con visualizaciones de Recharts
└── layout/          # MainLayout (3 columnas: filtros | mapa | estadísticas)
```

**3. Flujo de Datos**
```
Archivo JSON → App.tsx (fetch) → useAppStore.setDeathRecords() →
→ Filtros aplicados → filteredRecords → MapContainer + StatsPanel
```

**4. Sistema de Tipos**
- Todos los tipos definidos en `src/types/index.ts`
- Tipo principal: `DeathRecord` con location, demographics, type, date
- TypeScript estricto en todo el proyecto (sin implicit any)

## 📊 Flujo de Procesamiento de Datos

### Dataset Actual
- **Archivo**: `public/data/deaths/deaths-2023.json` (6.02 MB)
- **Total**: 17,455 muertes violentas en Colombia 2023
  - Homicidios: 14,260 (81.7%)
  - Suicidios: 3,195 (18.3%)

### Cómo se Procesan los Datos

**Importante**: Los datos crudos de datos.gov.co **NO incluyen coordenadas exactas**, solo nombres de departamentos y municipios.

**Solución**: Mapeo de coordenadas a nivel de departamento
```javascript
// scripts/process-all-deaths.cjs
const departmentCoords = {
  'Antioquia': { lat: 6.2518, lng: -75.5636 },
  'Valle del Cauca': { lat: 3.4516, lng: -76.5320 },
  // ... 33 departamentos en total
};

// Agregar variación aleatoria para distribuir puntos de forma realista
const randomLat = coords.lat + (Math.random() - 0.5) * 0.2;
const randomLng = coords.lng + (Math.random() - 0.5) * 0.2;
```

### Pipeline de Procesamiento

1. **Descargar datos crudos** desde datos.gov.co (API Socrata)
2. **Ejecutar script de procesamiento** (`scripts/process-all-deaths.cjs`)
   - Mapea departamentos a coordenadas
   - Extrae demografía (edad de grupos quinquenales, género)
   - Genera fechas (desde campo de mes + día aleatorio)
   - Asigna subtipos (arma_fuego, arma_blanca, asfixia, etc.)
   - Combina homicidios + suicidios con IDs únicos (prefijo 'H', prefijo 'S')
3. **Salida**: JSON unificado en `public/data/deaths/deaths-2023.json`

### Agregar Más Datos

**Para agregar otros años**:
```bash
# Descargar datos de 2022
curl -s "https://www.datos.gov.co/resource/vtub-3de2.json?\$where=a_o_del_hecho='2022'&\$limit=15000" \
  -o public/data/raw/homicidios-2022-raw.json

# Modificar script para procesar 2022
# Actualizar FilterPanel.tsx: const YEARS = [2023, 2022];
```

**Para agregar otros tipos de muerte**: Buscar en datos.gov.co los datasets relevantes y adaptar el script de procesamiento.

Ver `DATOS-REALES.md` para instrucciones detalladas de procesamiento de datos.

## 🗺 Implementación del Mapa

### Por Qué Leaflet (No Mapbox)
- **Requerimiento**: Solo herramientas 100% open-source
- **Intento previo**: Mapbox GL falló con problemas de dependencias
- **Solución**: Cambio a Leaflet + OpenStreetMap (totalmente abierto, sin API key)

### Configuración del Mapa
```typescript
// src/components/map/MapContainer.tsx
<LeafletMap center={[4.5709, -74.2973]} zoom={6}>  // Centro de Colombia
  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
  <ZoomControl position="topright" />
  <HeatmapLayer data={filteredRecords} />
</LeafletMap>
```

### Configuración del Mapa de Calor
```typescript
// src/components/map/HeatmapLayer.tsx
L.heatLayer(heatPoints, {
  radius: 25,        // Dispersión del punto
  blur: 15,          // Cantidad de difuminado
  maxZoom: 17,       // Zoom máximo para intensidad
  gradient: {
    0.0: 'blue',     // Densidad baja
    0.4: 'lime',
    0.8: 'orange',
    1.0: 'red'       // Densidad alta
  }
})
```

## 🔧 Problemas Comunes y Soluciones

### Problema: Error PostCSS de Tailwind CSS v4
**Error**: `It looks like you're trying to use tailwindcss directly as a PostCSS plugin`
**Solución**: Este proyecto usa Tailwind v3 (v4 aún no es compatible)
```bash
# Si se actualizó accidentalmente:
npm uninstall tailwindcss
npm install -D tailwindcss@3
```

### Problema: CSS de Leaflet No Carga
**Error**: El mapa se renderiza pero sin estilos
**Solución**: Importar CSS de Leaflet en MapContainer.tsx (NO en index.css)
```typescript
// src/components/map/MapContainer.tsx
import 'leaflet/dist/leaflet.css';
```

### Problema: Error require() en Módulos ES
**Error**: `require is not defined in ES module scope`
**Solución**: Los scripts de procesamiento de datos usan extensión `.cjs` (CommonJS)
```bash
# Los scripts deben ser .cjs, no .js
scripts/process-all-deaths.cjs    # ✓ Correcto
scripts/process-all-deaths.js     # ✗ Fallará
```

### Problema: Datos No Cargan
**Verificar**:
1. El archivo existe: `public/data/deaths/deaths-2023.json`
2. El archivo es JSON válido (no truncado)
3. La consola muestra: `"Cargados 17455 registros de homicidios en Colombia 2023"`

## 📁 Referencia de Archivos Clave

### Núcleo de la Aplicación
- **`src/App.tsx`** - App principal, carga de datos, estados loading/error
- **`src/stores/useAppStore.ts`** - Store de Zustand (filtros, registros, estado)
- **`src/types/index.ts`** - Definiciones de tipos TypeScript

### Componentes del Mapa
- **`src/components/map/MapContainer.tsx`** - Configuración del mapa Leaflet
- **`src/components/map/HeatmapLayer.tsx`** - Visualización del mapa de calor

### Componentes de UI
- **`src/components/filters/FilterPanel.tsx`** - Todos los controles de filtros
- **`src/components/analytics/StatsPanel.tsx`** - Estadísticas con Recharts
- **`src/components/layout/MainLayout.tsx`** - Layout de 3 columnas

### Procesamiento de Datos
- **`scripts/process-all-deaths.cjs`** - Script principal de procesamiento (homicidios + suicidios)
- **`public/data/deaths/deaths-2023.json`** - Datos procesados finales (17,455 registros)
- **`public/data/raw/`** - Datos crudos desde datos.gov.co

### Configuración
- **`package.json`** - Dependencias (nota: "type": "module")
- **`vite.config.ts`** - Config de Vite con alias @ para src/
- **`tailwind.config.js`** - Config de Tailwind v3
- **`tsconfig.json`** - TypeScript en modo estricto

## 🎨 Personalización

### Cambiar Estilo del Mapa
```typescript
// src/components/map/MapContainer.tsx
// Modo oscuro
<TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png" />

// Terreno
<TileLayer url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png" />
```

### Ajustar Colores del Mapa de Calor
```typescript
// src/components/map/HeatmapLayer.tsx
gradient: {
  0.0: 'green',   // Cambiar puntos de color
  0.5: 'yellow',
  1.0: 'red',
}
```

### Agregar Nuevos Filtros
1. Agregar a `FilterState` en `src/stores/useAppStore.ts`
2. Actualizar lógica de `applyFilters()`
3. Agregar controles de UI en `src/components/filters/FilterPanel.tsx`

## 📊 Estructura de Datos

### Tipo DeathRecord
```typescript
interface DeathRecord {
  id: string;                    // 'H1234' o 'S567'
  date: string;                  // ISO: '2023-05-15'
  type: DeathType;               // 'homicidio' | 'suicidio'
  subtype?: string;              // 'arma_fuego', 'arma_blanca', etc.
  location: {
    department: string;          // 'Antioquia', 'Valle del Cauca'
    municipality: string;
    lat: number;                 // Aproximadas (nivel departamento)
    lng: number;
  };
  demographics: {
    age: number;
    gender: 'M' | 'F' | 'O';
  };
}
```

### Estructura del Dataset
```json
{
  "year": 2023,
  "total": 17455,
  "by_type": {
    "homicidio": 14260,
    "suicidio": 3195
  },
  "data": [ /* array de DeathRecord */ ],
  "metadata": {
    "source": "Instituto Nacional de Medicina Legal",
    "sourceUrl": "https://www.datos.gov.co",
    "datasets": ["vtub-3de2", "f75u-mirk"]
  }
}
```

## 🚨 Restricciones Críticas

### Solo Usar Open-Source
- **NO** Mapbox, Google Maps, o servicios propietarios
- **SÍ** Leaflet, OpenStreetMap, librerías open-source

### Siempre Usar Datos Completos
- **NO** datos de muestra o datasets truncados
- **SÍ** descargas completas de datasets (usar valores altos de `$limit`)
- Requerimiento del usuario: "requiero que uses la información siempre completa"

### Limitación de Coordenadas
- Los datos crudos del gobierno **no tienen coordenadas exactas**
- Se deben usar coordenadas a nivel de departamento con variación aleatoria
- Mejora futura: Agregar geocodificación a nivel municipal

### Extensiones de Archivos de Scripts
- Scripts de procesamiento de datos: **DEBEN ser `.cjs`** (CommonJS)
- Razón: package.json tiene `"type": "module"`

## 📚 Recursos

### Documentación
- **README.md** - Resumen del proyecto, características, inicio rápido
- **DATOS-REALES.md** - Guía detallada de procesamiento de datos
- **Este archivo** - Referencia técnica para instancias de Claude

### Fuentes de Datos
- **Medicina Legal**: https://www.medicinalegal.gov.co/cifras-estadisticas
- **Datos.gov.co**: https://www.datos.gov.co
- **DANE Estadísticas Vitales**: https://www.dane.gov.co

### Endpoints de API
- Homicidios: `https://www.datos.gov.co/resource/vtub-3de2.json`
- Suicidios: `https://www.datos.gov.co/resource/f75u-mirk.json`
- Formato de query: `?$where=a_o_del_hecho='2023'&$limit=15000`

## 🎯 Guías de Desarrollo

### Al Agregar Funcionalidades
1. Actualizar tipos en `src/types/index.ts` primero
2. Agregar estado/lógica a `src/stores/useAppStore.ts` si es necesario
3. Crear nuevos componentes en las carpetas apropiadas
4. Mantener componentes pequeños y enfocados (responsabilidad única)

### Al Modificar Procesamiento de Datos
1. Probar primero con dataset pequeño
2. Verificar que la estructura del JSON de salida coincida con el tipo `DeathRecord`
3. Revisar salida en consola para conteos de registros
4. Validar que las coordenadas estén dentro de los límites de Colombia

### Estilo de Código
- TypeScript en modo estricto (sin implicit any)
- Componentes funcionales con hooks
- Tailwind para todos los estilos (sin archivos CSS personalizados)
- Nombres de variables claros y descriptivos en español para campos de datos

## 💡 Mejoras Futuras

Ver sección "Próximas Features" en `README.md` para mejoras planificadas:
- [ ] Integración con API REST para datos dinámicos
- [ ] Exportación de reportes (PDF, CSV)
- [ ] Slider temporal para comparación de años
- [ ] Clustering de puntos para mejor rendimiento
- [ ] Geocodificación a nivel municipal
- [ ] Mapas de coropletas por departamento
- [ ] Animaciones temporales

---

**Última Actualización**: 2025-11-07
**Dataset Actual**: 17,455 muertes violentas en Colombia (2023)
**Completitud de Datos**: 100% de los registros gubernamentales disponibles
