---
title: Get OpenClaw Running in 10 Minutes
description: The fastest path to install OpenClaw on your machine. Covers essential installation steps, verification, and basic configuration to get your AI assistant running in under 10 minutes.
pubDate: 2026-03-11
lastUpdated: 2026-03-11
tags: ['installation', 'quick-start', 'beginner']
difficulty: beginner
estimatedTime: '10 minutes'
prerequisites: ['Node.js 22+', 'Basic terminal knowledge']
alternates:
  zhCN: /zh-cn/posts/get-openclaw-running-in-10-minutes
---

# Get OpenClaw Running in 10 Minutes

## Description

The fastest path to install OpenClaw on your machine. This guide covers the essential installation steps, verification, and basic configuration to get your AI assistant up and running in under 10 minutes.

## TL;DR

Three commands to get OpenClaw running:

```bash
# 1. Install (requires Node.js 22+)
curl -fsSL https://openclaw.ai/install.sh | bash

# 2. Run setup wizard
openclaw onboard --install-daemon

# 3. Verify installation
openclaw doctor
```

That's it. OpenClaw is now running at `http://127.0.0.1:18789/`.

**What you need**: Node.js 22+, 5 minutes, and an API key (Claude/GPT/other).

## Requirements

Before starting, ensure you have:

- **Node.js 22+** installed ([Download here](https://nodejs.org/))
- **Package manager**: npm (comes with Node.js) or pnpm
- **2 GB RAM** minimum, 4 GB recommended
- **500 MB free disk space**
- **API key** from an AI provider (recommended: [Anthropic Claude](https://console.anthropic.com/))

### Check Node.js Version

```bash
node --version
```

Expected output: `v22.0.0` or higher. If you see an older version or "command not found", install Node.js 22+ first.

## Installation Method: Choose One

### Method 1: One-Line Installer (Recommended for Beginners)

The official installer script handles everything:

**macOS / Linux / WSL2:**
```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

**Windows (PowerShell):**
```powershell
iwr -useb https://openclaw.ai/install.ps1 | iex
```

This installs OpenClaw globally and adds the `openclaw` command to your PATH.

### Method 2: npm/pnpm (For Developers)

If you already have Node.js 22+ and are comfortable with package managers:

**Using npm:**
```bash
npm install -g openclaw@latest
```

**Using pnpm (faster, recommended):**
```bash
pnpm add -g openclaw@latest
pnpm approve-builds -g
```

### Method 3: Docker (Best Isolation)

For production deployment or maximum security:

```bash
# Clone repository
git clone https://github.com/openclaw/openclaw.git
cd openclaw

# Run Docker setup
docker compose up -d
```

## Step-by-Step Setup

### Step 1: Run the Onboarding Wizard

After installation, start the setup wizard:

```bash
openclaw onboard --install-daemon
```

The wizard will guide you through:

1. **Risk acknowledgment** - OpenClaw can execute real commands, so understand the implications
2. **Onboarding mode** - Choose "QuickStart" for fastest setup
3. **API provider** - Select your AI provider (Claude recommended)
4. **API key** - Paste your API key
5. **Channel selection** - Choose messaging platforms (Telegram/Discord/WhatsApp/etc.)
6. **Skills installation** - Install optional tools (can skip for now)
7. **Gateway startup** - Start the OpenClaw gateway service

### Step 2: Configure Your API Key

**For Anthropic Claude (Recommended):**

1. Get your API key from [Anthropic Console](https://console.anthropic.com/)
2. During onboarding, paste the key when prompted
3. Choose a model: **Claude Opus 4.6** (best for long context) or **Claude Sonnet 4.6** (faster, cheaper)

**For OpenAI GPT:**

1. Get your API key from [OpenAI Platform](https://platform.openai.com/)
2. Select "OpenAI" as provider during onboarding
3. Choose GPT-4 or GPT-4 Turbo model

### Step 3: Start the Gateway

After onboarding completes, start the OpenClaw gateway:

```bash
openclaw gateway --port 18789
```

The gateway will:
- Start the control UI dashboard
- Connect to your configured channels
- Listen for incoming messages

**Access the dashboard:** Open `http://127.0.0.1:18789/` in your browser.

### Step 4: Verify Installation

Run the built-in health check:

```bash
openclaw doctor
```

Expected output:
```
[OK] Node.js v22.11.0 (minimum: v22.0.0)
[OK] OpenClaw v2026.2.6
[OK] Configuration file found at ~/.openclaw/.env
[OK] Anthropic API key valid (Claude model accessible)
[OK] Gateway listening on 127.0.0.1:18789
```

### Step 5: Send a Test Message

Test your installation by sending a message:

**Via Terminal:**
```bash
openclaw message send --to +1234567890 --message "Hello from OpenClaw!"
```

**Via Dashboard:**
1. Open `http://127.0.0.1:18789/`
2. Click "Send Message"
3. Type your message and send

**Via Messaging App:**
If you configured Telegram/Discord/WhatsApp, send a message to your bot from that app.

## Expected Output

When everything is working correctly:

1. **Dashboard loads** at `http://127.0.0.1:18789/` without errors
2. **`openclaw doctor`** shows all green `[OK]` checks
3. **Test message** gets an AI response within 2-5 seconds
4. **Gateway status** shows "running"

## Common Issues & Solutions

### Issue: "Node.js 22+ required"

**Error:**
```
Error: Node.js 22+ required. Found: v18.x.x
```

**Solution:**
Install Node.js 22+ from [nodejs.org](https://nodejs.org/) or use nvm:

```bash
# Install nvm (macOS/Linux)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install and use Node 22
nvm install 22
nvm use 22

# Verify
node --version
```

### Issue: "Port 18789 already in use"

**Error:**
```
Error: Port 18789 already in use
```

**Solution:**
Find and kill the process using port 18789:

```bash
# macOS/Linux
lsof -i :18789
kill -9 <PID>

# Or use a different port
openclaw gateway --port 18790
```

### Issue: "API key invalid or expired"

**Error:**
```
[ERROR] ANTHROPIC_API_KEY is invalid or expired
```

**Solution:**
1. Verify your API key starts with `sk-ant-` (Anthropic) or `sk-` (OpenAI)
2. Check the key hasn't been revoked in your provider console
3. Reconfigure:

```bash
openclaw configure
```

### Issue: "openclaw: command not found"

**Error:**
```
bash: openclaw: command not found
```

**Solution:**
1. Restart your terminal/shell
2. If using npm, verify global bin is in PATH:

```bash
# Check npm global bin path
npm config get prefix

# Add to PATH if needed (add to ~/.bashrc or ~/.zshrc)
export PATH="$PATH:$(npm config get prefix)/bin"
```

3. Re-run the installer script

### Issue: "EACCES permission denied"

**Error:**
```
Error: EACCES: permission denied
```

**Solution:**

On Linux/macOS, fix npm permissions:

```bash
# Create directory for global packages
mkdir ~/.npm-global

# Configure npm to use new directory
npm config set prefix '~/.npm-global'

# Add to PATH (add to ~/.bashrc or ~/.zshrc)
export PATH=~/.npm-global/bin:$PATH
```

Or use sudo (not recommended for security):

```bash
sudo npm install -g openclaw@latest
```

## Security Checklist (Important!)

Before using OpenClaw with real data:

- ✅ **Use Docker or a dedicated server** - Reduces risk if something goes wrong
- ✅ **Allowlist trusted contacts** - Limit who can access your bot
- ✅ **Enable authentication** - Don't run with `--allow-unconfigured`
- ✅ **Rotate API keys regularly** - If a key is compromised, revoke it immediately
- ✅ **Review skills before installing** - Only install trusted skills from known sources
- ✅ **Keep OpenClaw updated** - Run `openclaw update` regularly

**Configure allowlist** in `~/.openclaw/openclaw.json`:

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

## Next Steps

Congratulations! OpenClaw is now running. Here's what to do next:

1. **[Connect Your First Channel](./connect-channels)** - Integrate Telegram, WhatsApp, Discord, or other messaging platforms
2. **[Configure Your AI Model](./configure-models)** - Switch between Claude, GPT, or local models
3. **[Install Useful Skills](./install-skills)** - Add capabilities like web search, file operations, and coding tools
4. **[Deploy to VPS](./deploy-vps)** - Move from local to 24/7 cloud deployment
5. **[Security Hardening](./security-best-practices)** - Lock down your installation for production use

## Quick Reference

```bash
# Installation
curl -fsSL https://openclaw.ai/install.sh | bash

# Setup
openclaw onboard --install-daemon

# Start gateway
openclaw gateway --port 18789

# Health check
openclaw doctor

# Open dashboard
openclaw dashboard

# Check status
openclaw gateway status

# Restart gateway
openclaw gateway restart

# Update OpenClaw
openclaw update

# Reconfigure
openclaw configure
```

## Troubleshooting Tips

If you're still stuck:

1. **Run `openclaw doctor`** - Built-in diagnostics
2. **Check the logs** - `~/.openclaw/logs/`
3. **Consult official docs** - [docs.openclaw.ai](https://docs.openclaw.ai)
4. **Ask the community** - [Discord](https://discord.gg/clawd) or [Reddit](https://reddit.com/r/openclaw)
5. **Search GitHub issues** - [github.com/openclaw/openclaw/issues](https://github.com/openclaw/openclaw/issues)

Remember: Start simple, test thoroughly, then expand. Don't try to configure everything at once.

---

**Estimated time to complete**: 5-10 minutes
**Difficulty level**: Beginner
**Prerequisites**: None (beyond basic terminal knowledge)
