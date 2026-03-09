---
title: "快速开始：5分钟运行OpenClaw"
description: "在5分钟内在您的机器上运行OpenClaw。本快速入门指南涵盖安装、配置和发送第一条消息。"
pubDate: 2026-03-09
lastUpdated: 2026-03-09
tags: ["快速开始", "初学者", "安装"]
difficulty: "beginner"
estimatedTime: "5 minutes"
prerequisites: ["Node.js >= 22", "npm或pnpm"]
alternates:
  zhCN: "/zh-cn/start/"
---

## 概述

全局安装OpenClaw，运行设置向导，启动网关，发送第一条消息——全程只需5分钟。

## 你将学到

- ✅ 使用Node.js 22安装OpenClaw
- ✅ 运行配置向导
- ✅ 启动网关服务
- ✅ 发送第一条消息

## 要求

- **Node.js >= 22** (使用 `node --version` 检查)
- **npm或pnpm** (随Node.js一起安装)
- 终端/命令行访问
- 互联网连接

## 步骤1：安装Node.js 22（如需要）

OpenClaw需要Node.js 22或更高版本。检查您的版本：

```bash
node --version
```

如果版本低于22，升级Node.js：

**使用nvm（推荐）：**
```bash
nvm install 22
nvm use 22
```

**使用n（macOS/Linux）：**
```bash
sudo n 22
```

## 步骤2：全局安装OpenClaw

一旦Node.js 22就绪，安装OpenClaw：

```bash
npm install -g openclaw
```

**预期输出：**
```bash
added 1 package in 10s
```

## 步骤3：运行配置向导

配置向导设置您的网关、频道和技能：

```bash
openclaw onboard --install-daemon
```

这将：
- 将守护程序安装为用户服务（launchd/systemd）
- 引导您完成网关配置
- 设置您的第一个频道
- 安装默认技能

## 步骤4：启动您的网关

手动启动OpenClaw网关（如果向导未启动）：

```bash
openclaw gateway --port 18789 --verbose
```

**预期输出：**
```bash
[INFO] Starting OpenClaw Gateway...
[INFO] Listening on port 18789
[INFO] Gateway ready to accept connections
```

## 步骤5：发送第一条消息

通过网关测试发送消息：

```bash
openclaw message send --to "your-number" --content "你好，OpenClaw！"
```

## 成功标准

如果出现以下情况，说明设置成功：
- ✅ `openclaw --version` 显示版本号
- ✅ 网关监听端口18789
- ✅ 守护进程正在运行（使用 `openclaw doctor` 检查）
- ✅ 配置文件位于 `~/.openclaw/openclaw.json`

## 常见问题

### 问题："找不到命令"
**原因：** OpenClaw未安装或不在PATH中

**解决方案：**
```bash
# 全局重新安装
npm install -g openclaw

# 或临时使用npx
npx openclaw [命令]
```

### 问题："Node版本过低"
**原因：** Node.js版本 < 22

**解决方案：** 升级Node.js（见步骤1）

### 问题："端口18789已被占用"
**原因：** 另一个进程正在使用该端口

**解决方案：**
```bash
# 查找进程
lsof -i :18789  # macOS/Linux
netstat -ano | findstr :18789  # Windows

# 终止它或使用不同端口
openclaw gateway --port 18790
```

## 下一步

- [Node.js 22详细安装指南](/posts/install-node-22/)
- [Windows + WSL2设置指南](/posts/install-windows/)
- [npm全局安装指南](/posts/install-npm-global/)
- [Telegram集成配置](/posts/channels-telegram/)
- [使用openclaw doctor进行故障排除](/posts/troubleshooting-doctor/)

## 需要帮助？

- [故障排除指南](/posts/troubleshooting-common-errors/)
- [OpenClaw官方GitHub](https://github.com/openclaw/openclaw)
- [社区讨论](https://github.com/openclaw/openclaw/discussions)
