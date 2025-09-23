#!/bin/bash

# 新概念英语学习网站 PM2 部署脚本
# 使用方法: ./scripts/deploy.sh [environment]
# 环境: production, staging, development

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查参数
ENVIRONMENT=${1:-production}

log_info "开始部署到 $ENVIRONMENT 环境..."

# 检查 PM2 是否安装
if ! command -v pm2 &> /dev/null; then
    log_error "PM2 未安装，请先安装 PM2: npm install -g pm2"
    exit 1
fi

# 检查 Node.js 版本
NODE_VERSION=$(node -v)
log_info "当前 Node.js 版本: $NODE_VERSION"

# 创建日志目录
if [ ! -d "logs" ]; then
    mkdir -p logs
    log_info "创建日志目录: logs/"
fi

# 安装依赖
log_info "安装项目依赖..."
npm ci --production=false

# 构建项目
log_info "构建项目..."
npm run build

# 检查构建输出
if [ ! -f ".output/server/index.mjs" ]; then
    log_error "构建失败，未找到服务器入口文件"
    exit 1
fi

log_success "项目构建完成"

# 停止现有进程（如果存在）
if pm2 list | grep -q "english-learning"; then
    log_info "停止现有的 PM2 进程..."
    pm2 stop english-learning || true
    pm2 delete english-learning || true
fi

# 启动 PM2 进程
log_info "启动 PM2 进程 (环境: $ENVIRONMENT)..."
pm2 start ecosystem.config.js --env $ENVIRONMENT

# 保存 PM2 配置
pm2 save

# 设置 PM2 开机自启
pm2 startup

log_success "部署完成！"

# 显示进程状态
log_info "当前进程状态:"
pm2 status

# 显示日志位置
log_info "日志文件位置:"
echo "  - 综合日志: $(pwd)/logs/combined.log"
echo "  - 输出日志: $(pwd)/logs/out.log"
echo "  - 错误日志: $(pwd)/logs/error.log"

# 显示监控命令
log_info "常用监控命令:"
echo "  - 查看状态: pm2 status"
echo "  - 查看日志: pm2 logs english-learning"
echo "  - 重启应用: pm2 restart english-learning"
echo "  - 停止应用: pm2 stop english-learning"
echo "  - 监控面板: pm2 monit"

log_success "🎉 新概念英语学习网站部署成功！"