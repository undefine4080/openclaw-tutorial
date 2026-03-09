---
title: "Common OpenClaw Error Messages and Quick Fixes"
description: "Fast solutions for the most common OpenClaw errors. Find your error message and fix it in under 30 seconds."
pubDate: 2026-03-09
lastUpdated: 2026-03-09
tags: ["troubleshooting", "errors", "quick-fix", "beginner"]
difficulty: "beginner"
estimatedTime: "5 minutes"
prerequisites: ["OpenClaw installed"]
alternates:
  zhCN: "/zh-cn/posts/troubleshooting-common-errors/"
---

## Overview

Find your error message below and follow the quick fix. Most errors can be resolved in under 30 seconds.

## How to Use This Guide

1. **Find your error message** in the table of contents
2. **Copy the fix command** and run it
3. **Verify the fix** worked
4. **Get back to work!**

---

## Installation Errors

### Error: "command not found: openclaw"

**Cause:** OpenClaw not installed or not in PATH

**Quick Fix:**
```bash
npm install -g openclaw
```

**If still not working:**
```bash
# Check installation
npm list -g openclaw

# Reinstall
npm uninstall -g openclaw
npm install -g openclaw

# Or use npx (temporary)
npx openclaw [command]
```

---

### Error: "Node version too low" / "Unsupported Node.js version"

**Cause:** Node.js version < 22

**Quick Fix:**
```bash
# Check version
node --version

# If < 22, upgrade
nvm install 22
nvm use 22
```

**Full guide:** [Node.js 22 Upgrade Guide](/posts/install-node-22/)

---

## Gateway Errors

### Error: "Port 18789 already in use"

**Cause:** Another process is using port 18789

**Quick Fix:**
```bash
# Find the process
lsof -i :18789  # macOS/Linux
netstat -ano | findstr :18789  # Windows

# Kill it
kill -9 [PID]  # macOS/Linux
taskkill /PID [PID] /F  # Windows

# Or use different port
openclaw gateway --port 18790
```

---

### Error: "Gateway failed to start"

**Cause:** Configuration issue or missing dependencies

**Quick Fix:**
```bash
# Check configuration
cat ~/.openclaw/openclaw.json

# Validate JSON
cat ~/.openclaw/openclaw.json | jq .

# Check logs
openclaw gateway --verbose

# Reset config (last resort)
mv ~/.openclaw/openclaw.json ~/.openclaw/openclaw.json.backup
openclaw onboard
```

---

## Channel Errors

### Error: "Invalid token" (Discord/Telegram)

**Cause:** Incorrect or expired bot token

**Quick Fix:**
```bash
# For Discord:
# 1. Go to Discord Developer Portal
# 2. Reset token
# 3. Update config
nano ~/.openclaw/openclaw.json

# For Telegram:
# 1. Message @BotFather
# 2. Get new token
# 3. Update config

# Restart gateway
openclaw gateway restart
```

---

### Error: "Missing access" (Discord)

**Cause:** Bot lacks permissions in Discord server

**Quick Fix:**
1. Go to Discord Server Settings
2. Go to Roles
3. Find bot's role
4. Enable these permissions:
   - ☑ Send Messages
   - ☑ Read Messages
   - ☑ Read Message History
   - ☑ Add Reactions
   - ☑ Embed Links

---

### Error: "Bot was blocked by the user" (Telegram)

**Cause:** User blocked the bot

**Quick Fix:**
1. Ask user to unblock bot in Telegram
2. Or use `/start` command in chat with bot

---

## Configuration Errors

### Error: "Configuration file not found"

**Cause:** OpenClaw not configured yet

**Quick Fix:**
```bash
openclaw onboard
```

---

### Error: "Invalid JSON in config file"

**Cause:** Syntax error in openclaw.json

**Quick Fix:**
```bash
# Validate JSON
cat ~/.openclaw/openclaw.json | jq .

# If error, fix manually
nano ~/.openclaw/openclaw.json

# Or recreate config
mv ~/.openclaw/openclaw.json ~/.openclaw/openclaw.json.backup
openclaw onboard
```

---

## Network Errors

### Error: "ECONNREFUSED" / "Connection refused"

**Cause:** Network connectivity issue or service down

**Quick Fix:**
```bash
# Check internet connection
ping google.com

# Check if gateway is running
openclaw gateway status

# Restart gateway
openclaw gateway restart

# Check firewall settings
# Ensure port 18789 is allowed
```

---

### Error: "Timeout waiting for response"

**Cause:** Slow network or overloaded service

**Quick Fix:**
```bash
# Increase timeout in config
nano ~/.openclaw/openclaw.json

# Add:
{
  "timeout": 30000  // 30 seconds
}

# Restart gateway
openclaw gateway restart
```

---

## Permission Errors

### Error: "EACCES: permission denied"

**Cause:** Insufficient permissions

**Quick Fix:**
```bash
# Fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# Reinstall OpenClaw
npm install -g openclaw
```

---

### Error: "Cannot read config file"

**Cause:** Permission issue with config file

**Quick Fix:**
```bash
# Fix permissions
chmod 644 ~/.openclaw/openclaw.json
chown $USER:$USER ~/.openclaw/openclaw.json

# Or fix entire directory
chmod -R 755 ~/.openclaw/
chown -R $USER:$USER ~/.openclaw/
```

---

## Daemon Errors

### Error: "Daemon not running"

**Cause:** OpenClaw daemon service not started

**Quick Fix:**
```bash
# Check daemon status
openclaw doctor

# Start daemon
openclaw daemon start

# Or run manually
openclaw gateway
```

---

### Error: "Failed to install daemon"

**Cause:** Missing service manager or permissions

**Quick Fix:**
```bash
# Linux (systemd)
sudo systemctl daemon-reload
sudo systemctl enable openclaw
sudo systemctl start openclaw

# macOS (launchd)
brew services start openclaw

# Or skip daemon
openclaw gateway --port 18789
```

---

## Diagnostic Commands

### Not sure what's wrong? Run diagnostics:

```bash
# Full health check
openclaw doctor

# Check version
openclaw --version

# Check gateway status
openclaw gateway status

# View logs
openclaw logs --tail 50

# Test configuration
openclaw config validate
```

---

## Still Stuck?

1. **Check logs:**
   ```bash
   openclaw logs --tail 100
   ```

2. **Reset config (last resort):**
   ```bash
   mv ~/.openclaw ~/.openclaw.backup
   openclaw onboard
   ```

3. **Get help:**
   - [OpenClaw GitHub Issues](https://github.com/openclaw/openclaw/issues)
   - [Community Discussions](https://github.com/openclaw/openclaw/discussions)
   - [Full Troubleshooting Guide](/posts/troubleshooting-doctor/)

---

## Quick Reference Card

| Error | Quick Fix |
|-------|-----------|
| `command not found` | `npm install -g openclaw` |
| `Node version too low` | `nvm install 22 && nvm use 22` |
| `Port 18789 already in use` | `lsof -i :18789` then `kill -9 [PID]` |
| `Invalid token` | Get new token from platform |
| `Configuration file not found` | `openclaw onboard` |
| `Invalid JSON` | `cat ~/.openclaw/openclaw.json \| jq .` |
| `ECONNREFUSED` | `openclaw gateway restart` |
| `EACCES` | Fix npm permissions |
| `Daemon not running` | `openclaw daemon start` |

---

## Related Guides

- [Use `openclaw doctor` for Diagnostics](/posts/troubleshooting-doctor/)
- [Node.js 22 Installation](/posts/install-node-22/)
- [Configuration Reference](/posts/config-reference/)
- [CLI Commands Reference](/posts/cli-commands/)
