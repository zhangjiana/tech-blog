#!/bin/bash

# AMD64 架构 Docker 镜像构建脚本（Linux 服务器专用）
echo "🚀 开始构建 AMD64 架构技术博客 Docker 镜像..."

# 检查Docker是否运行
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker daemon 未运行，请先启动 Docker Desktop"
    exit 1
fi

# 构建AMD64镜像
echo "📦 构建 AMD64 镜像（Linux 服务器专用）..."
docker buildx build \
    --platform linux/amd64 \
    --tag youhebukeer/tech-blog:amd64 \
    --tag youhebukeer/tech-blog:latest-amd64 \
    --push \
    .

if [ $? -eq 0 ]; then
    echo "✅ AMD64 镜像构建并推送成功！"
    
    echo ""
    echo "🎉 构建完成！"
    echo ""
    echo "🔗 Docker Hub 链接:"
    echo "https://hub.docker.com/r/youhebukeer/tech-blog"
    echo ""
    echo "📋 AMD64 镜像标签:"
    echo "- youhebukeer/tech-blog:amd64"
    echo "- youhebukeer/tech-blog:latest-amd64"
    echo ""
    echo "✅ 此镜像适用于大多数 Linux 服务器（Intel/AMD 64位）"
    echo ""
    echo "🌐 在 Linux 服务器上运行:"
    echo "docker run -d -p 3000:3000 --name tech-blog youhebukeer/tech-blog:amd64"
else
    echo "❌ AMD64 镜像构建失败"
    echo ""
    echo "💡 如果遇到 Rosetta 错误，请尝试以下解决方案："
    echo "1. 启用 Docker Desktop Rosetta 支持"
    echo "2. 使用 GitHub Actions 云端构建"
    echo "3. 运行 ./trigger-github-build.sh 脚本"
    exit 1
fi 