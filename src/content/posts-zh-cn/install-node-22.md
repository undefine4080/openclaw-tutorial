---
title: "Node.js 22 验证和升级指南"
description: "OpenClaw需要Node.js 22或更高版本。学习如何检查版本、安全升级Node.js以及修复常见安装问题。"
pubDate: 2026-03-09
lastUpdated: 2026-03-09
tags: ["nodejs", "安装", "故障排除", "初学者"]
difficulty: "beginner"
estimatedTime: "10 minutes"
prerequisites: []
alternates:
  en: "/posts/install-node-22/"
---

## 概述

检查您的Node.js版本，如需要升级到Node.js 22，并使用本综合指南验证安装。

## 为什么选择Node.js 22？

OpenClaw需要**Node.js 22或更高版本**，因为它使用：
- 最新的ES2024特性
- 改进的性能优化
- 增强的安全补丁
- 原生fetch API
- 更好的模块解析

## 步骤1：检查当前版本

首先，检查您安装的Node.js版本：

```bash
node --version
```

**预期输出：**
- ✅ `v22.x.x` - 您已准备好！
- ⚠️ `v20.x.x`或更低 - 您需要升级
- ❌ `command not found` - 您需要安装Node.js

## 步骤2：安装Node.js 22

### 选项A：使用nvm（推荐）

**nvm**（Node Version Manager）让您可以安装多个Node.js版本并在它们之间切换。

**安装nvm：**

**macOS/Linux：**
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc  # 或重启终端
```

**Windows：**
下载并安装[nvm-windows](https://github.com/coreybutler/nvm-windows/releases)

**使用nvm安装Node.js 22：**
```bash
nvm install 22
nvm use 22
nvm alias default 22  # 设置22为默认版本
```

**验证安装：**
```bash
node --version
# 应该输出：v22.x.x
```

### 选项B：使用n（仅macOS/Linux）

**n**是一个简单的Node.js版本管理器。

```bash
sudo npm install -g n
sudo n 22
```

### 选项C：官方安装程序

从[nodejs.org](https://nodejs.org/)下载：

1. 访问 https://nodejs.org
2. 下载LTS版本（22.x或更高）
3. 运行安装程序
4. 按照安装向导操作

**macOS (Homebrew)：**
```bash
brew install node@22
brew link node@22
```

**Windows (Chocolatey)：**
```bash
choco install nodejs-lts
```

**Linux (Ubuntu/Debian)：**
```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
```

## 步骤3：验证安装

安装后，验证一切正常：

```bash
# 检查Node.js版本
node --version
# 预期：v22.x.x

# 检查npm版本（随Node.js一起安装）
npm --version
# 预期：10.x.x或更高

# 测试Node.js
node -e "console.log('Node.js 正常工作!')"
# 预期：Node.js 正常工作!
```

## 步骤4：更新npm（可选但推荐）

Node.js 22自带npm，但您可能需要最新版本：

```bash
npm install -g npm@latest
```

## 常见问题

### 问题："Permission denied"
**原因：** 尝试在没有适当权限的情况下全局安装

**解决方案：**
```bash
# 改用nvm（不需要sudo）
nvm install 22

# 或修复npm权限
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

### 问题：安装后"command not found"
**原因：** Node.js不在PATH中

**解决方案：**
```bash
# 检查是否安装了Node.js
which node

# 如果没找到，重启终端或运行：
source ~/.bashrc  # Linux/macOS
# 或完全重启终端

# 在Windows上，重启命令提示符或PowerShell
```

### 问题：安装了多个版本
**原因：** 系统有多个Node.js安装

**解决方案：**
```bash
# 使用nvm管理版本
nvm ls
nvm uninstall 20
nvm use 22
nvm alias default 22
```

### 问题："Node版本仍显示旧版本"
**原因：** Shell正在缓存旧版本

**解决方案：**
```bash
# 清除shell缓存
hash -r

# 或重启终端
```

## 成功标准

✅ 您已为OpenClaw做好准备如果：
- `node --version`显示`v22.x.x`或更高
- `npm --version`正常工作无错误
- `node -e "console.log('test')"`输出"test"
- 没有"command not found"错误

## 验证命令

```bash
# 完整健康检查
node --version && npm --version && echo "✅ Node.js 22 就绪!"

# 检查是否安装了nvm
command -v nvm

# 列出已安装的Node.js版本（如果使用nvm）
nvm ls
```

## 下一步

- [全局安装OpenClaw](/posts/start/)
- [快速开始指南](/posts/start/)
- [npm全局安装指南](/posts/install-npm-global/)
- [Windows + WSL2设置](/posts/install-windows/)

## 附加资源

- [Node.js官方下载](https://nodejs.org/)
- [nvm GitHub仓库](https://github.com/nvm-sh/nvm)
- [nvm-windows](https://github.com/coreybutler/nvm-windows)
- [Node.js发布计划](https://github.com/nodejs/release#release-schedule)
