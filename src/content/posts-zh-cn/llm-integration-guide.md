---
title: "OpenClaw 接入大模型完全指南：选型、配置与多模型智能路由"
description: "横评 10+ 款主流大模型的价格与能力，详解 Onboard 向导和配置文件两种接入方式，并手把手教你配置多模型智能路由，让不同任务自动找到最合适的模型。"
pubDate: 2026-03-21
lastUpdated: 2026-03-21
tags: ["llm", "configuration", "multi-model", "routing", "intermediate"]
difficulty: intermediate
estimatedTime: "30 分钟"
prerequisites: ['已安装 OpenClaw', '至少一个大模型提供商的 API Key', 'Node.js 22.16+']
category: getting-started
order: 1
featured: true
status: published
relatedPosts:
  - model-integration
alternates:
  zhCN: /zh-cn/tutorials/getting-started/llm-integration-guide/
---
## TL;DR

本文覆盖三件事：

1. **选哪个模型**：横评 10+ 款主流大模型（价格截至 2026-03-21），给出开箱即用的推荐组合
2. **怎么接入**：Onboard 向导（新手）+ 配置文件（精细控制）两种方法详解
3. **多模型路由**：一次配置多个模型，让不同类型的任务自动找到最合适（最省钱）的模型

---

## 前置要求

- 已安装 OpenClaw（`npm install -g openclaw@latest`）
- 至少准备一个大模型提供商的 API Key
- Node.js 22.16+ 或 24（推荐）

---

## 第一章：2026 主流大模型横评——选哪个接入 OpenClaw？

接入大模型的第一步不是操作，而是选型。选错了模型，要么钱烧光了效果差，要么效果好但账单让人心疼。

目前主流大模型我们从四个维度横评：

- **综合能力**：编码、推理、长文档处理、中文表达
- **价格**：输入/输出 token 单价（$/百万 tokens，价格截至 2026-03-21）
- **上下文窗口**：单次能处理多长的内容
- **擅长场景**：这个模型最适合干什么

### 1.1 完整对比表

| 模型                        | 输入价格$/M | 输出价格 $/M | 上下文窗口          | 综合能力              | 中文能力   | 最适合的场景                                       |                                            |
| --------------------------- | ---------------------------- | ------------------- | --------------------- | ---------- | -------------------------------------------------- | ------------------------------------------ |
| **Claude Opus 4.6**   | $5.00 | $25.00               | 1M tokens           | ⭐⭐⭐⭐⭐            | ⭐⭐⭐⭐   | 复杂推理、多文件重构、高要求 Agent 任务            |                                            |
| **Claude Sonnet 4.6** | $3.00 | $15.00               | 1M tokens           | ⭐⭐⭐⭐⭐            | ⭐⭐⭐⭐   | 代码生成、综合任务，**性价比最高的顶级模型** |                                            |
| **Claude Haiku 4.5**  | $1.00 | $5.00                | 200K tokens         | ⭐⭐⭐⭐              | ⭐⭐⭐⭐   | 快速响应、高频对话、子任务执行                     |                                            |
| **GPT-5.4**           | $2.50 | $15.00               | 272K（1M 实验性）   | ⭐⭐⭐⭐⭐            | ⭐⭐⭐⭐   | Agent 自动化、Computer Use、工具搜索               |                                            |
| **GPT-5.4 mini**      | $0.75 | $4.50                | 400K tokens         | ⭐⭐⭐⭐              | ⭐⭐⭐     | 高性价比通用任务、数据提取、分类                   |                                            |
| **Gemini 3 Flash**    | $0.50 | $3.00                | 1M tokens           | ⭐⭐⭐⭐⭐            | ⭐⭐⭐⭐   | **性价比冠军**，混合推理，大规模任务         |                                            |
| **Gemini 3.1 Pro**    | $2.00–$4.00                 | $12.00–$18.00      | 1M tokens（64K 预览） | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐                                           | 长文档分析、复杂推理                       |
| **DeepSeek V3.2**     | $0.028（缓存命中）/ $0.28    | $0.42               | 128K tokens           | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐                                         | **价格最低的顶级模型**，中文能力最强 |
| **GLM-4.7**（智谱）   | ≈$0.28 | ≈$1.11            | 200K tokens         | ⭐⭐⭐⭐              | ⭐⭐⭐⭐⭐ | 国内访问稳定，Agent 场景适用                       |                                            |
| **GLM-5**（智谱）     | ≈$0.56 | ≈$2.50            | 200K tokens         | ⭐⭐⭐⭐⭐            | ⭐⭐⭐⭐⭐ | Agent 任务优化，国内旗舰                           |                                            |
| **Kimi K2.5**         | ≈$0.56 | ≈$2.92            | 262K tokens         | ⭐⭐⭐⭐⭐            | ⭐⭐⭐⭐⭐ | 超长文档、思考模式推理                             |                                            |
| **MiniMax M2.7**      | ≈$0.29 | ≈$1.17            | 205K tokens         | ⭐⭐⭐⭐⭐            | ⭐⭐⭐⭐⭐ | 全模态任务，文本/语音/视频一体                     |                                            |
| **Qwen3-Max**         | ≈$0.35 起 | ≈$1.39 起      | 262K tokens         | ⭐⭐⭐⭐⭐            | ⭐⭐⭐⭐⭐ | 中文推理旗舰，阿里云生态                           |                                            |
| **Qwen3.5-Plus**      | ≈$0.11 | ≈$0.67            | **1M tokens** | ⭐⭐⭐⭐              | ⭐⭐⭐⭐⭐ | **国内性价比最高**，超长上下文               |                                            |

> 💡 **价格说明**：国内模型（GLM、Kimi、MiniMax、Qwen）原始定价为人民币，按 ¥7.2 = $1 换算。DeepSeek 缓存命中价格在重复 prompt 场景下尤为显著。

### 1.2 各模型深度点评

**Claude Sonnet 4.6 / Opus 4.6**

Claude 系列目前是代码生成和多步骤 Agent 任务的最强选择。Sonnet 4.6 是大多数用户的首选——能力接近 Opus，价格只有 Opus 的 60%。两者都支持高达 1M tokens 上下文，可以把整个代码库一起送进去分析。

缺点是价格偏贵，且国内直连 Anthropic API 需要解决网络问题（可通过 [OpenRouter](https://openrouter.ai) 中转）。

**GPT-5.4**

2026年3月5日发布的最新旗舰，最大亮点是原生 Computer Use 能力（可以直接操控计算机完成复杂工作流）和 Tool Search（在大规模工具生态中自动找到最合适的工具，降低 47% token 消耗）。支持五档推理强度（none / low / medium / high / xhigh），可按任务复杂度灵活调整。

标准版 272K 上下文，实验性 1M 上下文需要显式开启。来源：[OpenAI GPT-5.4 发布公告](https://openai.com/index/introducing-gpt-5-4/)

**Gemini 3 Flash / Gemini 3.1 Pro**

Google 最新一代 Gemini 模型系列。Gemini 3 Flash 是极致性价比之选——$0.50/M 输入，$3.00/M 输出，同时支持 1M 上下文。特别适合作为路由方案中的"日常主力"，复杂任务再交给 Claude 或 GPT-5.4 处理。

Gemini 3.1 Pro 是旗舰版本，支持高达 1M 上下文，输入价格根据上下文长度阶梯收费：≤200K 为 $2.00/M，>200K 为 $4.00/M；输出价格为 $12.00–$18.00/M。适合需要深度推理的复杂任务。

唯一问题是国内无法直连，需要通过 OpenRouter 或其他中转服务访问。来源：[Google Gemini API 定价](https://ai.google.dev/gemini-api/docs/pricing)

**DeepSeek V3.2**

国产模型里的价格屠夫。缓存命中时输入仅 $0.028/M，即使未命中也只有 $0.28/M，输出 $0.42/M。中文能力是所有模型里最强的，代码能力同样出色。非常适合中文内容处理、日常对话等高频任务。

已知缺点：上下文窗口只有 128K，相比其他模型的 200K-1M 明显偏小。来源：[DeepSeek API 定价](https://api-docs.deepseek.com/quick_start/pricing)

**GLM-4.7 / GLM-5（智谱）**

智谱的两款主力模型，均可通过 `zai/` provider 在 OpenClaw 中直接使用（已验证）。GLM-5 是面向 Agent 使用场景优化的旗舰版本，有 200K 上下文。最大优势是**国内访问稳定，无需中转**。

据作者实测及社区反馈，GLM 系列在高负载时响应速度相对较慢，高并发场景下尤为明显，适合作为主力或备用，但对延迟敏感的场景需留意。来源：[智谱 BigModel 定价](https://open.bigmodel.cn/pricing)

**Kimi K2.5（月之暗面）**

262K 的超长上下文是一大亮点，支持"思考模式"和"非思考模式"双档切换，前者用于深度推理，后者用于快速响应。中文处理能力优秀。

**Qwen3-Max / Qwen3.5-Plus（通义千问）**

Qwen3-Max 是国内中文综合能力的旗舰，支持思考模式。Qwen3.5-Plus 性价比突出——$0.11/M 输入，$0.67/M 输出，上下文高达 **1M tokens**，国内访问稳定。预算有限时，Qwen3.5-Plus 是作者目前最推荐的国内模型。来源：[阿里云百炼模型列表](https://help.aliyun.com/zh/model-studio/models)

### 1.3 三套推荐接入方案

**方案 A：旗舰全能型**（月消费 $50+）

- 主力：Claude Sonnet 4.6
- 备用：GPT-5.4
- 轻量任务：Gemini 3 Flash

**方案 B：性价比均衡型**（月消费 $10–50）

- 主力：Gemini 3 Flash 或 DeepSeek V3.2
- 复杂任务升级：Claude Sonnet 4.6（按需调用）
- 国内备用：GLM-4.7

**方案 C：纯国内低成本型**（月消费 $10 以内）

- 主力：Qwen3.5-Plus 或 DeepSeek V3.2
- 升级版：GLM-5 或 Kimi K2.5
- 旗舰备用：GLM-5（按需切换）

---

## 第二章：方法一——通过 Onboard 向导接入（新手首选）

如果你是第一次配置 OpenClaw，强烈推荐从 Onboard 向导开始——交互式问答引导完成所有配置，无需手动编辑任何文件。

### 2.1 获取 API Key

运行向导前，先去对应平台注册并获取 API Key：

| 提供商              | 注册/获取 Key 的地址                                              |
| ------------------- | ----------------------------------------------------------------- |
| Anthropic（Claude） | [console.anthropic.com](https://console.anthropic.com)               |
| OpenAI（GPT）       | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) |
| Google（Gemini）    | [aistudio.google.com](https://aistudio.google.com)                   |
| 智谱（GLM）         | [open.bigmodel.cn](https://open.bigmodel.cn)                         |
| 月之暗面（Kimi）    | [platform.moonshot.cn](https://platform.moonshot.cn)                 |
| MiniMax             | [platform.minimaxi.com](https://platform.minimaxi.com)               |
| 阿里云（Qwen）      | [bailian.console.aliyun.com](https://bailian.console.aliyun.com)     |
| DeepSeek            | [platform.deepseek.com](https://platform.deepseek.com)               |

> ⚠️ **国内访问提示**：Claude、GPT-5.4、Gemini 等境外服务在中国大陆无法直连。推荐通过 [OpenRouter](https://openrouter.ai) 统一代理，一个 Key 接入几乎所有模型，省去网络问题。

### 2.2 运行 Onboard 向导

打开终端，执行：

```bash
openclaw onboard --install-daemon
```

`--install-daemon` 将 OpenClaw 网关安装为系统后台服务，开机自启动，推荐加上。

向导共分五步：

**步骤 1：选择 AI 提供商并输入 API Key**

```
? Select your AI provider:
❯ Anthropic (Claude)
  OpenAI (GPT)
  Google (Gemini)
  OpenRouter
  DeepSeek
  Moonshot (Kimi)
  ...

? Enter your Anthropic API Key: sk-ant-api03-...
✅ API Key verified successfully
```

**步骤 2：配置聊天通道（可选）**

如果只用本地 Web UI，直接跳过：

```
? Configure a chat channel? (optional)
  Telegram / WhatsApp / Discord
❯ Skip for now
```

**步骤 3：安装技能（可选）**

初次使用建议跳过，之后可随时补装：

```
? Install skills? (optional)
❯ Skip for now
```

**步骤 4：选择界面**

```
? Choose your preferred UI:
❯ Web Control UI (http://localhost:18789)
  TUI (Terminal UI)
```

**步骤 5：Bot 个性化**

```
? What should your AI assistant be called? > Claw
? How should it address you? > 主人
```

### 2.3 验证接入成功

```bash
# 检查网关状态
openclaw gateway status
# 期望输出：Gateway running on port 18789

# 查看已配置的模型
openclaw models list
```

打开浏览器访问 `http://localhost:18789`，能正常发消息即表示接入成功。

### 2.4 接入第二个、第三个模型

Onboard 完成后再次运行向导即可添加更多提供商（不会覆盖已有配置）：

```bash
openclaw onboard
```

也可以直接用命令行切换主模型或添加备用模型：

```bash
# 切换当前主模型为 DeepSeek
openclaw models set deepseek/deepseek-chat

# 添加备用模型（主模型失败时自动切换）
openclaw models fallbacks add openai/gpt-5.4

# 清除备用模型列表
openclaw models fallbacks clear

# 查看所有已配置模型
openclaw models list
```

---

## 第三章：方法二——通过配置文件精细配置多个模型

Onboard 向导方便，但高级配置（自定义路由规则、多模型精细控制）需要直接编辑配置文件。

### 3.1 配置文件位置

```
~/.openclaw/openclaw.json
```

格式是 **JSON5**（JSON 超集），支持注释和末尾逗号，比标准 JSON 更易读：

```
~/.openclaw/
├── openclaw.json          # 主配置文件
├── credentials/           # API 密钥（建议 chmod 600）
│   ├── anthropic
│   ├── openai
│   └── openrouter
└── workspace/             # Agent 工作区
    ├── AGENTS.md
    ├── SOUL.md
    └── memory/
```

### 3.2 核心字段详解

```json5
{
  "agents": {
    "defaults": {
      // 主模型 + 备用模型链
      "model": {
        "primary": "anthropic/claude-sonnet-4-6",   // 主模型
        "fallbacks": [
          "openai/gpt-5.4",                          // 第一备用
          "google/gemini-3-flash"                  // 第二备用
        ]
      },
      // 允许通过 /model 命令切换的模型白名单
      "models": {
        "anthropic/claude-sonnet-4-6": { "alias": "Sonnet" },
        "anthropic/claude-opus-4-6": { "alias": "Opus" },
        "openai/gpt-5.4": { "alias": "GPT5" },
        "google/gemini-3-flash": { "alias": "Flash" },
        "deepseek/deepseek-chat": { "alias": "DeepSeek" }
      }
    }
  },
  "gateway": {
    "port": 18789
  }
}
```

### 3.3 模型 ID 完整参考表

OpenClaw 使用 `provider/model-id` 格式标识模型：

| 模型                    | 配置文件中的 ID                 |
| ----------------------- | ------------------------------- |
| Claude Sonnet 4.6       | `anthropic/claude-sonnet-4-6` |
| Claude Opus 4.6         | `anthropic/claude-opus-4-6`   |
| Claude Haiku 4.5        | `anthropic/claude-haiku-4-5`  |
| GPT-5.4                 | `openai/gpt-5.4`              |
| GPT-5.4 mini            | `openai/gpt-5.4-mini`         |
| Gemini 3 Flash          | `google/gemini-3-flash`       |
| Gemini 3.1 Pro          | `google/gemini-3.1-pro`       |
| DeepSeek V3.2           | `deepseek/deepseek-chat`      |
| GLM-4.7（智谱，已验证） | `zai/glm-4.7` ✅              |
| GLM-5（智谱，已验证）   | `zai/glm-5` ✅                |
| Kimi K2.5               | `moonshot/kimi-k2.5`          |
| MiniMax M2.7            | `minimax/minimax-m2.7`        |
| Qwen3-Max               | `qwen/qwen3-max`              |
| Qwen3.5-Plus            | `qwen/qwen3.5-plus`           |

> 💡 不确定某个模型 ID 的格式？运行 `openclaw models list` 可查看当前 OpenClaw 支持的全部模型及其准确 ID。

### 3.4 多模型完整配置示例

以下是"方案 B 性价比均衡型"的完整配置：

```json5
{
  "agents": {
    "defaults": {
      "model": {
        // 日常主力：DeepSeek，价格最低的顶级模型
        "primary": "deepseek/deepseek-chat",
        "fallbacks": [
          "qwen/qwen3.5-plus",   // 国内备用，1M 上下文
          "zai/glm-4.7"          // 最后兜底
        ]
      },
      "models": {
        "deepseek/deepseek-chat": { "alias": "主力" },
        "anthropic/claude-sonnet-4-6": { "alias": "旗舰" },
        "qwen/qwen3.5-plus": { "alias": "千问" },
        "zai/glm-4.7": { "alias": "GLM" },
        "zai/glm-5": { "alias": "GLM5" }
      }
    }
  }
}
```

修改配置后重启网关使其生效：

```bash
openclaw gateway restart
```

### 3.5 通过 OpenRouter 中转接入境外模型

国内用户推荐通过 [OpenRouter](https://openrouter.ai) 访问 Claude、GPT-5.4、Gemini 等境外模型：

```json5
{
  "models": {
    "mode": "merge",
    "providers": {
      "openrouter": {
        "baseUrl": "https://openrouter.ai/api/v1",
        "apiKey": "sk-or-v1-你的OpenRouter-Key",
        "api": "openai-completions"
      }
    }
  },
  "agents": {
    "defaults": {
      "model": {
        "primary": "openrouter/anthropic/claude-sonnet-4-5",
        "fallbacks": ["openrouter/openai/gpt-5.4"]
      }
    }
  }
}
```

OpenRouter 还提供一个特殊的 `auto` 模型，根据 prompt 复杂度自动选择最具性价比的模型：

```json5
"primary": "openrouter/openrouter/auto"
```

---

## 第四章：进阶——多模型智能路由

这是本文最核心的部分。配置多个模型后，通过路由让不同任务自动找到最合适的模型，是 OpenClaw 真正强大的地方。

### 4.1 为什么要配置路由？

一个现实场景：你每天用 OpenClaw 完成各种任务——

- 检查今天的天气和日程（极简单）
- 回复几封邮件（简单）
- 帮你写一段 Python 代码（中等）
- 分析一份 50 页的技术文档（复杂）
- 重构一个有 20 个文件的代码库（非常复杂）

全部用 Claude Opus 4.6（$25/M 输出）你会把钱烧在不该烧的地方；全部用免费模型复杂任务则会让你抓狂。

**正确做法是分层路由**：简单任务走便宜模型，复杂任务才动用旗舰。

### 4.2 路由策略：模型分层（Model Tiering）

经过实战验证的三层路由方案：

| 层级             | 任务类型                            | 推荐模型                      | 月均费用参考 |
| ---------------- | ----------------------------------- | ----------------------------- | ------------ |
| **轻量层** | 心跳检查、简单问答、格式化输出      | GLM-4.7 或 Gemini 3 Flash     | 极低         |
| **主力层** | 代码生成、文档处理、日常 Agent 任务 | DeepSeek V3.2 或 Qwen3.5-Plus | $5–20       |
| **旗舰层** | 复杂推理、多文件重构、创意写作      | Claude Sonnet 4.6 或 GPT-5.4  | 按需计费     |

### 4.3 配置多 Agent 路由

在配置文件中定义多个 Agent，每个 Agent 使用不同的模型：

```json5
{
  "agents": {
    "list": [
      {
        // 默认 Agent：日常主力
        "id": "daily",
        "default": true,
        "model": {
          "primary": "deepseek/deepseek-chat",
          "fallbacks": ["qwen/qwen3.5-plus"]
        },
        "workspace": "~/.openclaw/workspace-daily"
      },
      {
        // 旗舰 Agent：复杂任务专用，/agent premium 切换
        "id": "premium",
        "model": {
          "primary": "anthropic/claude-sonnet-4-6",
          "fallbacks": ["openai/gpt-5.4"]
        },
        "workspace": "~/.openclaw/workspace-premium"
      },
      {
        // 轻量 Agent：测试和简单任务
        "id": "lite",
        "model": {
          "primary": "zai/glm-4.7"
        },
        "workspace": "~/.openclaw/workspace-lite"
      }
    ]
  }
}
```

通过命令切换 Agent：

```bash
openclaw agent premium    # 切换到旗舰模型
openclaw agent daily      # 切回日常主力
openclaw agent lite       # 使用轻量模型
```

### 4.4 Fallback 故障自动切换

Fallback 确保主模型不可用时自动降级，不中断 Agent 工作流：

```json5
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "anthropic/claude-sonnet-4-6",
        "fallbacks": [
          "openai/gpt-5.4",          // 主模型 503/429/超时时切换
          "google/gemini-3-flash", // 第二级备用
          "zai/glm-4.7"              // 最后保底（国内稳定）
        ]
      }
    }
  }
}
```

常见触发 Fallback 的情况：API 服务异常（503）、请求限流（429）、响应超时。

### 4.5 推荐的最优组合方案

综合价格、能力、国内可用性，以下是针对个人开发者的推荐配置（月消费控制在 $20 以内）：

```json5
{
  "agents": {
    "defaults": {
      "model": {
        // 主力：DeepSeek V3.2，价格最低的顶级模型，中文最强
        "primary": "deepseek/deepseek-chat",
        "fallbacks": [
          "qwen/qwen3.5-plus",  // 国内稳定备用，1M 上下文
          "zai/glm-4.7"         // 最后兜底
        ]
      },
      "models": {
        "deepseek/deepseek-chat": { "alias": "主力" },
        "anthropic/claude-sonnet-4-6": { "alias": "旗舰" },
        "qwen/qwen3.5-plus": { "alias": "千问" },
        "zai/glm-4.7": { "alias": "GLM" }
      }
    },
    "list": [
      {
        "id": "main",
        "default": true,
        "model": {
          "primary": "deepseek/deepseek-chat",
          "fallbacks": ["qwen/qwen3.5-plus", "zai/glm-4.7"]
        }
      },
      {
        // 需要强推理时才切换（复杂代码重构、深度分析）
        "id": "powerful",
        "model": {
          "primary": "anthropic/claude-sonnet-4-6",
          "fallbacks": ["openai/gpt-5.4"]
        }
      }
    ]
  }
}
```

日常 90% 的任务走 DeepSeek（费用极低），遇到真正复杂的任务时手动切换到 `powerful` Agent。这套方案在多数情况下能在控制成本的同时保持较高的输出质量。

---

## 第五章：常见问题排错

### 问题 1：API Key 无效（401 错误）

**错误表现**：`Invalid API key` / `authentication_error` / `401-InvalidApiKey`

**常见原因**：

- 复制 Key 时带入了首尾空格
- 把环境变量名（如 `ANTHROPIC_API_KEY`）当成 Key 值填入
- 将 A 服务商的 Key 填到了 B 服务商配置项
- Key 已被删除或撤销

**解决方法**：重新从控制台复制 Key（去除多余空白），确认 Key 与提供商一一对应。修改后运行 `openclaw models status` 验证。

---

### 问题 2：账户欠费被拒（402 错误）

**错误表现**：`billing_error` / `Access denied` / `Account balance insufficient`

**解决方法**：登录对应平台控制台充值（充值后可能有几分钟延迟），或切换到有余额的备用模型（GLM-4.7 有免费额度）。

---

### 问题 3：触发限流（429 错误）

**错误表现**：`RateLimitError` / `Requests rate limit exceeded`

**解决方法**：

- 确认配置了 `fallbacks`，OpenClaw 会自动切换到备用模型
- 考虑升级套餐或申请更高配额
- 将大任务拆分，避免短时间内集中触发

---

### 问题 4：模型名称填写错误（404 错误）

**错误表现**：`Model not exist` / `404-ModelNotFound`

**解决方法**：参照本文第三章的"模型 ID 参考表"核实 ID 格式，或运行 `openclaw models list` 查看当前支持的全部模型 ID。

---

### 问题 5：连接超时

**错误表现**：`APITimeoutError` / `Connection error` / 长时间无响应

**解决方法**：

- 境外 API 通过 OpenRouter 中转，或切换到国内可直连的模型（DeepSeek、GLM、Qwen、Kimi）
- 适当增大 timeout 设置（长文档任务建议 120 秒以上）

---

### 问题 6：国内无法访问境外 API

**错误表现**：`Connection refused` / 持续超时

**解决方法**：

- 使用 [OpenRouter](https://openrouter.ai) 统一代理
- 直接切换到 DeepSeek / GLM / Qwen / Kimi 等国内服务商
- 在境外服务器部署自建中转层

---

### 问题 7：模型响应极慢

**常见原因**：GLM 系列在高峰期响应较慢（据作者实测及社区反馈）；推理模型思维链计算耗时；`max_tokens` 设置过大。

**解决方法**：

- 对延迟敏感的场景，将 GLM 降为 fallback，主力换用 DeepSeek 或 Qwen
- 对实时交互场景优先用响应快的模型（Claude Haiku、Gemini 3 Flash）

---

### 问题 8：权限不足（403 错误）

**错误表现**：`403-AccessDenied` / `permission_error`

**解决方法**：确认账号已完成实名认证，检查子账号权限配置，必要时申请目标模型的访问资格。

---

### 问题 9：请求格式错误（400 错误）

**错误表现**：`invalid_request_error` / `Field required: xxx`

**解决方法**：用 JSON5 校验工具检查配置文件（括号未闭合、多余逗号均会报错）。修改后重启网关：`openclaw gateway restart`。

---

### 问题 10：上下文长度超限

**错误表现**：`ContextWindowExceededError` / `Total message token length exceed model limit`

**解决方法**：

- 切换到上下文更大的模型（Claude 1M、Qwen3.5-Plus 1M、GPT-5.4 272K）
- 对历史消息进行摘要压缩，减少上下文占用

---

### 问题 11：多模型路由配置不生效

**错误表现**：修改配置后请求仍然走同一个模型

**解决方法**：

1. 修改配置文件后必须重启网关：`openclaw gateway restart`
2. 检查模型 ID 拼写是否与实际格式一致（运行 `openclaw models list` 对照）
3. Fallback 只在特定错误（429、503、超时）下触发，正常使用不会自动切换
4. 运行 `openclaw gateway status` 确认配置已加载

---

### 问题 12：模型返回内容截断或格式异常

**错误表现**：回复被截断、要求 JSON 输出但返回普通文本

**解决方法**：适当增大 `max_tokens` 值；要求 JSON 输出时，在 prompt 中明确包含"json"关键词（API 层面的格式校验要求）。

---

## 小结

配置大模型接入 OpenClaw，核心是三件事：

1. **选型**：根据预算和使用场景选合适的模型组合。国内用户优先考虑 DeepSeek V3.2（最便宜的顶级模型）+ Qwen3.5-Plus（最高性价比的 1M 上下文）+ GLM-4.7（国内稳定备用）。
2. **配置**：新手走 Onboard 向导，进阶用户直接编辑 `~/.openclaw/openclaw.json`，支持完整的多模型精细控制。
3. **路由**：通过多 Agent + Fallback 机制，让复杂任务找到最合适的模型，日常任务走便宜模型，特殊任务升级旗舰，兼顾效果与成本。

**下一步推荐阅读：**

- [配置飞书渠道，随时随地与 Agent 交互](/zh-cn/posts/channel-feishu)
- [Skills 技能系统：为 Agent 添加邮件、日历等能力](#)

---

## 数据来源

- [Anthropic 模型文档](https://platform.claude.com/docs/en/about-claude/models/overview)
- [OpenAI GPT-5.4 发布公告](https://openai.com/index/introducing-gpt-5-4/)
- [OpenAI 定价页面](https://developers.openai.com/api/docs/pricing)
- [Google Gemini 3 API 定价](https://ai.google.dev/gemini-api/docs/pricing)
- [Google Gemini 3.1 Pro 预览文档](https://ai.google.dev/gemini-api/docs/models/gemini-3.1-pro-preview)
- [DeepSeek API 定价](https://api-docs.deepseek.com/quick_start/pricing)
- [智谱 BigModel 定价](https://open.bigmodel.cn/pricing)
- [MiniMax 定价](https://platform.minimaxi.com/document/price)
- [阿里云百炼模型列表](https://help.aliyun.com/zh/model-studio/models)
- [OpenClaw 官方文档 - Model Providers](https://docs.openclaw.ai/concepts/model-providers)
- [OpenClaw 官方文档 - Configuration](https://docs.openclaw.ai/gateway/configuration)
- [OpenClaw 官方文档 - Getting Started](https://docs.openclaw.ai/start/getting-started)
