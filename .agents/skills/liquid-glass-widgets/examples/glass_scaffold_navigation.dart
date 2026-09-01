import 'package:flutter/material.dart';
import 'package:liquid_glass_widgets/liquid_glass_widgets.dart';

class GlassNavigationScreen extends StatefulWidget {
  const GlassNavigationScreen({super.key});

  @override
  State<GlassNavigationScreen> createState() => _GlassNavigationScreenState();
}

class _GlassNavigationScreenState extends State<GlassNavigationScreen> {
  int _selectedTab = 0;
  final TextEditingController _searchController = TextEditingController();

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GlassScaffold(
      // 1. Wallpaper background for glass refraction
      background: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Color(0xFF0F2027), Color(0xFF203A43), Color(0xFF2C5364)],
          ),
        ),
      ),
      // 2. Automatically adjusts status bar and app bar brightness based on backdrop
      contentAwareBrightness: true,
      statusBarStyle: GlassStatusBarStyle.auto,
      appBar: GlassAppBar(
        title: const Text('Discover'),
        trailing: GlassIconButton(
          icon: const Icon(Icons.notifications_none),
          onTap: () {},
        ),
      ),
      // 3. Floating bottom tab bar with dynamic search integration
      bottomBar: GlassTabBar.searchable(
        selectedIndex: _selectedTab,
        onTabSelected: (index) => setState(() => _selectedTab = index),
        searchController: _searchController,
        onSearchSubmitted: (query) => debugPrint('Searching for $query'),
        tabs: const [
          GlassTab(icon: Icon(Icons.home_outlined), label: 'Home'),
          GlassTab(icon: Icon(Icons.grid_view_outlined), label: 'Explore'),
          GlassTab(icon: Icon(Icons.bookmark_outline), label: 'Saved'),
          GlassTab(icon: Icon(Icons.person_outline), label: 'Profile'),
        ],
      ),
      body: CustomScrollView(
        slivers: [
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Featured Stories',
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                        ),
                  ),
                  const SizedBox(height: 12),
                  // Glass card platter holding standard opaque content
                  GlassCard(
                    padding: const EdgeInsets.all(16.0),
                    child: Row(
                      children: [
                        Container(
                          width: 60,
                          height: 60,
                          decoration: BoxDecoration(
                            color: Colors.white24,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Icon(Icons.newspaper, color: Colors.white),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Apple Unveils Liquid Glass',
                                style: Theme.of(context)
                                    .textTheme
                                    .titleMedium
                                    ?.copyWith(
                                      color: Colors.white,
                                      fontWeight: FontWeight.w600,
                                    ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                'Next-generation physics and shaders...',
                                style: TextStyle(
                                  color: Colors.white.withValues(alpha: 0.7),
                                  fontSize: 13,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          SliverList(
            delegate: SliverChildBuilderDelegate(
              (context, index) => Container(
                margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.black.withValues(alpha: 0.25),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Text(
                  'Feed Story #$index',
                  style: const TextStyle(color: Colors.white),
                ),
              ),
              childCount: 30,
            ),
          ),
        ],
      ),
    );
  }
}
