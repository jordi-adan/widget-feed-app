import { WidgetType } from '../WidgetType';

describe('WidgetType', () => {
  describe('create', () => {
    it('should create valid widget types', () => {
      const validTypes = [
        'expandable_list', 'horizontal_cards', 'image_list', 'text_block', 'highlight_banner', 'quick_actions'
      ];
      
      validTypes.forEach(type => {
        const widgetType = WidgetType.create(type);
        expect(widgetType.getValue()).toBe(type);
      });
    });

    it('should throw error for empty string', () => {
      expect(() => WidgetType.create('')).toThrow('WidgetType cannot be empty');
    });

    it('should throw error for whitespace only string', () => {
      expect(() => WidgetType.create('   ')).toThrow('WidgetType cannot be empty');
    });

    it('should throw error for null or undefined', () => {
      expect(() => WidgetType.create(null as any)).toThrow('WidgetType cannot be empty');
      expect(() => WidgetType.create(undefined as any)).toThrow('WidgetType cannot be empty');
    });

    it('should throw error for invalid widget type', () => {
      const invalidTypes = ['invalid', 'text', 'image', 'video', 'link', 'chart'];
      
      invalidTypes.forEach(type => {
        expect(() => WidgetType.create(type))
          .toThrow('Invalid widget type:');
      });
    });
  });

  describe('getValue', () => {
    it('should return the correct value', () => {
      const type = WidgetType.create('text_block');
      expect(type.getValue()).toBe('text_block');
    });
  });

  describe('equals', () => {
    it('should return true for equal widget types', () => {
      const type1 = WidgetType.create('text_block');
      const type2 = WidgetType.create('text_block');
      expect(type1.equals(type2)).toBe(true);
    });

    it('should return false for different widget types', () => {
      const type1 = WidgetType.create('text_block');
      const type2 = WidgetType.create('image_list');
      expect(type1.equals(type2)).toBe(false);
    });
  });

  describe('type checking methods', () => {
    it('should return correct values for isExpandableList', () => {
      expect(WidgetType.create('expandable_list').isExpandableList()).toBe(true);
      expect(WidgetType.create('text_block').isExpandableList()).toBe(false);
    });

    it('should return correct values for isHorizontalCards', () => {
      expect(WidgetType.create('horizontal_cards').isHorizontalCards()).toBe(true);
      expect(WidgetType.create('text_block').isHorizontalCards()).toBe(false);
    });

    it('should return correct values for isImageList', () => {
      expect(WidgetType.create('image_list').isImageList()).toBe(true);
      expect(WidgetType.create('text_block').isImageList()).toBe(false);
    });

    it('should return correct values for isTextBlock', () => {
      expect(WidgetType.create('text_block').isTextBlock()).toBe(true);
      expect(WidgetType.create('image_list').isTextBlock()).toBe(false);
    });

    it('should return correct values for isHighlightBanner', () => {
      expect(WidgetType.create('highlight_banner').isHighlightBanner()).toBe(true);
      expect(WidgetType.create('text_block').isHighlightBanner()).toBe(false);
    });

    it('should return correct values for isQuickActions', () => {
      expect(WidgetType.create('quick_actions').isQuickActions()).toBe(true);
      expect(WidgetType.create('text_block').isQuickActions()).toBe(false);
    });
  });
});
