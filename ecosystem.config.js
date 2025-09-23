module.exports = {
  apps: [
    {
      name: 'english-learning',
      script: '.output/server/index.mjs',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
        HOST: '0.0.0.0'
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOST: '0.0.0.0'
      },
      // 日志配置
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // 进程管理
      max_memory_restart: '1G',
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '10s',
      
      // 监控配置
      watch: false,
      ignore_watch: [
        'node_modules',
        'logs',
        '.git',
        '.output',
        '.nuxt'
      ],
      
      // 自动重启配置
      autorestart: true,
      
      // 环境变量
      env_file: '.env'
    }
  ],

  // 部署配置
  deploy: {
    production: {
      user: 'root',
      host: ['your-server-ip'],
      ref: 'origin/main',
      repo: 'https://github.com/your-username/english-learning.git',
      path: '/var/www/english-learning',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    },
    
    staging: {
      user: 'root',
      host: ['staging-server-ip'],
      ref: 'origin/develop',
      repo: 'https://github.com/your-username/english-learning.git',
      path: '/var/www/english-learning-staging',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env staging'
    }
  }
}