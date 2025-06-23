const fs = require('fs');
const path = require('path');

// Rutas de la nueva estructura
const logsDir = path.join(process.cwd(), 'logs');
const appDir = path.join(logsDir, 'app');
const queriesDir = path.join(appDir, 'queries');
const combinedDir = path.join(appDir, 'combined');
const errorsDir = path.join(appDir, 'errors');
const pm2Dir = path.join(logsDir, 'pm2');

// Crear directorios
const directories = [logsDir, appDir, queriesDir, combinedDir, errorsDir, pm2Dir];

directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Creado directorio: ${dir}`);
    } else {
        console.log(`Directorio ya existe: ${dir}`);
    }
});

console.log('\nEstructura de carpetas creada:');
console.log('logs/');
console.log('├── app/');
console.log('│   ├── queries/');
console.log('│   ├── combined/');
console.log('│   └── errors/');
console.log('└── pm2/'); 