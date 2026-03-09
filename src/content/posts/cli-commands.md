---
title: "OpenClaw CLI Commands Complete Reference"
description: "Complete reference for all OpenClaw CLI commands. Learn gateway management, channel configuration, message handling, and diagnostic tools."
pubDate: 2026-03-09
lastUpdated: 2026-03-09
tags: ["cli", "commands", "reference", "beginner"]
difficulty: "beginner"
estimatedTime: "15 minutes"
prerequisites: ["OpenClaw installed"]
alternates:
  zhCN: "/zh-cn/posts/cli-commands/"
---

## Overview

Complete reference for all OpenClaw CLI commands. Organized by category with examples and usage tips.

## Command Categories

1. **Core Commands** - Basic operations
2. **Gateway Management** - Start, stop, restart gateway
3. **Channel Management** - Configure and test channels
4. **Message Commands** - Send and manage messages
5. **Configuration** - Manage settings
6. **Diagnostics** - Troubleshooting and health checks

## Core Commands

### `openclaw --version`

Display OpenClaw version.

```bash
openclaw --version
# Output: v1.0.0
```

### `openclaw help`

Display help information.

```bash
openclaw help
openclaw help [command]
```

**Examples:**
```bash
openclaw help gateway
openclaw help message
```

## Gateway Commands

### `openclaw gateway`

Start the OpenClaw gateway.

```bash
openclaw gateway [options]
```

**Options:**
- `--port, -p <port>` - Port number (default: 18789)
- `--host, -h <host>` - Host address (default: localhost)
- `--verbose, -v` - Enable verbose logging
- `--daemon, -d` - Run as daemon
- `--config, -c <path>` - Custom config file path

**Examples:**
```bash
# Start with defaults
openclaw gateway

# Custom port
openclaw gateway --port 3000

# Verbose mode
openclaw gateway --verbose

# Custom config
openclaw gateway --config ~/custom-config.json
```

### `openclaw gateway start`

Start gateway daemon.

```bash
openclaw gateway start
```

### `openclaw gateway stop`

Stop gateway daemon.

```bash
openclaw gateway stop
```

### `openclaw gateway restart`

Restart gateway daemon.

```bash
openclaw gateway restart
```

### `openclaw gateway status`

Check gateway status.

```bash
openclaw gateway status
```

**Output:**
```
Gateway Status: Running
PID: 12345
Port: 18789
Uptime: 2 hours 15 minutes
Channels: 2 connected
```

## Configuration Commands

### `openclaw onboard`

Run setup wizard.

```bash
openclaw onboard [options]
```

**Options:**
- `--install-daemon` - Install daemon as service
- `--defaults` - Use default values
- `--config <path>` - Load existing config

**Examples:**
```bash
# Interactive wizard
openclaw onboard

# With daemon installation
openclaw onboard --install-daemon

# Use defaults
openclaw onboard --defaults
```

### `openclaw config`

Manage configuration.

```bash
openclaw config [subcommand] [options]
```

**Subcommands:**

#### `openclaw config get`

Get configuration value.

```bash
openclaw config get <key>
```

**Examples:**
```bash
openclaw config get gateway.port
openclaw config get channels.0.token
```

#### `openclaw config set`

Set configuration value.

```bash
openclaw config set <key> <value>
```

**Examples:**
```bash
openclaw config set gateway.port 3000
openclaw config set channels.0.type telegram
```

#### `openclaw config list`

List all configuration.

```bash
openclaw config list
```

#### `openclaw config validate`

Validate configuration file.

```bash
openclaw config validate
```

**Output:**
```
✓ Configuration file: ~/.openclaw/openclaw.json
✓ JSON syntax: Valid
✓ Required fields: OK
✓ Channels: 2 configured
```

#### `openclaw config edit`

Edit configuration in default editor.

```bash
openclaw config edit
```

### `openclaw config reset`

Reset configuration to defaults.

```bash
openclaw config reset
```

**Warning:** This deletes your current configuration!

## Channel Commands

### `openclaw channel`

Manage channels.

```bash
openclaw channel [subcommand] [options]
```

**Subcommands:**

#### `openclaw channel add`

Add new channel.

```bash
openclaw channel add <type> [options]
```

**Types:** `telegram`, `discord`, `slack`, `whatsapp`

**Options:**
- `--token <token>` - Channel token
- `--webhook` - Enable webhook

**Examples:**
```bash
# Add Telegram
openclaw channel add telegram --token "YOUR_TOKEN"

# Add Discord
openclaw channel add discord --token "YOUR_TOKEN" --clientId "YOUR_CLIENT_ID"
```

#### `openclaw channel list`

List all channels.

```bash
openclaw channel list
```

**Output:**
```
Configured Channels:
1. Telegram (connected)
   - Last activity: 2 minutes ago
   - Webhook: disabled

2. Discord (connected)
   - Last activity: 5 minutes ago
   - Intents: GUILDS, GUILD_MESSAGES
```

#### `openclaw channel test`

Test channel connection.

```bash
openclaw channel test <type>
```

**Examples:**
```bash
openclaw channel test telegram
openclaw channel test discord
```

#### `openclaw channel remove`

Remove channel.

```bash
openclaw channel remove <type>
```

**Examples:**
```bash
openclaw channel remove telegram
```

## Message Commands

### `openclaw message`

Send messages.

```bash
openclaw message send [options]
```

**Options:**
- `--to, -t <recipient>` - Recipient (chat ID, channel, etc.)
- `--content, -c <text>` - Message content
- `--file, -f <path>` - Attach file
- `--channel <type>` - Channel type

**Examples:**
```bash
# Send text
openclaw message send --to "123456789" --content "Hello!"

# Send to specific channel
openclaw message send --channel telegram --to "123456789" --content "Hi"

# Send file
openclaw message send --to "123456789" --file ~/document.pdf
```

### `openclaw message history`

View message history.

```bash
openclaw message history [options]
```

**Options:**
- `--limit <number>` - Number of messages (default: 50)
- `--channel <type>` - Filter by channel
- `--reverse` - Show oldest first

**Examples:**
```bash
# Last 50 messages
openclaw message history

# Last 100 Telegram messages
openclaw message history --channel telegram --limit 100

# Oldest first
openclaw message history --reverse
```

## Diagnostic Commands

### `openclaw doctor`

Run health check.

```bash
openclaw doctor [options]
```

**Options:**
- `--verbose, -v` - Detailed output
- `--json` - JSON output
- `--fix` - Attempt auto-fix

**Examples:**
```bash
# Basic check
openclaw doctor

# Verbose
openclaw doctor --verbose

# JSON output
openclaw doctor --json

# Auto-fix issues
openclaw doctor --fix
```

### `openclaw logs`

View gateway logs.

```bash
openclaw logs [options]
```

**Options:**
- `--tail <number>` - Show last N lines (default: 50)
- `--follow, -f` - Follow log output
- `--since <time>` - Show logs since time
- `--level <level>` - Filter by level (info, warn, error)

**Examples:**
```bash
# Last 50 lines
openclaw logs --tail 50

# Follow logs
openclaw logs --follow

# Last hour
openclaw logs --since 1h

# Only errors
openclaw logs --level error
```

## Skill Commands

### `openclaw skill`

Manage skills.

```bash
openclaw skill [subcommand] [options]
```

**Subcommands:**

#### `openclaw skill list`

List installed skills.

```bash
openclaw skill list
```

#### `openclaw skill install`

Install skill.

```bash
openclaw skill install <skill-name>
```

**Examples:**
```bash
openclaw skill install weather
openclaw skill install reminder
```

#### `openclaw skill uninstall`

Uninstall skill.

```bash
openclaw skill uninstall <skill-name>
```

#### `openclaw skill update`

Update skill.

```bash
openclaw skill update <skill-name>
```

#### `openclaw skill search`

Search for skills.

```bash
openclaw skill search <query>
```

## Daemon Commands

### `openclaw daemon`

Manage daemon service.

```bash
openclaw daemon [subcommand]
```

**Subcommands:**
- `start` - Start daemon
- `stop` - Stop daemon
- `restart` - Restart daemon
- `status` - Check status
- `enable` - Enable auto-start
- `disable` - Disable auto-start

**Examples:**
```bash
openclaw daemon start
openclaw daemon status
openclaw daemon enable
```

## Utility Commands

### `openclaw completion`

Generate shell completion.

```bash
openclaw completion [shell]
```

**Shells:** `bash`, `zsh`, `fish`

**Examples:**
```bash
# Generate for bash
openclaw completion bash > /etc/bash_completion.d/openclaw

# Generate for zsh
openclaw completion zsh > ~/.zfunc/_openclaw
```

### `openclaw update`

Update OpenClaw to latest version.

```bash
openclaw update
```

### `openclaw uninstall`

Uninstall OpenClaw.

```bash
openclaw uninstall [--purge]
```

**Options:**
- `--purge` - Remove configuration files

## Common Workflows

### Initial Setup

```bash
# Install
npm install -g openclaw

# Run wizard
openclaw onboard --install-daemon

# Start gateway
openclaw gateway start
```

### Test Channel

```bash
# Check status
openclaw gateway status

# Test channel
openclaw channel test telegram

# Send message
openclaw message send --to "CHAT_ID" --content "Test message"
```

### Debug Issues

```bash
# Run diagnostics
openclaw doctor --verbose

# Check logs
openclaw logs --tail 100

# Validate config
openclaw config validate
```

## Next Steps

- [Configuration Reference](/posts/config-reference/)
- [Gateway Setup](/posts/config-gateway/)
- [Troubleshooting Guide](/posts/troubleshooting-doctor/)
- [Quick Start](/posts/start/)

## Additional Resources

- [OpenClaw GitHub](https://github.com/openclaw/openclaw)
- [API Documentation](https://docs.openclaw.dev/api)
- [Community Forum](https://github.com/openclaw/openclaw/discussions)
