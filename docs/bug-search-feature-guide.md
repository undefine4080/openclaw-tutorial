# Bug 问题库功能使用指南

## 📊 当前状态

已成功设置 Bug 问题库功能，包括：

- ✅ **数据收集**：已爬取 5004 个已解决的 Bug 报告
- ✅ **搜索索引**：生成了优化的搜索索引（4.12 MB，压缩率 63.9%）
- ✅ **前端优化**：更新了搜索组件以使用轻量级索引
- ✅ **数据部署**udi: 数据已复制到 public 目录

## 🚀 快速开始

### 1. 启动开发服务器

```bash
npm run dev
```

访问：http://localhost:4321/bugs

### 2. 测试搜索功能

在搜索框中输入关键词，例如：
- `docker` - 搜索 Docker 相关问题
- `install` - 搜索安装问题
- `error` - 搜索错误信息
- `permission` - 搜索权限问题

## 🔧 翻译功能（可选）

当前数据的翻译字段为 `null`，如需翻译：

### 使用 DeepL（推荐）

```bash
# 1. 设置 API Key
export DEEPL_API_KEY=your_api_key_here

# 2. 运行翻译
npm run translate-bugs

# 3. 重新生成搜索索引
npm run generate-search-index
```

### 使用 OpenAI

```bash
# 1. 设置 API Key
export OPENAI_API_KEY=your_api_key_here

# 2. 运行翻译
npm run translate-bugs

# 3. 重新生成搜索索引
npm run generate-search-index
```

## 📈 性能优化

### 搜索索引 vs 完整数据

| 文件类型 | 大小 | 用途 |
|---------|------|------|
| bugs-zh-cn.json | 11.41 MB | 完整数据（包含所有字段） |
| bugs-search-index.json | 4.12 MB | 搜索索引（仅必要字段） |
| 压缩率 | 63.9% | 文件大小减少 |

### 优势

- **更快的加载速度**：索引文件比完整数据小 64%
- **更好的搜索性能**：预提取搜索关键词，快速匹配
- **减少内存占用**：前端处理的数据量更少

## 🔄 更新数据

### 收集新数据

```bash
npm run collect-bugs
```

### 翻译新数据

```bash
export DEEPL_API_KEY=your_api_key
npm run translate-bugs
```

### 重新生成索引

```bash
npm run generate-search-index
```

### 一键更新

```bash
# 完整更新流程
npm run collect-bugs && \
export DEEPL_API_KEY=your_api_key && \
npm run translate-bugs && \
npm run generate-search-index
```

## 📁 文件结构

```
project/
├── data/
│   └── bug-reports/              # 源数据（开发时使用）
│       ├── bugs-en.json          # 英文原始数据
│       ├── bugs-zh-cn.json       # 中文翻译数据
│       └── BUGS.md             # Markdown 摘要
├── public/
│   └── data/
│       └── bug-reports/         # 部署数据（前端访问）
│           ├── bugs-search-index.json  # 搜索索引（当前使用）
│           ├── bugs-en.json
│           ├── bugs-zh-cn.json
│           └── BUGS.md
├── src/
│   ├── components/
│   │   └── BugSearch.astro     # 搜索组件（已优化）
│   └── pages/
│       └── bugs/
│           └── index.astro      # Bug 列表页（已优化）
└── scripts/
    ├── collect-bug-reports.js    # 数据收集脚本
    ├── translate-bugs.js         # 翻译脚本（新增）
    └── generate-search-index.js   # 索引生成脚本（新增）
```

## 🎯 下一步计划

### 1. 完成翻译

使用 DeepL 或 OpenAI API 翻译所有 Bug 标题和描述，为国内用户提供更好的搜索体验。

### 2. 添加高级搜索功能

- 按版本筛选
- 按标签筛选
- 按时间范围筛选
- 按平台筛选

### 3. 添加 Bug 详情页

创建专门的 Bug 详情页面，显示：
- 完整描述
- 相关链接
- 解决方案
- 类似问题推荐

### 4. 集成到主站

在首页和导航栏中添加 Bug 问题库入口，提高可见度。

### 5. 自动化更新

使用 GitHub Actions 定期更新数据：

```yaml
# .github/workflows/update-bugs.yml
name: Update Bug Reports

on:
  schedule:
    - cron: '0 2 * * 0'  # 每周日凌晨 2 点
  workflow_dispatch:      # 手动触发

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '22'

      - name: Update bug reports
        env:
          DEEPL_API_KEY: ${{ secrets.DEEPL_API_KEY }}
        run: |
          npm run collect-bugs
          npm run translate-bugs
          npm run generate-search-index

      - name: Commit changes
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add public/data/bug-reports/
          git diff --quiet && git diff --staged --quiet || git commit -m "chore: update bug reports"

      - name: Push changes
        uses: ad-m/github-push-action@master
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
```

## 📞 支持与反馈

如有问题或建议，请：
1. 检查数据文件是否正确复制到 `public/` 目录
2. 确认搜索索引已生成
3. 查看浏览器控制台是否有错误信息
4. 检查网络请求是否成功加载 `bugs-search-index.json`

## 📊 统计信息

- **总 Bug 数量**: 5004
- **数据源**: GitHub OpenClaw 仓库
- **筛选条件**: 状态=已关闭 + 标签=bug
- **最后更新**: 2026-03-10
