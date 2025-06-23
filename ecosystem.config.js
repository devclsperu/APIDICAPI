module.exports = {
  apps: [
    {
      name: 'apidicapi',
      script: 'dist/index.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'prod'
      },
      env_production: {
        NODE_ENV: 'prod'
      },
      error_file: './logs/pm2/error-0.log',
      out_file: './logs/pm2/out-0.log',
      log_file: './logs/pm2/combined-0.log',
      time: true
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