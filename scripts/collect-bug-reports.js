#!/usr/bin/env node

/**
 * OpenClaw 已解决 Bug 收集脚本
 *
 * 专门收集已解决的 bug reports，整理成用户友好的问题库
 *
 * 功能：
 * 1. 只收集 state:closed + label:bug 的 issues
 * 2. 清理无关内容，保留问题+解决方案
 * 3. 翻译成中文
 * 4. 生成可搜索的问题库
 *
 * 使用方法：
 * export GITHUB_TOKEN=xxx
 * export DEEPL_API_KEY=xxx
 * npm run collect-bugs
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
  repo: 'openclaw',
  state: 'closed',        // 只获取已关闭的
  labels: ['bug'],        // 只获取 bug 标签
  perPage: 100,
  maxIssues: null,        // null = 获取所有

  // 输出目录
  outputDir: path.join(__dirname, '..', 'data', 'bug-reports'),

  // 翻译配置
  enableTranslation: true,
  translateMethod: 'auto', // 'deepl' | 'openai' | 'auto'

  // 性能配置
  delayBetweenPages: 1000,
  delayBetweenIssues: 500,
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
        labels: CONFIG.labels,
      },
    },
    bugs: [],
  };

  fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8');
  return filepath;
}

/**
 * 增量保存 bug report
 */
function appendBugToFile(filename, bug) {
  const filepath = path.join(CONFIG.outputDir, filename);
  const data = JSON.parse(fs.readFileSync(filepath, 'utf-8'));

  data.bugs.push(bug);
  data.meta.last_updated = new Date().toISOString();
  data.meta.total_count = data.bugs.length;

  fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8');
  return data.bugs.length;
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
 * 从 GitHub API 获取已解决的 bug reports
 */
async function fetchBugs() {
  const token = process.env.GITHUB_TOKEN;
  let page = 1;
  let hasMore = true;
  let totalCount = 0;

  const bugsFile = initDataFile('bugs-raw.json');

  console.log('🔍 开始收集已解决的 Bug Reports...\n');
  console.log(`📌 状态: ${CONFIG.state}`);
  console.log(`📌 标签: ${CONFIG.labels.join(', ')}`);
  console.log(`📌 仓库: ${CONFIG.owner}/${CONFIG.repo}`);
  console.log(`💾 模式: 增量保存\n`);

  const startTime = Date.now();

  while (hasMore) {
    if (CONFIG.maxIssues && totalCount >= CONFIG.maxIssues) {
      console.log(`\n✓ 已达到最大数量限制 (${CONFIG.maxIssues})`);
      break;
    }

    // 构建 GitHub API 查询
    const labelsQuery = CONFIG.labels.map(l => `label:${l}`).join(' ');
    const url = `${GITHUB_API}/repos/${CONFIG.owner}/${CONFIG.repo}/issues?` +
      `state=${CONFIG.state}&` +
      `labels=${CONFIG.labels.join(',')}&` +
      `per_page=${CONFIG.perPage}&` +
      `page=${page}&` +
      `sort=updated&` +
      `direction=desc`;

    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'OpenClaw-Bug-Collector',
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
        }
        break;
      }

      const data = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        hasMore = false;
        console.log(`\n✓ 没有更多数据`);
        break;
      }

      // 保存这一页的 bugs
      for (const bug of data) {
        appendBugToFile('bugs-raw.json', bug);
        totalCount++;
      }

      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      const avgRate = (totalCount / elapsed).toFixed(1);

      console.log(`✓ 第 ${page} 页: +${data.length} 个 bug reports | 总计: ${totalCount} | 平均: ${avgRate} 个/秒 💾`);

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
  console.log(`\n📊 总共获取 ${totalCount} 个已解决的 bug reports (耗时 ${elapsed}秒)\n`);

  const rawData = JSON.parse(fs.readFileSync(path.join(CONFIG.outputDir, 'bugs-raw.json'), 'utf-8'));
  return rawData.bugs;
}

/**
 * 清理和整理 bug report
 * 提取关键信息：问题描述、解决方案、相关代码
 */
function cleanBugReport(bug) {
  const body = bug.body || '';

  // 提取错误信息（通常在代码块中）
  const errorMatch = body.match(/```[\s\S]*?error[\s\S]*?```/i);
  const errorMessage = errorMatch ? errorMatch[0].substring(0, 200) : '';

  // 提取版本信息
  const versionMatch = body.match(/version[:\s]+([0-9.]+)/i);
  const version = versionMatch ? versionMatch[1] : 'unknown';

  // 提取环境信息
  const platformMatch = body.match(/(?:os|platform|system)[:\s]+(windows|mac|linux|unix)/i);
  const platform = platformMatch ? platformMatch[1] : 'unknown';

  return {
    id: bug.id,
    number: bug.number,
    title: bug.title,
    description: cleanDescription(body),
    error_message: errorMessage,
    version: version,
    platform: platform,
    state: bug.state,
    created_at: bug.created_at,
    updated_at: bug.updated_at,
    closed_at: bug.closed_at,
    labels: bug.labels.map(l => l.name),
    comments_count: bug.comments,
    url: bug.html_url,
    author: bug.user?.login || 'unknown',
    // 标记是否有解决方案（评论 > 0 通常意味着有讨论）
    has_solution: bug.comments > 0,
  };
}

/**
 * 清理描述文本
 * 去除无关内容，保留核心问题
 */
function cleanDescription(body) {
  // 移除引用
  let cleaned = body.replace(/^>.*$/gm, '');

  // 移除过多的空白行
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

  // 限制长度
  if (cleaned.length > 2000) {
    cleaned = cleaned.substring(0, 2000) + '...';
  }

  return cleaned.trim();
}

/**
 * 处理 bug reports（逐个清理并保存）
 */
async function processBugs(rawBugs) {
  console.log('🧹 清理和整理 bug reports...\n');

  initDataFile('bugs-cleaned.json');
  initDataFile('bugs-en.json');

  let cleanedCount = 0;

  for (let i = 0; i < rawBugs.length; i++) {
    const rawBug = rawBugs[i];
    const cleaned = cleanBugReport(rawBug);

    // 保存清理后的数据
    appendBugToFile('bugs-cleaned.json', cleaned);
    appendBugToFile('bugs-en.json', cleaned);
    cleanedCount++;

    if (cleanedCount % 10 === 0 || i === rawBugs.length - 1) {
      console.log(`✓ 清理进度: ${i + 1}/${rawBugs.length} | 已保存: ${cleanedCount} 💾`);
    }
  }

  finalizeDataFile('bugs-en.json');

  console.log(`\n✅ 清理完成！处理 ${cleanedCount} 个 bug reports\n`);

  const cleanedData = JSON.parse(fs.readFileSync(path.join(CONFIG.outputDir, 'bugs-en.json'), 'utf-8'));
  return cleanedData.bugs;
}

/**
 * 翻译到中文
 */
async function translateToCN(text) {
  if (!text || text.trim() === '') return '';

  const deepLKey = process.env.DEEPL_API_KEY;
  const openAIKey = process.env.OPENAI_API_KEY;

  let method = CONFIG.translateMethod;
  if (method === 'auto') {
    if (deepLKey) method = 'deepl';
    else if (openAIKey) method = 'openai';
    else return null;
  }

  try {
    if (method === 'deepl') {
      return await translateWithDeepL(text, deepLKey);
    } else {
      return await translateWithOpenAI(text, openAIKey);
    }
  } catch (error) {
    console.error(`  ❌ 翻译失败: ${error.message}`);
    return null;
  }
}

async function translateWithDeepL(text, apiKey) {
  const response = await fetch('https://api-free.deepl.com/v2/translate', {
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
          content: 'Translate technical bug reports from English to Chinese. Keep technical terms intact.',
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
 * 翻译 bug reports（逐个翻译并保存）
 */
async function translateBugs(bugs) {
  console.log('🌐 翻译 bug reports 到中文...\n');

  initDataFile('bugs-zh-cn.json');

  const total = bugs.length;
  let successCount = 0;

  for (let i = 0; i < total; i++) {
    const bug = bugs[i];
    console.log(`[${i + 1}/${total}] ${bug.title.substring(0, 40)}...`);

    const translatedBug = {
      ...bug,
      translations: {
        zhCN: {
          title: await translateToCN(bug.title),
          description: await translateToCN(bug.description),
          error_message: await translateToCN(bug.error_message),
        },
      },
    };

    appendBugToFile('bugs-zh-cn.json', translatedBug);
    successCount++;

    console.log(`  ✅ 已保存 💾\n`);

    if (successCount % 5 === 0) {
      console.log(`  📊 进度: ${successCount}/${total}\n`);
    }

    if (CONFIG.delayBetweenIssues > 0) {
      await new Promise(resolve => setTimeout(resolve, CONFIG.delayBetweenIssues));
    }
  }

  finalizeDataFile('bugs-zh-cn.json');

  console.log(`\n✅ 翻译完成！处理 ${successCount} 个 bug reports\n`);

  const translatedData = JSON.parse(fs.readFileSync(path.join(CONFIG.outputDir, 'bugs-zh-cn.json'), 'utf-8'));
  return translatedData.bugs;
}

/**
 * 生成可搜索的 Markdown 文档
 */
function generateSearchableDocs(bugs) {
  console.log('📝 生成可搜索的文档...\n');

  // 生成英文版
  let enMarkdown = `# OpenClaw Bug Reports

> 已解决的 Bug 问题库
> 总数: ${bugs.length} 个

---

`;

  bugs.forEach((bug, index) => {
    enMarkdown += `## ${index + 1}. ${bug.title}\n\n`;
    enMarkdown += `**Bug ID**: #${bug.number}  \n`;
    enMarkdown += `**状态**: ${bug.state}  \n`;
    enMarkdown += `**影响版本**: ${bug.version}  \n`;
    enMarkdown += `**平台**: ${bug.platform}  \n`;
    enMarkdown += `**讨论**: [GitHub Issue](${bug.url})  \n`;
    enMarkdown += `**标签**: ${bug.labels.join(', ')}  \n\n`;

    if (bug.error_message) {
      enMarkdown += `### 错误信息\n\n\`\`\`\n${bug.error_message}\n\`\`\`\n\n`;
    }

    enMarkdown += `### 问题描述\n\n${bug.description}\n\n`;

    if (bug.has_solution) {
      enMarkdown += `### 解决方案\n\n`;
      enMarkdown += `> 查看 [GitHub 讨论](${bug.url}) 获取完整解决方案\n\n`;
    }

    enMarkdown += `---\n\n`;
  });

  const enFile = path.join(CONFIG.outputDir, 'BUGS.md');
  fs.writeFileSync(enFile, enMarkdown, 'utf-8');
  console.log(`✓ 英文文档: ${enFile}`);

  // 生成中文版
  let zhMarkdown = `# OpenClaw Bug 问题库

> 已解决的 Bug 问题库
> 总数: ${bugs.length} 个

---

`;

  bugs.forEach((bug, index) => {
    const title = bug.translations?.zhCN?.title || bug.title;
    const description = bug.translations?.zhCN?.description || bug.description;

    zhMarkdown += `## ${index + 1}. ${title}\n\n`;
    zhMarkdown += `**Bug ID**: #${bug.number}  \n`;
    zhMarkdown += `**状态**: ${bug.state}  \n`;
    zhMarkdown += `**影响版本**: ${bug.version}  \n`;
    zhMarkdown += `**平台**: ${bug.platform}  \n`;
    zhMarkdown += `**讨论**: [GitHub Issue](${bug.url})  \n`;
    zhMarkdown += `**标签**: ${bug.labels.join(', ')}  \n\n`;

    if (bug.error_message) {
      zhMarkdown += `### 错误信息\n\n\`\`\`\n${bug.error_message}\n\`\`\`\n\n`;
    }

    zhMarkdown += `### 问题描述\n\n${description}\n\n`;

    if (bug.has_solution) {
      zhMarkdown += `### 解决方案\n\n`;
      zhMarkdown += `> 查看 [GitHub 讨论](${bug.url}) 获取完整解决方案\n\n`;
    }

    zhMarkdown += `---\n\n`;
  });

  const zhFile = path.join(CONFIG.outputDir, 'BUGS-zh-cn.md');
  fs.writeFileSync(zhFile, zhMarkdown, 'utf-8');
  console.log(`✓ 中文文档: ${zhFile}\n`);
}

/**
 * 主函数
 */
async function main() {
  console.log('🐛 OpenClaw Bug Reports 收集工具\n');
  console.log('='.repeat(60));

  try {
    // 1. 获取已解决的 bug reports
    const rawBugs = await fetchBugs();

    if (rawBugs.length === 0) {
      console.log('⚠️  没有找到任何已解决的 bug reports');
      return;
    }

    // 2. 清理和整理
    const cleanedBugs = await processBugs(rawBugs);

    // 3. 翻译
    let translatedBugs = cleanedBugs;
    if (CONFIG.enableTranslation) {
      translatedBugs = await translateBugs(cleanedBugs);
    }

    // 4. 生成可搜索文档
    generateSearchableDocs(translatedBugs);

    // 5. 清理临时文件
    const tempFiles = ['bugs-raw.json', 'bugs-cleaned.json'];
    tempFiles.forEach(file => {
      const filePath = path.join(CONFIG.outputDir, file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
    console.log('✓ 已清理临时文件\n');

    console.log('='.repeat(60));
    console.log('✅ 全部完成!\n');
    console.log('📂 数据保存在:', CONFIG.outputDir);
    console.log('   - bugs-en.json       (英文数据)');
    console.log('   - bugs-zh-cn.json    (中文数据)');
    console.log('   - BUGS.md           (英文文档)');
    console.log('   - BUGS-zh-cn.md     (中文文档)\n');
    console.log('💡 下一步:');
    console.log('   1. 将 Markdown 文件添加到网站');
    console.log('   2. 运行 npm run build 生成搜索索引');
    console.log('   3. 用户可以直接搜索问题，无需去 GitHub\n');

  } catch (error) {
    console.error('\n❌ 发生错误:', error);
    process.exit(1);
  }
}

main();
