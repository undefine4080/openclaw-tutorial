#!/usr/bin/env node

/**
 * 翻译已存在的 Bug 报告数据
 *
 * 功能：
 * 1. 读取 data/bug-reports/bugs-en.json
 * 2. 翻译 title 和 description 到中文
 * 3. 生成 data/bug-reports/bugs-zh-cn.json
 *
 * 使用方法：
 * export DEEPL_API_KEY=xxx  (推荐)
 * 或
 * export OPENAI_API_KEY=xxx
 *
 * npm run translate-bugs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', 'data', 'bug-reports');
const INPUT_FILE = path.join(DATA_DIR, 'bugs-en.json');
const OUTPUT_FILE = path.join(DATA_DIR, 'bugs-zh-cn.json');

/**
 * 翻译文本到中文
 */
async function translateText(text, apiKey, method = 'deepl') {
  if (!text || text.trim() === '') return '';

  try {
    if (method === 'deepl') {
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
    } else {
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
  } catch (error) {
    console.error(`  ❌ 翻译失败: ${error.message}`);
    return null;
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('🌐 开始翻译 Bug 报告数据...\n');

  // 检查 API Key
  const deepLKey = process.env.DEEPL_API_KEY;
  const openAIKey = process.env.OPENAI_API_KEY;

  if (!deepLKey && !openAIKey) {
    console.error('❌ 错误：未设置翻译 API Key');
    console.error('请设置 DEEPL_API_KEY 或 OPENAI_API_KEY 环境变量');
    console.error('\n示例：');
    console.error('export DEEPL_API_KEY=your_key_here');
    console.error('npm run translate-bugs');
    process.exit(1);
  }

  const translateMethod = deepLKey ? 'deepl' : 'openai';
  const apiKey = deepLKey || openAIKey;

  console.log(`使用翻译方式: ${translateMethod.toUpperCase()}`);

  // 读取英文数据
  if (!fs.existsSync(INPUT_FILE)) {
    console.error(`❌ 错误：找不到输入文件 ${INPUT_FILE}`);
    console.error('请先运行 npm run collect-bugs 收集数据');
    process.exit(1);
  }

  console.log(`\n📂 读取文件: ${INPUT_FILE}`);
  const enData = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf-8'));
  const bugs = enData.bugs;

  console.log(`✓ 找到 ${bugs.length} 个 bug 报告\n`);

  // 初始化输出文件
  const outputData = {
    meta: {
      ...enData.meta,
      started_at: new Date().toISOString(),
      last_updated: new Date().toISOString(),
      translation_method: translateMethod,
    },
    bugs: [],
  };

  // 翻译每个 bug
  let successCount = 0;
  let skipCount = 0;

  for (let i = 0; i < bugs.length; i++) {
    const bug = bugs[i];
    const progress = `[${i + 1}/${bugs.length}]`;

    console.log(`${progress} ${bug.title.substring(0, 50)}...`);

    // 翻译标题
    const translatedTitle = await translateText(bug.title, apiKey, translateMethod);
    if (!translatedTitle) {
      console.log(`  ⏭️  跳过（标题翻译失败）\n`);
      skipCount++;
      continue;
    }

    // 翻译描述（只翻译前 1000 字符以节省 API 额度）
    const shortDesc = bug.description.substring(0, 1000);
    const translatedDesc = await translateText(shortDesc, apiKey, translateMethod);

    if (!translatedDesc) {
      console.log(`  ⏭️  跳过（描述翻译失败）\n`);
      skipCount++;
      continue;
    }

    // 保存翻译后的 bug
    const translatedBug = {
      ...bug,
      translations: {
        zhCN: {
          title: translatedTitle,
          description: translatedDesc,
          error_message: bug.error_message ? await translateText(bug.error_message.substring(0, 500), apiKey, translateMethod) : '',
        },
      },
    };

    outputData.bugs.push(translatedBug);
    successCount++;

    console.log(`  ✅ 标题: ${translatedTitle.substring(0, 40)}...`);
    console.log(`  💾 已保存\n`);

    // 每 5 个保存一次进度
    if (successCount % 5 === 0) {
      outputData.meta.last_updated = new Date().toISOString();
      outputData.meta.total_count = successCount;
      fs.writeFileSync(OUTPUT_FILE, JSON.stringify(outputData, null, 2), 'utf-8');
      console.log(`📊 进度: ${successCount}/${bugs.length} | 已保存中间文件\n`);
    }

    // 避免请求过快
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // 完成保存
  outputData.meta.completed_at = new Date().toISOString();
  outputData.meta.total_count = successCount;
  outputData.meta.status = 'completed';
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(outputData, null, 2), 'utf-8');

  console.log('\n' + '='.repeat(60));
  console.log(`✅ 翻译完成！`);
  console.log(`\n📊 统计信息:`);
  console.log(`   总数: ${bugs.length}`);
  console.log(`   翻译成功: ${successCount}`);
  console.log(`   跳过: ${skipCount}`);
  console.log(`\n📂 输出文件: ${OUTPUT_FILE}`);
  console.log('\n💡 下一步：');
  console.log('   1. 复制数据到 public 目录：');
  console.log('      cp -r data/bug-reports/* public/data/bug-reports/');
  console.log('   2. 启动开发服务器：');
  console.log('      npm run dev');
  console.log('   3. 访问 Bug 问题库：');
  console.log('      http://localhost:4321/bugs');
  console.log('='.repeat(60) + '\n');
}

main().catch(error => {
  console.error('❌ 错误:', error);
  process.exit(1);
});
