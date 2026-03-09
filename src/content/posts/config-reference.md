---
title: "OpenClaw Configuration Reference"
description: "Complete reference for OpenClaw configuration file. All options, examples, and best practices for openclaw.json."
pubDate: 2026-03-09
lastUpdated: 2026-03-09
tags: ["configuration", "reference", "json", "beginner"]
difficulty: "beginner"
estimatedTime: "10 minutes"
prerequisites: ["OpenClaw installed"]
alternates:
  zhCN: "/zh-cn/posts/config-reference/"
---

## Overview

Complete reference for `openclaw.json` configuration file. All available options, default values, and examples.

## Configuration File Location

**Default location:** `~/.openclaw/openclaw.json`

**Custom location:**
```bash
openclaw gateway --config /path/to/config.json
```

## Complete Example

```json
{
  "gateway": {
    "port": 18789,
    "host": "localhost",
    "workers": 1
  },
  "channels": [
    {
      "type": "telegram",
      "token": "YOUR_TELEGRAM_BOT_TOKEN"
    },
    {
      "type": "discord",
      "token": "YOUR_DISCORD_BOT_TOKEN",
      "clientId": "YOUR_DISCORD_CLIENT_ID",
      "intents": ["GUILDS", "GUILD_MESSAGES", "MESSAGE_CONTENT"]
    }
  ],
  "skills": ["ping", "echo", "weather"],
  "logging": {
    "level": "info",
    "file": {
      "enabled": false
    }
  }
}
```

## Gateway Configuration

### `gateway.port`

**Type:** `number`  
**Default:** `18789`  
**Description:** Port number for gateway

```json
{
  "gateway": {
    "port": 18789
  }
}
```

### `gateway.host`

**Type:** `string`  
**Default:** `"localhost"`  
**Description:** Host address to bind to

```json
{
  "gateway": {
    "host": "0.0.0.0"
  }
}
```

**Common values:**
- `"localhost"` - Local only
- `"0.0.0.0"` - All interfaces
- `"127.0.0.1"` - Local only (IPv4)

### `gateway.workers`

**Type:** `number`  
**Default:** `1`  
**Description:** Number of worker processes

```json
{
  "gateway": {
    "workers": 4
  }
}
```

### `gateway.timeout`

**Type:** `object`  
**Description:** Request timeout settings

```json
{
  "gateway": {
    "timeout": {
      "connect": 10000,
      "read": 30000,
      "write": 30000
    }
  }
}
```

## Channel Configuration

### Telegram Channel

```json
{
  "type": "telegram",
  "token": "YOUR_BOT_TOKEN",
  "webhook": false,
  "polling": {
    "timeout": 10,
    "limit": 100
  }
}
```

**Fields:**
- `type` (required) - Must be `"telegram"`
- `token` (required) - Bot token from @BotFather
- `webhook` (optional) - Enable webhook mode
- `polling` (optional) - Polling configuration

### Discord Channel

```json
{
  "type": "discord",
  "token": "YOUR_BOT_TOKEN",
  "clientId": "YOUR_CLIENT_ID",
  "intents": ["GUILDS", "GUILD_MESSAGES", "MESSAGE_CONTENT"],
  "prefix": "!",
  "slashCommands": true
}
```

**Fields:**
- `type` (required) - Must be `"discord"`
- `token` (required) - Bot token
- `clientId` (required) - Application ID
- `intents` (optional) - Gateway intents
- `prefix` (optional) - Command prefix (default: `"!"`)
- `slashCommands` (optional) - Enable slash commands

### Slack Channel

```json
{
  "type": "slack",
  "token": "YOUR_SLACK_TOKEN",
  "signingSecret": "YOUR_SIGNING_SECRET",
  "appToken": "YOUR_APP_TOKEN"
}
```

### WhatsApp Channel

```json
{
  "type": "whatsapp",
  "token": "YOUR_WHATSAPP_TOKEN",
  "phoneNumberId": "YOUR_PHONE_NUMBER_ID"
}
```

## Logging Configuration

```json
{
  "logging": {
    "level": "info",
    "file": {
      "enabled": true,
      "path": "/var/log/openclaw/gateway.log",
      "maxSize": "10M",
      "maxFiles": 5
    }
  }
}
```

**Log levels:** `debug`, `info`, `warn`, `error`, `silent`

## Security Configuration

### Authentication

```json
{
  "gateway": {
    "auth": {
      "enabled": true,
      "token": "YOUR_SECRET_TOKEN"
    }
  }
}
```

### CORS

```json
{
  "gateway": {
    "cors": {
      "enabled": true,
      "origin": ["https://yourdomain.com"],
      "credentials": true
    }
  }
}
```

### Rate Limiting

```json
{
  "gateway": {
    "rateLimit": {
      "enabled": true,
      "windowMs": 60000,
      "max": 100
    }
  }
}
```

## Environment Variables

Configuration can use environment variables:

```json
{
  "gateway": {
    "port": "${OPENCLAW_PORT}",
    "host": "${OPENCLAW_HOST}"
  }
}
```

**Set environment:**
```bash
export OPENCLAW_PORT=18789
export OPENCLAW_HOST=localhost
```

## Validation

**Validate configuration:**

```bash
openclaw config validate
```

**Common validation errors:**

1. **Invalid JSON** - Check syntax with `jq .`
2. **Missing required fields** - Add `type` and `token` for channels
3. **Invalid port** - Use port > 1024
4. **Invalid token** - Verify token with platform

## Best Practices

1. **Secure tokens** - Never commit tokens to git
2. **Use environment variables** - For sensitive data
3. **Validate config** - Run `openclaw config validate` after changes
4. **Backup config** - Keep copy of working configuration
5. **Document custom values** - Comment your configuration

## Examples

### Minimal Configuration

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

### Production Configuration

```json
{
  "gateway": {
    "port": "${OPENCLAW_PORT}",
    "host": "0.0.0.0",
    "workers": 4,
    "auth": {
      "enabled": true,
      "token": "${OPENCLAW_AUTH_TOKEN}"
    }
  },
  "channels": [
    {
      "type": "telegram",
      "token": "${TELEGRAM_TOKEN}",
      "webhook": true
    },
    {
      "type": "discord",
      "token": "${DISCORD_TOKEN}",
      "clientId": "${DISCORD_CLIENT_ID}",
      "intents": ["GUILDS", "GUILD_MESSAGES", "MESSAGE_CONTENT"]
    }
  ],
  "logging": {
    "level": "info",
    "file": {
      "enabled": true,
      "path": "/var/log/openclaw/gateway.log"
    }
  }
}
```

## Next Steps

- [CLI Commands](/posts/cli-commands/)
- [Gateway Configuration](/posts/config-gateway/)
- [Setup Wizard](/posts/start-onboard-wizard/)

## Additional Resources

- [JSON Schema](https://json-schema.org/)
- [OpenClaw GitHub](https://github.com/openclaw/openclaw)
