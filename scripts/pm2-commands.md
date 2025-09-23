# PM2 常用命令参考

## 基本操作

### 启动应用
```bash
# 使用配置文件启动
pm2 start ecosystem.config.js

# 指定环境启动
pm2 start ecosystem.config.js --env production
pm2 start ecosystem.config.js --env staging
```

### 管理进程
```bash
# 查看所有进程状态
pm2 status
pm2 list

# 重启应用
pm2 restart english-learning
pm2 restart all

# 停止应用
pm2 stop english-learning
pm2 stop all

# 删除应用
pm2 delete english-learning
pm2 delete all

# 重新加载应用（零停机时间）
pm2 reload english-learning
```

## 日志管理

### 查看日志
```bash
# 查看实时日志
pm2 logs english-learning

# 查看所有应用日志
pm2 logs

# 查看指定行数的日志
pm2 logs english-learning --lines 100

# 清空日志
pm2 flush
```

### 日志轮转
```bash
# 安装日志轮转模块
pm2 install pm2-logrotate

# 配置日志轮转
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
pm2 set pm2-logrotate:compress true
```

## 监控和调试

### 实时监控
```bash
# 打开监控面板
pm2 monit

# 查看详细信息
pm2 show english-learning

# 查看进程资源使用情况
pm2 prettylist
```

### 性能监控
```bash
# 启用性能监控
pm2 install pm2-server-monit

# 查看 CPU 和内存使用情况
pm2 monit
```

## 集群管理

### 扩展实例
```bash
# 扩展到 4 个实例
pm2 scale english-learning 4

# 扩展到最大 CPU 核心数
pm2 scale english-learning max
```

### 负载均衡
```bash
# 查看负载均衡状态
pm2 show english-learning

# 重新平衡负载
pm2 reload english-learning
```

## 开机自启

### 设置自启动
```bash
# 生成启动脚本
pm2 startup

# 保存当前进程列表
pm2 save

# 恢复保存的进程
pm2 resurrect
```

### 取消自启动
```bash
# 取消自启动
pm2 unstartup
```

## 部署相关

### 远程部署
```bash
# 设置部署环境
pm2 deploy ecosystem.config.js production setup

# 部署到生产环境
pm2 deploy ecosystem.config.js production

# 回滚到上一个版本
pm2 deploy ecosystem.config.js production revert 1
```

### 更新应用
```bash
# 拉取最新代码并重启
git pull origin main
npm install
npm run build
pm2 reload english-learning
```

## 故障排除

### 常见问题
```bash
# 检查进程是否运行
pm2 list | grep english-learning

# 查看错误日志
pm2 logs english-learning --err

# 重置进程
pm2 reset english-learning

# 强制重启
pm2 restart english-learning --force
```

### 内存泄漏处理
```bash
# 设置内存限制自动重启
pm2 start ecosystem.config.js --max-memory-restart 1G

# 监控内存使用
pm2 monit
```

## 配置管理

### 环境变量
```bash
# 查看环境变量
pm2 env 0

# 设置环境变量
pm2 restart english-learning --update-env
```

### 配置文件更新
```bash
# 重新加载配置文件
pm2 reload ecosystem.config.js

# 删除并重新启动
pm2 delete english-learning
pm2 start ecosystem.config.js
```

## 性能优化

### 集群模式优化
- 使用 `cluster` 模式充分利用多核 CPU
- 设置合适的实例数量（通常等于 CPU 核心数）
- 启用负载均衡

### 内存管理
- 设置 `max_memory_restart` 防止内存泄漏
- 定期监控内存使用情况
- 使用 `--max-old-space-size` 调整 V8 内存限制

### 日志管理
- 启用日志轮转避免磁盘空间不足
- 设置合适的日志保留策略
- 使用结构化日志格式便于分析