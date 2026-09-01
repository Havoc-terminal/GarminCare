import 'package:flutter/material.dart';
import 'package:liquid_glass_widgets/liquid_glass_widgets.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // 1. Initialize and pre-warm shader programs (zero draw calls, async disk-to-RAM)
  await LiquidGlassWidgets.initialize();

  // 2. Wrap app with global theme and accessibility bridging
  runApp(LiquidGlassWidgets.wrap(
    brightnessResolver: Theme.maybeBrightnessOf, // Required for MaterialApp
    adaptiveQuality: true,
    theme: GlassThemeData.simple(
      blur: 12.0,
      thickness: 30.0,
      quality: GlassQuality.standard,
    ),
    child: const QuickStartApp(),
  ));
}

class QuickStartApp extends StatelessWidget {
  const QuickStartApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.light,
        colorSchemeSeed: Colors.blue,
      ),
      darkTheme: ThemeData(
        brightness: Brightness.dark,
        colorSchemeSeed: Colors.blue,
      ),
      home: const HomeScreen(),
    );
  }
}

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return GlassScaffold(
      // High-contrast wallpaper provides backdrop for refraction
      background: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [Color(0xFF1D2671), Color(0xFFC33764)],
          ),
        ),
      ),
      appBar: const GlassAppBar(
        title: Text('Liquid Glass Demo'),
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0),
          child: GlassCard(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.auto_awesome, size: 48, color: Colors.white),
                const SizedBox(height: 16),
                Text(
                  'iOS 26 Liquid Glass',
                  style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Real shader-based blur, specular lighting, and physics-driven morphing in Flutter.',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: Colors.white.withValues(alpha: 0.85)),
                ),
                const SizedBox(height: 24),
                GlassButton(
                  label: 'Get Started',
                  icon: const Icon(Icons.arrow_forward),
                  onTap: () {},
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
