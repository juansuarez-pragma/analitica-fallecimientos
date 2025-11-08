const fs = require('fs');
const path = require('path');

// Coordenadas centrales aproximadas por departamento (basado en capitales)
const departmentCoords = {
  'Amazonas': { lat: -1.4469, lng: -71.9469 },
  'Antioquia': { lat: 6.2518, lng: -75.5636 },
  'Arauca': { lat: 7.0844, lng: -70.7614 },
  'Atlántico': { lat: 10.9685, lng: -74.7813 },
  'Bogotá D.C.': { lat: 4.7110, lng: -74.0721 },
  'Bolívar': { lat: 10.3910, lng: -75.4794 },
  'Boyacá': { lat: 5.4545, lng: -73.3623 },
  'Caldas': { lat: 5.0689, lng: -75.5174 },
  'Caquetá': { lat: 1.6144, lng: -75.6062 },
  'Casanare': { lat: 5.3397, lng: -72.3958 },
  'Cauca': { lat: 2.4448, lng: -76.6147 },
  'Cesar': { lat: 10.4631, lng: -73.2532 },
  'Chocó': { lat: 5.6979, lng: -76.6585 },
  'Córdoba': { lat: 8.7479, lng: -75.8814 },
  'Cundinamarca': { lat: 4.7110, lng: -74.0721 },
  'Guainía': { lat: 2.5705, lng: -69.3168 },
  'Guaviare': { lat: 2.5706, lng: -72.6375 },
  'Huila': { lat: 2.9273, lng: -75.2819 },
  'La Guajira': { lat: 11.5444, lng: -72.9072 },
  'Magdalena': { lat: 11.2408, lng: -74.1990 },
  'Meta': { lat: 4.1420, lng: -73.6266 },
  'Nariño': { lat: 1.2136, lng: -77.2811 },
  'Norte de Santander': { lat: 7.8939, lng: -72.5078 },
  'Putumayo': { lat: 0.4824, lng: -76.3563 },
  'Quindío': { lat: 4.4614, lng: -75.6671 },
  'Risaralda': { lat: 4.8087, lng: -75.6906 },
  'San Andrés y Providencia': { lat: 12.5847, lng: -81.7006 },
  'Santander': { lat: 7.1254, lng: -73.1198 },
  'Sucre': { lat: 9.2977, lng: -75.3979 },
  'Tolima': { lat: 4.4389, lng: -75.2322 },
  'Valle del Cauca': { lat: 3.4516, lng: -76.5320 },
  'Vaupés': { lat: 0.8611, lng: -70.8108 },
  'Vichada': { lat: 4.4218, lng: -69.2849 }
};

// Mapeo de meses españoles a número
const mesesMap = {
  'enero': 1, 'febrero': 2, 'marzo': 3, 'abril': 4,
  'mayo': 5, 'junio': 6, 'julio': 7, 'agosto': 8,
  'septiembre': 9, 'octubre': 10, 'noviembre': 11, 'diciembre': 12
};

function processHomicides() {
  console.log('Procesando datos de homicidios...');

  // Leer datos crudos
  const rawDataPath = path.join(__dirname, '../public/data/raw/homicidios-2023-raw.json');
  const rawData = JSON.parse(fs.readFileSync(rawDataPath, 'utf8'));

  console.log(`Total de registros crudos: ${rawData.length}`);

  // Procesar cada registro
  const processedData = rawData.map((record, index) => {
    const dept = record.departamento_del_hecho_dane || 'Bogotá D.C.';
    const coords = departmentCoords[dept] || departmentCoords['Bogotá D.C.'];

    // Añadir variación aleatoria pequeña para distribuir puntos
    const randomLat = coords.lat + (Math.random() - 0.5) * 0.2;
    const randomLng = coords.lng + (Math.random() - 0.5) * 0.2;

    // Construir fecha
    const mes = mesesMap[record.mes_del_hecho?.toLowerCase()] || 1;
    const dia = Math.floor(Math.random() * 28) + 1; // Día aleatorio ya que no tenemos el dato exacto
    const fecha = `2023-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;

    // Extraer edad del grupo
    const edadMatch = record.grupo_de_edad_quinquenal?.match(/\((\d+)/);
    const edad = edadMatch ? parseInt(edadMatch[1]) : 30;

    // Determinar género
    const sexo = record.sexo_de_la_victima === 'Hombre' ? 'M' :
                 record.sexo_de_la_victima === 'Mujer' ? 'F' : 'O';

    return {
      id: index + 1,
      date: fecha,
      type: 'homicidio',
      subtype: record.mecanismo_causal_de_la_lesion_fatal === 'Proyectil de arma de fuego' ? 'arma_fuego' :
               record.mecanismo_causal_de_la_lesion_fatal === 'Corto punzante' ? 'arma_blanca' : 'otro',
      location: {
        department: dept,
        municipality: record.municipio_del_hecho_dane || 'Desconocido',
        lat: randomLat,
        lng: randomLng
      },
      demographics: {
        age: edad,
        gender: sexo
      },
      source: 'Instituto Nacional de Medicina Legal - datos.gov.co'
    };
  });

  // Crear dataset final
  const finalDataset = {
    year: 2023,
    total: processedData.length,
    data: processedData,
    metadata: {
      source: 'Instituto Nacional de Medicina Legal y Ciencias Forenses',
      sourceUrl: 'https://www.datos.gov.co/Justicia-y-Derecho/Presuntos-Homicidios-Colombia-2015-a-2023-Cifras-d/vtub-3de2',
      lastUpdated: new Date().toISOString(),
      description: 'Datos reales de homicidios en Colombia durante el año 2023'
    }
  };

  // Guardar archivo procesado
  const outputPath = path.join(__dirname, '../public/data/deaths/deaths-2023.json');
  fs.writeFileSync(outputPath, JSON.stringify(finalDataset, null, 2));

  console.log(`✅ Procesamiento completado`);
  console.log(`📊 Total de registros procesados: ${processedData.length}`);
  console.log(`📁 Archivo guardado en: ${outputPath}`);
  console.log(`📦 Tamaño del archivo: ${(fs.statSync(outputPath).size / 1024 / 1024).toFixed(2)} MB`);

  // Estadísticas
  const deptos = {};
  processedData.forEach(r => {
    deptos[r.location.department] = (deptos[r.location.department] || 0) + 1;
  });

  console.log('\n📈 Top 10 departamentos con más homicidios:');
  Object.entries(deptos)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([dept, count], i) => {
      console.log(`${i + 1}. ${dept}: ${count}`);
    });
}

// Ejecutar
try {
  processHomicides();
} catch (error) {
  console.error('❌ Error procesando datos:', error.message);
  process.exit(1);
}
