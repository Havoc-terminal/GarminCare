<script setup lang="ts">
import GlareCard from "@/components/inspira/ui/glare-card/GlareCard.vue";
import RadiantText from "@/components/inspira/ui/radiant-text/RadiantText.vue";
import Meteors from "@/components/inspira/ui/meteors/Meteors.vue";
import NumberTicker from "@/components/inspira/ui/number-ticker/NumberTicker.vue";
</script>

<template>
  <div class="min-h-screen bg-slate-950 px-6 py-16 text-white">
    <div class="mx-auto max-w-5xl space-y-16">
      <!-- Section 1: Radiant Text & Animated Stats -->
      <div class="text-center">
        <RadiantText class="text-4xl font-extrabold sm:text-6xl" :duration="4">
          Next-Gen Interface Experience
        </RadiantText>
        <p class="mt-4 text-slate-400">Combining physics-driven spring dynamics with rich shaders.</p>

        <!-- Stats counter with NumberTicker -->
        <div class="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div class="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div class="text-4xl font-extrabold text-indigo-400">
              <NumberTicker :value="99" />%
            </div>
            <div class="mt-2 text-sm text-slate-400">Customer Satisfaction</div>
          </div>
          <div class="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div class="text-4xl font-extrabold text-purple-400">
              <NumberTicker :value="140" />+
            </div>
            <div class="mt-2 text-sm text-slate-400">Reusable Components</div>
          </div>
          <div class="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div class="text-4xl font-extrabold text-cyan-400">
              <NumberTicker :value="60" />fps
            </div>
            <div class="mt-2 text-sm text-slate-400">Butter-Smooth Motion</div>
          </div>
        </div>
      </div>

      <!-- Section 2: Glare Card Showcase -->
      <div class="flex flex-wrap items-center justify-center gap-8">
        <GlareCard class="flex flex-col items-center justify-center p-8 text-center">
          <svg class="size-12 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h3 class="mt-4 text-xl font-bold text-white">Holographic Glare</h3>
          <p class="mt-2 text-xs text-slate-300">Move your cursor over this card to watch the holographic glare effect reflect light.</p>
        </GlareCard>

        <!-- Meteor Card -->
        <div class="relative flex h-80 w-80 flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900 to-slate-950 p-6 shadow-2xl">
          <Meteors :number="20" />
          <div class="size-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            ★
          </div>
          <div class="relative z-10">
            <h4 class="text-lg font-bold text-white">Meteor Showers</h4>
            <p class="mt-1 text-xs text-slate-400">Subtle background animations that add depth without sacrificing CPU overhead.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
