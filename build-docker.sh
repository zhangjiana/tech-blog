#!/bin/bash

# 技术博客 Docker 构建脚本
echo "🚀 开始构建技术博客 Docker 镜像..."

# 检查Docker是否运行
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker daemon 未运行，请先启动 Docker Desktop"
    exit 1
fi

# 构建镜像
echo "📦 构建 Docker 镜像（使用 pnpm）..."
docker build -t tech-blog:latest .

if [ $? -eq 0 ]; then
    echo "✅ 镜像构建成功！"
    
    # 显示镜像信息
    echo ""
    echo "📋 镜像信息:"
    docker images tech-blog:latest
    
    echo ""
    echo "🎉 构建完成！可以使用以下命令运行:"
    echo "docker run -p 3000:3000 tech-blog:latest"
    echo ""
    echo "或者使用 docker-compose:"
    echo "docker-compose up -d"
else
    echo "❌ 镜像构建失败"
    exit 1
fi 