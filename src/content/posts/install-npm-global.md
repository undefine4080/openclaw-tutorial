---
title: "npm Global Installation Guide for OpenClaw"
description: "Learn how to globally install OpenClaw with npm, fix PATH issues, and resolve common installation problems on macOS, Linux, and Windows."
pubDate: 2026-03-09
lastUpdated: 2026-03-09
tags: ["npm", "installation", "troubleshooting", "beginner"]
difficulty: "beginner"
estimatedTime: "8 minutes"
prerequisites: ["Node.js >= 22 installed"]
alternates:
  zhCN: "/zh-cn/posts/install-npm-global/"
---

## Overview

Install OpenClaw globally with npm so you can run it from anywhere in your terminal. This guide covers installation, PATH configuration, and troubleshooting common issues.

## What is Global Installation?

When you install a package **globally** with npm:
- ✅ The package is installed in a system-wide location
- ✅ You can run it from any directory
- ✅ It's available to all users (depending on setup)
- ✅ Binaries are added to your PATH

**Local vs Global:**
```bash
# Local (current project only)
npm install openclaw

# Global (system-wide, recommended for OpenClaw)
npm install -g openclaw
```

## Step 1: Check Prerequisites

**1. Verify Node.js Version**

```bash
node --version
```

Expected: `v22.x.x` or higher

**2. Verify npm is Installed**

```bash
npm --version
```

Expected: `10.x.x` or higher

**3. Check Current Global Location**

```bash
npm config get prefix
```

This shows where global packages are installed.

## Step 2: Install OpenClaw Globally

**Basic Installation:**

```bash
npm install -g openclaw
```

**Expected Output:**
```
added 1 package in 10s
```

**Verify Installation:**

```bash
openclaw --version
```

Expected: Version number (e.g., `1.0.0`)

## Step 3: Fix PATH Issues (If Needed)

### Problem: "command not found" after installation

This happens when npm's global bin directory is not in your PATH.

**Find Global Bin Directory:**

```bash
npm config get prefix
```

Output will be something like:
- macOS/Linux: `/usr/local` or `/home/user/.npm-global`
- Windows: `C:\Users\Username\AppData\Roaming\npm`

The bin directory is `prefix/bin` on macOS/Linux or `prefix` on Windows.

### macOS/Linux: Fix PATH

**Option A: Fix npm Permissions (Recommended)**

Create a directory for global packages:

```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
```

Add to PATH:

```bash
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

**Option B: Use nvm (Best)**

If you're using nvm, it handles PATH automatically:

```bash
nvm install 22
nvm use 22
npm install -g openclaw
```

**Option C: Manual PATH**

Add to your shell config:

```bash
# For bash
echo 'export PATH=/usr/local/bin:$PATH' >> ~/.bashrc

# For zsh
echo 'export PATH=/usr/local/bin:$PATH' >> ~/.zshrc

# Apply changes
source ~/.bashrc  # or ~/.zshrc
```

### Windows: Fix PATH

**Option A: Use nvm-windows (Recommended)**

Download [nvm-windows](https://github.com/coreybutler/nvm-windows/releases)

```powershell
nvm install 22
nvm use 22
npm install -g openclaw
```

**Option B: Manual PATH**

1. Find npm global location:
   ```powershell
   npm config get prefix
   ```

2. Add to PATH:
   - Press `Win + X`, choose "System"
   - Click "Advanced system settings"
   - Click "Environment Variables"
   - Under "User variables", edit "Path"
   - Add: `C:\Users\YourName\AppData\Roaming\npm`
   - Click OK

3. Restart terminal

## Step 4: Verify Installation

**Run these commands:**

```bash
# Check OpenClaw version
openclaw --version

# Check which command (shows path)
which openclaw  # macOS/Linux
where openclaw  # Windows

# Test command
openclaw help
```

**All commands should work without errors.**

## Step 5: Update OpenClaw

To update to the latest version:

```bash
npm update -g openclaw
```

Or reinstall:

```bash
npm uninstall -g openclaw
npm install -g openclaw
```

## Common Issues

### Issue: "EACCES: permission denied"

**Cause:** Trying to install globally without proper permissions

**Solution A: Fix npm permissions**

```bash
# Create directory for global packages
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'

# Add to PATH
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# Reinstall
npm install -g openclaw
```

**Solution B: Use nvm**

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Use Node.js 22
nvm install 22
nvm use 22

# Install OpenClaw
npm install -g openclaw
```

**Solution C: Use sudo (Not Recommended)**

```bash
# Only if options A and B don't work
sudo npm install -g openclaw
```

### Issue: "Cannot find module 'X'"

**Cause:** Missing dependencies or corrupted installation

**Solution:**

```bash
# Clear npm cache
npm cache clean --force

# Reinstall
npm uninstall -g openclaw
npm install -g openclaw
```

### Issue: "Version conflict"

**Cause:** Multiple versions installed

**Solution:**

```bash
# List global packages
npm list -g --depth=0

# Uninstall all versions
npm uninstall -g openclaw

# Install specific version
npm install -g openclaw@latest
```

### Issue: "PATH not updating"

**Cause:** Shell not reloaded

**Solution:**

```bash
# Force reload shell
source ~/.bashrc  # Linux/macOS
# Or restart terminal

# On Windows, restart Command Prompt/PowerShell
```

## Advanced Configuration

### Change Global Installation Location

```bash
# Set custom location
npm config set prefix '/custom/path'

# Add to PATH
echo 'export PATH=/custom/path/bin:$PATH' >> ~/.bashrc
```

### Use .npmrc Configuration

Create `~/.npmrc`:

```bash
nano ~/.npmrc
```

Add:
```
prefix=${HOME}/.npm-global
```

## Verification Checklist

✅ Installation successful if:
- `openclaw --version` works
- `which openclaw` shows a valid path
- `openclaw help` displays help text
- No "command not found" errors
- Can run `openclaw` from any directory

## Platform-Specific Notes

### macOS

- Use Homebrew for Node.js: `brew install node`
- Or use nvm for version management
- Permissions issues common, fix with npm prefix

### Linux

- Use NodeSource for latest Node.js
- Fix permissions with npm prefix
- Consider using nvm or n

### Windows

- Use nvm-windows for best experience
- Or install from nodejs.org
- PATH issues common, check Environment Variables

## Best Practices

1. **Use nvm/nvm-windows** for Node.js management
2. **Never use sudo** with npm (security risk)
3. **Fix permissions** with npm prefix instead
4. **Keep npm updated**: `npm install -g npm@latest`
5. **Clear cache** if issues occur

## Next Steps

- [Quick Start Guide](/posts/start/)
- [Node.js 22 Installation](/posts/install-node-22/)
- [Windows + WSL2 Setup](/posts/install-windows/)
- [Troubleshooting](/posts/troubleshooting-common-errors/)

## Additional Resources

- [npm Documentation](https://docs.npmjs.com/)
- [nvm GitHub](https://github.com/nvm-sh/nvm)
- [nvm-windows](https://github.com/coreybutler/nvm-windows)
- [Fixing npm Permissions](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally)
