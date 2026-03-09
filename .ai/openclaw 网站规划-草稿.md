# 快速上线教程网站

## 🧑‍💻 User

我想快速上线一个 openclaw 教程网站，clawtutorial.net ，快速搭上 openclaw 这波流量

具体如何操作呢？

---
## 🤖 Assistant

你现在要做的不是“做一个网站”，而是做一个**让第一次接触 openclaw 的人 5 分钟内跑起来**的产品。流量窗口期很短，MVP 只抓一件事：**最快解决新手的前三个痛点**（安装/第一个例子/常见报错）。

下面给你一套“最快上线 + 可持续 SEO”的操作方案（按 7 天能跑起来设计）。

---

## 0）先定 MVP：你首页只回答 3 个问题
**首页（必须）**
1. openclaw 是什么？一句话。
2. 我怎么开始？3 步（安装 → 运行 demo → 下一步学什么）
3. 我遇到问题去哪？（Troubleshooting）

**MVP 内容（最少 10 篇）**：这是你抢 SEO 的骨架
- Getting Started（2 篇）
 - 安装与环境要求（Win/Mac/Linux 分开写）
 - 5 分钟跑通第一个 Demo（可复制代码 + 预期输出）
- Core Tutorials（4 篇）
 - 基础概念 A（按 openclaw 的“最核心抽象”来写）
 - 基础概念 B
 - 常用 API / 模块速查（“我该用哪个”导向）
 - 项目结构与最佳实践（避免踩坑）
- Recipes（2 篇）
 - 常见任务 1（从需求出发：例如“如何做 X”）
 - 常见任务 2
- Troubleshooting（2 篇）
 - 10 个最高频报错与解决（这类最容易吃搜索流量）
 - 性能/兼容性/版本问题汇总（按版本标注）

> 关键：不要从“系统性课程”开始，而是从“搜索会来的问题”开始。

---

## 1）技术选型：用“文档站”而不是“自建 CMS”
目标是：**今天写，今天就能上线；自动生成 sitemap；页面极快；易做 SEO。**

我建议二选一（都很快）：
- **Docusaurus**（最快成型、文档体验成熟、搜索好接）
- **Astro + Starlight**（更轻、更快、更像现代内容站）

部署：
- **Cloudflare Pages** 或 **Vercel**（零运维，自动 HTTPS，CDN）

域名 `clawtutorial.net`：
- DNS 直接指向 Pages/Vercel
- 打开强制 HTTPS + 自动重定向（www → naked 或反过来，统一一个）

---

## 2）站点结构：让 Google 和用户都“一眼懂”
建议信息架构（URL 也按这个来，利于 SEO）：

- `/`（首页：快速开始入口）
- `/getting-started/installation`
- `/getting-started/hello-world`
- `/tutorials/...`
- `/recipes/...`
- `/troubleshooting/...`
- `/reference/...`（先留空也行，后续慢慢补）
- `/blog/...`（用来蹭版本更新、生态新闻、对比评测）

每篇文章顶部固定放三个模块（提高留存）：
- “你将学到什么”（3 条）
- “前置条件”（版本/环境）
- “5 分钟验证步骤”（跑通标准）

---

## 3）内容生产：用“模板化写作”保证速度与质量
你要快，但不能像 AI 垃圾场。做一个统一写作模板，所有文章都按它写：

**每篇结构：**
- TL;DR（30 秒读完）
- Step 1/2/3（每步可复制）
- 常见坑（至少 3 条）
- 下一篇推荐（强内链，SEO 核心）

**最低质量红线：**
- 每篇必须有：可运行代码 / 命令、预期输出、适用版本
- 每篇必须有：至少 2 条内部链接（引导读者走下去）

---

## 4）SEO 基础设施：上线当天就要做全
上线当天必须做的清单：
- Google Search Console 验证 + 提交 sitemap
- 自动生成 `sitemap.xml`、`robots.txt`
- 每页：Title/Description（别重复）、OG 图
- 结构化数据（Article/HowTo 任选其一，HowTo 对教程更友好）
- 站内搜索（Algolia/DocSearch 或本地搜索都行）
- 页面速度：图片压缩、代码块高亮别太重

**关键词策略（非常实用）**
你不用一开始做复杂工具，先用“搜索联想 + 竞品目录”：
- “openclaw tutorial / openclaw 安装 / openclaw example / openclaw error …”
- 每个关键词对应一篇“问题解决型”页面
这类页面最容易在窗口期拿到排名。

---

## 5）引流动作：别等“写完再推广”
上线当周就做三件事：
1. 做一个“开放式路线图”页面：`/roadmap`（告诉大家你接下来写什么，欢迎提需求）
2. 每篇文章末尾放一个很轻的订阅：
“想要我优先写哪篇？留邮箱/填表”（用 ConvertKit/beehiiv/Google Form 都行）
3. 去流量出现的地方“解决问题”，而不是硬发广告：
GitHub Discussions / Reddit / HN / Twitter/X / 国内社区（按 openclaw 的用户在哪里）

---

## 6）7 天游击上线计划（可照抄执行）
**Day 1**：确定 IA + 站点模板 + 部署打通（域名、HTTPS、sitemap）
**Day 2**：写 2 篇 Getting Started（安装 + Hello World）
**Day 3**：Troubleshooting 写 10 个错误（先占坑，后续迭代）
**Day 4**：写 2 篇 Recipes（最常见需求）
**Day 5**：写 2 篇 Core Tutorials（核心概念）
**Day 6**：全站内链、Title/Description、提交 Search Console
**Day 7**：发布“openclaw 快速开始合集”到各社区 + 收集问题反哺下一批内容

---

## 我需要你回答 3 个问题，我就能把“10 篇 MVP 目录 + 每篇标题/关键词/大纲 + 上线任务表”直接给你
1) openclaw 是什么领域的？（编程库/游戏/硬件/AI 工具？）主要用什么语言/平台？
2) 你想做中文、英文，还是双语？
3) 你上线的目的更偏：纯吃广告/收邮箱/卖课程/接咨询？（决定首页 CTA 与内容形态）

你把这 3 个问题回我，我就把 clawtutorial.net 的第一版“可立即执行”的内容与开发清单拆到天。

---
## 🧑‍💻 User

你需要在线查一下 openclaw 的信息，我做中英双语的内容，纯吃广告

---
## 🤖 Assistant

先把 openclaw 这波“流量是什么”讲清楚：**OpenClaw 是一个你运行在自己设备上的开源个人 AI 助手**，可以在你常用的聊天渠道里回复你（WhatsApp/Telegram/Slack/Discord 等），核心是本地的 Gateway 控制平面；官方推荐用 CLI onboarding 向导启动（`openclaw onboard --install-daemon`），并且运行时要求 **Node ≥ 22**。[^4]

但这里有个现实：**中文生态已经有人做了 276 篇中文文档站**（openclaw-docs），而且 SEO/sitemap/IndexNow 都做得很完整。[^1] 也有人做了资源聚合站（openclaw101）。[^5]
你如果“再做一个文档站”，很容易被压住。你要做的是：**做一个更像“搜索落地页机器”的教程站**，专门吃“安装/报错/命令/配置/渠道接入”这种强搜索意图流量，然后用广告变现。

下面是 clawtutorial.net 的具体操作方案（按“最快上线 + 最快吃搜索 + 最适合挂广告”设计）。

---

## 1）产品定位：别做“百科”，做“上手与排错的最快路径”
你的站点应该只承诺一句话：

> **“5 分钟跑起来 + 30 秒定位报错”**（中英双语）

因为 OpenClaw 的安装/向导/daemon/渠道接入点太多，用户最常搜的就是：
- install / Node 版本 / WSL2 / docker
- onboard wizard 怎么跑、跑到哪一步卡住
- gateway 起不来 / token / allowlist / dmPolicy
- Telegram/WhatsApp/Discord 接入失败
这些关键词比“OpenClaw 是什么”更能带来稳定搜索流量。[^4]

---

## 2）技术路线：用静态站 + i18n 子路径（最快、最省钱、最适合 SEO）
**推荐：Astro + Starlight**（或 Docusaurus 也行），部署 Cloudflare Pages。

**为什么：**
- 静态站首屏快，广告也更容易通过核心指标（LCP/CLS）
- 自带 sitemap，易做 `hreflang`、canonical，利于双语 SEO
- 你可以快速做“模板化页面”（错误码库、命令速查、渠道对照表）

**URL 结构（强建议）**
- 英文默认：`/en/...`
- 中文：`/zh-cn/...`
- 每页加 `rel="alternate" hreflang="en"` 和 `zh-CN`
- 同内容两语互相强链接（页头语言切换 + 页尾“Read in English/中文”）

---

## 3）信息架构：为“搜索落地”而建，不为“侧边栏好看”而建
最能吃流量的栏目是这四个：

1) **Getting Started**
- `/en/install/node-22`
- `/en/install/windows-wsl2`（官方明确 Windows 推荐 WSL2）[^4]
- `/en/start/openclaw-onboard`（官方推荐路径）[^4]

2) **CLI & Config Cheat Sheet（命令/配置速查）**
- `/en/cli/openclaw-onboard`
- `/en/cli/openclaw-gateway`
- `/en/cli/openclaw-message-send`（示例命令官方 README 就有）[^4]
- `/en/config/openclaw-json-minimal`（最小可运行 config）

3) **Channels（渠道接入落地页）**
- Telegram / WhatsApp / Discord / Slack / Feishu……
OpenClaw 的价值就在多渠道。[^4] 每个渠道都能拆出大量长尾页。

4) **Troubleshooting（报错百科）**
这是最“广告友好”的页面类型：停留时间高、回访高、关键词多。

---

## 4）内容策略：用“模板化”快速量产，但要避开抄袭陷阱
你不能照搬官方文档/现有中文站（openclaw-docs）文字，否则很难赢，也有版权风险。[^1][^4]
但你可以用统一模板把“经验型内容”写出来：

**教程页模板（中英都按同一结构）**
- TL;DR（30 秒）
- 适用版本（OpenClaw 版本/Node ≥22）[^4]
- Step 1/2/3（可复制命令）
- Expected Output（预期输出）
- Common failures（3~8 个常见坑）
- Next（强内链：下一步/相关错误）

---

## 5）你上线第一周就该写的“20 个必吃关键词页面”（中英各一份）
下面这些几乎都是高意图搜索：

**安装与上手**
1. Install OpenClaw (Node 22 requirement) [^4]
2. Install on Windows (WSL2 recommended) [^4]
3. `openclaw onboard --install-daemon` explained [^4]
4. Run Gateway: `openclaw gateway --port ... --verbose` [^4]
5. Send first message: `openclaw message send ...` [^4]
6. First agent run: `openclaw agent --message ...` [^4]

**配置**
7. Minimal `~/.openclaw/openclaw.json` example（官方 README 给了最小示例）[^4]
8. dmPolicy / allowlist 概念与常见误配（OpenClaw 默认把陌生 DM 当不可信输入）[^4]

**渠道接入（先做 4 个最热）**
9. Telegram bot token setup
10. Discord bot token setup
11. WhatsApp login & common issues
12. Feishu/Lark setup & pitfalls

**排错（你会发现这些页最赚钱）**
13. “Node version too low” / “requires Node >=22” [^4]
14. Onboard 卡在 daemon install
15. Gateway port already in use
16. Telegram 401/403 / webhook 问题
17. Discord intents / permissions
18. Message delivered but no reply（路由/allowlist）
19. “openclaw doctor” 能解决什么（官方有 doctor）[^4]
20. Updating & channels (stable/beta/dev) [^4]

---

## 6）广告变现：别急着塞满广告，先让 AdSense 过审 + 保住速度
**AdSense 过审最小要求（你上线就做）**
- About / Contact / Privacy Policy / Terms（双语）
- 站内清晰导航
- 20+ 高质量内容页（不是占位符）

**广告布局（推荐）**
- 文章正文上方 1 个（不影响首屏可读性）
- 文中 1 个（在第 2~3 屏之间）
- 文末 1 个
- 侧边栏/目录旁 1 个（桌面端）
并且务必做：懒加载、占位高度、防 CLS。

---

## 7）执行节奏（48 小时上线，7 天开始拿到索引）
**Day 1（今天）**
- Astro/Starlight 初始化 + 双语路由
- Cloudflare Pages 自动部署
- 配好 sitemap、robots、`hreflang`、OG
- 上线 6 篇（安装/上手/3 个 CLI 页）

**Day 2**
- 上线 Troubleshooting 10 页（先覆盖最常见错误）
- Google Search Console 提交 sitemap

**Day 3~7**
- 每天 4~6 页（渠道接入 + 报错页优先）
- 开始做“命令速查/配置键速查”这种可规模化页面

---

## 我现在只需要你再确认 2 件事，我就可以把“站点目录 + 每页标题/关键词/内链关系 + 广告位布局稿”直接给你
1) 你要以英文还是中文作为默认语言（首页默认 `/en` 还是 `/zh-cn`）？
2) 你是只做 AdSense，还是也接受联盟（比如云服务器/VPS/域名/AI API 代理）一起做 RPM 放大？
[^1]: [GitHub - yeuxuan/openclaw-docs: OpenClaw 中文文档站 | AI 智能体框架 源码剖析 安装教程 | WhatsApp Telegram Discord 飞书   多通道机器人](https://github.com/yeuxuan/openclaw-docs)

[^2]: [OpenClaw Chinese Documentation Hub — 276 tutorials covering installation, gateway, channels & source code deep-dives · openclaw/openclaw · Discussion #30326](https://github.com/openclaw/openclaw/discussions/30326)

[^3]: [docs: add Chinese documentation by GeekCheyun · Pull Request #30729 · openclaw/openclaw](https://github.com/openclaw/openclaw/pull/30729)

[^4]: [GitHub - openclaw/openclaw: Your own personal AI assistant. Any OS. Any Platform. The lobster way. 🦞](https://github.com/openclaw/openclaw)

[^5]: [GitHub - mengjian-github/openclaw101: 🐾 OpenClaw 101 — 从零开始，7天掌握你的AI私人助理 | 全网资源聚合站](https://github.com/mengjian-github/openclaw101)

[^6]: [Releases · openclaw/openclaw](https://github.com/openclaw/openclaw/releases)

[^7]: [Autonomous Operation - Google 搜索](https://www.google.com/search?sca_esv=ad51375bc05ed99f&q=Autonomous+Operation&sa=X&ved=2ahUKEwjli-eX7ZKTAxVRIkQIHbKXF3AQxccNegQIaBAB&mstk=AUtExfCJ620k-1k1ARFDVN-DyY6Bc7rJSeCMUnbnvBHHswMYxlZTvJs0mgqrTri4t5H5D9r0oePGqoayXtTmDHutywHwzE9QJAvR4534M_ngkekUzN6pMkNp-xVEjP6Pmtn6w8M&csui=3)

[^8]: [OpenClaw Meeting Resources - Tutorials, Tools, and Collaboration Platforms](https://www.tencentcloud.com/techpedia/140680)

[^9]: [OpenClaw Setup Guide: 25 Tools + 53 Skills Explained](https://yu-wenhao.com/en/blog/openclaw-tools-skills-tutorial/)
---
## 🧑‍💻 User

默认英文，只做 AdSense

---
## 🤖 Assistant

我这边没法“在线打开网页去查资料”（没有浏览器/联网抓取能力）。但你给我 **OpenClaw 的 GitHub 链接/README 关键段落/你现在掌握的命令与配置示例**，我就能把内容目录和每篇文章的步骤写到“可直接发布”的程度。

在你补充链接之前，我先给你一套**按英文默认、双语、只做 AdSense、最快上线并吃搜索流量**的可执行方案。你照这个做，48 小时能上线，7 天开始拿索引，2–4 周开始有可见自然流量。

---

## 1) 产品定位：别做“文档镜像”，做“搜索落地页工厂”
你要赢的不是“系统讲解”，而是这些搜索意图：

- `openclaw install` / `openclaw windows` / `openclaw node version`
- `openclaw onboard` / `openclaw gateway` / `openclaw config example`
- `openclaw telegram` / `openclaw discord` / `openclaw whatsapp`
- `openclaw error ...` / `failed to ...` / `permission denied ...`

所以 clawtutorial.net 的一句话承诺应该是：

> “Run OpenClaw in 5 minutes. Fix common errors in 30 seconds.”

这会直接决定你站点结构、内容模板、内链方式，最终决定 AdSense 的 RPM。

---

## 2) 技术选型（最省事、最利于 SEO + 广告）
**推荐：Astro + Starlight + Cloudflare Pages**（或 Vercel）

理由很简单：快、干净、天然适合文档/教程、静态站对 AdSense 也更稳（速度指标更好）。

### URL 与双语策略（默认英文）
- 英文默认：`/`（不要加 `/en`，少一层路径更利于 CTR）
- 中文：`/zh-cn/...`
- 每页都做：
 - `canonical`
 - `hreflang`（en / zh-CN）
 - 标准化标题与描述（避免两语互相竞争索引）

### 代码结构（建议）
```
/src/content/docs/...
/src/content/docs/zh-cn/...
```
每篇文章 frontmatter 固定字段：
- `title`
- `description`
- `slug`
- `lastUpdated`
- `sidebar`（可选）
- `toc`（可选）

---

## 3) 信息架构：为“收录”和“内链”而设计
你需要 5 类页面（每类都有“栏目页/Hub 页”，Hub 页很重要，能聚合权重）：

1. **Start Here（Hub）**
 - `/start/`（3 步跑通 + 指向安装/第一个 demo/排错）
2. **Install（Hub）**
 - `/install/`（按 OS 分页）
3. **CLI & Config（Hub）**
 - `/cli/`、`/config/`（速查型页面最吃长尾）
4. **Integrations / Channels（Hub）**
 - `/channels/telegram/`、`/channels/discord/`…（每个渠道一套“从 0 到通”的流程）
5. **Troubleshooting（Hub）**
 - `/troubleshooting/`（错误库：报错信息 → 原因 → 解决方案 → 相关链接）

你最终靠的就是：**大量可复用模板 + 强内链**，让搜索来的用户继续看第二页、第三页——这直接影响广告收入。

---

## 4) 内容生产：统一“教程模板”，把质量做成工业化
每篇文章固定结构（中英文同构，翻译成本最低）：

1) TL;DR（3 行内）
2) Requirements（版本/系统/权限）
3) Steps（Step 1/2/3… 每步可复制命令）
4) Expected output（用户知道“成功长什么样”）
5) Common errors（至少 3 条，带跳转到 troubleshooting）
6) Next steps（强制 2–4 条内部链接）

**关键细节**：每个 code block 旁边加 Copy 按钮；OS 用 Tabs（macOS / Linux / Windows）。

---

## 5) 首发 30 篇清单（先英文，再中文同步）
你要的不是“10 篇精品”，而是**30 篇能被搜索命中的落地页**。下面是最通用的一套（等你给我 OpenClaw 真实命令/配置后，我会把标题和关键词改到完全贴合）：

### A. Start / Install（8 篇）
- Install on macOS
- Install on Linux
- Install on Windows（含 WSL2/权限/路径坑）
- Verify installation（如何确认版本与环境）
- Quickstart: run your first command
- Create minimal config (copy-paste)
- Start the gateway/service/daemon
- Update / uninstall / clean reset

### B. CLI / Config（10 篇）
- CLI: onboard/setup wizard explained
- CLI: gateway options (port/log/verbose)
- CLI: send a test message
- Config: minimal example + explanation table
- Config: security (allowlist/dm policy/permissions)（按 OpenClaw 实际字段来）
- Config: logging & debug
- Config: proxies / network / firewall
- Environment variables reference
- Common config mistakes
- Version compatibility matrix（极其吃搜索且提升信任）

### C. Channels（6 篇）
优先做最容易带流量的 3–4 个渠道（你后面从 Search Console 看数据再加）：
- Telegram setup
- Discord setup
- Slack setup
- WhatsApp setup（若生态里确实常见）
- Webhook vs polling（如果适用）
- “Bot receives messages but doesn’t reply” 专题页（超级常见）

### D. Troubleshooting（6 篇）
- “Command not found / permission denied”
- “Port already in use”
- “Config file not found / invalid JSON”
- “401/403 token invalid”
- “Gateway starts then exits”
- “Messages delivered but no response”

> 先英文上线拿收录；中文用同 slug 结构镜像翻译（/zh-cn/…），这样你一套信息架构吃两份索引机会。

---

## 6) AdSense：一次过审 + 不伤体验的布局
你只做 AdSense，就要守住两件事：**合规** 和 **速度/体验**。

### 过审必备页面（双语）
- `/privacy-policy/`（必须写清楚 cookies、第三方广告、用户可选择退出）
- `/terms/`
- `/about/`
- `/contact/`

### 广告位策略（少而精准，别一上来就塞满）
- 文章开头（标题下方）1 个（responsive）
- 文章中部 1 个（第二个 H2 之后）
- 文末 1 个（“Next steps” 之前或之后）
- 桌面端侧栏 1 个（可选）

技术上要做：
- 预留高度（避免 CLS）
- 懒加载
- 不要把首屏挤爆（否则用户反感，反而 RPM 低）

---

## 7) 上线执行清单（48 小时版本）
**Day 1**
- 站点框架 + 部署（Cloudflare Pages）
- 域名绑定 + HTTPS + 301（www ↔ non-www 统一）
- sitemap/robots、基础 SEO（title/desc、OG）
- 先上 10 篇英文（Install/Quickstart/CLI/Config）

**Day 2**
- 上 10 篇 Troubleshooting + Channels（英文）
- Search Console 验证 + 提交 sitemap
- 上线 10 篇中文（先翻译“最能带流量”的 10 篇）

**Day 3–7**
- 每天补 4–6 篇（优先：报错页、渠道页）
- 用 Search Console 看“曝光但排名低”的关键词，针对性补页（这是最快的增长方式）

---

## 我现在需要你给我 3 个信息，我就能把“目录 + 每篇具体标题/关键词/大纲/内链图/页面文案”直接定稿
1) OpenClaw 的 **GitHub 链接**（或把 README 里“安装/配置/运行命令”那几段粘贴过来）
2) 你预计主流用户是：**Windows/WSL2 多**，还是 **macOS/Linux 多**？（决定安装页优先级）
3) 你希望中文是 **简体为主** 吗？（`/zh-cn` 我就按简体写）

你把第 1 条给我（链接或粘贴都行），我会把上面这套方案从“通用模板”变成**完全贴合 OpenClaw 的可直接开工的开发与内容任务单**。

---
## 🧑‍💻 User

https://github.com/openclaw/openclaw

---
## 🤖 Assistant

你这件事要成功，关键不在“再做一个 docs”，而在做一个**比官方更适合搜索落地 + 更适合挂 AdSense 的教程/排错站**。

基于 OpenClaw 的官方 README：它是你在自己设备上运行的个人 AI 助手，Gateway 作为控制平面，能接入 WhatsApp/Telegram/Slack/Discord/Feishu 等大量渠道；推荐用 `openclaw onboard` 向导完成 gateway / channels / skills 设置；运行环境要求 **Node ≥ 22**，常用命令包括 `openclaw gateway ...`、`openclaw message send ...`、`openclaw agent ...`；DM 默认是 pairing 策略，并可用 `openclaw pairing approve ...` 放行；同时建议用 `openclaw doctor` 检查风险配置与升级问题。[^1]

下面给你一套 **clawtutorial.net（默认英文 /zh-cn 双语、只做 AdSense）** 的“最快上线 + 最快吃流量”的执行方案。

---

## 1）定位：只做 3 种“最能来搜索”的内容
不要写“宏大教程”，先吃最确定的搜索：

1) **安装与启动（5 分钟跑通）**
- 围绕：Node 22、`npm install -g`、`openclaw onboard --install-daemon`、`openclaw gateway`。[^1]

2) **渠道接入（Telegram/Discord/Slack/WhatsApp…）**
- 围绕：token 怎么配（环境变量优先生效）、webhook/long-poll、权限与 allowlist。[^1]

3) **排错库（Troubleshooting）**
- 围绕：daemon 起不来、18789 端口、pairing 卡住、dmPolicy/allowFrom 误配、doctor 报红等。[^1]

这三类页面“内容密度高、停留时间长、回访强”，最适合 AdSense。

---

## 2）信息架构（IA）：为 SEO 和内链而设计
### URL 结构（英文默认）
- 英文：`/`、`/install/...`、`/cli/...`、`/config/...`、`/channels/...`、`/troubleshooting/...`
- 中文：`/zh-cn/...` 镜像同结构
- 每页加 `hreflang`（en / zh-CN）+ canonical，避免两语互相抢排名。

### 你第一版应该长这样（Hub 页非常重要）
- `/start/`（3 步跑通：Install → Onboard → Send first message）
- `/install/`（OS 分流 + Node 22）
- `/cli/`（命令速查）
- `/config/`（`~/.openclaw/openclaw.json`、安全策略、常见字段）
- `/channels/`（渠道总览 + 各渠道落地页）
- `/troubleshooting/`（报错索引页：按“症状/关键字/命令”三种入口）

---

## 3）首发 36 篇“必赢清单”（英文先行，中文同步翻译）
> 原则：每篇都能独立承接一个关键词；每篇都强内链到下一步。

### A. 快速开始（8）
1. `/start/` — Run OpenClaw in 5 Minutes (Node 22, onboard, gateway) [^1]
2. `/install/node-22/` — OpenClaw requires Node.js ≥ 22 (verify, upgrade) [^1]
3. `/install/npm-global/` — Install via npm/pnpm/pnpm (global) [^1]
4. `/start/onboard-install-daemon/` — `openclaw onboard --install-daemon` explained (launchd/systemd user service) [^1]
5. `/start/run-gateway/` — `openclaw gateway --port 18789 --verbose` (what you should see) [^1]
6. `/start/send-first-message/` — `openclaw message send --to ...` (first outbound test) [^1]
7. `/start/first-agent-run/` — `openclaw agent --message ... --thinking high` (first assistant run) [^1]
8. `/start/where-is-config/` — Where is `~/.openclaw/openclaw.json` & workspace path [^1]

### B. CLI 速查（8）
9. `/cli/onboard/` — `openclaw onboard` options & common failures [^1]
10. `/cli/gateway/` — `openclaw gateway` flags, port, verbose [^1]
11. `/cli/message-send/` — `openclaw message send` cookbook [^1]
12. `/cli/agent/` — `openclaw agent` thinking levels & delivery back [^1]
13. `/cli/pairing/` — `openclaw pairing approve <channel> <code>` + pairing lifecycle [^1]
14. `/cli/doctor/` — `openclaw doctor`: what it checks & how to fix risky DM policies [^1]
15. `/cli/update/` — `openclaw update --channel stable|beta|dev` (什么时候用哪个) [^1]
16. `/cli/from-source/` — Build from source (pnpm, `pnpm ui:build`, `pnpm gateway:watch`) [^1]

### C. 配置与安全（8）
17. `/config/minimal-openclaw-json/` — Minimal `~/.openclaw/openclaw.json` example [^1]
18. `/config/models/` — Model selection pointers + failover links（做“怎么选/怎么排查”，别抄官方长文）[^1]
19. `/config/dm-policy-pairing/` — dmPolicy=pairing (default) explained [^1]
20. `/config/dm-policy-open/` — How to set dmPolicy=open safely (+ allowFrom “*” implications) [^1]
21. `/config/allowlists/` — allowFrom, channel allowlists patterns [^1]
22. `/config/workspace/` — Workspace root `~/.openclaw/workspace` & skills layout [^1]
23. `/security/dm-is-untrusted/` — Treat inbound DMs as untrusted input (why pairing exists) [^1]
24. `/security/sandbox-non-main/` — Docker sandbox for non-main sessions (`agents.defaults.sandbox.mode`) [^1]

### D. 渠道接入（Telegram/Discord/Slack/WhatsApp 优先）（8）
25. `/channels/telegram/` — botToken via `TELEGRAM_BOT_TOKEN` or config (env wins) [^1]
26. `/channels/telegram-webhook/` — webhookUrl + webhookSecret + common pitfalls [^1]
27. `/channels/discord/` — `DISCORD_BOT_TOKEN` or config + dmPolicy notes [^1]
28. `/channels/slack/` — `SLACK_BOT_TOKEN` + `SLACK_APP_TOKEN` [^1]
29. `/channels/whatsapp/` — login flow (`openclaw channels login`) + allowFrom + creds location [^1]
30. `/channels/signal/` — signal-cli requirement + typical failure patterns [^1]
31. `/channels/feishu/` — Feishu/Lark entry + typical auth/config gotchas（你写“坑”就能赢）[^1]
32. `/channels/webchat/` — WebChat uses gateway WS, no extra port [^1]

### E. Troubleshooting（4 个“广告最赚钱”的入口页）
33. `/troubleshooting/gateway-not-running/` — gateway 起不来/daemon 安装失败（按 OS）[^1]
34. `/troubleshooting/port-18789/` — 18789 端口冲突/无法访问（含“如何确认 gateway 在 verbose 输出里”) [^1]
35. `/troubleshooting/pairing-no-code/` — pairing list 没有 code / approve 失败 [^1]
36. `/troubleshooting/dm-policy-misconfigured/` — dmPolicy / allowFrom 配错，`openclaw doctor` 怎么提示 [^1]

英文先上线拿索引；中文用同样 slug 镜像翻译，速度最快。

---

## 4）写作模板：你靠它规模化，同时不做“抄文档”
每篇都用同一模板（中英同构）：

- **TL;DR**（3 行：你要做什么 + 一条命令 + 成功标准）
- **Requirements**（Node ≥ 22、是否需要 WSL2、是否需要 token…）[^1]
- **Step-by-step**（每步可复制）
- **Expected output / Success checklist**（成功长什么样）
- **Common mistakes**（至少 3 条，链接到 troubleshooting）
- **Next steps**（强制 2–4 条内链：下一步/相关渠道/相关配置）

这会把“用户停留时长”和“页面之间跳转率”做上去，AdSense 才有意义。

---

## 5）技术栈建议（最适合双语 + SEO + 速度 + AdSense）
**Astro + Starlight**（或 Docusaurus 也行），部署 Cloudflare Pages。

你要的不是花哨，是：
- 构建快、首屏快（对 AdSense RPM 很重要）
- 自动 sitemap、易做 `hreflang`
- 文档型导航 + 搜索（哪怕先用本地搜索）

---

## 6）AdSense：一次过审的“最小合规集”
上线就准备（双语都要）：
- `/privacy-policy/`（明确 cookies + Google 广告）
- `/terms/`
- `/about/`（声明非官方、面向教程与排错）
- `/contact/`

广告位（克制，但有效）：
- 标题下 1 个
- 第二个 H2 后 1 个
- 文末 1 个
并且**预留高度防 CLS**，否则用户体验差、Core Web Vitals 掉，广告也卖不上价。

---

## 7）48 小时上线排期（照做就能跑）
**0–6 小时：**
- Starlight 初始化 + 双语路由 `/zh-cn`
- 部署到 Cloudflare Pages
- robots/sitemap/`hreflang`/canonical

**6–24 小时：**
- 写 12 篇英文（上面清单 A+B 各挑 6 篇）
- 把每篇“Expected output / 常见坑 / Next steps”补齐

**24–48 小时：**
- 写 12 篇 troubleshooting + channels 英文
- 同步翻译最重要的 10 篇中文
- Search Console 提交 sitemap

---

## 我只需要你再给 2 个选择，我就能把“导航栏结构 + 首页文案 + 每篇标题/description（可直接贴进 frontmatter）”给你定稿
1) 你打算用 **Cloudflare Pages 还是 Vercel**？
2) 你希望站点更像“文档”（侧边栏很重）还是更像“教程博客”（列表+搜索+落地页）？

> 如果你不想选：我建议 **Cloudflare Pages + 教程落地页风格**，因为你目标是 AdSense 和搜索流量，而不是让用户“阅读一本书”。
[^1]: [GitHub - openclaw/openclaw: Your own personal AI assistant. Any OS. Any Platform. The lobster way. 🦞](https://github.com/openclaw/openclaw)

[^2]: [GitHub - 0xtresser/OpenClaw-Book: 《深入 OpenClaw》。全网第一本介绍 OpenClaw 的书，用 OpenClaw + OpenCode + Opus 4.6 写成。A book introducing OpenClaw, written by OpenClaw + OpenCode + Opus 4.6](https://github.com/0xtresser/OpenClaw-Book)

[^3]: [OpenClaw Tutorial: Architecture Analysis & Hands-On Deployment Guide -- From Installation to Advanced Applications](https://www.meta-intelligence.tech/en/insight-openclaw-tutorial)

[^4]: [How to set up OpenClaw across WhatsApp, Telegram, Discord, Slack - LumaDock](https://lumadock.com/tutorials/openclaw-multi-channel-setup)

[^5]: [OpenClaw Deployment Guide on RamNode VPS | AI Personal Assistant](https://www.ramnode.com/guides/openclaw)

[^6]: [You Could've Invented OpenClaw](https://gist.github.com/dabit3/bc60d3bea0b02927995cd9bf53c3db32)

[^7]: [How to Install OpenClaw: Step-by-Step Guide (Formerly ClawdBot / MoltBot)](https://blog.promptlayer.com/how-to-install-openclaw-step-by-step-guide-formerly-clawdbot-moltbot/)

[^8]: [Don't Want Data in the Cloud? openclaw 100% On-Device Private AI | X-CMD | openclaw](https://www.x-cmd.com/install/openclaw/)

[^9]: [OpenClaw Setup Guide: From Zero to AI Assistant](https://www.verdent.ai/guides/openclaw-setup-guide-from-zero-to-ai-assistant)

[^10]: [OpenClaw | DigitalOcean Documentation](https://docs.digitalocean.com/products/marketplace/catalog/openclaw/)
---
## 🧑‍💻 User

Cloudflare Pages，教程博客

---
## 🤖 Assistant

好，我们就按“Cloudflare Pages + 教程博客”来做一件**极致简单、极致快**的事：让用户从 Google 进来，**30 秒看懂、3 分钟照做、遇错立刻有出口**。这才是 AdSense 站该长的样子。

下面是你可以直接开工的执行规格（包含导航、首页文案骨架、仓库结构、Cloudflare Pages 配置、AdSense 组件位、双语策略）。

---

## 1）产品原则（决定你能不能吃到这波流量）
clawtutorial.net 只坚持一个承诺：

**Run OpenClaw in 5 minutes. Fix common issues in 30 seconds.**

你不是在写“文档”，你是在做“落地页系统”：
- 每篇文章承接一个明确搜索意图（install / onboard / gateway / pairing / telegram token / port 18789 / doctor…）
- 每篇文章必须有：**复制即用命令 + 成功标准（Expected output）+ 3 个常见坑 + 下一步内链**

---

## 2）站点结构（教程博客形态，但用 Hub 页做 SEO 聚合）
### 顶部导航（英文默认）
- **Start Here** `/start/`
- **Install** `/install/`
- **CLI** `/cli/`
- **Config & Security** `/config/`
- **Channels** `/channels/`
- **Troubleshooting** `/troubleshooting/`
- **Blog** `/blog/`
- 语言切换：EN / 中文（指向同 slug 的 `/zh-cn/...`）

> “Blog”是外壳；真正吃流量的是前 6 个 Hub（聚合页），它们负责把权重分发到大量长尾文章。

### URL 规则（双语）
- 英文：`/xxx/yyy/`（不加 `/en`，更利于点击率）
- 中文：`/zh-cn/xxx/yyy/`
- 每页必须设置：
 - `canonical`
 - `hreflang`（en、zh-CN）
 - 两语互相可一键切换（页头按钮 + 页尾 “Read in 中文/English”）

---

## 3）技术栈（最适合 Pages + SEO + 速度）
用 **Astro（内容集合 Content Collections）+ 自己做一个轻主题**，不要上重文档框架把“博客感”做没了。

### 仓库结构（建议）
```
src/
  content/
    posts/                # 英文内容（主）
    posts-zh-cn/          # 中文内容
  pages/
    index.astro
    start/index.astro
    install/index.astro
    cli/index.astro
    config/index.astro
    channels/index.astro
    troubleshooting/index.astro
    blog/[...page].astro  # 列表分页
  layouts/
    BaseLayout.astro
    PostLayout.astro
  components/
    LangSwitch.astro
    AdsenseSlot.astro
    Toc.astro
public/
  _headers
  _redirects
  og/default.png
astro.config.mjs
```

### Cloudflare Pages 构建设置（关键细节：Node 版本）
OpenClaw 本身要求 Node ≥ 22（你的教程会反复提到），**你的站点构建也建议用 Node 22**，避免依赖不兼容。

做法二选一（都做更稳）：
- 仓库根目录加 `.nvmrc`：
```
  22
  ```
- Cloudflare Pages 项目设置里加环境变量：
  - `NODE_VERSION=22`

Pages 设置：
- Build command: `npm run build`
- Output directory: `dist`

---

## 4）SEO 基础设施（上线当天就要齐）
### `astro.config.mjs`（带 sitemap）
```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
site: 'https://clawtutorial.net',
integrations: [sitemap()],
});
```

### `public/_headers`（缓存与安全，别让广告拖慢）
```txt
/*
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: interest-cohort=()
Cache-Control: public, max-age=0, must-revalidate

/assets/*
Cache-Control: public, max-age=31536000, immutable
```

### `public/_redirects`（统一尾斜杠/可选）
```txt
# 如果你决定统一带尾斜杠，可不写；Astro 默认处理得也不错
```

上线后立刻做：
- Google Search Console 验证域名
- 提交 sitemap：`/sitemap-index.xml`

---

## 5）AdSense：少而准的广告位（不牺牲体验）
你只做 AdSense，核心是：**通过审核 + 不制造 CLS**。

### 必备页面（双语都要有）
- `/privacy-policy/`
- `/terms/`
- `/about/`（明确“非官方教程站”）
- `/contact/`

### 广告位策略（建议 3 个）
- 标题下 1 个（首屏后半段，别压住标题）
- 第二个 H2 后 1 个
- 文末 1 个（Next steps 前后）

### `AdsenseSlot.astro`（预留高度防 CLS）
```astro
---
const { slot, minHeight = 280 } = Astro.props;
---
<div style={`min-height:${minHeight}px`}>
<ins class="adsbygoogle"
 style="display:block"
 data-ad-client="ca-pub-XXXX"
 data-ad-slot={slot}
 data-ad-format="auto"
 data-full-width-responsive="true"></ins>
</div>
<script is:inline>
window.adsbygoogle = window.adsbygoogle || [];
window.adsbygoogle.push({});
</script>
```

> 你先把内容与结构做对，别急着把广告塞满。AdSense RPM 真正靠：页面速度、停留、翻页率。

---

## 6）内容模板（你用它“工业化”出高质量）
每篇文章（EN / 中文同构）固定结构：

1. **TL;DR**（3 行）
2. **Requirements**（Node ≥ 22、OS、权限、token）
3. **Steps**（Step 1/2/3…）
4. **Expected output**（成功标准）
5. **Common issues**（至少 3 条，链接到 troubleshooting）
6. **Next steps**（2–4 条强内链）

Frontmatter（示例）：
```md
---
title: "openclaw onboard: install daemon & finish setup"
description: "Learn what openclaw onboard does, how to install the daemon, and how to verify your gateway is running."
pubDate: "2026-03-09"
lang: "en"
slug: "start/onboard-install-daemon"
alternates:
zhCN: "/zh-cn/start/onboard-install-daemon/"
tags: ["onboard", "gateway", "install"]
---
```

---

## 7）首页文案骨架（教程博客的“产品化首页”）
你的首页不要像博客，要像“启动台”。

**Hero**
- H1：OpenClaw Tutorials & Troubleshooting
- Sub：Run OpenClaw in 5 minutes. Fix common issues in 30 seconds.
- CTA1：Start Here（`/start/`）
- CTA2：Troubleshooting（`/troubleshooting/`）

**三块卡片（最重要）**
- Install (Node 22 / Windows WSL2 / macOS / Linux)
- Onboard & Gateway（onboard、daemon、gateway、doctor）
- Channels（Telegram / Discord / Slack / WhatsApp）

**搜索框**（哪怕先用本地搜索，也要有。用户就是来“查”的。）

**免责声明（很小但要有）**
- “This site is an independent tutorial resource and not affiliated with the official OpenClaw project.”

---

## 8）第一周内容排期（英文先上、中文同步翻）
你第一周目标：**至少 24 篇（EN 24 + 中文翻译其中 12）**。否则 AdSense 审核和收录都慢。

优先 12 篇（EN 必写，中文也建议同步）：
1. Install OpenClaw (Node.js ≥ 22)
2. Install on Windows (WSL2 notes)
3. Install on macOS
4. Install on Linux
5. `openclaw onboard --install-daemon` explained
6. `openclaw gateway --port 18789 --verbose` (how to verify)
7. `openclaw message send --to ...` first message
8. Pairing: `openclaw pairing approve <channel> <code>`
9. `~/.openclaw/openclaw.json` minimal config example
10. dmPolicy=pairing vs open (safe guidance)
11. `openclaw doctor` common warnings and fixes
12. Troubleshooting: port 18789 conflict / gateway not reachable

然后再补 Channels（Telegram/Discord/Slack/WhatsApp）与对应报错页。

---

## 9）你现在就可以开工的 10 个具体动作（按顺序）
1. 注册/确认域名 DNS 在 Cloudflare
2. 新建 GitHub repo：`clawtutorial`
3. 初始化 Astro 项目 + 上面目录结构
4. Cloudflare Pages 连接 repo，一键部署
5. 配 `NODE_VERSION=22` + `.nvmrc`
6. 上线 6 篇核心英文（install/onboard/gateway/message/config/doctor）
7. 做 6 篇 troubleshooting（围绕“起不来/连不上/权限/token/端口/pairing”）
8. 翻译其中 6 篇到 `/zh-cn`
9. 上线隐私/条款/关于/联系（双语）
10. Search Console 提交 sitemap，开始看“曝光词”，每天按曝光词补页

---

### 我接下来需要你给我两项“决定性输入”，我就能把你的首发 36 篇的标题、slug、description、内链关系图一次性定稿
1) 你准备主攻哪些渠道？（Telegram/Discord/Slack/WhatsApp/飞书…选 3 个优先）
2) 你的目标用户更偏：开发者（CLI/配置多）还是普通用户（更偏“照做就行”的图文步骤）？

你回这两项，我就把 clawtutorial.net 的**首发内容地图（含每篇的关键词意图与互链）+ 首页与栏目页具体文案**直接给你。

**参考**：OpenClaw 官方仓库 README（命令、配置路径、dmPolicy、doctor、channels 等信息来源）。https://github.com/openclaw/openclaw
