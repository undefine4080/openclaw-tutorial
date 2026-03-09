---
title: "OpenClaw Onboard Wizard Complete Guide"
description: "Master the OpenClaw onboard wizard to set up your gateway, channels, and skills. Learn about each configuration option and best practices."
pubDate: 2026-03-09
lastUpdated: 2026-03-09
tags: ["onboard", "wizard", "configuration", "beginner"]
difficulty: "beginner"
estimatedTime: "12 minutes"
prerequisites: ["OpenClaw installed", "Node.js >= 22"]
alternates:
  zhCN: "/zh-cn/posts/start-onboard-wizard/"
---

## Overview

The `openclaw onboard` wizard guides you through initial OpenClaw configuration in minutes. This guide covers each prompt, configuration option, and best practice.

## What is the Onboard Wizard?

The onboard wizard is an interactive CLI tool that:
- ✅ **Creates Configuration:** Generates `openclaw.json`
- ✅ **Sets Up Channels:** Configures Telegram, Discord, etc.
- ✅ **Installs Skills:** Adds default skills
- ✅ **Configures Gateway:** Sets port and options
- ✅ **Tests Connection:** Validates everything works

## Quick Start

**Run the wizard:**

```bash
openclaw onboard
```

**With daemon installation:**

```bash
openclaw onboard --install-daemon
```

This also installs the daemon as a system service.

## Wizard Walkthrough

### Step 1: Welcome Screen

```
╔═══════════════════════════════════════════════════════╗
║   Welcome to OpenClaw! Let's get you set up.          ║
║                                                       ║
║   This wizard will guide you through:                 ║
║   • Gateway configuration                            ║
║   • Channel setup (Telegram, Discord, etc.)          ║
║   • Skill installation                               ║
║   • Initial testing                                  ║
╚═══════════════════════════════════════════════════════╝

Press Enter to continue...
```

### Step 2: Gateway Configuration

```
? Gateway port (default: 18789):
```

**Recommendation:** Press Enter for default `18789`

**Custom port:**
- Use a different port if `18789` is in use
- Choose a port > 1024 (no root required)
- Remember your port for future use

**Common ports:**
- `18789` - Default
- `18790` - Alternative
- `3000` - Common development port

### Step 3: Channel Selection

```
? Which channels would you like to configure? (space to select, enter to confirm)
❯ ◯ Telegram
  ◯ Discord
  ◯ Slack
  ◯ WhatsApp
```

**How to select:**
- **Space** - Toggle selection
- **Enter** - Confirm selection
- **Arrow keys** - Navigate

**Recommendation:** Start with one channel (e.g., Telegram)

### Step 4: Telegram Configuration (if selected)

```
? Enter your Telegram bot token:
```

**How to get token:**
1. Open Telegram
2. Message `@BotFather`
3. Send `/newbot`
4. Copy token from response

**Example token:** `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`

```
? Enable webhook for better performance? (Y/n):
```

**Recommendation:** Press `Y` for production, `n` for testing

### Step 5: Discord Configuration (if selected)

```
? Enter your Discord bot token:
```

**How to get token:**
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create application → Bot → Add Bot
3. Copy token under "TOKEN" section

```
? Enter your Discord client ID:
```

**How to find client ID:**
1. In Discord Developer Portal
2. Go to "General Information"
3. Copy "APPLICATION ID"

```
? Enable privileged intents? (Y/n):
```

**Recommendation:** Press `Y` (required for message content)

### Step 6: Skill Selection

```
? Which skills would you like to install? (space to select)
❯ ◯ ping (Basic ping/pong command)
  ◯ echo (Repeat messages)
  ◯ weather (Weather information)
  ◯ reminder (Set reminders)
```

**Recommendation:** Install `ping` for testing

### Step 7: Confirmation

```
Configuration summary:

Gateway:
  Port: 18789
  Daemon: disabled

Channels:
  • Telegram (enabled)
  • Discord (enabled)

Skills:
  • ping (installed)

? Save this configuration? (Y/n):
```

**Press `Y`** to save configuration to `~/.openclaw/openclaw.json`

### Step 8: Testing

```
✓ Configuration saved to ~/.openclaw/openclaw.json
✓ Gateway started successfully
✓ Channels connected
✓ Skills loaded

🎉 Setup complete! Try sending !ping to your bot.
```

## Configuration File

The wizard creates `~/.openclaw/openclaw.json`:

```json
{
  "gateway": {
    "port": 18789,
    "host": "localhost"
  },
  "channels": [
    {
      "type": "telegram",
      "token": "YOUR_TELEGRAM_TOKEN",
      "webhook": false
    },
    {
      "type": "discord",
      "token": "YOUR_DISCORD_TOKEN",
      "clientId": "YOUR_CLIENT_ID",
      "intents": ["GUILDS", "GUILD_MESSAGES", "MESSAGE_CONTENT"]
    }
  ],
  "skills": [
    "ping",
    "echo",
    "weather"
  ]
}
```

## Advanced Options

### Silent Mode

Skip all prompts with defaults:

```bash
openclaw onboard --defaults
```

### Config File Input

Use existing configuration:

```bash
openclaw onboard --config /path/to/config.json
```

### Skip Channel Setup

Configure gateway only:

```bash
openclaw onboard --gateway-only
```

### Daemon Installation

Install as system service:

```bash
openclaw onboard --install-daemon
```

**Supported systems:**
- Linux (systemd)
- macOS (launchd)
- Windows (nssm - requires manual setup)

## Common Issues

### Issue: "Port already in use"

**Solution:**
```bash
# Find process
lsof -i :18789

# Kill process
kill -9 [PID]

# Or use different port in wizard
```

### Issue: "Invalid token"

**Solution:**
- Verify token is correct
- Check for extra spaces
- Regenerate token if needed

### Issue: "Daemon install failed"

**Cause:** Missing service manager

**Solution:**
```bash
# Skip daemon
openclaw onboard

# Run gateway manually
openclaw gateway
```

### Issue: "Configuration not saved"

**Cause:** Permission issue

**Solution:**
```bash
# Create directory
mkdir -p ~/.openclaw

# Fix permissions
chmod 755 ~/.openclaw
```

## Best Practices

1. **Start Simple:** Configure one channel first
2. **Use Defaults:** Default settings work for most users
3. **Test Thoroughly:** Send `!ping` after setup
4. **Save Backup:** Copy `openclaw.json` to safe location
5. **Read Prompts:** Don't rush through wizard

## Manual Configuration

Prefer manual setup? Create `~/.openclaw/openclaw.json`:

```json
{
  "gateway": {
    "port": 18789
  },
  "channels": [
    {
      "type": "telegram",
      "token": "YOUR_TOKEN"
    }
  ]
}
```

Then start gateway:

```bash
openclaw gateway
```

## Re-running the Wizard

**Update configuration:**

```bash
openclaw onboard
```

The wizard will:
- Load existing configuration
- Prompt for changes
- Merge with existing settings
- Update config file

**Start fresh:**

```bash
rm ~/.openclaw/openclaw.json
openclaw onboard
```

## Next Steps

- [Start Your Gateway](/posts/start/)
- [Configure Channels](/posts/channels-telegram/)
- [Install More Skills](/posts/)
- [Configuration Reference](/posts/config-reference/)

## Additional Resources

- [Configuration Guide](/posts/config-reference/)
- [Gateway Setup](/posts/config-gateway/)
- [CLI Commands](/posts/cli-commands/)
- [OpenClaw GitHub](https://github.com/openclaw/openclaw)
