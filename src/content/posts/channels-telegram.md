---
title: "Telegram Bot Setup for OpenClaw in 5 Minutes"
description: "Quick guide to set up a Telegram bot for OpenClaw. Create your bot, get the token, and connect it to OpenClaw in under 5 minutes."
pubDate: 2026-03-09
lastUpdated: 2026-03-09
tags: ["telegram", "channels", "quick-start", "beginner"]
difficulty: "beginner"
estimatedTime: "5 minutes"
prerequisites: ["OpenClaw installed", "Telegram account"]
alternates:
  zhCN: "/zh-cn/posts/channels-telegram/"
---

## Overview

Create a Telegram bot through BotFather, get your bot token, and configure OpenClaw to send and receive Telegram messages in under 5 minutes.

## Why Telegram?

Telegram is perfect for OpenClaw because:
- ✅ **Simple Setup:** Create a bot in under 2 minutes
- ✅ **Free & Unlimited:** No message limits or costs
- ✅ **Fast:** Real-time message delivery
- ✅ **Rich Features:** Photos, files, buttons, inline keyboards
- ✅ **Cross-Platform:** Works on all devices
- ✅ **Privacy:** End-to-end encryption

## Step 1: Create Telegram Bot

### 1.1 Find BotFather

1. Open Telegram
2. Search for `@BotFather` (verified blue checkmark)
3. Start a chat

### 1.2 Create New Bot

Send this command to BotFather:
```
/newbot
```

BotFather will respond:
```
Alright, a new bot. How are we going to call it? Please choose a name for your bot.
```

### 1.3 Choose Bot Name

**Bot Display Name** (what users see):
```
OpenClaw Bot
```

**Bot Username** (must end in 'bot'):
```
OpenClawBot
```

### 1.4 Get Your Token

BotFather will respond with your token:
```
Done! Congratulations on your new bot. You will find it at t.me/OpenClawBot. You can now add a description, about section and profile picture for your bot, see /help for a list of commands.

Use this token to access the HTTP API:
1234567890:ABCdefGHIjklMNOpqrsTUVwxyz

Keep your token secure and store it safely, it can be used by anyone to control your bot.
```

**⚠️ Copy this token and save it securely** - You'll need it for OpenClaw!

### 1.5 Optional: Customize Your Bot

Set a description (optional):
```
/setdescription
```

Set about text (optional):
```
/setabouttext
```

Set profile picture (optional):
```
/setuserpic
```

## Step 2: Test Your Bot

### 2.1 Find Your Bot

1. Open Telegram
2. Search for your bot username (e.g., `@OpenClawBot`)
3. Start a chat

### 2.2 Send a Message

Type `/start` and send it.

Your bot should respond (if you've set up commands):
```
Hello! I'm OpenClaw Bot.
```

## Step 3: Configure OpenClaw

### 3.1 Option A: Use Onboard Wizard

```bash
openclaw onboard
```

When prompted:
```
? Which channels would you like to configure? Telegram
? Enter your Telegram bot token: YOUR_BOT_TOKEN
```

### 3.2 Option B: Edit Config File

```bash
nano ~/.openclaw/openclaw.json
```

Add Telegram channel:
```json
{
  "channels": [
    {
      "type": "telegram",
      "token": "YOUR_BOT_TOKEN"
    }
  ]
}
```

Save the file (Ctrl+O, Enter, Ctrl+X).

## Step 4: Start OpenClaw Gateway

```bash
openclaw gateway --verbose
```

**Expected output:**
```
[INFO] Starting OpenClaw Gateway...
[INFO] Loading channels...
[INFO] Telegram channel connected
[INFO] Gateway listening on port 18789
```

## Step 5: Test Integration

### 5.1 Send Message to Bot

In your Telegram chat with the bot, send:
```
!ping
```

Bot should respond:
```
pong
```

### 5.2 Send Message from OpenClaw

```bash
openclaw message send --to "YOUR_TELEGRAM_CHAT_ID" --content "Hello from OpenClaw!"
```

**How to find your chat ID:**
1. Send a message to your bot
2. Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
3. Find `"chat":{"id":123456789}` in the response

## Advanced Configuration

### Enable Webhooks (Production)

For better performance in production:

```json
{
  "channels": [
    {
      "type": "telegram",
      "token": "YOUR_TOKEN",
      "webhook": {
        "url": "https://your-domain.com/telegram-webhook",
        "maxConnections": 100
      }
    }
  ]
}
```

### Custom Commands

```json
{
  "channels": [
    {
      "type": "telegram",
      "token": "YOUR_TOKEN",
      "commands": {
        "prefix": "!",
        "caseSensitive": false
      }
    }
  ]
}
```

### Group Chat Support

To use your bot in groups:
1. Add bot to group
2. Make bot an admin
3. Enable group privacy mode (optional):
```
/setprivacy
```

## Common Issues

### Issue: "Bot not responding"

**Solution:**
```bash
# Check gateway is running
openclaw gateway status

# Verify token is correct
# Test with BotFather's /token command

# Check logs
openclaw logs --tail 50
```

### Issue: "Bot can't message users"

**Cause:** User needs to start the bot first

**Solution:**
1. User must send `/start` to bot first
2. Or use `/setprivacy` to disable

### Issue: "Unauthorized: bot was blocked by the user"

**Cause:** User blocked the bot

**Solution:**
- Ask user to unblock bot in Telegram
- User should search for bot and send `/start`

### Issue: "Webhook already set"

**Solution:**
```bash
# Delete existing webhook
curl -X POST "https://api.telegram.org/bot<YOUR_TOKEN>/deleteWebhook"

# Or update webhook
curl -X POST "https://api.telegram.org/bot<YOUR_TOKEN>/setWebhook?url=<YOUR_WEBHOOK_URL>"
```

## Success Criteria

✅ Your Telegram bot is working if:
- Bot responds to `/start` command
- Bot responds to custom commands (e.g., `!ping`)
- Gateway logs show "Telegram channel connected"
- No "Unauthorized" errors in logs
- Messages sent via OpenClaw reach Telegram

## Next Steps

- [Complete OpenClaw Setup](/posts/start/)
- [Add Discord Channel](/posts/channels-discord/)
- [Configure Gateway](/posts/config-gateway/)
- [Advanced Bot Commands](/posts/cli-commands/)

## Additional Resources

- [Telegram Bot API](https://core.telegram.org/bots/api)
- [BotFather Commands](https://core.telegram.org/bots#botfather)
- [OpenClaw GitHub Repository](https://github.com/openclaw/openclaw)

## BotFather Quick Reference

| Command | Description |
|---------|-------------|
| `/newbot` | Create a new bot |
| `/mybots` | List your bots |
| `/setname` | Change bot name |
| `/setdescription` | Set bot description |
| `/setabouttext` | Set about text |
| `/setuserpic` | Set profile picture |
| `/setcommands` | Set command list |
| `/deletebot` | Delete bot |
| `/token` | Regenerate API token |
| `/setprivacy` | Set privacy mode |
| `/setinline` | Enable inline mode |
| `/setinlinefeedback` | Enable inline feedback |
