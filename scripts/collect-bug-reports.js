#!/usr/bin/env node

/**
 * OpenClaw Issues 收集脚本（轻量级版本）
 *
 * 收集所有已关闭的 issues，构建轻量级搜索索引
 *
 * 功能：
 * 1. 收集所有 state:closed 的 issues
 * 2. 只保留核心字段：标题、链接、简短描述、标签
 * 3. 不做翻译，保持原始内容
 * 4. 生成优化的搜索索引
 * 5. 支持断点续传
 *
 * 使用方法：
 * 方式1: export GITHUB_TOKEN=xxx && npm run collect-issues
 * 方式2: 创建 .env 文件添加 GITHUB_TOKEN=xxx
 * 方式3: npm run collect-issues --token=ghp_xxx
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 加载 .env 文件（如果存在）
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      const [, key, value] = match;
      process.env[key.trim()] = value.trim().replace(/^["']|["']$/g, '');
    }
  });
}

// 配置
const CONFIG = {
  // GitHub 配置
  owner: 'openclaw',
  repo: 'openclaw',
  state: 'closed',        // 只获取已关闭的
  perPage: 100,
  maxIssues: null,        // null = 获取所有

  // 输出目录
  outputDir: path.join(__dirname, '..', 'data', 'issues'),

  // 性能配置
  delayBetweenPages: 800,  // 页面间延迟（毫秒）
};

const GITHUB_API = 'https://api.github.com';

/**
 * 初始化数据文件
 */
function initDataFile(filename) {
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
      filter: {
        state: CONFIG.state,
      },
    },
    issues: [],
  };

  fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8');
  return filepath;
}

/**
 * 增量保存 issue
 */
function appendIssueToFile(filename, issue) {
  const filepath = path.join(CONFIG.outputDir, filename);
  const data = JSON.parse(fs.readFileSync(filepath, 'utf-8'));

  data.issues.push(issue);
  data.meta.last_updated = new Date().toISOString();
  data.meta.total_count = data.issues.length;

  fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8');
  return data.issues.length;
}

/**
 * 完成数据收集
 */
function finalizeDataFile(filename) {
  const filepath = path.join(CONFIG.outputDir, filename);
  const data = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
  data.meta.completed_at = new Date().toISOString();
  data.meta.status = 'completed';
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8');
}

/**
 * 简化 issue 数据结构，只保留核心字段
 */
function simplifyIssue(issue) {
  const body = issue.body || '';

  // 提取简短描述（前 200 字符，移除 Markdown 标记）
  let shortDesc = body
    .replace(/```[\s\S]*?```/g, '')  // 移除代码块
    .replace(/`[^`]+`/g, '')         // 移除行内代码
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')  // 移除链接，保留文本
    .replace(/[#*_~>`-]/g, '')       // 移除 Markdown 标记
    .replace(/\s+/g, ' ')            // 合并空白
    .trim()
    .substring(0, 200);

  return {
    id: issue.id,
    number: issue.number,
    title: issue.title,
    url: issue.html_url,
    short_desc: shortDesc,
    labels: issue.labels.map(l => l.name),
    state: issue.state,
    created_at: issue.created_at,
    closed_at: issue.closed_at,
    author: issue.user?.login || 'unknown',
    comments_count: issue.comments,
  };
}

/**
 * 从 GitHub API 获取已关闭的 issues（支持断点续传）
 */
async function fetchIssues() {
  // 优先级：命令行参数 > 环境变量 > .env 文件
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    console.error('❌ 错误：未设置 GITHUB_TOKEN');
    console.error('\n请使用以下方式之一设置：');
    console.error('  1. 临时设置: export GITHUB_TOKEN="ghp_xxx"');
    console.error('  2. 创建 .env 文件并添加: GITHUB_TOKEN=ghp_xxx');
    console.error('  3. 命令行: npm run collect-issues -- --token=ghp_xxx\n');
    process.exit(1);
  }

  // 检查是否已有数据文件（断点续传）
  const rawFile = path.join(CONFIG.outputDir, 'issues-raw.json');
  let startPage = 1;
  let existingCount = 0;
  const existingIds = new Set();  // 用于检测重复
  let consecutiveEmptyPages = 0;  // 连续空页面计数
  const MAX_EMPTY_PAGES = 3;  // 最大允许连续空页面数

  if (fs.existsSync(rawFile)) {
    const existingData = JSON.parse(fs.readFileSync(rawFile, 'utf-8'));
    existingCount = existingData.issues.length;
    startPage = Math.ceil(existingCount / CONFIG.perPage) + 1;

    // 记录已存在的 issue IDs
    existingData.issues.forEach(function(issue) {
      existingIds.add(issue.id);
    });

    console.log('🔄 检测到已有数据，启用断点续传');
    console.log(`   已收集: ${existingCount} 个 issues`);
    console.log(`   继续从第 ${startPage} 页开始\n`);
  } else {
    initDataFile('issues-raw.json');
  }

  let page = startPage;
  let hasMore = true;
  let totalCount = existingCount;
  let duplicateCount = 0;  // 本次会话发现的重复数量
  let consecutiveDuplicates = 0;  // 连续重复计数
  const MAX_DUPLICATES = 3;  // 连续重复超过3次就停止

  console.log('🔍 开始收集已关闭的 Issues...\n');
  console.log(`📌 状态: ${CONFIG.state}`);
  console.log(`📌 仓库: ${CONFIG.owner}/${CONFIG.repo}`);
  console.log(`💾 模式: 增量保存\n`);

  const startTime = Date.now();

  while (hasMore) {
    if (CONFIG.maxIssues && totalCount >= CONFIG.maxIssues) {
      console.log(`\n✓ 已达到最大数量限制 (${CONFIG.maxIssues})`);
      break;
    }

    // 构建 GitHub API 查询
    const url = `${GITHUB_API}/repos/${CONFIG.owner}/${CONFIG.repo}/issues?` +
      `state=${CONFIG.state}&` +
      `per_page=${CONFIG.perPage}&` +
      `page=${page}&` +
      `sort=updated&` +
      `direction=desc`;

    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'OpenClaw-Issue-Collector',
    };

    if (token) {
      headers['Authorization'] = `token ${token}`;
    }

    try {
      const response = await fetch(url, { headers });

      // 速率限制检查
      const remaining = response.headers.get('X-RateLimit-Remaining');
      if (remaining && parseInt(remaining) < 10) {
        const reset = response.headers.get('X-RateLimit-Reset');
        const resetTime = new Date(parseInt(reset) * 1000);
        const waitSeconds = Math.ceil((resetTime - new Date()) / 1000);
        console.log(`\n⚠️  接近速率限制，等待 ${waitSeconds} 秒...`);
        await new Promise(resolve => setTimeout(resolve, waitSeconds * 1000));
      }

      if (!response.ok) {
        if (response.status === 404) {
          console.error(`\n❌ 仓库未找到: ${CONFIG.owner}/${CONFIG.repo}\n`);
        } else if (response.status === 403) {
          console.error('\n❌ GitHub API 速率限制');
          console.log('💡 设置 GITHUB_TOKEN 环境变量\n');
        } else {
          console.error(`\n❌ 请求失败: ${response.status} ${response.statusText}\n`);
        }
        break;
      }

      const data = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        hasMore = false;
        console.log(`\n✓ 没有更多数据`);
        break;
      }

      // 检查是否所有数据都是重复的
      const existingIds = existingCount > 0
        ? new Set(JSON.parse(fs.readFileSync(rawFile, 'utf-8')).issues.map(i => i.id))
        : new Set();

      const newIssues = data.filter(issue => !existingIds.has(issue.id));

      if (newIssues.length === 0) {
        consecutiveDuplicates++;
        console.log(`⚠️  第 ${page} 页全是重复数据 (${consecutiveDuplicates}/${MAX_DUPLICATES})`);

        if (consecutiveDuplicates >= MAX_DUPLICATES) {
          console.log(`\n✓ 检测到连续 ${MAX_DUPLICATES} 页重复数据，停止收集`);
          break;
        }
      } else {
        consecutiveDuplicates = 0;  // 重置计数器

        // 保存这一页的新 issues
        for (const issue of newIssues) {
          appendIssueToFile('issues-raw.json', issue);
          totalCount++;
        }

        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        const sessionCount = totalCount - existingCount;  // 本次会话收集的数量
        const avgRate = sessionCount > 0 ? (sessionCount / elapsed).toFixed(1) : '0';

        console.log(`✓ 第 ${page} 页: +${newIssues.length} 个 issues (共 ${data.length} 个) | 总计: ${totalCount} | 本次平均: ${avgRate} 个/秒 💾`);
      }

      page++;

      if (CONFIG.delayBetweenPages > 0) {
        await new Promise(resolve => setTimeout(resolve, CONFIG.delayBetweenPages));
      }

    } catch (error) {
      console.error(`\n❌ 请求失败:`, error.message);
      break;
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  const sessionCount = totalCount - existingCount;
  console.log(`\n📊 总共获取 ${totalCount} 个已关闭的 issues (本次新增 ${sessionCount} 个)`);
  if (duplicateCount > 0) {
    console.log(`   跳过 ${duplicateCount} 个重复的 issues`);
  }
  console.log(`   耗时 ${elapsed} 秒\n`);

  const rawData = JSON.parse(fs.readFileSync(path.join(CONFIG.outputDir, 'issues-raw.json'), 'utf-8'));
  return rawData.issues;
}

/**
 * 处理 issues（简化数据结构 + 去重）
 */
async function processIssues(rawIssues) {
  console.log('🧹 简化 issue 数据结构...\n');

  // 去重（按 issue number）
  const seenNumbers = new Set();
  const uniqueIssues = [];

  rawIssues.forEach(issue => {
    if (!seenNumbers.has(issue.number)) {
      seenNumbers.add(issue.number);
      uniqueIssues.push(issue);
    }
  });

  console.log(`✓ 去重前: ${rawIssues.length} 个 issues`);
  console.log(`✓ 去重后: ${uniqueIssues.length} 个 issues\n`);

  initDataFile('issues.json');

  let processedCount = 0;

  for (let i = 0; i < uniqueIssues.length; i++) {
    const rawIssue = uniqueIssues[i];
    const simplified = simplifyIssue(rawIssue);

    // 保存简化后的数据
    appendIssueToFile('issues.json', simplified);
    processedCount++;

    if (processedCount % 100 === 0 || i === uniqueIssues.length - 1) {
      console.log(`✓ 处理进度: ${i + 1}/${uniqueIssues.length} | 已保存: ${processedCount} 💾`);
    }
  }

  finalizeDataFile('issues.json');

  console.log(`\n✅ 处理完成！共 ${processedCount} 个 issues\n`);

  const processedData = JSON.parse(fs.readFileSync(path.join(CONFIG.outputDir, 'issues.json'), 'utf-8'));
  return processedData.issues;
}

/**
 * 生成统计信息
 */
function generateStats(issues) {
  console.log('📊 生成统计信息...\n');

  // 标签统计
  const labelCounts = {};
  issues.forEach(issue => {
    issue.labels.forEach(label => {
      labelCounts[label] = (labelCounts[label] || 0) + 1;
    });
  });

  const topLabels = Object.entries(labelCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  console.log('🏷️  热门标签:');
  topLabels.forEach(([label, count]) => {
    console.log(`   ${label}: ${count}`);
  });

  // 时间统计
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const recentIssues = issues.filter(i => new Date(i.closed_at) > weekAgo);

  console.log(`\n📅 时间统计:`);
  console.log(`   最近 7 天关闭: ${recentIssues.length} 个`);

  // 保存统计信息
  const stats = {
    total: issues.length,
    recent_week: recentIssues.length,
    top_labels: topLabels,
    generated_at: new Date().toISOString(),
  };

  const statsFile = path.join(CONFIG.outputDir, 'stats.json');
  fs.writeFileSync(statsFile, JSON.stringify(stats, null, 2), 'utf-8');
  console.log(`\n✓ 统计信息已保存: ${statsFile}\n`);
}

/**
 * 主函数
 */
async function main() {
  console.log('🚀 OpenClaw Issues 收集工具（轻量版）\n');
  console.log('='.repeat(60));

  // 检查是否已有处理后的数据
  const processedFile = path.join(CONFIG.outputDir, 'issues.json');
  const rawFile = path.join(CONFIG.outputDir, 'issues-raw.json');

  const shouldCollect = !fs.existsSync(rawFile);
  const shouldProcess = !fs.existsSync(processedFile);

  try {
    // 1. 如果需要收集数据
    if (shouldCollect) {
      const rawIssues = await fetchIssues();

      if (rawIssues.length === 0) {
        console.log('⚠️  没有找到任何已关闭的 issues');
        return;
      }

      // 继续处理
      const processedIssues = await processIssues(rawIssues);
      generateStats(processedIssues);
    } else if (shouldProcess) {
      // 2. 已有 raw 数据，只需处理
      console.log('🔄 检测到已有原始数据，跳过收集步骤\n');
      const rawData = JSON.parse(fs.readFileSync(rawFile, 'utf-8'));
      const processedIssues = await processIssues(rawData.issues);
      generateStats(processedIssues);
    } else {
      // 3. 已有完整数据
      console.log('✅ 检测到已有完整数据\n');
      console.log('📂 数据文件:');
      console.log('   - data/issues/issues-raw.json  (原始数据)');
      console.log('   - data/issues/issues.json      (处理后数据)');
      console.log('   - data/issues/stats.json       (统计信息)\n');

      const processedData = JSON.parse(fs.readFileSync(processedFile, 'utf-8'));
      console.log(`📊 当前数据: ${processedData.issues.length} 个 issues\n`);
    }

    // 4. 清理临时文件
    const tempFile = path.join(CONFIG.outputDir, 'issues-raw.json');
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
      console.log('✓ 已清理临时文件\n');
    }

    console.log('='.repeat(60));
    console.log('✅ 全部完成!\n');
    console.log('📂 数据保存在:', CONFIG.outputDir);
    console.log('   - issues.json       (简化数据)');
    console.log('   - stats.json        (统计信息)\n');
    console.log('💡 下一步:');
    console.log('   1. 运行 npm run generate-search-index 生成搜索索引');
    console.log('   2. 运行 npm run build 构建网站\n');

  } catch (error) {
    console.error('\n❌ 发生错误:', error);
    process.exit(1);
  }
}

main();
