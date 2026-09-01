# Liquid Morph Engine & Teardrop Physics

The Liquid Morph Engine powers the signature iOS 26 liquid teardrop animations across `liquid_glass_widgets` (used in `GlassMenu`, `GlassModalSheet`, and custom morphable widgets).

---

## 1. Physics Model: Two-Blob Metaball System

When a glass menu or sheet opens from a trigger, two conceptual blobs interact:

```
Trigger Pressed
      │
      ▼
  open() (Spring with damping ratio ζ ≈ 0.73)
      │
      ▼
  Raw Spring Value: 0.0 ──► ~1.05 (overshoot) ──► 1.0 (settled)
      │
      ▼
  LiquidMorphPhysics.compute()
      │
      ▼
  LiquidMorphState { pathT, sizeT, anchorScale, blend, phase, ... }
      │
      ▼
  Widget transforms Blob A & Blob B, SDF shader blends metaball neck
```

1. **Blob A (Anchor / Trigger):** The ghost trigger that shrinks away (`anchorScale` 1.0 → 0.0) over the first 40% of the animation, cleanly snapping the liquid bridge.
2. **Blob B (Payload / Menu / Sheet):** Travels from the trigger center to the target center along a J-curve trajectory, expanding from trigger size to full destination size.
3. **SDF Metaball Shader:** Generates the dynamic liquid neck between the two blobs without manual geometry meshes.

---

## 2. Core Controller: `GlassMorphController`

### Lifecycle in a Stateful Widget
```dart
class _CustomMorphWidgetState extends State<CustomMorphWidget>
    with TickerProviderStateMixin {
  late final GlassMorphController _morph;

  @override
  void initState() {
    super.initState();
    _morph = GlassMorphController(
      vsync: this,
      speed: MorphSpeed.normal, // 375ms iOS 26 native-parity spring
      style: MorphStyle.teardrop,
    );
    _morph.addListener(() {
      if (mounted) setState(() {});
    });
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    // Automatically respect system Reduce Motion
    _morph.setDisableAnimations(
      MediaQuery.of(context).disableAnimations,
    );
  }

  @override
  void dispose() {
    _morph.dispose();
    super.dispose();
  }
}
```

### Methods & Properties

| Method / Property | Type | Description |
|---|---|---|
| `open()` | `void` | Drives spring toward `1.0`. Safe to call mid-close. |
| `close()` | `void` | Drives spring toward `0.0` with rubber-band snap bounce. |
| `isShowing` | `bool` | `true` from `open()` until the spring returns to rest at `0.0`. |
| `isClosing` | `bool` | `true` while the close spring is active. |
| `hasHandedOff` | `bool` | Latches `true` when the closing spring crosses zero to hand off back to the real trigger. |
| `value` | `double` | Raw unclamped spring value (can overshoot `1.0` or undershoot `0.0`). |

---

## 3. Computing Render State (`LiquidMorphState`)

Call `computeState()` inside the render or listener loop:

```dart
final LiquidMorphState state = _morph.computeState(
  finalDx: targetCenterX - triggerCenterX,
  finalDy: targetCenterY - triggerCenterY,
  horizontalOffset: 0.0,
  verticalOffset: 0.0,
);
```

### State Fields

| Field | Type | Description |
|---|---|---|
| `pathT` | `double` | J-curve position interpolation factor (can overshoot `1.0`). |
| `sizeT` | `double` | Size interpolation (`linearToEaseOut`, `0.0` to `1.0`). |
| `currentDx` | `double` | Horizontal displacement for Blob B (`finalDx * pathT`). |
| `currentDy` | `double` | Vertical displacement for Blob B (`finalDy * pathT`). |
| `anchorScale` | `double` | Scale for Blob A (`1.0` → `0.0` over first 40% of travel). |
| `blend` | `double` | SDF metaball merge intensity (clamped to `[0, 28]`). |
| `containerScale`| `double` | Squeeze / stretch pulse factor on Blob B. |
| `phase` | `MorphPhase` | Current phase enum (`idle`, `detaching`, `travelling`, `arriving`, `settled`). |

---

## 4. `MorphSpeed` Profiles

Preserves the `ζ ≈ 0.73` underdamped spring ratio across all speeds:

| Value | Stiffness | Feel | Usage |
|---|---|---|---|
| `MorphSpeed.slow` | 60 | Deliberate & smooth | Walkthroughs, demonstrations |
| `MorphSpeed.normal`| 120 | iOS 26 native parity | **Default** for all UI menus & sheets |
| `MorphSpeed.fast` | 200 | Snappy & responsive | High-frequency tools / power users |
| `MorphSpeed.instant`| 500 | Single-frame swap | Reduced motion mode & headless tests |

---

## 5. Modal Sheet Morphing (`GlassModalSheet` + `GlassMorphTrigger`)

To morph a full modal sheet directly out of a button:

```dart
class SheetMorphExample extends StatelessWidget {
  const SheetMorphExample({super.key});

  @override
  Widget build(BuildContext context) {
    return GlassMorphTrigger(
      builder: (context, anchor) {
        return GlassButton(
          label: 'Open Details',
          onTap: () {
            GlassModalSheet.show(
              context: context,
              morphFrom: anchor, // Hands off the button geometry
              morphSpeed: MorphSpeed.normal,
              builder: (sheetContext) => const SheetContent(),
            );
          },
        );
      },
    );
  }
}
```
