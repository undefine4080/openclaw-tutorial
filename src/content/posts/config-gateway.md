---
title: "OpenClaw Gateway Configuration Guide"
description: "Complete guide to configuring OpenClaw gateway. Learn about ports, hosts, security, performance tuning, and production deployment."
pubDate: 2026-03-09
lastUpdated: 2026-03-09
tags: ["gateway", "configuration", "production", "intermediate"]
difficulty: "intermediate"
estimatedTime: "10 minutes"
prerequisites: ["OpenClaw installed", "Basic configuration"]
alternates:
  zhCN: "/zh-cn/posts/config-gateway/"
---

## Overview

Configure OpenClaw gateway for optimal performance, security, and reliability in production environments.

## Basic Configuration

### Port Configuration

**Default port:** `18789`

**Set custom port:**

```json
{
  "gateway": {
    "port": 3000
  }
}
```

**Or use CLI:**

```bash
openclaw gateway --port 3000
```

**Choosing a port:**
- Use ports > 1024 (no root required)
- Avoid common ports (80, 443, 8080)
- Document your port choice

### Host Configuration

**Listen on all interfaces:**

```json
{
  "gateway": {
    "host": "0.0.0.0"
  }
}
```

**Listen locally only:**

```json
{
  "gateway": {
    "host": "localhost"
  }
}
```

## Security Configuration

### Authentication

**Enable API authentication:**

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

**Generate secure token:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### CORS Configuration

**Allow specific origins:**

```json
{
  "gateway": {
    "cors": {
      "enabled": true,
      "origin": ["https://yourdomain.com"]
    }
  }
}
```

**Allow all origins (development only):**

```json
{
  "gateway": {
    "cors": {
      "enabled": true,
      "origin": "*"
    }
  }
}
```

### Rate Limiting

**Enable rate limiting:**

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

## Performance Tuning

### Worker Threads

**Enable multiple workers:**

```json
{
  "gateway": {
    "workers": 4
  }
}
```

**Recommended:** Number of CPU cores

### Connection Pooling

**Configure connection pool:**

```json
{
  "gateway": {
    "pool": {
      "min": 2,
      "max": 10
    }
  }
}
```

### Timeout Settings

**Set timeouts:**

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

## Logging Configuration

### Log Levels

**Set log level:**

```json
{
  "gateway": {
    "logging": {
      "level": "info"
    }
  }
}
```

**Levels:** `debug`, `info`, `warn`, `error`, `silent`

### File Logging

**Enable file logging:**

```json
{
  "gateway": {
    "logging": {
      "file": {
        "enabled": true,
        "path": "/var/log/openclaw/gateway.log",
        "maxSize": "10M",
        "maxFiles": 5
      }
    }
  }
}
```

## Production Deployment

### Environment Variables

**Use environment variables:**

```bash
export OPENCLAW_PORT=18789
export OPENCLAW_HOST=0.0.0.0
export OPENCLAW_LOG_LEVEL=info
```

**Reference in config:**

```json
{
  "gateway": {
    "port": "${OPENCLAW_PORT}",
    "host": "${OPENCLAW_HOST}"
  }
}
```

### Process Manager (PM2)

**Install PM2:**

```bash
npm install -g pm2
```

**Create ecosystem file:**

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'openclaw-gateway',
    script: 'openclaw',
    args: 'gateway',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 18789
    }
  }]
};
```

**Start with PM2:**

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Docker Deployment

**Dockerfile:**

```dockerfile
FROM node:22-alpine

WORKDIR /app

RUN npm install -g openclaw

COPY openclaw.json ./openclaw.json

EXPOSE 18789

CMD ["openclaw", "gateway"]
```

**docker-compose.yml:**

```yaml
version: '3.8'
services:
  gateway:
    build: .
    ports:
      - "18789:18789"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

**Run:**

```bash
docker-compose up -d
```

## Monitoring

### Health Checks

**Enable health endpoint:**

```json
{
  "gateway": {
    "healthCheck": {
      "enabled": true,
      "path": "/health"
    }
  }
}
```

**Check health:**

```bash
curl http://localhost:18789/health
```

### Metrics

**Enable metrics:**

```json
{
  "gateway": {
    "metrics": {
      "enabled": true,
      "path": "/metrics"
    }
  }
}
```

## Common Issues

### Issue: Port already in use

**Solution:**
```bash
lsof -i :18789
kill -9 [PID]
```

### Issue: High memory usage

**Solution:**
- Reduce worker count
- Enable connection pooling
- Set memory limits

### Issue: Slow response times

**Solution:**
- Enable rate limiting
- Use worker threads
- Optimize configuration

## Next Steps

- [CLI Commands Reference](/posts/cli-commands/)
- [Configuration Reference](/posts/config-reference/)
- [Production Deployment](/posts/)

## Additional Resources

- [OpenClaw GitHub](https://github.com/openclaw/openclaw)
- [Performance Best Practices](https://github.com/openclaw/openclaw/docs/performance.md)
