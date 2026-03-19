---
title: "从零开始:手把手教你给 OpenClaw 接入大模型"
description: "手把手教你给 OpenClaw 接入国内大模型,零基础也能搞定"
pubDate: 2026-03-19
category: getting-started
order: 1
difficulty: beginner
estimatedTime: "20 分钟"
tags: ['llm', 'integration', 'beginner', 'domestic-llm']
prerequisites: ['已安装 OpenClaw', '会基础命令行操作']
featured: true
relatedPosts:
  - channel-feishu
nextPost: channel-feishu
status: published
alternates:
  zhCN: /zh-cn/tutorials/getting-started/model-integration/
---

## TL;DR

想给 OpenClaw 接入大模型但不知道从哪开始?别慌!本文带你一步步搞定,重点介绍国内大模型。说实话,国内模型真挺香的——免费额度多、中文说得好、网络还快,根本不用担心翻墙这种麻烦事。新手我建议从 GLM-4 或 Qwen 开始,每天 2000 次免费调用,普通人真的够用了。

---

## 前置要求

开始前准备这些东西:

- [ ] 已安装 OpenClaw(没有的话运行 `npm install -g openclaw`)
- [ ] 会基础命令行操作(打开终端、输入命令就行)
- [ ] **不用懂编程**(我是认真的!)

**说句实话:** 如果你完全没用过命令行,也别怕。本文会用最简单的语言解释每一步,你照着操作就行,跟玩游戏一样简单。

---

## 核心步骤

### 步骤 1:理解核心概念

#### 目标
搞清楚 OpenClaw 和大模型的关系,别被术语吓跑。

#### OpenClaw 是什么?

简单说,**OpenClaw 是个壳子,大模型是脑子**。

打个比方:
- OpenClaw 就像智能手机的操作系统
- 大模型就像手机里的 App(微信、支付宝这些)
- 你只要把 App 装好,就能通过操作系统用了

#### 核心概念(用大白话讲)

**1. Provider(提供商)**
- 就是"卖大模型服务的"
- 比如:智谱 AI、阿里云、百度这些
- 它们提供大模型给咱们用

**2. Model(模型)**
- 具体的 AI 模型
- 比如:GLM-4、Qwen、文心一言
- 写法是 `provider/model-id`(比如 `zai/glm-4`)

**3. API Key**
- 就像"密码"或"会员卡"
- 用来访问大模型服务
- 得保护好,别泄露出去

**4. Failover(故障切换)**
- 就像"备胎"
- 主模型挂了,自动切换到备用的
- 保证服务不中断

#### 为什么需要配置?

OpenClaw 自己不提供大模型,它就是个管理工具。就像微信不给你手机信号,但可以通过手机信号发消息一样。你得接入大模型服务,OpenClaw 才能真正干活。

#### 常见误解

**误解 1:** "OpenClaw 自己就是大模型"
- ❌ 错!OpenClaw 只是管理工具
- ✅ 对:得接入第三方大模型

**误解 2:** "配置很复杂,得懂编程"
- ❌ 错!其实就是填几个参数
- ✅ 对:复制粘贴就行,不用编程

**误解 3:** "国外模型比国内模型好"
- ❌ 错!国内模型很多方面已经超过国外了
- ✅ 对:国内模型更适合国内用户,网络快、免费多、中文好

---

### 步骤 2:选个国内大模型

#### 目标
从 12 个国内大模型里挑一个,别纠结,先用推荐的两个。

#### 新手推荐

**首选 1:Qwen(通义千问)**

推荐理由:
- ✅ **免费额度最多**:每天 2000 次免费请求
- ✅ **配置最简单**:OAuth 一键认证,不用 API Key
- ✅ **代码能力强**:Qwen Coder 专门为编程优化
- ✅ **文档完善**:官方文档写得明白,社区还挺活跃

适合场景:
- 编程开发
- 新手入门
- 预算有限

**首选 2:GLM-4(智谱 AI)**

推荐理由:
- ✅ **中文说得最好**:专门针对中文优化
- ✅ **稳定靠谱**:企业级服务,运行稳定
- ✅ **版本多**:glm-5、glm-4.7、glm-4.6 等等
- ✅ **新用户免费**:注册后有一定免费额度

适合场景:
- 中文对话
- 企业应用
- 生产环境

#### 其他模型快速了解

如果你对其他模型感兴趣,这里有个简单介绍:

| 模型 | 免费额度 | 特点 | 适合场景 |
|------|---------|------|---------|
| **DeepSeek** | 新用户免费 | 数学推理最强、代码生成好、性价比高 | 数学、编程、逻辑分析 |
| **Kimi** | 新用户免费 | 超长上下文(1M token)、文档理解强 | 长文档分析、合同解读 |
| **文心一言** | 新用户免费 | 百度出品、企业级服务、生态完善 | 企业应用、中文对话 |
| **Yi(零一万物)** | Yi Spark 完全免费 | 性价比高、多规格选择 | 通用场景、轻量任务 |
| **豆包** | 新用户免费 | 字节出品、中文优化好、上下文 128K | 中文对话、长文档处理 |
| **MiniMax** | 新用户免费 | 创意能力强、支持角色扮演 | 创意写作、角色扮演 |
| **混元** | 新用户免费 | 腾讯出品、生态完善、内容安全 | 企业应用、内容审核 |
| **日日新** | 企业级 | 商汤出品、多模态、视觉分析 | 多模态、视觉分析 |
| **360 智脑** | 新用户免费 | 安全能力强、搜索增强 | 安全、内容审核 |
| **星火大模型** | 新用户免费 | 科大讯飞出品、语音交互强 | 语音交互、多模态 |

#### 新手建议:别纠结!

很多新手会在选模型上花好多时间,纠结"哪个模型最好"。

**我的建议:**
1. **先用推荐的**:Qwen 或 GLM-4,这两个都挺稳的
2. **边用边试**:用一段时间,看哪个更适合你
3. **随时能换**:配置多个模型,Falover 自动切
4. **组合着用**:不同任务用不同模型,效率更高

**记住:** 没有绝对的"最好"模型,只有"最适合你"的模型。

---

### 步骤 3:获取 API Key

#### 目标
给选的模型搞个访问密钥(API Key),跟拿手机号一样简单。

#### 不同模型的获取方式

**方式 1:Qwen Portal(OAuth 免费认证)**

Qwen Portal 提供最简单的认证方式——OAuth,不用 API Key。

```bash
# 步骤 1:启用 OAuth 插件
openclaw plugins enable qwen-portal-auth

# 步骤 2:登录认证(会自动打开浏览器)
openclaw models auth login --provider qwen-portal --set-default

# 预期输出:
# ✓ 已登录 qwen-portal
# ✓ 每天免费 2000 次请求
# ✓ OAuth token 已自动配置

# 步骤 3:测试连接
openclaw chat "测试连接"

# 预期输出:
# 你好!我是通义千问,今天有什么可以帮你的吗?
```

**优点:**
- ✅ 最简单,一键认证
- ✅ 免费 2000 次/天
- ✅ 不用管 API Key

---

**方式 2:GLM-4(API Key 认证)**

GLM-4 需要搞个 API Key。

```bash
# 步骤 1:注册智谱 AI 账号
# 访问 https://open.bigmodel.cn/
# 用手机号注册(国内用户很方便)

# 步骤 2:进控制台,创建 API Key
# 路径:控制台 -> API Key -> 创建新的 API Key
# 复制生成的 API Key(只显示一次,务必保存!)

# 步骤 3:配置环境变量
# 编辑 ~/.bashrc 或 ~/.zshrc
export ZAI_API_KEY="your-api-key-here"

# 步骤 4:让配置生效
source ~/.bashrc  # 或 source ~/.zshrc

# 步骤 5:验证配置
echo $ZAI_API_KEY

# 预期输出:
# sk-your-api-key-here
```

**注意事项:**
- ⚠️ API Key 只显示一次,务必复制保存
- ⚠️ 别泄露 API Key,别提交到代码仓库
- ⚠️ 定期换 API Key(建议每个月一次)

---

**方式 3:DeepSeek(API Key 认证)**

```bash
# 步骤 1:注册 DeepSeek 账号
# 访问 https://platform.deepseek.com/
# 用邮箱注册

# 步骤 2:进控制台,创建 API Key
# 路径:API Keys -> Create new key
# 复制 API Key

# 步骤 3:配置环境变量
export DEEPSEEK_API_KEY="your-api-key-here"

# 步骤 4:让配置生效
source ~/.bashrc

# 步骤 5:验证配置
echo $DEEPSEEK_API_KEY
```

---

**方式 4:其他模型**

其他模型的 API Key 获取方式差不多:

| 模型 | 注册地址 | 控制台路径 |
|------|---------|-----------|
| **文心一言** | https://cloud.baidu.com/ | 控制台 -> 千帆大模型平台 -> API Key |
| **Kimi** | https://platform.moonshot.cn/ | 控制台 -> API Keys -> 创建 Key |
| **Yi** | https://platform.01.ai/ | 控制台 -> API Key -> 创建 |
| **豆包** | https://console.volcengine.com/ | 控制台 -> 火山方舟 -> API Key |
| **MiniMax** | https://api.minimax.chat/ | 控制台 -> API Key -> 创建 |
| **混元** | https://console.cloud.tencent.com/ | 控制台 -> 混元大模型 -> API Key |
| **日日新** | https://platform.sensetime.com/ | 控制台 -> API Key -> 创建 |
| **360 智脑** | https://ai.360.cn/ | 控制台 -> API Key -> 创建 |
| **星火** | https://xinghuo.xfyun.cn/ | 控制台 -> API Key -> 创建(需要三个密钥) |

#### 常见问题

**问题 1:找不到 API Key 在哪生成?**
- 确保已经登录账号
- 找"控制台"、"API Key"、"开发者"这些词
- 如果实在找不到,看官方文档或联系客服

**问题 2:API Key 显示错误?**
- 确认复制完整,没有空格或换行
- 确认环境变量配置对不对
- 试试重新生成 API Key

**问题 3:忘记保存 API Key 怎么办?**
- API Key 只显示一次,找不回来了
- 只能重新创建新的 API Key
- 记得这次一定要保存!

---

### 步骤 4:配置 OpenClaw

#### 目标
把搞到的 API Key 配置到 OpenClaw,让 OpenClaw 能访问大模型。

#### 配置方法 1:用向导(最简单)

OpenClaw 有交互式向导,一步步带你完成配置。

```bash
# 步骤 1:启动配置向导
openclaw onboard

# 预期输出:
# 欢迎使用 OpenClaw 配置向导!
#
# 步骤 1/4:选择要配置的模型提供商
# [1] ZAI (GLM-4)
# [2] Qwen Portal (推荐新手)
# [3] DeepSeek
# [4] 其他...
#
# 请输入选项编号 (1-4):

# 输入 2(选 Qwen Portal)

# 步骤 2/4:配置认证方式
# [1] OAuth 认证(推荐)
# [2] API Key 认证
#
# 请输入选项编号 (1-2):

# 输入 1(选 OAuth)

# 步骤 3/4:OAuth 认证
# 正在打开浏览器...
# 请在浏览器中完成授权...

# 步骤 4/4:完成配置
# ✓ Qwen Portal 配置成功!
# ✓ 每天免费 2000 次请求
# ✓ 已设置为默认模型

# 现在可以开始用了!
openclaw chat "你好"
```

**优点:**
- ✅ 最简单,交互式引导
- ✅ 自动完成所有配置
- ✅ 适合完全新手

---

#### 配置方法 2:手动配置(更灵活)

如果你想完全控制配置,可以手动编辑配置文件。

```bash
# 步骤 1:编辑配置文件
# 位置:~/.openclaw/models.json

cat > ~/.openclaw/models.json << 'EOF'
{
  "env": {
    "ZAI_API_KEY": "${ZAI_API_KEY}",
    "DEEPSEEK_API_KEY": "${DEEPSEEK_API_KEY}"
  },
  "providers": {
    "zai": {
      "apiKey": "${ZAI_API_KEY}"
    },
    "deepseek": {
      "apiKey": "${DEEPSEEK_API_KEY}"
    }
  },
  "agents": {
    "defaults": {
      "model": {
        "primary": "zai/glm-4",
        "fallback": ["deepseek-chat"]
      }
    }
  }
}
EOF

# 步骤 2:验证配置文件
cat ~/.openclaw/models.json

# 预期输出:
# {
#   "env": {
#     "ZAI_API_KEY": "${ZAI_API_KEY}",
#     "DEEPSEEK_API_KEY": "${DEEPSEEK_API_KEY}"
#   },
#   "providers": {
#     "zai": {
#       "apiKey": "${ZAI_API_KEY}"
#     },
#     "deepseek": {
#       "apiKey": "${DEEPSEEK_API_KEY}"
#     }
#   },
#   "agents": {
#     "defaults": {
#       "model": {
#         "primary": "zai/glm-4",
#         "fallback": ["deepseek-chat"]
#       }
#     }
#   }
# }

# 步骤 3:重启 Gateway
openclaw gateway restart

# 预期输出:
# ✓ Gateway 已停止
# ✓ Gateway 已启动
# ✓ 配置已重新加载
```

**配置说明:**
- `env`: 定义环境变量
- `providers`: 配置各个提供商的 API Key
- `agents`: 配置默认用的模型(primary 是主模型,fallback 是备用模型)

---

#### 配置方法 3:用命令行工具(快速配置)

OpenClaw 提供了命令行工具,可以快速配置。

```bash
# 步骤 1:配置 Provider
openclaw config set providers.zai.apiKey "${ZAI_API_KEY}"

# 预期输出:
# ✓ Provider zai configured successfully

# 步骤 2:添加主模型
openclaw model add primary zai/glm-4

# 预期输出:
# ✓ Model zai/glm-4 set as primary

# 步骤 3:添加备用模型
openclaw model add fallback deepseek-chat

# 预期输出:
# ✓ Model deepseek-chat added to fallback

# 步骤 4:查看配置
openclaw config get

# 预期输出:
# {
#   "providers": {
#     "zai": {
#       "apiKey": "***"
#     }
#   },
#   "agents": {
#     "defaults": {
#       "model": {
#         "primary": "zai/glm-4",
#         "fallback": ["deepseek-chat"]
#       }
#     }
#   }
# }

# 步骤 5:重启 Gateway
openclaw gateway restart
```

---

#### 测试配置

配置完了,一定要测试连接正不正常。

```bash
# 方法 1:用 chat 命令测试
openclaw chat "你好,请介绍一下你自己"

# 预期输出:
# 你好!我是由智谱 AI 训练的 GLM-4 大语言模型。我可以帮助你解答问题、撰写文章、编写代码等。有什么可以帮你的吗?

# 方法 2:测试特定模型
openclaw models test zai/glm-4

# 预期输出:
# ✓ Testing model: zai/glm-4
# ✓ Model is healthy
# ✓ Response time: 234ms
# ✓ Success!

# 方法 3:查看所有模型
openclaw models list

# 预期输出:
# Configured models:
# Primary: zai/glm-4
# Fallback: deepseek-chat
#
# Available models:
# - zai/glm-4
# - zai/glm-4.7
# - deepseek-chat
# - deepseek-coder
```

#### 常见问题

**问题 1:配置后还是用不上?**
- 确认已经重启 Gateway:`openclaw gateway restart`
- 确认环境变量配置对不对:`echo $ZAI_API_KEY`
- 看日志排查问题:`openclaw gateway logs`

**问题 2:API Key 错误?**
- 确认 API Key 复制完整,没有空格
- 确认环境变量配置对不对
- 试试重新生成 API Key

**问题 3:网络连接问题?**
- 国内模型不用代理,直接访问就行
- 检查网络连接是不是正常
- 如果用国外模型,可能需要配置代理

---

### 步骤 5:配置多个模型(可选,但推荐)

#### 目标
配置多个模型作为备用,实现 Failover 容错机制,确保服务稳定。

#### 为什么需要多个模型?

想象一下:
- 如果只有一个模型,这个模型挂了,你的服务就完全断了
- 如果有多个模型,主模型挂了,自动切换到备用的,服务不受影响

**生产环境必须配置多个模型!**

#### 配置 Failover

```bash
# 步骤 1:编辑配置文件
cat > ~/.openclaw/models.json << 'EOF'
{
  "env": {
    "ZAI_API_KEY": "${ZAI_API_KEY}",
    "DEEPSEEK_API_KEY": "${DEEPSEEK_API_KEY}",
    "MOONSHOT_API_KEY": "${MOONSHOT_API_KEY}"
  },
  "agents": {
    "defaults": {
      "model": {
        "primary": "zai/glm-4",
        "fallback": [
          "deepseek-chat",
          "moonshot-v1-128k"
        ]
      }
    },
    "failoverPolicy": {
      "maxRetries": 3,
      "initialBackoffMs": 1000,
      "backoffMultiplier": 2.0,
      "maxBackoffMs": 30000
    }
  }
}
EOF

# 步骤 2:重启 Gateway
openclaw gateway restart

# 步骤 3:查看 Failover 状态
openclaw models failover status

# 预期输出:
# Failover status:
# Primary model: zai/glm-4
# Fallback models:
#   1. deepseek-chat
#   2. moonshot-v1-128k
#
# Failover policy:
#   Max retries: 3
#   Initial backoff: 1000ms
#   Backoff multiplier: 2.0
#   Max backoff: 30000ms
#
# Triggered: 0 times (since gateway restart)
```

**配置说明:**
- `primary`: 主模型(优先用这个)
- `fallback`: 备用模型列表(按顺序试)
- `failoverPolicy`: Failover 策略
  - `maxRetries`: 最多重试几次
  - `initialBackoffMs`: 初始等待时间(毫秒)
  - `backoffMultiplier`: 等待时间倍数(每次失败后等待时间翻倍)
  - `maxBackoffMs`: 最长等待时间(毫秒)

---

#### 按任务选择不同模型

不同任务可以用不同的模型,优化性能和成本。

```bash
# 步骤 1:编辑配置文件
cat > ~/.openclaw/models.json << 'EOF'
{
  "env": {
    "ZAI_API_KEY": "${ZAI_API_KEY}",
    "DEEPSEEK_API_KEY": "${DEEPSEEK_API_KEY}",
    "MOONSHOT_API_KEY": "${MOONSHOT_API_KEY}"
  },
  "agents": {
    "defaults": {
      "model": {
        "primary": "zai/glm-4",
        "fallback": ["deepseek-chat"]
      }
    },
    "coding": {
      "model": {
        "primary": "qwen-portal/coder-model",
        "fallback": ["deepseek-coder"]
      },
      "systemPrompt": "你是专业的编程助手,擅长多种编程语言",
      "temperature": 0.2
    },
    "document-analyzer": {
      "model": {
        "primary": "moonshot-v1-128k",
        "fallback": ["zai/glm-4"]
      },
      "systemPrompt": "你是专业的文档分析助手,擅长理解和总结长文档",
      "temperature": 0.3
    },
    "math-tutor": {
      "model": {
        "primary": "deepseek-chat",
        "fallback": ["zai/glm-4"]
      },
      "systemPrompt": "你是专业的数学老师,擅长数学推理和讲解",
      "temperature": 0.1
    }
  }
}
EOF

# 步骤 2:重启 Gateway
openclaw gateway restart

# 步骤 3:测试不同的 Agent
# 编程任务
openclaw chat --agent coding "用 Python 写一个快速排序算法"

# 文档分析任务
openclaw chat --agent document-analyzer "分析以下文档的主要内容..."

# 数学推理任务
openclaw chat --agent math-tutor "解释一下微积分的基本概念"
```

**Agent 配置说明:**
- `model`: 用的模型
- `systemPrompt`: 系统提示词(设置模型的角色和行为)
- `temperature`: 温度参数(控制输出的随机性)
  - 0.0-0.3: 确定性输出(编程、数学)
  - 0.4-0.7: 平衡输出(对话、写作)
  - 0.8-1.0: 创意输出(创意写作、头脑风暴)

---

#### Failover 怎么工作

当主模型出问题时,Failover 机制会自动切换到备用模型:

```
场景:主模型 zai/glm-4 出故障

第 1 次尝试:
  → 请求主模型 zai/glm-4
  → 失败(超时或 5xx 错误)
  → 等待 1000ms

第 2 次尝试:
  → 请求主模型 zai/glm-4
  → 失败(超时或 5xx 错误)
  → 等待 2000ms (1000ms × 2.0)

第 3 次尝试:
  → 请求主模型 zai/glm-4
  → 失败(超时或 5xx 错误)
  → 等待 4000ms (2000ms × 2.0)

第 4 次尝试:
  → 切换到备用模型 deepseek-chat
  → 成功!
  → 返回结果
```

**Failover 什么时候触发:**
- ✅ 网络错误(连接超时、DNS 解析失败)
- ✅ API 错误(5xx 服务器错误)
- ✅ 速率限制(HTTP 429)
- ✅ 服务不可用(503 Service Unavailable)
- ✅ 请求超时

---

### 步骤 6:开始使用

#### 目标
测试配置成不成功,开始用 OpenClaw。

#### 基础对话测试

```bash
# 测试 1:简单对话
openclaw chat "你好,请介绍一下你自己"

# 预期输出:
# 你好!我是由智谱 AI 训练的 GLM-4 大语言模型。我可以帮助你解答问题、撰写文章、编写代码等。有什么可以帮你的吗?

# 测试 2:代码生成
openclaw chat "用 Python 写一个计算斐波那契数列的函数"

# 预期输出:
# ```python
# def fibonacci(n):
#     if n <= 0:
#         return []
#     elif n == 1:
#         return [0]
#     elif n == 2:
#         return [0, 1]
#
#     fib = [0, 1]
#     for i in range(2, n):
#         fib.append(fib[i-1] + fib[i-2])
#     return fib
# ```
#
# 这个函数会生成一个包含前 n 个斐波那契数的列表。

# 测试 3:翻译
openclaw chat "将以下英文翻译成中文:Artificial Intelligence is transforming the world."

# 预期输出:
# 人工智能正在改变世界。

# 测试 4:创意写作
openclaw chat "写一个关于未来城市的小故事,100 字左右"

# 预期输出:
# 2084 年的新东京,悬浮汽车在空中穿梭,全息广告牌闪烁着绚丽的光芒。机器人小贩热情地兜售着合成食物,而人类早已习惯了与 AI 共生的生活。在这里,科技不再是冰冷的工具,而是温暖的陪伴。
```

---

#### 查看使用统计

```bash
# 查看模型使用统计
openclaw models stats

# 预期输出:
# Model usage statistics:
#
# zai/glm-4:
#   Total requests: 123
#   Successful: 120
#   Failed: 3
#   Success rate: 97.56%
#   Total tokens: 45,678
#   Total cost: ¥0.46
#
# deepseek-chat:
#   Total requests: 5
#   Successful: 5
#   Failed: 0
#   Success rate: 100%
#   Total tokens: 1,234
#   Total cost: ¥0.00
#
# Total:
#   Total requests: 128
#   Successful: 125
#   Failed: 3
#   Success rate: 97.66%
#   Total tokens: 46,912
#   Total cost: ¥0.46
```

---

#### 查看 Failover 触发情况

```bash
# 查看 Failover 触发记录
openclaw models failover logs

# 预期输出:
# Failover logs (last 10):
#
# 2026-03-19 10:23:45
#   Triggered by: timeout
#   Model: zai/glm-4
#   Switched to: deepseek-chat
#   Status: success
#
# 2026-03-19 09:45:23
#   Triggered by: 5xx error
#   Model: zai/glm-4
#   Switched to: deepseek-chat
#   Status: success
#
# Total triggered: 2 times
```

---

#### 查看日志排查问题

如果遇到问题,看日志能帮你快速定位。

```bash
# 查看最近 20 行日志
openclaw gateway logs --tail 20

# 预期输出:
# [2026-03-19 10:23:45] INFO  Request to zai/glm-4 succeeded
# [2026-03-19 10:23:23] WARN  Request to zai/glm-4 timeout, switching to deepseek-chat
# [2026-03-19 10:23:12] INFO  Request to zai/glm-4 started
# [2026-03-19 10:22:56] INFO  Gateway is running
# [2026-03-19 10:22:55] INFO  Configuration loaded
# [2026-03-19 10:22:55] INFO  Starting OpenClaw Gateway...
# [2026-03-19 10:22:54] INFO  OpenClaw v2.0.0

# 查看完整日志
openclaw gateway logs

# 导出日志到文件
openclaw gateway logs > ~/openclaw-logs.txt
```

---

## 验证结果

#### 怎么验证配置成功?

配置完了,按以下步骤验证:

```bash
# 验证步骤 1:检查 Gateway 是不是在跑
openclaw gateway status

# 预期输出:
# Gateway is running
# PID: 12345
# Uptime: 2 hours 34 minutes

# 验证步骤 2:查看配置的模型
openclaw models get

# 预期输出:
# Primary model: zai/glm-4
# Fallback models:
#   - deepseek-chat
#   - moonshot-v1-128k

# 验证步骤 3:测试主模型
openclaw models test zai/glm-4

# 预期输出:
# ✓ Testing model: zai/glm-4
# ✓ Model is healthy
# ✓ Response time: 234ms
# ✓ Success!

# 验证步骤 4:测试备用模型
openclaw models test deepseek-chat

# 预期输出:
# ✓ Testing model: deepseek-chat
# ✓ Model is healthy
# ✓ Response time: 189ms
# ✓ Success!

# 验证步骤 5:发送测试对话
openclaw chat "测试连接,请回复'配置成功'"

# 预期输出:
# 配置成功
```

---

#### 成功标志

如果以上步骤都成功了,说明配置没问题!你应该能看到:

✅ Gateway 正在运行
✅ 模型配置正确
✅ 所有模型都健康
✅ 对话正常响应
✅ 没有错误日志

---

#### 如果失败了怎么办?

如果验证失败,按以下步骤排查:

**1. 检查日志**
```bash
openclaw gateway logs --tail 50
```

**2. 检查环境变量**
```bash
echo $ZAI_API_KEY
```

**3. 检查配置文件**
```bash
cat ~/.openclaw/models.json
```

**4. 测试网络连接**
```bash
ping api.bigmodel.cn
```

**5. 重启 Gateway**
```bash
openclaw gateway restart
```

如果还是解决不了,看"常见问题"部分或者找社区帮忙。

---

## 常见问题

### 问题 1:配置后还是用不上

**现象:**
配置完了,运行 `openclaw chat` 命令,提示"未配置模型"或"模型不可用"。

**原因:**
1. Gateway 没重启,配置没生效
2. 环境变量没配置对
3. API Key 配置错了或无效
4. 配置文件格式错了

**解决方案:**

```bash
# 步骤 1:重启 Gateway(最常见的问题)
openclaw gateway restart

# 步骤 2:检查环境变量
echo $ZAI_API_KEY

# 如果为空,重新配置:
export ZAI_API_KEY="your-api-key-here"
source ~/.bashrc

# 步骤 3:验证 API Key
openclaw models test zai/glm-4

# 如果失败,检查 API Key 对不对

# 步骤 4:检查配置文件
cat ~/.openclaw/models.json

# 如果格式错了,重新编辑

# 步骤 5:看日志
openclaw gateway logs --tail 50
```

**预防措施:**
- 配置完务必重启 Gateway
- 用环境变量存储 API Key,别硬编码
- 配置完马上测试,验证对不对

---

### 问题 2:API Key 错误

**现象:**
提示"API Key 无效"或"认证失败"(HTTP 401)。

**原因:**
1. API Key 复制不完整,有空格或换行
2. API Key 过期或被撤销了
3. API Key 类型不对(比如用测试环境的 Key 访问生产环境)

**解决方案:**

```bash
# 步骤 1:检查 API Key 对不对
echo $ZAI_API_KEY

# 如果为空或格式不对,重新配置:
export ZAI_API_KEY="your-api-key-here"

# 步骤 2:测试 API Key
openclaw models test zai/glm-4

# 步骤 3:如果 API Key 无效,重新生成
# 访问模型服务商控制台,生成新的 API Key

# 步骤 4:更新环境变量
export ZAI_API_KEY="new-api-key-here"

# 步骤 5:重启 Gateway
openclaw gateway restart
```

**预防措施:**
- API Key 只显示一次,务必保存
- 别在代码或配置文件里硬编码 API Key
- 定期换 API Key(建议每月一次)
- 用环境变量存储 API Key

---

### 问题 3:网络连接问题

**现象:**
提示"连接超时"或"网络错误"。

**原因:**
1. 网络连接不稳定
2. 模型服务商服务器故障
3. 如果用国外模型,可能需要配置代理

**解决方案:**

```bash
# 步骤 1:测试网络连接
ping api.bigmodel.cn

# 如果 ping 不通,检查网络连接

# 步骤 2:看日志
openclaw gateway logs --tail 50

# 找具体的网络错误信息

# 步骤 3:如果用国外模型,配置代理
export HTTP_PROXY="http://proxy.example.com:8080"
export HTTPS_PROXY="http://proxy.example.com:8080"

# 步骤 4:重启 Gateway
openclaw gateway restart

# 步骤 5:配置 Failover
# 如果某个模型连接不稳定,配置备用模型
cat > ~/.openclaw/models.json << 'EOF'
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "zai/glm-4",
        "fallback": ["deepseek-chat", "moonshot-v1-128k"]
      }
    }
  }
}
EOF

openclaw gateway restart
```

**预防措施:**
- 国内用户优先用国内模型(不用代理)
- 配置多个模型,实现 Failover 容错
- 监控模型服务的健康状态

---

### 问题 4:免费额度用完了怎么办?

**现象:**
提示"速率限制"或"免费额度已用完"(HTTP 429)。

**原因:**
免费额度用完了,不能继续用了。

**解决方案:**

```bash
# 方案 1:等第二天恢复
# Qwen 的免费额度每天 2000 次,第二天会重置

# 方案 2:配置多个模型,混合着用
cat > ~/.openclaw/models.json << 'EOF'
{
  "env": {
    "ZAI_API_KEY": "${ZAI_API_KEY}",
    "DEEPSEEK_API_KEY": "${DEEPSEEK_API_KEY}",
    "YI_API_KEY": "${YI_API_KEY}"
  },
  "agents": {
    "defaults": {
      "model": {
        "primary": "qwen-portal/coder-model",
        "fallback": ["yi-spark", "deepseek-chat"]
      }
    }
  }
}
EOF

# Yi Spark 完全免费,可以作为备选

# 方案 3:启用缓存,减少重复请求
cat > ~/.openclaw/models.json << 'EOF'
{
  "cache": {
    "enabled": true,
    "type": "redis",
    "host": "localhost",
    "port": 6379,
    "ttl": 3600
  }
}
EOF

# 方案 4:付费使用
# 访问模型服务商控制台,充值或购买套餐

# 步骤 5:监控使用量,及时发现问题
openclaw models stats
```

**预防措施:**
- 配置多个模型,避免单点限制
- 启用缓存,减少重复请求
- 优化 Prompt,减少 Token 使用
- 监控使用量,及时调整

---

### 问题 5:哪个模型最好?

**现象:**
纠结该选哪个模型,不知道哪个最好。

**原因:**
没有绝对的"最好"模型,只有"最适合你"的模型。

**解决方案:**

**按场景选:**

| 场景 | 推荐模型 | 理由 |
|------|---------|------|
| 编程 | Qwen Coder, DeepSeek Coder | 代码能力强,免费额度高 |
| 对话 | GLM-4, DeepSeek Chat | 中文理解强,逻辑推理强 |
| 长文档 | Kimi | 1M token 超长上下文 |
| 数学 | DeepSeek | 数学推理最强 |
| 创意 | GLM-4, MiniMax | 创造性文本生成 |

**按用户类型选:**

| 用户类型 | 推荐模型 | 理由 |
|---------|---------|------|
| 新手 | Qwen Portal | 免费、简单、功能全 |
| 个人开发者 | Qwen + DeepSeek | 免费主模型 + 高性价比备选 |
| 小型团队 | Qwen + DeepSeek + GLM | 免费 + 性价比 + 稳定 |
| 企业用户 | GLM + Qianfan + DeepSeek | 稳定 + 生态 + 性价比 |

**配置建议:**

```bash
# 别纠结,先用推荐的!
# 配置多个模型,Falover 自动切换

cat > ~/.openclaw/models.json << 'EOF'
{
  "env": {
    "ZAI_API_KEY": "${ZAI_API_KEY}",
    "DEEPSEEK_API_KEY": "${DEEPSEEK_API_KEY}",
    "MOONSHOT_API_KEY": "${MOONSHOT_API_KEY}"
  },
  "agents": {
    "defaults": {
      "model": {
        "primary": "qwen-portal/coder-model",
        "fallback": ["deepseek-chat", "zai/glm-4"]
      }
    }
  }
}
EOF
```

**核心建议:**
- 先用推荐的,别纠结
- 配置多个模型,Falover 自动选最优的
- 边用边试,根据实际体验调整
- 不同任务用不同模型

---

### 问题 6:怎么切换模型?

**现象:**
想临时或永久切换到另一个模型。

**解决方案:**

**方法 1:临时切换(单次请求)**

```bash
# 指定用某个模型
openclaw chat --model deepseek-chat "你好"

# 用指定的 Agent
openclaw chat --agent coding "写一个 Python 函数"
```

**方法 2:永久切换(修改配置)**

```bash
# 步骤 1:编辑配置文件
cat > ~/.openclaw/models.json << 'EOF'
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "deepseek-chat",  # 修改这里
        "fallback": ["zai/glm-4", "qwen-chat"]
      }
    }
  }
}
EOF

# 步骤 2:重启 Gateway
openclaw gateway restart

# 步骤 3:验证
openclaw models get
```

**方法 3:用命令行工具快速切换**

```bash
# 切换主模型
openclaw model set primary deepseek-chat

# 预期输出:
# ✓ Primary model set to deepseek-chat

# 添加备用模型
openclaw model add fallback qwen-chat

# 预期输出:
# ✓ Model qwen-chat added to fallback

# 删除备用模型
openclaw model remove fallback moonshot-v1-128k

# 预期输出:
# ✓ Model moonshot-v1-128k removed from fallback
```

---

### 问题 7:怎么查看用量?

**现象:**
想知道自己用了多少 tokens,花了多少钱。

**解决方案:**

```bash
# 查看使用统计
openclaw models stats

# 预期输出:
# Model usage statistics:
#
# zai/glm-4:
#   Total requests: 1234
#   Successful: 1200
#   Failed: 34
#   Success rate: 97.24%
#   Total tokens: 456,789
#   Total cost: ¥4.57
#
# deepseek-chat:
#   Total requests: 567
#   Successful: 567
#   Failed: 0
#   Success rate: 100%
#   Total tokens: 123,456
#   Total cost: ¥0.12
#
# Total:
#   Total requests: 1801
#   Successful: 1767
#   Failed: 34
#   Success rate: 98.11%
#   Total tokens: 580,245
#   Total cost: ¥4.69

# 查看特定模型的统计
openclaw models stats zai/glm-4

# 导出统计报告
openclaw models stats --output ~/usage-report.txt
```

**监控成本:**

```bash
# 设置成本告警(脚本示例)
#!/bin/bash

# cost-alert.sh

DAILY_BUDGET=10.0  # 日预算 10 元

# 获取今日成本
TODAY_COST=$(openclaw models stats | jq '.totalCost')

# 检查是不是超过预算
if (( $(echo "$TODAY_COST > $DAILY_BUDGET" | bc -l) )); then
  echo "警告:今日成本已超过预算!"
  echo "今日成本: ¥$TODAY_COST"
  echo "预算: ¥$DAILY_BUDGET"
  # 发送告警邮件或消息
fi
```

---

### 问题 8:怎么配置容错?

**现象:**
担心模型服务故障导致服务中断,想配置容错机制。

**解决方案:**

**配置 Failover(推荐)**

```bash
# 步骤 1:配置多个模型
cat > ~/.openclaw/models.json << 'EOF'
{
  "env": {
    "ZAI_API_KEY": "${ZAI_API_KEY}",
    "DEEPSEEK_API_KEY": "${DEEPSEEK_API_KEY}",
    "MOONSHOT_API_KEY": "${MOONSHOT_API_KEY}",
    "OPENAI_API_KEY": "${OPENAI_API_KEY}"
  },
  "agents": {
    "defaults": {
      "model": {
        "primary": "zai/glm-4",
        "fallback": [
          "deepseek-chat",
          "moonshot-v1-128k",
          "openai/gpt-4"
        ]
      }
    },
    "failoverPolicy": {
      "maxRetries": 5,
      "initialBackoffMs": 1000,
      "backoffMultiplier": 2.0,
      "maxBackoffMs": 30000
    }
  }
}
EOF

# 步骤 2:重启 Gateway
openclaw gateway restart

# 步骤 3:测试 Failover
# 模拟主模型故障,看是不是自动切换到备用模型
```

**Failover 策略说明:**

- `maxRetries`: 最多重试几次
- `initialBackoffMs`: 初始等待时间(毫秒)
- `backoffMultiplier`: 等待时间倍数(每次失败后等待时间翻倍)
- `maxBackoffMs`: 最长等待时间(毫秒)

**健康检查(推荐)**

```bash
# 创建健康检查脚本
cat > ~/healthcheck.sh << 'EOF'
#!/bin/bash

models=("zai/glm-4" "deepseek-chat" "moonshot-v1-128k")

for model in "${models[@]}"; do
  echo "Testing $model..."
  if openclaw models test "$model"; then
    echo "✓ $model is healthy"
  else
    echo "✗ $model is unhealthy"
    # 发送告警
    echo "模型 $model 不健康,请检查!" | mail -s "模型健康检查告警" your-email@example.com
  fi
done
EOF

# 添加执行权限
chmod +x ~/healthcheck.sh

# 设置定时任务(每 5 分钟检查一次)
crontab -e

# 添加以下行:
# */5 * * * * ~/healthcheck.sh
```

**监控告警**

```bash
# 查看 Failover 触发情况
openclaw models failover status

# 如果 Failover 频繁触发,说明主模型不稳定,需要检查
```

**最佳实践:**

- ✅ 配置至少 3 个备用模型
- ✅ 混合用国内外模型
- ✅ 设置合理的重试策略
- ✅ 配置健康检查,定期检查模型状态
- ✅ 监控 Failover 触发情况,及时发现问题

---

## 下一步

恭喜你!你已经成功给 OpenClaw 接入大模型了。接下来可以:

### 1. 接入飞书/微信等渠道

把 OpenClaw 接入到日常用的通讯工具,随时随地用 AI。

```bash
# 安装飞书插件
openclaw plugins install channel-feishu

# 配置飞书应用
openclaw config set channels.feishu.appId "your-app-id"
openclaw config set channels.feishu.appSecret "your-app-secret"

# 启动飞书渠道
openclaw channels start feishu
```

### 2. 学习 Prompt 优化

写高质量的 Prompt,能让 AI 给出更好的回答。

**Prompt 优化技巧:**
- 简洁明了,避免冗余
- 用明确的指令
- 提供足够的上下文
- 设置合理的温度参数
- 用系统提示词定义角色

### 3. 配置多个模型容错

(已经在本文中介绍)
配置 Failover,确保服务稳定可靠。

### 4. 高级配置

探索 OpenClaw 的高级功能,发挥系统的最大潜力。

**高级功能:**
- **Agent 配置**: 为不同任务配置专用的 Agent
- **工具集成**: 接入外部工具,扩展 AI 的能力
- **缓存配置**: 减少 API 调用,降低成本
- **监控告警**: 实时监控系统状态,及时发现问题
- **容器化部署**: 用 Docker 部署,便于管理和扩展

### 5. 探索更多模型

试试更多国内大模型,找到最适合你的那个。

**值得试的模型:**
- **DeepSeek**: 数学推理强,性价比高
- **Kimi**: 超长上下文,长文档处理首选
- **MiniMax**: 创意写作,角色扮演
- **Yi**: 性价比高,多规格选择

---

## 参考资源

### 官方文档

- [OpenClaw 官方文档](https://docs.openclaw.ai/)
  - Model Providers: https://docs.openclaw.ai/concepts/model-providers
  - Model Failover: https://docs.openclaw.ai/concepts/model-failover
  - Gateway 配置: https://docs.openclaw.ai/concepts/gateway
  - CLI 工具: https://docs.openclaw.ai/cli/overview

### 国内模型官方文档

- [Qwen (通义千问)](https://help.aliyun.com/zh/dashscope/)
- [GLM (智谱 AI)](https://open.bigmodel.cn/dev/api)
- [文心一言 (千帆)](https://cloud.baidu.com/doc/WENXINWORKSHOP/index.html)
- [DeepSeek](https://platform.deepseek.com/api-docs/)
- [Kimi (月之暗面)](https://platform.moonshot.cn/docs/intro)
- [Yi (零一万物)](https://platform.01.ai/docs)
- [豆包](https://www.volcengine.com/docs/82379)
- [MiniMax](https://api.minimax.chat/document/guides/chat)
- [混元](https://cloud.tencent.com/document/product/1729)
- [星火大模型](https://www.xfyun.cn/doc/spark/HTTP.html)

### 社区资源

- [OpenClaw GitHub](https://github.com/openclaw-ai/openclaw)
- [OpenClaw Discord](https://discord.gg/openclaw)
- [OpenClaw 知识库](https://kb.openclaw.ai/)

### 学习资源

- [Prompt 编程指南](https://www.promptingguide.ai/zh)
- [AI 应用开发教程](https://learnprompting.org/zh)
- [大模型最佳实践](https://github.com/e2b-dev/awesome-llm-apps)

---

## 总结

本文带你一步步完成了 OpenClaw 接入国内大模型的全部流程:

✅ 理解了核心概念(Provider、Model、API Key、Failover)
✅ 选择了适合自己的模型(Qwen 或 GLM-4)
✅ 搞到了 API Key
✅ 配置了 OpenClaw
✅ 配置了多个模型,实现了容错
✅ 测试验证了配置
✅ 解决了常见问题

**核心要点:**

1. **从零开始**: 不用编程基础,复制粘贴就行
2. **国内大模型优先**: 免费额度多、中文优化好、网络快
3. **手把手教学**: 每个步骤都有详细说明和代码示例
4. **配置多个模型**: 实现 Failover 容错,确保服务稳定
5. **新手友好**: 用类比解释复杂概念,降低理解门槛

**最后建议:**

- 别纠结选哪个模型,先用推荐的
- 配置多个模型,Falover 自动切换
- 边用边试,根据实际体验调整
- 多看日志,及时发现问题
- 参与社区,分享你的经验

祝你用得开心!如果遇到问题,随时看官方文档或找社区帮忙。🎉
