import { PrdWidgetType } from '../PrdWidgetType';

describe('PrdWidgetType Value Object', () => {
  describe('when creating a valid PRD widget type', () => {
    it('should create expandable_list widget type', () => {
      // Act
      const widgetType = PrdWidgetType.create('expandable_list');

      // Assert
      expect(widgetType.getValue()).toBe('expandable_list');
      expect(widgetType.isExpandableList()).toBe(true);
      expect(widgetType.isHorizontalCards()).toBe(false);
    });

    it('should create horizontal_cards widget type', () => {
      // Act
      const widgetType = PrdWidgetType.create('horizontal_cards');

      // Assert
      expect(widgetType.getValue()).toBe('horizontal_cards');
      expect(widgetType.isHorizontalCards()).toBe(true);
      expect(widgetType.isExpandableList()).toBe(false);
    });

    it('should create image_list widget type', () => {
      // Act
      const widgetType = PrdWidgetType.create('image_list');

      // Assert
      expect(widgetType.getValue()).toBe('image_list');
      expect(widgetType.isImageList()).toBe(true);
    });

    it('should create text_block widget type', () => {
      // Act
      const widgetType = PrdWidgetType.create('text_block');

      // Assert
      expect(widgetType.getValue()).toBe('text_block');
      expect(widgetType.isTextBlock()).toBe(true);
    });

    it('should create highlight_banner widget type', () => {
      // Act
      const widgetType = PrdWidgetType.create('highlight_banner');

      // Assert
      expect(widgetType.getValue()).toBe('highlight_banner');
      expect(widgetType.isHighlightBanner()).toBe(true);
    });

    it('should create quick_actions widget type', () => {
      // Act
      const widgetType = PrdWidgetType.create('quick_actions');

      // Assert
      expect(widgetType.getValue()).toBe('quick_actions');
      expect(widgetType.isQuickActions()).toBe(true);
    });
  });

  describe('when creating an invalid widget type', () => {
    it('should throw error for empty string', () => {
      // Act & Assert
      expect(() => PrdWidgetType.create('')).toThrow('PrdWidgetType cannot be empty');
    });

    it('should throw error for whitespace only', () => {
      // Act & Assert
      expect(() => PrdWidgetType.create('   ')).toThrow('PrdWidgetType cannot be empty');
    });

    it('should throw error for invalid widget type', () => {
      // Act & Assert
      expect(() => PrdWidgetType.create('invalid_type')).toThrow(
        'Invalid PRD widget type: invalid_type. Valid types are: expandable_list, horizontal_cards, image_list, text_block, highlight_banner, quick_actions'
      );
    });

    it('should throw error for null or undefined', () => {
      // Act & Assert
      expect(() => PrdWidgetType.create(null as any)).toThrow('PrdWidgetType cannot be empty');
      expect(() => PrdWidgetType.create(undefined as any)).toThrow('PrdWidgetType cannot be empty');
    });
  });

  describe('when checking equality', () => {
    it('should return true for same widget types', () => {
      // Arrange
      const widgetType1 = PrdWidgetType.create('expandable_list');
      const widgetType2 = PrdWidgetType.create('expandable_list');

      // Act & Assert
      expect(widgetType1.equals(widgetType2)).toBe(true);
    });

    it('should return false for different widget types', () => {
      // Arrange
      const widgetType1 = PrdWidgetType.create('expandable_list');
      const widgetType2 = PrdWidgetType.create('horizontal_cards');

      // Act & Assert
      expect(widgetType1.equals(widgetType2)).toBe(false);
    });
  });

  describe('when checking all type methods', () => {
    it('should have correct boolean values for each type', () => {
      const typeChecks = [
        { 
          type: 'expandable_list', 
          checks: { 
            isExpandableList: true, 
            isHorizontalCards: false, 
            isImageList: false, 
            isTextBlock: false, 
            isHighlightBanner: false, 
            isQuickActions: false 
          } 
        },
        { 
          type: 'horizontal_cards', 
          checks: { 
            isExpandableList: false, 
            isHorizontalCards: true, 
            isImageList: false, 
            isTextBlock: false, 
            isHighlightBanner: false, 
            isQuickActions: false 
          } 
        },
        { 
          type: 'image_list', 
          checks: { 
            isExpandableList: false, 
            isHorizontalCards: false, 
            isImageList: true, 
            isTextBlock: false, 
            isHighlightBanner: false, 
            isQuickActions: false 
          } 
        },
        { 
          type: 'text_block', 
          checks: { 
            isExpandableList: false, 
            isHorizontalCards: false, 
            isImageList: false, 
            isTextBlock: true, 
            isHighlightBanner: false, 
            isQuickActions: false 
          } 
        },
        { 
          type: 'highlight_banner', 
          checks: { 
            isExpandableList: false, 
            isHorizontalCards: false, 
            isImageList: false, 
            isTextBlock: false, 
            isHighlightBanner: true, 
            isQuickActions: false 
          } 
        },
        { 
          type: 'quick_actions', 
          checks: { 
            isExpandableList: false, 
            isHorizontalCards: false, 
            isImageList: false, 
            isTextBlock: false, 
            isHighlightBanner: false, 
            isQuickActions: true 
          } 
        }
      ];

      typeChecks.forEach(({ type, checks }) => {
        const widgetType = PrdWidgetType.create(type);
        
        expect(widgetType.isExpandableList()).toBe(checks.isExpandableList);
        expect(widgetType.isHorizontalCards()).toBe(checks.isHorizontalCards);
        expect(widgetType.isImageList()).toBe(checks.isImageList);
        expect(widgetType.isTextBlock()).toBe(checks.isTextBlock);
        expect(widgetType.isHighlightBanner()).toBe(checks.isHighlightBanner);
        expect(widgetType.isQuickActions()).toBe(checks.isQuickActions);
      });
    });
  });
});
