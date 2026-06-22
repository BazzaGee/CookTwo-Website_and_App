import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || 'http://localhost:4321',
  adapter: node({
    mode: 'standalone'
  }),
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false
    })
  ],
  vite: {
    ssr: {
      noExternal: ['@supabase/supabase-js']
    }
  }
});
