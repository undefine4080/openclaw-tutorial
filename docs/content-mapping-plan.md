# OpenClaw 教程网站 - 文章目录映射方案

## 1. 教程分类体系

### 1.1 分类总览

我们将教程内容组织为 7 个主要主题，每个主题对应 OpenClaw 的一个核心能力或使用场景：

```
01 新手上路
02 初始化小龙虾
03 小龙虾的眼睛
04 小龙虾的手脚
05 小龙虾的大脑
06 必备技能包
07 多 Agents 能力
```

### 1.2 分类详细说明

#### 01 新手上路

**目标用户**：刚开始接触 OpenClaw 的用户
**学习目标**：快速搭建第一个可用的 OpenClaw 实例
**预计文章数**：5-8 篇

**包含主题**：
- 模型接入（LLM 提供商配置）
- 飞书集成
- 微信集成
- QQ 集成
- 企业微信集成
- Slack 集成（可选）

#### 02 初始化小龙虾

**目标用户**：已完成基础安装，想要深入配置的用户
**学习目标**：理解并配置 OpenClaw 的核心配置文件
**预计文章数**：3-5 篇

**包含主题**：
- AGENTS.md 配置详解
- USER.md 配置详解
- SOUL.md 配置详解
- GATEWAY.md 配置（如有）
- 环境变量配置

#### 03 小龙虾的眼睛

**目标用户**：想要使用视觉能力的用户
**学习目标**：配置和使用 OpenClaw 的图像理解能力
**预计文章数**：4-6 篇

**包含主题**：
- 视觉能力基础
- 图像处理入门
- 视频理解
- 多模态模型配置
- OCR 文字识别
- 图像分析实战案例

#### 04 小龙虾的手脚

**目标用户**：需要集成外部服务的开发者
**学习目标**：使用工具调用和 API 集成扩展 OpenClaw 能力
**预计文章数**：5-7 篇

**包含主题**：
- 工具调用机制
- API 集成基础
- Function Calling 实战
- Webhook 配置
- 自动化工作流
- 第三方服务集成案例
- 自定义工具开发

#### 05 小龙虾的大脑

**目标用户**：需要长期记忆和复杂协作的用户
**学习目标**：配置记忆系统和多 Agent 协作
**预计文章数**：4-6 篇

**包含主题**：
- 记忆系统基础
- 向量数据库配置
- 上下文管理
- Agent 协作机制
- 知识库构建
- 长期对话管理

#### 06 必备技能包

**目标用户**：所有用户，按角色分流
**学习目标**：掌握常用技能和最佳实践
**预计文章数**：15-20 篇

**子分类**：

**新手必备**：
- 基础对话技巧
- 常用命令
- 日志查看
- 问题排查基础

**开发者热门**：
- 代码生成辅助
- 调试技巧
- API 开发
- 性能优化

**自媒体热门**：
- 内容创作辅助
- 文案生成
- 素材处理
- 自动化发布

**热门通用**：
- 文档处理
- 数据分析
- 邮件处理
- 日程管理

#### 07 多 Agents 能力

**目标用户**：高级用户，需要复杂协作场景
**学习目标**：配置和管理多个 Agent 协作
**预计文章数**：6-8 篇

**基础入门**：
- 多 Agent 架构概述
- 创建多个 Agent
- Agent 间通信
- 协作模式

**进阶技巧**：
- 复杂协作场景
- 性能优化
- 故障恢复
- 最佳实践

## 2. 现有文章分类映射

### 2.1 现有文章列表

当前有 14 篇英文文章 + 14 篇中文文章：

1. `start.md` - Start Here: Run OpenClaw in 5 Minutes
2. `start-onboard-wizard.md` - 使用向导快速开始
3. `channels-telegram.md` - Telegram 集成
4. `channels-discord.md` - Discord 集成
5. `install-node-22.md` - 安装 Node.js 22
6. `install-windows.md` - Windows 安装指南
7. `install-npm-global.md` - 全局安装 OpenClaw
8. `install-openclaw-on-ubuntu-desktop.md` - Ubuntu 桌面安装
9. `troubleshooting-common-errors.md` - 常见错误排查
10. `troubleshooting-doctor.md` - 诊断工具
11. `config-gateway.md` - Gateway 配置
12. `config-reference.md` - 配置参考
13. `cli-commands.md` - CLI 命令
14. `get-openclaw-running-in-10-minutes.md` - 10 分钟快速开始

### 2.2 映射方案

#### 映射到 "新手上路" (01-getting-started)

| 现有文章 | 新位置 | 处理方式 |
|---------|--------|---------|
| `channels-telegram.md` | `/tutorials/01-getting-started/channels-telegram/` | 移动 |
| `channels-discord.md` | `/tutorials/01-getting-started/channels-discord/` | 移动 |

#### 映射到 "初始化小龙虾" (02-initialization)

| 现有文章 | 新位置 | 处理方式 |
|---------|--------|---------|
| `config-gateway.md` | `/tutorials/02-initialization/config-gateway/` | 移动 |
| `config-reference.md` | `/tutorials/02-initialization/config-reference/` | 移动 |

#### 映射到 "必备技能包" (06-essential-skills)

| 现有文章 | 新位置 | 处理方式 |
|---------|--------|---------|
| `cli-commands.md` | `/tutorials/06-essential-skills/beginner/cli-commands/` | 移动 |

#### 映射到 "安装部署" (installation)

| 现有文章 | 新位置 | 处理方式 |
|---------|--------|---------|
| `install-node-22.md` | `/installation/local-nodejs/` | 移动 |
| `install-windows.md` | `/installation/local-windows/` | 移动 |
| `install-npm-global.md` | `/installation/local-npm-global/` | 移动 |
| `install-openclaw-on-ubuntu-desktop.md` | `/installation/local-ubuntu/` | 移动 |

#### 映射到 "疑难解答" (troubleshooting)

| 现有文章 | 新位置 | 处理方式 |
|---------|--------|---------|
| `troubleshooting-common-errors.md` | `/troubleshooting/common-errors/` | 移动 |
| `troubleshooting-doctor.md` | `/troubleshooting/doctor/` | 移动 |

#### 保留在首页

| 现有文章 | 新位置 | 处理方式 |
|---------|--------|---------|
| `start.md` | `/` (首页 Hero 区域引用) | 保留 |
| `start-onboard-wizard.md` | `/` (首页 Hero 区域引用) | 保留 |
| `get-openclaw-running-in-10-minutes.md` | `/` (首页 Hero 区域引用) | 保留 |

### 2.3 重定向策略

为了保证旧链接仍然有效，需要设置重定向：

```javascript
// src/pages/posts/[slug].astro（保留用于重定向）
export async function getStaticPaths() {
  const redirects = [
    { old: 'channels-telegram', new: '/tutorials/01-getting-started/channels-telegram/' },
    { old: 'channels-discord', new: '/tutorials/01-getting-started/channels-discord/' },
    { old: 'config-gateway', new: '/tutorials/02-initialization/config-gateway/' },
    { old: 'config-reference', new: '/tutorials/02-initialization/config-reference/' },
    { old: 'cli-commands', new: '/tutorials/06-essential-skills/beginner/cli-commands/' },
    { old: 'install-node-22', new: '/installation/local-nodejs/' },
    { old: 'install-windows', new: '/installation/local-windows/' },
    { old: 'install-npm-global', new: '/installation/local-npm-global/' },
    { old: 'install-openclaw-on-ubuntu-desktop', new: '/installation/local-ubuntu/' },
    { old: 'troubleshooting-common-errors', new: '/troubleshooting/common-errors/' },
    { old: 'troubleshooting-doctor', new: '/troubleshooting/doctor/' },
  ];

  return redirects.map(redirect => ({
    params: { slug: redirect.old },
    props: { redirectTo: redirect.new },
  }));
}
```

## 3. 缺失文章清单

### 3.1 01 新手上路 - 需要创建的文章

**优先级：P0（核心内容）**

- [ ] `model-integration.md` - 模型接入指南（OpenAI、Claude、智谱等）
- [ ] `channel-feishu.md` - 飞书集成
- [ ] `channel-wechat.md` - 微信集成
- [ ] `channel-qq.md` - QQ 集成
- [ ] `channel-wecom.md` - 企业微信集成

**优先级：P1（扩展内容）**

- [ ] `channel-slack.md` - Slack 集成
- [ ] `channel-whatsapp.md` - WhatsApp 集成

### 3.2 02 初始化小龙虾 - 需要创建的文章

**优先级：P0**

- [ ] `agents-config.md` - AGENTS.md 详解
- [ ] `user-config.md` - USER.md 详解
- [ ] `soul-config.md` - SOUL.md 详解
- [ ] `environment-variables.md` - 环境变量配置

**优先级：P1**

- [ ] `workspace-structure.md` - 工作空间结构说明

### 3.3 03 小龙虾的眼睛 - 需要创建的文章

**优先级：P0**

- [ ] `vision-basics.md` - 视觉能力基础
- [ ] `image-processing.md` - 图像处理入门
- [ ] `multimodal-models.md` - 多模态模型配置

**优先级：P1**

- [ ] `video-understanding.md` - 视频理解
- [ ] `ocr-guide.md` - OCR 文字识别
- [ ] `vision-cases.md` - 视觉能力实战案例

### 3.4 04 小龙虾的手脚 - 需要创建的文章

**优先级：P0**

- [ ] `tool-calling-basics.md` - 工具调用基础
- [ ] `api-integration.md` - API 集成入门
- [ ] `function-calling.md` - Function Calling 实战

**优先级：P1**

- [ ] `webhook-configuration.md` - Webhook 配置
- [ ] `automation-workflows.md` - 自动化工作流
- [ ] `third-party-integration.md` - 第三方服务集成案例
- [ ] `custom-tools.md` - 自定义工具开发

### 3.5 05 小龙虾的大脑 - 需要创建的文章

**优先级：P0**

- [ ] `memory-system.md` - 记忆系统基础
- [ ] `vector-database.md` - 向量数据库配置
- [ ] `context-management.md` - 上下文管理

**优先级：P1**

- [ ] `agent-collaboration.md` - Agent 协作机制
- [ ] `knowledge-base.md` - 知识库构建
- [ ] `long-term-conversation.md` - 长期对话管理

### 3.6 06 必备技能包 - 需要创建的文章

**新手必备（优先级：P0）**

- [ ] `basic-conversation.md` - 基础对话技巧
- [ ] `common-commands.md` - 常用命令速查
- [ ] `log-viewing.md` - 日志查看和分析
- [ ] `basic-troubleshooting.md` - 问题排查基础

**开发者热门（优先级：P0）**

- [ ] `code-generation.md` - 代码生成辅助
- [ ] `debugging-skills.md` - 调试技巧
- [ ] `api-development.md` - API 开发指南
- [ ] `performance-optimization.md` - 性能优化

**自媒体热门（优先级：P1）**

- [ ] `content-creation.md` - 内容创作辅助
- [ ] `copywriting.md` - 文案生成
- [ ] `asset-processing.md` - 素材处理
- [ ] `auto-publishing.md` - 自动化发布

**热门通用（优先级：P1）**

- [ ] `document-processing.md` - 文档处理
- [ ] `data-analysis.md` - 数据分析
- [ ] `email-handling.md` - 邮件处理
- [ ] `schedule-management.md` - 日程管理

### 3.7 07 多 Agents 能力 - 需要创建的文章

**基础入门（优先级：P0）**

- [ ] `multi-agent-architecture.md` - 多 Agent 架构概述
- [ ] `creating-multiple-agents.md` - 创建多个 Agent
- [ ] `agent-communication.md` - Agent 间通信
- [ ] `collaboration-patterns.md` - 协作模式

**进阶技巧（优先级：P1）**

- [ ] `complex-scenarios.md` - 复杂协作场景
- [ ] `performance-tuning.md` - 性能调优
- [ ] `fault-recovery.md` - 故障恢复
- [ ] `best-practices.md` - 最佳实践

### 3.8 安装部署 - 需要创建的文章

**云端部署（优先级：P0）**

- [ ] `cloud-aliyun.md` - 阿里云部署
- [ ] `cloud-tencent.md` - 腾讯云部署
- [ ] `cloud-volcano.md` - 火山引擎部署

**一键部署平台（优先级：P0）**

- [ ] `one-click-deployment.md` - 一键部署平台汇总
  - 字节 ArkClaw
  - 腾讯 QClaw
  - 智谱 AutoClaw
  - 猎豹 EasyClaw
  - 腾讯 WorkBuddy

**本地安装补充（优先级：P1）**

- [ ] `local-mac.md` - macOS 本地安装（整合现有内容）
- [ ] `local-linux.md` - Linux 本地安装（整合现有内容）

### 3.9 疑难解答 - 需要创建的文章

**优先级：P0**

- [ ] `faq.md` - 20 个常见问题
  1. 如何选择合适的 LLM？
  2. 如何处理 API 额度限制？
  3. 如何配置代理？
  4. 如何备份数据？
  5. 如何升级 OpenClaw？
  6. 如何解决端口冲突？
  7. 如何处理超时问题？
  8. 如何配置多个 Agent？
  9. 如何调试工具调用？
  10. 如何优化性能？
  11. 如何处理文件权限问题？
  12. 如何配置日志级别？
  13. 如何使用 Docker 部署？
  14. 如何配置 HTTPS？
  15. 如何处理内存不足？
  16. 如何配置数据库？
  17. 如何实现消息队列？
  18. 如何监控运行状态？
  19. 如何实现自动重启？
  20. 如何获取技术支持？

- [ ] `github-issues.md` - GitHub Issues 汇总页

**优先级：P1**

- [ ] `error-codes.md` - 错误代码参考
- [ ] `performance-issues.md` - 性能问题排查

### 3.10 功能页面 - 需要创建的页面

**优先级：P0**

- [ ] `/tutorials/index.astro` - 教程总览页
- [ ] `/installation/index.astro` - 安装部署总览页
- [ ] `/troubleshooting/index.astro` - 疑难解答总览页
- [ ] `/troubleshooting/faq.astro` - FAQ 页面
- [ ] `/troubleshooting/github-issues.astro` - GitHub Issues 页面
- [ ] `/cost-calculator/index.astro` - 成本计算器
- [ ] `/community/index.astro` - 社区总览页
- [ ] `/community/clawhub.astro` - ClawHub 页面
- [ ] `/community/github.astro` - GitHub 页面
- [ ] `/community/downloads.astro` - 资源下载页面

## 4. 文章创建优先级

### 4.1 优先级定义

- **P0（必须）**：核心内容，必须完成才能正常运营
- **P1（重要）**：重要内容，影响用户体验
- **P2（可选）**：增强内容，有时间再做

### 4.2 按阶段划分

**第一阶段（核心框架）- 估计 2-3 周**

P0 级别：
- 01 新手上路：5 篇核心渠道集成
- 02 初始化小龙虾：4 篇配置详解
- 06 必备技能包（新手必备）：4 篇基础内容
- 安装部署：3 篇云端部署 + 1 篇一键部署
- 功能页面：所有 10 个页面

**第二阶段（能力扩展）- 估计 3-4 周**

P0 级别：
- 03 小龙虾的眼睛：3 篇视觉能力
- 04 小龙虾的手脚：3 篇工具调用
- 05 小龙虾的大脑：3 篇记忆系统
- 07 多 Agents 能力：4 篇基础内容
- 06 必备技能包（开发者热门）：4 篇
- 疑难解答：FAQ 20 问

**第三阶段（内容完善）- 估计 2-3 周**

P1 级别：
- 所有分类的 P1 级别文章
- 进阶技巧和实战案例

## 5. Content Collections Schema 扩展

### 5.1 新增字段

```typescript
// src/content/config.ts
const post = defineCollection({
  schema: z.object({
    // === 现有字段 ===
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    lastUpdated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
    estimatedTime: z.string().default('5 minutes'),
    prerequisites: z.array(z.string()).default([]),
    alternates: z.object({
      zhCN: z.string().optional(),
    }).optional(),

    // === 新增字段 ===

    // 分类系统
    category: z.enum([
      '01-getting-started',
      '02-initialization',
      '03-claw-eyes',
      '04-claw-hands',
      '05-claw-brain',
      '06-essential-skills',
      '07-multi-agents',
      'installation',
      'troubleshooting',
    ]).optional(),

    // 子分类（用于技能包等）
    subcategory: z.enum([
      'beginner',
      'developer',
      'media',
      'general',
      'basic',
      'advanced',
    ]).optional(),

    // 排序权重（同分类内）
    order: z.number().default(0),

    // 相关文章（slug 数组）
    relatedPosts: z.array(z.string()).default([]),

    // 上一篇文章（slug）
    prevPost: z.string().optional(),

    // 下一篇文章（slug）
    nextPost: z.string().optional(),

    // 是否为精选文章
    featured: z.boolean().default(false),

    // 阅读量（可选）
    views: z.number().optional(),

    // 文章状态
    status: z.enum(['draft', 'published', 'archived']).default('published'),
  }),
});
```

### 5.2 字段使用示例

```yaml
---
title: "飞书集成指南"
description: "学习如何将 OpenClaw 集成到飞书，实现智能对话"
pubDate: 2026-03-16
category: 01-getting-started
order: 3
difficulty: beginner
estimatedTime: "10 minutes"
tags: ['feishu', 'integration', 'quickstart']
prerequisites: ['Node.js 22+', '已安装 OpenClaw']
featured: true
relatedPosts:
  - model-integration
  - channel-wechat
prevPost: model-integration
nextPost: channel-wechat
alternates:
  zhCN: /zh-cn/tutorials/01-getting-started/channel-feishu/
---
```

## 6. 文章命名规范

### 6.1 文件命名原则

1. **使用小写字母**
2. **单词用连字符分隔**
3. **名称具有描述性**
4. **避免特殊字符**
5. **保持简短但有意义**

### 6.2 命名模式

#### 教程文章

```
[topic]-[subtopic].md

示例：
- model-integration.md
- channel-feishu.md
- agents-config.md
- vision-basics.md
```

#### 安装文章

```
[deployment-type]-[platform].md

示例：
- local-mac.md
- local-ubuntu.md
- cloud-aliyun.md
- one-click-deployment.md
```

#### 疑难解答文章

```
[issue-type]-[detail].md

示例：
- common-errors.md
- doctor.md
- faq.md
- error-codes.md
```

### 6.3 特殊文件

```
index.md     # 分类总览页（可选）
README.md    # 分类说明（可选）
```

### 6.4 避免的命名

❌ 避免：
- `Tutorial 1.md`（无描述性）
- `how_to_install.md`（使用下划线）
- `安装指南.md`（使用中文）
- `post-2024-03-16.md`（使用日期）

✅ 推荐：
- `install-local-windows.md`
- `channel-feishu.md`
- `memory-system.md`

## 7. 内容迁移计划

### 7.1 迁移步骤

1. **备份现有内容**
   ```bash
   cp -r src/content/posts src/content/posts.backup
   cp -r src/content/posts-zh-cn src/content/posts-zh-cn.backup
   ```

2. **更新 frontmatter**
   - 为每篇文章添加 `category` 字段
   - 添加 `order` 字段（如需要）
   - 更新 `alternates` 路径

3. **移动文件到新位置**
   - 根据分类映射移动文件
   - 更新文件名（如需要）

4. **创建重定向规则**
   - 保留旧的路由处理
   - 添加 301 重定向

5. **测试所有链接**
   - 检查内部链接
   - 验证语言切换
   - 确认 SEO 友好

### 7.2 迁移检查清单

- [ ] 所有文章都有正确的 `category`
- [ ] 所有文章都有 `order`（同一分类内）
- [ ] 所有文章都有正确的 `alternates`
- [ ] 内部链接已更新
- [ ] 旧链接有重定向
- [ ] 中英文对应关系正确
- [ ] 测试构建成功
- [ ] 测试路由正常
- [ ] 测试语言切换

## 8. 内容创作工作流

### 8.1 创建新文章流程

1. **确定分类和位置**
   ```bash
   # 示例：创建"飞书集成"文章
   # 分类：01-getting-started
   # 位置：/tutorials/01-getting-started/channel-feishu/
   ```

2. **创建英文版**
   ```bash
   # 在 src/content/posts/01-getting-started/ 创建
   touch channel-feishu.md
   ```

3. **创建中文版**
   ```bash
   # 在 src/content/posts-zh-cn/01-getting-started/ 创建
   touch channel-feishu.md
   ```

4. **编写内容**
   - 遵循文章结构规范
   - 添加完整的 frontmatter
   - 设置正确的 alternates

5. **本地测试**
   ```bash
   npm run dev
   # 访问 http://localhost:4321/tutorials/01-getting-started/channel-feishu/
   # 访问 http://localhost:4321/zh-cn/tutorials/01-getting-started/channel-feishu/
   ```

6. **验证语言切换**
   - 点击语言切换按钮
   - 确认跳转到正确对应页面

### 8.2 文章模板

```markdown
---
title: "文章标题"
description: "简短描述（1-2 句话）"
pubDate: 2026-03-16
lastUpdated: 2026-03-16  # 可选
category: 01-getting-started  # 根据实际分类填写
order: 3  # 同分类内排序
difficulty: beginner  # beginner | intermediate | advanced
estimatedTime: "10 minutes"
tags: ['tag1', 'tag2', 'tag3']
prerequisites: ['前提条件1', '前提条件2']
featured: false  # 是否精选
relatedPosts: []  # 相关文章 slug
prevPost: previous-post-slug  # 可选
nextPost: next-post-slug  # 可选
alternates:
  zhCN: /zh-cn/tutorials/01-getting-started/article-slug/
---

## TL;DR

30 秒快速总结本文核心内容。

## Requirements

列出学习本文的前置条件：
- 条件 1
- 条件 2

## Background / 背景知识

可选：提供必要的背景知识。

## Steps

### 步骤 1：标题

详细说明第一步操作。

```bash
# 代码示例
command here
```

**预期输出：**
```
expected output here
```

### 步骤 2：标题

详细说明第二步操作。

## Expected Outcome / 预期结果

描述完成后的预期结果。

## Common Issues / 常见问题

### 问题 1

**现象：** 问题描述

**解决方案：** 解决步骤

## Next Steps / 下一步

- [相关文章 1](/path/to/article1/)
- [相关文章 2](/path/to/article2/)

## References / 参考

- [外部链接 1](https://example.com)
- [外部链接 2](https://example.com)
```

## 9. 质量标准

### 9.1 文章质量检查清单

**内容质量**
- [ ] 内容准确，经测试验证
- [ ] 代码示例可直接运行
- [ ] 截图清晰（如有）
- [ ] 术语使用一致

**结构完整**
- [ ] 有 TL;DR
- [ ] 有前置要求
- [ ] 步骤清晰
- [ ] 有预期结果
- [ ] 有常见问题
- [ ] 有下一步指引

**格式规范**
- [ ] frontmatter 完整
- [ ] 标题层级正确
- [ ] 代码块有语言标注
- [ ] 链接可访问

**SEO 优化**
- [ ] title 包含关键词
- [ ] description 吸引人
- [ ] 有相关标签
- [ ] 有内部链接

**多语言**
- [ ] 中英文版本同步
- [ ] alternates 正确
- [ ] 术语翻译一致

### 9.2 发布前检查

```bash
# 1. 构建测试
npm run build

# 2. 链接检查（可选）
npm install -g linkchecker
linkchecker dist/

# 3. 语言检查
# 手动检查每个页面的语言切换

# 4. 移动端测试
# 在不同设备上测试响应式
```
