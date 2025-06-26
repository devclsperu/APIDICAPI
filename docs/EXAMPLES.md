# Ejemplos Prácticos - APIDICAPI

Colección de ejemplos prácticos para diferentes casos de uso.

## Configuración Base

```javascript
// Configuración de la API
const API_BASE_URL = 'https://www.apidicapi.com.pe/api/v1/records';
const API_TOKEN = 'YOUR_API_TOKEN';

// Headers comunes
const headers = {
  'Authorization': `Bearer ${API_TOKEN}`,
  'Content-Type': 'application/json'
};
```

## Ejemplo 1: Monitoreo en Tiempo Real

```javascript
// Monitorear embarcaciones cada 5 minutos
const cron = require('node-cron');

cron.schedule('*/5 * * * *', async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/last-hour`, { headers });
    const data = await response.json();
    
    if (data.success) {
      const vessels = data.data;
      
      // Filtrar embarcaciones con velocidad > 15 nudos
      const speedingVessels = vessels.filter(v => v.speed > 15);
      
      if (speedingVessels.length > 0) {
        console.log('🚨 Embarcaciones excediendo velocidad:', speedingVessels);
        // Enviar alerta por email/SMS
      }
    }
  } catch (error) {
    console.error('Error en monitoreo:', error);
  }
});
```

## Ejemplo 2: Reporte Diario

```javascript
// Generar reporte diario de todas las embarcaciones
async function generateDailyReport() {
  try {
    const response = await fetch(`${API_BASE_URL}/all-day`, { headers });
    const data = await response.json();
    
    if (data.success) {
      const vessels = data.data;
      
      const report = {
        date: new Date().toISOString().split('T')[0],
        totalRecords: vessels.length,
        uniqueVessels: [...new Set(vessels.map(v => v.id))].length,
        averageSpeed: vessels.reduce((sum, v) => sum + v.speed, 0) / vessels.length,
        vesselsByType: vessels.reduce((acc, v) => {
          acc[v.mobileTypeName] = (acc[v.mobileTypeName] || 0) + 1;
          return acc;
        }, {})
      };
      
      console.log('📊 Reporte Diario:', report);
      return report;
    }
  } catch (error) {
    console.error('Error generando reporte:', error);
  }
}
```

## Ejemplo 3: Seguimiento de Embarcación Específica

```javascript
// Seguimiento de una embarcación específica
async function trackVessel(vesselId) {
  try {
    const response = await fetch(`${API_BASE_URL}/${vesselId}`, { headers });
    const data = await response.json();
    
    if (data.success) {
      const records = data.data;
      
      // Ordenar por fecha de transmisión
      const sortedRecords = records.sort((a, b) => 
        new Date(a.transmissionDateTime) - new Date(b.transmissionDateTime)
      );
      
      // Calcular ruta
      const route = sortedRecords.map(record => ({
        longitude: record.longitude,
        latitude: record.latitude,
        transmissionDateTime: record.transmissionDateTime,
        speed: record.speed,
        course: record.course
      }));
      
      console.log(`🗺️ Ruta de la embarcación ${vesselId}:`, route);
      return route;
    }
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
    const response = await fetch(`${API_BASE_URL}/last/24`, { headers }); // Últimas 24 horas
    const data = await response.json();
    
    if (data.success) {
      const records = data.data;
      
      // Agrupar por embarcación
      const vesselGroups = records.reduce((acc, record) => {
        if (!acc[record.id]) acc[record.id] = [];
        acc[record.id].push(record);
        return acc;
      }, {});
      
      // Analizar cada embarcación
      Object.entries(vesselGroups).forEach(([vesselId, vesselRecords]) => {
        const avgSpeed = vesselRecords.reduce((sum, r) => sum + r.speed, 0) / vesselRecords.length;
        const maxSpeed = Math.max(...vesselRecords.map(r => r.speed));
        const totalDistance = calculateTotalDistance(vesselRecords);
        
        console.log(`🚢 Embarcación ${vesselId}:`, {
          avgSpeed: avgSpeed.toFixed(2) + ' nudos',
          maxSpeed: maxSpeed.toFixed(2) + ' nudos',
          totalDistance: totalDistance.toFixed(2) + ' millas náuticas',
          recordsCount: vesselRecords.length,
          mobileName: vesselRecords[0]?.mobileName,
          mobileType: vesselRecords[0]?.mobileTypeName
        });
      });
    }
  } catch (error) {
    console.error('Error en análisis:', error);
  }
}

function calculateTotalDistance(records) {
  // Implementar cálculo de distancia entre puntos usando fórmula de Haversine
  let totalDistance = 0;
  
  for (let i = 1; i < records.length; i++) {
    const prev = records[i - 1];
    const curr = records[i];
    
    const distance = haversineDistance(
      prev.latitude, prev.longitude,
      curr.latitude, curr.longitude
    );
    
    totalDistance += distance;
  }
  
  return totalDistance;
}

function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 3440.065; // Radio de la Tierra en millas náuticas
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
```

## Ejemplo 5: Consulta por Fecha Específica

```javascript
// Consultar registros de una fecha específica
async function getRecordsByDate(date) {
  try {
    const response = await fetch(`${API_BASE_URL}/select-day?date=${date}`, { headers });
    const data = await response.json();
    
    if (data.success) {
      console.log(`📅 Registros del ${date}:`, data.data.length, 'registros');
      return data.data;
    }
  } catch (error) {
    console.error('Error consultando fecha:', error);
  }
}

// Uso
getRecordsByDate('15-01-2024');
```

## Ejemplo 6: Manejo de Errores y Rate Limiting

```javascript
// Cliente con manejo de errores y rate limiting
class APIClient {
  constructor(token) {
    this.token = token;
    this.baseURL = 'https://www.apidicapi.com.pe/api/v1/records';
    this.requestCounts = new Map();
  }
  
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json',
      ...options.headers
    };
    
    try {
      const response = await fetch(url, { ...options, headers });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${data.error || 'Error desconocido'}`);
      }
      
      return data;
    } catch (error) {
      if (error.message.includes('429')) {
        console.log('⚠️ Rate limit excedido, esperando...');
        await this.delay(60000); // Esperar 1 minuto
        return this.request(endpoint, options); // Reintentar
      }
      throw error;
    }
  }
  
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  async getLastHour() {
    return this.request('/last-hour');
  }
  
  async getLastHours(hours) {
    return this.request(`/last/${hours}`);
  }
  
  async getAllDay() {
    return this.request('/all-day');
  }
  
  async getSelectDay(date) {
    return this.request(`/select-day?date=${date}`);
  }
  
  async getById(id) {
    return this.request(`/${id}`);
  }
}

// Uso del cliente
const client = new APIClient('YOUR_API_TOKEN');

async function example() {
  try {
    const lastHour = await client.getLastHour();
    console.log('Última hora:', lastHour.data.length, 'registros');
    
    const specificDay = await client.getSelectDay('15-01-2024');
    console.log('Día específico:', specificDay.data.length, 'registros');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Ejemplo 7: Python con requests

```python
import requests
import json
from datetime import datetime

class APIDICAPIClient:
    def __init__(self, token):
        self.base_url = 'https://www.apidicapi.com.pe/api/v1/records'
        self.headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
    
    def get_last_hour(self):
        response = requests.get(f'{self.base_url}/last-hour', headers=self.headers)
        return response.json()
    
    def get_last_hours(self, hours):
        response = requests.get(f'{self.base_url}/last/{hours}', headers=self.headers)
        return response.json()
    
    def get_all_day(self):
        response = requests.get(f'{self.base_url}/all-day', headers=self.headers)
        return response.json()
    
    def get_select_day(self, date):
        response = requests.get(f'{self.base_url}/select-day?date={date}', headers=self.headers)
        return response.json()
    
    def get_by_id(self, vessel_id):
        response = requests.get(f'{self.base_url}/{vessel_id}', headers=self.headers)
        return response.json()

# Uso
client = APIDICAPIClient('YOUR_API_TOKEN')

try:
    # Obtener registros de la última hora
    last_hour = client.get_last_hour()
    if last_hour['success']:
        print(f"Registros de la última hora: {len(last_hour['data'])}")
    
    # Obtener registros de un día específico
    specific_day = client.get_select_day('15-01-2024')
    if specific_day['success']:
        print(f"Registros del día: {len(specific_day['data'])}")
        
except Exception as e:
    print(f"Error: {e}")
```

## Ejemplo 8: PHP con cURL

```php
<?php

class APIDICAPIClient {
    private $baseUrl = 'https://www.apidicapi.com.pe/api/v1/records';
    private $token;
    
    public function __construct($token) {
        $this->token = $token;
    }
    
    private function makeRequest($endpoint) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $this->baseUrl . $endpoint);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . $this->token,
            'Content-Type: application/json'
        ]);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($httpCode !== 200) {
            throw new Exception("HTTP Error: $httpCode");
        }
        
        return json_decode($response, true);
    }
    
    public function getLastHour() {
        return $this->makeRequest('/last-hour');
    }
    
    public function getLastHours($hours) {
        return $this->makeRequest("/last/$hours");
    }
    
    public function getAllDay() {
        return $this->makeRequest('/all-day');
    }
    
    public function getSelectDay($date) {
        return $this->makeRequest("/select-day?date=$date");
    }
    
    public function getById($id) {
        return $this->makeRequest("/$id");
    }
}

// Uso
$client = new APIDICAPIClient('YOUR_API_TOKEN');

try {
    $lastHour = $client->getLastHour();
    if ($lastHour['success']) {
        echo "Registros de la última hora: " . count($lastHour['data']) . "\n";
    }
    
    $specificDay = $client->getSelectDay('15-01-2024');
    if ($specificDay['success']) {
        echo "Registros del día: " . count($specificDay['data']) . "\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

?>
```

## **✅ Características de los ejemplos:**

1. **🌐 Nuevo dominio**: https://www.apidicapi.com.pe
2. **📊 Estructura actualizada**: Campos reales de la API
3. **🚢 Contexto marítimo**: Embarcaciones en lugar de vehículos
4. **⚡ Rate limiting**: Manejo de límites por endpoint
5. **🛠️ Múltiples lenguajes**: JavaScript, Python, PHP
6. **📈 Casos de uso reales**: Monitoreo, reportes, seguimiento
7. **⚠️ Manejo de errores**: Códigos específicos y soluciones
8. **🔧 Cliente reutilizable**: Clases para diferentes lenguajes

¿Te parece bien esta actualización de los ejemplos? ¿Quieres que agregue algún caso de uso específico? 