---
title: "OpenClaw配置向导完全指南"
description: "掌握OpenClaw配置向导来设置您的网关、频道和技能。了解每个配置选项和最佳实践。"
pubDate: 2026-03-09
lastUpdated: 2026-03-09
tags: ["onboard", "向导", "配置", "初学者"]
difficulty: "beginner"
estimatedTime: "12 minutes"
prerequisites: ["已安装OpenClaw", "Node.js >= 22"]
alternates:
  en: "/posts/start-onboard-wizard/"
---

## 概述

`openclaw onboard`向导在几分钟内引导您完成初始OpenClaw配置。本指南涵盖每个提示、配置选项和最佳实践。

## 什么是配置向导？

配置向导是一个交互式CLI工具，它可以：
- ✅ **创建配置：** 生成`openclaw.json`
- ✅ **设置频道：** 配置Telegram、Discord等
- ✅ **安装技能：** 添加默认技能
- ✅ **配置网关：** 设置端口和选项
- ✅ **测试连接：** 验证一切正常工作

## 快速开始

**运行向导：**

```bash
openclaw onboard
```

**安装守护进程：**

```bash
openclaw onboard --install-daemon
```

这还将守护进程安装为系统服务。

## 向导步骤

### 步骤1：欢迎屏幕

```
╔═══════════════════════════════════════════════════════╗
║   欢迎使用OpenClaw！让我们开始设置。                   ║
║                                                       ║
║   本向导将引导您完成：                                 ║
║   • 网关配置                                          ║
║   • 频道设置（Telegram、Discord等）                    ║
║   • 技能安装                                          ║
║   • 初始测试                                          ║
╚═══════════════════════════════════════════════════════╝

按Enter继续...
```

### 步骤2：网关配置

```
? 网关端口（默认：18789）：
```

**推荐：** 按Enter使用默认`18789`

**自定义端口：**
- 如果`18789`被占用，使用不同端口
- 选择端口 > 1024（不需要root）
- 记住您的端口以备将来使用

**常用端口：**
- `18789` - 默认
- `18790` - 备选
- `3000` - 常用开发端口

### 步骤3：频道选择

```
? 您想配置哪些频道？（空格选择，回车确认）
❯ ◯ Telegram
  ◯ Discord
  ◯ Slack
  ◯ WhatsApp
```

**如何选择：**
- **空格** - 切换选择
- **回车** - 确认选择
- **方向键** - 导航

**推荐：** 从一个频道开始（例如，Telegram）

### 步骤4：Telegram配置（如果选择）

```
? 输入您的Telegram机器人令牌：
```

**如何获取令牌：**
1. 打开Telegram
2. 给`@BotFather`发消息
3. 发送`/newbot`
4. 从响应中复制令牌

**示例令牌：** `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`

```
? 启用webhook以获得更好的性能？(Y/n)：
```

**推荐：** 生产环境按`Y`，测试环境按`n`

### 步骤5：Discord配置（如果选择）

```
? 输入您的Discord机器人令牌：
```

**如何获取令牌：**
1. 进入[Discord开发者门户](https://discord.com/developers/applications)
2. 创建应用程序 → 机器人 → 添加机器人
3. 在"TOKEN"部分复制令牌

```
? 输入您的Discord客户端ID：
```

**如何找到客户端ID：**
1. 在Discord开发者门户中
2. 进入"常规信息"
3. 复制"APPLICATION ID"

```
? 启用特权Intent？(Y/n)：
```

**推荐：** 按`Y`（消息内容需要）

### 步骤6：技能选择

```
? 您想安装哪些技能？（空格选择）
❯ ◯ ping（基本ping/pong命令）
  ◯ echo（重复消息）
  ◯ weather（天气信息）
  ◯ reminder（设置提醒）
```

**推荐：** 安装`ping`用于测试

### 步骤7：确认

```
配置摘要：

网关：
  端口：18789
  守护进程：禁用

频道：
  • Telegram（已启用）
  • Discord（已启用）

技能：
  • ping（已安装）

? 保存此配置？(Y/n)：
```

**按`Y`**将配置保存到`~/.openclaw/openclaw.json`

### 步骤8：测试

```
✓ 配置已保存到 ~/.openclaw/openclaw.json
✓ 网关启动成功
✓ 频道已连接
✓ 技能已加载

🎉 设置完成！尝试向您的机器人发送!ping。
```

## 配置文件

向导创建`~/.openclaw/openclaw.json`：

```json
{
  "gateway": {
    "port": 18789,
    "host": "localhost"
  },
  "channels": [
    {
      "type": "telegram",
      "token": "YOUR_TELEGRAM_TOKEN",
      "webhook": false
    },
    {
      "type": "discord",
      "token": "YOUR_DISCORD_TOKEN",
      "clientId": "YOUR_CLIENT_ID",
      "intents": ["GUILDS", "GUILD_MESSAGES", "MESSAGE_CONTENT"]
    }
  ],
  "skills": [
    "ping",
    "echo",
    "weather"
  ]
}
```

## 高级选项

### 静默模式

使用默认值跳过所有提示：

```bash
openclaw onboard --defaults
```

### 配置文件输入

使用现有配置：

```bash
openclaw onboard --config /path/to/config.json
```

### 跳过频道设置

仅配置网关：

```bash
openclaw onboard --gateway-only
```

### 守护进程安装

安装为系统服务：

```bash
openclaw onboard --install-daemon
```

**支持的系统：**
- Linux (systemd)
- macOS (launchd)
- Windows (nssm - 需要手动设置)

## 常见问题

### 问题："端口已被占用"

**解决方案：**
```bash
# 查找进程
lsof -i :18789

# 终止进程
kill -9 [PID]

# 或在向导中使用不同端口
```

### 问题："无效令牌"

**解决方案：**
- 验证令牌是否正确
- 检查是否有额外空格
- 如需要重新生成令牌

### 问题："守护进程安装失败"

**原因：** 缺少服务管理器

**解决方案：**
```bash
# 跳过守护进程
openclaw onboard

# 手动运行网关
openclaw gateway
```

### 问题："配置未保存"

**原因：** 权限问题

**解决方案：**
```bash
# 创建目录
mkdir -p ~/.openclaw

# 修复权限
chmod 755 ~/.openclaw
```

## 最佳实践

1. **从简单开始：** 首先配置一个频道
2. **使用默认值：** 默认设置适用于大多数用户
3. **彻底测试：** 设置后发送`!ping`
4. **保存备份：** 将`openclaw.json`复制到安全位置
5. **阅读提示：** 不要匆忙通过向导

## 手动配置

更喜欢手动设置？创建`~/.openclaw/openclaw.json`：

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

然后启动网关：

```bash
openclaw gateway
```

## 重新运行向导

**更新配置：**

```bash
openclaw onboard
```

向导将：
- 加载现有配置
- 提示进行更改
- 与现有设置合并
- 更新配置文件

**重新开始：**

```bash
rm ~/.openclaw/openclaw.json
openclaw onboard
```

## 下一步

- [启动您的网关](/posts/start/)
- [配置频道](/posts/channels-telegram/)
- [安装更多技能](/posts/)
- [配置参考](/posts/config-reference/)

## 附加资源

- [配置指南](/posts/config-reference/)
- [网关设置](/posts/config-gateway/)
- [CLI命令](/posts/cli-commands/)
- [OpenClaw GitHub](https://github.com/openclaw/openclaw)
