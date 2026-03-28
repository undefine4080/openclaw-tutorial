#!/usr/bin/env node

/**
 * 生成优化的 Issues 搜索索引
 *
 * 功能：
 * 1. 读取 data/issues/issues.json
 * 2. 生成轻量级搜索索引（只包含必要的搜索字段）
 * 3. 生成 public/data/issues/issues-search-index.json
 *
 * 优势：
 * - 减小文件大小
 * - 提升前端搜索性能
 * - 支持快速关键词匹配
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', 'data', 'issues');
const PUBLIC_DIR = path.join(__dirname, '..', 'public', 'data', 'issues');

const INPUT_FILE = path.join(DATA_DIR, 'issues.json');
const OUTPUT_FILE = path.join(PUBLIC_DIR, 'issues-search-index.json');

/**
 * 提取搜索关键词
 */
function extractSearchTerms(title, shortDesc, labels) {
  const terms = new Set();

  // 提取标题中的关键词
  if (title && typeof title === 'string') {
    const titleWords = title.toLowerCase()
      .replace(/[^\w\s\u4e00-\u9fa5]/g, ' ')  // 保留中文字符
      .split(/\s+/)
      .filter(word => word.length > 2);

    titleWords.forEach(word => terms.add(word));
  }

  // 提取描述中的关键词
  if (shortDesc && typeof shortDesc === 'string') {
    const descWords = shortDesc.toLowerCase()
      .replace(/[^\w\s\u4e00-\u9fa5]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3);

    descWords.slice(0, 15).forEach(word => terms.add(word));  // 最多取 15 个
  }

  // 添加标签
  if (labels && Array.isArray(labels)) {
    labels.forEach(label => {
      if (label && typeof label === 'string') {
        terms.add(label.toLowerCase());
      }
    });
  }

  return Array.from(terms);
}

/**
 * 主函数
 */
async function main() {
  console.log('🔍 生成 Issues 搜索索引...\n');

  // 创建输出目录
  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }

  // 读取简化后的数据
  if (!fs.existsSync(INPUT_FILE)) {
    console.error(`❌ 错误：找不到输入文件 ${INPUT_FILE}`);
    console.error('请先运行 npm run collect-issues 收集数据');
    process.exit(1);
  }

  console.log(`📂 读取文件: ${INPUT_FILE}`);
  const data = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf-8'));
  const issues = data.issues;

  console.log(`✓ 找到 ${issues.length} 个 issues\n`);

  // 生成搜索索引
  const searchIndex = {
    meta: {
      ...data.meta,
      generated_at: new Date().toISOString(),
      total_count: issues.length,
      index_type: 'search-optimized',
    },
    index: [],
  };

  console.log('🔄 生成搜索索引...\n');

  issues.forEach((issue, index) => {
    const searchItem = {
      number: issue.number,
      title: issue.title,
      short_desc: issue.short_desc,
      labels: issue.labels,
      url: issue.url,
      closed_at: issue.closed_at,
      search_terms: extractSearchTerms(issue.title, issue.short_desc, issue.labels),
    };

    searchIndex.index.push(searchItem);

    if ((index + 1) % 500 === 0) {
      console.log(`  进度: ${index + 1}/${issues.length}`);
    }
  });

  // 保存索引文件
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(searchIndex, null, 2), 'utf-8');

  const inputSize = (fs.statSync(INPUT_FILE).size / 1024 / 1024).toFixed(2);
  const outputSize = (fs.statSync(OUTPUT_FILE).size / 1024 / 1024).toFixed(2);
  const compression = inputSize > 0
    ? ((1 - parseFloat(outputSize) / parseFloat(inputSize)) * 100).toFixed(1)
    : 0;

  console.log('\n' + '='.repeat(60));
  console.log('✅ 搜索索引生成完成！');
  console.log(`\n📊 文件大小对比:`);
  console.log(`   原始文件: ${inputSize} MB`);
  console.log(`   搜索索引: ${outputSize} MB`);
  console.log(`   压缩率: ${compression}%`);
  console.log(`\n📂 输出文件: ${OUTPUT_FILE}`);
  console.log('\n💡 使用方式：');
  console.log('   在前端加载搜索索引：');
  console.log('   fetch("/data/issues/issues-search-index.json")');
  console.log('='.repeat(60) + '\n');
}

main().catch(error => {
  console.error('❌ 错误:', error);
  process.exit(1);
});
