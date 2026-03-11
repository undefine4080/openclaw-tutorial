# 🎯 获取所有 GitHub Issues 指南

本指南说明如何收集 OpenClaw 仓库中**所有已关闭的 issues**（不限数量）。

## ⚡ 快速开始

### 方法 1: 命令行参数（推荐）

无需修改代码，通过环境变量控制：

```bash
# 获取所有已关闭的 issues
npm run collect-issues

# 只获取前 100 个
MAX_ISSUES=100 npm run collect-issues
```

### 方法 2: 修改配置文件

编辑 `scripts/collect-github-issues.js` 第 39 行：

```javascript
const CONFIG = {
  // ...
  maxIssues: null,  // null = 获取所有，数字 = 限制数量
  // ...
};
```

然后运行：

```bash
npm run collect-issues
```

---

## 📊 运行示例

```bash
$ npm run collect-issues

🔍 开始从 GitHub 获取 issues...

📌 配置: 获取所有已关闭的 issues
📌 仓库: openclaw/openclaw

✓ 第 1 页: +100 个 issues | 总计: 100 | 平均: 12.5 个/秒
✓ 第 2 页: +100 个 issues | 总计: 200 | 平均: 13.2 个/秒
✓ 第 3 页: +100 个 issues | 总计: 300 | 平均: 13.8 个/秒
...
✓ 第 15 页: +42 个 issues | 总计: 1542 | 平均: 12.9 个/秒

✓ 没有更多数据

📊 总共获取 1542 个已解决的 issues (耗时 119.5秒)

🌐 开始翻译 issues...
[1/1542] 翻译: How to install OpenClaw?...
[2/1542] 翻译: Error: EACCES permission denied...
...

✅ 全部完成!
```

---

## ⚙️ 配置选项

### 获取数量限制

```javascript
const CONFIG = {
  maxIssues: null,     // 获取所有
  maxIssues: 100,      // 只获取 100 个
  maxIssues: 1000,     // 只获取 1000 个
};
```

### 性能优化

```javascript
const CONFIG = {
  perPage: 100,                // 每页数量（最大 100）
  delayBetweenPages: 1000,     // 页间延迟（毫秒）
  saveProgress: true,          // 保存进度（可恢复）
};
```

### 翻译控制

```javascript
const CONFIG = {
  enableTranslation: true,     // 启用翻译
  enableTranslation: false,    // 只收集英文
};
```

---

## 🔄 进度恢复

如果运行中断（网络问题、速率限制等），脚本会自动保存进度：

```bash
# 第一次运行（被中断）
$ npm run collect-issues
✓ 第 5 页: +100 个 issues | 总计: 500 | 平均: 12.5 个/秒
⚠️  接近速率限制，等待 3600 秒...
^C

# 重新运行（自动从第 6 页继续）
$ npm run collect-issues
📦 发现已保存的进度，从第 6 页继续...
✓ 第 6 页: +100 个 issues | 总计: 600 | 平均: 12.8 个/秒
```

进度保存在：`data/github-issues/.progress.json`

---

## 🚦 GitHub API 速率限制

### 无 Token（匿名请求）
- **限制**: 60 次/小时
- **影响**: 每小时只能获取 6000 个 issues

### 有 Token（认证请求）
- **限制**: 5000 次/小时
- **影响**: 每小时可以获取 500,000 个 issues

### 如何设置 Token

```bash
# 1. 生成 GitHub Token
# 访问: https://github.com/settings/tokens
# 权限: repo (public_repo 即可)

# 2. 设置环境变量
export GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx

# 3. 运行脚本
npm run collect-issues
```

---

## ⏱️ 预估时间

基于网络状况和 GitHub 响应速度：

| Issues 数量 | 无 Token | 有 Token |
|-----------|---------|---------|
| 100 | ~10 秒 | ~8 秒 |
| 1,000 | ~2 分钟 | ~90 秒 |
| 10,000 | ~20 分钟 | ~15 分钟 |
| 所有 | 取决于仓库大小 | 取决于仓库大小 |

**注意**: 翻译时间不包含在内，翻译每个 issue 约 1-2 秒。

---

## 💾 存储空间

预估 JSON 文件大小：

| Issues 数量 | 仅英文 | 英文+中文 |
|-----------|--------|----------|
| 100 | ~500 KB | ~1 MB |
| 1,000 | ~5 MB | ~10 MB |
| 10,000 | ~50 MB | ~100 MB |

---

## 🎯 使用场景

### 场景 1: 一次性完整备份

```bash
# 获取所有 issues，翻译成中文
export GITHUB_TOKEN=xxx
export DEEPL_API_KEY=xxx
npm run collect-issues
```

### 场景 2: 定期增量更新

使用 GitHub Actions（见 `scripts/README-收集工具.md`）

### 场景 3: 只获取最新 N 个

```javascript
// 修改 CONFIG
maxIssues: 100,  // 只获取最新的 100 个
```

### 场景 4: 只收集不翻译（快速）

```javascript
// 修改 CONFIG
enableTranslation: false,
```

---

## 🐛 常见问题

### Q1: 速率限制怎么办？

```bash
# 方案 1: 设置 GitHub Token（推荐）
export GITHUB_TOKEN=your_token

# 方案 2: 等待速率限制重置（1小时）
# 脚本会自动等待并继续

# 方案 3: 只收集不翻译
enableTranslation: false
```

### Q2: 运行中断后数据丢失？

**不会**。脚本会：
1. 每页后自动保存进度
2. 重新运行时自动恢复
3. 完成后删除进度文件

### Q3: 翻译太慢怎么办？

```bash
# 方案 1: 关闭翻译，只收集英文
enableTranslation: false

# 方案 2: 使用更快的翻译 API
translateMethod: 'openai'  # 比 DeepL 快

# 方案 3: 分批处理
# 第一次只收集
# 第二次只翻译选中的 issues
```

### Q4: 如何只翻译部分 issues？

```bash
# 1. 第一次运行（只收集英文）
enableTranslation: false
npm run collect-issues

# 2. 编辑 issues-en.json，删除不需要的

# 3. 第二次运行（只翻译翻译）
# 修改脚本：读取 issues-en.json，逐个翻译
```

---

## 📈 高级技巧

### 1. 过滤特定标签

```javascript
// 在 filterIssues 函数中添加
return issues.filter(issue =>
  issue.labels.some(label =>
    ['bug', 'question', 'documentation'].includes(label.name)
  )
);
```

### 2. 按时间范围筛选

```javascript
// 只获取最近 6 个月的 issues
const sixMonthsAgo = new Date();
sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

return issues.filter(issue =>
  new Date(issue.created_at) > sixMonthsAgo
);
```

### 3. 排除 PR

```javascript
// 过滤掉 pull requests
return issues.filter(issue =>
  !issue.pull_request &&  // 没有 pr 字段
  !issue.title.toLowerCase().includes('pull request')
);
```

---

## 🚀 下一步

收集完成后：

```bash
# 1. 查看收集的数据
cat data/github-issues/README.md

# 2. 转换为文章
npm run convert-issues

# 3. 预览网站
npm run dev
```

---

## 📚 相关文档

- [完整使用文档](../scripts/README-收集工具.md)
- [快速开始指南](../docs/快速开始-自动化收集.md)
- [项目配置](../CLAUDE.md)
