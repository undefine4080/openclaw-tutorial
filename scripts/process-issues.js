#!/usr/bin/env node
/**
 * 处理 raw 数据：去重 + 移除 PR + 简化数据结构
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', 'data', 'issues');
const RAW_FILE = path.join(DATA_DIR, 'issues-raw.json');
const OUTPUT_FILE = path.join(DATA_DIR, 'issues.json');

/**
 * 简化 issue 数据结构
 * 只保留：id, number, title, url, 简短描述, labels, closed_at
 */
function simplifyIssue(issue) {
  const body = issue.body || '';

  let shortDesc = body
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]+`/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[#*_~>`-]/g, '')
    .replace(/\s+/g, ' ')
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

async function main() {
  console.log('🔄 处理 raw 数据：去重 + 移除 PR\n');

  if (!fs.existsSync(RAW_FILE)) {
    console.error('❌ 未找到 raw 数据文件:', RAW_FILE);
    process.exit(1);
  }

  const rawData = JSON.parse(fs.readFileSync(RAW_FILE, 'utf-8'));
  console.log(`📊 原始数据: ${rawData.issues.length} 条\n`);

  const seenIds = new Set();
  const processedIssues = [];
  let duplicateCount = 0;
  let prCount = 0;

  for (const issue of rawData.issues) {
    if (seenIds.has(issue.id)) {
      duplicateCount++;
      continue;
    }
    seenIds.add(issue.id);

    // **关键**：跳过 Pull Requests
    if (issue.pull_request) {
      prCount++;
      continue;
    }

    processedIssues.push(simplifyIssue(issue));
  }

  console.log(`✓ 处理完成:`);
  console.log(`  - 保留: ${processedIssues.length} 个 issues`);
  console.log(`  - 移除: ${duplicateCount} 个重复`);
  console.log(`  - 移除: ${prCount} 个 Pull Requests\n`);

  const outputData = {
    meta: {
      ...rawData.meta,
      processed_at: new Date().toISOString(),
      total_count: processedIssues.length,
      notes: {
        original_count: rawData.issues.length,
        removed_duplicates: duplicateCount,
        removed_prs: prCount,
        final_count: processedIssues.length
      }
    },
    issues: processedIssues
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(outputData, null, 2), 'utf-8');
  console.log('✅ 已保存:', OUTPUT_FILE, '\n');

  // 统计
  const labelCounts = {};
  processedIssues.forEach(issue => {
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

  fs.writeFileSync(
    path.join(DATA_DIR, 'stats.json'),
    JSON.stringify({
      total: processedIssues.length,
      top_labels: topLabels,
      generated_at: new Date().toISOString(),
    }, null, 2)
  );
  console.log('\n✓ 统计信息已保存\n');
}

main();
