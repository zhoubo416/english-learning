# 新概念英语学习网站

基于 Nuxt.js 构建的现代化新概念英语在线学习平台，采用音乐软件风格的界面设计。

## ✨ 功能特性

- **🎵 现代音乐软件风格界面**: 深色主题 + 渐变背景 + 毛玻璃效果
- **📚 智能课程目录**: 自动扫描音频文件，支持折叠展开的课程列表
- **🎧 专业音频播放器**: 底部固定播放器，支持进度控制、音量调节
- **🎤 歌词式文本显示**: 居中高亮当前行，点击跳转，自动滚动定位
- **🌈 动态视觉效果**: 浮动音符动画 + 背景图片 + 渐变色彩
- **📱 响应式设计**: 适配不同屏幕尺寸的设备

## 🛠 技术栈

- **前端框架**: Nuxt.js 3
- **样式框架**: Tailwind CSS
- **图标库**: Heroicons
- **音频处理**: HTML5 Audio API
- **文件系统**: Node.js fs 模块
- **UI 设计**: 现代音乐软件风格

## 📁 项目结构

```
english-learning/
├── assert/                     # 音频和文本资源目录
│   ├── 新概念英语第1册美音（MP3+LRC）/
│   ├── 新概念英语第2册美音（MP3+LRC）/
│   ├── 新概念英语第3册美音（MP3+LRC）/
│   └── 新概念英语第4册美音（MP3+LRC）/
├── pages/                      # 页面组件
│   └── index.vue              # 主页面
├── server/api/                 # 服务端API
│   ├── lessons.get.ts         # 课程列表API
│   ├── audio/[...path].get.ts # 音频文件API
│   └── text/[book]/[lesson].get.ts # 文本内容API
├── composables/               # 组合式函数
│   └── useLessons.ts         # 课程数据管理
├── assets/css/               # 样式文件
├── .gitignore               # Git忽略文件
└── nuxt.config.ts           # Nuxt配置
```

## 🚀 快速开始

### 环境要求

- Node.js 16.x 或更高版本
- npm 或 yarn 包管理器

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000 查看应用。

### 构建生产版本

```bash
npm run build
```

## 📦 部署说明

### 1. 静态部署（推荐）

生成静态文件用于部署到静态托管服务：

```bash
# 生成静态文件
npm run generate

# 生成的文件在 .output/public 目录
# 可以部署到 Netlify, Vercel, GitHub Pages 等
```

**Netlify 部署步骤：**
1. 将代码推送到 GitHub
2. 在 Netlify 中连接 GitHub 仓库
3. 设置构建命令：`npm run generate`
4. 设置发布目录：`.output/public`
5. 点击部署

**Vercel 部署步骤：**
1. 安装 Vercel CLI：`npm i -g vercel`
2. 在项目根目录运行：`vercel`
3. 按提示完成部署配置

### 2. 服务器端渲染部署

构建 SSR 应用：

```bash
# 构建应用
npm run build

# 启动生产服务器
npm run preview
```

### 3. Docker 部署

创建 `Dockerfile`：

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "preview"]
```

构建和运行：

```bash
docker build -t english-learning .
docker run -p 3000:3000 english-learning
```

### 4. PM2 部署

使用 PM2 进行进程管理：

```bash
# 安装 PM2
npm install -g pm2

# 构建应用
npm run build

# 启动应用
pm2 start ecosystem.config.js
```

创建 `ecosystem.config.js`：

```javascript
module.exports = {
  apps: [{
    name: 'english-learning',
    script: '.output/server/index.mjs',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
```

### 5. Nginx 反向代理

Nginx 配置示例：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # 静态文件缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 6. 环境变量配置

创建 `.env` 文件（生产环境）：

```env
# 生产环境配置
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# 如果需要自定义资源路径
ASSETS_PATH=/path/to/your/assets
```

## 📖 使用说明

1. **准备资源文件**: 将新概念英语的音频文件（MP3）和歌词文件（LRC）放置在 `assert` 目录下
2. **启动应用**: 系统会自动扫描并加载所有课程
3. **选择课程**: 点击左侧课程列表选择要学习的课程
4. **音频播放**: 使用底部播放器控制音频播放
5. **文本同步**: 课文内容会在右侧区域同步高亮显示
6. **交互功能**: 点击任意文本行可跳转到对应时间点

## 🔧 API 接口

- `GET /api/lessons` - 获取所有课程列表
- `GET /api/audio/[...path]` - 获取音频文件流
- `GET /api/text/[book]/[lesson]` - 获取课程文本和LRC内容

## 🎨 界面特色

- **深色主题**: 现代音乐软件风格的深色界面
- **毛玻璃效果**: 半透明背景和模糊效果
- **渐变色彩**: 紫粉色调的渐变配色方案
- **动态动画**: 浮动音符和平滑过渡效果
- **歌词显示**: 类似音乐软件的歌词滚动效果

## 🔧 开发说明

### 文件命名规范

音频文件应遵循以下命名规范：
- MP3 文件：`001&002－Excuse Me.mp3`
- LRC 文件：`001&002－Excuse Me.lrc`

### 目录结构要求

```
assert/
└── 新概念英语第X册美音（MP3+LRC）/
    └── NCEX-美音-(MP3+LRC)/
        ├── 001&002－Excuse Me.mp3
        ├── 001&002－Excuse Me.lrc
        └── ...
```

### 自定义配置

可以在 `nuxt.config.ts` 中修改以下配置：
- 端口号
- 静态资源路径
- API 路由前缀

## 🐛 故障排除

### 常见问题

1. **音频无法播放**
   - 检查音频文件格式是否为 MP3
   - 确认文件路径正确
   - 检查浏览器音频权限

2. **课文不显示**
   - 确认 LRC 文件存在
   - 检查 LRC 文件格式是否正确
   - 查看浏览器控制台错误信息

3. **课程列表为空**
   - 检查 `assert` 目录是否存在
   - 确认目录结构符合要求
   - 查看服务器日志

### 性能优化

- 使用 CDN 加速静态资源
- 启用 Gzip 压缩
- 配置适当的缓存策略
- 优化音频文件大小

## 📝 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！

### 贡献指南

1. Fork 本仓库
2. 创建特性分支：`git checkout -b feature/AmazingFeature`
3. 提交更改：`git commit -m 'Add some AmazingFeature'`
4. 推送到分支：`git push origin feature/AmazingFeature`
5. 打开 Pull Request

## 📞 支持

如果您在使用过程中遇到问题，请：
1. 查看本文档的故障排除部分
2. 搜索已有的 Issues
3. 创建新的 Issue 并提供详细信息

---

**享受您的英语学习之旅！** 🎉