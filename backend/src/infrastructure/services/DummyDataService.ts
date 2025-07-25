import { WidgetRepository } from '../../domain/repositories/WidgetRepository';
import { Widget } from '../../models/widget';
import { WidgetId } from '../../domain/entities/value-objects/WidgetId';
import { WidgetType } from '../../domain/entities/value-objects/WidgetType';
import { WidgetContent } from '../../domain/entities/value-objects/WidgetContent';

export class DummyDataService {
  constructor(private readonly widgetRepository: WidgetRepository) {}

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
            { title: 'Technology', image: 'https://via.placeholder.com/150x100', description: 'Latest tech news' },
            { title: 'Sports', image: 'https://via.placeholder.com/150x100', description: 'Sports updates' },
            { title: 'Entertainment', image: 'https://via.placeholder.com/150x100', description: 'Entertainment news' },
            { title: 'Business', image: 'https://via.placeholder.com/150x100', description: 'Business insights' }
          ]
        })
      },
      {
        type: 'image_list',
        content: JSON.stringify({
          title: 'Gallery',
          images: [
            { url: 'https://via.placeholder.com/300x200', caption: 'Sample Image 1', alt: 'Placeholder 1' },
            { url: 'https://via.placeholder.com/300x200', caption: 'Sample Image 2', alt: 'Placeholder 2' },
            { url: 'https://via.placeholder.com/300x200', caption: 'Sample Image 3', alt: 'Placeholder 3' }
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
        const widget = Widget.create(
          WidgetId.generate(),
          WidgetType.create(widgetData.type),
          WidgetContent.create(widgetData.content),
          new Date(Date.now() - (loadedCount * 60000)) // Stagger timestamps by 1 minute
        );

        await this.widgetRepository.save(widget);
        loadedCount++;
      } catch (error) {
        console.error(`❌ Failed to create dummy widget of type ${widgetData.type}:`, error);
      }
    }

    console.log(`✅ Successfully loaded ${loadedCount} dummy widgets`);
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
