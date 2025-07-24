import { WidgetType } from '../WidgetType';

describe('WidgetType', () => {
  describe('create', () => {
    it('should create valid widget types', () => {
      const validTypes = ['text', 'image', 'video', 'link', 'chart'];
      
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

  describe('integration tests', () => {
    it('should handle all type checking methods correctly for each type', () => {
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
  });
});
