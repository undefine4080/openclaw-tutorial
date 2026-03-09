---
title: "Start Here: Run OpenClaw in 5 Minutes"
description: "Get OpenClaw running on your machine in just 5 minutes. This quick start guide covers installation, configuration, and sending your first message."
pubDate: 2026-03-09
lastUpdated: 2026-03-09
tags: ["quickstart", "beginner", "installation"]
difficulty: "beginner"
estimatedTime: "5 minutes"
prerequisites: ["Node.js >= 22", "npm or pnpm"]
alternates:
  zhCN: "/zh-cn/start/"
---

## TL;DR

Install OpenClaw globally, run the setup wizard, start your gateway, and send your first message—all in 5 minutes.

## What You'll Learn

- ✅ Install OpenClaw with Node.js 22
- ✅ Run the onboard setup wizard
- ✅ Start your gateway service
- ✅ Send your first message

## Requirements

- **Node.js >= 22** (Check with `node --version`)
- **npm or pnpm** (comes with Node.js)
- Terminal/command line access
- Internet connection

## Step 1: Install Node.js 22 (if needed)

OpenClaw requires Node.js version 22 or higher. Check your version:

```bash
node --version
```

If you see a version lower than 22, upgrade Node.js:

**Using nvm (recommended):**
```bash
nvm install 22
nvm use 22
```

**Using n (macOS/Linux):**
```bash
sudo n 22
```

## Step 2: Install OpenClaw Globally

Once Node.js 22 is ready, install OpenClaw:

```bash
npm install -g openclaw
```

**Expected output:**
```bash
added 1 package in 10s
```

## Step 3: Run the Onboard Wizard

The onboard wizard sets up your gateway, channels, and skills:

```bash
openclaw onboard --install-daemon
```

This will:
- Install the daemon as a user service (launchd/systemd)
- Guide you through gateway configuration
- Set up your first channel
- Install default skills

## Step 4: Start Your Gateway

Start the OpenClaw gateway manually (if not started by the wizard):

```bash
openclaw gateway --port 18789 --verbose
```

**Expected output:**
```bash
[INFO] Starting OpenClaw Gateway...
[INFO] Listening on port 18789
[INFO] Gateway ready to accept connections
```

## Step 5: Send Your First Message

Test your gateway by sending a message:

```bash
openclaw message send --to "your-number" --content "Hello, OpenClaw!"
```

## Success Criteria

You're all set if you see:
- ✅ `openclaw --version` shows a version number
- ✅ Gateway is listening on port 18789
- ✅ Daemon is running (check with `openclaw doctor`)
- ✅ Config file exists at `~/.openclaw/openclaw.json`

## Common Issues

### Issue: "Command not found"
**Cause:** OpenClaw not installed or not in PATH

**Solution:**
```bash
# Reinstall globally
npm install -g openclaw

# Or use npx (temporary)
npx openclaw [command]
```

### Issue: "Node version too low"
**Cause:** Node.js version < 22

**Solution:** Upgrade Node.js (see Step 1)

### Issue: "Port 18789 already in use"
**Cause:** Another process is using the port

**Solution:**
```bash
# Find the process
lsof -i :18789  # macOS/Linux
netstat -ano | findstr :18789  # Windows

# Kill it or use a different port
openclaw gateway --port 18790
```

## Next Steps

- [Detailed Node.js 22 Installation Guide](/posts/install-node-22/)
- [Windows + WSL2 Setup](/posts/install-windows/)
- [npm Global Installation Guide](/posts/install-npm-global/)
- [Configure Telegram Integration](/posts/channels-telegram/)
- [Use `openclaw doctor` for troubleshooting](/posts/troubleshooting-doctor/)

## Need Help?

- [Troubleshooting Guide](/posts/troubleshooting-common-errors/)
- [Official OpenClaw GitHub](https://github.com/openclaw/openclaw)
- [Community Discussions](https://github.com/openclaw/openclaw/discussions)
