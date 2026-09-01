# Animation Architecture, Performance & Accessibility

Guidelines for optimizing Inspira UI animations, managing high-throughput canvas loops, and ensuring responsiveness.

---

## 1. Choosing the Right Animation Layer

Inspira UI components leverage three primary rendering engines based on complexity:

| Layer | Technology | Best For | Examples | Performance Profile |
|---|---|---|---|---|
| **CSS Transforms & Keyframes** | Tailwind / CSS | Micro-animations, borders, subtle sheens | `ShimmerButton`, `BorderBeam`, `AuroraBackground` | Zero JS thread overhead, GPU composited |
| **Declarative Spring Motion** | `motion-v` | UI state changes, entrance animations, layout shifts | `TextGenerateEffect`, `AnimatedTabs`, `FlipWords` | Smooth physics-based spring curves |
| **HTML5 2D Canvas** | Canvas API + `useRafFn` | Thousands of dynamic particles, sparkles, meteors | `Sparkles`, `Meteors`, `Confetti`, `ParticlesBg` | Single draw call, low memory footprint |
| **WebGL / 3D Context** | Three.js / OGL / Cobe | 3D models, volumetric lighting, interactive earth globes | `Globe`, `GithubGlobe`, `Vortex`, `Spline` | High fidelity, requires GPU management |

---

## 2. Canvas & RAF Performance Rules

When building or modifying Canvas-based components (e.g. `Sparkles`, `WavyBackground`):

### 1. Always Use Device Pixel Ratio (DPR) Scaling
Prevent blurry canvas rendering on high-DPI (Retina) displays:

```typescript
function resizeCanvas() {
  if (!canvasRef.value || !containerRef.value) return;
  const dpr = window.devicePixelRatio || 1;
  const rect = containerRef.value.getBoundingClientRect();

  canvasRef.value.width = rect.width * dpr;
  canvasRef.value.height = rect.height * dpr;

  if (ctx.value) {
    ctx.value.scale(dpr, dpr);
  }
}
```

### 2. Pause Inactive Animations
Use `@vueuse/core`'s `useRafFn` to pause requestAnimationFrame loops when the component unmounts or leaves the viewport:

```typescript
import { useRafFn } from "@vueuse/core";

const { pause, resume } = useRafFn(updateAndDrawParticles, { immediate: false });

onMounted(() => {
  resume();
});

onBeforeUnmount(() => {
  pause();
});
```

---

## 3. Declarative Motion with `motion-v`

`motion-v` brings Motion (Framer Motion) syntax into Vue 3:

```vue
<script setup lang="ts">
import { Motion } from "motion-v";
</script>

<template>
  <Motion
    :initial="{ opacity: 0, y: 20, filter: 'blur(10px)' }"
    :animate="{ opacity: 1, y: 0, filter: 'blur(0px)' }"
    :transition="{ duration: 0.8, ease: 'easeOut' }"
  >
    <h1 class="text-4xl font-bold">Fluid Entrance</h1>
  </Motion>
</template>
```

---

## 4. Accessibility: Respecting `prefers-reduced-motion`

All complex transitions should degrade gracefully when users have reduced motion enabled in their OS:

```vue
<script setup lang="ts">
import { usePreferredReducedMotion } from "@vueuse/core";

const prefersReducedMotion = usePreferredReducedMotion();
</script>

<template>
  <div :class="[prefersReducedMotion ? 'transition-none' : 'animate-bounce']">
    Content
  </div>
</template>
```

In Tailwind CSS:
```html
<div class="motion-safe:animate-spin motion-reduce:animate-none">...</div>
```

---

## 5. Mobile & Viewport Tuning

1. **Reduce Particle Density on Mobile:**
   Scale down particle density (e.g. 100 on desktop → 30 on mobile) using `@vueuse/core`'s `useBreakpoints`.
2. **Disable Parallax / Mouse Tilt on Touch Devices:**
   Disable `Card3D` or `DirectionAwareHover` on devices without fine pointer hover capability (`@media (hover: none)`).
