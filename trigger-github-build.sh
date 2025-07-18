#!/bin/bash

# 触发 GitHub Actions 构建 AMD64 镜像
echo "🚀 触发 GitHub Actions 构建 AMD64 镜像..."

# 检查是否在git仓库中
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ 当前目录不是 git 仓库"
    exit 1
fi

# 检查是否有未提交的更改
if ! git diff-index --quiet HEAD --; then
    echo "⚠️  检测到未提交的更改，是否先提交？(y/n)"
    read -r answer
    if [[ $answer == "y" || $answer == "Y" ]]; then
        echo "📝 提交更改..."
        git add -A
        git commit -m "Update before triggering multi-arch build"
        git push origin main
    fi
fi

# 创建一个构建触发标签
BUILD_TAG="build-$(date +%Y%m%d-%H%M%S)"
echo "🏷️  创建构建标签: $BUILD_TAG"

git tag -a "$BUILD_TAG" -m "Trigger multi-architecture build for AMD64"
git push origin "$BUILD_TAG"

if [ $? -eq 0 ]; then
    echo "✅ 构建触发成功！"
    echo ""
    echo "🔗 查看构建状态："
    echo "https://github.com/zhangjiana/tech-blog/actions"
    echo ""
    echo "⏰ 构建预计需要 5-10 分钟"
    echo ""
    echo "📋 构建完成后，可以使用以下命令："
    echo "docker pull youhebukeer/tech-blog:latest"
    echo "docker run -d -p 3000:3000 --name tech-blog youhebukeer/tech-blog:latest"
else
    echo "❌ 构建触发失败"
    exit 1
fi 