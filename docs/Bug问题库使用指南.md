# 🐛 Bug 问题库使用指南

## 🎯 功能说明

这个工具专门用于收集和整理 OpenClaw 的**已解决 Bug**，为用户提供一个可搜索的问题库，无需在 GitHub 中搜索。

## ✨ 核心特性

### 1. 精准收集
- ✅ 只收集 **已解决**（closed）的 bug reports
- ✅ 只收集有 **bug 标签**的 issues
- ✅ 过滤掉无关的 pull requests 和 discussions

### 2. 数据清理
- 提取**错误信息**（从代码块中）
- 识别**版本号**和**平台信息**
- 移除无关评论和引用
- 保留核心问题描述

### 3. 双语支持
- 自动翻译成中文
- 保留英文原文
- 生成中英双语文档

### 4. 可搜索
- 实时搜索功能
- 按关键词、错误信息搜索
- 快速筛选标签

---

## 🚀 快速开始

### 1. 收集 Bug Reports

```bash
# 设置环境变量（可选）
export GITHUB_TOKEN=your_token_here
export DEEPL_API_KEY=your_key_here

# 运行收集脚本
npm run collect-bugs
```

### 2. 查看输出

```
data/bug-reports/
├── bugs-en.json       # 英文数据（可被搜索）
├── bugs-zh-cn.json    # 中文数据（可被搜索）
├── BUGS.md           # 英文文档
└── BUGS-zh-cn.md     # 中文文档
```

### 3. 添加到网站

将 JSON 文件复制到 `public/data/bug-reports/`：

```bash
mkdir -p public/data/bug-reports
cp data/bug-reports/*.json public/data/bug-reports/
```

---

## 📊 数据格式

### bugs-en.json / bugs-zh-cn.json

```json
{
  "meta": {
    "started_at": "2026-03-10T12:00:00.000Z",
    "last_updated": "2026-03-10T12:30:00.000Z",
    "completed_at": "2026-03-10T12:30:00.000Z",
    "status": "completed",
    "total_count": 150,
    "source": "github.com/openclaw/openclaw",
    "filter": {
      "state": "closed",
      "labels": ["bug"]
    }
  },
  "bugs": [
    {
      "id": 123456789,
      "number": 42,
      "title": "Error: Cannot find module 'openclaw'",
      "description": "When trying to run openclaw...",
      "error_message": "Error: Cannot find module 'openclaw'",
      "version": "1.2.0",
      "platform": "linux",
      "state": "closed",
      "created_at": "2026-03-09T10:00:00.000Z",
      "updated_at": "2026-03-10T12:00:00.000Z",
      "closed_at": "2026-03-10T12:00:00.000Z",
      "labels": ["bug", "installation"],
      "comments_count": 5,
      "url": "https://github.com/openclaw/openclaw/issues/42",
      "author": "username",
      "has_solution": true,
      "translations": {
        "zhCN": {
          "title": "错误：找不到模块 'openclaw'",
          "description": "尝试运行 openclaw 时...",
          "error_message": "错误：找不到模块 'openclaw'"
        }
      }
    }
  ]
}
```

---

## 🎨 网站集成

### Bug 问题库页面

已创建 `/bugs` 页面 (`src/pages/bugs/index.astro`)：

**功能：**
- 📊 统计信息（总数、新增、解决时间）
- 🔍 实时搜索
- 🏷️ 快速筛选标签
- 📄 分页加载
- 🔗 链接到原始 GitHub 讨论

### BugSearch 组件

已创建搜索组件 (`src/components/BugSearch.astro`)：

**功能：**
- 实时搜索（300ms 防抖）
- 搜索标题、描述、错误信息
- 快速筛选按钮
- 高亮显示结果

---

## 🔄 自动更新

### 使用 GitHub Actions

创建 `.github/workflows/collect-bugs.yml`：

```yaml
name: 收集 Bug Reports

on:
  schedule:
    # 每天凌晨 2 点运行
    - cron: '0 2 * * *'
  workflow_dispatch:  # 手动触发

jobs:
  collect:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: 设置 Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '22'

      - name: 收集 Bug Reports
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          DEEPL_API_KEY: ${{ secrets.DEEPL_API_KEY }}
        run: |
          npm run collect-bugs
          mkdir -p public/data/bug-reports
          cp data/bug-reports/*.json public/data/bug-reports/

      - name: 提交更改
        run: |
          git config user.email "action@github.com"
          git config user.name "GitHub Action"
          git add public/data/bug-reports/
          git diff --quiet && git diff --staged --quiet || git commit -m "chore: 更新 bug 问题库"

      - name: 推送
        uses: ad-m/github-push-action@master
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
```

---

## 🛠️ 配置选项

编辑 `scripts/collect-bug-reports.js`：

```javascript
const CONFIG = {
  // GitHub 筛选条件
  owner: 'openclaw',
  repo: 'openclaw',
  state: 'closed',        // 只获取已关闭的
  labels: ['bug'],        // 只获取 bug 标签

  // 数量限制
  maxIssues: null,        // null = 获取所有

  // 输出目录
  outputDir: path.join(__dirname, '..', 'data', 'bug-reports'),

  // 翻译配置
  enableTranslation: true,
  translateMethod: 'auto',

  // 性能配置
  delayBetweenPages: 1000,
  delayBetweenIssues: 500,
};
```

---

## 📝 添加更多筛选

### 只收集特定平台的 bug

```javascript
// 在 processBugs 函数中添加
if (bug.platform === 'windows') {
  // 只保留 Windows bug
}
```

### 只收集特定版本的 bug

```javascript
if (bug.version.startsWith('1.2.')) {
  // 只保留 1.2.x 版本的 bug
}
```

### 只收集有解决方案的 bug

```javascript
if (bug.has_solution && bug.comments_count > 2) {
  // 只保留有充分讨论的 bug
}
```

---

## 🎯 使用场景

### 场景 1: 用户遇到错误

```
用户看到错误: "Error: EACCES permission denied"
1. 访问 /bugs 页面
2. 搜索 "EACCES" 或 "permission"
3. 找到已解决的 bug
4. 查看解决方案
```

### 场景 2: 文档编写

```
文档编写者需要常见问题:
1. 查看 BUGS-zh-cn.md
2. 选择高频 bug
3. 添加到教程中
```

### 场景 3: 版本发布

```
发布前检查:
1. 收集当前版本的所有 bug
2. 确保都已解决
3. 生成发布说明
```

---

## 📈 效果对比

### ❌ 传统方式
```
用户遇到问题 → 去 GitHub → 搜索 issues → 筛选 closed → 阅读长篇讨论 → 找到答案
耗时: 10-30 分钟
```

### ✅ 使用 Bug 问题库
```
用户遇到问题 → 访问 /bugs → 搜索关键词 → 直接看到解决方案
耗时: 1-2 分钟
```

---

## 🔍 搜索技巧

### 按错误信息搜索
```
"Cannot find module"
"EACCES"
"permission denied"
"404 Not Found"
```

### 按问题类型搜索
```
"安装"
"网络"
"权限"
"配置"
```

### 按平台搜索
```
"Windows"
"macOS"
"Linux"
```

---

## 💡 最佳实践

1. **定期更新**: 每天或每周自动运行收集
2. **数据验证**: 检查收集的数据质量
3. **用户反馈**: 收集用户的搜索关键词，优化筛选
4. **版本标记**: 为不同版本创建独立的 bug 列表

---

## 🐛 故障排除

### Q: 收集的 bug 数量为 0

**A:** 检查：
1. 仓库是否有 `bug` 标签
2. 是否有已关闭的 bug reports
3. GitHub Token 是否有效

### Q: 搜索不工作

**A:** 检查：
1. JSON 文件是否复制到 `public/data/bug-reports/`
2. 文件路径是否正确
3. 浏览器控制台是否有错误

### Q: 翻译质量差

**A:** 尝试：
1. 使用 DeepL 替代 OpenAI
2. 人工审核和修正
3. 只翻译标题，保留英文描述

---

## 📚 相关文档

- [完整收集工具文档](../scripts/README-收集工具.md)
- [获取所有 Issues 指南](./获取所有Issues指南.md)
- [项目配置](../CLAUDE.md)
