import { WidgetRepository } from '../../domain/repositories/WidgetRepository';
import { WidgetDescriptorRepository } from '../../domain/repositories/WidgetDescriptorRepository';
import { Widget } from '../../models/widget';
import { WidgetId } from '../../domain/entities/value-objects/WidgetId';
import { WidgetType } from '../../domain/entities/value-objects/WidgetType';
import { WidgetContent } from '../../domain/entities/value-objects/WidgetContent';
import { WidgetDescriptor } from '../../domain/entities/WidgetDescriptor';
import { ContentType } from '../../domain/entities/value-objects/ContentType';

export class DummyDataService {
  constructor(
    private readonly widgetRepository: WidgetRepository,
    private readonly widgetDescriptorRepository: WidgetDescriptorRepository
  ) {}

  async loadDummyData(): Promise<void> {
    console.log('🎭 Loading dummy data...');

    const dummyWidgets = [
      {
        type: 'text_block',
        content: JSON.stringify({
          title: 'Welcome to Widget Feed',
          text: 'This is a sample text block widget showcasing the text display functionality.',
          style: 'primary'
        })
      },
      {
        type: 'expandable_list',
        content: JSON.stringify({
          title: 'Features List',
          items: [
            { title: 'Real-time Updates', description: 'Widgets update in real-time' },
            { title: 'Multiple Types', description: 'Support for various widget types' },
            { title: 'Responsive Design', description: 'Works on all screen sizes' },
            { title: 'Easy Integration', description: 'Simple API for integration' }
          ],
          expanded: false
        })
      },
      {
        type: 'horizontal_cards',
        content: JSON.stringify({
          title: 'Popular Categories',
          cards: [
            { id: 'card-1', title: 'Technology', imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=150&h=100&fit=crop', description: 'Latest tech news', actionUrl: '#' },
            { id: 'card-2', title: 'Sports', imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=150&h=100&fit=crop', description: 'Sports updates', actionUrl: '#' },
            { id: 'card-3', title: 'Entertainment', imageUrl: 'https://images.unsplash.com/photo-1489599510025-c4625c9e3e0e?w=150&h=100&fit=crop', description: 'Entertainment news', actionUrl: '#' },
            { id: 'card-4', title: 'Business', imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&h=100&fit=crop', description: 'Business insights', actionUrl: '#' }
          ]
        })
      },
      {
        type: 'image_list',
        content: JSON.stringify({
          title: 'Gallery',
          images: [
            { id: 'img-1', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop', caption: 'Beautiful Nature', altText: 'Nature landscape' },
            { id: 'img-2', url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=200&fit=crop', caption: 'City Architecture', altText: 'Urban architecture' },
            { id: 'img-3', url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=200&fit=crop', caption: 'Abstract Art', altText: 'Abstract composition' }
          ],
          layout: 'grid'
        })
      },
      {
        type: 'highlight_banner',
        content: JSON.stringify({
          title: 'Special Announcement',
          message: 'Welcome to our new Widget Feed application! Explore different widget types.',
          type: 'info',
          dismissible: true,
          action: {
            label: 'Learn More',
            url: '#'
          }
        })
      },
      {
        type: 'quick_actions',
        content: JSON.stringify({
          title: 'Quick Actions',
          actions: [
            { label: 'Create Widget', icon: 'plus', action: 'create' },
            { label: 'View All', icon: 'list', action: 'view_all' },
            { label: 'Settings', icon: 'settings', action: 'settings' },
            { label: 'Help', icon: 'help', action: 'help' }
          ],
          layout: 'grid'
        })
      },
      {
        type: 'text_block',
        content: JSON.stringify({
          title: 'Getting Started',
          text: 'Start exploring the widget feed by creating your own widgets or browsing existing ones.',
          style: 'secondary'
        })
      },
      {
        type: 'expandable_list',
        content: JSON.stringify({
          title: 'Recent Updates',
          items: [
            { title: 'Version 1.0 Released', description: 'Initial release with core functionality' },
            { title: 'PostgreSQL Support Removed', description: 'Simplified to use in-memory storage' },
            { title: 'PRD Widget Types', description: 'Implemented PRD-compliant widget types' }
          ],
          expanded: true
        })
      }
    ];

    let loadedCount = 0;
    for (const widgetData of dummyWidgets) {
      try {
        // Create legacy widget
        const widget = Widget.create(
          WidgetId.generate(),
          WidgetType.create(widgetData.type),
          WidgetContent.create(widgetData.content),
          new Date(Date.now() - (loadedCount * 60000)) // Stagger timestamps by 1 minute
        );

        await this.widgetRepository.save(widget);

        // Create PRD WidgetDescriptor for the same data
        const widgetDescriptor = WidgetDescriptor.createStatic({
          id: WidgetId.generate(), // Different ID for PRD system
          widgetType: WidgetType.create(widgetData.type),
          contentType: ContentType.create('static'),
          staticContent: JSON.parse(widgetData.content) // Parse JSON content for PRD system
        });

        await this.widgetDescriptorRepository.save(widgetDescriptor);
        loadedCount++;
      } catch (error) {
        console.error(`❌ Failed to create dummy widget of type ${widgetData.type}:`, error);
      }
    }

    console.log(`✅ Successfully loaded ${loadedCount} dummy widgets in both legacy and PRD systems`);
  }

  async clearData(): Promise<void> {
    console.log('🧹 Clearing all data...');
    // Note: This assumes InMemoryWidgetRepository has a clear method
    if ('clear' in this.widgetRepository) {
      (this.widgetRepository as any).clear();
      console.log('✅ All data cleared');
    } else {
      console.log('⚠️  Repository does not support clearing data');
    }
  }
}
