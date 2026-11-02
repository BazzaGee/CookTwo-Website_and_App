import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import rehypeImageOptimizer from './src/rehype-image-optimizer.js';

const today = new Date().toISOString().split('T')[0];

export default defineConfig({
  site: 'https://cooktwo.com',
  integrations: [
    mdx({
      rehypePlugins: [[rehypeImageOptimizer, { publicDir: './public' }]]
    }),
    sitemap({
      filter: (page) => !page.includes('/quiz') && !page.includes('/video/') && !page.includes('/admin/'),
      serialize(item) {
        item.lastmod = today;
        item.changefreq = 'weekly';
        if (item.url === 'https://cooktwo.com/') item.priority = 1.0;
        else if (/\/diets\/?$/.test(item.url)) item.priority = 0.9;
        else item.priority = 0.8;
        return item;
      }
    })
  ],
  output: 'static'
});
