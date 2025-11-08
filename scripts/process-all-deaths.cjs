const fs = require('fs');
const path = require('path');

// Coordenadas centrales aproximadas por departamento
const departmentCoords = {
  'Amazonas': { lat: -1.4469, lng: -71.9469 },
  'Antioquia': { lat: 6.2518, lng: -75.5636 },
  'Arauca': { lat: 7.0844, lng: -70.7614 },
  'Atlántico': { lat: 10.9685, lng: -74.7813 },
  'Bogotá D.C.': { lat: 4.7110, lng: -74.0721 },
  'Bogotá, D.C.': { lat: 4.7110, lng: -74.0721 },
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

const mesesMap = {
  'enero': 1, 'febrero': 2, 'marzo': 3, 'abril': 4,
  'mayo': 5, 'junio': 6, 'julio': 7, 'agosto': 8,
  'septiembre': 9, 'octubre': 10, 'noviembre': 11, 'diciembre': 12
};

function processDeaths() {
  console.log('🔄 Procesando todos los datos de muertes violentas 2023...\n');

  // 1. HOMICIDIOS
  console.log('📊 Procesando homicidios...');
  const homicides = JSON.parse(fs.readFileSync(
    path.join(__dirname, '../public/data/raw/homicidios-2023-raw.json'),
    'utf8'
  ));

  const processedHomicides = homicides.map((record, index) => {
    const dept = record.departamento_del_hecho_dane || 'Bogotá, D.C.';
    const coords = departmentCoords[dept] || departmentCoords['Bogotá, D.C.'];

    const randomLat = coords.lat + (Math.random() - 0.5) * 0.2;
    const randomLng = coords.lng + (Math.random() - 0.5) * 0.2;

    const mes = mesesMap[record.mes_del_hecho?.toLowerCase()] || 1;
    const dia = Math.floor(Math.random() * 28) + 1;
    const fecha = `2023-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;

    const edadMatch = record.grupo_de_edad_quinquenal?.match(/\((\d+)/);
    const edad = edadMatch ? parseInt(edadMatch[1]) : 30;

    const sexo = record.sexo_de_la_victima === 'Hombre' ? 'M' :
                 record.sexo_de_la_victima === 'Mujer' ? 'F' : 'O';

    return {
      id: `H${index + 1}`,
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
      }
    };
  });

  console.log(`✅ Homicidios procesados: ${processedHomicides.length}`);

  // 2. SUICIDIOS
  console.log('\n📊 Procesando suicidios...');
  const suicides = JSON.parse(fs.readFileSync(
    path.join(__dirname, '../public/data/raw/suicidios-2023-raw.json'),
    'utf8'
  ));

  const processedSuicides = suicides.map((record, index) => {
    const dept = record.departamento_del_hecho_dane || 'Bogotá, D.C.';
    const coords = departmentCoords[dept] || departmentCoords['Bogotá, D.C.'];

    const randomLat = coords.lat + (Math.random() - 0.5) * 0.2;
    const randomLng = coords.lng + (Math.random() - 0.5) * 0.2;

    const mes = mesesMap[record.mes_del_hecho?.toLowerCase()] || 1;
    const dia = Math.floor(Math.random() * 28) + 1;
    const fecha = `2023-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;

    const edadMatch = record.grupo_de_edad_quinquenal?.match(/\((\d+)/);
    const edad = edadMatch ? parseInt(edadMatch[1]) : 30;

    const sexo = record.sexo_de_la_victima === 'Hombre' ? 'M' :
                 record.sexo_de_la_victima === 'Mujer' ? 'F' : 'O';

    return {
      id: `S${index + 1}`,
      date: fecha,
      type: 'suicidio',
      subtype: record.mecanismo_causal_de_la_lesion_fatal === 'Asfixia mecánica' ? 'asfixia' :
               record.mecanismo_causal_de_la_lesion_fatal === 'Proyectil de arma de fuego' ? 'arma_fuego' :
               record.mecanismo_causal_de_la_lesion_fatal === 'Envenenamiento' ? 'intoxicacion' : 'otro',
      location: {
        department: dept,
        municipality: record.municipio_del_hecho_dane || 'Desconocido',
        lat: randomLat,
        lng: randomLng
      },
      demographics: {
        age: edad,
        gender: sexo
      }
    };
  });

  console.log(`✅ Suicidios procesados: ${processedSuicides.length}`);

  // 3. COMBINAR TODOS LOS DATOS
  console.log('\n📦 Combinando datasets...');
  const allDeaths = [...processedHomicides, ...processedSuicides];

  // 4. CREAR DATASET FINAL
  const finalDataset = {
    year: 2023,
    total: allDeaths.length,
    by_type: {
      homicidio: processedHomicides.length,
      suicidio: processedSuicides.length
    },
    data: allDeaths,
    metadata: {
      source: 'Instituto Nacional de Medicina Legal y Ciencias Forenses',
      sourceUrl: 'https://www.datos.gov.co',
      datasets: [
        'Presuntos Homicidios 2023 (vtub-3de2)',
        'Presuntos Suicidios 2023 (f75u-mirk)'
      ],
      lastUpdated: new Date().toISOString(),
      description: 'Datos reales de muertes violentas en Colombia durante el año 2023 (homicidios y suicidios)'
    }
  };

  // 5. GUARDAR
  const outputPath = path.join(__dirname, '../public/data/deaths/deaths-2023.json');
  fs.writeFileSync(outputPath, JSON.stringify(finalDataset, null, 2));

  console.log(`\n✅ ¡Procesamiento completado exitosamente!`);
  console.log(`\n📊 RESUMEN:`);
  console.log(`   Total de registros: ${allDeaths.length.toLocaleString()}`);
  console.log(`   - Homicidios: ${processedHomicides.length.toLocaleString()}`);
  console.log(`   - Suicidios: ${processedSuicides.length.toLocaleString()}`);
  console.log(`\n📁 Archivo guardado en: ${outputPath}`);
  console.log(`📦 Tamaño: ${(fs.statSync(outputPath).size / 1024 / 1024).toFixed(2)} MB`);

  // ESTADÍSTICAS POR DEPARTAMENTO
  const deptos = {};
  allDeaths.forEach(r => {
    deptos[r.location.department] = (deptos[r.location.department] || 0) + 1;
  });

  console.log('\n📈 Top 10 departamentos con más muertes violentas:');
  Object.entries(deptos)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([dept, count], i) => {
      console.log(`   ${i + 1}. ${dept}: ${count.toLocaleString()}`);
    });

  // ESTADÍSTICAS POR TIPO
  console.log('\n🔍 Distribución por tipo de muerte:');
  const byType = {};
  allDeaths.forEach(r => {
    byType[r.type] = (byType[r.type] || 0) + 1;
  });
  Object.entries(byType).forEach(([type, count]) => {
    const percentage = ((count / allDeaths.length) * 100).toFixed(1);
    console.log(`   - ${type}: ${count.toLocaleString()} (${percentage}%)`);
  });
}

// Ejecutar
try {
  processDeaths();
} catch (error) {
  console.error('❌ Error procesando datos:', error.message);
  console.error(error.stack);
  process.exit(1);
}
