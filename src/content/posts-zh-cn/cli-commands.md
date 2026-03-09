---
title: "OpenClaw CLI命令完整参考"
description: "所有OpenClaw CLI命令的完整参考。了解网关管理、频道配置、消息处理和诊断工具。"
pubDate: 2026-03-09
lastUpdated: 2026-03-09
tags: ["cli", "命令", "参考", "初学者"]
difficulty: "beginner"
estimatedTime: "15 minutes"
prerequisites: ["已安装OpenClaw"]
alternates:
  en: "/posts/cli-commands/"
---

## 概述

所有OpenClaw CLI命令的完整参考。按类别组织，包含示例和使用技巧。

## 核心命令

### `openclaw --version`

显示OpenClaw版本。

```bash
openclaw --version
# 输出：v1.0.0
```

### `openclaw help`

显示帮助信息。

```bash
openclaw help [command]
```

## 网关命令

### `openclaw gateway`

启动OpenClaw网关。

```bash
openclaw gateway [选项]
```

**选项：**
- `--port, -p <端口>` - 端口号（默认：18789）
- `--host, -h <主机>` - 主机地址（默认：localhost）
- `--verbose, -v` - 启用详细日志
- `--daemon, -d` - 作为守护进程运行

**示例：**
```bash
# 使用默认值启动
openclaw gateway

# 自定义端口
openclaw gateway --port 3000

# 详细模式
openclaw gateway --verbose
```

### `openclaw gateway start`

启动网关守护进程。

```bash
openclaw gateway start
```

### `openclaw gateway stop`

停止网关守护进程。

```bash
openclaw gateway stop
```

### `openclaw gateway status`

检查网关状态。

```bash
openclaw gateway status
```

## 配置命令

### `openclaw onboard`

运行设置向导。

```bash
openclaw onboard [选项]
```

**选项：**
- `--install-daemon` - 安装守护进程为服务
- `--defaults` - 使用默认值

### `openclaw config`

管理配置。

```bash
openclaw config [子命令] [选项]
```

**子命令：**
- `get <键>` - 获取配置值
- `set <键> <值>` - 设置配置值
- `list` - 列出所有配置
- `validate` - 验证配置文件
- `edit` - 编辑配置

**示例：**
```bash
openclaw config get gateway.port
openclaw config set gateway.port 3000
openclaw config validate
```

## 频道命令

### `openclaw channel add`

添加新频道。

```bash
openclaw channel add <类型> [选项]
```

**类型：** `telegram`、`discord`、`slack`、`whatsapp`

**示例：**
```bash
# 添加Telegram
openclaw channel add telegram --token "YOUR_TOKEN"

# 添加Discord
openclaw channel add discord --token "YOUR_TOKEN"
```

### `openclaw channel list`

列出所有频道。

```bash
openclaw channel list
```

### `openclaw channel test`

测试频道连接。

```bash
openclaw channel test <类型>
```

## 消息命令

### `openclaw message send`

发送消息。

```bash
openclaw message send [选项]
```

**选项：**
- `--to, -t <接收者>` - 接收者（聊天ID、频道等）
- `--content, -c <文本>` - 消息内容
- `--file, -f <路径>` - 附加文件
- `--channel <类型>` - 频道类型

**示例：**
```bash
# 发送文本
openclaw message send --to "123456789" --content "你好！"

# 发送文件
openclaw message send --to "123456789" --file ~/document.pdf
```

## 诊断命令

### `openclaw doctor`

运行健康检查。

```bash
openclaw doctor [选项]
```

**选项：**
- `--verbose, -v` - 详细输出
- `--json` - JSON输出
- `--fix` - 尝试自动修复

### `openclaw logs`

查看网关日志。

```bash
openclaw logs [选项]
```

**选项：**
- `--tail <数字>` - 显示最后N行（默认：50）
- `--follow, -f` - 跟踪日志输出
- `--level <级别>` - 按级别过滤（info、warn、error）

**示例：**
```bash
# 最后50行
openclaw logs --tail 50

# 跟踪日志
openclaw logs --follow

# 仅错误
openclaw logs --level error
```

## 常见工作流程

### 初始设置

```bash
# 安装
npm install -g openclaw

# 运行向导
openclaw onboard --install-daemon

# 启动网关
openclaw gateway start
```

### 调试问题

```bash
# 运行诊断
openclaw doctor --verbose

# 检查日志
openclaw logs --tail 100

# 验证配置
openclaw config validate
```

## 下一步

- [配置参考](/posts/config-reference/)
- [网关设置](/posts/config-gateway/)
- [故障排除指南](/posts/troubleshooting-doctor/)
