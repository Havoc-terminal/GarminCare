---
name: liquid-glass-widgets
description: >-
  Comprehensive guide and cheatsheet for building iOS 26 Liquid Glass UI in Flutter using the liquid_glass_widgets library.
  Use this skill whenever implementing shader-based glassmorphism, frosted glass, physics-driven jelly/teardrop morph animations,
  GlassScaffold, GlassAppBar, GlassTabBar, GlassModalSheet, GlassMenu, GlassButton, GlassCard, progressive blurs, or optimizing Flutter Impeller/Skia shader pipelines.
---

# Liquid Glass Widgets Skill

This skill guides the agent in implementing Apple iOS 26-style "Liquid Glass" interfaces in Flutter using the `liquid_glass_widgets` package (Flutter ≥ 3.41, Dart ≥ 3.5).

---

## Golden Architectural Rules

1. **Platter, Not a Wrapper:**
   `GlassCard`, `GlassContainer`, and `GlassGroupedSection` are base surfaces (platters) to place *opaque* widgets on (`Text`, `Icon`, `ListTile`, forms). **NEVER wrap refractive glass controls (`GlassButton`, `GlassSegmentedControl`, `GlassSlider`, `GlassSwitch`) inside another glass container/card.**
2. **Glass vs. Content Separation:**
   Glass is reserved for the **floating navigation and control layer** (`GlassAppBar`, `GlassTabBar`, `GlassModalSheet`, `GlassMenu`, action pills). Main scrollable body content and full-screen backgrounds must stay opaque.
3. **Always Pre-warm in `main()`:**
   Call `await LiquidGlassWidgets.initialize();` before `runApp()` to pre-load shaders into RAM without GPU stalls.
4. **Wrap Root with `LiquidGlassWidgets.wrap()`:**
   Wrap the app root. When using `MaterialApp`, **always** pass `brightnessResolver: Theme.maybeBrightnessOf` to prevent dark-mode border inversion.
5. **Quality Tiering:**
   Use `GlassQuality.standard` for 95% of cases (scrollable views, interactive elements); use `GlassQuality.premium` only for static hero surfaces on Impeller; use `GlassQuality.minimal` for dense lists or low-end device fallbacks.

---

## Quick Start Template

```dart
import 'package:flutter/material.dart';
import 'package:liquid_glass_widgets/liquid_glass_widgets.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // 1. Zero-GPU-draw async shader pre-caching
  await LiquidGlassWidgets.initialize();

  // 2. Wrap root app
  runApp(LiquidGlassWidgets.wrap(
    brightnessResolver: Theme.maybeBrightnessOf, // Required for MaterialApp
    adaptiveQuality: true, // Real-time GPU benchmark & thermal adaptation
    theme: GlassThemeData.simple(
      blur: 10.0,
      thickness: 30.0,
      quality: GlassQuality.standard,
    ),
    child: const MyApp(),
  ));
}
```

---

## Screen Architecture Workflow

When building any screen with liquid glass:

1. **Use `GlassScaffold` instead of `Scaffold` + manual stacks:**
   `GlassScaffold` wires up background sampling, status bar brightness, edge fading, and backdrop isolation automatically.
2. **Provide a Vibrant Background / Wallpaper:**
   Glass relies on backdrop refraction. Without contrast or imagery behind it, glass looks invisible.
3. **Configure Navigation Chrome:**
   - Top: `GlassAppBar(title: ...)`
   - Bottom: `GlassTabBar.bottom(...)` or `GlassTabBar.searchable(...)`
   - Enable `contentAwareBrightness: true` on `GlassScaffold` and `adaptiveBrightness: true` on the bar for dynamic light/dark contrast adjustments.

---

## Reference Guides

Detailed specialized documentation in this skill:

- [**Widget & API Catalog**](./references/widget_catalog.md): Complete list of containers, inputs, interactive controls, feedback, overlays, and surfaces.
- [**Architecture, Shaders & Rendering**](./references/architecture_and_rendering.md): Deep-dive into Impeller Metal/Vulkan pipelines, Skia/Web CanvasKit 2D fallbacks, `GlassAdaptiveScope`, and `GlassPerformanceMonitor`.
- [**Liquid Morph Engine**](./references/liquid_morph_engine.md): Teardrop metaball physics, `GlassMorphController`, `LiquidMorphState`, and morphing triggers.
- [**Best Practices & Anti-Patterns**](./references/common_patterns_and_anti_patterns.md): In-depth rules on glass platters, theming cascades, scroll synchronization, and accessibility.

---

## Ready-to-Use Examples

- [Quick Start App](./examples/quick_start_app.dart)
- [Glass Scaffold & Navigation](./examples/glass_scaffold_navigation.dart)
- [Liquid Morph Menu](./examples/liquid_morph_menu.dart)
- [Glass Modal Sheet Morphing](./examples/glass_modal_sheet_morph.dart)

---

## Troubleshooting & Verification Checklist

- [ ] Is `await LiquidGlassWidgets.initialize()` called in `main()`?
- [ ] Is `brightnessResolver: Theme.maybeBrightnessOf` passed to `LiquidGlassWidgets.wrap()` for `MaterialApp`?
- [ ] Are interactive glass controls kept outside of `GlassCard`/`GlassContainer`?
- [ ] Are scrollable lists inside `GlassModalSheet` connected via `ScrollControllerProvider.of(context)`?
- [ ] Are static hero sections using `GlassQuality.premium` while scrolling lists use `GlassQuality.standard`?
