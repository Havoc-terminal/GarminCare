---
name: inspira-ui
description: >-
  Comprehensive guide and cheatsheet for building modern, animated, high-performance Vue 3 and Nuxt interfaces using the Inspira UI component library (Vue port of Magic UI & Aceternity UI).
  Use this skill whenever implementing Vue/Nuxt animated components, backgrounds (Aurora, Sparkles, Meteors, Vortex), typography effects (FlipWords, TextGenerateEffect, Typewriter),
  3D Cards, Bento Grids, Shimmer Buttons, Glow Borders, or motion-v physics animations.
---

# Inspira UI Skill

This skill guides the agent in building high-fidelity, animated web applications using **Inspira UI** — the community-driven collection of 140+ animated components for **Vue 3** and **Nuxt 3** (adapted from Aceternity UI, Magic UI, and shadcn-vue).

---

## Core Architectural Rules

1. **Copy-Paste & Registry Model:**
   Inspira UI is a modular component kit (not a bloated monolithic npm package). You copy/generate specific `.vue` components into your project's `components/inspira/` folder and customize them freely.
2. **Tailwind CSS & CSS Tokens First:**
   Always ensure `@import "tailwindcss";`, `@import "tw-animate-css";`, and the standard OKLCH design variables (`--background`, `--foreground`, `--primary`, `--card`, etc.) are configured in `main.css`.
3. **Class Merging with `cn()`:**
   Always merge component classes using `cn()` (built on `clsx` + `tailwind-merge`) to allow effortless prop-based class overrides.
4. **Choose the Right Animation Layer:**
   - **CSS Transforms / Keyframes:** For micro-interactions, border sheens, shimmers (`ShimmerButton`, `BorderBeam`, `AuroraBackground`).
   - **`motion-v` (Motion for Vue):** For declarative layout transitions, text reveals, and spring physics.
   - **HTML5 Canvas 2D / WebGL:** For heavy particle systems (`Sparkles`, `Meteors`, `Globe`, `WavyBackground`), always using DPR scaling and `useRafFn` lifecycle cleanup.
5. **Accessibility & Reduced Motion:**
   Always wrap high-motion animations with `motion-safe:` or `@vueuse/core`'s `usePreferredReducedMotion()` to respect system accessibility preferences.

---

## Quick Setup Guide

### 1. Install Core Dependencies
```bash
npm install @vueuse/core motion-v tw-animate-css clsx tailwind-merge class-variance-authority
```

### 2. Add Class Utility (`src/utils/cn.ts`)
```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### 3. Component Usage Pattern
```vue
<script setup lang="ts">
import AuroraBackground from "@/components/inspira/ui/aurora-background/AuroraBackground.vue";
import ShimmerButton from "@/components/inspira/ui/shimmer-button/ShimmerButton.vue";
import FlipWords from "@/components/inspira/ui/flip-words/FlipWords.vue";

const keywords = ["Stunning", "Fluid", "Modern", "Dynamic"];
</script>

<template>
  <AuroraBackground class="h-screen text-white">
    <div class="relative z-10 text-center">
      <h1 class="text-5xl font-extrabold">
        Build <FlipWords :words="keywords" /> Apps
      </h1>
      <div class="mt-8 flex justify-center">
        <ShimmerButton>Explore Components</ShimmerButton>
      </div>
    </div>
  </AuroraBackground>
</template>
```

---

## Reference Guides

- [**Component & API Catalog**](./references/component_catalog.md): Complete index of all 140+ components across backgrounds, typography, cards, buttons, overlays, and visualizations.
- [**Vue & Nuxt Project Setup**](./references/vue_nuxt_setup.md): Complete instructions for Tailwind CSS v4/v3, Nuxt 3 modules, and Vite alias configurations.
- [**Animation & Performance**](./references/animation_and_performance.md): Canvas RAF management, `motion-v` physics, DPR scaling, mobile optimization, and accessibility.

---

## Ready-to-Use Examples

- [Hero Section with Aurora & Sparkles](./examples/hero_section_vue.vue)
- [Bento Grid Feature Showcase with 3D Cards](./examples/bento_grid_feature.vue)
- [Interactive Effects Showcase with GlareCard & Meteors](./examples/interactive_effects_showcase.vue)
