import 'package:flutter/material.dart';
import 'package:liquid_glass_widgets/liquid_glass_widgets.dart';

class GlassModalSheetDemo extends StatelessWidget {
  const GlassModalSheetDemo({super.key});

  @override
  Widget build(BuildContext context) {
    return GlassScaffold(
      background: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topRight,
            end: Alignment.bottomLeft,
            colors: [Color(0xFF141E30), Color(0xFF243B55)],
          ),
        ),
      ),
      appBar: const GlassAppBar(
        title: Text('Liquid Morph Sheet'),
      ),
      body: Center(
        child: GlassMorphTrigger(
          builder: (context, anchor) {
            return GlassButton(
              label: 'View Order Details',
              icon: const Icon(Icons.receipt_long),
              onTap: () {
                // Morphs directly from this button into the bottom sheet
                GlassModalSheet.show(
                  context: context,
                  morphFrom: anchor,
                  initialState: GlassSheetState.half,
                  detents: const {
                    GlassSheetDetent.peek(100),
                    GlassSheetDetent.half(0.45),
                    GlassSheetDetent.full(),
                  },
                  builder: (sheetContext) => const OrderDetailsSheetContent(),
                );
              },
            );
          },
        ),
      ),
    );
  }
}

class OrderDetailsSheetContent extends StatelessWidget {
  const OrderDetailsSheetContent({super.key});

  @override
  Widget build(BuildContext context) {
    // 1. Sync internal scrolling with the sheet dragging physics
    final scrollData = ScrollControllerProvider.of(context);

    // 2. Read reactive expansion progress (0.0 to 1.0)
    final sheetState = GlassModalSheetStateProvider.of(context);
    final progress = sheetState?.progress ?? 0.0;

    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Order Summary',
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
              ),
              Opacity(
                opacity: progress.clamp(0.0, 1.0),
                child: IconButton(
                  icon: const Icon(Icons.close),
                  onPressed: () => Navigator.pop(context),
                ),
              ),
            ],
          ),
        ),
        const Divider(),
        Expanded(
          child: ListView.builder(
            controller: scrollData?.controller,
            physics: scrollData?.physics,
            itemCount: 20,
            itemBuilder: (context, index) => ListTile(
              leading: CircleAvatar(
                backgroundColor: Colors.blueAccent.withValues(alpha: 0.2),
                child: Text('#$index'),
              ),
              title: Text('Item Number $index'),
              subtitle: const Text('Delivered via Priority Logistics'),
              trailing: const Text('\$49.99'),
            ),
          ),
        ),
      ],
    );
  }
}
