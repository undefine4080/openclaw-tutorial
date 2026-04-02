---
title: Agent Browser — 让 AI 拥有浏览器操控能力
description: agent-browser 是 Vercel Labs 开源的浏览器自动化工具，专为 AI Agent 设计。本文用 10 个真实场景带你了解它能干什么、怎么干、卡住了怎么办。
pubDate: 2026-04-02
lastUpdated: 2026-04-02
tags: ['agent-browser', 'browser-automation', 'skill', 'web-scraping', 'headless-browser']
difficulty: beginner
estimatedTime: '15 minutes'
prerequisites: ['已安装 OpenClaw', '基本命令行操作能力']
category: claw-hands
order: 1
featured: true
---

> agent-browser 不只是"浏览器"，它是 AI Agent 的眼睛和手——通过 accessibility tree 快照实现高效、确定性的网页操控。

---


你有没有遇到过这种情况：让 AI 帮你查个网页信息，结果它吐回来一堆乱码，或者干脆报错说"无法访问"？

原因很简单——大多数 AI Agent 的"上网"方式太简陋了。它们只能做最基础的 HTTP 请求，抓回来一段原始 HTML，遇到需要 JavaScript 渲染的页面就抓瞎，更别说登录、填表、点击按钮这些交互操作。

**agent-browser** 就是来补这块短板的。Vercel Labs 开源的无头浏览器自动化工具，专为 AI Agent 设计。简单说，它让 AI 能像人一样操作浏览器：打开网页、点击按钮、填写表单、提取数据、甚至登录网站保持会话。

这篇文章带你了解它能干什么、怎么干、卡住了怎么办。

---

## 为什么需要浏览器自动化？

OpenClaw 内置了 `web_fetch` 和 `web_search` 两个在线访问工具，大部分场景够用。但它们有明显短板：

| 能力 | web_fetch | web_search | agent-browser |
|------|-----------|------------|---------------|
| 静态页面抓取 | ✅ | - | ✅ |
| JS 渲染页面 | ❌ | - | ✅ |
| 搜索引擎 | - | ✅ | ✅ |
| 点击/填写表单 | ❌ | ❌ | ✅ |
| 登录认证 | ❌ | ❌ | ✅ |
| 截图/PDF | ❌ | ❌ | ✅ |
| 多标签页 | ❌ | ❌ | ✅ |
| 网络请求拦截 | ❌ | ❌ | ✅ |

一句话：**web_fetch 主要负责"读"，agent-browser 能"操作"**。

很多网站的内容靠 JavaScript 动态渲染，传统 HTTP 请求根本拿不到完整页面。还有些场景需要交互——登录后台、提交表单、翻页查看更多——这些只有真正的浏览器才能搞定。agent-browser 在 GitHub 上积累了 9,700+ star，是 AI 浏览器自动化领域目前最受关注的项目之一。

---

## 先把它装上

### 安装 agent-browser

agent-browser 是独立的命令行工具，先装上：

```bash
# 全局安装
npm install -g agent-browser

# 下载浏览器内核（首次使用必须执行）
agent-browser install

# Linux 用户需要额外装系统依赖
agent-browser install --with-deps
```

### 在 OpenClaw 中启用

装好后 OpenClaw 会自动识别 agent-browser 命令。你也可以去 [ClawHub](https://clawhub.ai/matrixy/agent-browser-clawdbot) 拿最新的 Skill 文件，确保 Agent 知道怎么正确使用它。

### 验证安装

跑三行命令，有输出就说明没问题：

```bash
agent-browser open https://example.com
agent-browser snapshot -i
agent-browser close
```

snapshot 输出了页面元素列表（带 ref 标记），就说明一切就绪。

> **Linux 用户注意：** Ubuntu 23.10+ 等禁用了非特权用户命名空间的系统，可能需要加 `--args "--no-sandbox"`，或者在 OpenClaw 的 agent-browser skill 里配置启动参数。

---

## 核心工作流：快照-定位-操作

agent-browser 的用法很直觉，核心就三步：

```
打开页面 → 快照获取元素 → 通过 ref 操作元素
```

### 打开页面

```bash
agent-browser open https://example.com
```

### 快照（Snapshot）

这是 agent-browser 最关键的创新。它不返回满屏的 HTML 源码，而是返回一个**可访问性树（Accessibility Tree）**的快照：

```bash
agent-browser snapshot -i
```

输出类似这样：

```
- heading "Example Domain" [ref=e1]
- link "More information..." [ref=e2]
- textbox "Email" [ref=e3]
- button "Sign In" [ref=e4]
```

每个可交互元素都有一个 `ref` 标记（如 `@e1`、`@e2`）。这就是你接下来操作的"坐标"。

### 通过 ref 操作

```bash
agent-browser fill @e3 "user@example.com"   # 填写邮箱
agent-browser click @e4                      # 点击登录
```

**为什么用 ref 而不是 CSS 选择器？**

传统 `#submit-btn` 这种选择器很脆弱——前端改个 class 名就挂。ref 基于页面的可访问性语义（ARIA 角色和标签），它识别的是"这是一个提交按钮"，不是"这是一个 class 为 btn-primary 的元素"。页面样式变了没关系，只要按钮的语义没变，ref 就还有效。

而且 ref 方案对 token 的消耗极低。根据 ProofSource 的分析，相比传统 Playwright MCP 方案，accessibility tree 方案**减少了 93% 的上下文使用量**。AI 有更多空间去"思考"，而不是被无用的 HTML 噪音淹没。

Vercel 自己的实验数据也印证了这一点：**3.5 倍**执行速度提升、**37%** token 消耗减少、**100%** 任务成功率（从 80% 提上来）。减少工具的接口面积，反而提升了 AI 的表现——约束即自由。

---

## 你能用它做什么？

前面说了原理，你可能还是觉得抽象。下面用具体例子让你感受一下 agent-browser 到底能帮什么忙。

### 从网页上"摘"信息

你想了解 Hacker News 今天有什么热门话题。用 web_fetch 拿回来的可能是一堆没渲染完的 HTML 源码，看得人头疼。agent-browser 不一样——它像人一样"看"这个页面，然后告诉你上面有什么。

```bash
agent-browser open https://news.ycombinator.com
agent-browser wait --load networkidle     # 等页面完全加载
agent-browser snapshot -i                 # "看一眼"页面
```

快照返回类似这样的结果：

```
- link "Show HN: I built a tool that..." [ref=e1]
- link "Why SQLite is all you need" [ref=e2]
- link "The future of AI agents" [ref=e3]
```

想看哪条？直接告诉 AI 对应的 ref：

```bash
agent-browser get text @e2 --json        # 读取标题全文
agent-browser get attr @e2 "href" --json  # 拿到链接地址
```

整个过程就像跟一个坐在电脑前的助手对话："帮我看看头条是什么""点开第二条""把链接给我"。只不过这个助手是 AI，而且永远不会嫌烦。

### 帮你搜索和整理资料

你在写一篇关于 AI Agent 的文章，需要搜集最新资料。可以自己打开浏览器搜、一页页翻、复制粘贴——但为什么不让 AI 代劳？

```bash
agent-browser open https://www.google.com
agent-browser snapshot -i
# AI 看到搜索框 @e1
agent-browser fill @e1 "AI agent browser automation 2026"
agent-browser press Enter
agent-browser wait --load networkidle
agent-browser snapshot -i
# AI 从搜索结果中提取每条的标题和链接
```

AI 会把搜索结果整理好给你——标题、摘要、链接，一目了然。你甚至可以让它继续翻页，或者点进某条结果深入阅读。

### 替你填表和提交

你需要在一个网站上注册账号，或者填一份重复的表单。每次都一样：姓名、邮箱、手机号、勾选同意、提交……这种机械活，交给 agent-browser 再合适不过。

```bash
agent-browser open https://example.com/register
agent-browser snapshot -i
```

AI 看到表单结构：

```
- textbox "姓名" [ref=e1]
- textbox "邮箱" [ref=e2]
- textbox "手机号" [ref=e3]
- combobox "城市" [ref=e4]
- checkbox "同意条款" [ref=e5]
- button "提交" [ref=e6]
```

一口气帮你填完：

```bash
agent-browser fill @e1 "张三"
agent-browser fill @e2 "test@mail.com"
agent-browser fill @e3 "13800138000"
agent-browser select @e4 "北京"
agent-browser check @e5
agent-browser click @e6
```

你只需要核对一遍信息对不对，不用自己一个个框去点。50 份表单要填？让它跑 50 次。

### 登录一次，以后再也不用登

你让 AI 每天帮你检查某个后台系统的数据。但系统需要登录，每次都要输用户名密码、过验证码……agent-browser 的状态保存功能就是来解决这个问题的。

登录只需要做一次：

```bash
agent-browser open https://app.example.com/login
agent-browser snapshot -i
agent-browser fill @e1 "user@example.com"
agent-browser fill @e2 "mypassword"
agent-browser click @e3

# 登录成功后，把状态存下来
agent-browser state save auth.json
```

之后每次只需要：

```bash
agent-browser state load auth.json
agent-browser open https://app.example.com/dashboard
# 已经是登录状态了
```

还有一种更省事的方式——`--session-name`，连 `save/load` 都不用手动操作：

```bash
agent-browser --session-name myapp open https://app.example.com
# 第一次登录后，后续每次自动恢复登录状态
```

就像帮你记住了"已登录"这个状态，你只需要信任它一次。

### 同时操作多个账号，互不干扰

你在测试一个网站，需要同时以管理员和普通用户的身份操作，看看两边看到的东西是不是一样。手动的话得开两个浏览器窗口，来回切换，很容易搞混。

agent-browser 的 session 机制让这件事变简单——每个 session 是一个完全隔离的浏览器，有自己独立的 Cookie、登录状态和历史记录：

```bash
# 管理员登录
agent-browser --session admin open https://app.example.com
agent-browser --session admin snapshot -i

# 普通用户同时登录（互不影响）
agent-browser --session user open https://app.example.com
agent-browser --session user snapshot -i

# 查看当前活跃的会话
agent-browser session list
```

就像雇了两个人，一个用管理员账号，一个用普通账号，各干各的，不会串。

### 把网页变成截图或 PDF

你看到一篇不错的网页文章想存下来，或者需要记录某个页面的当前状态。截图和 PDF 是最直接的方式。

```bash
agent-browser screenshot page.png           # 当前视口截图
agent-browser screenshot --full page.png    # 完整页面（从头到尾）
agent-browser pdf report.pdf               # 导出 PDF
```

还有一个贴心的功能——`--annotate`（标注截图）。它会在截图上给每个可交互元素标上编号，和快照里的 ref 一一对应：

```bash
agent-browser screenshot --annotate page.png
```

拿着截图就知道：[1] 号是提交按钮，[2] 号是首页链接，[3] 号是邮箱输入框。截图和命令之间有了清晰的映射，不用猜。

### 监控网页变化

你在等一个商品降价，或者想知道某个网站的改版情况。天天自己刷新太傻了，让 AI 帮你盯着。

agent-browser 内置了 `diff`（差异对比）功能，能在两次快照之间做对比，告诉你页面哪里变了：

```bash
# 先保存当前状态作为基线
agent-browser open https://example.com/product
agent-browser snapshot -i > baseline.txt

# 稍后再来，检查变化
agent-browser open https://example.com/product
agent-browser diff snapshot --baseline baseline.txt
```

除了文字对比，还能做视觉像素对比——截图级别的差异检测：

```bash
agent-browser diff screenshot --baseline before.png
```

甚至可以直接对比两个不同的网址，不用提前存基线：

```bash
agent-browser diff url https://v1.com https://v2.com
```

配合 OpenClaw 的 cron 定时任务，就能全自动监控：每天早上 9 点检查，有变化就通知你。

### 直接在页面上跑代码

有时候快照拿不到你要的数据——比如价格藏在一个嵌套很深的元素里，或者某个数值是 JS 动态算出来的。这时候直接在页面上执行 JavaScript，想拿什么拿什么：

```bash
agent-browser eval "Array.from(document.querySelectorAll('a')).map(a => a.href)"
agent-browser eval "document.querySelector('.price')?.innerText"

# 复杂脚本可以用 --stdin 传入
cat script.js | agent-browser eval --stdin
```

快照和 ref 解决不了的问题，eval 大部分都能搞定。能力越大，越需要谨慎使用。

### 直接操控你已经打开的浏览器

你正在 Chrome 里浏览某个网站，已经登录了，页面就在眼前。这时候想让 AI 帮你在这个页面上做点什么——提取数据、点击按钮、填个表单。但不想重新开一个浏览器再登录一遍。

agent-browser 可以直接"接手"你正在用的 Chrome。

**方式一：指定端口。** 先用调试模式启动 Chrome（加 `--remote-debugging-port=9222`），然后：

```bash
agent-browser connect 9222
agent-browser snapshot -i
```

**方式二：自动发现（零配置）。** `--auto-connect` 会自动找到你正在运行的 Chrome：

```bash
agent-browser --auto-connect snapshot -i
```

连上之后，AI 就像坐在你旁边一样，能看到你看到的所有内容，也能帮你操作。不用重新登录，不用开新窗口。

这个能力还能用来控制 Electron 桌面应用——VS Code、Slack、Discord——它们本质上都是 Chromium。没错，AI 可以帮你操作这些桌面软件。

### 拦截和伪造网络请求

你在测试一个网站，想看看广告全屏蔽掉之后长什么样，或者模拟 API 返回错误看看前端会不会崩。手动拦截网络请求？不可能。但 agent-browser 可以：

```bash
agent-browser network route "**/ads/*" --abort           # 屏蔽广告
agent-browser network route "**/api/*" --body '{"status": "ok"}'  # 伪造响应
agent-browser network requests --filter api              # 查看请求记录
```

不用搭 mock 服务器，一行命令搞定。

---

## 出了问题怎么办？

### 元素找不到 / ref 失效

**现象：** 执行 `click @e3` 报错，说找不到元素。

**原因：** 页面发生了变化（导航、DOM 更新、弹窗），之前的 ref 过期了。ref 和快照绑定——页面变了，ref 就失效。

**解决：** 重新获取快照：

```bash
agent-browser snapshot -i
```

还是找不到？试试扩大范围。默认 `-i` 只显示标准交互元素（按钮、链接、输入框），有些自定义的可点击元素（比如 `div` 模拟的按钮）会被漏掉，加 `-C`：

```bash
agent-browser snapshot -i -C
```

也可以缩小范围只看特定区域：

```bash
agent-browser snapshot -i -s "#main-content"
agent-browser snapshot -i -d 3
```

### 页面没加载完

**现象：** 快照里看不到期望的元素，内容不完整。

**原因：** 页面还在加载，JS 还没渲染完。特别是 SPA（单页应用），内容是异步加载的。

**解决：** 等页面稳定：

```bash
agent-browser wait --load networkidle     # 等网络请求全部完成
agent-browser wait --text "Welcome"       # 等特定文字出现
agent-browser wait --url "**/dashboard"   # 等特定 URL
agent-browser wait @e5                    # 等特定元素可见
agent-browser wait --fn "document.querySelector('.loaded') !== null"  # 等 JS 条件
```

经验法则：每次页面导航或重大操作后，先 `wait` 再 `snapshot`。

### 超时 / daemon 无响应

**现象：** 命令执行很久没反应，或者报超时错误。

**原因：** 默认操作超时 25 秒，某些慢页面不够用。

**解决：**

```bash
export AGENT_BROWSER_DEFAULT_TIMEOUT=45000
```

daemon 本身挂了就关掉重来：

```bash
agent-browser close
agent-browser open https://example.com
```

### 登录状态丢失

**现象：** 明明之前登录成功了，下次打开又要登录。

**原因：** 默认情况下，浏览器关闭后 Cookie 和 localStorage 就丢了。

**解决：** 三种持久化方案任选：

```bash
# 方案一：手动 save/load
agent-browser state save auth.json
agent-browser state load auth.json

# 方案二：自动持久化
agent-browser --session-name myapp open https://example.com

# 方案三：持久化浏览器配置文件
agent-browser --profile ~/.myapp-profile open https://example.com
```

### 复杂 SPA 页面交互

**现象：** React/Vue 等单页应用，页面状态变化频繁，元素忽隐忽现。

**解决策略：**

1. **每次操作后重新快照**——不要假设页面状态没变
2. **用 `wait` 等待动态内容**——不要靠 `sleep`
3. **缩小快照范围**——用 `-s` 限定区域，减少噪音
4. **打开 headed 模式调试**——看看浏览器里到底在发生什么：

```bash
agent-browser open https://example.com --headed
```

5. **查看控制台错误**——有时候是页面本身报错了：

```bash
agent-browser console
agent-browser errors
```

---

## 还能更进一步

掌握基本用法后，agent-browser 还有更多高级能力可以探索。

**官方内置 Skill（基于 agent-browser 封装的上层应用）：**

- **dogfood** — 让 AI 像个 QA 工程师一样系统测试你的网站，自动发现 bug 和体验问题，生成带截图的结构化报告
- **electron** — 通过 CDP 协议控制 VS Code、Slack、Discord、Notion 等 Electron 应用
- **vercel-sandbox** — 在 Vercel 的 microVM 中跑浏览器，适合生产环境

**云端浏览器：**

无服务器环境（CI/CD、云函数）里本地浏览器不可用时，可以连云端浏览器服务：

```bash
agent-browser -p browserless open https://example.com    # Browserless
agent-browser -p browserbase open https://example.com    # Browserbase
agent-browser -p kernel open https://example.com         # Kernel
```

**iOS 自动化：**

macOS 上甚至可以控制 iOS 模拟器里的 Safari：

```bash
agent-browser -p ios --device "iPhone 16 Pro" open https://example.com
```

---

记住三句话就够了：**操作前先快照**（`snapshot -i`）、**页面变了重新快照**（ref 和快照绑定，过期就废了）、**操作后要等待**（`wait --load networkidle` 能解决大部分时序问题）。

有问题查 `agent-browser --help` 或访问 [agent-browser.dev](https://agent-browser.dev)。
