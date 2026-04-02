import { defineCollection, z } from 'astro:content';

const post = defineCollection({
  schema: z.object({
    // === 基础元数据 ===
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    lastUpdated: z.coerce.date().optional(),

    // === 学习辅助信息 ===
    tags: z.array(z.string()).default([]),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
    estimatedTime: z.string().default('5 minutes'),
    prerequisites: z.array(z.string()).default([]),

    // === 多语言支持 ===
    alternates: z.object({
      zhCN: z.string().optional(),
    }).optional(),

    // === 分类和组织 ===

    // 教程分类（用于组织文章到不同的主题分类）
    category: z.enum([
      'getting-started',      // 新手上路
      'initialization',       // 初始化小龙虾
      'claw-eyes',           // 小龙虾的眼睛
      'claw-hands',          // 小龙虾的手脚
      'claw-brain',          // 小龙虾的大脑
      'multi-agents',        // 多 Agents 能力
      'installation',        // 安装部署
      'troubleshooting',     // 疑难解答
    ]).optional(),

    // 子分类（用于进一步细分某些分类）
    subcategory: z.enum([
      'basic',       // 基础入门（06-multi-agents）
      'advanced',    // 进阶技巧（06-multi-agents）
    ]).optional(),

    // 排序权重（同一分类内的显示顺序，数字越小越靠前）
    order: z.number().default(0),

    // === 导航和推荐 ===

    // 相关文章 slug 数组（用于推荐阅读）
    relatedPosts: z.array(z.string()).default([]),

    // 上一篇文章 slug（用于导航）
    prevPost: z.string().optional(),

    // 下一篇文章 slug（用于导航）
    nextPost: z.string().optional(),

    // === 内容管理 ===

    // 是否为精选文章（用于首页推荐）
    featured: z.boolean().default(false),

    // 文章状态（草稿/已发布/已归档）
    status: z.enum(['draft', 'published', 'archived']).default('published'),
  }),
});

export const collections = {
  posts: post,
  'posts-zh-cn': post,
};