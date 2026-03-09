---
title: "OpenClaw配置参考"
description: "OpenClaw配置文件完整参考。openclaw.json的所有选项、示例和最佳实践。"
pubDate: 2026-03-09
lastUpdated: 2026-03-09
tags: ["配置", "参考", "json", "初学者"]
difficulty: "beginner"
estimatedTime: "10 minutes"
prerequisites: ["已安装OpenClaw"]
alternates:
  en: "/posts/config-reference/"
---

## 概述

`openclaw.json`配置文件完整参考。所有可用选项、默认值和示例。

## 配置文件位置

**默认位置：** `~/.openclaw/openclaw.json`

## 完整示例

```json
{
  "gateway": {
    "port": 18789,
    "host": "localhost"
  },
  "channels": [
    {
      "type": "telegram",
      "token": "YOUR_TELEGRAM_BOT_TOKEN"
    },
    {
      "type": "discord",
      "token": "YOUR_DISCORD_BOT_TOKEN",
      "clientId": "YOUR_DISCORD_CLIENT_ID",
      "intents": ["GUILDS", "GUILD_MESSAGES", "MESSAGE_CONTENT"]
    }
  ],
  "skills": ["ping", "echo", "weather"]
}
```

## 网关配置

### `gateway.port`

**类型：** `number`  
**默认：** `18789`  
**描述：** 网关端口号

### `gateway.host`

**类型：** `string`  
**默认：** `"localhost"`  
**描述：** 绑定的主机地址

**常用值：**
- `"localhost"` - 仅本地
- `"0.0.0.0"` - 所有接口
- `"127.0.0.1"` - 仅本地（IPv4）

## 频道配置

### Telegram频道

```json
{
  "type": "telegram",
  "token": "YOUR_BOT_TOKEN",
  "webhook": false
}
```

**字段：**
- `type`（必需）- 必须是`"telegram"`
- `token`（必需）- 来自@BotFather的机器人令牌
- `webhook`（可选）- 启用webhook模式

### Discord频道

```json
{
  "type": "discord",
  "token": "YOUR_BOT_TOKEN",
  "clientId": "YOUR_CLIENT_ID",
  "intents": ["GUILDS", "GUILD_MESSAGES", "MESSAGE_CONTENT"],
  "prefix": "!"
}
```

**字段：**
- `type`（必需）- 必须是`"discord"`
- `token`（必需）- 机器人令牌
- `clientId`（必需）- 应用程序ID
- `intents`（可选）- 网关Intent
- `prefix`（可选）- 命令前缀（默认：`"!"`）

## 环境变量

配置可以使用环境变量：

```json
{
  "gateway": {
    "port": "${OPENCLAW_PORT}",
    "host": "${OPENCLAW_HOST}"
  }
}
```

**设置环境变量：**
```bash
export OPENCLAW_PORT=18789
export OPENCLAW_HOST=localhost
```

## 验证

**验证配置：**

```bash
openclaw config validate
```

## 最佳实践

1. **保护令牌** - 永远不要将令牌提交到git
2. **使用环境变量** - 用于敏感数据
3. **验证配置** - 更改后运行`openclaw config validate`
4. **备份配置** - 保留工作配置的副本

## 示例

### 最小配置

```json
{
  "gateway": {
    "port": 18789
  },
  "channels": [
    {
      "type": "telegram",
      "token": "YOUR_TOKEN"
    }
  ]
}
```

### 生产配置

```json
{
  "gateway": {
    "port": "${OPENCLAW_PORT}",
    "host": "0.0.0.0",
    "workers": 4,
    "auth": {
      "enabled": true,
      "token": "${OPENCLAW_AUTH_TOKEN}"
    }
  },
  "channels": [
    {
      "type": "telegram",
      "token": "${TELEGRAM_TOKEN}",
      "webhook": true
    }
  ],
  "logging": {
    "level": "info"
  }
}
```

## 下一步

- [CLI命令](/posts/cli-commands/)
- [网关配置](/posts/config-gateway/)
- [设置向导](/posts/start-onboard-wizard/)
