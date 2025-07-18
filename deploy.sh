#!/bin/bash

# 技术博客部署脚本
echo "🚀 开始部署技术博客..."

# 停止现有容器
echo "🛑 停止现有容器..."
docker-compose down

# 清理旧镜像（可选）
echo "🧹 清理旧镜像..."
docker rmi -f tech-blog:latest 2>/dev/null || true

# 构建新镜像
echo "📦 构建新镜像..."
docker-compose build --no-cache

# 启动服务
echo "🚀 启动服务..."
docker-compose up -d

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 10

# 检查服务状态
echo "🔍 检查服务状态..."
docker-compose ps

# 健康检查
echo "❤️ 健康检查..."
if curl -f http://localhost:3000/ > /dev/null 2>&1; then
    echo "✅ 服务部署成功！"
    echo "🌐 博客地址: http://localhost:3000"
else
    echo "❌ 服务可能有问题，请检查日志:"
    echo "docker-compose logs tech-blog"
fi

echo ""
echo "📋 有用的命令:"
echo "查看日志: docker-compose logs -f tech-blog"
echo "重启服务: docker-compose restart tech-blog"
echo "停止服务: docker-compose down"
echo "进入容器: docker-compose exec tech-blog sh" 