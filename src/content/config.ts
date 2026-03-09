import { defineCollection, z } from 'astro:content';

const post = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    lastUpdated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
    estimatedTime: z.string().default('5 minutes'),
    prerequisites: z.array(z.string()).default([]),
    alternates: z.object({
      zhCN: z.string().optional(),
    }).optional(),
  }),
});

export const collections = {
  posts: post,
  'posts-zh-cn': post,
};