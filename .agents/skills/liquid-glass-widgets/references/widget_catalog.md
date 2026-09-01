# Liquid Glass Widgets: Component & API Catalog

Comprehensive reference for all widgets, controls, surfaces, and scopes provided by `liquid_glass_widgets`.

---

## 1. Surfaces & Navigation Chrome

The primary pattern of `liquid_glass_widgets` — floating navigation chrome over opaque or wallpaper content.

### `GlassScaffold`
The all-in-one root widget for screens using glass surfaces. Replaces manual assembly of `GlassPage` + `Scaffold` + `GlassScrollEdgeEffect` + `Stack`.

```dart
GlassScaffold(
  background: Image.asset('assets/wallpaper.jpg', fit: BoxFit.cover),
  statusBarStyle: GlassStatusBarStyle.auto,
  contentAwareBrightness: true,
  appBar: GlassAppBar(
    title: const Text('Messages'),
    trailing: GlassButton(
      icon: const Icon(CupertinoIcons.compose),
      onTap: () {},
    ),
  ),
  bottomBar: GlassTabBar.bottom(
    adaptiveBrightness: true,
    selectedIndex: _currentIndex,
    onTabSelected: (index) => setState(() => _currentIndex = index),
    tabs: const [
      GlassTab(icon: Icon(Icons.chat_bubble_outline), label: 'Chats'),
      GlassTab(icon: Icon(Icons.people_outline), label: 'Contacts'),
      GlassTab(icon: Icon(Icons.settings_outlined), label: 'Settings'),
    ],
  ),
  body: CustomScrollView(
    slivers: [
      SliverList(
        delegate: SliverChildBuilderDelegate(
          (context, index) => ListTile(title: Text('Item $index')),
          childCount: 50,
        ),
      ),
    ],
  ),
)
```

**Key Properties:**
- `background`: Optional background/wallpaper widget.
- `appBar`: Accepts a `GlassAppBar` or any preferred bar.
- `bottomBar`: Accepts `GlassTabBar.bottom`, `GlassTabBar.searchable`, etc.
- `statusBarStyle`: `GlassStatusBarStyle.auto`, `light`, `dark`, or `none`.
- `contentAwareBrightness`: Boolean to dynamically calculate bar brightness based on backdrop.
- `edgeToEdge`: Full-bleed drawing behind system bars.

---

### `GlassAppBar` & `GlassLargeTitle`
iOS 26-styled navigation bar with frosted glass background and smooth scroll collapsing.

```dart
GlassAppBar(
  title: const Text('Settings'),
  leading: GlassIconButton(
    icon: const Icon(Icons.arrow_back_ios_new),
    onTap: () => Navigator.pop(context),
  ),
  trailing: GlassButton(
    label: 'Done',
    onTap: () {},
  ),
)
```

---

### `GlassTabBar`
Available in multiple configurations:
1. `GlassTabBar.bottom(...)`: Floating glass bottom bar with magic-lens background isolation.
2. `GlassTabBar.inline(...)`: Floating segmented pill tab bar for sub-navigation.
3. `GlassTabBar.searchable(...)`: Bottom tab bar with integrated expanding search bar.
4. `GlassTabBar.minimizable(...)`: Collapses on scroll down to maximize screen estate.

```dart
GlassTabBar.searchable(
  selectedIndex: _tabIndex,
  onTabSelected: (i) => setState(() => _tabIndex = i),
  searchController: _searchController,
  onSearchSubmitted: (query) => handleSearch(query),
  tabs: const [
    GlassTab(icon: Icon(Icons.home), label: 'Home'),
    GlassTab(icon: Icon(Icons.explore), label: 'Explore'),
    GlassTab(icon: Icon(Icons.person), label: 'Profile'),
  ],
)
```

---

## 2. Containers & Platters

> **Golden Rule**: Use glass containers as platters beneath standard content, not as wrappers around other glass controls!

### `GlassCard`
The standard glass surface for grouping information.

```dart
GlassCard(
  padding: const EdgeInsets.all(16.0),
  quality: GlassQuality.standard,
  borderRadius: BorderRadius.circular(20),
  child: Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Text('Account Details', style: Theme.of(context).textTheme.titleMedium),
      const SizedBox(height: 8),
      Text('Manage your personal info and security settings.'),
    ],
  ),
)
```

### `GlassGroupedSection` & `GlassListTile`
iOS Settings-style glass section with dividers.

```dart
GlassGroupedSection(
  header: const Text('NOTIFICATIONS'),
  footer: const Text('Configure how alerts appear on your lock screen.'),
  children: [
    GlassListTile(
      leading: const Icon(Icons.notifications_active),
      title: const Text('Push Notifications'),
      trailing: GlassSwitch(value: true, onChanged: (v) {}),
    ),
    const GlassDivider(),
    GlassListTile(
      leading: const Icon(Icons.volume_up),
      title: const Text('Sound & Haptics'),
      trailing: const Icon(Icons.chevron_right),
      onTap: () {},
    ),
  ],
)
```

### `GlassContainer`
Low-level primitive for building custom glass components with bespoke borders, clipping, and padding.

---

## 3. Interactive Controls

Interactive controls provide their own frosted glass pill, specular highlights, and jelly-physics animations.

### `GlassButton` & `GlassIconButton`
```dart
GlassButton(
  label: 'Get Started',
  icon: const Icon(Icons.arrow_forward),
  style: GlassButtonStyle.prominent, // or .subtle, .frosted
  onTap: () => print('Pressed'),
)

GlassIconButton(
  icon: const Icon(Icons.bookmark_border),
  onTap: () {},
)
```

### `GlassSegmentedControl`
Interactive pill switcher with fluid indicator physics and jelly overshoots.

```dart
GlassSegmentedControl<int>(
  segments: const {
    0: Text('Day'),
    1: Text('Week'),
    2: Text('Month'),
    3: Text('Year'),
  },
  selectedValue: _selectedPeriod,
  onValueChanged: (val) => setState(() => _selectedPeriod = val),
)
```

### `GlassSwitch` & `GlassSlider`
```dart
GlassSwitch(
  value: _enabled,
  onChanged: (val) => setState(() => _enabled = val),
)

GlassSlider(
  value: _sliderVal,
  min: 0.0,
  max: 100.0,
  onChanged: (val) => setState(() => _sliderVal = val),
)
```

### `GlassChip` & `GlassBadge`
```dart
GlassChip(
  label: const Text('Featured'),
  selected: _isSelected,
  onSelected: (val) => setState(() => _isSelected = val),
)

GlassBadge(
  count: 3,
  child: const Icon(Icons.notifications),
)
```

---

## 4. Input Elements

Glass-styled text fields and inputs featuring interactive specular borders on focus.

### `GlassTextField`, `GlassPasswordField` & `GlassSearchBar`
```dart
GlassTextField(
  controller: _textController,
  hintText: 'Enter username',
  prefixIcon: const Icon(Icons.person),
)

GlassPasswordField(
  controller: _passwordController,
  hintText: 'Enter password',
)

GlassSearchBar(
  hintText: 'Search conversations...',
  onChanged: (query) => filterResults(query),
)
```

---

## 5. Overlays & Sheets

### `GlassMenu`
Liquid-morphing popup menu that bursts out of its trigger with teardrop metaball physics.

```dart
GlassMenu(
  trigger: GlassIconButton(icon: const Icon(Icons.more_horiz)),
  alignment: GlassMenuAlignment.bottomTrailing,
  items: [
    GlassMenuItem(
      label: 'Edit Profile',
      icon: Icons.edit,
      onTap: () {},
    ),
    GlassMenuItem(
      label: 'Share',
      icon: Icons.share,
      onTap: () {},
    ),
    const GlassMenuDivider(),
    GlassMenuItem(
      label: 'Delete',
      icon: Icons.delete,
      isDestructive: true,
      onTap: () {},
    ),
  ],
)
```

### `GlassModalSheet`
Morphable or slide-up bottom sheet with detent points (peek, half, full).

```dart
// Standard presentation
GlassModalSheet.show(
  context: context,
  initialState: GlassSheetState.half,
  detents: const {
    GlassSheetDetent.peek(90),
    GlassSheetDetent.half(0.45),
    GlassSheetDetent.full(),
  },
  builder: (context) => const SheetContents(),
);

// Liquid morph presentation from trigger
GlassModalSheet.show(
  context: context,
  morphFrom: myMorphAnchor,
  builder: (context) => const SheetContents(),
);
```

### `GlassDialog` & `showGlassActionSheet`
```dart
showGlassDialog(
  context: context,
  title: const Text('Confirm Action'),
  content: const Text('Are you sure you want to proceed?'),
  actions: [
    GlassDialogAction(
      title: 'Cancel',
      onPressed: () => Navigator.pop(context),
    ),
    GlassDialogAction(
      title: 'Confirm',
      isPrimary: true,
      onPressed: () => handleConfirm(),
    ),
  ],
);
```

---

## 6. Effects & Scopes

### `ProgressiveBlur`
Graduated backdrop blur that dissolves smoothly from strong blur to sharp transparency.

```dart
ProgressiveBlur(
  maxSigma: 20.0,
  direction: ProgressiveBlurDirection.topToBottom,
)
```

### `GlassMotionScope`
Drives specular highlight lighting from streams such as device gyroscope.

```dart
GlassMotionScope(
  stream: gyroscopeEvents.map((event) => event.y * 0.5),
  child: const MyApp(),
)
```
