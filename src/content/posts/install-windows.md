---
title: "Windows + WSL2 Setup Guide for OpenClaw"
description: "Complete guide to install OpenClaw on Windows using WSL2. Set up a Linux environment on Windows for optimal OpenClaw performance."
pubDate: 2026-03-09
lastUpdated: 2026-03-09
tags: ["windows", "wsl2", "installation", "beginner"]
difficulty: "intermediate"
estimatedTime: "15 minutes"
prerequisites: ["Windows 10/11", "Admin rights"]
alternates:
  zhCN: "/zh-cn/posts/install-windows/"
---

## Overview

Install OpenClaw on Windows using WSL2 (Windows Subsystem for Linux) for the best compatibility and performance. This guide covers WSL2 setup, Node.js 22 installation, and OpenClaw configuration.

## Why WSL2 on Windows?

OpenClaw works best on Windows with WSL2 because:
- ✅ **Native Linux Support:** OpenClaw is designed for Linux environments
- ✅ **Better Performance:** Faster than native Windows for many operations
- ✅ **Full Compatibility:** All OpenClaw features work without issues
- ✅ **Easy Setup:** One-command installation
- ✅ **Seamless Integration:** Access Windows files from Linux

## Requirements

- **Windows 10 version 2004+** or **Windows 11**
- **Administrator privileges**
- **Internet connection**
- **2GB+ free disk space**

## Step 1: Enable WSL2

### Option A: Quick Install (Windows 11 Only)

Open PowerShell as Administrator and run:

```powershell
wsl --install
```

Restart your computer when prompted.

### Option B: Manual Setup (Windows 10/11)

**1. Enable WSL Feature**

Open PowerShell as Administrator:

```powershell
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
```

**2. Enable Virtual Machine Platform**

```powershell
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

**3. Restart Your Computer**

**4. Set WSL 2 as Default**

```powershell
wsl --set-default-version 2
```

**5. Install Ubuntu**

Open Microsoft Store, search "Ubuntu", and install "Ubuntu 22.04.3 LTS" or latest.

## Step 2: Initialize Ubuntu

**1. Launch Ubuntu**

- Press `Win + R`, type `ubuntu`, and press Enter
- Or search "Ubuntu" in Start menu

**2. Create UNIX Username**

When prompted, enter:
- **Username:** (your choice, e.g., `user`)
- **Password:** (choose a strong password)
- **Retype password:** (confirm password)

**3. Update System**

```bash
sudo apt update && sudo apt upgrade -y
```

## Step 3: Install Node.js 22

**1. Install NodeSource Repository**

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
```

**2. Install Node.js 22**

```bash
sudo apt install -y nodejs
```

**3. Verify Installation**

```bash
node --version
# Expected: v22.x.x

npm --version
# Expected: 10.x.x or higher
```

## Step 4: Install OpenClaw

**1. Install OpenClaw Globally**

```bash
sudo npm install -g openclaw
```

**2. Verify Installation**

```bash
openclaw --version
```

**3. Run Setup Wizard**

```bash
openclaw onboard --install-daemon
```

Note: Daemon installation might not work in WSL2. You can run gateway manually instead.

## Step 5: Configure Gateway for WSL2

Since WSL2 doesn't support systemd by default, run gateway manually:

**1. Start Gateway**

```bash
openclaw gateway --port 18789 --verbose
```

**2. Enable Auto-start (Optional)**

Add to your `~/.bashrc`:

```bash
nano ~/.bashrc
```

Add at the end:
```bash
# Start OpenClaw Gateway if not running
if ! pgrep -x "openclaw" > /dev/null; then
    openclaw gateway --port 18789 > /dev/null 2>&1 &
fi
```

Save and restart terminal.

## Step 6: Access Windows Files

OpenClaw in WSL2 can access Windows files:

**Windows Path:**
```
C:\Users\YourName\Documents
```

**WSL2 Path:**
```bash
/mnt/c/Users/YourName/Documents
```

Example: Save config to Windows Desktop:
```bash
nano /mnt/c/Users/YourName/Desktop/openclaw-config.json
```

## Step 7: Windows Terminal Setup (Recommended)

For better terminal experience:

**1. Install Windows Terminal**

Download from [Microsoft Store](https://aka.ms/terminal)

**2. Add Ubuntu Profile**

Windows Terminal should auto-detect Ubuntu. If not:

1. Open Windows Terminal
2. Go to Settings (Ctrl+,)
3. Click "Add new profile"
4. Choose "Ubuntu"

**3. Set Ubuntu as Default**

In Settings > Startup > Default profile, choose "Ubuntu".

## Advanced Configuration

### Enable systemd in WSL2 (Windows 11 only)

**1. Update WSL**

```powershell
wsl --update
```

**2. Enable systemd**

In Ubuntu terminal:

```bash
echo "[boot]" | sudo tee /etc/wsl.conf
echo "systemd=true" | sudo tee -a /etc/wsl.conf
```

**3. Restart WSL**

In PowerShell:
```powershell
wsl --shutdown
```

**4. Verify systemd**

Open Ubuntu and run:
```bash
systemctl --user
```

### Install Windows-specific Tools

**1. Install Windows Build Tools**

If you need native modules:

```bash
sudo apt install -y build-essential
```

**2. Configure Git**

```bash
git config --global core.autocrlf false
```

## Common Issues

### Issue: "WSL not installed"

**Solution:**
```powershell
# Enable WSL feature
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart

# Restart computer
```

### Issue: "ReferenceError: Permissions error"

**Cause:** npm permission issues in WSL2

**Solution:**
```bash
# Fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# Reinstall OpenClaw
npm install -g openclaw
```

### Issue: "Port 18789 already in use"

**Solution:**
```bash
# Find process
lsof -i :18789

# Kill process
kill -9 [PID]

# Or use different port
openclaw gateway --port 18790
```

### Issue: "Daemon install fails"

**Cause:** WSL2 doesn't support systemd by default

**Solution:**
Run gateway manually instead:
```bash
openclaw gateway --port 18789
```

Or enable systemd (see Advanced Configuration above).

### Issue: "Cannot connect to localhost from Windows"

**Cause:** WSL2 uses different IP

**Solution:**
Use WSL2 IP address:
```bash
# Find WSL2 IP
ip addr show eth0 | grep inet

# Or use localhost (WSL2 forwards ports)
```

## Success Criteria

✅ OpenClaw is ready on Windows if:
- WSL2 with Ubuntu is installed
- `node --version` shows `v22.x.x`
- `openclaw --version` works
- Gateway starts without errors
- Can access Windows files from WSL2

## Verification

```bash
# Full health check
node --version && npm --version && openclaw --version

# Check WSL version
wsl --list --verbose

# Test gateway
openclaw gateway --port 18789 --verbose
```

## Next Steps

- [Quick Start Guide](/posts/start/)
- [Node.js 22 Installation](/posts/install-node-22/)
- [Configure Channels](/posts/channels-telegram/)
- [Troubleshooting](/posts/troubleshooting-common-errors/)

## Additional Resources

- [WSL2 Official Documentation](https://docs.microsoft.com/en-us/windows/wsl/)
- [Windows Terminal](https://aka.ms/terminal)
- [Node.js on Windows](https://nodejs.org/)
- [OpenClaw GitHub Repository](https://github.com/openclaw/openclaw)

## Alternative: Native Windows Installation

If you prefer native Windows (not recommended):

1. Install Node.js 22 from [nodejs.org](https://nodejs.org/)
2. Install Git from [git-scm.com](https://git-scm.com/)
3. Install Python 3.11+ from [python.org](https://python.org/)
4. Install Visual Studio Build Tools
5. Run: `npm install -g openclaw`

**⚠️ Warning:** Native Windows may have compatibility issues. WSL2 is recommended.
