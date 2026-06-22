# Astro Build Notes — Couples Food System

## Setup and Configuration Reference

---

## Prerequisites

- Node.js 18+ installed
- Astro CLI available globally (via /Astro-Build)
- Formspree account configured (barrydgrottis@gmail.com)

---

## Project Initialization

```bash
# Using Astro-Build (Stitch template)
# Place Stitch-generated template in:
# 06-astro-build/stitch-template/
```

---

## Required Packages

```json
{
  "dependencies": {
    "@astrojs/mdx": "^2.0.0",
    "@astrojs/sitemap": "^3.0.0",
    "@astrojs/tailwind": "^5.0.0",
    "astro": "^4.0.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0"
  }
}
```

---

## astro.config.mjs

```javascript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://couples-food-system.com',
  integrations: [
    tailwind(),
    sitemap(),
    mdx()
  ],
  output: 'static'
});
```

---

## tailwind.config.mjs

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#FAF6EE',
          dark: '#F5F0E6'
        },
        sage: {
          DEFAULT: '#7A9E7E',
          dark: '#5A7E5E',
          light: '#9ABE9E'
        },
        terracotta: {
          DEFAULT: '#E8A87C',
          dark: '#C88A5C',
          light: '#F8C89C'
        },
        text: {
          primary: '#2C3E2D',
          secondary: '#6B7B6C'
        },
        border: '#E5E1DA',
        error: '#E07A5F',
        success: '#7A9E7E'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif']
      }
    }
  },
  plugins: []
};
```

---

## Formspree Integration

### Waitlist Form

```html
<form action="https://formspree.io/f/barrydgrottis@gmail.com" method="POST">
  <input type="email" name="email" required placeholder="Your email address">
  <input type="email" name="partner_email" placeholder="Partner's email (optional)">
  <select name="primary_goal" required>
    <option value="" disabled selected>What is your shared primary goal?</option>
    <option value="Stop arguing about dinner">Stop arguing about "what's for dinner"</option>
    <option value="Different portion/diet goals">Eat the same meals but with different portion goals</option>
    <option value="Reduce food waste">Reduce food waste and save money</option>
  </select>
  <button type="submit">Join Free Beta Waitlist</button>
</form>
```

### Contact Form

```html
<form action="https://formspree.io/f/barrydgrottis@gmail.com" method="POST">
  <input type="text" name="name" required placeholder="Your name">
  <input type="email" name="email" required placeholder="Your email">
  <textarea name="message" required placeholder="Your message"></textarea>
  <button type="submit">Send Message</button>
</form>
```

---

## Reference HTML Template

The existing HTML template is located at:
```
../google ai studio template/html
```

This contains a complete single-page implementation with:
- All sections and copy
- Formspree integration
- Brand colors via Tailwind CDN
- Lucide icons
- Mobile navigation
- SPA-style routing (replace with Astro routes)

Use this as the **design and content reference** when building Astro components.

---

## Stitch Template Location

The Stitch-generated Astro template should be placed in:
```
./stitch-template/
```

This will be the starting point for the Astro build.

---

## Key Reminders

1. **No named competitors** on the compare page
2. **"Couples Food System"** is the product name (no "Cupla")
3. **Beta is completely free** — all messaging reflects this
4. **Waitlist capture** is the primary conversion goal
5. **Formspree** sends to barrydgrottis@gmail.com
6. **Mobile-first** design approach
7. **"We" language** throughout, never "you"
