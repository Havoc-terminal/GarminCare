# Common Patterns, Best Practices & Anti-Patterns

Crucial design principles, guidelines, and solutions to common pitfalls when building UIs with `liquid_glass_widgets`.

---

## 1. Golden Rule #1: Glass is a Platter, Not a Wrapper

`GlassCard`, `GlassContainer`, and `GlassGroupedSection` are **base surfaces** that sit beneath opaque content. They are **not** generic styling wrappers for other glass controls.

```
✅ CORRECT (Platter Pattern):
┌────────────────────────────────────────┐
│ GlassCard (Base Surface)               │
│  ┌──────────────────────────────────┐  │
│  │ Text, Icon, CupertinoListTile    │  │  ← Standard Flutter / Opaque widgets
│  │ Standard Form Fields, Images     │  │
│  └──────────────────────────────────┘  │
└────────────────────────────────────────┘

❌ INCORRECT (Nested Glass Wrapper):
┌────────────────────────────────────────┐
│ GlassCard                              │
│  ┌──────────────────────────────────┐  │
│  │ GlassSegmentedControl, GlassButton│  │  ← DO NOT nest refractive glass inside
│  │ GlassSlider, GlassSwitch         │  │     another glass container!
│  └──────────────────────────────────┘  │
└────────────────────────────────────────┘
```

### Why?
1. `GlassContainer` sets `avoidsRefraction: true` on its children so nested glass cannot refract through the outer layer.
2. On Impeller with `useOwnLayer: true`, the container's clip layer cuts jelly-physics overshoots and indicators during animations.
3. Interactive glass controls already render their own surface background and track — wrapping them in an outer `GlassCard` degrades visual clarity.

---

## 2. Golden Rule #2: Glass vs. Content Separation

In iOS 26 design language:
- **Glass is for the navigation and control layer** (floating above content).
- **Content areas stay opaque** (lists, cards, articles, media).

| ✅ Use Glass For | ❌ Keep Opaque |
|---|---|
| Navigation bars (`GlassAppBar`), Tab bars (`GlassTabBar`) | Scrollable list items, table rows |
| Floating action buttons & action pills | Full-screen backgrounds |
| Modal sheets (`GlassModalSheet`), Menus (`GlassMenu`) | Scrollable article content tiles |
| Segmented controls, toggles, sliders | Video players, image viewers |

---

## 3. Theming & MaterialApp Integration

### MaterialApp Brightness Resolver (Mandatory for MaterialApp)
Without this, glass borders and specular shadows will follow the host OS brightness rather than Flutter's `ThemeMode`:

```dart
runApp(LiquidGlassWidgets.wrap(
  child: const MyApp(),
  brightnessResolver: Theme.maybeBrightnessOf, // Required for MaterialApp
));
```

### App-Wide Theming
Use `GlassThemeData.simple` for quick setups, or define explicit `light` and `dark` variants:

```dart
runApp(LiquidGlassWidgets.wrap(
  child: const MyApp(),
  brightnessResolver: Theme.maybeBrightnessOf,
  theme: GlassThemeData(
    light: GlassThemeVariant(
      settings: const GlassThemeSettings(
        thickness: 30.0,
        blur: 10.0,
        specularSharpness: GlassSpecularSharpness.medium,
      ),
      quality: GlassQuality.standard,
    ),
    dark: GlassThemeVariant(
      settings: const GlassThemeSettings(
        thickness: 40.0,
        blur: 12.0,
        specularSharpness: GlassSpecularSharpness.sharp,
      ),
      quality: GlassQuality.standard,
    ),
  ),
));
```

---

## 4. Scroll Synchronization with GlassModalSheet

When building scrollable content inside a `GlassModalSheet`, synchronize sheet dragging with content scrolling using `ScrollControllerProvider`:

```dart
GlassModalSheet(
  child: Builder(
    builder: (context) {
      final scrollData = ScrollControllerProvider.of(context);
      return ListView.builder(
        controller: scrollData?.controller, // Enables smooth sheet drag hand-off
        physics: scrollData?.physics,
        itemCount: 40,
        itemBuilder: (context, index) => ListTile(
          title: Text('Sheet Item $index'),
        ),
      );
    },
  ),
)
```

---

## 5. Accessibility Handling

`liquid_glass_widgets` is WCAG-compliant by default.
- **Reduce Motion:** Spring and jelly animations automatically snap with zero overshoot.
- **Reduce Transparency / High Contrast:** Shaders are bypassed and replaced with standard frosted `BackdropFilter` panels at zero custom GPU cost.

### Per-Subtree Override (`GlassAccessibilityScope`)
For testing, previews, or game interfaces:

```dart
GlassAccessibilityScope(
  reduceTransparency: true, // Forces solid frosted fallback
  child: const PreviewSection(),
)
```

---

## 6. Common Pitfalls Checklist

| Pitfall | Cause | Solution |
|---|---|---|
| **White flash / jank on first frame** | Shaders not pre-warmed before `runApp()` | Call `await LiquidGlassWidgets.initialize()` in `main()`. |
| **Glass looks invisible or black** | No backdrop or transparent background | Ensure background has color/wallpaper or use `GlassScaffold(background: ...)`. |
| **Frame drops during list scrolling** | Using `GlassQuality.premium` inside `ListView` | Use `GlassQuality.standard` (or `minimal`) for scrolling items. |
| **Dark mode shadows on Light theme** | Missing `brightnessResolver` in `MaterialApp` | Pass `brightnessResolver: Theme.maybeBrightnessOf` to `LiquidGlassWidgets.wrap()`. |
| **Pill indicator cuts off during morph** | Nesting `GlassSegmentedControl` inside `GlassCard` | Extract the segmented control outside the card or place on standard container. |
