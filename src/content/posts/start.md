---
title: "Start Here: Run OpenClaw in 5 Minutes"
description: "Get OpenClaw running on your machine in just 5 minutes. This quick start guide covers installation, configuration, and sending your first message."
pubDate: 2026-03-09
lastUpdated: 2026-03-09
slug: "start"
tags: ["quickstart", "beginner", "installation"]
difficulty: "beginner"
estimatedTime: "5 minutes"
prerequisites: ["Node.js >= 22", "npm or pnpm"]
alternates:
  zhCN: "/zh-cn/start/"
---

import Layout from '../../layouts/Layout.astro';

<Layout title={frontmatter.title}>
  <article class="post">
    <header class="post-header">
      <h1 class="post-title">{frontmatter.title}</h1>
      <p class="post-description">{frontmatter.description}</p>
      <div class="post-meta">
        <span class="meta-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          {frontmatter.pubDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
        </span>
        <span class="meta-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          {frontmatter.estimatedTime}
        </span>
        <span class="meta-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
          {frontmatter.difficulty}
        </span>
      </div>
    </header>

    <div class="post-content">
      <h2>TL;DR</h2>
      <p>Install OpenClaw globally, run the setup wizard, start your gateway, and send your first message—all in 5 minutes.</p>

      <h2>What You'll Learn</h2>
      <ul>
        <li>✅ Install OpenClaw with Node.js 22</li>
        <li>✅ Run the onboard setup wizard</li>
        <li>✅ Start your gateway service</li>
        <li>✅ Send your first message</li>
      </ul>

      <h2>Requirements</h2>
      <ul>
        <li><strong>Node.js >= 22</strong> (Check with <code>node --version</code>)</li>
        <li><strong>npm or pnpm</strong> (comes with Node.js)</li>
        <li>Terminal/command line access</li>
        <li>Internet connection</li>
      </ul>

      <h2>Step 1: Install Node.js 22 (if needed)</h2>
      <p>OpenClaw requires Node.js version 22 or higher. Check your version:</p>

      <pre><code>node --version</code></pre>

      <p>If you see a version lower than 22, upgrade Node.js:</p>

      <p><strong>Using nvm (recommended):</strong></p>
      <pre><code>nvm install 22
nvm use 22</code></pre>

      <p><strong>Using n (macOS/Linux):</strong></p>
      <pre><code>sudo n 22</code></pre>

      <h2>Step 2: Install OpenClaw Globally</h2>
      <p>Once Node.js 22 is ready, install OpenClaw:</p>

      <pre><code>npm install -g openclaw</code></pre>

      <p><strong>Expected output:</strong></p>
      <pre><code>added 1 package in 10s</code></pre>

      <h2>Step 3: Run the Onboard Wizard</h2>
      <p>The onboard wizard sets up your gateway, channels, and skills:</p>

      <pre><code>openclaw onboard --install-daemon</code></pre>

      <p>This will:
  - Install the daemon as a user service (launchd/systemd)
  - Guide you through gateway configuration
  - Set up your first channel
  - Install default skills</p>

      <h2>Step 4: Start Your Gateway</h2>
      <p>Start the OpenClaw gateway manually (if not started by the wizard):</p>

      <pre><code>openclaw gateway --port 18789 --verbose</code></pre>

      <p><strong>Expected output:</strong></p>
      <pre><code>[INFO] Starting OpenClaw Gateway...
[INFO] Listening on port 18789
[INFO] Gateway ready to accept connections</code></pre>

      <h2>Step 5: Send Your First Message</h2>
      <p>Test your gateway by sending a message:</p>

      <pre><code>openclaw message send --to "your-number" --content "Hello, OpenClaw!"</code></pre>

      <h2>Success Criteria</h2>
      <p>You're all set if you see:</p>
      <ul>
        <li>✅ <code>openclaw --version</code> shows a version number</li>
        <li>✅ Gateway is listening on port 18789</li>
        <li>✅ Daemon is running (check with <code>openclaw doctor</code>)</li>
        <li>✅ Config file exists at <code>~/.openclaw/openclaw.json</code></li>
      </ul>

      <h2>Common Issues</h2>

      <h3>Issue: "Command not found"</h3>
      <p><strong>Cause:</strong> OpenClaw not installed or not in PATH</p>
      <p><strong>Solution:</strong></p>
      <pre><code># Reinstall globally
npm install -g openclaw

# Or use npx (temporary)
npx openclaw [command]</code></pre>

      <h3>Issue: "Node version too low"</h3>
      <p><strong>Cause:</strong> Node.js version < 22</p>
      <p><strong>Solution:</strong> Upgrade Node.js (see Step 1)</p>

      <h3>Issue: "Port 18789 already in use"</h3>
      <p><strong>Cause:</strong> Another process is using the port</p>
      <p><strong>Solution:</strong></p>
      <pre><code># Find the process
lsof -i :18789  # macOS/Linux
netstat -ano | findstr :18789  # Windows

# Kill it or use a different port
openclaw gateway --port 18790</code></pre>

      <h2>Next Steps</h2>
      <ul>
        <li><a href="/install/node-22/">Detailed Node.js 22 Installation Guide</a></li>
        <li><a href="/install/windows/">Windows + WSL2 Setup</a></li>
        <li><a href="/start/onboard-install-daemon/">Deep dive into the onboard wizard</a></li>
        <li><a href="/channels/telegram/">Configure Telegram Integration</a></li>
        <li><a href="/cli/doctor/">Use <code>openclaw doctor</code> for troubleshooting</a></li>
      </ul>

      <h2>Need Help?</h2>
      <ul>
        <li><a href="/troubleshooting/">Troubleshooting Guide</a></li>
        <li><a href="https://github.com/openclaw/openclaw">Official OpenClaw GitHub</a></li>
        <li><a href="https://github.com/openclaw/openclaw/discussions">Community Discussions</a></li>
      </ul>
    </div>
  </article>
</Layout>