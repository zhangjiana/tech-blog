# 技术博客系统

一个基于 Next.js + TailwindCSS + MDX 构建的专业技术博客系统，专注于前端架构和工程实践分享。

## 🚀 快速开始

### 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建项目
pnpm build

# 启动生产服务器
pnpm start
```

访问 [http://localhost:3000](http://localhost:3000) 查看博客。

## 🐳 Docker 部署

### 方式一：使用构建脚本（推荐）

```bash
# 构建 Docker 镜像（本地单架构）
./build-docker.sh

# 运行容器
docker run -p 3000:3000 tech-blog:latest
```

### 方式一.1：构建多架构镜像（生产环境推荐）

```bash
# 登录Docker Hub
docker login

# 构建并推送多架构镜像（支持 linux/amd64, linux/arm64）
./build-multiarch.sh
```

### 方式二：使用 Docker Compose

```bash
# 构建并启动服务
docker-compose up -d

# 查看运行状态
docker-compose ps

# 查看日志
docker-compose logs -f tech-blog

# 停止服务
docker-compose down
```

### 方式三：使用部署脚本

```bash
# 一键部署（包含构建、启动、健康检查）
./deploy.sh
```

## 🔧 技术栈

- **框架**: Next.js 15.4.1
- **样式**: TailwindCSS v4
- **内容**: MDX (Markdown + React)
- **语法高亮**: rehype-highlight
- **Markdown 增强**: remark-gfm
- **字体**: Geist Sans & Geist Mono

## 📁 项目结构

```
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── blog/           # 博客相关页面
│   │   ├── about/          # 关于页面
│   │   └── layout.tsx      # 全局布局
│   ├── components/         # React 组件
│   ├── content/posts/      # Markdown 文章
│   ├── lib/               # 工具函数
│   └── types/             # TypeScript 类型定义
├── public/                # 静态资源
├── Dockerfile             # Docker 镜像配置
├── docker-compose.yml     # Docker Compose 配置
├── build-docker.sh        # Docker 构建脚本
└── deploy.sh              # 部署脚本
```

## 📝 内容管理

### 添加新文章

1. 在 `src/content/posts/` 目录下创建新的 `.md` 文件
2. 添加必要的 frontmatter：

```markdown
---
title: "文章标题"
description: "文章描述"
publishedAt: "2024-01-01"
category: "分类名称"
tags: ["标签1", "标签2"]
featured: true
---

# 文章内容
```

### 支持的分类

- React
- Vue
- 微前端
- 工程化
- 监控系统
- 性能优化

## 🌐 部署到生产环境

### 方式一：使用 Docker

```bash
# 在服务器上克隆项目
git clone https://github.com/zhangjiana/tech-blog.git
cd tech-blog

# 使用部署脚本
./deploy.sh
```

### 方式二：使用 Docker Hub

```bash
# 推送到Docker Hub（多架构）
docker login
./build-multiarch.sh

# 在服务器上直接运行
docker run -d -p 3000:3000 --name tech-blog youhebukeer/tech-blog:latest

# 或者使用生产环境compose文件
docker-compose -f docker-compose.prod.yml up -d
```

### 方式三：使用 Vercel（推荐）

1. 连接 GitHub 仓库到 Vercel
2. 自动部署，无需额外配置

### 方式四：使用 Nginx + Docker

```bash
# 启动博客服务
docker-compose up -d

# 配置 Nginx 反向代理
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🔍 SEO 优化

- ✅ 完整的 meta 标签配置
- ✅ OpenGraph 社交分享优化
- ✅ JSON-LD 结构化数据
- ✅ 自动生成 sitemap
- ✅ 语义化 HTML 结构
- ✅ 移动端响应式设计

## 📊 性能特性

- ✅ 静态生成 (SSG)
- ✅ 图片优化
- ✅ 代码分割
- ✅ 懒加载
- ✅ 压缩优化
- ✅ CDN 友好

## 🛠️ 开发命令

```bash
# 开发模式
pnpm dev

# 构建项目
pnpm build

# 启动生产服务器
pnpm start

# 类型检查
pnpm type-check

# 代码格式化
pnpm format
```

## 🏗️ 多架构构建说明

### 构建支持 Linux 服务器的镜像

由于本地是 ARM 架构（Apple Silicon），构建的镜像无法在 Linux AMD64 服务器上运行。使用多架构构建解决此问题：

```bash
# 1. 登录 Docker Hub
docker login

# 2. 构建多架构镜像并推送
./build-multiarch.sh
```

### 支持的架构

- **linux/amd64**: Intel/AMD 64位处理器（大多数Linux服务器）
- **linux/arm64**: ARM 64位处理器（Apple Silicon, ARM服务器）

### 验证多架构镜像

```bash
# 查看镜像支持的架构
docker manifest inspect youhebukeer/tech-blog:latest

# 在Linux服务器上拉取镜像（会自动选择合适的架构）
docker pull youhebukeer/tech-blog:latest
```

## 🐛 故障排除

### Docker 相关问题

1. **Docker daemon 未运行**
   ```bash
   # macOS: 启动 Docker Desktop
   # Linux: 启动 Docker 服务
   sudo systemctl start docker
   ```

2. **端口占用**
   ```bash
   # 查看端口占用
   lsof -i :3000
   
   # 修改端口
   docker run -p 8080:3000 tech-blog:latest
   ```

3. **构建失败**
   ```bash
   # 清理 Docker 缓存
   docker builder prune
   
   # 重新构建
   docker-compose build --no-cache
   ```

### 多架构构建问题（Apple Silicon）

**问题**：Rosetta 模拟错误，无法构建 AMD64 架构

**解决方案**：

#### 方案一：启用 Docker Desktop Rosetta 支持
1. 打开 Docker Desktop
2. 进入 Settings → General
3. 勾选 "Use Rosetta for x86_64/amd64 emulation on Apple Silicon"
4. 重启 Docker Desktop
5. 再次运行 `./build-multiarch.sh`

#### 方案二：使用 GitHub Actions 云端构建（推荐）
1. 在 GitHub 仓库中设置 Secrets：
   - `DOCKER_USERNAME`: Docker Hub 用户名
   - `DOCKER_PASSWORD`: Docker Hub 密码或 Access Token
2. 推送代码到 GitHub，自动触发构建
3. 在 Actions 页面查看构建状态

#### 方案三：仅构建 ARM64 架构
```bash
# 构建仅支持 ARM64 架构的镜像
./build-arm64.sh
```

#### 方案四：使用预构建镜像
```bash
# 直接使用已构建的多架构镜像
docker pull youhebukeer/tech-blog:latest
docker run -d -p 3000:3000 youhebukeer/tech-blog:latest
```

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**作者**: 张建 - 前端架构师  
**邮箱**: zhangjian_9253@163.com  
**博客**: https://zhangjiana.github.io/
