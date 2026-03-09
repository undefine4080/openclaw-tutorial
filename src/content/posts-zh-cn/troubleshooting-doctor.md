---
title: "OpenClaw Doctor：完整故障排除指南"
description: "掌握openclaw doctor命令来诊断和修复OpenClaw问题。学习如何解释健康检查并解决常见问题。"
pubDate: 2026-03-09
lastUpdated: 2026-03-09
tags: ["故障排除", "doctor", "诊断", "初学者"]
difficulty: "beginner"
estimatedTime: "8 minutes"
prerequisites: ["已安装OpenClaw"]
alternates:
  en: "/posts/troubleshooting-doctor/"
---

## 概述

`openclaw doctor`命令是您防御OpenClaw问题的第一线。它执行全面的健康检查并提供可操作的解决方案。

## 什么是OpenClaw Doctor？

`openclaw doctor`是一个内置诊断工具，它可以：
- ✅ **检查系统健康：** Node.js版本、npm、权限
- ✅ **验证配置：** JSON语法、必需字段
- ✅ **测试连接：** 网关状态、频道连接
- ✅ **识别问题：** 清晰的错误消息和解决方案
- ✅ **建议修复：** 可操作的故障排除步骤

## 基本用法

**运行完整诊断：**

```bash
openclaw doctor
```

**预期输出（健康系统）：**
```
✓ OpenClaw is installed: v1.0.0
✓ Node.js version: v22.3.0
✓ npm version: 10.5.0
✓ Configuration file: ~/.openclaw/openclaw.json
✓ Gateway status: Running (PID: 12345)
✓ Channels connected: 2 (telegram, discord)
✓ Health check: PASSED
```

**有问题时的输出：**
```
✗ OpenClaw is installed: v1.0.0
✗ Node.js version: v20.5.0 (requires v22+)
✓ npm version: 10.5.0
✓ Configuration file: ~/.openclaw/openclaw.json
✗ Gateway status: Not running
✗ Channels connected: 0
✗ Health check: FAILED

Issues found:
1. Node.js version too low
   → Fix: nvm install 22 && nvm use 22

2. Gateway not running
   → Fix: openclaw gateway start
```

## 诊断检查

### 1. 安装检查

**检查内容：**
- OpenClaw版本
- 安装路径
- 二进制完整性

**示例输出：**
```
✓ OpenClaw version: v1.0.0
✓ Installation path: /usr/local/lib/node_modules/openclaw
✓ Binary location: /usr/local/bin/openclaw
```

**常见问题：**
- **"OpenClaw not found"** → 全局安装：`npm install -g openclaw`
- **"Multiple versions found"** → 卸载并重新安装

### 2. Node.js检查

**检查内容：**
- Node.js版本
- npm版本
- 版本兼容性

**示例输出：**
```
✓ Node.js version: v22.3.0
✓ npm version: 10.5.0
✓ Compatibility: OK
```

**常见问题：**
- **"Node version too low"** → 升级：`nvm install 22 && nvm use 22`
- **"npm not found"** → 重新安装Node.js

### 3. 配置检查

**检查内容：**
- 配置文件存在性
- JSON语法
- 必需字段
- 文件权限

**示例输出：**
```
✓ Configuration file: ~/.openclaw/openclaw.json
✓ JSON syntax: Valid
✓ Required fields: OK
✓ File permissions: 644
```

**常见问题：**
- **"Config not found"** → 运行：`openclaw onboard`
- **"Invalid JSON"** → 验证：`cat ~/.openclaw/openclaw.json | jq .`
- **"Permission denied"** → 修复：`chmod 644 ~/.openclaw/openclaw.json`

### 4. 网关检查

**检查内容：**
- 网关状态
- 端口可用性
- 进程健康
- 日志错误

**示例输出：**
```
✓ Gateway status: Running
✓ Port: 18789
✓ Process ID: 12345
✓ Uptime: 2 hours 15 minutes
✓ Recent errors: None
```

**常见问题：**
- **"Gateway not running"** → 启动：`openclaw gateway start`
- **"Port already in use"** → 查找进程：`lsof -i :18789`
- **"Crashed recently"** → 检查日志：`openclaw logs --tail 50`

### 5. 频道检查

**检查内容：**
- 频道配置
- 连接状态
- 身份验证
- 最后活动

**示例输出：**
```
✓ Channels configured: 2
  - telegram: Connected (last activity: 2 minutes ago)
  - discord: Connected (last activity: 5 minutes ago)
✓ Authentication: OK
```

**常见问题：**
- **"No channels configured"** → 添加频道：`openclaw onboard`
- **"Authentication failed"** → 检查配置中的令牌
- **"Connection lost"** → 测试网络：`ping google.com`

## 高级用法

### 详细模式

用于详细诊断：

```bash
openclaw doctor --verbose
```

包括：
- 完整配置转储
- 环境变量
- 网络诊断
- 资源使用

### 特定检查

仅检查特定组件：

```bash
# 仅检查配置
openclaw doctor config

# 仅检查网关
openclaw doctor gateway

# 仅检查频道
openclaw doctor channels
```

### JSON输出

用于脚本/解析：

```bash
openclaw doctor --json
```

输出：
```json
{
  "status": "failed",
  "checks": {
    "node": {"status": "passed", "version": "v22.3.0"},
    "config": {"status": "failed", "error": "Invalid JSON"},
    "gateway": {"status": "passed", "running": true}
  }
}
```

## 常见场景

### 场景1：全新安装

**问题：** 刚刚安装，不确定是否工作

**解决方案：**
```bash
openclaw doctor
```

检查：
- ✓ 所有检查通过
- ✓ 未报告错误

### 场景2：网关不工作

**问题：** 命令无响应

**解决方案：**
```bash
openclaw doctor gateway
```

检查：
- 网关是否运行？
- 端口是否可用？
- 日志中是否有错误？

### 场景3：频道问题

**问题：** Telegram/Discord不工作

**解决方案：**
```bash
openclaw doctor channels
```

检查：
- 频道是否配置？
- 令牌是否有效？
- 连接是否活动？

### 场景4：更新后

**问题：** 更新了OpenClaw，某些东西坏了

**解决方案：**
```bash
openclaw doctor --verbose
```

检查：
- 版本兼容性
- 配置格式更改
- 破坏性更改

## Doctor问题故障排除

### 问题："Doctor not found"

**原因：** OpenClaw未安装或不在PATH中

**解决方案：**
```bash
# 检查安装
which openclaw

# 如需要重新安装
npm install -g openclaw

# 或使用npx
npx openclaw doctor
```

### 问题："Permission denied"

**原因：** 无法访问配置文件

**解决方案：**
```bash
# 修复权限
chmod 644 ~/.openclaw/openclaw.json
chown $USER:$USER ~/.openclaw/openclaw.json
```

### 问题："Timeout during check"

**原因：** 网络问题或服务挂起

**解决方案：**
```bash
# 检查网络
ping google.com

# 重启网关
openclaw gateway restart

# 尝试特定检查
openclaw doctor config
```

## 最佳实践

1. **定期运行doctor**（每周或更改后）
2. **在报告问题之前**，始终运行`openclaw doctor`
3. **使用详细模式**进行调试
4. **保存输出**当报告错误时
5. **检查所有组件**，不仅仅是失败的

## 与CI/CD集成

**GitHub Actions示例：**

```yaml
name: OpenClaw健康检查

on: [push, pull_request]

jobs:
  health-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: 安装OpenClaw
        run: npm install -g openclaw
      - name: 运行诊断
        run: openclaw doctor --json
```

## 下一步

- [常见错误解决方案](/posts/troubleshooting-common-errors/)
- [配置指南](/posts/config-reference/)
- [CLI命令参考](/posts/cli-commands/)
- [网关配置](/posts/config-gateway/)

## 附加资源

- [OpenClaw GitHub Issues](https://github.com/openclaw/openclaw/issues)
- [社区讨论](https://github.com/openclaw/openclaw/discussions)
- [诊断最佳实践](https://github.com/openclaw/openclaw/docs/diagnostics.md)
