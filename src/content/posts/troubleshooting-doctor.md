---
title: "OpenClaw Doctor: Complete Troubleshooting Guide"
description: "Master the openclaw doctor command to diagnose and fix OpenClaw issues. Learn how to interpret health checks and resolve common problems."
pubDate: 2026-03-09
lastUpdated: 2026-03-09
tags: ["troubleshooting", "doctor", "diagnostics", "beginner"]
difficulty: "beginner"
estimatedTime: "8 minutes"
prerequisites: ["OpenClaw installed"]
alternates:
  zhCN: "/zh-cn/posts/troubleshooting-doctor/"
---

## Overview

The `openclaw doctor` command is your first line of defense against OpenClaw issues. It performs comprehensive health checks and provides actionable solutions.

## What is OpenClaw Doctor?

`openclaw doctor` is a built-in diagnostic tool that:
- ✅ **Checks System Health:** Node.js version, npm, permissions
- ✅ **Validates Configuration:** JSON syntax, required fields
- ✅ **Tests Connectivity:** Gateway status, channel connections
- ✅ **Identifies Issues:** Clear error messages with solutions
- ✅ **Suggests Fixes:** Actionable troubleshooting steps

## Basic Usage

**Run full diagnostics:**

```bash
openclaw doctor
```

**Expected output (healthy system):**
```
✓ OpenClaw is installed: v1.0.0
✓ Node.js version: v22.3.0
✓ npm version: 10.5.0
✓ Configuration file: ~/.openclaw/openclaw.json
✓ Gateway status: Running (PID: 12345)
✓ Channels connected: 2 (telegram, discord)
✓ Health check: PASSED
```

**Output with issues:**
```
✗ OpenClaw is installed: v1.0.0
✗ Node.js version: v20.5.0 (requires v22+)
✓ npm version: 10.5.0
✓ Configuration file: ~/.openclaw/openclaw.json
✗ Gateway status: Not running
✗ Channels connected: 0
✗ Health check: FAILED

Issues found:
1. Node.js version too low
   → Fix: nvm install 22 && nvm use 22

2. Gateway not running
   → Fix: openclaw gateway start
```

## Diagnostic Checks

### 1. Installation Check

**What it checks:**
- OpenClaw version
- Installation path
- Binary integrity

**Example output:**
```
✓ OpenClaw version: v1.0.0
✓ Installation path: /usr/local/lib/node_modules/openclaw
✓ Binary location: /usr/local/bin/openclaw
```

**Common issues:**
- **"OpenClaw not found"** → Install globally: `npm install -g openclaw`
- **"Multiple versions found"** → Uninstall and reinstall

### 2. Node.js Check

**What it checks:**
- Node.js version
- npm version
- Version compatibility

**Example output:**
```
✓ Node.js version: v22.3.0
✓ npm version: 10.5.0
✓ Compatibility: OK
```

**Common issues:**
- **"Node version too low"** → Upgrade: `nvm install 22 && nvm use 22`
- **"npm not found"** → Reinstall Node.js

### 3. Configuration Check

**What it checks:**
- Config file existence
- JSON syntax
- Required fields
- File permissions

**Example output:**
```
✓ Configuration file: ~/.openclaw/openclaw.json
✓ JSON syntax: Valid
✓ Required fields: OK
✓ File permissions: 644
```

**Common issues:**
- **"Config not found"** → Run: `openclaw onboard`
- **"Invalid JSON"** → Validate: `cat ~/.openclaw/openclaw.json | jq .`
- **"Permission denied"** → Fix: `chmod 644 ~/.openclaw/openclaw.json`

### 4. Gateway Check

**What it checks:**
- Gateway status
- Port availability
- Process health
- Log errors

**Example output:**
```
✓ Gateway status: Running
✓ Port: 18789
✓ Process ID: 12345
✓ Uptime: 2 hours 15 minutes
✓ Recent errors: None
```

**Common issues:**
- **"Gateway not running"** → Start: `openclaw gateway start`
- **"Port already in use"** → Find process: `lsof -i :18789`
- **"Crashed recently"** → Check logs: `openclaw logs --tail 50`

### 5. Channel Check

**What it checks:**
- Channel configuration
- Connection status
- Authentication
- Last activity

**Example output:**
```
✓ Channels configured: 2
  - telegram: Connected (last activity: 2 minutes ago)
  - discord: Connected (last activity: 5 minutes ago)
✓ Authentication: OK
```

**Common issues:**
- **"No channels configured"** → Add channels: `openclaw onboard`
- **"Authentication failed"** → Check tokens in config
- **"Connection lost"** → Test network: `ping google.com`

## Advanced Usage

### Verbose Mode

For detailed diagnostics:

```bash
openclaw doctor --verbose
```

Includes:
- Full config dump
- Environment variables
- Network diagnostics
- Resource usage

### Specific Checks

Check only specific components:

```bash
# Check only configuration
openclaw doctor config

# Check only gateway
openclaw doctor gateway

# Check only channels
openclaw doctor channels
```

### JSON Output

For scripting/parsing:

```bash
openclaw doctor --json
```

Output:
```json
{
  "status": "failed",
  "checks": {
    "node": {"status": "passed", "version": "v22.3.0"},
    "config": {"status": "failed", "error": "Invalid JSON"},
    "gateway": {"status": "passed", "running": true}
  }
}
```

## Common Scenarios

### Scenario 1: Fresh Installation

**Problem:** Just installed, not sure if working

**Solution:**
```bash
openclaw doctor
```

Look for:
- ✓ All checks passed
- ✓ No errors reported

### Scenario 2: Gateway Not Working

**Problem:** Commands not responding

**Solution:**
```bash
openclaw doctor gateway
```

Check:
- Is gateway running?
- Is port available?
- Any errors in logs?

### Scenario 3: Channel Issues

**Problem:** Telegram/Discord not working

**Solution:**
```bash
openclaw doctor channels
```

Check:
- Is channel configured?
- Is token valid?
- Is connection active?

### Scenario 4: After Update

**Problem:** Updated OpenClaw, something broke

**Solution:**
```bash
openclaw doctor --verbose
```

Look for:
- Version compatibility
- Config format changes
- Breaking changes

## Troubleshooting Doctor Issues

### Issue: "Doctor not found"

**Cause:** OpenClaw not installed or not in PATH

**Solution:**
```bash
# Check installation
which openclaw

# Reinstall if needed
npm install -g openclaw

# Or use npx
npx openclaw doctor
```

### Issue: "Permission denied"

**Cause:** Cannot access config files

**Solution:**
```bash
# Fix permissions
chmod 644 ~/.openclaw/openclaw.json
chown $USER:$USER ~/.openclaw/openclaw.json
```

### Issue: "Timeout during check"

**Cause:** Network issue or service hung

**Solution:**
```bash
# Check network
ping google.com

# Restart gateway
openclaw gateway restart

# Try specific checks
openclaw doctor config
```

## Best Practices

1. **Run doctor regularly** (weekly or after changes)
2. **Before reporting issues**, always run `openclaw doctor`
3. **Use verbose mode** for debugging
4. **Save output** when reporting bugs
5. **Check all components**, not just failed ones

## Integration with CI/CD

**GitHub Actions example:**

```yaml
name: OpenClaw Health Check

on: [push, pull_request]

jobs:
  health-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install OpenClaw
        run: npm install -g openclaw
      - name: Run Diagnostics
        run: openclaw doctor --json
```

## Next Steps

- [Common Error Solutions](/posts/troubleshooting-common-errors/)
- [Configuration Guide](/posts/config-reference/)
- [CLI Commands Reference](/posts/cli-commands/)
- [Gateway Configuration](/posts/config-gateway/)

## Additional Resources

- [OpenClaw GitHub Issues](https://github.com/openclaw/openclaw/issues)
- [Community Discussions](https://github.com/openclaw/openclaw/discussions)
- [Diagnostic Best Practices](https://github.com/openclaw/openclaw/docs/diagnostics.md)
