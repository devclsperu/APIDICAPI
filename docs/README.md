# APIDICAPI - API de Consulta de Registros de Posicionamiento

## Introducción General

**APIDICAPI** es una API REST desarrollada en Node.js con TypeScript que proporciona una interfaz segura y eficiente para consultar registros de posicionamiento de embarcaciones desde sistemas externos de tracking marítimo. La API actúa como un proxy inteligente que se conecta a sistemas Themis (Francia y DICAPI) para obtener datos de posicionamiento en tiempo real y procesados.

### 🎯 Propósito Principal

La API está diseñada para:
- **Centralizar consultas** de posicionamiento marítimo desde múltiples fuentes
- **Proporcionar una interfaz unificada** para acceder a datos de embarcaciones
- **Garantizar seguridad** mediante autenticación por token Bearer
- **Optimizar rendimiento** con rate limiting y manejo de errores robusto
- **Facilitar integración** con sistemas cliente mediante respuestas JSON estandarizadas

### 📊 Funcionalidades Principales

#### 1. **Consultas de Posicionamiento**
- **Última hora**: Registros de la última hora (`/last-hour`)
- **Rango de horas**: Registros de las últimas N horas (`/last/:hours`)
- **Día completo**: Todas las transmisiones del día actual (`/all-day`)
- **Por fecha específica**: Registros de una fecha determinada (`/date-range`)
- **Día dividido**: Consulta optimizada dividida en mañana/tarde (`/select-day`)
- **Por ID de embarcación**: Registros específicos por beacon (`/:id`)

#### 2. **Seguridad y Control de Acceso**
- **Autenticación obligatoria** mediante Bearer Token
- **Rate limiting configurado** por endpoint
- **Validación de parámetros** estricta
- **Logging de consultas** para auditoría
- **Manejo de errores** estandarizado

#### 3. **Robustez y Confiabilidad**
- **Reintentos automáticos** en caso de fallos de red
- **Timeouts configurados** para evitar bloqueos
- **Manejo de límites** de registros (MAX_ROWS_REACHED)
- **Logs estructurados** para monitoreo
- **Respuestas consistentes** en formato JSON

### 🎯 Casos de Uso

#### **Monitoreo en Tiempo Real**
- Consulta de posiciones actuales de embarcaciones
- Seguimiento de rutas marítimas
- Alertas de posicionamiento

#### **Análisis Histórico**
- Reconstrucción de rutas pasadas
- Análisis de patrones de navegación
- Reportes de actividad marítima

#### **Integración con Sistemas**
- Dashboards de monitoreo
- Sistemas de control de flota
- Aplicaciones móviles de tracking

### 🔄 Flujo de Datos

1. **Cliente** envía petición con Bearer Token
2. **API** valida autenticación y rate limiting
3. **API** consulta sistema Themis DICAPI
4. **API** transforma y formatea datos
5. **API** retorna respuesta JSON estandarizada
6. **API** registra consulta en logs

### 📞 Soporte y Mantenimiento

- **Logs detallados** para troubleshooting
- **Manejo de errores** con mensajes descriptivos
- **Documentación** completa de endpoints
- **Ejemplos** de uso en carpeta `/docs/examples`

### 📚 Documentación Adicional

- **[Guía de Despliegue](despliegue.md)** - Instalación, configuración y despliegue
- **[Arquitectura y Tecnologías](arquitectura.md)** - Detalles técnicos y estructura del proyecto
- **[Configuración](configuracion.md)** - Variables de entorno y configuración
- **[Documentación de Endpoints](endpoints.md)** - Detalles completos de cada endpoint
- **[Guía del Cliente](CLIENT_GUIDE.md)** - Instrucciones para consumir la API
- **[Ejemplos de Uso](EXAMPLES.md)** - Casos prácticos y ejemplos de código

---

*APIDICAPI - Sistema de Consulta de Posicionamiento Marítimo*
*Versión 1.0.0 - Desarrollado con Node.js y TypeScript* 