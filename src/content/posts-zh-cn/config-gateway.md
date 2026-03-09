---
title: "OpenClaw网关配置指南"
description: "OpenClaw网关配置完全指南。了解端口、主机、安全、性能调优和生产部署。"
pubDate: 2026-03-09
lastUpdated: 2026-03-09
tags: ["网关", "配置", "生产环境", "中级"]
difficulty: "intermediate"
estimatedTime: "10 minutes"
prerequisites: ["已安装OpenClaw", "基本配置"]
alternates:
  en: "/posts/config-gateway/"
---

## 概述

配置OpenClaw网关以在生产环境中获得最佳性能、安全性和可靠性。

## 基本配置

### 端口配置

**默认端口：** `18789`

**设置自定义端口：**

```json
{
  "gateway": {
    "port": 3000
  }
}
```

**或使用CLI：**

```bash
openclaw gateway --port 3000
```

**选择端口：**
- 使用端口 > 1024（不需要root）
- 避免常用端口（80、443、8080）
- 记录您的端口选择

### 主机配置

**监听所有接口：**

```json
{
  "gateway": {
    "host": "0.0.0.0"
  }
}
```

**仅本地监听：**

```json
{
  "gateway": {
    "host": "localhost"
  }
}
```

## 安全配置

### 身份验证

**启用API身份验证：**

```json
{
  "gateway": {
    "auth": {
      "enabled": true,
      "token": "YOUR_SECRET_TOKEN"
    }
  }
}
```

**生成安全令牌：**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### CORS配置

**允许特定来源：**

```json
{
  "gateway": {
    "cors": {
      "enabled": true,
      "origin": ["https://yourdomain.com"]
    }
  }
}
```

### 速率限制

**启用速率限制：**

```json
{
  "gateway": {
    "rateLimit": {
      "enabled": true,
      "windowMs": 60000,
      "max": 100
    }
  }
}
```

## 性能调优

### 工作线程

**启用多个工作线程：**

```json
{
  "gateway": {
    "workers": 4
  }
}
```

**推荐：** CPU核心数

### 连接池

**配置连接池：**

```json
{
  "gateway": {
    "pool": {
      "min": 2,
      "max": 10
    }
  }
}
```

## 生产部署

### 环境变量

**使用环境变量：**

```bash
export OPENCLAW_PORT=18789
export OPENCLAW_HOST=0.0.0.0
export OPENCLAW_LOG_LEVEL=info
```

### 进程管理器（PM2）

**使用PM2部署：**

```bash
npm install -g pm2
pm2 start openclaw --name gateway -- gateway
pm2 save
pm2 startup
```

### Docker部署

**docker-compose.yml:**

```yaml
version: '3.8'
services:
  gateway:
    image: openclaw:latest
    ports:
      - "18789:18789"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

## 监控

### 健康检查

**检查健康状态：**

```bash
curl http://localhost:18789/health
```

## 常见问题

### 问题：端口已被占用

**解决方案：**
```bash
lsof -i :18789
kill -9 [PID]
```

### 问题：内存使用率高

**解决方案：**
- 减少工作线程数
- 启用连接池
- 设置内存限制

## 下一步

- [CLI命令参考](/posts/cli-commands/)
- [配置参考](/posts/config-reference/)

## 附加资源

- [OpenClaw GitHub](https://github.com/openclaw/openclaw)
- [性能最佳实践](https://github.com/openclaw/openclaw/docs/performance.md)
