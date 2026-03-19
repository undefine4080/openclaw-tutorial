---
title: "从零开始：手把手教你给 OpenClaw 接入大模型"
description: "5 分钟快速入门，让 OpenClaw 拥有第一个大模型，解锁全部功能"
pubDate: 2026-03-17
category: 01-getting-started
order: 1
difficulty: beginner
estimatedTime: "10 分钟"
tags: ['入门', '模型配置', '新手指南']
prerequisites: ['已安装 OpenClaw', '有终端基础']
featured: false
relatedPosts:
  - channel-feishu
  - agents-config
prevPost: install-openclaw
nextPost: channel-feishu
status: published
alternates:
  zhCN: /zh-cn/tutorials/01-getting-started/model-integration/
---

## TL;DR

5 分钟搞定：注册账号 → 复制 Key → 运行命令。OpenClaw 就有"大脑"了，能真正"思考"！🧠

## Requirements

开始前准备好这些：

- ✅ OpenClaw 已安装
- ✅ Anthropic 账号（免费，$5 额度）
- ✅ 会用终端

**检查下：**
```bash
openclaw --version
```

**应该看到：**
```
OpenClaw v2.x.x
```

## Steps

### 第 1 步：选个模型

OpenClaw 只是"外壳"，需要装个"大脑"才能工作。选哪个？

#### 推荐列表

| 模型 | 为什么选它 | 花钱吗 | 难度 |
|------|----------|---------|------|
| **Claude Sonnet** | 文档最全，中文好 | $5 免费额度 | ⭐ 简单 |
| **GPT-4 Turbo** | 最有名，生态成熟 | 有新用户送 | ⭐⭐ 简单 |
| **GLM-4.7** | 国产，中文友好 | 有免费额度 | ⭐⭐ 简单 |

#### 咋选？

- 想要中文好、文档全 → Claude Sonnet
- 想要生态大、兼容好 → GPT-4 Turbo
- 想要省钱、国产 → GLM-4.7

**💡 新手推荐：** Claude Sonnet，免费额度够用，中文也不错。

---

### 第 2 步：拿个 API Key

就像给电脑装驱动要密钥，OpenClaw 用模型也要 API Key。这把"钥匙"只有一次机会！

#### 用 Claude Sonnet 举例

**注册账号：**
1. 打开 https://console.anthropic.com
2. 点"Sign up"（注册）
3. 用邮箱搞定

**⚠️ 它有免费额度：** $5，够你玩很久了。

---

**创建 Key：**
1. 登录后，点左边"API Keys"
2. 点右上"Create Key"（创建密钥）
3. 给它起个名，比如"OpenClaw"
4. 点"Create"

**⚠️⚠️⚠️ 关键：** 这个 Key **只显示一次**！删了就找不回了！

---

**保存好：**
1. 复制 Key（点右侧复制按钮）
2. 存密码管理器（最安全）
3. 或者记在安全的地方

**💡 别直接写在命令行里**，会被历史记录保存，不安全。

---

### 第 3 步：告诉 OpenClaw 用这个模型

现在把"钥匙"给 OpenClaw，三种方式选一种：

#### 方式 1：环境变量（最简单）

**临时用（当前终端）：**
```bash
export ANTHROPIC_API_KEY="sk-ant-xxxxx"
```

**永久用（每次打开终端都行）：**
```bash
# 添加到 ~/.bashrc
echo 'export ANTHROPIC_API_KEY="sk-ant-xxxxx"' >> ~/.bashrc
source ~/.bashrc
```

**💡 把 `sk-ant-xxxxx` 换成你实际的 Key**

---

#### 方式 2：向导（最省事）

OpenClaw 有个向导，交互式设置，超简单。

```bash
openclaw onboard --auth-choice anthropic-api-key
```

**它会问你：**
```
请输入你的 Anthropic API Key: sk-ant-xxxxx
✅ API Key 已保存
✅ 模型已设置为 anthropic/claude-sonnet-4-5
✅ 配置完成！
```

**看到"配置完成！"就对了** ✅

---

#### 方式 3：直接改配置（最灵活）

```bash
openclaw config set agents.defaults.model.primary anthropic/claude-sonnet-4-5
```

**⚠️ 这只设了模型，没设 Key，还要用方式 1 或 2**

---

### 第 4 步：测试一下

确保真配好了，别光配置完就跑。

**看看状态：**
```bash
openclaw models status
```

**应该看到：**
```
✓ Primary model: anthropic/claude-sonnet-4-5
✓ Auth profile: anthropic:default (valid)
✓ Fallbacks: (none configured)
```

看到"valid"就说明 Key 没问题！👍

---

**发条消息试试：**
```bash
echo "你好，OpenClaw！" | openclaw
```

**应该看到：**
```
你好！我是 OpenClaw，很高兴见到你！
```

**🎉 如果它回你了，恭喜！配置成功！**

---

## Expected Outcome

搞定这些后，你可以：

- ✅ 给 OpenClaw 装上"大脑"
- ✅ 知道几种配置方式
- ✅ 会拿 API Key
- ✅ 能验证配置对不对

### 你现在有个真的能"思考"的 AI 助手了！

**之前：** OpenClaw 像没 CPU 的电脑，键盘鼠标都有，就是不会"想"
**现在：** 装上模型就像有了强大 CPU，OpenClaw 能真正"思考"和回应！

### 接下来可以干嘛

- 连接聊天渠道（飞书、微信啥的）
- 配置更多模型（不同任务用不同的）
- 自定义 OpenClaw 行为（记忆、工作区等）
- 安装更多技能（扩展能力）

## Common Issues

### 问题 1：API Key 删了没保存

**现象：** 创建了 Key，忘了保存，现在找不到了。

**原因：** Anthropic 安全考虑，Key 只显示一次。

**咋办：**

1. 回 https://console.anthropic.com
2. 点 API Keys，找到旧的，点 Delete 删除
3. 点 Create Key 创建新的
4. **这次赶紧保存到密码管理器！**

### 问题 2：命令不存在

**现象：** 运行 `openclaw` 报错：
```
bash: openclaw: command not found
```

**原因：** 没安装或者没加到 PATH。

**检查一下：**
```bash
openclaw --version
```

如果报错，说明没装，去看安装教程。

### 问题 3："Model is not allowed" 错误

**现象：** 用模型时报错：
```
Model "anthropic/claude-opus-4-5" is not allowed.
```

**原因：** 你设了白名单（`agents.defaults.models`），但这个模型不在里面。

**两个办法：**

1. **加这个模型到白名单：**
   ```bash
   openclaw config set agents.defaults.models.anthropic/claude-opus-4-5
   ```

2. **删掉白名单（新手推荐）：**
   ```bash
   openclaw config delete agents.defaults.models
   ```

**💡 新手刚开始可以先不设白名单，简单点。**

### 问题 4：环境变量没生效

**现象：** 设置了 `ANTHROPIC_API_KEY`，但 OpenClaw 还是说没认证。

**原因：** 环境变量只对当前终端有效，新开终端就没了。

**永久设置：**

```bash
# bash 用户
echo 'export ANTHROPIC_API_KEY="sk-ant-xxxxx"' >> ~/.bashrc
source ~/.bashrc

# zsh 用户
echo 'export ANTHROPIC_API_KEY="sk-ant-xxxxx"' >> ~/.zshrc
source ~/.zshrc
```

**验证下：**
```bash
echo $ANTHROPIC_API_KEY
```

**应该看到你的 Key。**

## Next Steps

**🎉 搞定！** OpenClaw 现在有个能干的"大脑"了。接下来还能做啥？

### 推荐看

- **[接入你的第一个聊天渠道](/tutorials/channel-feishu/)**
  - 连接飞书，日常对话
  - 学消息路由和格式化

- **[配置 OpenClaw 的其他设置](/tutorials/agents-config/)**
  - 自定义行为
  - 设置工作区和记忆
  - 了解 AGENTS.md、USER.md、SOUL.md

- **[高级模型配置](/tutorials/model-advanced/)**
  - 配置多个模型
  - 智能路由
  - 成本优化

### 学更多

- **[OpenClaw 文档](https://docs.openclaw.ai)** - 官方文档，啥都有
- **[Discord 社区](https://discord.com/invite/clawd)** - 提问、分享经验
- **[GitHub](https://github.com/openclaw/openclaw)** - 源码和问题

## References

### 官方文档

- [模型 CLI](https://docs.openclaw.ai/zh-CN/cli/models)
- [模型概念](https://docs.openclaw.ai/zh-CN/concepts/models)
- [模型提供商](https://docs.openclaw.ai/zh-CN/concepts/model-providers)
- [故障转移](https://docs.openclaw.ai/zh-CN/concepts/model-failover)

### 社区

- [Discord #questions](https://discord.com/invite/clawd)
- [GitHub Issues](https://github.com/openclaw/openclaw/issues)

---

**搞定时间：** 2026-03-17
**看完这篇：** 你就有个可用的 AI 助手了！🚀
