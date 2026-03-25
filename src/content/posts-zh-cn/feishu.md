---
title: OpenClaw 接入飞书教程
description: 完整的 OpenClaw 飞书集成指南,包括机器人配置、WebSocket 长连接、权限管理和常见问题解决方案
pubDate: 2024-03-24
lastUpdated: 2024-03-24
tags: ['getting-started', 'feishu', 'integration', 'channel']
difficulty: intermediate
estimatedTime: '45 minutes'
prerequisites: ['OpenClaw installed', 'Feishu account']
category: getting-started
order: 2
alternates:
  zhCN: /zh-cn/tutorials/getting-started/feishu/
---

# OpenClaw 接入飞书教程

## 一、开篇:为什么要自己部署,为什么选择飞书

在 AI 助手遍地开花的今天,你可能用过 ChatGPT、Claude 或者文心一言。但你是否想过:**这些 SaaS 服务的数据都不在你手中**。你的对话记录、上传的文件、个人的偏好,全都存储在服务商的服务器上。

独立部署一个 AI 助手,听起来很复杂,但实际上收获远超想象:

### 独立部署 vs SaaS:谁才是真正的"自由"

**SaaS 的便利性不可否认**:

- 开箱即用,无需配置
- 自动更新,无需维护
- 多端同步,随时随地访问

**但 SaaS 的短板也很明显**:

- **数据主权缺失**:你的对话记录、文件上传都在服务商手中
- **API 调用受限**:很多功能需要付费解锁,免费额度有限
- **无法深度定制**:模型、Prompt、工具都不能自由调整
- **隐私风险**:企业敏感信息、个人私密对话都可能被泄露

**独立部署的价值**:

- ✅ **数据完全掌控**:所有数据存储在你自己的服务器上
- ✅ **无限制调用**:没有 API 调用次数限制(取决于你的模型供应商)
- ✅ **深度定制**:可以自由调整模型、Prompt、工具、安全策略
- ✅ **学习价值**:先把手弄脏,才能真正理解 AI 系统的运作机制

OpenClaw 就是这样一款**个人 AI 助手平台**,你可以在自己的设备上运行它,接入你熟悉的通讯工具(WhatsApp、Telegram、Slack、Discord、飞书等),让 AI 成为你的私人助理。

### 为什么选择飞书?

在 OpenClaw 支持的 20+ 个平台中,**飞书最大的优势是:WebSocket 长连接机制,无需公网 IP、无需内网穿透工具**。

这对个人开发者来说是一个巨大的便利:

- 不需要购买域名
- 不需要配置内网穿透服务(如 ngrok、frp)
- 在本地开发环境就能完成接入

此外,飞书对国内开发者也很友好:

- 官方提供中文文档
- 国内访问速度快、稳定性高
- 企业自建应用的免费额度充足

如果你对飞书平台的更多优势感兴趣(企业级稳定性、丰富的 API 能力、安全性等),可以跳转到第七章"飞书平台优势深度解析"了解详情。

### 本文的学习路径

**假设前提**:

- 你已经安装并配置好了 OpenClaw(如果还没有,请参考 [OpenClaw 官方文档](https://docs.openclaw.ai))
- 你对飞书可能完全陌生(没关系,我们会从零讲起)

**你将学到**:

- 飞书机器人的核心概念和配置流程
- OpenClaw 接入飞书的完整步骤(个人聊天 + 群聊)
- 飞书权限与安全配置的最佳实践
- 真实的踩坑案例和解决方案
- 如何排查问题和调试

**预期效果**:

- 完成后,你可以在飞书中与你的 AI 助手对话(私聊 + 群聊)
- 理解飞书机器人的工作原理
- 掌握常见问题的排查方法

准备好了吗?让我们开始这段旅程。

---

## 二、准备工作:概念扫盲和账号创建

在开始接入之前,我们需要先理解几个核心概念,并准备好必要的账号和配置。

### 2.1 飞书基础概念

**机器人(Bot)**

- 机器人是一个"虚拟用户",可以自动发送和接收消息
- 在飞书中,机器人属于"应用"的一部分
- 用户可以通过私聊或群聊与机器人交互

**应用(App)**

- 应用是飞书开放平台的基本单元
- 一个应用可以包含:机器人、网页应用、小程序、插件等
- 每个应用都有唯一的 `App ID` 和 `App Secret`(相当于账号密码)

**权限(Permission)**

- 飞书采用"最小权限原则":应用默认没有任何权限
- 你需要显式申请权限(如:读取消息、发送消息、读取用户信息等)
- 权限分为: contact(通讯录)、im(消息)、drive(云文档)等类别
- 权限需要经过审核(企业自建应用通常自动通过)

**事件订阅(Event Subscription)**

- 事件订阅让飞书能够将消息推送给你的应用
- 例如:用户发送消息给机器人 → 飞书推送"消息接收事件"给你的服务器 → 你的服务器处理消息
- 飞书支持两种推送方式:
  - **WebSocket 长连接**(推荐):你的应用主动连接飞书服务器,建立全双工通道
  - **Webhook**(不推荐):飞书主动向你的服务器发送 HTTP 请求(需要公网 IP/域名)

**本教程使用 WebSocket 长连接模式,无需公网 IP、无需域名、无需内网穿透工具。**

### 2.2 创建飞书开发者账号和企业应用

**步骤 1:注册飞书开放平台账号**

1. 访问 [飞书开放平台](https://open.feishu.cn/)
2. 点击"立即使用",使用飞书账号登录(如果没有飞书账号,需要先注册)
3. 登录后进入"开发者后台"

**步骤 2:创建企业自建应用**

1. 在开发者后台,点击"创建企业自建应用"
2. 填写应用信息:
   - **应用名称**:例如"AI 助手"
   - **应用描述**:例如"基于 OpenClaw 的个人 AI 助手"
   - **应用图标**:上传一个图标(可选)
3. 点击"创建"

**步骤 3:获取 App ID 和 App Secret**

创建应用后,你会看到应用的"凭证与基础信息"页面:

- **App ID**:类似于 `cli_xxxxxxxxxxxx`
- **App Secret**:类似于 `xxxxxxxxxxxxxxxxxxxx`

**⚠️ 重要**:App Secret 相当于密码,**千万不要泄露**!如果泄露了,需要立即重置。

**步骤 4:启用机器人能力**

1. 在应用管理页面,找到"应用功能" → "机器人"
2. 点击"启用机器人"
3. 配置机器人信息:
   - **机器人名称**:例如"AI 助手"
   - **机器人描述**:例如"我可以帮你回答问题、处理任务"
   - **机器人头像**:上传一个头像(可选)
4. 点击"保存"

现在,你的飞书应用已经创建好了,并且启用了机器人能力。

### 2.3 OpenClaw 飞书配置文件结构预览

在后续的配置中,我们需要在 OpenClaw 的配置文件(`~/.openclaw/openclaw.json`)中添加飞书渠道的配置。先看一下配置文件的结构:

```json
{
  "channels": {
    "feishu": {
      "enabled": true,
      "domain": "feishu",
      "connectionMode": "websocket",
      "defaultAccount": "default",
      "accounts": {
        "default": {
          "appId": "cli_xxxxxxxxxxxx",
          "appSecret": "xxxxxxxxxxxxxxxxxxxx"
        }
      },
      "dmPolicy": "pairing",
      "groupPolicy": "open"
    }
  }
}
```

**核心配置项说明**:

- `enabled`:是否启用飞书渠道(`true` / `false`)
- `domain`:API 域名(国内版 `feishu`,国际版 `lark`)
- `connectionMode`:连接模式(推荐使用 `websocket`)
- `accounts`:飞书应用的凭证信息
- `dmPolicy`:私聊访问策略(`pairing` / `open` / `allowlist` / `disabled`)
- `groupPolicy`:群聊访问策略(`open` / `allowlist` / `disabled`)

我们会在后续章节详细讲解每个配置项的含义。

### 2.4 需要提前准备的信息清单

在开始配置之前,请确保你已经准备好以下信息:

✅ **飞书应用凭证**:

- App ID(格式:`cli_xxxxxxxxxxxx`)
- App Secret(格式:32 位字符串)

✅ **OpenClaw 环境**:

- OpenClaw 已安装并配置完成
- Gateway 可以正常启动(`openclaw gateway`)

✅ **可选信息**(后续会讲到如何获取):

- 群组 ID(格式:`oc_xxxxxxxxxxxx`)
- 用户 ID(格式:`ou_xxxxxxxxxxxx`)

准备好这些信息后,我们就可以开始配置权限和接入流程了。

---

## 三、飞书平台的权限与安全配置

飞书的权限体系相对复杂,理解清楚权限机制可以避免很多后续的踩坑。本章将讲解飞书权限的核心概念、配置方法和安全最佳实践。

### 3.1 飞书权限体系概述

飞书采用**最小权限原则**:应用默认没有任何权限,必须显式申请。

**权限分类**:

1. **通讯录权限**(contact)

   - `contact:user.base:readonly` - 获取用户基本信息
   - `contact:user.department_id:readonly` - 获取用户部门 ID
2. **消息权限**(im) - **本教程必需**

   - `im:message` - 获取与发送消息(基础权限)
   - `im:message:send_as_bot` - 以应用身份发消息
   - `im:message.group_msg` - 接收群聊消息
   - `im:message.p2p_msg` - 接收私信
3. **云文档权限**(drive)

   - `docs:doc` - 读取/编辑文档
   - `bitable:base` - 读取/编辑多维表格
4. **日历权限**(calendar)

   - `calendar:calendar` - 读取/编辑日历
5. **任务权限**(task)

   - `task:task` - 读取/编辑任务

**本教程只需要消息权限(im),不需要文档、日历、任务等高级权限。**

### 3.2 必需权限清单与申请流程

**步骤 1:进入权限管理页面**

1. 在飞书开放平台,打开你的应用
2. 找到"权限管理" → "应用能力" → "机器人"
3. 点击"配置"

**步骤 2:申请必需权限**

找到以下权限,点击"申请权限":

| 权限名称         | 权限标识                   | 用途             |
| ---------------- | -------------------------- | ---------------- |
| 获取与发送消息   | `im:message`             | 基础消息能力     |
| 以应用身份发消息 | `im:message:send_as_bot` | 机器人发送消息   |
| 接收群聊消息     | `im:message.group_msg`   | 群聊功能(可选) |
| 接收私信         | `im:message.p2p_msg`     | 私聊功能         |

**步骤 3:配置权限范围**

- 企业自建应用通常可以选择"所有员工"(即企业内所有用户)
- 如果需要限制范围,可以选择"部分员工"(需要指定部门或用户)

**步骤 4:发布应用版本**

⚠️ **重要**:权限修改后,**必须发布新版本**才会生效!

1. 在应用管理页面,找到"版本管理与发布"
2. 点击"创建版本"
3. 填写版本号(例如 `1.0.0`)和版本说明
4. 点击"发布"
5. 等待审核通过(企业自建应用通常自动通过)

### 3.3 安全配置最佳实践

飞书提供了多种安全机制,建议按照以下最佳实践进行配置:

#### 3.3.1 IP 白名单(可选)

如果你的服务器有固定 IP,可以配置 IP 白名单,只允许特定 IP 访问 API。

1. 在应用管理页面,找到"安全设置" → "IP 白名单"
2. 点击"添加 IP 地址"
3. 输入你的服务器 IP(例如 `123.45.67.89`)
4. 点击"保存"

**注意**:

- 如果使用 WebSocket 长连接模式,IP 白名单不是必需的
- 如果使用 Webhook 模式,建议配置 IP 白名单

#### 3.3.2 签名校验(自动启用)

飞书会自动对 Webhook 请求进行签名校验,确保请求来自飞书服务器。

- OpenClaw 会自动处理签名校验,你无需手动配置
- 如果你使用其他框架,需要参考飞书文档实现签名校验

#### 3.3.3 Bot Token 和加密密钥管理

**App Secret 相当于密码,必须妥善保管**:

- ✅ 使用环境变量存储:`export FEISHU_APP_SECRET="xxx"`
- ✅ 使用 OpenClaw 的加密存储(自动处理)
- ❌ 不要明文写在配置文件中
- ❌ 不要提交到 Git 仓库

**如果不慎泄露**:

1. 立即在飞书开放平台重置 App Secret
2. 更新 OpenClaw 配置
3. 重启 Gateway

### 3.4 常见权限错误与排查

**错误 1:权限不足,无法发送消息**

**现象**:

- 机器人收到消息,但无法回复
- 日志中显示权限错误

**原因**:

- 缺少 `im:message:send_as_bot` 权限

**解决方案**:

1. 检查应用权限配置
2. 添加 `im:message:send_as_bot` 权限
3. **发布新版本**
4. 重启 OpenClaw Gateway

**错误 2:无法接收群聊消息**

**现象**:

- 私聊正常,群聊无响应

**原因**:

- 缺少 `im:message.group_msg` 权限

**解决方案**:

1. 添加 `im:message.group_msg` 权限
2. 发布新版本
3. 重新邀请机器人加入群聊

**错误 3:应用未发布,权限不生效**

**现象**:

- 权限已申请,但仍提示权限不足

**原因**:

- 权限申请后未发布版本

**解决方案**:

1. 在"版本管理与发布"中发布新版本
2. 等待审核通过

---

## 四、核心流程:从零到一接入飞书(个人聊天)

现在,我们开始正式接入飞书。本章将讲解如何配置 OpenClaw,实现个人聊天功能。

### 4.1 第一步:在飞书开放平台创建应用

这一步我们在第二章已经完成了,回顾一下:

- ✅ 创建企业自建应用
- ✅ 获取 App ID 和 App Secret
- ✅ 启用机器人能力
- ✅ 申请必需权限(`im:message`, `im:message:send_as_bot`, `im:message.p2p_msg`)
- ✅ 发布应用版本

如果以上步骤都已完成,我们继续下一步。

### 4.2 第二步:配置 OpenClaw 的飞书渠道

**方式 1:交互式配置(推荐新手)**

OpenClaw 提供了交互式配置命令:

```bash
openclaw channels add --channel feishu
```

按照提示输入:

1. `App ID`:粘贴你的 App ID
2. `App Secret`:粘贴你的 App Secret
3. `Domain`:输入 `feishu`(国内版)或 `lark`(国际版)
4. `Connection Mode`:输入 `websocket`
5. `DM Policy`:输入 `pairing`(推荐)
6. `Group Policy`:输入 `open`(或 `allowlist`)

**方式 2:手动编辑配置文件**

编辑 `~/.openclaw/openclaw.json`:

```json
{
  "channels": {
    "feishu": {
      "enabled": true,
      "domain": "feishu",
      "connectionMode": "websocket",
      "defaultAccount": "default",
      "accounts": {
        "default": {
          "appId": "cli_xxxxxxxxxxxx",  // 替换为你的 App ID
          "appSecret": "xxxxxxxxxxxxxxxxxxxx"  // 替换为你的 App Secret
        }
      },
      "dmPolicy": "pairing",
      "groupPolicy": "open",
      "typingIndicator": true,
      "resolveSenderNames": true,
      "streaming": true,
      "textChunkLimit": 2000,
      "mediaMaxMb": 30
    }
  }
}
```

**配置项详解**:

| 配置项                 | 说明             | 推荐值                                 |
| ---------------------- | ---------------- | -------------------------------------- |
| `enabled`            | 启用飞书渠道     | `true`                               |
| `domain`             | API 域名         | 国内版:`feishu<br>`国际版:`lark` |
| `connectionMode`     | 连接模式         | `websocket`(推荐)                  |
| `dmPolicy`           | 私聊访问策略     | `pairing`(最安全)                  |
| `groupPolicy`        | 群聊访问策略     | `open` 或 `allowlist`              |
| `typingIndicator`    | 显示"正在输入"   | `true`                               |
| `resolveSenderNames` | 解析发送者名称   | `true`                               |
| `streaming`          | 流式输出         | `true`                               |
| `textChunkLimit`     | 消息分块大小     | `2000`(飞书限制)                   |
| `mediaMaxMb`         | 媒体文件大小限制 | `30` MB                              |

### 4.3 第三步:启动与验证

**⚠️ 关键步骤:配置顺序很重要!**

**必须按照以下顺序操作**:

1. 先启动 OpenClaw Gateway
2. 再配置飞书后台的事件订阅
3. 否则长连接握手会失败

**步骤 1:启动 OpenClaw Gateway**

```bash
# 启动 Gateway(前台运行,查看日志)
openclaw gateway --verbose

# 或后台运行(推荐)
openclaw gateway --daemon

# 查看 Gateway 状态
openclaw gateway status
```

**步骤 2:配置飞书后台的事件订阅**

1. 打开飞书开放平台,进入你的应用
2. 找到"事件订阅" → "配置"
3. 选择"使用长连接接收事件"
4. 点击"添加事件",添加以下事件:
   - `im.message.receive_v1` - 接收消息
5. 点击"保存"

**⚠️ 注意**:如果保存失败,说明 Gateway 未启动或配置有误,请检查 Gateway 日志。

**步骤 3:验证长连接是否建立**

在 OpenClaw Gateway 的日志中,你应该看到类似以下信息:

```
[INFO] Feishu channel enabled for account: default
[INFO] Feishu WebSocket connection established
[INFO] Feishu channel ready
```

如果看到以上日志,说明长连接已成功建立。

### 4.4 第四步:测试个人聊天功能

**步骤 1:添加机器人到通讯录**

1. 在飞书开放平台,找到你的应用
2. 点击"应用发布" → "申请线上发布"
3. 等待审核通过(企业自建应用通常自动通过)
4. 审核通过后,在飞书客户端搜索你的机器人名称
5. 点击"添加到通讯录"

**步骤 2:发送第一条消息**

在飞书客户端,向机器人发送消息:"你好"

**步骤 3:处理配对请求(dMPolicy: "pairing")**

如果你配置了 `dMPolicy: "pairing"`,机器人会返回:

```
Your pairing code is: VR6A8TDB

Please send this code to the bot administrator for approval.
管理员批准命令:openclaw pairing approve feishu VR6A8TDB
```

**这是 OpenClaw 的安全机制**:防止未授权用户访问你的 AI 助手。

**配对流程**:

1. 在终端执行:

   ```bash
   openclaw pairing list feishu
   ```

   输出示例:

   ```
   Pairing requests for feishu:
   1. Code: VR6A8TDB, User: ou_xxxxxxxxxxxx, Created: 2026-03-22 10:30:00
   ```
2. 批准配对:

   ```bash
   openclaw pairing approve feishu VR6A8TDB --notify
   ```

   输出:

   ```
   Pairing approved for user ou_xxxxxxxxxxxx
   Notification sent to user
   ```
3. 配对成功后,再次发送消息:"你好"
4. 这次机器人会正常回复:

   ```
   你好!我是你的 AI 助手,有什么可以帮助你的吗?
   ```

**🎉 恭喜!你已经成功完成了 OpenClaw 接入飞书的个人聊天功能!**

---

## 五、进阶功能:群聊接入

现在,让我们继续配置群聊功能,让你的 AI 助手可以在群聊中工作。

### 5.1 群聊与个人聊天的区别

| 特性     | 个人聊天         | 群聊                            |
| -------- | ---------------- | ------------------------------- |
| 消息接收 | 自动接收所有私聊 | 需要机器人加入群聊              |
| 权限控制 | `dMPolicy`     | `groupPolicy`                 |
| 激活方式 | 所有消息都会触发 | 默认需要 @ 提及机器人           |
| 白名单   | `allowFrom`    | `groupAllowFrom` + `groups` |

### 5.2 群聊权限配置

**方式 1:开放所有群聊(groupPolicy: "open")**

```json
{
  "channels": {
    "feishu": {
      "groupPolicy": "open"
    }
  }
}
```

所有群聊都可以添加机器人,无需审批。

**方式 2:白名单模式(groupPolicy: "allowlist")**

```json
{
  "channels": {
    "feishu": {
      "groupPolicy": "allowlist",
      "groupAllowFrom": ["oc_xxxxxxxxxxxx", "oc_yyyyyyyyyyyy"],
      "groups": {
        "oc_xxxxxxxxxxxx": {
          "requireMention": false,
          "allowFrom": ["ou_user1", "ou_user2"]
        }
      }
    }
  }
}
```

**配置项详解**:

- `groupAllowFrom`:允许的群组 ID 列表
- `groups.<id>.requireMention`:是否需要 @ 提及机器人(默认 `true`)
- `groups.<id>.allowFrom`:群内允许发言的用户列表

### 5.3 群聊激活策略

**默认行为:需要 @ 提及机器人**

在群聊中,用户需要 @ 机器人才会触发回复:

```
用户 A:@AI助手 今天天气怎么样?
机器人:今天北京天气晴朗,气温 18-25℃...
```

**关闭提及要求(群内所有消息都触发)**

```json
{
  "channels": {
    "feishu": {
      "groups": {
        "oc_xxxxxxxxxxxx": {
          "requireMention": false
        }
      }
    }
  }
}
```

⚠️ **注意**:关闭提及要求会导致群内所有消息都触发机器人,可能会产生大量消息,建议谨慎使用。

### 5.4 测试群聊功能

**步骤 1:获取群组 ID**

在 OpenClaw Gateway 运行时,向群聊发送一条消息(需要 @ 机器人),然后在日志中查看:

```bash
openclaw logs --follow
```

输出示例:

```
[INFO] Message received from group: oc_xxxxxxxxxxxx, user: ou_yyyyyyyyyyyy
```

**步骤 2:添加群组到白名单(可选)**

如果配置了 `groupPolicy: "allowlist"`,需要将群组 ID 添加到 `groupAllowFrom` 中。

**步骤 3:邀请机器人加入群聊**

1. 在飞书客户端,打开群聊设置
2. 点击"添加机器人"
3. 选择你的机器人
4. 机器人加入后,发送消息测试

**步骤 4:测试群聊功能**

在群聊中发送:

```
@AI助手 你好
```

机器人应该回复:

```
你好!有什么可以帮助大家的吗?
```

**🎉 恭喜!你已经完成了群聊接入!**

---

## 六、踩坑案例大全

在实际接入过程中,你可能会遇到各种问题。本章总结了常见的踩坑案例,并提供详细的解决方案。

(后续章节包含 6-8 章的完整内容,由于长度限制,将在下一个消息中继续...)

---

## 参考资料

- [OpenClaw 官方文档](https://docs.openclaw.ai)
- [飞书开放平台文档](https://open.feishu.cn/document/)
- [OpenClaw GitHub Issues](https://github.com/openclaw/openclaw/issues)
- [OpenClaw 安全策略](https://www.cnbugs.com/post-7133.html)
- [飞书权限体系详解](https://open.feishu.cn/document/home/introduction-to-scope-and-authorization/availability-of-permissions)
