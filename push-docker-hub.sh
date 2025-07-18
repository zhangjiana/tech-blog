#!/bin/bash

# 技术博客 Docker Hub 推送脚本
echo "🚀 开始推送技术博客到 Docker Hub..."

# 检查Docker是否运行
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker daemon 未运行，请先启动 Docker Desktop"
    exit 1
fi

# 检查是否已登录Docker Hub
if ! docker info | grep -q "Username:"; then
    echo "⚠️ 未登录Docker Hub，请先登录："
    echo "docker login"
    echo ""
    echo "如果没有账户，请访问 https://hub.docker.com/ 创建账户"
    exit 1
fi

# 推送镜像
echo "📦 推送镜像到 Docker Hub..."
echo ""

# 推送latest版本
echo "🔄 推送 latest 版本..."
docker push youhebukeer/tech-blog:latest

if [ $? -eq 0 ]; then
    echo "✅ latest 版本推送成功！"
else
    echo "❌ latest 版本推送失败"
    exit 1
fi

# 推送v1.0.0版本
echo "🔄 推送 v1.0.0 版本..."
docker push youhebukeer/tech-blog:v1.0.0

if [ $? -eq 0 ]; then
    echo "✅ v1.0.0 版本推送成功！"
else
    echo "❌ v1.0.0 版本推送失败"
    exit 1
fi

echo ""
echo "🎉 推送完成！"
echo ""
echo "🔗 Docker Hub 链接:"
echo "https://hub.docker.com/r/youhebukeer/tech-blog"
echo ""
echo "📋 使用命令:"
echo "docker pull youhebukeer/tech-blog:latest"
echo "docker run -p 3000:3000 youhebukeer/tech-blog:latest"
echo ""
echo "🌐 部署到服务器:"
echo "docker run -d -p 3000:3000 --name tech-blog youhebukeer/tech-blog:latest" 