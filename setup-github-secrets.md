# GitHub Secrets 设置指南

## 为什么需要设置 GitHub Secrets？

由于 Apple Silicon 设备上的 Rosetta 兼容性问题，我们无法直接构建 AMD64 架构的 Docker 镜像。GitHub Actions 提供了云端构建环境，可以完美解决这个问题。

## 设置步骤

### 1. 获取 Docker Hub Access Token（推荐）

1. 访问 [Docker Hub](https://hub.docker.com/)
2. 登录你的账户（youhebukeer）
3. 点击右上角头像 → Account Settings
4. 选择 Security 选项卡
5. 点击 "New Access Token"
6. 输入 Token 名称（如：tech-blog-github-actions）
7. 设置权限：Read, Write, Delete
8. 点击 "Generate"
9. **重要**：复制生成的 Token（只显示一次）

### 2. 在 GitHub 仓库中设置 Secrets

1. 访问你的 GitHub 仓库：https://github.com/zhangjiana/tech-blog
2. 点击 "Settings" 选项卡
3. 在左侧菜单中选择 "Secrets and variables" → "Actions"
4. 点击 "New repository secret"

设置以下两个 Secrets：

#### DOCKER_USERNAME
- Name: `DOCKER_USERNAME`
- Value: `youhebukeer`

#### DOCKER_PASSWORD
- Name: `DOCKER_PASSWORD`
- Value: 刚才复制的 Docker Hub Access Token

### 3. 验证设置

设置完成后，你的 Secrets 列表应该包含：
- ✅ DOCKER_USERNAME
- ✅ DOCKER_PASSWORD

## 触发构建

设置完成后，运行以下命令触发构建：

```bash
./trigger-github-build.sh
```

或者手动触发：

```bash
# 创建并推送标签
git tag -a v1.0.1 -m "Trigger multi-arch build"
git push origin v1.0.1
```

## 查看构建状态

- 访问：https://github.com/zhangjiana/tech-blog/actions
- 查看 "Build Multi-Architecture Docker Image" 工作流

## 构建完成后

构建成功后，你将得到支持多架构的 Docker 镜像：
- `youhebukeer/tech-blog:latest` - 支持 linux/amd64 和 linux/arm64
- `youhebukeer/tech-blog:v1.0.1` - 特定版本

在 Linux 服务器上使用：
```bash
docker run -d -p 3000:3000 --name tech-blog youhebukeer/tech-blog:latest
```

## 问题排查

如果构建失败，请检查：
1. Docker Hub 用户名是否正确
2. Access Token 是否有效
3. GitHub Secrets 是否设置正确
4. 网络连接是否正常 