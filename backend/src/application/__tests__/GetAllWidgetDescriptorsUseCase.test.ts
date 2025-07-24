import { GetAllWidgetDescriptorsUseCase } from '../GetAllWidgetDescriptorsUseCase';
import { InMemoryWidgetDescriptorRepository } from '../../infrastructure/repositories/InMemoryWidgetDescriptorRepository';
import { WidgetDescriptor } from '../../domain/entities/WidgetDescriptor';
import { WidgetType } from '../../domain/entities/value-objects/WidgetType';
import { ContentType } from '../../domain/entities/value-objects/ContentType';
import { LoadingState } from '../../domain/entities/value-objects/LoadingState';
import { ErrorState } from '../../domain/entities/value-objects/ErrorState';
import { WidgetId } from '../../domain/entities/value-objects/WidgetId';

describe('GetAllWidgetDescriptorsUseCase', () => {
  let useCase: GetAllWidgetDescriptorsUseCase;
  let repository: InMemoryWidgetDescriptorRepository;

  beforeEach(() => {
    repository = new InMemoryWidgetDescriptorRepository();
    useCase = new GetAllWidgetDescriptorsUseCase(repository);
  });

  describe('when getting all widget descriptors', () => {
    it('should return all widget descriptors successfully', async () => {
      // Arrange
      const widgetDescriptor1 = WidgetDescriptor.createDynamic({
        id: WidgetId.generate(),
        widgetType: WidgetType.create('expandable_list'),
        contentType: ContentType.create('dynamic'),
        dataUrl: 'https://api.tasks.com/list',
        loadingState: LoadingState.create('skeleton'),
        errorState: ErrorState.create('retry')
      });

      const widgetDescriptor2 = WidgetDescriptor.createDynamic({
        id: WidgetId.generate(),
        widgetType: WidgetType.create('horizontal_cards'),
        contentType: ContentType.create('dynamic'),
        dataUrl: 'https://api.products.com/featured',
        loadingState: LoadingState.create('skeleton'),
        errorState: ErrorState.create('message')
      });

      await repository.save(widgetDescriptor1);
      await repository.save(widgetDescriptor2);

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result.isSuccess()).toBe(true);
      expect(result.getValue()).toHaveLength(2);
      
      const descriptors = result.getValue();
      // Repository returns in insertion order (first saved, first returned)
      expect(descriptors[0].getId()).toBe(widgetDescriptor1.getId());
      expect(descriptors[1].getId()).toBe(widgetDescriptor2.getId());
    });

    it('should return empty array when no widget descriptors exist', async () => {
      // Act
      const result = await useCase.execute();

      // Assert
      expect(result.isSuccess()).toBe(true);
      expect(result.getValue()).toEqual([]);
    });

    it('should handle repository errors gracefully', async () => {
      // Arrange
      const errorRepository = {
        findAll: jest.fn().mockRejectedValue(new Error('Database connection failed'))
      } as any;
      const errorUseCase = new GetAllWidgetDescriptorsUseCase(errorRepository);

      // Act
      const result = await errorUseCase.execute();

      // Assert
      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toBe('Failed to retrieve widget descriptors');
    });

    it('should return widget descriptors in insertion order', async () => {
      // Arrange
      const firstDescriptor = WidgetDescriptor.createDynamic({
        id: WidgetId.generate(),
        widgetType: WidgetType.create('image_list'),
        contentType: ContentType.create('dynamic'),
        dataUrl: 'https://api.gallery.com/images',
        loadingState: LoadingState.create('skeleton'),
        errorState: ErrorState.create('hidden')
      });

      // Wait a moment to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 10));

      const secondDescriptor = WidgetDescriptor.createStatic({
        id: WidgetId.generate(),
        widgetType: WidgetType.create('text_block'),
        contentType: ContentType.create('static'),
        staticContent: { content: 'Welcome message', style: 'primary' }
      });

      await repository.save(firstDescriptor);
      await repository.save(secondDescriptor);

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result.isSuccess()).toBe(true);
      const descriptors = result.getValue();
      expect(descriptors).toHaveLength(2);
      // Repository returns in insertion order (first saved, first returned)
      expect(descriptors[0].getId()).toBe(firstDescriptor.getId());
      expect(descriptors[1].getId()).toBe(secondDescriptor.getId());
    });

    it('should return all 6 widget types when present', async () => {
      // Arrange
      const widgetTypes = [
        'expandable_list',
        'horizontal_cards',
        'image_list',
        'text_block',
        'highlight_banner',
        'quick_actions'
      ] as const;

      const descriptors = widgetTypes.map((type, index) => {
        if (index % 2 === 0) {
          return WidgetDescriptor.createStatic({
            id: WidgetId.generate(),
            widgetType: WidgetType.create(type),
            contentType: ContentType.create('static'),
            staticContent: { data: `${type} data` }
          });
        } else {
          return WidgetDescriptor.createDynamic({
            id: WidgetId.generate(),
            widgetType: WidgetType.create(type),
            contentType: ContentType.create('dynamic'),
            dataUrl: `https://api.${type}.com/data`,
            loadingState: LoadingState.create('skeleton'),
            errorState: ErrorState.create('retry')
          });
        }
      });

      for (const descriptor of descriptors) {
        await repository.save(descriptor);
      }

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result.isSuccess()).toBe(true);
      const retrievedDescriptors = result.getValue();
      expect(retrievedDescriptors).toHaveLength(6);
      
      const retrievedTypes = retrievedDescriptors.map((d: WidgetDescriptor) => d.getWidgetType().getValue());
      widgetTypes.forEach(type => {
        expect(retrievedTypes).toContain(type);
      });
    });
  });
});
