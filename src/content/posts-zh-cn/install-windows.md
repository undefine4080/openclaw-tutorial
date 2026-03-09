---
title: "Windows + WSL2上安装OpenClaw完全指南"
description: "使用WSL2在Windows上安装OpenClaw的完整指南。在Windows上设置Linux环境以获得最佳OpenClaw性能。"
pubDate: 2026-03-09
lastUpdated: 2026-03-09
tags: ["windows", "wsl2", "安装", "初学者"]
difficulty: "intermediate"
estimatedTime: "15 minutes"
prerequisites: ["Windows 10/11", "管理员权限"]
alternates:
  en: "/posts/install-windows/"
---

## 概述

使用WSL2（Windows Subsystem for Linux）在Windows上安装OpenClaw以获得最佳兼容性和性能。本指南涵盖WSL2设置、Node.js 22安装和OpenClaw配置。

## 为什么在Windows上选择WSL2？

OpenClaw在Windows上配合WSL2效果最佳，因为：
- ✅ **原生Linux支持：** OpenClaw专为Linux环境设计
- ✅ **更好的性能：** 对于许多操作比原生Windows更快
- ✅ **完全兼容：** 所有OpenClaw功能无问题工作
- ✅ **简单设置：** 一键安装
- ✅ **无缝集成：** 从Linux访问Windows文件

## 系统要求

- **Windows 10版本2004+**或**Windows 11**
- **管理员权限**
- **互联网连接**
- **2GB+可用磁盘空间**

## 步骤1：启用WSL2

### 选项A：快速安装（仅Windows 11）

以管理员身份打开PowerShell并运行：

```powershell
wsl --install
```

提示时重启计算机。

### 选项B：手动设置（Windows 10/11）

**1. 启用WSL功能**

以管理员身份打开PowerShell：

```powershell
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
```

**2. 启用虚拟机平台**

```powershell
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

**3. 重启计算机**

**4. 设置WSL 2为默认**

```powershell
wsl --set-default-version 2
```

**5. 安装Ubuntu**

打开Microsoft Store，搜索"Ubuntu"，并安装"Ubuntu 22.04.3 LTS"或最新版本。

## 步骤2：初始化Ubuntu

**1. 启动Ubuntu**

- 按`Win + R`，输入`ubuntu`，然后按Enter
- 或在开始菜单中搜索"Ubuntu"

**2. 创建UNIX用户名**

提示时输入：
- **用户名：**（您的选择，例如`user`）
- **密码：**（选择一个强密码）
- **重新输入密码：**（确认密码）

**3. 更新系统**

```bash
sudo apt update && sudo apt upgrade -y
```

## 步骤3：安装Node.js 22

**1. 安装NodeSource仓库**

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
```

**2. 安装Node.js 22**

```bash
sudo apt install -y nodejs
```

**3. 验证安装**

```bash
node --version
# 预期：v22.x.x

npm --version
# 预期：10.x.x或更高
```

## 步骤4：安装OpenClaw

**1. 全局安装OpenClaw**

```bash
sudo npm install -g openclaw
```

**2. 验证安装**

```bash
openclaw --version
```

**3. 运行设置向导**

```bash
openclaw onboard --install-daemon
```

注意：守护进程安装可能在WSL2中不工作。您可以手动运行网关。

## 步骤5：为WSL2配置网关

由于WSL2默认不支持systemd，手动运行网关：

**1. 启动网关**

```bash
openclaw gateway --port 18789 --verbose
```

**2. 启用自动启动（可选）**

添加到您的`~/.bashrc`：

```bash
nano ~/.bashrc
```

在末尾添加：
```bash
# 如果OpenClaw网关未运行则启动
if ! pgrep -x "openclaw" > /dev/null; then
    openclaw gateway --port 18789 > /dev/null 2>&1 &
fi
```

保存并重启终端。

## 步骤6：访问Windows文件

WSL2中的OpenClaw可以访问Windows文件：

**Windows路径：**
```
C:\Users\YourName\Documents
```

**WSL2路径：**
```bash
/mnt/c/Users/YourName/Documents
```

示例：将配置保存到Windows桌面：
```bash
nano /mnt/c/Users/YourName/Desktop/openclaw-config.json
```

## 步骤7：Windows终端设置（推荐）

为了更好的终端体验：

**1. 安装Windows Terminal**

从[Microsoft Store](https://aka.ms/terminal)下载

**2. 添加Ubuntu配置文件**

Windows Terminal应该自动检测Ubuntu。如果没有：

1. 打开Windows Terminal
2. 转到设置（Ctrl+,）
3. 点击"添加新配置文件"
4. 选择"Ubuntu"

**3. 设置Ubuntu为默认**

在设置 > 启动 > 默认配置文件中，选择"Ubuntu"。

## 高级配置

### 在WSL2中启用systemd（仅Windows 11）

**1. 更新WSL**

```powershell
wsl --update
```

**2. 启用systemd**

在Ubuntu终端中：

```bash
echo "[boot]" | sudo tee /etc/wsl.conf
echo "systemd=true" | sudo tee -a /etc/wsl.conf
```

**3. 重启WSL**

在PowerShell中：
```powershell
wsl --shutdown
```

**4. 验证systemd**

打开Ubuntu并运行：
```bash
systemctl --user
```

### 安装Windows特定工具

**1. 安装Windows构建工具**

如果您需要原生模块：

```bash
sudo apt install -y build-essential
```

**2. 配置Git**

```bash
git config --global core.autocrlf false
```

## 常见问题

### 问题："WSL not installed"

**解决方案：**
```powershell
# 启用WSL功能
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart

# 重启计算机
```

### 问题："ReferenceError: Permissions error"

**原因：** WSL2中的npm权限问题

**解决方案：**
```bash
# 修复npm权限
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# 重新安装OpenClaw
npm install -g openclaw
```

### 问题："Port 18789 already in use"

**解决方案：**
```bash
# 查找进程
lsof -i :18789

# 终止进程
kill -9 [PID]

# 或使用不同端口
openclaw gateway --port 18790
```

### 问题："Daemon install fails"

**原因：** WSL2默认不支持systemd

**解决方案：**
改为手动运行网关：
```bash
openclaw gateway --port 18789
```

或启用systemd（见上面的高级配置）。

### 问题："从Windows无法连接到localhost"

**原因：** WSL2使用不同的IP

**解决方案：**
使用WSL2 IP地址：
```bash
# 查找WSL2 IP
ip addr show eth0 | grep inet

# 或使用localhost（WSL2转发端口）
```

## 成功标准

✅ OpenClaw在Windows上就绪如果：
- 安装了WSL2和Ubuntu
- `node --version`显示`v22.x.x`
- `openclaw --version`正常工作
- 网关启动无错误
- 可以从WSL2访问Windows文件

## 验证

```bash
# 完整健康检查
node --version && npm --version && openclaw --version

# 检查WSL版本
wsl --list --verbose

# 测试网关
openclaw gateway --port 18789 --verbose
```

## 下一步

- [快速开始指南](/posts/start/)
- [Node.js 22安装](/posts/install-node-22/)
- [配置频道](/posts/channels-telegram/)
- [故障排除](/posts/troubleshooting-common-errors/)

## 附加资源

- [WSL2官方文档](https://docs.microsoft.com/en-us/windows/wsl/)
- [Windows Terminal](https://aka.ms/terminal)
- [Node.js on Windows](https://nodejs.org/)
- [OpenClaw GitHub仓库](https://github.com/openclaw/openclaw)

## 备选方案：原生Windows安装

如果您更喜欢原生Windows（不推荐）：

1. 从[nodejs.org](https://nodejs.org/)安装Node.js 22
2. 从[git-scm.com](https://git-scm.com/)安装Git
3. 从[python.org](https://python.org/)安装Python 3.11+
4. 安装Visual Studio Build Tools
5. 运行：`npm install -g openclaw`

**⚠️ 警告：** 原生Windows可能有兼容性问题。推荐使用WSL2。
