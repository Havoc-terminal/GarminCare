# Architecture, Shaders & Rendering Pipeline

A deep-dive technical reference on how `liquid_glass_widgets` renders glass across different graphics backends and hardware tiers.

---

## 1. Multi-Backend Rendering Architecture

`liquid_glass_widgets` adapts its shader and compositing pipeline automatically based on the target operating system and graphics renderer.

| Platform | Renderer | Pipeline Details | Quality Ceiling |
|---|---|---|---|
| **iOS** | Impeller (Metal) | Full 16-shape unrolled geometry SDF, two-pass Gaussian blur + shader refraction, chromatic aberration, AOT metallib | `GlassQuality.premium` |
| **Android (Vulkan)** | Impeller (Vulkan) | Full 16-shape pipeline, async preloaded SPIR-V bytecode — matches iOS Metal frame-for-frame | `GlassQuality.premium` |
| **Android (GLES)** | Impeller (GLES) | Optimized 8-shape AST to prevent runtime driver JIT stalls; zero ANRs | `GlassQuality.standard` |
| **macOS** | Impeller (Metal) | Full 16-shape Metal pipeline | `GlassQuality.premium` |
| **Windows** | Impeller (ANGLE) / Skia | Lightweight 2D shader default; instant Frame 1 launch; GLES-optimized AST | `GlassQuality.standard` |
| **Linux** | Impeller / Skia | Lightweight 2D shader default | `GlassQuality.standard` |
| **Web** | CanvasKit | Lightweight 2D fragment shader | `GlassQuality.standard` |

---

## 2. Startup Optimization: `initialize()` vs `wrap()`

### `LiquidGlassWidgets.initialize()`
Must be called in `main()` before `runApp()`.
- **Zero GPU rasterization / zero draw calls:** Executes pure non-blocking async disk-to-RAM I/O.
- Loads FragmentProgram bytecode into RAM so widgets render without placeholder frames or white flashes on Frame 1.
- In debug/profile builds, starts `GlassPerformanceMonitor`.

```dart
void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await LiquidGlassWidgets.initialize(
    warmUpMode: GlassWarmUpMode.auto, // auto-selects shaders per platform
    enablePerformanceMonitor: true,    // debug frame watcher (disabled in release)
  );

  runApp(LiquidGlassWidgets.wrap(
    child: const MyApp(),
    brightnessResolver: Theme.maybeBrightnessOf, // required for MaterialApp
    adaptiveQuality: true,
  ));
}
```

### `LiquidGlassWidgets.wrap()`
Root composition helper that sits at the top of the widget tree.
- Injects `GlassTheme` (if provided)
- Injects `GlassAdaptiveScope` (if `adaptiveQuality: true`)
- Registers `brightnessResolver` for `MaterialApp`
- Bridges system accessibility settings (Reduce Motion, Reduce Transparency)

---

## 3. Glass Quality Modes

### `GlassQuality.standard` (Default)
- Recommended for 95% of use cases (scrollable lists, buttons, controls, input fields).
- Uses a lightweight 2D liquid glass shader with squircle clipping, dual specular highlights, and BackdropFilter blur.
- Consistent 60/120fps performance on all platforms.

### `GlassQuality.premium` (Impeller Metal/Vulkan Only)
- Uses a 2-pass rendering pipeline:
  1. **Pass 1:** Backdrop texture capture into an isolated `BackdropGroup` with exact shape clipping.
  2. **Pass 2:** Full fragment shader pass computing chromatic aberration, Fresnel rim refraction, dynamic lighting, and normal map distortion.
- **Rule:** Use *only* for static, non-scrolling surfaces (e.g., hero headers, floating app bars, fixed bottom bars). Do not use inside scrolling `ListView` or `GridView`.

### `GlassQuality.minimal` (Shader-Free)
- Zero custom fragment shader cost.
- Uses standard Flutter `BackdropFilter` + Rec. 709 saturation color matrix + specular rim stroke.
- Ideal for low-end device fallbacks and GPU budget management when displaying dozens of glass cards in a dense list.

---

## 4. Adaptive Quality (`GlassAdaptiveScope`)

`adaptiveQuality: true` automatically benchmarks device raster performance and prevents frame drops.

### The 3 Adaptation Phases:
1. **Phase 1 (Synchronous on Mount):** Statically checks platform limits (caps Web/Windows/Linux at `standard`, falls back to `minimal` if shader filters are unsupported).
2. **Phase 2 (~180 frames / 3 seconds):** Measures real P75 raster frame times. If the GPU struggles, steps down to `standard` or `minimal`.
3. **Phase 3 (Ongoing Runtime):** Watches for thermal throttling or heavy load. If P95 exceeds 1.5x frame budget across 3 windows, steps down. If cool for 10 windows, steps up.

### Eliminating Cold Start Warmup Jank in Production
Persist the settled quality across app launches:

```dart
void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final prefs = await SharedPreferences.getInstance();
  final saved = prefs.getString('glass_quality');
  final initialQuality = saved != null ? GlassQuality.values.byName(saved) : null;

  await LiquidGlassWidgets.initialize();

  runApp(LiquidGlassWidgets.wrap(
    child: const MyApp(),
    adaptiveQuality: true,
    adaptiveConfig: GlassAdaptiveScopeConfig(
      initialQuality: initialQuality,
      allowStepUp: true,
      onQualityChanged: (from, to) => prefs.setString('glass_quality', to.name),
    ),
  ));
}
```

---

## 5. Performance Diagnostics (`GlassPerformanceMonitor`)

When `GlassQuality.premium` surfaces are mounted, `GlassPerformanceMonitor` watches frame raster timings. If frames consistently exceed the budget (e.g. 16.6ms at 60fps or 8.3ms at 120fps for 60 consecutive frames), it emits a structured `FlutterError` in debug mode explaining:
- The offending widget
- The observed frame times vs budget
- How to downgrade that specific widget or subtree to `GlassQuality.standard` or `GlassQuality.minimal`
