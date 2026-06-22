# Design System — Couples Food System

## Full Reference for Astro Build

---

## Color Palette

### Primary Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Cream | `#FAF6EE` | 250, 246, 238 | Page backgrounds, card backgrounds |
| Cream Dark | `#F5F0E6` | 245, 240, 230 | Alternate section backgrounds |
| Sage | `#7A9E7E` | 122, 158, 126 | Primary buttons, links, active states |
| Sage Dark | `#5A7E5E` | 90, 126, 94 | Button hover, active states |
| Sage Light | `#9ABE9E` | 154, 190, 158 | Subtle accents, light backgrounds |
| Terracotta | `#E8A87C` | 232, 168, 124 | Highlights, notifications, badges |
| Terracotta Dark | `#C88A5C` | 200, 138, 92 | Terracotta hover states |
| Terracotta Light | `#F8C89C` | 248, 200, 156 | Light terracotta backgrounds |

### Text Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Text Primary | `#2C3E2D` | 44, 62, 45 | Headlines, important text |
| Text Secondary | `#6B7B6C` | 107, 123, 108 | Body text, descriptions, labels |

### UI Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Border | `#E5E1DA` | 229, 225, 218 | Card borders, dividers |
| Error | `#E07A5F` | 224, 122, 95 | Error states, form validation |
| Success | `#7A9E7E` | 122, 158, 126 | Success states (same as Sage) |
| White | `#FFFFFF` | 255, 255, 255 | Card backgrounds, form inputs |

### Gradients

```css
/* Hero background gradient */
background: linear-gradient(180deg, #FAF6EE 0%, #F5F0E6 100%);

/* Sage subtle gradient */
background: linear-gradient(135deg, #7A9E7E 0%, #5A7E5E 100%);

/* Warm accent gradient */
background: linear-gradient(135deg, #E8A87C 0%, #C88A5C 100%);
```

---

## Tailwind Configuration

```javascript
// tailwind.config.mjs
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
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      }
    }
  },
  plugins: []
};
```

---

## Typography

### Font Family

```css
font-family: 'Inter', system-ui, -apple-system, sans-serif;
```

### Font Loading (HTML)

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### Type Scale

| Element | Mobile | Desktop | Weight | Tracking |
|---------|--------|---------|--------|----------|
| Hero H1 | 48px (3rem) | 72px (4.5rem) | 600 | -0.02em |
| H1 | 36px (2.25rem) | 48px (3rem) | 600 | -0.02em |
| H2 | 28px (1.75rem) | 36px (2.25rem) | 600 | -0.01em |
| H3 | 24px (1.5rem) | 28px (1.75rem) | 600 | -0.01em |
| Body Large | 18px (1.125rem) | 20px (1.25rem) | 400 | normal |
| Body | 16px (1rem) | 16px (1rem) | 400 | normal |
| Small | 14px (0.875rem) | 14px (0.875rem) | 400 | normal |
| Caption | 12px (0.75rem) | 12px (0.75rem) | 500 | 0.02em |

### Line Heights

- Headlines: 1.1–1.2
- Body: 1.5 (relaxed)
- Tight text: 1.25

---

## Spacing

| Use | Value |
|-----|-------|
| Section vertical padding (mobile) | 80px (5rem) |
| Section vertical padding (desktop) | 120px (7.5rem) |
| Container max width | 1152px (max-w-6xl) |
| Container padding (mobile) | 24px (1.5rem) |
| Container padding (desktop) | 32px (2rem) |
| Card padding | 32px (2rem) |
| Card gap | 24px (1.5rem) |
| Element gap (stacked) | 16px (1rem) |
| Section gap | 32px (2rem) |

---

## Border Radius

| Element | Value |
|---------|-------|
| Buttons | 12px (rounded-xl) |
| Cards | 16px (rounded-2xl) |
| Inputs | 12px (rounded-xl) |
| Badges | 9999px (rounded-full) |
| Images | 16px (rounded-2xl) |
| Avatars | 9999px (rounded-full) |

---

## Shadows

```css
/* Card shadow */
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

/* Card hover shadow */
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

/* Button shadow */
box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
```

---

## UI Component Specs

### Button — Primary

```
Background: #7A9E7E (sage)
Text: #FFFFFF (white)
Padding: 12px 32px (py-3 px-8)
Border Radius: 12px (rounded-xl)
Font: Inter, 16px, medium (500)
Hover: background #5A7E5E (sage-dark)
Active: scale(0.98)
Transition: 200ms ease
```

### Button — Secondary

```
Background: transparent
Border: 2px solid #7A9E7E (sage)
Text: #7A9E7E (sage)
Padding: 12px 32px (py-3 px-8)
Border Radius: 12px (rounded-xl)
Font: Inter, 16px, medium (500)
Hover: background rgba(122, 158, 126, 0.05)
```

### Card — Feature

```
Background: #FFFFFF (white)
Border: 1px solid #E5E1DA (border)
Padding: 32px (p-8)
Border Radius: 16px (rounded-2xl)
Hover Border: #7A9E7E (sage)
Hover Shadow: 0 4px 12px rgba(0,0,0,0.08)
Icon Container: 56px x 56px, bg-cream-dark, rounded-xl
```

### Input — Text/Email

```
Background: #FFFFFF (white)
Border: 1px solid #E5E1DA (border)
Padding: 16px (p-4)
Border Radius: 12px (rounded-xl)
Font: Inter, 16px, regular
Focus Border: #7A9E7E (sage)
Focus Ring: 2px, rgba(122,158,126,0.3)
```

### Badge — "Unique"

```
Background: rgba(232, 168, 124, 0.2)
Text: #C88A5C (terracotta-dark)
Padding: 4px 12px (py-1 px-3)
Border Radius: 9999px (rounded-full)
Font: Inter, 12px, semibold (600)
Text Transform: uppercase
Letter Spacing: 0.05em
```

### Badge — "Signature Feature"

```
Background: #E8A87C (terracotta)
Text: #FFFFFF (white)
Padding: 4px 12px (py-1 px-3)
Border Radius: 9999px (rounded-full)
Font: Inter, 14px, medium (500)
```

---

## Responsive Breakpoints

| Breakpoint | Width | Tailwind |
|------------|-------|----------|
| Mobile | < 768px | default |
| Tablet | 768px+ | `md:` |
| Desktop | 1024px+ | `lg:` |
| Wide | 1280px+ | `xl:` |

**Design mobile-first.** Default styles are mobile, use `md:` and `lg:` for larger screens.

---

## Animation Specs

| Animation | Duration | Easing |
|-----------|----------|--------|
| Page transition | 400ms | ease-in-out |
| Button hover | 200ms | ease |
| Card hover | 200ms | ease |
| Mobile menu | 300ms | ease-out |
| Scroll reveal | 400ms | ease-out |
| Form focus | 200ms | ease |

---

## PWA Manifest Colors

```json
{
  "theme_color": "#7A9E7E",
  "background_color": "#FAF6EE"
}
```
