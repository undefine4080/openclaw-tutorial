---
title: "飞书集成"
description: "将 OpenClaw 接入飞书，让你的 AI 助手在飞书群聊中工作"
pubDate: 2026-03-18
category: 01-getting-started
order: 2
difficulty: beginner
estimatedTime: "20 分钟"
tags: ['feishu', 'integration', 'beginner']
prerequisites: ['已安装 OpenClaw', '已有飞书账号']
featured: false
relatedPosts:
  - model-integration
nextPost: channel-wechat
prevPost: model-integration
status: published
alternates:
  zhCN: /zh-cn/tutorials/01-getting-started/channel-feishu/
---

## TL;DR

把 OpenClaw 接入飞书，你的 AI 助手就能在飞书群里聊天了。新手用内置插件就行，简单稳定；如果你想要日程和任务管理这种高级功能，再考虑官方插件。

## 前置要求

开始之前，确保你：

- [ ] 安装了 Node.js（18+ 版本）
- [ ] 安装了 OpenClaw CLI：`npm install -g @openclaw/cli`
- [ ] 有飞书账号（个人版或企业版都行）
- [ ] 会用命令行（不需要专家水平，基础操作就行）

## 核心步骤

### 步骤 1：选插件（别纠结太久）

OpenClaw 有两种飞书插件，选错了也能换，所以别想太多。

**内置插件（@openclaw/feishu）** - 我推荐这个

- OpenClaw ≥ 2026.2 自带，不用安装
- 配置简单，新手友好
- 稳定，跟着 OpenClaw 核心走
- 支持多成员一起用
- 缺点：没有日程和任务管理

**官方插件（@larksuiteoapi/feishu-openclaw-plugin）** - 高级玩家用

- 功能全：消息、文档、表格、日历、任务都有
- 飞书官方维护，更新快
- 可以用你的身份操作，不是机器人身份
- 缺点：得单独装，配置麻烦
- **致命缺点**：只有应用 owner 能用，多成员场景直接废掉

**我的建议：**

- 新手 → 内置插件
- 只想聊聊天、看看文档 → 内置插件
- 需要日程和任务管理 → 官方插件
- 团队用 → 内置插件（官方插件的权限限制是个大坑）

### 步骤 2：装插件

#### 方案 A：内置插件（推荐）

内置插件不用装，OpenClaw 2026.2+ 自带。

```bash
# 初始化 OpenClaw（如果还没弄过）
openclaw init

# 添加飞书频道
openclaw channels add feishu
```

按提示输入：
- 飞书应用的 App ID（下一步创建）
- 飞书应用的 App Secret（下一步创建）
- 连接模式选 `websocket`（推荐）

#### 方案 B：官方插件（高级用户）

```bash
# 安装官方插件
openclaw plugins install @larksuiteoapi/feishu-openclaw-plugin

# 如果遇到版本检查 bug，跳过检查就行
openclaw plugins install @larksuiteoapi/feishu-openclaw-plugin --skip-version-check
```

**预期输出：**

```
✓ Plugin @larksuiteoapi/feishu-openclaw-plugin installed successfully
```

**注意：**

- 两个插件互斥，装了官方插件会自动禁用内置插件
- 想换回内置插件，卸载官方插件：`openclaw plugins remove @larksuiteoapi/feishu-openclaw-plugin`

### 步骤 3：在飞书开放平台建应用

这一步看着多，但跟着走就行，不复杂。

#### 3.1 创建应用

1. 去 [飞书开放平台](https://open.feishu.cn) 或 [Lark 开放平台](https://open.larksuite.com)
2. 点"创建企业自建应用"
3. 填信息：
   - **应用名称**：`OpenClaw 助手`（个人用）或 `[团队名] AI 助手`（团队用）
   - **应用描述**：随便写，比如"我的 AI 小助手"
4. 创建后，复制：
   - **App ID**：长这样 `cli_xxxxxxxxxxxxxxxx`
   - **App Secret**：点"查看"后复制（别泄露）

#### 3.2 配置权限

飞书的权限配置很繁琐，但没办法，得忍着。

1. 去"权限管理" → "权限配置"
2. 点"批量导入权限"，粘贴 JSON

**内置插件权限（推荐）：**

```json
{
  "scopes": {
    "tenant": [
      "im:message",
      "im:message:send_as_bot",
      "im:message.group_at_msg:readonly",
      "im:message.group_msg",
      "im:message.p2p_msg:readonly",
      "im:message:readonly",
      "im:chat",
      "im:chat.members:bot_access",
      "docs:document.content:read"
    ]
  }
}
```

**官方插件权限（完整功能）：**

```json
{
  "scopes": {
    "tenant": [
      "aily:file:read",
      "aily:file:write",
      "application:application.app_message_stats.overview:readonly",
      "application:application.self_manage",
      "application:bot.menu:write",
      "cardkit:card:write",
      "contact:user.employee_id:readonly",
      "corehr:file:download",
      "docs:document.content:read",
      "event:ip_list",
      "im:chat",
      "im:chat.access_event.bot_p2p_chat:read",
      "im:chat.members:bot_access",
      "im:message",
      "im:message.group_at_msg:readonly",
      "im:message.group_msg",
      "im:message.p2p_msg:readonly",
      "im:message:readonly",
      "im:message:send_as_bot",
      "im:resource",
      "sheets:spreadsheet",
      "wiki:wiki:readonly"
    ],
    "user": [
      "aily:file:read",
      "aily:file:write",
      "im:chat.access_event.bot_p2p_chat:read"
    ]
  }
}
```

3. 点"批量导入"，确认

#### 3.3 启用机器人

1. 去"机器人" → "事件订阅"
2. 开启"启用机器人"

#### 3.4 配置事件订阅

1. 在"事件订阅"页面，点"添加事件"
2. 添加：
   - `im.message.receive_v1`（收消息用）
3. 点"保存"
4. 去"权限与功能"，点"发布应用"

**注意：**

- App Secret 绝对不能泄露，别传到 GitHub
- 用环境变量存密钥更安全（后面会说）
- 事件订阅必须配置，不然收不到消息

### 步骤 4：配置 OpenClaw 并启动网关

#### 4.1 配置 OpenClaw

如果你在步骤 2 用了 `openclaw channels add feishu` 向导，跳过这步。

否则手动配：

```bash
# 设置 App ID
openclaw config set channels.feishu.accounts.default.appId "cli_xxxxxxxxxxxxxxxx"

# 设置 App Secret（建议用环境变量）
openclaw config set channels.feishu.accounts.default.appSecret "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# 连接模式用长连接（推荐）
openclaw config set channels.feishu.connectionMode "websocket"

# 私聊用配对策略（默认）
openclaw config set channels.feishu.dmPolicy "pairing"

# 开启流式输出（省配额）
openclaw config set channels.feishu.streaming true
openclaw config set channels.feishu.blockStreaming true
openclaw config set channels.feishu.textChunkLimit 2000
```

#### 4.2 安全配置（强烈推荐）

用环境变量存密钥：

```bash
# 在 ~/.bashrc 或 ~/.zshrc 里加
export OPENCLAW_CHANNELS_FEISHU_ACCOUNTS_DEFAULT_APPID="cli_xxxxxxxxxxxxxxxx"
export OPENCLAW_CHANNELS_FEISHU_ACCOUNTS_DEFAULT_APPSECRET="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# 重新加载配置
source ~/.bashrc
```

然后在配置文件里用占位符：

```bash
openclaw config set channels.feishu.accounts.default.appId "${OPENCLAW_CHANNELS_FEISHU_ACCOUNTS_DEFAULT_APPID}"
openclaw config set channels.feishu.accounts.default.appSecret "${OPENCLAW_CHANNELS_FEISHU_ACCOUNTS_DEFAULT_APPSECRET}"
```

#### 4.3 启动网关

```bash
# 启动网关（后台跑）
openclaw gateway start

# 看状态
openclaw gateway status

# 看实时日志
openclaw logs --follow
```

**预期输出：**

```
✓ Gateway started successfully
  Status: Running
  Channels: feishu (enabled)
```

**注意：**

- 第一次启动可能要 10-30 秒连飞书服务器
- 如果看到错误日志，检查 App ID 和 Secret 对不对
- 网关启动后会自动和飞书服务器建长连接

### 步骤 5：测试能不能用

#### 5.1 私聊测试

1. 在飞书里搜你的机器人（用应用名称搜）
2. 给它发消息："你好"
3. 它会返回一个配对码（6 位数字）

```bash
# 命令行看待批准的配对
openclaw pairing list
```

4. 批准配对：

```bash
openclaw pairing approve feishu <配对码>
```

5. 再发消息，它就回你了

**预期输出（飞书里）：**

```
你: 你好
机器人: 你好！我是你的 AI 助手，有什么可以帮你的吗？
```

#### 5.2 群聊测试

1. 建或加一个飞书群
2. 邀机器人进群
3. @机器人发消息："@机器人 帮我总结一下今天的工作"
4. 它会回你

**注意：**

- 默认要 @ 机器人才回
- 如果不想 @，可以配：
  ```bash
  openclaw config set channels.feishu.groups.<群聊ID>.requireMention false
  ```
- 群聊 ID 在飞书里找，格式 `oc_xxxxxxxxxxxxxxxx`

### 步骤 6：高级配置（需要再用再说）

#### 6.1 访问控制

**个人用：**

```bash
# 用配对策略（默认）
openclaw config set channels.feishu.dmPolicy "pairing"
```

**小团队用：**

```bash
# 用白名单策略
openclaw config set channels.feishu.dmPolicy "allowlist"

# 加团队成员的 open_id
openclaw config set channels.feishu.allowFrom '["ou_xxxxxxxxxxxxxxxx", "ou_yyyyyyyyyyyyyyyy"]'
```

**注意：**
- open_id 在飞书里找，或者让机器人帮你查
- 生产环境别用 `dmPolicy: "open"`
- 定期审计访问日志

#### 6.2 API 配额优化

Lark 免费版有调用上限，优化配置能省配额：

```bash
# 开启流式输出
openclaw config set channels.feishu.streaming true
openclaw config set channels.feishu.blockStreaming true

# 增大分块（长文本用）
openclaw config set channels.feishu.textChunkLimit 5000
```

**算一下：**

- Lark 免费版配额：1000 次/天
- 平均对话：10 条消息
- 不优化：20 字符 × 10 消息 = 200 次调用
- 优化后（textChunkLimit: 2000）：10 消息 = 10 次调用
- 效率提升：20 倍

**注意：**
- 登录飞书开放平台看 API 使用量
- 定期查日志，监控调用次数
- 企业用的话建议升级付费版

#### 6.3 多账户配置（可选）

支持配置多个飞书账户：

```json
{
  "channels": {
    "feishu": {
      "accounts": {
        "work": {
          "appId": "cli_xxx1",
          "appSecret": "secret1"
        },
        "personal": {
          "appId": "cli_xxx2",
          "appSecret": "secret2"
        }
      },
      "defaultAccount": "work"
    }
  }
}
```

**注意：**
- 多账户配置会增加复杂度，新手别搞
- 适用于工作/个人账户分离的场景

## 验证结果

怎么验证配置成功：

```bash
# 1. 看网关状态
openclaw gateway status

# 预期输出：
# Status: Running
# Channels: feishu (enabled)

# 2. 看日志
openclaw logs --follow

# 预期输出（没错误）：
# [INFO] Connected to Feishu WebSocket

# 3. 在飞书里发测试消息
# 你: 你好
# 机器人: 你好！...
```

**成功标志：**

- 网关状态是 `Running`
- 日志里没错误
- 飞书里发消息机器人能回
- 流式输出正常（逐字显示）
- 群聊 @ 机器人能触发回复

## 常见问题

### 问题 1：网关启动不了

**现象：** 运行 `openclaw gateway start` 后立马退出或报错。

**原因：**
- 配置文件语法错了
- App ID 或 Secret 不对
- 网络连不上

**解决：**

```bash
# 1. 检查配置文件语法
openclaw config get

# 2. 验证飞书凭证
openclaw config get channels.feishu.accounts.default

# 3. 看详细日志
openclaw logs --follow

# 4. 试着重启
openclaw gateway restart
```

### 问题 2：收不到消息，机器人不回

**现象：** 飞书里发消息了，机器人不回。

**原因：**
- 飞书应用的事件订阅没配
- 权限配置不完整
- 配对没成功批准
- dmPolicy 设成了 `allowlist` 但用户不在白名单里

**解决：**

```bash
# 1. 登录飞书开放平台，检查事件订阅配没配
# 添加事件：im.message.receive_v1

# 2. 验证权限配置
# 确认所有必要权限都启用了（见步骤 3.2）

# 3. 检查配对状态
openclaw pairing list

# 4. 批准配对
openclaw pairing approve feishu <配对码>

# 5. 检查 dmPolicy 配置
openclaw config get channels.feishu.dmPolicy
```

### 问题 3：群聊不回

**现象：** 群聊里 @ 机器人，它不回。

**原因：**
- 机器人不在群里
- 群聊 ID 配错了
- requireMention 设了 true 但你没 @
- groupPolicy 设成了 `disabled`

**解决：**

```bash
# 1. 确认机器人在不在这个群里
# 在飞书里查群成员列表

# 2. 验证群聊 ID 配置
# 在飞书里获取群聊 ID，格式：oc_xxxxxxxxxxxxxxxx

# 3. 检查要不要 @
openclaw config get channels.feishu.groups

# 4. 如果不需要 @，设置：
openclaw config set channels.feishu.groups.<群聊ID>.requireMention false

# 5. 检查 groupPolicy
openclaw config get channels.feishu.groupPolicy
```

### 问题 4：官方插件安装失败（版本检查 bug）

**现象：** 运行 `openclaw plugins install @larksuiteoapi/feishu-openclaw-plugin` 报错："OpenClaw version too low"。

**原因：** `feishu-plugin-onboard` 工具有版本检查 bug，会误报版本过低。

**解决：**

```bash
# 跳过版本检查，直接安装
openclaw plugins install @larksuiteoapi/feishu-openclaw-plugin --skip-version-check

# 手动配置凭证
openclaw config set channels.feishu.accounts.main.appId "你的AppID"
openclaw config set channels.feishu.accounts.main.appSecret "你的AppSecret"

# 重启网关
openclaw gateway restart
```

### 问题 5：API 配额用光了

**现象：** 频繁用后机器人不回，日志里显示 API 配额错误。

**原因：** Lark 免费版有 API 调用上限，频繁操作很快用光。

**解决：**

```bash
# 1. 优化配置减少调用
openclaw config set channels.feishu.streaming true
openclaw config set channels.feishu.blockStreaming true
openclaw config set channels.feishu.textChunkLimit 5000

# 2. 登录飞书开放平台看配额使用情况
# https://open.feishu.cn/app/<你的AppID>/api/statistic

# 3. 升级到付费版（企业用推荐）
# https://www.feishu.cn/hc/zh-CN/articles/698476353774

# 4. 等配额重置（通常是每天 0 点）
```

### 问题 6：每次发消息都返回配对码

**现象：** 飞书里发消息后，机器人总是返回配对码，没法正常对话。

**原因：** 配对没成功批准，或者 dmPolicy 设成了 `pairing`（每个新用户都要手动批准）。

**解决：**

```bash
# 1. 看待批准的配对
openclaw pairing list

# 2. 批准配对
openclaw pairing approve feishu <配对码>

# 3. 如果是白名单模式，加用户到白名单
openclaw config set channels.feishu.allowFrom '["ou_xxxxxxxxxxxxxxxx"]'

# 4. 检查 dmPolicy 配置
openclaw config get channels.feishu.dmPolicy
```

## 下一步

弄完了？可以继续玩：

- [ ] **看中文入门教程**：https://github.com/clawmax/openclaw-easy-tutorial-zh-cn
- [ ] **学自定义 Skill 开发**：扩展 AI 助手的能力
- [ ] **配多 Agent 协作**：在飞书里实现多专业 Agent 协作
- [ ] **接其他渠道**：Telegram、WhatsApp 之类
- [ ] **看社区用例**：https://github.com/awesome-openclaw/awesome-openclaw-usecases-zh

## 参考资源

- [OpenClaw 官方文档 - 飞书集成](https://docs.openclaw.ai/channels/feishu)
- [AlexAnys/openclaw-feishu - 社区完整指南](https://github.com/AlexAnys/openclaw-feishu)
- [飞书开放平台 - 机器人文档](https://open.feishu.cn/document/common-capabilities/message-bot/introduction)
- [飞书官方插件安装指南](https://github.com/AlexAnys/openclaw-feishu/blob/main/docs/feishu-official-plugin.md)
- [OpenClaw 中文入门教程](https://github.com/clawmax/openclaw-easy-tutorial-zh-cn)
- [OpenClaw GitHub Issues](https://github.com/openclaw/openclaw/issues)
