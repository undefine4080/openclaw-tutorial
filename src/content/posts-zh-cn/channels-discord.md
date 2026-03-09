---
title: "OpenClaw Discord机器人完整设置指南"
description: "在10分钟内为OpenClaw设置Discord机器人。在Discord开发者门户创建机器人，获取令牌，邀请到服务器，并配置OpenClaw。"
pubDate: 2026-03-09
lastUpdated: 2026-03-09
tags: ["discord", "频道", "设置", "中级"]
difficulty: "intermediate"
estimatedTime: "10 minutes"
prerequisites: ["已安装OpenClaw", "Discord账号", "Discord服务器"]
alternates:
  en: "/posts/channels-discord/"
---

## 概述

在Discord开发者门户创建Discord应用程序，创建机器人，复制令牌，使用OAuth2 URL邀请机器人到您的服务器，并将令牌添加到OpenClaw配置中。

## 为什么选择Discord？

Discord非常适合OpenClaw，因为：
- ✅ **服务器集成：** 非常适合社区服务器
- ✅ **丰富功能：** 嵌入、按钮、模态框、斜杠命令
- ✅ **语音：** 语音频道支持
- ✅ **免费：** 机器人完全免费
- ✅ **活跃社区：** 庞大的Discord用户群

## 步骤1：创建Discord应用程序

### 1.1 访问Discord开发者门户
访问 [discord.com/developers/applications](https://discord.com/developers/applications)

### 1.2 创建新应用程序
1. 点击"New Application"
2. 输入名称："OpenClaw Bot"
3. 同意条款并点击"Create"

## 步骤2：创建机器人用户

### 2.1 进入机器人部分
在左侧边栏中，点击"Bot"

### 2.2 添加机器人
1. 点击"Add Bot"
2. 通过点击"Yes, do it!"确认

### 2.3 复制机器人令牌
1. 如需要点击"Reset Token"
2. 在令牌下点击"Copy"
3. **保存此令牌** - OpenClaw需要用到

### ⚠️ 保密您的令牌！
任何拥有您令牌的人都可以控制您的机器人。永远不要公开分享或将其提交到git。

### 2.4 配置机器人设置
在"Privileged Gateway Intents"下，启用：
- ☑ **Server Members Intent** - 用于成员相关事件
- ☑ **Message Content Intent** - 用于读取消息内容

点击"Save Changes"

## 步骤3：邀请机器人到服务器

### 3.1 进入OAuth2部分
在左侧边栏中，点击"OAuth2" > "URL Generator"

### 3.2 选择范围
检查这些范围：
- ☑ **bot** - 机器人权限
- ☑ **applications.commands** - 斜杠命令（可选）

### 3.3 选择机器人权限
检查这些权限：
- ☑ **Send Messages** - 发送消息
- ☑ **Embed Links** - 嵌入链接
- ☑ **Attach Files** - 附加文件
- ☑ **Read Message History** - 读取消息历史
- ☑ **Add Reactions** - 添加反应
- ☑ **Use Slash Commands** - 使用斜杠命令

### 3.4 复制并使用邀请链接
1. 复制底部的生成URL
2. 粘贴到浏览器中
3. 从下拉菜单选择您的服务器
4. 点击"Authorize"
5. 如需要完成CAPTCHA

## 步骤4：配置OpenClaw

### 4.1 选项A：使用配置向导
```bash
openclaw onboard
```

当提示时：
```
? 您想配置哪些频道？Discord
? 输入您的Discord机器人令牌：YOUR_BOT_TOKEN
? 输入您的Discord客户端ID：YOUR_CLIENT_ID
```

### 4.2 选项B：编辑配置文件
```bash
nano ~/.openclaw/openclaw.json
```

添加Discord频道：
```json
{
  "channels": [
    {
      "type": "discord",
      "token": "YOUR_BOT_TOKEN",
      "clientId": "YOUR_CLIENT_ID",
      "intents": ["GUILDS", "GUILD_MESSAGES", "MESSAGE_CONTENT"]
    }
  ]
}
```

### 💡 查找客户端ID
在Discord开发者门户中，进入"General Information"并复制"APPLICATION ID"。

## 步骤5：启动OpenClaw网关
```bash
openclaw gateway --verbose
```

**预期输出：**
```bash
[INFO] Starting OpenClaw Gateway...
[INFO] Loading channels...
[INFO] Discord channel connected
[INFO] Gateway listening on port 18789
```

## 步骤6：测试您的机器人

### 6.1 邀请到服务器
确保机器人在您的Discord服务器中（来自步骤3）

### 6.2 发送消息
在机器人有访问权限的任何频道中：
```
!ping
```

或使用斜杠命令：
```
/ping
```

机器人应该回复：
```
pong
```

## 高级配置

### 自定义命令前缀
```json
{
  "channels": [
    {
      "type": "discord",
      "token": "YOUR_TOKEN",
      "prefix": "oc!"
    }
  ]
}
```

### 启用斜杠命令
```json
{
  "channels": [
    {
      "type": "discord",
      "token": "YOUR_TOKEN",
      "slashCommands": true
    }
  ]
}
```

## 常见问题

### 问题："机器人没有响应"
**解决方案：**
```bash
# 检查网关是否运行
openclaw gateway status

# 验证令牌是否正确
# 检查Discord开发者门户

# 检查机器人在服务器中的权限
```

### 问题："无效令牌"
**解决方案：**
```bash
# 在Discord开发者门户重置令牌
# 复制新令牌
# 更新OpenClaw配置
# 重启网关
```

### 问题："缺少访问权限"
**原因：** 机器人缺少权限

**解决方案：**
1. 进入Discord服务器设置
2. 进入角色
3. 找到机器人的角色
4. 启用所需权限：
   - Send Messages（发送消息）
   - Read Messages（读取消息）
   - Read Message History（读取消息历史）
   - Add Reactions（添加反应）

### 问题："需要特权Intent"
**解决方案：**
1. 进入Discord开发者门户
2. 选择您的应用程序
3. 进入Bot部分
4. 启用"Message Content Intent"
5. 启用"Server Members Intent"
6. 保存更改

## 成功标准

您的Discord机器人工作正常如果：
- ✅ 机器人出现在服务器成员列表中
- ✅ 机器人响应命令（!ping或/ping）
- ✅ 机器人显示为"Online"状态
- ✅ 网关日志显示Discord连接
- ✅ 无"Missing Access"错误

## 下一步

- [完整OpenClaw设置](/posts/start/)
- [添加Telegram频道](/posts/channels-telegram/)
- [安装更多技能](/posts/)
- [配置网关](/posts/config-gateway/)

## 附加资源

- [Discord API文档](https://discord.com/developers/docs/intro)
- [OpenClaw GitHub仓库](https://github.com/openclaw/openclaw)
