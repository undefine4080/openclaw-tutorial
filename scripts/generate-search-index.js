#!/usr/bin/env node

/**
 * 生成优化的 Bug 搜索索引
 *
 * 功能：
 * 1. 读取 data/bug-reports/bugs-zh-cn.json
 * 2. 生成轻量级搜索索引（只包含必要的搜索字段）
 * 3. 生成 public/data/bug-reports/bugs-search-index.json
 *
 * 优势：
 * - 减小文件大小（从 12MB 到约 2MB）
 * - 提升前端搜索性能
 * - 支持快速关键词匹配
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', 'data', 'bug-reports');
const PUBLIC_DIR = path.join(__dirname, '..', 'public', 'data', 'bug-reports');

const INPUT_FILE = path.join(DATA_DIR, 'bugs-zh-cn.json');
const OUTPUT_FILE = path.join(PUBLIC_DIR, 'bugs-search-index.json');

/**
 * 生成搜索词（从标题和描述中提取关键词）
 */
function extractSearchTerms(title, description) {
  const terms = [];

  // 提取标题中的关键词
  const titleWords = title.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2);

  terms.push(...titleWords);

  // 提取描述中的关键词（只取前 500 字符）
  const shortDesc = description.substring(0, 500);
  const descWords = shortDesc.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3);

  terms.push(...descWords.slice(0, 10)); // 最多取 10 个描述关键词

  return [...new Set(terms)]; // 去重
}

/**
 * 主函数
 */
async function main() {
  console.log('🔍 生成 Bug 搜索索引...\n');

  // 创建输出目录
  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }

  // 读取中文数据
  if (!fs.existsSync(INPUT_FILE)) {
    console.error(`❌ 错误：找不到输入文件 ${INPUT_FILE}`);
    console.error('请先运行 npm run translate-bugs 翻译数据');
    process.exit(1);
  }

  console.log(`📂 读取文件: ${INPUT_FILE}`);
  const data = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf-8'));
  const bugs = data.bugs;

  console.log(`✓ 找到 ${bugs.length} 个 bug 报告\n`);

  // 生成搜索索引
  const searchIndex = {
    meta: {
      ...data.meta,
      generated_at: new Date().toISOString(),
      total_count: bugs.length,
      index_type: 'search-optimized',
    },
    index: [],
  };

  console.log('🔄 生成搜索索引...\n');

  bugs.forEach((bug, index) => {
    const title = bug.translations?.zhCN?.title || bug.title;
    const description = bug.translations?.zhCN?.description || bug.description;

    const searchItem = {
      id: bug.id,
      number: bug.number,
      title: title,
      short_desc: description.substring(0, 200),
      search_terms: extractSearchTerms(title, description),
      labels: bug.labels,
      url: bug.url,
      closed_at: bug.closed_at,
    };

    searchIndex.index.push(searchItem);

    if ((index + 1) % 500 === 0) {
      console.log(`  进度: ${index + 1}/${bugs.length}`);
    }
  });

  // 保存索引文件
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(searchIndex, null, 2), 'utf-8');

  const inputSize = (fs.statSync(INPUT_FILE).size / 1024 / 1024).toFixed(2);
  const outputSize = (fs.statSync(OUTPUT_FILE).size / 1024 / 1024).toFixed(2);
  const compression = ((1 - parseFloat(outputSize) / parseFloat(inputSize)) * 100).toFixed(1);

  console.log('\n' + '='.repeat(60));
  console.log('✅ 搜索索引生成完成！');
  console.log(`\n📊 文件大小对比:`);
  console.log(`   原始文件: ${inputSize} MB`);
  console.log(`   搜索索引: ${outputSize} MB`);
  console.log(`   压缩率: ${compression}%`);
  console.log(`\n📂 输出文件: ${OUTPUT_FILE}`);
  console.log('\n💡 使用方式：');
  console.log('   在前端加载搜索索引而不是完整数据：');
  console.log('   fetch("/data/bug-reports/bugs-search-index.json")');
  console.log('='.repeat(60) + '\n');
}

main().catch(error => {
  console.error('❌ 错误:', error);
  process.exit(1);
});
