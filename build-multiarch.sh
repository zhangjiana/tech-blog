#!/bin/bash

# 多架构 Docker 镜像构建脚本
echo "🚀 开始构建多架构技术博客 Docker 镜像..."

# 检查Docker是否运行
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker daemon 未运行，请先启动 Docker Desktop"
    exit 1
fi

# 检查是否已登录Docker Hub
if ! docker info | grep -q "Username:"; then
    echo "⚠️ 未登录Docker Hub，请先登录："
    echo "docker login"
    exit 1
fi

# 创建并使用buildx构建器
echo "🔧 设置 Docker Buildx..."
docker buildx create --name multiarch-builder --use --bootstrap 2>/dev/null || docker buildx use multiarch-builder

# 检查构建器状态
echo "📋 检查构建器状态..."
docker buildx inspect multiarch-builder

# 构建并推送多架构镜像
echo "📦 构建多架构镜像（linux/amd64, linux/arm64）..."
echo "这个过程可能需要几分钟..."

docker buildx build \
    --platform linux/amd64,linux/arm64 \
    --tag youhebukeer/tech-blog:latest \
    --tag youhebukeer/tech-blog:v1.0.0 \
    --push \
    .

if [ $? -eq 0 ]; then
    echo "✅ 多架构镜像构建并推送成功！"
    
    echo ""
    echo "🎉 构建完成！"
    echo ""
    echo "🔗 Docker Hub 链接:"
    echo "https://hub.docker.com/r/youhebukeer/tech-blog"
    echo ""
    echo "📋 支持的架构:"
    echo "- linux/amd64 (Intel/AMD 64位)"
    echo "- linux/arm64 (ARM 64位)"
    echo ""
    echo "🌐 在 Linux 服务器上运行:"
    echo "docker run -d -p 3000:3000 --name tech-blog youhebukeer/tech-blog:latest"
    echo ""
    echo "🔍 验证镜像架构:"
    echo "docker manifest inspect youhebukeer/tech-blog:latest"
else
    echo "❌ 多架构镜像构建失败"
    exit 1
fi 