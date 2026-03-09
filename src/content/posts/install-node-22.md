---
title: "Node.js 22 Verification and Upgrade Guide"
description: "OpenClaw requires Node.js 22 or higher. Learn how to check your version, upgrade Node.js safely, and fix common installation issues."
pubDate: 2026-03-09
lastUpdated: 2026-03-09
tags: ["nodejs", "installation", "troubleshooting", "beginner"]
difficulty: "beginner"
estimatedTime: "10 minutes"
prerequisites: []
alternates:
  zhCN: "/zh-cn/posts/install-node-22/"
---

## Overview

Check your Node.js version, upgrade to Node.js 22 if needed, and verify the installation with this comprehensive guide.

## Why Node.js 22?

OpenClaw requires **Node.js 22 or higher** because it uses:
- Latest ES2024 features
- Improved performance optimizations
- Enhanced security patches
- Native fetch API
- Better module resolution

## Step 1: Check Your Current Version

First, check your installed Node.js version:

```bash
node --version
```

**Expected outputs:**
- ✅ `v22.x.x` - You're ready!
- ⚠️ `v20.x.x` or lower - You need to upgrade
- ❌ `command not found` - You need to install Node.js

## Step 2: Install Node.js 22

### Option A: Using nvm (Recommended)

**nvm** (Node Version Manager) lets you install multiple Node.js versions and switch between them.

**Install nvm:**

**macOS/Linux:**
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc  # or restart terminal
```

**Windows:**
Download and install [nvm-windows](https://github.com/coreybutler/nvm-windows/releases)

**Install Node.js 22 with nvm:**
```bash
nvm install 22
nvm use 22
nvm alias default 22  # Set 22 as default
```

**Verify installation:**
```bash
node --version
# Should output: v22.x.x
```

### Option B: Using n (macOS/Linux Only)

**n** is a simple Node.js version manager.

```bash
sudo npm install -g n
sudo n 22
```

### Option C: Official Installers

Download from [nodejs.org](https://nodejs.org/):

1. Visit https://nodejs.org
2. Download the LTS version (22.x or higher)
3. Run the installer
4. Follow the installation wizard

**macOS (Homebrew):**
```bash
brew install node@22
brew link node@22
```

**Windows (Chocolatey):**
```bash
choco install nodejs-lts
```

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
```

## Step 3: Verify Installation

After installation, verify everything works:

```bash
# Check Node.js version
node --version
# Expected: v22.x.x

# Check npm version (comes with Node.js)
npm --version
# Expected: 10.x.x or higher

# Test Node.js
node -e "console.log('Node.js is working!')"
# Expected: Node.js is working!
```

## Step 4: Update npm (Optional but Recommended)

Node.js 22 comes with npm, but you might want the latest version:

```bash
npm install -g npm@latest
```

## Common Issues

### Issue: "Permission denied"
**Cause:** Trying to install globally without proper permissions

**Solution:**
```bash
# Use nvm instead (doesn't require sudo)
nvm install 22

# Or fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

### Issue: "command not found" after installation
**Cause:** Node.js not in PATH

**Solution:**
```bash
# Check if Node.js is installed
which node

# If not found, restart terminal or run:
source ~/.bashrc  # Linux/macOS
# Or restart your terminal entirely

# On Windows, restart Command Prompt or PowerShell
```

### Issue: Multiple versions installed
**Cause:** System has multiple Node.js installations

**Solution:**
```bash
# Use nvm to manage versions
nvm ls
nvm uninstall 20
nvm use 22
nvm alias default 22
```

### Issue: "Node version still shows old"
**Cause:** Shell is caching old version

**Solution:**
```bash
# Clear shell cache
hash -r

# Or restart terminal
```

## Success Criteria

✅ You're ready for OpenClaw if:
- `node --version` shows `v22.x.x` or higher
- `npm --version` works without errors
- `node -e "console.log('test')"` outputs "test"
- No "command not found" errors

## Verification Commands

```bash
# Full health check
node --version && npm --version && echo "✅ Node.js 22 ready!"

# Check if nvm is installed
command -v nvm

# List installed Node.js versions (if using nvm)
nvm ls
```

## Next Steps

- [Install OpenClaw Globally](/posts/start/)
- [Quick Start Guide](/posts/start/)
- [npm Global Installation Guide](/posts/install-npm-global/)
- [Windows + WSL2 Setup](/posts/install-windows/)

## Additional Resources

- [Node.js Official Downloads](https://nodejs.org/)
- [nvm GitHub Repository](https://github.com/nvm-sh/nvm)
- [nvm-windows](https://github.com/coreybutler/nvm-windows)
- [Node.js Release Schedule](https://github.com/nodejs/release#release-schedule)
