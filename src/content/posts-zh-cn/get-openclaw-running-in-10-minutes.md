---
title: 10分钟装好能用 - OpenClaw 快速安装指南
description: 在您的机器上安装 OpenClaw 的最快路径。涵盖核心安装步骤、验证和基本配置，帮您在10分钟内启动并运行AI助手。
pubDate: 2026-03-11
lastUpdated: 2026-03-11
tags: ['installation', 'quick-start', 'beginner']
difficulty: beginner
estimatedTime: '10 minutes'
prerequisites: ['Node.js 22+', '基本终端知识']
alternates:
  en: /posts/get-openclaw-running-in-10-minutes
---

# 10分钟装好能用 - OpenClaw 快速安装指南

## Description

在您的机器上安装 OpenClaw 的最快路径。本指南涵盖核心安装步骤、验证和基本配置，帮您在10分钟内启动并运行AI助手。

## TL;DR

三行命令让 OpenClaw 跑起来：

```bash
# 1. 安装（需要 Node.js 22+）
curl -fsSL https://openclaw.ai/install.sh | bash

# 2. 运行配置向导
openclaw onboard --install-daemon

# 3. 验证安装
openclaw doctor
```

就是这样。OpenClaw 现在运行在 `http://127.0.0.1:18789/`。

**您需要**：Node.js 22+、5分钟、一个API密钥（Claude/GPT/其他）。

## 前置要求

开始之前，确保您有：

- **Node.js 22+** 已安装（[在此下载](https://nodejs.org/)）
- **包管理器**：npm（随Node.js一起）或 pnpm
- **2 GB RAM** 最低，推荐 4 GB
- **500 MB 可用磁盘空间**
- **API密钥** 来自AI提供商（推荐：[Anthropic Claude](https://console.anthropic.com/)）

### 检查 Node.js 版本

```bash
node --version
```

期望输出：`v22.0.0` 或更高。如果看到更旧版本或"命令未找到"，请先安装 Node.js 22+。

## 安装方法：选择一种

### 方法1：一键安装脚本（新手推荐）

官方安装脚本处理一切：

**macOS / Linux / WSL2:**
```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

**Windows (PowerShell):**
```powershell
iwr -useb https://openclaw.ai/install.ps1 | iex
```

这会全局安装 OpenClaw 并将 `openclaw` 命令添加到您的 PATH。

### 方法2：npm/pnpm（适合开发者）

如果您已有 Node.js 22+ 且熟悉包管理器：

**使用 npm:**
```bash
npm install -g openclaw@latest
```

**使用 pnpm（更快，推荐）:**
```bash
pnpm add -g openclaw@latest
pnpm approve-builds -g
```

### 方法3：Docker（最佳隔离）

用于生产部署或最大安全性：

```bash
# 克隆仓库
git clone https://github.com/openclaw/openclaw.git
cd openclaw

# 运行 Docker 设置
docker compose up -d
```

## 分步设置指南

### 步骤1：运行配置向导

安装后，启动设置向导：

```bash
openclaw onboard --install-daemon
```

向导会引导您完成：

1. **风险确认** - OpenClaw 可以执行真实命令，所以请理解其含义
2. **入门模式** - 选择 "QuickStart" 以最快设置
3. **API提供商** - 选择您的AI提供商（推荐 Claude）
4. **API密钥** - 粘贴您的API密钥
5. **频道选择** - 选择消息平台（Telegram/Discord/WhatsApp等）
6. **技能安装** - 安装可选工具（可以暂时跳过）
7. **Gateway启动** - 启动 OpenClaw gateway 服务

### 步骤2：配置您的API密钥

**对于 Anthropic Claude（推荐）:**

1. 从 [Anthropic Console](https://console.anthropic.com/) 获取API密钥
2. 配置期间粘贴密钥
3. 选择模型：**Claude Opus 4.6**（最适合长上下文）或 **Claude Sonnet 4.6**（更快、更便宜）

**对于 OpenAI GPT:**

1. 从 [OpenAI Platform](https://platform.openai.com/) 获取API密钥
2. 配置期间选择 "OpenAI" 作为提供商
3. 选择 GPT-4 或 GPT-4 Turbo 模型

### 步骤3：启动 Gateway

配置完成后，启动 OpenClaw gateway：

```bash
openclaw gateway --port 18789
```

Gateway 会：
- 启动控制UI dashboard
- 连接到您配置的频道
- 监听传入消息

**访问 dashboard**：在浏览器中打开 `http://127.0.0.1:18789/`。

### 步骤4：验证安装

运行内置健康检查：

```bash
openclaw doctor
```

期望输出：
```
[OK] Node.js v22.11.0 (minimum: v22.0.0)
[OK] OpenClaw v2026.2.6
[OK] Configuration file found at ~/.openclaw/.env
[OK] Anthropic API key valid (Claude model accessible)
[OK] Gateway listening on 127.0.0.1:18789
```

### 步骤5：发送测试消息

通过发送消息测试您的安装：

**通过终端:**
```bash
openclaw message send --to +1234567890 --message "Hello from OpenClaw!"
```

**通过 Dashboard:**
1. 打开 `http://127.0.0.1:18789/`
2. 点击"发送消息"
3. 输入消息并发送

**通过消息应用:**
如果您配置了 Telegram/Discord/WhatsApp，从该应用向您的机器人发送消息。

## 预期结果

当一切正常工作时：

1. **Dashboard加载** 在 `http://127.0.0.1:18789/` 无错误
2. **`openclaw doctor`** 显示所有绿色 `[OK]` 检查
3. **测试消息** 在 2-5 秒内收到AI回复
4. **Gateway状态** 显示 "running"

## 常见问题与解决方案

### 问题："需要 Node.js 22+"

**错误:**
```
Error: Node.js 22+ required. Found: v18.x.x
```

**解决方案:**
从 [nodejs.org](https://nodejs.org/) 安装 Node.js 22+ 或使用 nvm：

```bash
# 安装 nvm (macOS/Linux)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 安装并使用 Node 22
nvm install 22
nvm use 22

# 验证
node --version
```

### 问题："端口 18789 已被占用"

**错误:**
```
Error: Port 18789 already in use
```

**解决方案:**
找到并终止使用端口 18789 的进程：

```bash
# macOS/Linux
lsof -i :18789
kill -9 <PID>

# 或使用不同端口
openclaw gateway --port 18790
```

### 问题："API密钥无效或已过期"

**错误:**
```
[ERROR] ANTHROPIC_API_KEY is invalid or expired
```

**解决方案:**
1. 验证您的API密钥以 `sk-ant-`（Anthropic）或 `sk-`（OpenAI）开头
2. 检查密钥在提供商控制台中未被撤销
3. 重新配置：

```bash
openclaw configure
```

### 问题："未找到 openclaw 命令"

**错误:**
```
bash: openclaw: command not found
```

**解决方案:**
1. 重启终端/shell
2. 如果使用 npm，验证全局 bin 在 PATH 中：

```bash
# 检查 npm 全局 bin 路径
npm config get prefix

# 添加到 PATH（如果需要，添加到 ~/.bashrc 或 ~/.zshrc）
export PATH="$PATH:$(npm config get prefix)/bin"
```

3. 重新运行安装脚本

### 问题："EACCES 权限被拒绝"

**错误:**
```
Error: EACCES: permission denied
```

**解决方案:**

在 Linux/macOS 上，修复 npm 权限：

```bash
# 为全局包创建目录
mkdir ~/.npm-global

# 配置 npm 使用新目录
npm config set prefix '~/.npm-global'

# 添加到 PATH（添加到 ~/.bashrc 或 ~/.zshrc）
export PATH=~/.npm-global/bin:$PATH
```

或使用 sudo（出于安全原因不推荐）：

```bash
sudo npm install -g openclaw@latest
```

## 安全检查清单（重要！）

在使用 OpenClaw 处理真实数据之前：

- ✅ **使用Docker或专用服务器** - 如果出现问题可降低风险
- ✅ **允许列表信任的联系人** - 限制谁可以访问您的机器人
- ✅ **启用身份验证** - 不要使用 `--allow-unconfigured` 运行
- ✅ **定期轮换API密钥** - 如果密钥泄露，立即撤销
- ✅ **安装前审查技能** - 仅安装来自已知来源的信任技能
- ✅ **保持OpenClaw更新** - 定期运行 `openclaw update`

**在 `~/.openclaw/openclaw.json` 中配置允许列表**：

```json
{
  "channels": {
    "telegram": {
      "allowFrom": ["123456789", "987654321"]
    },
    "whatsapp": {
      "allowFrom": ["+1234567890"]
    }
  }
}
```

## 下一步

恭喜！OpenClaw 现在正在运行。接下来做什么：

1. **[连接第一个频道](./connect-channels)** - 集成 Telegram、WhatsApp、Discord 或其他消息平台
2. **[配置您的AI模型](./configure-models)** - 在 Claude、GPT 或本地模型之间切换
3. **[安装有用技能](./install-skills)** - 添加网页搜索、文件操作和编码工具等功能
4. **[部署到VPS](./deploy-vps)** - 从本地迁移到全天候云部署
5. **[安全加固](./security-best-practices)** - 锁定您的安装以用于生产环境

## 快速参考

```bash
# 安装
curl -fsSL https://openclaw.ai/install.sh | bash

# 设置
openclaw onboard --install-daemon

# 启动 gateway
openclaw gateway --port 18789

# 健康检查
openclaw doctor

# 打开 dashboard
openclaw dashboard

# 检查状态
openclaw gateway status

# 重启 gateway
openclaw gateway restart

# 更新 OpenClaw
openclaw update

# 重新配置
openclaw configure
```

## 故障排除提示

如果您仍然卡住：

1. **运行 `openclaw doctor`** - 内置诊断
2. **检查日志** - `~/.openclaw/logs/`
3. **查阅官方文档** - [docs.openclaw.ai](https://docs.openclaw.ai)
4. **询问社区** - [Discord](https://discord.gg/clawd) 或 [Reddit](https://reddit.com/r/openclaw)
5. **搜索 GitHub issues** - [github.com/openclaw/openclaw/issues](https://github.com/openclaw/openclaw/issues)

记住：从简单开始，彻底测试，然后扩展。不要一次尝试配置所有内容。

---

**预计完成时间**：5-10分钟
**难度级别**：初学者
**前置要求**：无（除了基本的终端知识）
