---
title: "Discord Bot Setup for OpenClaw - Complete Guide"
description: "Set up a Discord bot for OpenClaw in 10 minutes. Create bot in Discord Developer Portal, get token, invite to server, and configure OpenClaw."
pubDate: 2026-03-09
lastUpdated: 2026-03-09
tags: ["discord", "channels", "setup", "intermediate"]
difficulty: "intermediate"
estimatedTime: "10 minutes"
prerequisites: ["OpenClaw installed", "Discord account", "Discord server"]
alternates:
  zhCN: "/zh-cn/channels/discord/"
---

## TL;DR

Create a Discord application at discord.com/developers, create a bot, copy the token, invite bot to your server with OAuth2 URL, and add token to OpenClaw config.

## Why Discord?

Discord is excellent for OpenClaw because:
- ✅ **Server Integration:** Perfect for community servers
- ✅ **Rich Features:** Embeds, buttons, modals, slash commands
- ✅ **Voice:** Voice channel support
- ✅ **Free:** No cost for bots
- ✅ **Active Community:** Large Discord user base

## Step 1: Create Discord Application

### 1.1 Go to Discord Developer Portal
Visit [discord.com/developers/applications](https://discord.com/developers/applications)

### 1.2 Create New Application
1. Click "New Application"
2. Enter name: "OpenClaw Bot"
3. Agree to terms and click "Create"

## Step 2: Create Bot User

### 2.1 Go to Bot Section
In the left sidebar, click "Bot"

### 2.2 Add Bot
1. Click "Add Bot"
2. Confirm by clicking "Yes, do it!"

### 2.3 Copy Bot Token
1. Click "Reset Token" (if needed)
2. Click "Copy" under the token
3. **Save this token** - you'll need it for OpenClaw

### ⚠️ Keep Your Token Secret!
Anyone with your token can control your bot. Never share it publicly or commit it to git.

### 2.4 Configure Bot Settings
Under "Privileged Gateway Intents", enable:
- ☑ **Server Members Intent**
- ☑ **Message Content Intent**

Click "Save Changes"

## Step 3: Invite Bot to Server

### 3.1 Go to OAuth2 Section
In the left sidebar, click "OAuth2" > "URL Generator"

### 3.2 Select Scopes
Check these scopes:
- ☑ **bot**
- ☑ **applications.commands** (for slash commands)

### 3.3 Select Bot Permissions
Check these permissions:
- ☑ **Send Messages**
- ☑ **Embed Links**
- ☑ **Attach Files**
- ☑ **Read Message History**
- ☑ **Add Reactions**
- ☑ **Use Slash Commands**

### 3.4 Copy and Use Invite Link
1. Copy the generated URL at the bottom
2. Paste into browser
3. Select your server from dropdown
4. Click "Authorize"
5. Complete CAPTCHA if required

## Step 4: Configure OpenClaw

### 4.1 Option A: Use Onboard Wizard
```bash
openclaw onboard
```

When prompted:
```
? Which channels would you like to configure? Discord
? Enter your Discord bot token: YOUR_BOT_TOKEN
? Enter your Discord client ID: YOUR_CLIENT_ID
```

### 4.2 Option B: Edit Config File
```bash
nano ~/.openclaw/openclaw.json
```

Add Discord channel:
```json
{
  "channels": [
    {
      "type": "discord",
      "token": "YOUR_BOT_TOKEN",
      "clientId": "YOUR_CLIENT_ID",
      "intents": ["GUILDS", "GUILD_MESSAGES", "MESSAGE_CONTENT"]
    }
  ]
}
```

### 💡 Finding Client ID
In Discord Developer Portal, go to "General Information" and copy "APPLICATION ID".

## Step 5: Start OpenClaw Gateway
```bash
openclaw gateway --verbose
```

**Expected output:**
```
[INFO] Starting OpenClaw Gateway...
[INFO] Loading channels...
[INFO] Discord channel connected
[INFO] Gateway listening on port 18789
```

## Step 6: Test Your Bot

### 6.1 Invite to Server
Make sure bot is in your Discord server (from Step 3)

### 6.2 Send a Message
In any channel where the bot has access:
```
!ping
```

Or with slash commands:
```
/ping
```

Bot should respond:
```
pong
```

## Advanced Configuration

### Custom Command Prefix
```json
{
  "channels": [
    {
      "type": "discord",
      "token": "YOUR_TOKEN",
      "prefix": "oc!"
    }
  ]
}
```

### Enable Slash Commands
```json
{
  "channels": [
    {
      "type": "discord",
      "token": "YOUR_TOKEN",
      "slashCommands": true
    }
  ]
}
```

## Common Issues

### Issue: "Bot not responding"
**Solution:**
```bash
# Check gateway is running
openclaw gateway status

# Verify token is correct
# Check Discord Developer Portal

# Check bot has permissions in server
```

### Issue: "Invalid token"
**Solution:**
```bash
# Reset token in Discord Developer Portal
# Copy new token
# Update OpenClaw config
# Restart gateway
```

### Issue: "Missing access"
**Cause:** Bot lacks permissions

**Solution:**
1. Go to Discord server settings
2. Go to Roles
3. Find bot's role
4. Enable required permissions:
   - Send Messages
   - Read Messages
   - Read Message History
   - Add Reactions

### Issue: "Privileged Intents required"
**Solution:**
1. Go to Discord Developer Portal
2. Select your application
3. Go to Bot section
4. Enable "Message Content Intent"
5. Enable "Server Members Intent"
6. Save changes

## Success Criteria

Your Discord bot is working if:
- ✅ Bot appears in server member list
- ✅ Bot responds to commands (!ping or /ping)
- ✅ Bot shows as "Online" status
- ✅ Gateway logs show Discord connection
- ✅ No "Missing Access" errors

## Next Steps

- [Complete OpenClaw Setup](/posts/start/)
- [Add Telegram Channel](/posts/channels-telegram/)
- [Configure Gateway](/posts/config-gateway/)

## Additional Resources

- [Discord API Documentation](https://discord.com/developers/docs/intro)
- [OpenClaw GitHub Repository](https://github.com/openclaw/openclaw)
