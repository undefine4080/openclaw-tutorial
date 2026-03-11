# GitHub Issues 自动收集工具

自动从 GitHub 拉取 OpenClaw 项目的已解决 issues，翻译成中文，并保存为结构化数据。

## 🎯 功能

- ✅ 从 GitHub API 拉取已关闭的 issues
- ✅ 自动过滤和清理数据
- ✅ 支持多种翻译方式（DeepL、OpenAI）
- ✅ 生成中英双语 JSON 数据
- ✅ 自动生成 Markdown 摘要

## 📦 使用方法

### 1️⃣ 基础使用（只获取英文）

无需任何配置，直接运行：

```bash
npm run collect-issues
```

这会：
- 从 GitHub 获取已解决的 issues
- 保存为 `data/github-issues/issues-en.json`
- 生成 Markdown 摘要

### 2️⃣ 启用翻译

#### 方式 A: 使用 DeepL（推荐）

DeepL 提供更准确的翻译，有免费额度。

```bash
# 1. 注册 DeepL 账号: https://www.deepl.com/pro-api
# 2. 获取 API Key
# 3. 设置环境变量
export DEEPL_API_KEY=your_api_key_here

# 4. 运行脚本
npm run collect-issues
```

#### 方式 B: 使用 OpenAI

```bash
# 1. 设置 OpenAI API Key
export OPENAI_API_KEY=your_api_key_here

# 2. 运行脚本
npm run collect-issues
```

### 3️⃣ 提高 GitHub 请求限制

默认情况下，GitHub API 每小时限制 60 次请求。设置 Token 可以提高到 5000 次：

```bash
# 1. 创建 GitHub Token: https://github.com/settings/tokens
# 2. 选择 repo 权限
# 3. 设置环境变量
export GITHUB_TOKEN=your_token_here

# 4. 运行脚本
npm run collect-issues
```

## ⚙️ 配置

编辑 `scripts/collect-github-issues.js` 中的 `CONFIG` 对象：

```javascript
const CONFIG = {
  // GitHub 仓库配置
  owner: 'openclaw',
  repo: 'openclaw',        // 修改为实际仓库名
  state: 'closed',         // 获取已关闭的
  perPage: 100,            // 每页数量
  maxIssues: 50,           // 最大获取数量

  // 输出目录
  outputDir: path.join(__dirname, '..', 'data', 'github-issues'),

  // 翻译配置
  enableTranslation: true, // 是否启用翻译
  translateMethod: 'auto', // 'deepl' | 'openai' | 'auto'
};
```

## 📂 输出文件

运行后在 `data/github-issues/` 目录生成：

```
data/github-issues/
├── issues-en.json          # 英文原始数据
├── issues-zh-cn.json       # 中文翻译数据（如果启用翻译）
└── README.md               # Markdown 摘要
```

### JSON 数据格式

```json
{
  "meta": {
    "collected_at": "2026-03-10T...",
    "total_count": 50,
    "source": "github.com/openclaw/openclaw"
  },
  "issues": [
    {
      "id": 123456789,
      "number": 42,
      "title": "How to install OpenClaw?",
      "body": "I'm trying to install...",
      "state": "closed",
      "created_at": "2026-03-09T...",
      "updated_at": "2026-03-10T...",
      "closed_at": "2026-03-10T...",
      "labels": ["installation", "question"],
      "comments_count": 5,
      "has_answer": true,
      "url": "https://github.com/...",
      "author": "username",
      "translations": {
        "zhCN": {
          "title": "如何安装 OpenClaw？",
          "body": "我正在尝试安装..."
        }
      }
    }
  ]
}
```

## 🔄 定期运行

### 手动运行

```bash
npm run collect-issues
```

### 定时任务（macOS/Linux）

使用 cron 定期运行：

```bash
# 编辑 crontab
crontab -e

# 每周日凌晨 2 点运行
0 2 * * 0 cd /path/to/openclaw-tutorial && npm run collect-issues
```

### GitHub Actions（推荐）

创建 `.github/workflows/collect-issues.yml`：

```yaml
name: Collect GitHub Issues

on:
  schedule:
    - cron: '0 2 * * 0'  # 每周日凌晨 2 点
  workflow_dispatch:      # 手动触发

jobs:
  collect:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '22'

      - name: Run collector
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          DEEPL_API_KEY: ${{ secrets.DEEPL_API_KEY }}
        run: npm run collect-issues

      - name: Commit data
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add data/github-issues/
          git diff --quiet && git diff --staged --quiet || git commit -m "chore: update collected issues"

      - name: Push changes
        uses: ad-m/github-push-action@master
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
```

## 💡 下一步

收集数据后，你可以：

1. **筛选高质量 issues**
   - 查看 `data/github-issues/README.md`
   - 选择有价值的 issues

2. **转换为教程内容**
   ```bash
   npm run convert-issues-to-posts  # 需要创建此脚本
   ```

3. **添加到网站**
   - 复制到 `src/content/posts/`
   - 添加 frontmatter
   - 双语翻译

## 📚 相关资源

- [GitHub API 文档](https://docs.github.com/en/rest)
- [DeepL API 文档](https://www.deepl.com/docs-api/)
- [OpenAI API 文档](https://platform.openai.com/docs/)

## 🐛 故障排除

### 仓库未找到 (404)

```
❌ 仓库 not found: openclaw/openclaw
```

**解决方案**：修改脚本中的 `CONFIG.repo` 为正确的仓库名。

### API 速率限制 (403)

```
❌ GitHub API 速率限制
```

**解决方案**：设置 `GITHUB_TOKEN` 环境变量。

### 翻译失败

```
❌ 翻译失败: 401 Unauthorized
```

**解决方案**：检查 API Key 是否正确设置。

## 📝 许可

MIT
