# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

OpenClaw 教程网站 - 这是一个基于 Astro 的双语（英文/中文）静态网站，提供 OpenClaw 的教程和故障排除指南。

### 核心架构

- **框架**: Astro 4.x + TypeScript
- **内容管理**: Astro Content Collections
- **多语言**: 双语支持（英文 `posts`，中文 `posts-zh-cn`）
- **搜索**: Pagefind（本地搜索）
- **部署**: Cloudflare Pages

## 开发命令

### 基础开发

```bash
# 启动开发服务器（http://localhost:4321）
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

### 内容收集脚本

项目包含自动化脚本用于从 GitHub 收集问题和 Bug 报告：

```bash
# 收集 GitHub Issues（需要设置环境变量）
npm run collect-issues

# 将 Issues 转换为文章
npm run convert-issues

# 收集 Bug 报告
npm run collect-bugs
```

**脚本环境变量配置**（复制 `.env.example` 为 `.env`）：
- `GITHUB_TOKEN`: GitHub API Token（提高请求限制）
- `DEEPL_API_KEY`: DeepL API Key（用于翻译，推荐）
- `OPENAI_API_KEY`: OpenAI API Key（翻译备选方案）

## 项目结构

```
src/
├── content/
│   ├── config.ts           # Content Collections 配置和 Zod schemas
│   ├── posts/              # 英文文章 (.md 文件)
│   └── posts-zh-cn/        # 中文文章 (.md 文件)
├── components/
│   ├── BugSearch.astro     # Bug 搜索组件
│   └── LangSwitch.astro    # 语言切换器组件
├── layouts/
│   └── Layout.astro        # 主布局文件
└── pages/
    ├── index.astro          # 英文首页
    ├── posts/[slug].astro   # 英文文章动态路由
    └── zh-cn/              # 中文页面
        ├── index.astro     # 中文首页
        └── posts/[slug].astro  # 中文文章动态路由

scripts/                      # 自动化脚本
├── collect-github-issues.js  # GitHub Issues 收集器
├── convert-issues-to-posts.js # Issues 转文章转换器
└── collect-bug-reports.js     # Bug 报告收集器

data/                         # 动态数据目录
├── github-issues/            # 收集的 GitHub Issues
└── bugs/                     # 收集的 Bug 报告
```

## Content Collections 配置

文章 frontmatter 必须符合以下 schema（定义在 `src/content/config.ts`）：

```yaml
---
title: 文章标题
description: 文章描述
pubDate: 2024-03-09
lastUpdated: 2024-03-10  # 可选
tags: ['installation', 'troubleshooting']
difficulty: beginner  # beginner | intermediate | advanced
estimatedTime: '5 minutes'
prerequisites: ['Node.js 22+', 'npm']
alternates:
  zhCN: /zh-cn/posts/slug  # 中文版本路径（英文文章需要）
---
```

**重要**：英文文章必须包含 `alternates.zhCN` 指向对应的中文版本。

## 文章内容结构规范

每篇教程文章应遵循以下结构：

1. **TL;DR** - 30 秒快速总结
2. **Requirements** - 前置要求
3. **Steps** - 详细步骤说明
4. **Expected Output** - 预期结果
5. **Common Issues** - 常见问题及解决方案
6. **Next Steps** - 相关文章链接

## 语言切换机制

- 通过 `LangSwitch.astro` 组件实现
- 使用文章的 `alternates` 字段进行语言对应
- 英文路径：`/posts/[slug]`
- 中文路径：`/zh-cn/posts/[slug]`

## 自动化脚本说明

### GitHub Issues 收集器

位置：`scripts/collect-github-issues.js`

功能：
- 从 GitHub API 拉取已关闭的 issues
- 支持自动翻译（DeepL 或 OpenAI）
- 生成双语 JSON 数据
- 创建 Markdown 摘要

配置：修改脚本中的 `CONFIG` 对块

### Bug 问题库

位置：`src/pages/bugs/` 和 `scripts/collect-bug-reports.js`

功能：
- 展示收集的 Bug 报告
- 支持搜索和过滤
- 双语支持

## 搜索功能

- 使用 Pagefind 进行本地搜索
- 构建后自动运行：`npm run postbuild`
- 搜索索引自动生成在 `dist/pagefind/`

## 部署配置

### Cloudflare Pages

1. 构建命令：`npm run build`
2. 输出目录：`dist`
3. 环境变量：`NODE_VERSION=22`
4. Node.js 版本：>= 22

### 站点地图

`astro.config.mjs` 中已配置站点地图插件（注释状态），部署时取消注释即可启用。

## 关键文件说明

- **astro.config.mjs**: Astro 主配置文件，包含站点 URL 和集成配置
- **tsconfig.json**: TypeScript 配置
- **.env.example**: 环境变量模板（需要复制为 .env 并填入实际值）
- **src/env.d.ts**: Astro 环境类型定义

## 内容创作工作流

1. 创建新文章：在 `src/content/posts/` 或 `src/content/posts-zh-cn/` 创建 `.md` 文件
2. 添加符合 schema 的 frontmatter
3. 按照文章结构规范编写内容
4. 在对应语言版本添加 `alternates` 字段
5. 运行 `npm run dev` 预览
6. 测试语言切换功能

## 双语内容同步

- 英文文章在 `src/content/posts/`
- 中文文章在 `src/content/posts-zh-cn/`
- 通过 `alternates` 字段相互链接
- 发布时确保两种语言都有对应版本
