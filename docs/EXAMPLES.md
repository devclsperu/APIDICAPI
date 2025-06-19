# Ejemplos Prácticos - APIDICAPI

Colección de ejemplos prácticos para diferentes casos de uso.

## Ejemplo 1: Monitoreo en Tiempo Real

```javascript
// Monitorear vehículos cada 5 minutos
const cron = require('node-cron');

cron.schedule('*/5 * * * *', async () => {
  try {
    const response = await api.get('/last-hour');
    const vehicles = response.data.data;
    
    // Filtrar vehículos con velocidad > 80 km/h
    const speedingVehicles = vehicles.filter(v => v.speed > 80);
    
    if (speedingVehicles.length > 0) {
      console.log('🚨 Vehículos excediendo velocidad:', speedingVehicles);
      // Enviar alerta por email/SMS
    }
  } catch (error) {
    console.error('Error en monitoreo:', error);
  }
});
```

## Ejemplo 2: Reporte Diario

```javascript
// Generar reporte diario de todos los vehículos
async function generateDailyReport() {
  try {
    const response = await api.get('/all-day');
    const vehicles = response.data.data;
    
    const report = {
      date: new Date().toISOString().split('T')[0],
      totalRecords: vehicles.length,
      uniqueVehicles: [...new Set(vehicles.map(v => v.id))].length,
      averageSpeed: vehicles.reduce((sum, v) => sum + v.speed, 0) / vehicles.length,
      vehiclesByType: vehicles.reduce((acc, v) => {
        acc[v.type] = (acc[v.type] || 0) + 1;
        return acc;
      }, {})
    };
    
    console.log('📊 Reporte Diario:', report);
    return report;
  } catch (error) {
    console.error('Error generando reporte:', error);
  }
}
```

## Ejemplo 3: Seguimiento de Vehículo Específico

```javascript
// Seguimiento de un vehículo específico
async function trackVehicle(vehicleId) {
  try {
    const response = await api.get(`/${vehicleId}`);
    const records = response.data.data;
    
    // Ordenar por timestamp
    const sortedRecords = records.sort((a, b) => 
      new Date(a.timestamp) - new Date(b.timestamp)
    );
    
    // Calcular ruta
    const route = sortedRecords.map(record => ({
      lat: record.location.lat,
      lng: record.location.lng,
      timestamp: record.timestamp,
      speed: record.speed
    }));
    
    console.log(`🗺️ Ruta del vehículo ${vehicleId}:`, route);
    return route;
  } catch (error) {
    console.error('Error en seguimiento:', error);
  }
}
```

## Ejemplo 4: Análisis de Patrones

```javascript
// Analizar patrones de movimiento
async function analyzeMovementPatterns() {
  try {
    const response = await api.get('/last/24'); // Últimas 24 horas
    const records = response.data.data;
    
    // Agrupar por vehículo
    const vehicleGroups = records.reduce((acc, record) => {
      if (!acc[record.id]) acc[record.id] = [];
      acc[record.id].push(record);
      return acc;
    }, {});
    
    // Analizar cada vehículo
    Object.entries(vehicleGroups).forEach(([vehicleId, vehicleRecords]) => {
      const avgSpeed = vehicleRecords.reduce((sum, r) => sum + r.speed, 0) / vehicleRecords.length;
      const maxSpeed = Math.max(...vehicleRecords.map(r => r.speed));
      const totalDistance = calculateTotalDistance(vehicleRecords);
      
      console.log(`🚛 Vehículo ${vehicleId}:`, {
        avgSpeed: avgSpeed.toFixed(2) + ' km/h',
        maxSpeed: maxSpeed.toFixed(2) + ' km/h',
        totalDistance: totalDistance.toFixed(2) + ' km',
        recordsCount: vehicleRecords.length
      });
    });
  } catch (error) {
    console.error('Error en análisis:', error);
  }
}

function calculateTotalDistance(records) {
  // Implementar cálculo de distancia entre puntos
  // Usando fórmula de Haversine
  return 0; // Placeholder
}
```
```

## **✅ Características de la documentación:**

1. **📖 Guía completa**: Todos los endpoints con ejemplos
2. **�� Ejemplos prácticos**: JavaScript, Python, PHP
3. **⚠️ Manejo de errores**: Códigos y soluciones
4. **🚀 Mejores prácticas**: Rate limiting, validaciones
5. **📊 Casos de uso**: Monitoreo, reportes, seguimiento
6. **📞 Soporte técnico**: Información de contacto

¿Te parece bien esta documentación? ¿Quieres que agregue o modifique algo específico? 