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
            { 
              id: 'card-1', 
              title: 'Technology', 
              imageUrl: 'https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=280&h=160&fit=crop&q=80', 
              description: 'Latest tech news, gadgets, and innovations', 
              actionUrl: '#technology' 
            },
            { 
              id: 'card-2', 
              title: 'Sports', 
              imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=280&h=160&fit=crop&q=80', 
              description: 'Sports updates, results, and analysis', 
              actionUrl: '#sports' 
            },
            { 
              id: 'card-3', 
              title: 'Travel', 
              imageUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=280&h=160&fit=crop&q=80', 
              description: 'Travel guides, destinations, and tips', 
              actionUrl: '#travel' 
            },
            { 
              id: 'card-4', 
              title: 'Food & Cooking', 
              imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=280&h=160&fit=crop&q=80', 
              description: 'Recipes, restaurant reviews, and culinary trends', 
              actionUrl: '#food' 
            }
          ]
        })
      },
      {
        type: 'image_list',
        content: JSON.stringify({
          title: 'Featured Photography',
          images: [
            { 
              id: 'img-1', 
              url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&q=80', 
              caption: 'Majestic Mountain Landscape', 
              altText: 'Snow-capped mountain peaks against blue sky' 
            },
            { 
              id: 'img-2', 
              url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop&q=80', 
              caption: 'Modern City Architecture', 
              altText: 'Contemporary glass skyscrapers in downtown area' 
            },
            { 
              id: 'img-3', 
              url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop&q=80', 
              caption: 'Enchanted Forest Path', 
              altText: 'Sunlight filtering through tall trees on forest trail' 
            },
            { 
              id: 'img-4', 
              url: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400&h=300&fit=crop&q=80', 
              caption: 'Serene Lake Reflection', 
              altText: 'Crystal clear lake reflecting surrounding mountains' 
            },
            { 
              id: 'img-5', 
              url: 'https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?w=400&h=300&fit=crop&q=80', 
              caption: 'Golden Sunset Beach', 
              altText: 'Waves crashing on sandy beach during golden hour' 
            },
            { 
              id: 'img-6', 
              url: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=400&h=300&fit=crop&q=80', 
              caption: 'Vibrant Flower Garden', 
              altText: 'Colorful wildflowers blooming in spring meadow' 
            }
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
            { id: 'action-1', label: 'Create Widget', icon: 'plus', action: 'create', style: 'primary' },
            { id: 'action-2', label: 'View All', icon: 'list', action: 'view_all', style: 'secondary' },
            { id: 'action-3', label: 'Settings', icon: 'settings', action: 'settings', style: 'outline' },
            { id: 'action-4', label: 'Help', icon: 'help', url: '#help', style: 'ghost' },
            { id: 'action-5', label: 'Share', icon: 'share', action: 'share', style: 'secondary' },
            { id: 'action-6', label: 'Reports', icon: 'chart', action: 'reports', style: 'outline' }
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
