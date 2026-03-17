---
title: "5分钟为OpenClaw设置Telegram机器人"
description: "快速指南为OpenClaw设置Telegram机器人。创建机器人，获取令牌，并在5分钟内连接到OpenClaw。"
pubDate: 2026-03-09
lastUpdated: 2026-03-09
tags: ["telegram", "频道", "快速开始", "初学者"]
difficulty: "beginner"
estimatedTime: "5 minutes"
prerequisites: ["已安装OpenClaw", "Telegram账号"]
category: 01-getting-started
order: 2
prevPost: start
nextPost: channels-discord
relatedPosts: ["start", "channels-discord", "config-gateway"]
alternates:
  en: "/posts/channels-telegram/"
---

## 概述

通过BotFather创建Telegram机器人，获取您的机器人令牌，并在5分钟内配置OpenClaw以发送和接收Telegram消息。

## 为什么选择Telegram？

Telegram非常适合OpenClaw，因为：
- ✅ **简单设置：** 在2分钟内创建机器人
- ✅ **免费无限：** 没有消息限制或费用
- ✅ **快速：** 实时消息传递
- ✅ **丰富功能：** 照片、文件、按钮、内联键盘
- ✅ **跨平台：** 在所有设备上工作
- ✅ **隐私：** 端到端加密

## 步骤1：创建Telegram机器人

### 1.1 查找BotFather

1. 打开Telegram
2. 搜索`@BotFather`（已验证的蓝色对勾）
3. 开始聊天

### 1.2 创建新机器人

向BotFather发送此命令：
```
/newbot
```

BotFather将回复：
```
Alright, a new bot. How are we going to call it? Please choose a name for your bot.
```

### 1.3 选择机器人名称

**机器人显示名称**（用户看到的）：
```
OpenClaw Bot
```

**机器人用户名**（必须以'bot'结尾）：
```
OpenClawBot
```

### 1.4 获取您的令牌

BotFather将回复您的令牌：
```
Done! Congratulations on your new bot. You will find it at t.me/OpenClawBot. You can now add a description, about section and profile picture for your bot, see /help for a list of commands.

Use this token to access the HTTP API:
1234567890:ABCdefGHIjklMNOpqrsTUVwxyz

Keep your token secure and store it safely, it can be used by anyone to control your bot.
```

**⚠️ 复制此令牌并安全保存** - OpenClaw需要用到！

### 1.5 可选：自定义您的机器人

设置描述（可选）：
```
/setdescription
```

设置关于文本（可选）：
```
/setabouttext
```

设置个人资料图片（可选）：
```
/setuserpic
```

## 步骤2：测试您的机器人

### 2.1 查找您的机器人

1. 打开Telegram
2. 搜索您的机器人用户名（例如，`@OpenClawBot`）
3. 开始聊天

### 2.2 发送消息

输入`/start`并发送。

您的机器人应该回复（如果您已设置命令）：
```
Hello! I'm OpenClaw Bot.
```

## 步骤3：配置OpenClaw

### 3.1 选项A：使用配置向导

```bash
openclaw onboard
```

当提示时：
```
? 您想配置哪些频道？Telegram
? 输入您的Telegram机器人令牌：YOUR_BOT_TOKEN
```

### 3.2 选项B：编辑配置文件

```bash
nano ~/.openclaw/openclaw.json
```

添加Telegram频道：
```json
{
  "channels": [
    {
      "type": "telegram",
      "token": "YOUR_BOT_TOKEN"
    }
  ]
}
```

保存文件（Ctrl+O，Enter，Ctrl+X）。

## 步骤4：启动OpenClaw网关

```bash
openclaw gateway --verbose
```

**预期输出：**
```
[INFO] Starting OpenClaw Gateway...
[INFO] Loading channels...
[INFO] Telegram channel connected
[INFO] Gateway listening on port 18789
```

## 步骤5：测试集成

### 5.1 向机器人发送消息

在与机器人的Telegram聊天中，发送：
```
!ping
```

机器人应该回复：
```
pong
```

### 5.2 从OpenClaw发送消息

```bash
openclaw message send --to "YOUR_TELEGRAM_CHAT_ID" --content "Hello from OpenClaw!"
```

**如何找到您的聊天ID：**
1. 向您的机器人发送消息
2. 访问：`https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
3. 在响应中找到`"chat":{"id":123456789}`

## 高级配置

### 启用Webhooks（生产环境）

为了在生产环境中获得更好的性能：

```json
{
  "channels": [
    {
      "type": "telegram",
      "token": "YOUR_TOKEN",
      "webhook": {
        "url": "https://your-domain.com/telegram-webhook",
        "maxConnections": 100
      }
    }
  ]
}
```

### 自定义命令

```json
{
  "channels": [
    {
      "type": "telegram",
      "token": "YOUR_TOKEN",
      "commands": {
        "prefix": "!",
        "caseSensitive": false
      }
    }
  ]
}
```

### 群聊支持

在群组中使用您的机器人：
1. 将机器人添加到群组
2. 使机器人成为管理员
3. 启用群组隐私模式（可选）：
```
/setprivacy
```

## 常见问题

### 问题："机器人没有响应"

**解决方案：**
```bash
# 检查网关是否运行
openclaw gateway status

# 验证令牌是否正确
# 使用BotFather的/token命令测试

# 检查日志
openclaw logs --tail 50
```

### 问题："机器人不能向用户发送消息"

**原因：** 用户需要先启动机器人

**解决方案：**
1. 用户必须先向机器人发送`/start`
2. 或使用`/setprivacy`禁用

### 问题："Unauthorized: bot was blocked by the user"

**原因：** 用户阻止了机器人

**解决方案：**
- 要求用户在Telegram中解除阻止机器人
- 用户应该搜索机器人并发送`/start`

### 问题："Webhook already set"

**解决方案：**
```bash
# 删除现有webhook
curl -X POST "https://api.telegram.org/bot<YOUR_TOKEN>/deleteWebhook"

# 或更新webhook
curl -X POST "https://api.telegram.org/bot<YOUR_TOKEN>/setWebhook?url=<YOUR_WEBHOOK_URL>"
```

## 成功标准

✅ 您的Telegram机器人工作正常如果：
- 机器人响应`/start`命令
- 机器人响应自定义命令（例如，`!ping`）
- 网关日志显示"Telegram channel connected"
- 日志中没有"Unauthorized"错误
- 通过OpenClaw发送的消息到达Telegram

## 下一步

- [完整OpenClaw设置](/posts/start/)
- [添加Discord频道](/posts/channels-discord/)
- [配置网关](/posts/config-gateway/)
- [高级机器人命令](/posts/cli-commands/)

## 附加资源

- [Telegram Bot API](https://core.telegram.org/bots/api)
- [BotFather命令](https://core.telegram.org/bots#botfather)
- [OpenClaw GitHub仓库](https://github.com/openclaw/openclaw)

## BotFather快速参考

| 命令 | 描述 |
|---------|-------------|
| `/newbot` | 创建新机器人 |
| `/mybots` | 列出您的机器人 |
| `/setname` | 更改机器人名称 |
| `/setdescription` | 设置机器人描述 |
| `/setabouttext` | 设置关于文本 |
| `/setuserpic` | 设置个人资料图片 |
| `/setcommands` | 设置命令列表 |
| `/deletebot` | 删除机器人 |
| `/token` | 重新生成API令牌 |
| `/setprivacy` | 设置隐私模式 |
| `/setinline` | 启用内联模式 |
| `/setinlinefeedback` | 启用内联反馈 |
