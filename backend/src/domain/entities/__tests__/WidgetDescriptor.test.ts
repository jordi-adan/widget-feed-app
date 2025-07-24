import { WidgetDescriptor } from '../WidgetDescriptor';
import { WidgetType } from '../value-objects/WidgetType';
import { ContentType } from '../value-objects/ContentType';
import { LoadingState } from '../value-objects/LoadingState';
import { ErrorState } from '../value-objects/ErrorState';
import { WidgetId } from '../value-objects/WidgetId';

describe('WidgetDescriptor Entity', () => {
  describe('when creating a static widget descriptor', () => {
    it('should create a static widget descriptor successfully', () => {
      // Arrange
      const id = WidgetId.create('550e8400-e29b-41d4-a716-446655440001');
      const widgetType = WidgetType.create('text_block');
      const contentType = ContentType.create('static');
      const staticContent = { text: 'Hello World', style: 'primary' };

      // Act
      const descriptor = WidgetDescriptor.createStatic({
        id,
        widgetType,
        contentType,
        staticContent
      });

      // Assert
      expect(descriptor.getId()).toBe(id);
      expect(descriptor.getWidgetType()).toBe(widgetType);
      expect(descriptor.getContentType()).toBe(contentType);
      expect(descriptor.getStaticContent()).toEqual(staticContent);
      expect(descriptor.isStatic()).toBe(true);
      expect(descriptor.isDynamic()).toBe(false);
    });

    it('should throw error when creating static widget with dynamic content type', () => {
      // Arrange
      const id = WidgetId.create('550e8400-e29b-41d4-a716-446655440002');
      const widgetType = WidgetType.create('text_block');
      const contentType = ContentType.create('dynamic');
      const staticContent = { text: 'Hello World' };

      // Act & Assert
      expect(() => WidgetDescriptor.createStatic({
        id,
        widgetType,
        contentType,
        staticContent
      })).toThrow('Cannot create static widget descriptor with dynamic content type');
    });
  });

  describe('when creating a dynamic widget descriptor', () => {
    it('should create a dynamic widget descriptor successfully', () => {
      // Arrange
      const id = WidgetId.create('550e8400-e29b-41d4-a716-446655440003');
      const widgetType = WidgetType.create('horizontal_cards');
      const contentType = ContentType.create('dynamic');
      const dataUrl = 'https://api.example.com/cards';
      const loadingState = LoadingState.create('skeleton');
      const errorState = ErrorState.create('retry');

      // Act
      const descriptor = WidgetDescriptor.createDynamic({
        id,
        widgetType,
        contentType,
        dataUrl,
        loadingState,
        errorState
      });

      // Assert
      expect(descriptor.getId()).toBe(id);
      expect(descriptor.getWidgetType()).toBe(widgetType);
      expect(descriptor.getContentType()).toBe(contentType);
      expect(descriptor.getDataUrl()).toBe(dataUrl);
      expect(descriptor.getLoadingState()).toBe(loadingState);
      expect(descriptor.getErrorState()).toBe(errorState);
      expect(descriptor.isDynamic()).toBe(true);
      expect(descriptor.isStatic()).toBe(false);
    });

    it('should throw error when creating dynamic widget with static content type', () => {
      // Arrange
      const id = WidgetId.create('550e8400-e29b-41d4-a716-446655440004');
      const widgetType = WidgetType.create('horizontal_cards');
      const contentType = ContentType.create('static');
      const dataUrl = 'https://api.example.com/cards';
      const loadingState = LoadingState.create('skeleton');
      const errorState = ErrorState.create('retry');

      // Act & Assert
      expect(() => WidgetDescriptor.createDynamic({
        id,
        widgetType,
        contentType,
        dataUrl,
        loadingState,
        errorState
      })).toThrow('Cannot create dynamic widget descriptor with static content type');
    });

    it('should throw error when creating dynamic widget with invalid data URL', () => {
      // Arrange
      const id = WidgetId.create('550e8400-e29b-41d4-a716-446655440005');
      const widgetType = WidgetType.create('horizontal_cards');
      const contentType = ContentType.create('dynamic');
      const dataUrl = '';
      const loadingState = LoadingState.create('skeleton');
      const errorState = ErrorState.create('retry');

      // Act & Assert
      expect(() => WidgetDescriptor.createDynamic({
        id,
        widgetType,
        contentType,
        dataUrl,
        loadingState,
        errorState
      })).toThrow('Data URL cannot be empty for dynamic widgets');
    });
  });

  describe('when checking widget capabilities', () => {
    it('should identify expandable widgets correctly', () => {
      // Arrange
      const expandableWidget = WidgetDescriptor.createStatic({
        id: WidgetId.create('550e8400-e29b-41d4-a716-446655440006'),
        widgetType: WidgetType.create('expandable_list'),
        contentType: ContentType.create('static'),
        staticContent: { items: [] }
      });

      const nonExpandableWidget = WidgetDescriptor.createStatic({
        id: WidgetId.create('550e8400-e29b-41d4-a716-446655440007'),
        widgetType: WidgetType.create('text_block'),
        contentType: ContentType.create('static'),
        staticContent: { text: 'Hello' }
      });

      // Act & Assert
      expect(expandableWidget.isExpandable()).toBe(true);
      expect(nonExpandableWidget.isExpandable()).toBe(false);
    });

    it('should identify interactive widgets correctly', () => {
      // Arrange
      const interactiveWidget = WidgetDescriptor.createStatic({
        id: WidgetId.create('550e8400-e29b-41d4-a716-446655440008'),
        widgetType: WidgetType.create('quick_actions'),
        contentType: ContentType.create('static'),
        staticContent: { actions: [] }
      });

      const nonInteractiveWidget = WidgetDescriptor.createStatic({
        id: WidgetId.create('550e8400-e29b-41d4-a716-446655440009'),
        widgetType: WidgetType.create('text_block'),
        contentType: ContentType.create('static'),
        staticContent: { text: 'Hello' }
      });

      // Act & Assert
      expect(interactiveWidget.isInteractive()).toBe(true);
      expect(nonInteractiveWidget.isInteractive()).toBe(false);
    });
  });

  describe('when updating widget descriptor', () => {
    it('should update static content for static widgets', () => {
      // Arrange
      const descriptor = WidgetDescriptor.createStatic({
        id: WidgetId.create('550e8400-e29b-41d4-a716-446655440010'),
        widgetType: WidgetType.create('text_block'),
        contentType: ContentType.create('static'),
        staticContent: { text: 'Original' }
      });

      const newContent = { text: 'Updated', style: 'secondary' };

      // Act
      const updatedDescriptor = descriptor.updateStaticContent(newContent);

      // Assert
      expect(updatedDescriptor.getStaticContent()).toEqual(newContent);
      expect(updatedDescriptor.getId()).toBe(descriptor.getId());
      expect(updatedDescriptor).not.toBe(descriptor); // Immutable
    });

    it('should throw error when trying to update static content on dynamic widget', () => {
      // Arrange
      const descriptor = WidgetDescriptor.createDynamic({
        id: WidgetId.create('550e8400-e29b-41d4-a716-446655440011'),
        widgetType: WidgetType.create('horizontal_cards'),
        contentType: ContentType.create('dynamic'),
        dataUrl: 'https://api.example.com/cards',
        loadingState: LoadingState.create('skeleton'),
        errorState: ErrorState.create('retry')
      });

      // Act & Assert
      expect(() => descriptor.updateStaticContent({ text: 'New' }))
        .toThrow('Cannot update static content on dynamic widget');
    });
  });

  describe('when comparing widget descriptors', () => {
    it('should return true for same widget descriptors', () => {
      // Arrange
      const id = WidgetId.create('550e8400-e29b-41d4-a716-446655440012');
      const descriptor1 = WidgetDescriptor.createStatic({
        id,
        widgetType: WidgetType.create('text_block'),
        contentType: ContentType.create('static'),
        staticContent: { text: 'Hello' }
      });

      const descriptor2 = WidgetDescriptor.createStatic({
        id,
        widgetType: WidgetType.create('text_block'),
        contentType: ContentType.create('static'),
        staticContent: { text: 'Hello' }
      });

      // Act & Assert
      expect(descriptor1.equals(descriptor2)).toBe(true);
    });

    it('should return false for different widget descriptors', () => {
      // Arrange
      const descriptor1 = WidgetDescriptor.createStatic({
        id: WidgetId.create('550e8400-e29b-41d4-a716-446655440013'),
        widgetType: WidgetType.create('text_block'),
        contentType: ContentType.create('static'),
        staticContent: { text: 'Hello' }
      });

      const descriptor2 = WidgetDescriptor.createStatic({
        id: WidgetId.create('550e8400-e29b-41d4-a716-446655440014'),
        widgetType: WidgetType.create('highlight_banner'),
        contentType: ContentType.create('static'),
        staticContent: { text: 'Banner' }
      });

      // Act & Assert
      expect(descriptor1.equals(descriptor2)).toBe(false);
    });
  });
});
