---
title: 本地安装部署 OpenClaw —— macOS 全流程
description: macOS 上完整的 OpenClaw 安装部署指南,包含 12 个常见报错的解决方案,从系统要求到成功运行的完整流程
pubDate: 2026-03-24
lastUpdated: 2026-03-24
tags: ['installation', 'macOS', 'local-deployment']
difficulty: beginner
estimatedTime: '30 minutes'
prerequisites: ['macOS 14.0+', 'Basic terminal knowledge']
category: 'installation'
order: 1
alternates:
  zhCN: /zh-cn/installation/local-mac/
---
# 本地安装部署 OpenClaw —— macOS 全流程

## 一、前言:为什么选择 macOS 部署 OpenClaw

如果你正在寻找在 macOS 上部署 OpenClaw 的完整指南,这篇文章就是为你准备的。

### macOS 的三大优势

**1. 原生架构支持**

OpenClaw 在 macOS 上提供了完整的原生支持,无论你使用的是 Apple Silicon(M1/M2/M3/M4)还是 Intel 芯片。这意味着你可以获得最佳的性能和稳定性,无需担心兼容性问题。

**2. macOS 独有功能**

macOS 版 OpenClaw 提供了一些其他平台没有的特色功能:

- **菜单栏应用**:原生 macOS 体验,可视化管理 Gateway 状态
- **iMessage 集成**:直接通过 iMessage 与 AI 助手对话
- **Voice Wake**:语音唤醒功能,"Hey OpenClaw" 即可激活

**3. Unix-like 的友好体验**

macOS 的 Unix-like 特性让开发环境的配置更加标准化,与 Linux 服务器的部署体验接近,方便后续迁移到生产环境。

### 这篇文章能帮你做什么

通过这篇文章,你将学会:

- ✅ 完整的安装流程(两种推荐方式)
- ✅ **12 个常见报错的解决方案**(核心价值)
- ✅ 验证安装成功的明确标准
- ✅ 成功运行 OpenClaw 并看到 onboard 界面和 WebUI

**文章目标单一且明确**:帮助你在 macOS 上成功安装并运行 OpenClaw,直到看到配置界面。

---

## 二、前置准备:系统要求与依赖安装

在开始安装 OpenClaw 之前,需要先确保你的 macOS 系统满足要求,并安装必要的依赖工具。

### 2.1 系统要求

#### macOS 版本

- **最低要求**:macOS Sonoma 14.0+
- **推荐版本**:macOS Sequoia 15 或更新

**检查当前系统版本**:

```bash
sw_vers
# 输出示例:
# ProductName: macOS
# ProductVersion: 15.3
# BuildVersion: 24D60
```

#### 硬件要求

| 配置等级           | 内存 (RAM) | 磁盘空间 | CPU                            | 适用场景     |
| ------------------ | ---------- | -------- | ------------------------------ | ------------ |
| **最低配置** | 2GB        | ~40GB    | 任意                           | 仅基础使用   |
| **推荐配置** | 4GB        | 40GB     | Apple Silicon M1+ 或 Intel i5+ | 日常使用     |
| **高级配置** | 8GB+       | 100GB+   | M2/M3/M4 或多核 Intel          | 本地模型运行 |

> **来源**:[OpenClaw 官方文档 - 系统要求](https://docs.openclaw.ai/install)

**重要说明**:如果你不打算运行本地 AI 模型(如 Ollama),只需要 4GB 内存就足够了。

### 2.2 安装 Xcode Command Line Tools

**为什么需要**:编译原生依赖(如 Sharp 图像处理库)。

**安装命令**:

```bash
xcode-select --install
```

**预期结果**:

- 如果已安装,会提示 "command line tools are already installed"
- 如果未安装,会弹出安装窗口,按提示完成安装

**验证安装成功**:

```bash
# 方法 1:检查开发者目录
xcode-select -p
# 应输出:/Library/Developer/CommandLineTools 或类似路径

# 方法 2:测试编译器
gcc --version
# 应显示 clang 版本信息
```

> **来源**:[Apple 官方文档 - Installing Command Line Tools](https://developer.apple.com/documentation/xcode/installing-the-command-line-tools/)

### 2.3 安装 Node.js(核心依赖)

OpenClaw 是基于 Node.js 构建的,因此这是最关键的依赖。

#### 版本要求

- **最低版本**:Node.js 22.0.0
- **推荐版本**:Node.js 22.16+ LTS(长期支持版本)
- **最新支持**:Node.js 24

> **来源**:[OpenClaw 官方文档](https://docs.openclaw.ai/install)
> "Node 24(推荐)(出于兼容性考虑,仍支持 Node 22 LTS,目前为 22.16+;如果缺失,安装脚本会安装 Node 24)"

#### 推荐安装方式:官方安装包

**下载地址**:[https://nodejs.org/](https://nodejs.org/zh-cn/download)

**优势**:

- Node.js 团队官方支持
- 自动配置 PATH
- 包含 npm

**安装步骤**:

1. 访问官网,下载 macOS 安装程序(.pkg)
2. 点击安装包,按提示完成安装
3. 打开终端,验证安装

**验证安装**:

```bash
node --version
# 应输出:v22.x.x 或更高

npm --version
# 应输出:10.x.x 或更高
```

**检查 Node.js 架构**(Apple Silicon 用户):

```bash
node -p "process.arch"
# 应输出 "arm64"(Apple Silicon)
# 或 "x64"(Intel)
```

> **来源**:[Medium - OpenClaw macOS Installation Guide](https://medium.com/@fawwazraza2026/openclaw-macos-installation-guide-set-up-a-self-hosted-ai-assistant-from-scratch-6815667ad541)

#### 替代方案:Homebrew

如果你更喜欢使用包管理器:

```bash
# 安装 Homebrew(如果未安装)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 安装 Node.js
brew install node@22

# 验证
node --version
```

**Apple Silicon 注意事项**:安装后需要添加到 PATH:

```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

> **来源**:[AlexHost - Install OpenClaw on macOS](https://alexhost.com/faq/how-to-install-openclaw-on-macos/)

### 2.4 可选但推荐的工具

#### pnpm:更快的包管理器

pnpm 比 npm 更快,且节省磁盘空间。

**安装方式**(推荐使用 Corepack):

```bash
# Corepack 随 Node.js 一起安装,只需启用
corepack enable
corepack prepare pnpm@latest --activate

# 验证
pnpm --version
```

> **来源**:[Reddit - How should I install pnpm on Mac](https://www.reddit.com/r/node/comments/1hcr2ub/how_should_i_install_pnpm_on_mac_corepack_or_brew/)

#### Git:版本控制

macOS 自带 Git,通常无需额外安装。如果需要更新:

```bash
xcode-select --install  # 也会安装 Git
```

---

## 三、安装 OpenClaw 的两种方式

OpenClaw 提供了多种安装方式,这里推荐两种最适合 macOS 用户的方法。

### 3.1 方式一:NPM 全局安装(最推荐)

**为什么推荐**:最简单、最快速、最灵活。

#### 安装步骤

**步骤 1:安装 OpenClaw**

```bash
npm install -g openclaw@latest
```

**预期输出**:

```
added 1250 packages in 45s
```

**步骤 2:批准原生依赖构建**(如果使用 pnpm)

如果使用 pnpm 安装,首次会出现 "Ignored build scripts" 警告。需要运行:

```bash
pnpm approve-builds -g
```

选择列表中的所有包(openclaw、node-llama-cpp、sharp 等)。

**步骤 3:验证安装**

```bash
openclaw --version
# 应输出:2026.x.x 或更高版本
```

#### 常见问题:`openclaw: command not found`

**原因**:npm 全局二进制目录不在 PATH 中。

**解决方案**:

```bash
# 查找 npm 全局路径
npm prefix -g
# 输出示例:/usr/local 或 /Users/你的用户名/.npm-global

# 添加到 PATH(zsh - macOS 默认)
echo 'export PATH="$(npm prefix -g)/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# 验证修复
openclaw --version
```

> **来源**:[七牛云 - OpenClaw 部署常见问题全解](https://news.qiniu.com/archives/1773281534952)

### 3.2 方式二:macOS 菜单栏应用

**适合人群**:偏好图形界面的用户。

#### 下载和安装

**方式 A:官方网站下载**

1. 访问 [https://openclaw.ai](https://openclaw.ai)
2. 进入 "Quick Start"(快速开始)部分
3. 切换到 "MacOS" 标签
4. 下载并安装应用

**方式 B:通过 CLI 安装后,应用内安装**

1. 打开 OpenClaw 应用
2. 进入 General 设置标签
3. 点击 "Install CLI"

#### 功能介绍

macOS 菜单栏应用提供以下功能:

- **Gateway 生命周期管理**:启动/停止/重启 Gateway
- **内嵌 WebChat UI**:直接在应用内聊天
- **Voice Wake**:语音唤醒功能
- **远程 Gateway 控制**:通过 SSH 控制远程 Gateway

#### 重要说明

**菜单栏应用不能完全替代 CLI**。它需要配合 CLI 工具使用,主要用于管理和监控 Gateway 状态。

> **来源**:[OpenClaw 官方文档 - macOS App](https://docs.openclaw.ai/platforms/macos)

### 3.3 两种方式对比

| 对比项             | NPM 全局安装     | macOS 菜单栏应用    |
| ------------------ | ---------------- | ------------------- |
| **安装速度** | ⚡ 快(1-2 分钟)  | 🐢 较慢(需下载应用) |
| **易用性**   | 🔧 需要命令行    | 🖱️ 图形界面友好   |
| **灵活性**   | ✅ 高(可定制)    | ⚠️ 低(功能受限)   |
| **适合人群** | 开发者、技术人员 | 新手、偏好 GUI      |
| **核心功能** | ✅ 完整          | ✅ 完整             |

**推荐选择**:

- **新手**:可以先用菜单栏应用体验,但长期建议掌握 CLI
- **开发者**:直接使用 NPM 全局安装

---

## 四、启动 OpenClaw 并访问界面

安装完成后,现在启动 OpenClaw 并访问配置界面。

### 4.1 启动 Gateway

**运行命令**:

```bash
openclaw gateway
```

**预期输出**:

```
✓ Gateway started on port 18789
✓ Control UI available at http://127.0.0.1:18789/
✓ WebSocket server listening
✓ Agent initialized: main
```

**如果输出显示端口被占用**,请参考第五节的"端口冲突"问题。

### 4.2 访问 WebUI 界面

**方法 1:直接浏览器访问**

打开浏览器,访问:

```
http://127.0.0.1:18789
```

**方法 2:使用 Dashboard 命令**

```bash
openclaw dashboard
```

这个命令会:

1. 自动打开浏览器
2. 访问 Control UI
3. 显示访问令牌

**成功标志**:

1. ✅ 浏览器成功打开 Control UI 界面
2. ✅ 看到聊天界面(消息输入框、对话历史区域)
3. ✅ 无错误提示(如 "无法连接到 Gateway")

### 4.3 进入 Onboard 配置界面

首次运行时,OpenClaw 会自动进入配置向导(Onboard)。

**配置向导会引导你完成**:

1. **风险确认**:OpenClaw 需要系统权限完成任务
2. **安装模式**:QuickStart(推荐)或自定义配置
3. **AI 模型配置**:选择 AI 模型(Claude、GPT-4、DeepSeek、Kimi 等)
4. **聊天渠道配置**:连接消息应用或暂时跳过
5. **Gateway 设置**:端口、认证模式、绑定地址
6. **技能/插件设置**:基础能力配置

**注意**:详细的配置步骤不在这篇文章的范围内。我们的目标是成功进入这个配置界面,说明安装已成功。

> **来源**:[OpenClaw 官方文档 - Onboarding Overview](https://docs.openclaw.ai/start/onboarding-overview)

---

## 五、常见报错与解决方案

这是这篇文章的核心价值部分。以下是 macOS 上安装 OpenClaw 时最常见的 12 个报错及其解决方案。

### 5.1 安装阶段常见报错

#### 报错 1:`openclaw: command not found`

**报错信息**:

```bash
zsh: command not found: openclaw
# 或
bash: openclaw: command not found
```

**根本原因**:npm 全局二进制目录不在系统 PATH 环境变量中。

**诊断步骤**:

```bash
# 查找 npm 全局路径
npm prefix -g
# 输出示例:/usr/local

# 检查 PATH
echo "$PATH"
# 查看是否包含 npm 全局 bin 目录
```

**解决方案**:

对于 **zsh**(macOS 默认):

```bash
echo 'export PATH="$(npm prefix -g)/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

对于 **bash**:

```bash
echo 'export PATH="$(npm prefix -g)/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

**验证修复**:

```bash
openclaw --version
which openclaw
```

> **来源**:[七牛云 - OpenClaw 部署常见问题全解](https://news.qiniu.com/archives/1773281534952)、[LumaDock - Troubleshooting Guide](https://lumadock.com/tutorials/openclaw-troubleshooting-common-errors)

---

#### 报错 2:Sharp 构建错误

**报错信息**:

```bash
npm ERR! sharp: Installation error: prebuild...
gyp ERR! build error
sharp: Installation error: Could not install from prebuilt binaries
```

**根本原因**:Sharp 是图像处理依赖库,需要编译原生模块。构建失败通常因为:

1. 缺少系统级依赖(libvips)
2. Homebrew 全局安装的 libvips 冲突
3. 缺少构建工具

**解决方案**:

**方法 1:强制使用预构建二进制**(推荐):

```bash
SHARP_IGNORE_GLOBAL_LIBVIPS=1 npm install -g openclaw@latest
```

**方法 2:安装 libvips 并重新构建**:

```bash
# 安装 Xcode 命令行工具(如果未安装)
xcode-select --install

# 安装 libvips
brew install vips

# 重新构建 Sharp
npm rebuild sharp

# 或重新安装 OpenClaw
npm install -g openclaw@latest
```

> **来源**:[OpenClaw Sharp Build Error Fix](https://openclawsetup.tech/blog/openclaw-sharp-node-gyp-build-error)、[GitHub Issue #4592](https://github.com/openclaw/openclaw/issues/4592)

---

#### 报错 3:权限问题 `EACCES`

**报错信息**:

```bash
npm ERR! Error: EACCES: permission denied
npm ERR! syscall: access
npm ERR! path: /usr/local/lib/node_modules
```

**根本原因**:

1. npm 全局安装目录需要 root 权限
2. 当前用户对该目录没有写入权限
3. 使用 sudo 安装导致文件所有权混乱

**诊断**:

```bash
ls -la ~/.openclaw
# 检查文件所有者
```

**解决方案**:

**方案一:修改 npm 默认目录**(推荐):

```bash
# 1. 创建全局安装目录
mkdir ~/.npm-global

# 2. 配置 npm 使用新目录
npm config set prefix '~/.npm-global'

# 3. 添加到 PATH
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
source ~/.zshrc

# 4. 重新安装 OpenClaw(无需 sudo)
npm install -g openclaw@latest
```

**方案二:修复权限**(不推荐):

```bash
sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}
```

> **来源**:[七牛云 - OpenClaw 部署常见问题全解](https://news.qiniu.com/archives/1773281534952)

---

#### 报错 4:Node.js 版本过低

**报错信息**:

```bash
npm warn EBADENGINE Unsupported engine {
  required: { node: '>=22' },
  current: { node: 'v18.x.x' }
}
```

**根本原因**:OpenClaw 要求 Node.js 22.0+。

**诊断**:

```bash
node --version
# 如果显示 v18.x.x 或更低,需要升级
```

**解决方案**:

**使用官方安装包升级**:

1. 访问 [https://nodejs.org/](https://nodejs.org/)
2. 下载 Node.js 22 LTS 或 Node.js 24
3. 安装并验证

**使用 Homebrew 升级**:

```bash
brew install node@22
brew link node@22 --force --overwrite

# 验证
node --version
```

> **来源**:OpenClaw 官方文档

---

### 5.2 启动阶段常见报错

#### 报错 5:端口冲突(18789 被占用)

**报错信息**:

```bash
Error: listen EADDRINUSE: address already in use :::18789
# 或
another gateway instance already listening
```

**根本原因**:

1. 已有 OpenClaw Gateway 实例在运行
2. 其他程序占用了 18789 端口
3. 旧的 Gateway 进程没有正常退出(僵尸进程)

**诊断步骤**:

```bash
# 查找占用端口的进程
lsof -i :18789

# 或使用 netstat
netstat -an | grep 18789
```

**解决方案**:

**方案一:杀死占用进程**:

```bash
# 查找并杀死进程
lsof -ti :18789 | xargs kill -9

# 验证端口已释放
lsof -i :18789
```

**方案二:使用其他端口**:

```bash
# 使用其他端口启动
openclaw gateway --port 18790

# 或修改配置文件
# 在 ~/.openclaw/openclaw.json 中:
{
  "gateway": {
    "port": 18790
  }
}
```

**方案三:清理僵尸进程**:

```bash
# 查找所有 OpenClaw 相关进程
ps aux | grep openclaw

# 清理 stale PID 锁文件
rm ~/.openclaw/gateway.pid

# 重启 Gateway
openclaw gateway
```

> **来源**:[YouTube - Port 18789 is already in use](https://www.youtube.com/watch?v=ZwiZS-yYmvM)、[七牛云 - OpenClaw 问题排查全指南](https://news.qiniu.com/archives/1773197728049)

---

#### 报错 6:Gateway 无限 "Starting..."

**症状**:

- `openclaw gateway status` 显示 Runtime: starting 但永不停留
- 启动后立即退出,没有明显错误信息
- 日志中显示重复的启动消息

**根本原因**:

1. 配置文件损坏或 Schema 校验失败
2. `gateway.mode` 未设置为 `local`
3. 插件加载失败导致崩溃
4. 升级后配置格式不兼容

**诊断步骤**:

```bash
# 1. 查看实时日志
openclaw logs --follow

# 2. 检查配置错误
openclaw logs | grep "ERROR"

# 3. 运行诊断工具
openclaw doctor
```

**解决方案**:

**原因 A:缺少 gateway.mode 配置**:

```bash
# 交互式配置
openclaw configure

# 或直接设置
openclaw config set gateway.mode local
```

**原因 B:配置文件 Schema 校验失败**:

```bash
# 验证 JSON 格式
python3 -m json.tool ~/.openclaw/openclaw.json

# 自动修复
openclaw doctor --fix
```

> **来源**:[LumaDock - OpenClaw Troubleshooting Guide](https://lumadock.com/tutorials/openclaw-troubleshooting-common-errors)、[YouTube - How To FIX All OpenClaw Issues](https://www.youtube.com/watch?v=YWqwXYA7yrU)

---

#### 报错 7:应用崩溃 "Abort trap 6"(macOS 菜单栏应用)

**报错信息**:

```bash
Abort trap: 6
# 或系统日志中:
# Termination Reason: Namespace SIGNAL, Code 6, Abort trap: 6
```

**根本原因**:

1. **TCC 权限问题**:macOS 安全系统在授予麦克风、语音识别等权限时崩溃
2. **签名问题**:Ad-hoc 签名 + 安全提示冲突

**解决方案**:

**方案一:重置 TCC 权限**(推荐):

```bash
# 重置特定权限
tccutil reset Microphone
tccutil reset SpeechRecognition
tccutil reset Accessibility

# 重启 OpenClaw
openclaw gateway restart
```

**方案二:手动授予权限**:

1. 打开 **系统设置 > 隐私与安全性**
2. 依次检查以下权限:
   - **辅助功能** (Accessibility)
   - **麦克风** (Microphone)
   - **语音识别** (Speech Recognition)
   - **屏幕录制** (Screen Recording)
3. 如果 OpenClaw 已在列表中,先移除再重新添加
4. 重启应用

> **来源**:[GitHub Issue #35634 - Desktop App Crash](https://github.com/openclaw/openclaw/issues/35634)、[AnswerOverflow - Openclaw App Close Due to Mic](https://www.answeroverflow.com/m/1471856082958815232)

---

#### 报错 8:权限授予时崩溃(语音识别/麦克风)

**症状**:

- 按 Option 键激活语音输入时应用崩溃
- 语音功能无法使用
- 反复要求授予权限

**根本原因**:macOS TCC(Transparency, Consent, and Control)数据库损坏。

**解决方案**:

**步骤 1:系统设置授权**:

```bash
# 打开系统设置
open "x-apple.systempreferences:com.apple.preference.security?Privacy"
```

手动检查:

- **麦克风** (Microphone)
- **语音识别** (Speech Recognition)
- **辅助功能** (Accessibility)

**步骤 2:重置 TCC 数据库**:

```bash
# 重置所有权限(会清除所有应用的权限设置)
tccutil reset All

# 重启 OpenClaw,系统会重新请求权限
openclaw gateway restart
```

> **来源**:[OpenClaw 官方文档 - macOS App](https://docs.openclaw.ai/platforms/macos)、[LumaDock - Add voice to OpenClaw](https://lumadock.com/tutorials/openclaw-voice-tts-stt-talk-mode)

---

### 5.3 访问阶段常见报错

#### 报错 9:浏览器无法打开 http://127.0.0.1:18789

**症状**:

- 浏览器显示 "Connection refused" 或 "无法访问此网站"
- Dashboard 加载但显示错误

**根本原因**:

1. Gateway 未运行或崩溃
2. 端口绑定地址错误
3. 防火墙阻止访问

**诊断步骤**:

```bash
# 1. 检查 Gateway 状态
openclaw gateway status

# 2. 验证端口监听
lsof -i :18789

# 3. 本地测试连接
curl http://127.0.0.1:18789
```

**解决方案**:

**原因 A:Gateway 未运行**:

```bash
# 启动 Gateway
openclaw gateway start

# 检查状态
openclaw gateway status
```

**原因 B:防火墙阻止**:

**macOS**:允许传入连接

- 系统设置 > 网络 > 防火墙 > 选项 > 添加 Node

**原因 C:浏览器缓存问题**:

- 清除浏览器缓存
- 尝试无痕模式访问

> **来源**:[GitHub Issue #4439 - Web UI connection not working](https://github.com/openclaw/openclaw/issues/4439)

---

#### 报错 10:WebUI 显示空白或错误

**症状**:

- 页面加载但显示空白
- 浏览器控制台显示错误

**根本原因**:

1. 前端资源未正确加载
2. Gateway 配置错误
3. WebSocket 连接失败

**诊断步骤**:

```bash
# 检查 Gateway 日志
openclaw logs | grep "error"

# 检查浏览器控制台
# 按 F12 打开开发者工具,查看 Console 标签
```

**解决方案**:

**方案一:清除缓存并重新安装**:

```bash
# 卸载
npm uninstall -g openclaw

# 清理缓存
npm cache clean --force

# 重新安装
npm install -g openclaw@latest

# 重启
openclaw gateway restart
```

**方案二:检查 WebSocket 连接**:

- 确认浏览器支持 WebSocket
- 检查网络代理设置

> **来源**:社区经验整理

---

### 5.4 性能问题排查

#### 问题 11:Gateway 占用过多内存/CPU

**正常资源占用参考**:

- Gateway 基线:~300MB RAM
- 空闲时 CPU:<5%

**高资源占用场景**:

- AI API 调用
- 图像处理
- 大型会话历史

**诊断**:

```bash
# 实时监控资源使用
top -o cpu
top -o mem

# 或使用 Activity Monitor
```

**优化策略**:

**方法 1:会话重置策略**:

```bash
# 定期重置会话
openclaw "reset session"

# 或在聊天框中输入
/compact
```

**方法 2:日志级别调整**:

```json
// 在 ~/.openclaw/openclaw.json 中
{
  "logging": {
    "level": "warn"  // 只记录警告和错误
  }
}
```

> **来源**:[EastonDev - OpenClaw 性能优化实战](https://eastondev.com/blog/en/posts/ai/20260205-openclaw-performance/)

---

#### 问题 12:响应速度慢或卡顿

**延迟分析**:

- 访问控制:<10ms
- 会话加载:<50ms
- 系统提示组装:<100ms
- 首个 token 返回:200-500ms

**优化建议**:

**方法 1:网络环境**:

- 检查网络连接稳定性
- 考虑使用更快的 DNS

**方法 2:会话历史管理**:

```bash
# 定期清理会话
openclaw sessions cleanup

# 预览模式
openclaw sessions cleanup --dry-run
```

**方法 3:模型选择**:

- 使用更快的模型(如 DeepSeek、Kimi)
- 减少上下文窗口大小

> **来源**:[EastonDev - OpenClaw 性能优化实战](https://eastondev.com/blog/en/posts/ai/20260205-openclaw-performance/)

---

## 六、验证安装成功的标准

完成安装后,使用以下标准验证是否成功。

### 6.1 检查 Gateway 状态

**运行命令**:

```bash
openclaw gateway status
```

**预期输出**:

```
Gateway is running on port 18789
PID: 12345
Status: healthy
```

### 6.2 访问 WebUI 界面

**浏览器打开**:http://127.0.0.1:18789

**成功标志 1**:看到 WebChat 聊天界面(消息输入框、对话历史区域)。

### 6.3 看到 Onboard 配置界面

**成功标志 2**:首次运行看到配置向导,会引导你设置 AI 模型、渠道等。

### 6.4 检查工作区结构

**目录结构**:`~/.openclaw/`

```bash
ls -la ~/.openclaw
```

**核心文件**:

- `openclaw.json`:主配置文件
- `workspace/`:Agent 工作目录
- `credentials/`:API 密钥和 OAuth 令牌
- `agents/`:Agent 数据

**验证命令**:

```bash
ls -la ~/.openclaw/workspace/
# 应显示:AGENTS.md、SOUL.md、USER.md、IDENTITY.md 等文件
```

### 6.5 完整验证清单

**✅ 看到以上内容,说明安装成功!**

完整的 14 项检查清单:

| 检查项                   | 命令/操作                              | 预期结果        | 状态 |
| ------------------------ | -------------------------------------- | --------------- | ---- |
| **命令可用**       | `openclaw --version`                 | 显示版本号      | ⬜   |
| **配置文件**       | `ls ~/.openclaw/openclaw.json`       | 文件存在        | ⬜   |
| **工作区初始化**   | `ls ~/.openclaw/workspace/`          | 包含 .md 文件   | ⬜   |
| **凭证目录**       | `ls ~/.openclaw/credentials/`        | 目录存在        | ⬜   |
| **Gateway 运行**   | `openclaw gateway status`            | 状态 "running"  | ⬜   |
| **端口监听**       | `lsof -i :18789`                     | 进程监听中      | ⬜   |
| **Doctor 检查**    | `openclaw doctor`                    | 全部通过        | ⬜   |
| **Web UI 访问**    | 浏览器打开 `http://127.0.0.1:18789/` | 页面成功加载    | ⬜   |
| **认证成功**       | 输入 token/password                    | 成功连接        | ⬜   |
| **发送消息**       | 在 UI 中输入测试消息                   | 收到 Agent 响应 | ⬜   |
| **会话持久化**     | 检查 sessions/ 目录                    | 存在会话文件    | ⬜   |
| **记忆系统**       | 检查 memory/ 目录                      | 存在日期文件    | ⬜   |
| **日志无错误**     | `openclaw logs`                      | 无 ERROR/FATAL  | ⬜   |
| **服务安装**(可选) | 检查系统服务                           | 状态 active     | ⬜   |

> **来源**:整理自多个官方文档和安装教程

## 七、总结

通过这篇文章,你学会了在 macOS 上从零开始安装 OpenClaw 的完整流程:

**安装流程回顾**:

1. ✅ **前置准备**:检查系统要求、安装 Xcode Command Line Tools 和 Node.js
2. ✅ **安装 OpenClaw**:选择 NPM 全局安装或 macOS 菜单栏应用
3. ✅ **启动并访问**:运行 Gateway,访问 WebUI 界面
4. ✅ **故障排查**:掌握 12 个常见报错的解决方法

**遇到问题时的思路**:

1. **诊断**:运行 `openclaw doctor` 和 `openclaw logs --follow`
2. **定位**:对照本文的报错关键词索引表
3. **解决**:按照解决方案逐步修复
4. **验证**:使用 14 项检查清单确认
