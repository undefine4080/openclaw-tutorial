# 🚀 Bug 问题库 - 5分钟快速开始

## 步骤 1: 收集 Bug Reports

```bash
# 设置 GitHub Token（可选，但推荐）
export GITHUB_TOKEN=your_token_here

# 设置翻译 API（可选）
export DEEPL_API_KEY=your_key_here

# 运行收集
npm run collect-bugs
```

**输出示例：**
```
🐛 OpenClaw Bug Reports 收集工具
============================================================

🔍 开始收集已解决的 Bug Reports...

📌 状态: closed
📌 标签: bug
📌 仓库: openclaw/openclaw
💾 模式: 增量保存

✓ 第 1 页: +50 个 bug reports | 总计: 50 | 平均: 8.5 个/秒 💾
✓ 第 2 页: +50 个 bug reports | 总计: 100 | 平均: 9.2 个/秒 💾

📊 总共获取 100 个已解决的 bug reports

🧹 清理和整理 bug reports...
✓ 清理进度: 50/100 | 已保存: 48 💾
✓ 清理进度: 100/100 | 已保存: 95 💾

✅ 清理完成！处理 95 个 bug reports

🌐 翻译 bug reports 到中文...
[1/95] Error: Cannot find module...
  ✅ 已保存 💾
...

✅ 翻译完成！处理 93 个 bug reports

📝 生成可搜索的文档...
✓ 英文文档: data/bug-reports/BUGS.md
✓ 中文文档: data/bug-reports/BUGS-zh-cn.md

✓ 已清理临时文件

============================================================
✅ 全部完成!

📂 数据保存在: data/bug-reports/
   - bugs-en.json       (英文数据)
   - bugs-zh-cn.json    (中文数据)
   - BUGS.md           (英文文档)
   - BUGS-zh-cn.md     (中文文档)
```

---

## 步骤 2: 添加到网站

```bash
# 复制 JSON 数据到 public 目录
mkdir -p public/data/bug-reports
cp data/bug-reports/*.json public/data/bug-reports/
```

---

## 步骤 3: 访问 Bug 问题库

```bash
# 启动开发服务器
npm run dev

# 访问
http://localhost:4321/bugs
```

---

## 🎯 功能预览

### 主页 (/bugs)
- 📊 统计信息（总数、新增、解决时间）
- 🐛 Bug 列表（分页加载）
- 🔗 链接到 GitHub 原始讨论

### 搜索功能
- ⚡ 实时搜索（300ms 防抖）
- 🏷️ 快速筛选标签
- 📊 结果统计

---

## 📁 文件结构

```
data/bug-reports/
├── bugs-en.json       # 英文数据（已清理）
├── bugs-zh-cn.json    # 中文数据（已翻译）
├── BUGS.md           # 英文文档
└── BUGS-zh-cn.md     # 中文文档

public/data/bug-reports/
├── bugs-en.json      # 复制到这里供网站使用
└── bugs-zh-cn.json   # 复制到这里供网站使用

src/pages/bugs/
└── index.astro       # Bug 问题库页面

src/components/
└── BugSearch.astro   # 搜索组件
```

---

## 🔄 自动更新

### 每天自动收集

创建 `.github/workflows/collect-bugs.yml`：

```yaml
name: 每日收集 Bug

on:
  schedule:
    - cron: '0 2 * * *'  # 每天凌晨 2 点
  workflow_dispatch:

jobs:
  collect:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '22'

      - name: 收集并部署
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          DEEPL_API_KEY: ${{ secrets.DEEPL_API_KEY }}
        run: |
          npm run collect-bugs
          mkdir -p public/data/bug-reports
          cp data/bug-reports/*.json public/data/bug-reports/

      - name: 提交
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

## ⚙️ 配置

编辑 `scripts/collect-bug-reports.js`：

```javascript
const CONFIG = {
  // 只收集已解决的 bug
  state: 'closed',
  labels: ['bug'],

  // 或者收集多种类型
  labels: ['bug', 'error', 'issue'],

  // 限制数量
  maxIssues: 100,  // 只收集最近 100 个
  maxIssues: null, // 收集所有
};
```

---

## 💡 使用技巧

### 1. 搜索关键词
```
- 错误信息: "EACCES", "permission denied"
- 问题类型: "安装", "网络", "配置"
- 平台: "Windows", "macOS", "Linux"
```

### 2. 快速筛选
点击搜索框下方的标签按钮：
- 错误信息
- 安装问题
- 权限问题
- 网络问题

### 3. 查看原文
每个 bug card 都有链接到 GitHub 原始讨论

---

## 📊 数据示例

### bugs-zh-cn.json

```json
{
  "meta": {
    "total_count": 95,
    "filter": {
      "state": "closed",
      "labels": ["bug"]
    }
  },
  "bugs": [
    {
      "number": 42,
      "title": "Error: Cannot find module 'openclaw'",
      "translations": {
        "zhCN": {
          "title": "错误：找不到模块 'openclaw'"
        }
      },
      "error_message": "Error: Cannot find module 'openclaw'",
      "version": "1.2.0",
      "platform": "linux",
      "has_solution": true,
      "url": "https://github.com/openclaw/openclaw/issues/42"
    }
  ]
}
```

---

## 🎯 效果

### ❌ 不使用 Bug 问题库
```
用户遇到错误 → Google 搜索 → 找到 GitHub →
阅读几十个 issues → 筛选 closed → 找到解决方案
耗时: 20-40 分钟
```

### ✅ 使用 Bug 问题库
```
用户遇到错误 → 访问 /bugs → 搜索错误信息 →
立即看到已解决的 bug 和解决方案
耗时: 1-2 分钟
```

---

## 🐛 故障排除

### 问题: 收集到 0 个 bug

**原因**: 仓库可能没有 `bug` 标签

**解决**:
```javascript
// 修改 CONFIG.labels
labels: ['bug', 'issue', 'problem'],  // 尝试多个标签
// 或
labels: [],  // 不过滤标签
```

### 问题: 搜索不工作

**检查**:
```bash
# 确认 JSON 文件在 public 目录
ls public/data/bug-reports/
# 应该看到: bugs-en.json bugs-zh-cn.json

# 检查浏览器控制台是否有错误
```

### 问题: 翻译质量差

**方案 1**: 使用 DeepL（更准确）
```bash
export DEEPL_API_KEY=your_key
```

**方案 2**: 只翻译标题
```javascript
// 修改 translateBugs 函数
translatedBug = {
  ...bug,
  translations: {
    zhCN: {
      title: await translateToCN(bug.title),
      // description: 保留英文
    },
  },
};
```

---

## 📚 下一步

1. **定制筛选**: 根据你的需求调整筛选条件
2. **添加分类**: 按严重程度、频率等分类
3. **用户反馈**: 收集用户的搜索词，优化内容
4. **定期更新**: 设置自动收集和部署

---

**需要帮助?** 查看 [完整使用指南](./Bug问题库使用指南.md)
