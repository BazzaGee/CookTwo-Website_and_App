import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const seoMode = z.enum(['keyword', 'intent', 'hybrid']);

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('CookTwo'),
    ogImage: z.string().optional(),
    tags: z.array(z.string()).default([]),
    pillar: z.string().optional(),
    seoMode: seoMode.default('hybrid'),
    targetKeyword: z.string().optional(),
    intentSummary: z.string().optional(),
    persona: z.string().optional(),
    draft: z.boolean().default(false)
  })
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('CookTwo'),
    ogImage: z.string().optional(),
    tags: z.array(z.string()).default([]),
    pillar: z.string().optional(),
    seoMode: seoMode.default('hybrid'),
    targetKeyword: z.string().optional(),
    intentSummary: z.string().optional(),
    persona: z.string().optional(),
    draft: z.boolean().default(false)
  })
});

const diets = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/diets' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('CookTwo Research'),
    ogImage: z.string().optional(),
    dietKey: z.string(),
    evidenceGrade: z.enum(['A', 'B', 'B-C', 'C', 'C-D', 'D']),
    category: z.string(),
    restrictiveness: z.number().min(1).max(5).optional(),
    macroSplit: z.object({ carb: z.number(), protein: z.number(), fat: z.number() }).optional(),
    isTimingPattern: z.boolean().default(false),
    bestFor: z.string().optional(),
    hardestPart: z.string().optional(),
    medicalCaution: z.string().optional(),
    medical: z.boolean().default(false),
    readingTime: z.string().optional(),
    targetKeyword: z.string(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false)
  })
});

export const collections = { blog, pages, diets };
