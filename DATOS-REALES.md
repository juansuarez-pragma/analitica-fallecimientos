# Guía de Datos Reales - Colombia Analytics

## 📊 Datos Actualmente Integrados

**Dataset**: Homicidios en Colombia 2023
**Fuente**: Instituto Nacional de Medicina Legal y Ciencias Forenses
**Registros**: 14,260 casos
**Archivo**: `public/data/deaths/deaths-2023.json` (5.86 MB)

### Top 10 Departamentos por Homicidios (2023)

1. **Valle del Cauca**: 2,425
2. **Antioquia**: 1,830
3. **Bogotá, D.C.**: 1,132
4. **Cauca**: 864
5. **Atlántico**: 798
6. **Bolívar**: 751
7. **Norte de Santander**: 580
8. **Magdalena**: 539
9. **Cundinamarca**: 469
10. **Santander**: 441

## 🔄 Cómo Actualizar o Agregar Más Datos

### Opción 1: Descargar Otros Años de Homicidios

```bash
# Descargar datos de 2022
curl -s "https://www.datos.gov.co/resource/vtub-3de2.json?\$where=a_o_del_hecho='2022'&\$limit=20000" -o public/data/raw/homicidios-2022-raw.json

# Modificar el script para procesar 2022
# Editar scripts/process-homicides.cjs y cambiar el año

# Ejecutar procesamiento
node scripts/process-homicides.cjs
```

### Opción 2: Descargar Todos los Años (2015-2023)

```bash
# Script para descargar todos los años
for year in {2015..2023}; do
  echo "Descargando año $year..."
  curl -s "https://www.datos.gov.co/resource/vtub-3de2.json?\$where=a_o_del_hecho='$year'&\$limit=20000" \
    -o "public/data/raw/homicidios-$year-raw.json"
done
```

### Opción 3: Otros Tipos de Datos

#### Suicidios (Medicina Legal)
```bash
# API endpoint para suicidios (si está disponible)
# Buscar en: https://www.datos.gov.co
```

#### Defunciones Naturales (DANE)
```bash
# Dataset de DANE
# URL: https://www.dane.gov.co/index.php/estadisticas-por-tema/salud/nacimientos-y-defunciones
```

## 🛠 Estructura del Script de Procesamiento

El script `scripts/process-homicides.cjs` realiza:

1. **Lee datos crudos** del API de datos.gov.co
2. **Mapea departamentos** a coordenadas geográficas centrales
3. **Transforma campos**:
   - Fecha (año, mes → ISO date)
   - Tipo de muerte → siempre "homicidio"
   - Subtipo → según mecanismo (arma_fuego, arma_blanca, otro)
   - Edad → extraída del grupo quinquenal
   - Género → M/F/O
4. **Añade variación geográfica** aleatoria para distribuir puntos
5. **Genera archivo JSON** en formato compatible con la app

## 📝 Modificar el Script

Para procesar otros tipos de datos, edita `scripts/process-homicides.cjs`:

```javascript
// Cambiar el tipo de muerte
type: 'suicidio',  // o 'accidente', 'natural', etc.

// Mapear diferentes campos
subtype: determinarSubtipo(record.causa_muerte),

// Procesar fechas diferentes
const fecha = parseFecha(record.fecha_hecho);
```

## 🗺 Coordenadas Geográficas

### Limitación Actual
Los datos de datos.gov.co **NO incluyen coordenadas exactas**, solo municipios.

### Solución Implementada
Usamos **coordenadas centrales por departamento** con variación aleatoria.

### Mejoras Futuras

**Opción A**: Usar dataset de municipios con coordenadas
```bash
# Buscar en:
# - https://geoportal.dane.gov.co/
# - Simplemaps Colombia Cities Database
# - GeoJSON de municipios colombianos
```

**Opción B**: Geocodificar programáticamente
```javascript
// Usar servicio de geocoding
const coords = await geocode(municipio, departamento);
```

## 📈 Agregar Múltiples Años a la Aplicación

1. **Procesar cada año** con el script
2. **Modificar App.tsx**:

```typescript
// Cargar múltiples años
const datasets = await Promise.all([
  fetch('/data/deaths/deaths-2023.json').then(r => r.json()),
  fetch('/data/deaths/deaths-2022.json').then(r => r.json()),
  fetch('/data/deaths/deaths-2021.json').then(r => r.json()),
]);

const allRecords = datasets.flatMap(d => d.data);
setDeathRecords(allRecords);
```

3. **Actualizar FilterPanel.tsx**:
```typescript
const YEARS = [2023, 2022, 2021, 2020, 2019];
```

## 🔍 Fuentes de Datos Oficiales

### Instituto Nacional de Medicina Legal
- **URL**: https://www.medicinalegal.gov.co/cifras-estadisticas
- **Datos**: Homicidios, suicidios, accidentes de tránsito, violencia intrafamiliar
- **Formato**: PDFs, Boletines mensuales
- **API**: https://www.datos.gov.co (dataset `vtub-3de2`)

### DANE - Estadísticas Vitales
- **URL**: https://www.dane.gov.co/index.php/estadisticas-por-tema/salud/nacimientos-y-defunciones
- **Datos**: Defunciones (todas las causas), nacimientos
- **Formato**: Microdatos en CSVs descargables
- **Actualización**: Trimestral

### Datos Abiertos Colombia
- **URL**: https://www.datos.gov.co
- **Búsqueda**: "defunciones", "homicidios", "mortalidad", "salud"
- **API**: Socrata SODA API
- **Límite**: 50,000 registros por request (usar paginación)

## 💡 Tips de Optimización

### Reducir Tamaño de Archivos

```javascript
// Eliminar campos innecesarios
const minimalRecord = {
  id: record.id,
  date: record.date,
  type: record.type,
  location: {
    lat: parseFloat(record.location.lat.toFixed(4)),
    lng: parseFloat(record.location.lng.toFixed(4))
  },
  demographics: {
    age: record.demographics.age,
    gender: record.demographics.gender
  }
};
```

### Comprimir Datos
```bash
# Crear versión gzip
gzip -c public/data/deaths/deaths-2023.json > public/data/deaths/deaths-2023.json.gz

# Configurar servidor para servir .gz cuando esté disponible
```

## ❓ Preguntas Frecuentes

**P: ¿Por qué los puntos no son exactos?**
R: Los datos originales no tienen coordenadas exactas, solo municipios. Usamos coordenadas centrales del departamento con dispersión aleatoria.

**P: ¿Cómo obtener coordenadas exactas?**
R: Necesitas un dataset de municipios con lat/lng o usar un servicio de geocoding.

**P: ¿Los datos están actualizados?**
R: Los datos de 2023 son las cifras definitivas según Medicina Legal (última actualización del dataset).

**P: ¿Puedo agregar otros tipos de datos (accidentes, suicidios)?**
R: Sí, busca los datasets en datos.gov.co y adapta el script de procesamiento.

## 📞 Soporte

Para más información sobre los datos:
- Instituto Nacional de Medicina Legal: https://www.medicinalegal.gov.co
- DANE: https://www.dane.gov.co
- Portal de Datos Abiertos: https://www.datos.gov.co

---

**Última actualización**: 2025-11-07
**Datos procesados**: 14,260 registros de homicidios en Colombia 2023
