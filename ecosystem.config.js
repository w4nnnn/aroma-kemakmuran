module.exports = {
  apps: [
    {
      name: 'aroma-kemakmuran',
      cwd: './frontend',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 2200,
      },
      env_development: {
        NODE_ENV: 'development',
      },
      // Auto-restart on crash
      autorestart: true,
      // Max memory before restart (256MB)
      max_memory_restart: '256M',
      // Number of instances (cluster mode)
      instances: 1,
      // Watch for file changes in development
      watch: false,
      // Logging
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
    },
  ],
};
