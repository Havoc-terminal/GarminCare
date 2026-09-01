# Inspira UI: Component & API Catalog

An exhaustive reference catalog of Inspira UI components across Vue 3 and Nuxt 3, categorized with code templates and key properties.

---

## 1. Backgrounds & Ambient Environments

Create atmospheric, immersive backdrops for landing pages, hero sections, and headers.

### `AuroraBackground`
Creates an animated multi-layered Northern Lights / Aurora gradient effect with smooth CSS blending.

```vue
<script setup lang="ts">
import AuroraBackground from "@/components/inspira/ui/aurora-background/AuroraBackground.vue";
</script>

<template>
  <AuroraBackground :radial-gradient="true" class="h-screen">
    <div class="relative z-10 text-center">
      <h1 class="text-5xl font-extrabold text-white">Experience Modern Elegance</h1>
    </div>
  </AuroraBackground>
</template>
```

### `Sparkles` / `SparklesCore`
Lightweight, dynamic 2D HTML5 Canvas particle starfield with customizable size, density, and speed.

```vue
<script setup lang="ts">
import Sparkles from "@/components/inspira/ui/sparkles/Sparkles.vue";
</script>

<template>
  <div class="relative h-96 w-full overflow-hidden rounded-2xl bg-slate-950">
    <Sparkles
      background="transparent"
      :min-size="1"
      :max-size="3"
      :particle-density="100"
      particle-color="#38bdf8"
      :speed="2"
      class="absolute inset-0 size-full"
    />
    <div class="relative z-10 flex h-full items-center justify-center">
      <span class="text-3xl font-bold text-white">Interactive Particle Space</span>
    </div>
  </div>
</template>
```

### `Meteors`
Shooting star effect across the background.

```vue
<script setup lang="ts">
import Meteors from "@/components/inspira/ui/meteors/Meteors.vue";
</script>

<template>
  <div class="relative h-80 w-full overflow-hidden rounded-xl bg-gray-900 p-8">
    <Meteors :number="30" />
    <h2 class="relative z-10 text-2xl font-bold text-white">Fast As Light</h2>
  </div>
</template>
```

### `Vortex` & `WavyBackground`
GPU-driven fluid wave canvas animations with simplex noise.

### Other Backgrounds in Catalog:
- `BgBlackHole`, `BgBubbles`, `BgFallingStars`, `BgNeural`, `BgParticleWhirlpool`
- `BgSilk`, `BgSingularity`, `BgStars`, `BgStractium`, `BgThunderstorm`
- `FlickeringGrid`, `InteractiveGridPattern`, `WarpBackground`, `LiquidBackground`

---

## 2. Text Animations & Typography

Dynamic typography components for engaging hero headers and taglines.

### `TextGenerateEffect`
Progressively reveals words with a soft blur-to-focus fade-in transition.

```vue
<script setup lang="ts">
import TextGenerateEffect from "@/components/inspira/ui/text-generate-effect/TextGenerateEffect.vue";

const words = "Transform your Vue and Nuxt apps with fluid, high-performance UI components.";
</script>

<template>
  <TextGenerateEffect :words="words" class="text-3xl font-semibold" />
</template>
```

### `FlipWords`
Transitions smoothly between rotating keywords in a sentence.

```vue
<script setup lang="ts">
import FlipWords from "@/components/inspira/ui/flip-words/FlipWords.vue";

const words = ["exceptional", "blazing-fast", "stunning", "scalable"];
</script>

<template>
  <div class="text-4xl font-bold text-neutral-800 dark:text-neutral-100">
    Build <FlipWords :words="words" /> web applications.
  </div>
</template>
```

### `SparklesText` & `ColourfulText`
- `SparklesText`: Adds animated glowing sparkles around high-impact headline text.
- `ColourfulText`: Shifts character hues dynamically.

### `TypewriterText` & `MorphingText`
- `TypewriterText`: Classic cursor-typing and backspacing animation.
- `MorphingText`: SVG threshold filter morphing between phrases.

### Other Typography Components:
- `BreathingText`, `HyperText`, `EncryptedText`, `TextRevealCard`, `TextScrollReveal`
- `LineShadowText`, `RadiantText`, `SpinningText`, `LetterSwap`, `LetterPullup`

---

## 3. Cards, Grids & Platters

Modern layout components for feature showcases, portfolios, and dashboard metrics.

### `BentoGrid` & `BentoGridItem`
Apple-inspired responsive grid structure with header, icon, title, and description slots.

```vue
<script setup lang="ts">
import BentoGrid from "@/components/inspira/ui/bento-grid/BentoGrid.vue";
import BentoGridItem from "@/components/inspira/ui/bento-grid/BentoGridItem.vue";
</script>

<template>
  <BentoGrid class="max-w-4xl">
    <BentoGridItem class="md:col-span-2">
      <template #header>
        <div class="h-full min-h-[6rem] w-full rounded-xl bg-gradient-to-br from-neutral-200 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800" />
      </template>
      <template #title>Real-time Analytics</template>
      <template #description>Track metrics with sub-millisecond precision.</template>
    </BentoGridItem>
    <BentoGridItem class="md:col-span-1">
      <template #title>Zero Latency</template>
      <template #description>Edge deployment around the globe.</template>
    </BentoGridItem>
  </BentoGrid>
</template>
```

### `Card3D` (`CardContainer`, `CardBody`, `CardItem`)
Perspective 3D tilt interaction that tracks mouse coordinates with parallax depth on child items.

```vue
<script setup lang="ts">
import { CardBody, CardContainer, CardItem } from "@/components/inspira/ui/card-3d";
</script>

<template>
  <CardContainer>
    <CardBody class="group/card relative size-auto rounded-xl border border-black/10 bg-gray-50 p-6 dark:border-white/20 dark:bg-black">
      <CardItem :translate-z="50" class="text-xl font-bold text-neutral-600 dark:text-white">
        Interactive 3D Card
      </CardItem>
      <CardItem :translate-z="60" as="p" class="mt-2 text-sm text-neutral-500">
        Hover over to experience smooth perspective tilt.
      </CardItem>
      <CardItem :translate-z="100" class="mt-4 w-full">
        <img src="/preview.jpg" class="h-40 w-full rounded-xl object-cover" />
      </CardItem>
    </CardBody>
  </CardContainer>
</template>
```

### `CardSpotlight` & `GlareCard`
- `CardSpotlight`: Radial spotlight overlay that follows the cursor across the card surface.
- `GlareCard`: Holographic metallic glare effect inspired by trading cards.

### Other Card Components:
- `AppleCardCarousel`, `FeyCards`, `FlipCard`, `CardStack`, `FloatingCard`, `ContainerScroll`

---

## 4. Interactive Buttons & Controls

Tactile buttons with animated borders, shimmers, and ripples.

### `ShimmerButton`
Premium glowing edge button with rotating conic-gradient sheen.

```vue
<script setup lang="ts">
import ShimmerButton from "@/components/inspira/ui/shimmer-button/ShimmerButton.vue";
</script>

<template>
  <ShimmerButton
    shimmer-color="#60a5fa"
    background="rgba(15, 23, 42, 1)"
    class="shadow-2xl"
  >
    <span class="text-sm font-medium tracking-tight text-white">
      Deploy Application
    </span>
  </ShimmerButton>
</template>
```

### `RainbowButton` & `InteractiveHoverButton`
- `RainbowButton`: Multi-color animated gradient border button.
- `InteractiveHoverButton`: Text and arrow shift on hover with circular expand.

### `RippleButton` & `GradientButton`
- `RippleButton`: Material-style expanding wave effect on click.
- `GradientButton`: Smooth animated gradient transitions.

---

## 5. Visualizations, Overlays & Special Effects

### `BorderBeam` & `GlowBorder`
- `BorderBeam`: Animated luminous light beam traveling around card borders.
- `GlowBorder`: Continuous glowing perimeter with customizable hue stops.

```vue
<script setup lang="ts">
import BorderBeam from "@/components/inspira/ui/border-beam/BorderBeam.vue";
</script>

<template>
  <div class="relative rounded-xl border border-neutral-200 p-8 dark:border-neutral-800">
    <BorderBeam :size="250" :duration="12" :delay="9" />
    <h3 class="text-lg font-semibold">Active Monitoring</h3>
  </div>
</template>
```

### `AnimatedBeam`
Connects icons or nodes with flowing SVG gradient particles (ideal for architecture diagrams & pipelines).

### `Globe` / `GithubGlobe`
Interactive 3D WebGL / Cobe Earth globe rendering location markers and connection arcs.

### `Marquee` & `IconCloud`
- `Marquee`: Infinite smooth scrolling carousel for logos or reviews.
- `IconCloud`: 3D interactive spinning spherical cloud of tech icons.

### `Confetti`
Triggers customizable canvas confetti explosions on button clicks or milestone events.
