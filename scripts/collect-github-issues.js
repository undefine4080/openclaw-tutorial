#!/usr/bin/env node

/**
 * OpenClaw GitHub Issues 收集脚本（增量保存版）
 *
 * 功能：
 * 1. 从 GitHub 拉取 OpenClaw 项目的 issues
 * 2. 筛选出已解决的问题 (closed 状态)
 * 3. 将英文内容翻译成中文
 * 4. 💾 爬一个保存一个（增量保存）
 *
 * 使用方法：
 * 1. 设置 GitHub Token (可选，提高请求限制)
 *    export GITHUB_TOKEN=your_token_here
 * 2. 设置翻译方式（可选）
 *    export DEEPL_API_KEY=your_key  # 使用 DeepL（推荐）
 *    export OPENAI_API_KEY=your_key # 使用 OpenAI
 *    不设置则只保存英文版本
 * 3. 运行脚本
 *    npm run collect-issues
 *    或
 *    node scripts/collect-github-issues.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配置
const CONFIG = {
  // GitHub 配置
  owner: 'openclaw',
  repo: 'openclaw', // 根据实际仓库修改
  state: 'closed', // 只获取已关闭的 issues
  perPage: 100,    // 每页数量（GitHub API 最大 100）
  maxIssues: null, // 最大获取数量，null 表示获取所有

  // 输出目录
  outputDir: path.join(__dirname, '..', 'data', 'github-issues'),

  // 翻译配置
  enableTranslation: true,
  translateMethod: 'auto', // 'deepl' | 'openai' | 'auto'

  // 性能配置
  delayBetweenPages: 1000, // 每页之间的延迟（毫秒）
  delayBetweenIssues: 500, // 翻译每个 issue 之间的延迟
};

// GitHub API 基础 URL
const GITHUB_API = 'https://api.github.com';

/**
 * 初始化数据文件
 * 创建或清空 JSON 文件，准备接收增量数据
 */
function initDataFile(filename, initialData = { issues: [] }) {
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
  }

  const filepath = path.join(CONFIG.outputDir, filename);
  const data = {
    meta: {
      started_at: new Date().toISOString(),
      last_updated: new Date().toISOString(),
      total_count: 0,
      source: `github.com/${CONFIG.owner}/${CONFIG.repo}`,
    },
    issues: initialData.issues,
  };

  fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8');
  return filepath;
}

/**
 * 增量保存数据
 * 将新的 issues 追加到现有文件中
 */
function appendIssueToFile(filename, issue) {
  const filepath = path.join(CONFIG.outputDir, filename);

  // 读取现有数据
  let data = { meta: {}, issues: [] };
  if (fs.existsSync(filepath)) {
    data = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
  }

  // 添加新 issue
  data.issues.push(issue);

  // 更新元数据
  data.meta.last_updated = new Date().toISOString();
  data.meta.total_count = data.issues.length;

  // 保存
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8');

  return data.issues.length;
}

/**
 * 批量追加 issues
 */
function appendIssuesToFile(filename, newIssues) {
  const filepath = path.join(CONFIG.outputDir, filename);

  // 读取现有数据
  let data = { meta: {}, issues: [] };
  if (fs.existsSync(filepath)) {
    data = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
  }

  // 追加新 issues
  data.issues.push(...newIssues);

  // 更新元数据
  data.meta.last_updated = new Date().toISOString();
  data.meta.total_count = data.issues.length;

  // 保存
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8');

  return data.issues.length;
}

/**
 * 完成数据收集
 * 标记文件为已完成
 */
function finalizeDataFile(filename) {
  const filepath = path.join(CONFIG.outputDir, filename);

  if (!fs.existsSync(filepath)) {
    return;
  }

  const data = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
  data.meta.completed_at = new Date().toISOString();
  data.meta.status = 'completed';

  fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8');
}

/**
 * 从 GitHub API 获取 issues（增量保存版本）
 */
async function fetchGitHubIssues() {
  const token = process.env.GITHUB_TOKEN;
  let page = 1;
  let hasMore = true;
  let totalCount = 0;

  // 初始化输出文件
  const rawFile = initDataFile('issues-raw-temp.json', { issues: [] });

  console.log('🔍 开始从 GitHub 获取 issues...\n');
  console.log(`📌 配置: ${CONFIG.maxIssues ? `最多 ${CONFIG.maxIssues} 个` : '获取所有'}已关闭的 issues`);
  console.log(`📌 仓库: ${CONFIG.owner}/${CONFIG.repo}`);
  console.log(`💾 模式: 增量保存（爬一个保存一个）`);
  console.log('');

  const startTime = Date.now();

  while (hasMore) {
    // 检查是否达到最大数量
    if (CONFIG.maxIssues && totalCount >= CONFIG.maxIssues) {
      console.log(`\n✓ 已达到最大数量限制 (${CONFIG.maxIssues})`);
      break;
    }

    const perPage = CONFIG.perPage;
    if (CONFIG.maxIssues) {
      perPage = Math.min(CONFIG.perPage, CONFIG.maxIssues - totalCount);
    }

    let url = `${GITHUB_API}/repos/${CONFIG.owner}/${CONFIG.repo}/issues?state=${CONFIG.state}&per_page=${perPage}&page=${page}&sort=updated&direction=desc`;

    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'OpenClaw-Tutorial-Collector',
    };

    if (token) {
      headers['Authorization'] = `token ${token}`;
    }

    try {
      const response = await fetch(url, { headers });

      // 检查速率限制
      const remaining = response.headers.get('X-RateLimit-Remaining');
      const reset = response.headers.get('X-RateLimit-Reset');
      if (remaining && parseInt(remaining) < 10) {
        const resetTime = new Date(parseInt(reset) * 1000);
        const waitSeconds = Math.ceil((resetTime - new Date()) / 1000);
        console.log(`\n⚠️  接近速率限制，等待 ${waitSeconds} 秒...`);
        await new Promise(resolve => setTimeout(resolve, waitSeconds * 1000));
      }

      if (!response.ok) {
        if (response.status === 404) {
          console.error(`\n❌ 仓库未找到: ${CONFIG.owner}/${CONFIG.repo}`);
          console.log('💡 请修改脚本中的 CONFIG.repo 为正确的仓库名\n');
        } else if (response.status === 403) {
          console.error('\n❌ GitHub API 速率限制');
          console.log('💡 解决方案:');
          console.log('   1. 设置 GITHUB_TOKEN 环境变量（提高到 5000 次/小时）');
          console.log('   2. 等待速率限制重置（通常 1 小时）');
          console.log(`   3. 当前数据已保存到 ${rawFile}\n`);
        } else {
          console.error(`\n❌ 请求失败: ${response.status} ${response.statusText}`);
        }
        break;
      }

      const data = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        hasMore = false;
        console.log(`\n✓ 没有更多数据`);
        break;
      }

      // 💾 立即保存这一页的 issues
      const newTotal = appendIssuesToFile('issues-raw-temp.json', data);
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      const avgRate = (newTotal / elapsed).toFixed(1);

      console.log(`✓ 第 ${page} 页: +${data.length} 个 issues | 总计: ${newTotal} | 平均: ${avgRate} 个/秒 💾`);

      totalCount = newTotal;
      page++;

      // 页间延迟
      if (CONFIG.delayBetweenPages > 0) {
        await new Promise(resolve => setTimeout(resolve, CONFIG.delayBetweenPages));
      }

    } catch (error) {
      console.error(`\n❌ 请求失败:`, error.message);
      console.log(`💡 当前数据已保存到 ${rawFile}，可以重新运行脚本继续\n`);
      break;
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n📊 总共获取 ${totalCount} 个原始 issues (耗时 ${elapsed}秒)\n`);

  // 读取并返回所有收集的数据
  const rawData = JSON.parse(fs.readFileSync(path.join(CONFIG.outputDir, 'issues-raw-temp.json'), 'utf-8'));
  return rawData.issues;
}

/**
 * 过滤和清理 issue 数据（逐个处理并保存）
 */
async function filterIssuesIncremental(issues) {
  console.log('🧹 清理和过滤 issue 数据（增量模式）...\n');

  // 初始化输出文件
  initDataFile('issues-en.json', { issues: [] });

  let filteredCount = 0;
  let skippedCount = 0;

  for (let i = 0; i < issues.length; i++) {
    const rawIssue = issues[i];

    // 提取标签
    const labels = rawIssue.labels.map(label => label.name);

    // 检查是否有答案（通过评论）
    const hasAnswer = rawIssue.comments > 0;

    const issue = {
      id: rawIssue.id,
      number: rawIssue.number,
      title: rawIssue.title,
      body: rawIssue.body || '',
      state: rawIssue.state,
      created_at: rawIssue.created_at,
      updated_at: rawIssue.updated_at,
      closed_at: rawIssue.closed_at,
      labels: labels,
      comments_count: rawIssue.comments,
      has_answer: hasAnswer,
      url: rawIssue.html_url,
      author: rawIssue.user?.login || 'unknown',
    };

    // 过滤掉 pull requests
    const isPR = issue.title.toLowerCase().includes('pull request');

    if (!isPR) {
      // 💾 立即保存这个过滤后的 issue
      appendIssueToFile('issues-en.json', issue);
      filteredCount++;

      // 显示进度
      if (filteredCount % 10 === 0 || i === issues.length - 1) {
        console.log(`✓ 过滤进度: ${i + 1}/${issues.length} | 有效: ${filteredCount} | 跳过: ${skippedCount} 💾`);
      }
    } else {
      skippedCount++;
    }
  }

  // 完成文件
  finalizeDataFile('issues-en.json');

  console.log(`\n✅ 过滤完成！保留 ${filteredCount} 个有效 issues，跳过 ${skippedCount} 个\n`);

  // 读取并返回过滤后的数据
  const filteredData = JSON.parse(fs.readFileSync(path.join(CONFIG.outputDir, 'issues-en.json'), 'utf-8'));
  return filteredData.issues;
}

/**
 * 翻译文本到中文
 */
async function translateToCN(text, method = 'auto') {
  if (!text || text.trim() === '') return '';

  // 检测可用的翻译方式
  const deepLKey = process.env.DEEPL_API_KEY;
  const openAIKey = process.env.OPENAI_API_KEY;

  let translateMethod = method;
  if (method === 'auto') {
    if (deepLKey) translateMethod = 'deepl';
    else if (openAIKey) translateMethod = 'openai';
    else {
      return null;
    }
  }

  try {
    switch (translateMethod) {
      case 'deepl':
        return await translateWithDeepL(text, deepLKey);
      case 'openai':
        return await translateWithOpenAI(text, openAIKey);
      default:
        return null;
    }
  } catch (error) {
    console.error(`  ❌ 翻译失败: ${error.message}`);
    return null;
  }
}

/**
 * 使用 DeepL 翻译
 */
async function translateWithDeepL(text, apiKey) {
  const url = 'https://api-free.deepl.com/v2/translate';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `DeepL-Auth-Key ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: [text],
      target_lang: 'ZH',
      source_lang: 'EN',
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'DeepL API error');
  }

  const data = await response.json();
  return data.translations[0].text;
}

/**
 * 使用 OpenAI 翻译
 */
async function translateWithOpenAI(text, apiKey) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a professional translator. Translate the following technical content from English to Chinese (Simplified). Keep technical terms like API, CLI, JSON in English when appropriate.',
        },
        {
          role: 'user',
          content: text,
        },
      ],
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'OpenAI API error');
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

/**
 * 翻译 issue 数据（逐个翻译并立即保存）
 */
async function translateIssuesIncremental(issues) {
  console.log('🌐 开始翻译 issues（增量保存模式）...\n');

  // 初始化输出文件
  initDataFile('issues-zh-cn.json', { issues: [] });

  const total = issues.length;
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < total; i++) {
    const issue = issues[i];
    const progress = `[${i + 1}/${total}]`;

    console.log(`${progress} 翻译: ${issue.title.substring(0, 50)}...`);

    // 翻译标题和正文
    const translatedTitle = await translateToCN(issue.title);
    const translatedBody = await translateToCN(issue.body);

    if (translatedTitle || translatedBody) {
      const translatedIssue = {
        ...issue,
        translations: {
          zhCN: {
            title: translatedTitle || issue.title,
            body: translatedBody || issue.body,
          },
        },
      };

      // 💾 立即保存这个翻译后的 issue
      appendIssueToFile('issues-zh-cn.json', translatedIssue);
      successCount++;

      console.log(`  ✅ 已保存 💾\n`);
    } else {
      failCount++;
      console.log(`  ⚠️  翻译失败，保留原文\n`);
      // 即使翻译失败也保存原文
      appendIssueToFile('issues-zh-cn.json', issue);
    }

    // 显示进度统计
    if (successCount % 5 === 0 || i === total - 1) {
      console.log(`  📊 进度: 成功 ${successCount} | 失败 ${failCount} | 总计 ${i + 1}/${total}\n`);
    }

    // API 限制：添加延迟
    if (CONFIG.delayBetweenIssues > 0) {
      await new Promise(resolve => setTimeout(resolve, CONFIG.delayBetweenIssues));
    }
  }

  // 完成文件
  finalizeDataFile('issues-zh-cn.json');

  console.log(`\n✅ 翻译完成！成功 ${successCount} 个，失败 ${failCount} 个\n`);

  // 读取并返回翻译后的数据
  const translatedData = JSON.parse(fs.readFileSync(path.join(CONFIG.outputDir, 'issues-zh-cn.json'), 'utf-8'));
  return translatedData.issues;
}

/**
 * 生成 Markdown 摘要文件
 */
function generateMarkdownSummary(issues) {
  const filepath = path.join(CONFIG.outputDir, 'README.md');

  let markdown = `# GitHub Issues 收集摘要

> 收集时间: ${new Date().toLocaleString('zh-CN')}
> 来源: https://github.com/${CONFIG.owner}/${CONFIG.repo}
> 总数: ${issues.length} 个已解决的 issues

## 📋 Issues 列表

`;

  issues.forEach((issue, index) => {
    const translatedTitle = issue.translations?.zhCN?.title || issue.title;
    markdown += `### ${index + 1}. ${translatedTitle}\n\n`;
    markdown += `- **Issue**: [#${issue.number}](${issue.url})\n`;
    markdown += `- **作者**: ${issue.author}\n`;
    markdown += `- **标签**: ${issue.labels.join(', ') || '无'}\n`;
    markdown += `- **评论数**: ${issue.comments_count}\n`;
    markdown += `- **解决时间**: ${new Date(issue.closed_at).toLocaleString('zh-CN')}\n\n`;
  });

  fs.writeFileSync(filepath, markdown, 'utf-8');
  console.log(`✓ 已生成摘要: ${filepath}`);
}

/**
 * 主函数
 */
async function main() {
  console.log('🚀 OpenClaw GitHub Issues 收集工具（增量保存版）\n');
  console.log('='.repeat(60));

  try {
    // 1. 获取 issues（增量保存到 issues-raw-temp.json）
    const rawIssues = await fetchGitHubIssues();

    if (rawIssues.length === 0) {
      console.log('⚠️  没有获取到任何 issues，请检查配置');
      return;
    }

    // 2. 过滤和清理（增量保存到 issues-en.json）
    const filteredIssues = await filterIssuesIncremental(rawIssues);

    // 3. 翻译（如果启用，增量保存到 issues-zh-cn.json）
    if (CONFIG.enableTranslation) {
      await translateIssuesIncremental(filteredIssues);
    }

    // 4. 生成 Markdown 摘要
    console.log('');
    generateMarkdownSummary(filteredIssues);

    // 5. 清理临时文件
    const tempFile = path.join(CONFIG.outputDir, 'issues-raw-temp.json');
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
      console.log(`✓ 已清理临时文件\n`);
    }

    console.log('='.repeat(60));
    console.log('✅ 全部完成!\n');
    console.log('📂 数据保存在:', CONFIG.outputDir);
    console.log('   - issues-en.json      (英文)');
    console.log('   - issues-zh-cn.json   (中文)');
    console.log('   - README.md           (摘要)\n');
    console.log('💡 下一步:');
    console.log('   1. 查看生成的 JSON 文件');
    console.log('   2. 阅读 data/github-issues/README.md');
    console.log('   3. 将有价值的 issues 转换为教程内容\n');

  } catch (error) {
    console.error('\n❌ 发生错误:', error);
    process.exit(1);
  }
}

// 运行
main();
