import { WidgetType } from '../WidgetType';

describe('WidgetType', () => {
  describe('create', () => {
    it('should create valid widget types', () => {
      const validTypes = [
        'text', 'image', 'video', 'link', 'chart',
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
      const invalidTypes = ['invalid', 'audio', 'document', 'pdf', '123', 'TEXT', 'Image'];
      
      invalidTypes.forEach(type => {
        expect(() => WidgetType.create(type))
          .toThrow(`Invalid widget type: ${type}. Valid types are: text, image, video, link, chart`);
      });
    });
  });

  describe('getValue', () => {
    it('should return the correct value', () => {
      const type = WidgetType.create('text');
      expect(type.getValue()).toBe('text');
    });
  });

  describe('equals', () => {
    it('should return true for equal widget types', () => {
      const type1 = WidgetType.create('text');
      const type2 = WidgetType.create('text');
      
      expect(type1.equals(type2)).toBe(true);
    });

    it('should return false for different widget types', () => {
      const type1 = WidgetType.create('text');
      const type2 = WidgetType.create('image');
      
      expect(type1.equals(type2)).toBe(false);
    });

    it('should work with all valid type combinations', () => {
      const types = ['text', 'image', 'video', 'link', 'chart'];
      
      types.forEach(type1 => {
        types.forEach(type2 => {
          const widgetType1 = WidgetType.create(type1);
          const widgetType2 = WidgetType.create(type2);
          
          if (type1 === type2) {
            expect(widgetType1.equals(widgetType2)).toBe(true);
          } else {
            expect(widgetType1.equals(widgetType2)).toBe(false);
          }
        });
      });
    });
  });

  describe('type checking methods', () => {
    describe('isText', () => {
      it('should return true for text type', () => {
        const type = WidgetType.create('text');
        expect(type.isText()).toBe(true);
      });

      it('should return false for non-text types', () => {
        const nonTextTypes = ['image', 'video', 'link', 'chart'];
        
        nonTextTypes.forEach(typeValue => {
          const type = WidgetType.create(typeValue);
          expect(type.isText()).toBe(false);
        });
      });
    });

    describe('isImage', () => {
      it('should return true for image type', () => {
        const type = WidgetType.create('image');
        expect(type.isImage()).toBe(true);
      });

      it('should return false for non-image types', () => {
        const nonImageTypes = ['text', 'video', 'link', 'chart'];
        
        nonImageTypes.forEach(typeValue => {
          const type = WidgetType.create(typeValue);
          expect(type.isImage()).toBe(false);
        });
      });
    });

    describe('isVideo', () => {
      it('should return true for video type', () => {
        const type = WidgetType.create('video');
        expect(type.isVideo()).toBe(true);
      });

      it('should return false for non-video types', () => {
        const nonVideoTypes = ['text', 'image', 'link', 'chart'];
        
        nonVideoTypes.forEach(typeValue => {
          const type = WidgetType.create(typeValue);
          expect(type.isVideo()).toBe(false);
        });
      });
    });

    describe('isLink', () => {
      it('should return true for link type', () => {
        const type = WidgetType.create('link');
        expect(type.isLink()).toBe(true);
      });

      it('should return false for non-link types', () => {
        const nonLinkTypes = ['text', 'image', 'video', 'chart'];
        
        nonLinkTypes.forEach(typeValue => {
          const type = WidgetType.create(typeValue);
          expect(type.isLink()).toBe(false);
        });
      });
    });

    describe('isChart', () => {
      it('should return true for chart type', () => {
        const type = WidgetType.create('chart');
        expect(type.isChart()).toBe(true);
      });

      it('should return false for non-chart types', () => {
        const nonChartTypes = ['text', 'image', 'video', 'link'];
        
        nonChartTypes.forEach(typeValue => {
          const type = WidgetType.create(typeValue);
          expect(type.isChart()).toBe(false);
        });
      });
    });
  });

  describe('new widget types for dynamic feed', () => {
    describe('expandable_list', () => {
      it('should create expandable_list widget type', () => {
        const widgetType = WidgetType.create('expandable_list');
        
        expect(widgetType.getValue()).toBe('expandable_list');
        expect(widgetType.isExpandableList()).toBe(true);
        expect(widgetType.isHorizontalCards()).toBe(false);
      });
    });

    describe('horizontal_cards', () => {
      it('should create horizontal_cards widget type', () => {
        const widgetType = WidgetType.create('horizontal_cards');
        
        expect(widgetType.getValue()).toBe('horizontal_cards');
        expect(widgetType.isHorizontalCards()).toBe(true);
        expect(widgetType.isExpandableList()).toBe(false);
      });
    });

    describe('image_list', () => {
      it('should create image_list widget type', () => {
        const widgetType = WidgetType.create('image_list');
        
        expect(widgetType.getValue()).toBe('image_list');
        expect(widgetType.isImageList()).toBe(true);
        expect(widgetType.isTextBlock()).toBe(false);
      });
    });

    describe('text_block', () => {
      it('should create text_block widget type', () => {
        const widgetType = WidgetType.create('text_block');
        
        expect(widgetType.getValue()).toBe('text_block');
        expect(widgetType.isTextBlock()).toBe(true);
        expect(widgetType.isImageList()).toBe(false);
      });
    });

    describe('highlight_banner', () => {
      it('should create highlight_banner widget type', () => {
        const widgetType = WidgetType.create('highlight_banner');
        
        expect(widgetType.getValue()).toBe('highlight_banner');
        expect(widgetType.isHighlightBanner()).toBe(true);
        expect(widgetType.isQuickActions()).toBe(false);
      });
    });

    describe('quick_actions', () => {
      it('should create quick_actions widget type', () => {
        const widgetType = WidgetType.create('quick_actions');
        
        expect(widgetType.getValue()).toBe('quick_actions');
        expect(widgetType.isQuickActions()).toBe(true);
        expect(widgetType.isHighlightBanner()).toBe(false);
      });
    });
  });

  describe('integration tests', () => {
    it('should handle all legacy type checking methods correctly for each type', () => {
      const typeChecks = [
        { type: 'text', checks: { isText: true, isImage: false, isVideo: false, isLink: false, isChart: false } },
        { type: 'image', checks: { isText: false, isImage: true, isVideo: false, isLink: false, isChart: false } },
        { type: 'video', checks: { isText: false, isImage: false, isVideo: true, isLink: false, isChart: false } },
        { type: 'link', checks: { isText: false, isImage: false, isVideo: false, isLink: true, isChart: false } },
        { type: 'chart', checks: { isText: false, isImage: false, isVideo: false, isLink: false, isChart: true } }
      ];

      typeChecks.forEach(({ type, checks }) => {
        const widgetType = WidgetType.create(type);
        
        expect(widgetType.isText()).toBe(checks.isText);
        expect(widgetType.isImage()).toBe(checks.isImage);
        expect(widgetType.isVideo()).toBe(checks.isVideo);
        expect(widgetType.isLink()).toBe(checks.isLink);
        expect(widgetType.isChart()).toBe(checks.isChart);
      });
    });

    it('should handle all new type checking methods correctly for each type', () => {
      const newTypeChecks = [
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

      newTypeChecks.forEach(({ type, checks }) => {
        const widgetType = WidgetType.create(type);
        
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
