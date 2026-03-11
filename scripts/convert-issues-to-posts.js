#!/usr/bin/env node

/**
 * 将收集的 GitHub Issues 转换为教程文章
 *
 * 从 data/github-issues/issues-zh-cn.json 读取数据，
 * 将选中的 issues 转换为 Markdown 格式的文章
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG = {
  // 输入文件
  inputFile: path.join(__dirname, '..', 'data', 'github-issues', 'issues-zh-cn.json'),

  // 输出目录
  outputDirEN: path.join(__dirname, '..', 'src', 'content', 'posts'),
  outputDirCN: path.join(__dirname, '..', 'src', 'content', 'posts-zh-cn'),

  // 要转换的 issues 编号列表（留空则转换所有）
  selectedIssues: [], // 示例: [42, 123, 456]

  // 标签映射（GitHub label -> 文章标签）
  labelMapping: {
    'installation': 'installation',
    'question': 'qa',
    'bug': 'troubleshooting',
    'documentation': 'documentation',
    'good first issue': 'beginner',
  },

  // 难度映射
  difficultyMapping: {
    'good first issue': 'beginner',
    'help wanted': 'intermediate',
    'bug': 'intermediate',
  },
};

/**
 * 读取收集的 issues 数据
 */
function loadIssues() {
  console.log('📖 读取 issues 数据...\n');

  if (!fs.existsSync(CONFIG.inputFile)) {
    console.error(`❌ 文件不存在: ${CONFIG.inputFile}`);
    console.log('💡 请先运行: npm run collect-issues\n');
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(CONFIG.inputFile, 'utf-8'));
  console.log(`✓ 已加载 ${data.issues.length} 个 issues\n`);

  return data.issues;
}

/**
 * 筛选要转换的 issues
 */
function filterIssues(issues) {
  let filtered = issues;

  if (CONFIG.selectedIssues.length > 0) {
    filtered = issues.filter(issue =>
      CONFIG.selectedIssues.includes(issue.number)
    );
    console.log(`🎯 筛选 ${filtered.length} 个选定的 issues\n`);
  } else {
    console.log(`📋 将转换所有 ${filtered.length} 个 issues\n`);
  }

  return filtered;
}

/**
 * 生成文件名
 */
function generateSlug(title) {
  // 移除特殊字符，转换为小写，用连字符连接
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * 获取难度级别
 */
function getDifficulty(labels) {
  for (const label of labels) {
    if (CONFIG.difficultyMapping[label]) {
      return CONFIG.difficultyMapping[label];
    }
  }
  return 'beginner'; // 默认
}

/**
 * 估算阅读时间（基于字符数）
 */
function estimateTime(text) {
  // 假设平均阅读速度：英文 200 词/分钟，中文 500 字/分钟
  const length = text.length;
  const minutes = Math.max(1, Math.ceil(length / 500));
  return `${minutes} minutes`;
}

/**
 * 生成 frontmatter
 */
function generateFrontmatter(issue, lang = 'en') {
  const slug = generateSlug(issue.title);
  const zhSlug = generateSlug(issue.translations?.zhCN?.title || issue.title);
  const difficulty = getDifficulty(issue.labels);

  const isEN = lang === 'en';
  const title = isEN ? issue.title : (issue.translations?.zhCN?.title || issue.title);
  const description = isEN
    ? `Solution for ${issue.title.substring(0, 100)}...`
    : `${issue.translations?.zhCN?.title || issue.title} 的解决方案`;

  // 标签转换
  const tags = issue.labels
    .map(label => CONFIG.labelMapping[label] || label)
    .filter(tag => tag);

  if (!tags.includes('qa')) {
    tags.push('qa');
  }

  const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
description: "${description.replace(/"/g, '\\"')}"
pubDate: ${new Date(issue.closed_at).toISOString().split('T')[0]}
lastUpdated: ${new Date(issue.updated_at).toISOString().split('T')[0]}
tags: [${tags.map(t => `"${t}"`).join(', ')}]
difficulty: "${difficulty}"
estimatedTime: "${estimateTime(issue.body)}"
prerequisites: ["OpenClaw installed"]
alternates:
  ${isEN ? 'zhCN' : 'en'}: "${isEN ? '/zh-cn' : ''}/posts/${slug}/"
source:
  type: "github"
  url: "${issue.url}"
  number: ${issue.number}
  author: "${issue.author}"
---

`;

  return frontmatter;
}

/**
 * 生成文章内容
 */
function generateContent(issue, lang = 'en') {
  const isEN = lang === 'en';
  const title = isEN ? issue.title : (issue.translations?.zhCN?.title || issue.title);
  const body = isEN ? issue.body : (issue.translations?.zhCN?.body || issue.body);

  let content = '';

  // 添加概述
  content += `> **来源**: [GitHub Issue #${issue.number}](${issue.url})\n`;
  content += `> **作者**: ${issue.author}\n`;
  content += `> **解决时间**: ${new Date(issue.closed_at).toLocaleString(isEN ? 'en-US' : 'zh-CN')}\n\n`;

  // 添加问题描述
  content += `## ${isEN ? '问题描述' : 'Problem Description'}\n\n`;
  content += body + '\n\n';

  // 添加解决方案占位符
  content += `## ${isEN ? '解决方案' : 'Solution'}\n\n`;
  content += `> 📝 **TODO**: ${isEN ? 'Add solution details here' : '在此添加解决方案详情'}\n\n`;
  content += isEN
    ? 'Please check the [GitHub discussion](' + issue.url + ') for the solution.'
    : '请查看 [GitHub 讨论](' + issue.url + ') 了解解决方案。';
  content += '\n\n';

  // 添加代码示例占位符
  content += `## ${isEN ? '代码示例' : 'Code Examples'}\n\n`;
  content += '```javascript\n';
  content += `// ${isEN ? 'Add code examples here' : '在此添加代码示例'}\n`;
  content += '```\n\n';

  // 添加相关链接
  content += `## ${isEN ? '相关资源' : 'Related Resources'}\n\n`;
  content += `- [Original Discussion](${issue.url})\n`;
  if (issue.labels.length > 0) {
    content += `- **Tags**: ${issue.labels.join(', ')}\n`;
  }

  return content;
}

/**
 * 保存文章
 */
function saveArticle(content, filepath) {
  // 确保目录存在
  const dir = path.dirname(filepath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // 如果文件已存在，添加后缀
  let finalPath = filepath;
  let counter = 1;
  while (fs.existsSync(finalPath)) {
    const ext = path.extname(filepath);
    const base = filepath.substring(0, filepath.length - ext.length);
    finalPath = `${base}-${counter}${ext}`;
    counter++;
  }

  fs.writeFileSync(finalPath, content, 'utf-8');
  console.log(`  ✓ ${path.relative(path.join(__dirname, '..'), finalPath)}`);

  return finalPath;
}

/**
 * 转换单个 issue 为文章
 */
function convertIssueToPost(issue) {
  const slug = generateSlug(issue.title);
  const date = new Date(issue.closed_at).toISOString().split('T')[0];
  const dateDir = date.replace(/-/g, '');

  // 生成英文文章
  console.log(`\n📝 转换: #${issue.number} - ${issue.title.substring(0, 50)}...`);

  const enContent = generateFrontmatter(issue, 'en') + generateContent(issue, 'en');
  const enPath = path.join(CONFIG.outputDirEN, `${dateDir}-${slug}.md`);
  saveArticle(enContent, enPath);

  // 生成中文文章
  if (issue.translations?.zhCN) {
    const zhContent = generateFrontmatter(issue, 'zh-cn') + generateContent(issue, 'zh-cn');
    const zhPath = path.join(CONFIG.outputDirCN, `${dateDir}-${slug}.md`);
    saveArticle(zhPath, zhPath);
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('🔄 GitHub Issues 转教程文章工具\n');
  console.log('='.repeat(60));

  try {
    // 1. 加载 issues
    const issues = loadIssues();

    // 2. 筛选
    const filtered = filterIssues(issues);

    if (filtered.length === 0) {
      console.log('⚠️  没有要转换的 issues');
      return;
    }

    // 3. 转换
    console.log('\n📝 开始转换...\n');
    filtered.forEach(convertIssueToPost);

    console.log('\n' + '='.repeat(60));
    console.log(`\n✅ 成功转换 ${filtered.length} 个 issues 为教程文章！\n`);

    console.log('📂 文章位置:');
    console.log(`   英文: ${CONFIG.outputDirEN}`);
    console.log(`   中文: ${CONFIG.outputDirCN}\n`);

    console.log('💡 下一步:');
    console.log('   1. 检查生成的文章内容');
    console.log('   2. 补充解决方案详情');
    console.log('   3. 添加代码示例');
    console.log('   4. 运行 npm run dev 预览\n');

  } catch (error) {
    console.error('\n❌ 发生错误:', error);
    process.exit(1);
  }
}

// 运行
main();
