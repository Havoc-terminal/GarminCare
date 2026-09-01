<script setup lang="ts">
import BentoGrid from "@/components/inspira/ui/bento-grid/BentoGrid.vue";
import BentoGridItem from "@/components/inspira/ui/bento-grid/BentoGridItem.vue";
import BorderBeam from "@/components/inspira/ui/border-beam/BorderBeam.vue";
import { CardBody, CardContainer, CardItem } from "@/components/inspira/ui/card-3d";
</script>

<template>
  <section class="min-h-screen bg-zinc-950 px-6 py-20 text-white">
    <div class="mx-auto max-w-7xl">
      <div class="mb-16 text-center">
        <h2 class="text-3xl font-bold tracking-tight sm:text-5xl">Engineered for Performance</h2>
        <p class="mt-4 text-zinc-400">Next-generation UI building blocks with smooth micro-interactions.</p>
      </div>

      <BentoGrid class="max-w-6xl">
        <!-- Feature 1: 3D Interactive Card -->
        <BentoGridItem class="md:col-span-2">
          <template #header>
            <CardContainer container-class="py-2" class="w-full">
              <CardBody class="relative size-full rounded-xl border border-white/10 bg-zinc-900/80 p-6 backdrop-blur-md">
                <CardItem :translate-z="40" class="text-xl font-bold text-white">
                  3D Depth Perspective
                </CardItem>
                <CardItem :translate-z="60" class="mt-2 text-sm text-zinc-400">
                  Track mouse movement with real-time hardware-accelerated 3D parallax.
                </CardItem>
                <CardItem :translate-z="100" class="mt-6 flex h-32 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                  <span class="text-sm font-medium text-indigo-300">Hover across to tilt in 3D</span>
                </CardItem>
              </CardBody>
            </CardContainer>
          </template>
          <template #title>Hardware-Accelerated 3D</template>
          <template #description>Zero layout thrashing with CSS perspective and GPU transforms.</template>
        </BentoGridItem>

        <!-- Feature 2: Border Beam Spotlight -->
        <BentoGridItem class="relative overflow-hidden md:col-span-1">
          <BorderBeam :size="200" :duration="8" :delay="0" color-from="#6366f1" color-to="#a855f7" />
          <template #header>
            <div class="flex h-36 w-full items-center justify-center rounded-lg bg-zinc-900">
              <div class="size-16 rounded-2xl bg-indigo-600/20 flex items-center justify-center border border-indigo-500/30">
                <svg class="size-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </template>
          <template #title>Border Beam Accents</template>
          <template #description>Luminous traveling ray that highlights key card borders.</template>
        </BentoGridItem>

        <!-- Feature 3: Global Edge -->
        <BentoGridItem class="md:col-span-1">
          <template #title>Global Edge Network</template>
          <template #description>Deploy across 300+ edge locations worldwide.</template>
        </BentoGridItem>

        <!-- Feature 4: Theme Adaptation -->
        <BentoGridItem class="md:col-span-2">
          <template #title>Zero-Config Dark Mode</template>
          <template #description>OKLCH color system automatically tunes contrast in light and dark modes.</template>
        </BentoGridItem>
      </BentoGrid>
    </div>
  </section>
</template>
