module.exports = {
  apps: [
    {
      name: 'apidicapi',
      script: 'dist/index.js',
      instances: 1, // Cambiar de 'max' a 1
      exec_mode: 'fork', // Cambiar de 'cluster' a 'fork'
      env: {
        NODE_ENV: 'dev',
        PORT: 6002
      },
      env_production: {
        NODE_ENV: 'prod',
        PORT: 6002
      },
      env_staging: {
        NODE_ENV: 'staging',
        PORT: 6002
      },
      // Configuración de logs
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Configuración de reinicio
      watch: false,
      ignore_watch: ['node_modules', 'logs', 'dist'],
      max_memory_restart: '1G',
      
      // Configuración de monitoreo
      min_uptime: '10s',
      max_restarts: 10,
      
      // Configuración de variables de entorno
      env_file: '.env',
      
      // Configuración de tiempo de espera
      kill_timeout: 5000,
      listen_timeout: 3000,
      
      // Configuración de autorestart
      autorestart: true,
      
      // Configuración de cron para reinicio programado (opcional)
      // cron_restart: '0 2 * * *', // Reiniciar todos los días a las 2 AM
    }
  ],

  // Configuración para deploy (opcional)
  deploy: {
    production: {
      user: 'node',
      host: 'localhost',
      ref: 'origin/main',
      repo: 'git@github.com:usuario/apidicapi.git',
      path: '/var/www/apidicapi',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
}; 