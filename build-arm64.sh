#!/bin/bash

# ARM64 架构 Docker 镜像构建脚本（Apple Silicon 专用）
echo "🚀 开始构建 ARM64 架构技术博客 Docker 镜像..."

# 检查Docker是否运行
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker daemon 未运行，请先启动 Docker Desktop"
    exit 1
fi

# 构建ARM64镜像
echo "📦 构建 ARM64 镜像..."
docker buildx build \
    --platform linux/arm64 \
    --tag youhebukeer/tech-blog:arm64 \
    --tag youhebukeer/tech-blog:latest-arm64 \
    --push \
    .

if [ $? -eq 0 ]; then
    echo "✅ ARM64 镜像构建并推送成功！"
    
    echo ""
    echo "🎉 构建完成！"
    echo ""
    echo "🔗 Docker Hub 链接:"
    echo "https://hub.docker.com/r/youhebukeer/tech-blog"
    echo ""
    echo "📋 ARM64 镜像标签:"
    echo "- youhebukeer/tech-blog:arm64"
    echo "- youhebukeer/tech-blog:latest-arm64"
    echo ""
    echo "⚠️  注意：此镜像仅适用于 ARM64 架构（Apple Silicon、ARM 服务器）"
    echo ""
    echo "🌐 在 ARM64 服务器上运行:"
    echo "docker run -d -p 3000:3000 --name tech-blog youhebukeer/tech-blog:arm64"
else
    echo "❌ ARM64 镜像构建失败"
    exit 1
fi 