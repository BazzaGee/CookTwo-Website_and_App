---
name: Sunday Hearth
colors:
  surface: '#ebffe7'
  surface-dim: '#cae0c8'
  surface-bright: '#ebffe7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#e4fae1'
  surface-container: '#def4db'
  surface-container-high: '#d8eed6'
  surface-container-highest: '#d3e8d0'
  on-surface: '#0e1f10'
  on-surface-variant: '#424842'
  inverse-surface: '#233524'
  inverse-on-surface: '#e1f7de'
  outline: '#727971'
  outline-variant: '#c2c8bf'
  surface-tint: '#44664a'
  primary: '#44664a'
  on-primary: '#ffffff'
  primary-container: '#7a9e7e'
  on-primary-container: '#13341c'
  inverse-primary: '#aad0ad'
  secondary: '#85532e'
  on-secondary: '#ffffff'
  secondary-container: '#febb8e'
  on-secondary-container: '#794925'
  tertiary: '#615e57'
  on-tertiary: '#ffffff'
  tertiary-container: '#98958c'
  on-tertiary-container: '#2f2e27'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c6ecc8'
  primary-fixed-dim: '#aad0ad'
  on-primary-fixed: '#00210b'
  on-primary-fixed-variant: '#2d4e33'
  secondary-fixed: '#ffdcc6'
  secondary-fixed-dim: '#fbb88b'
  on-secondary-fixed: '#301400'
  on-secondary-fixed-variant: '#693c19'
  tertiary-fixed: '#e7e2d8'
  tertiary-fixed-dim: '#cac6bd'
  on-tertiary-fixed: '#1d1c16'
  on-tertiary-fixed-variant: '#494740'
  background: '#ebffe7'
  on-background: '#0e1f10'
  surface-variant: '#d3e8d0'
typography:
  h1:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h1-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1.2'
  h2:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  h3:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.5'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  container-padding: 20px
  gutter: 16px
---

## Brand & Style

The design system is built around the "Sunday Morning" philosophy: calm, intentional, and collaborative. It targets couples who want to transform meal planning from a chore into a shared ritual. The aesthetic avoids the clinical, data-heavy look of fitness apps in favor of a warm, editorial, and premium feel.

The style is **Modern Organic**, blending minimalist layouts with tactile, soft-edged elements. It prioritizes emotional resonance over raw utility, using generous whitespace and a sophisticated "sage and terracotta" palette to evoke a sense of home and nourishment.

## Colors

The palette is anchored in nature-inspired tones. The **Sage** primary serves as the calming foundation, while **Terracotta** acts as a warm, appetizing accent for calls to action. 

The background utilizes a soft **Cream** (#FAF6EE) rather than pure white to reduce eye strain and maintain a cozy atmosphere. **Cream Dark** is used for subtle surface differentiation, creating a soft layered effect without the need for harsh shadows. Text is rendered in a deep **Charcoal-Green** (#2C3E2D) to ensure high legibility while remaining softer than pure black.

## Typography

This design system uses **Plus Jakarta Sans** for headings to achieve a rounded, friendly, and organic appearance. It feels approachable yet premium. For body copy, **Inter** provides a clean, neutral, and highly readable foundation that balances the personality of the headings.

Line heights are set to a generous 1.5x for body text to maintain the "calm" principle and ensure recipes and shopping lists are easy to scan while cooking.

## Layout & Spacing

The layout follows a **fluid grid** model optimized for mobile-first usage. On mobile, a single-column layout with 20px side margins is standard. On larger screens, the content transitions to a centered fixed-width container (max-width 1200px) with an 8-column grid.

Spacing is governed by a 4px/8px baseline rhythm. Padding within cards and containers should remain generous (16px to 24px) to avoid a cramped "utility" feel. Elements are grouped using whitespace rather than dividers wherever possible to maintain a clean, open aesthetic.

## Elevation & Depth

This design system avoids heavy shadows and floating elements. Instead, it uses **Tonal Layers** and **Low-Contrast Outlines**.

Depth is created by placing components on slightly darker or lighter surfaces (e.g., a Cream Dark card on a Cream background). When a shadow is necessary for interactivity (like a lifted card during drag-and-drop), use an extremely diffused, low-opacity shadow tinted with the primary Sage color to maintain warmth. Borders are soft and low-contrast (#E5E1DA) to subtly define structure without creating visual noise.

## Shapes

The shape language is defined by significant roundedness to evoke a friendly, non-clinical feel. Standard components (buttons, input fields) use a **0.5rem (8px)** radius. Larger containers, such as recipe cards or modal sheets, utilize a **rounded-xl (1.5rem/24px)** radius to create a soft, modern silhouette.

Interactive elements like chips or "add" buttons may use a full pill-shape to distinguish them from structural elements.

## Components

### Buttons
- **Primary:** Filled Sage (#7A9E7E) with white text. 12px vertical padding, 24px horizontal.
- **Secondary:** Filled Terracotta (#E8A87C) for primary conversion actions (e.g., "Cook Now").
- **Ghost:** Transparent background with Sage Dark text for secondary navigation.

### Cards
- Use Cream Dark (#F5F0E6) backgrounds with 24px corner radius.
- Padding should be 20px. 
- Use subtle 1px border (#E5E1DA) instead of shadows for a premium, flat-lay look.

### Input Fields
- Background-color: Cream Dark. 
- Border: 1px solid #E5E1DA, changing to Sage on focus.
- 12px internal padding for a "thumb-friendly" touch target.

### List Items (Shopping List)
- 16px vertical padding to ensure ease of tapping while on the move.
- Custom checkboxes using a rounded-sm (4px) corner and Sage fill when checked.

### Collaborative Indicators
- "Partner" avatars or presence indicators use a subtle Terracotta border to stand out against the Sage/Cream base.
- Shared meal tags use a soft Sage Light background with Sage Dark text.