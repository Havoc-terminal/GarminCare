<script setup lang="ts">
import AuroraBackground from "@/components/inspira/ui/aurora-background/AuroraBackground.vue";
import Sparkles from "@/components/inspira/ui/sparkles/Sparkles.vue";
import TextGenerateEffect from "@/components/inspira/ui/text-generate-effect/TextGenerateEffect.vue";
import FlipWords from "@/components/inspira/ui/flip-words/FlipWords.vue";
import ShimmerButton from "@/components/inspira/ui/shimmer-button/ShimmerButton.vue";

const rotatingWords = ["Innovative", "Stunning", "Scalable", "High-Performance"];
const subtitle = "Craft immersive user experiences with animated Vue 3 and Nuxt components.";
</script>

<template>
  <div class="relative min-h-screen w-full overflow-hidden bg-zinc-950 text-white">
    <!-- Aurora background ambient lighting -->
    <AuroraBackground :radial-gradient="true" class="min-h-screen">
      <!-- Starfield sparkles layer -->
      <Sparkles
        background="transparent"
        :min-size="1"
        :max-size="2.5"
        :particle-density="70"
        particle-color="#a5b4fc"
        :speed="1.5"
        class="pointer-events-none absolute inset-0 z-0 size-full opacity-60"
      />

      <div class="relative z-10 mx-auto flex max-w-5xl flex-col items-center justify-center px-6 text-center">
        <!-- Badge -->
        <div class="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-indigo-300 backdrop-blur-md">
          <span class="size-2 rounded-full bg-indigo-400 animate-pulse" />
          <span>Inspira UI for Vue & Nuxt</span>
        </div>

        <!-- Headline with FlipWords -->
        <h1 class="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
          Build <FlipWords :words="rotatingWords" class="text-indigo-400" />
          <br />Web Interfaces
        </h1>

        <!-- Subtitle with blur text generate effect -->
        <div class="mt-6 max-w-2xl text-lg text-zinc-300">
          <TextGenerateEffect :words="subtitle" />
        </div>

        <!-- Action CTA -->
        <div class="mt-10 flex flex-wrap items-center justify-center gap-4">
          <ShimmerButton
            shimmer-color="#818cf8"
            shimmer-size="0.1em"
            background="rgba(30, 27, 75, 0.9)"
            class="shadow-indigo-500/20 shadow-xl"
          >
            <span class="flex items-center gap-2 text-sm font-semibold text-white">
              Get Started Free
              <svg class="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </ShimmerButton>

          <button class="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10">
            View Components
          </button>
        </div>
      </div>
    </AuroraBackground>
  </div>
</template>
