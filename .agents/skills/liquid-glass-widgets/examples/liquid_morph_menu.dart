import 'package:flutter/material.dart';
import 'package:liquid_glass_widgets/liquid_glass_widgets.dart';

class LiquidMorphMenuDemo extends StatelessWidget {
  const LiquidMorphMenuDemo({super.key});

  @override
  Widget build(BuildContext context) {
    return GlassScaffold(
      background: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [Color(0xFF4A00E0), Color(0xFF8E2DE2)],
          ),
        ),
      ),
      appBar: GlassAppBar(
        title: const Text('Liquid Morph Menu'),
        trailing: GlassMenu(
          alignment: GlassMenuAlignment.bottomTrailing,
          trigger: GlassIconButton(
            icon: const Icon(Icons.more_vert),
            onTap: () {},
          ),
          items: [
            GlassMenuItem(
              label: 'Edit Profile',
              icon: Icons.edit_outlined,
              onTap: () => debugPrint('Edit tapped'),
            ),
            GlassMenuItem(
              label: 'Share Collection',
              icon: Icons.share_outlined,
              onTap: () => debugPrint('Share tapped'),
            ),
            GlassMenuItem(
              label: 'Download Offline',
              icon: Icons.cloud_download_outlined,
              onTap: () => debugPrint('Download tapped'),
            ),
            const GlassMenuDivider(),
            GlassMenuItem(
              label: 'Delete Item',
              icon: Icons.delete_outline,
              isDestructive: true,
              onTap: () => debugPrint('Delete tapped'),
            ),
          ],
        ),
      ),
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.touch_app, size: 48, color: Colors.white70),
            const SizedBox(height: 12),
            const Text(
              'Tap the top-right menu button',
              style: TextStyle(color: Colors.white, fontSize: 18),
            ),
            const SizedBox(height: 8),
            Text(
              'Watch the liquid teardrop morphing physics unfold.',
              style: TextStyle(color: Colors.white.withValues(alpha: 0.7)),
            ),
          ],
        ),
      ),
    );
  }
}
