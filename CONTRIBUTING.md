# 贡献指南

感谢你关注 OpenClaw 教程项目！

## 如何贡献

### 报告问题

如果你发现教程中有错误或需要补充的内容：

1. 在 [Issues](https://github.com/undefine4080/openclaw-tutorial/issues) 中搜索是否已有相关问题
2. 如果没有，创建新的 Issue，详细描述：
   - 哪个教程有问题
   - 具体的问题描述
   - 期望的正确内容
   - 截图或错误信息（如果有）

### 内容改进

如果你想要改进内容：

1. Fork 本项目
2. 创建你的特性分支 (`git checkout -b feature/improve-tutorial`)
3. 提交你的修改 (`git commit -m '改进 XX 教程的 YY 部分'`)
4. 推送到分支 (`git push origin feature/improve-tutorial`)
5. 创建 Pull Request

### 内容规范

教程内容应该：

- **准确性**：确保技术细节正确
- **可读性**：使用清晰的标题和段落
- **完整性**：包含前置要求、步骤说明、预期结果
- **实用性**：提供常见问题和解决方案

## 开发环境

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 目录结构

```
src/content/posts-zh-cn/  # 中文教程
  ├── local-windows.md    # Windows 安装指南
  ├── local-mac.md        # macOS 安装指南
  ├── memory.md           # 记忆系统教程
  ├── feishu.md           # 飞书集成
  └── ...                 # 更多教程
```

## 许可证

通过向本项目提交内容，你同意你的贡献将按照 [MIT 许可证](LICENSE) 授权。
