import {
  WidgetError,
  WidgetErrorCode,
  WidgetNotFoundError,
  InvalidWidgetIdError,
  InvalidContentError,
  InvalidWidgetTypeError
} from '../WidgetErrors';

describe('WidgetErrors', () => {
  describe('WidgetErrorCode', () => {
    it('should have all expected error codes', () => {
      expect(WidgetErrorCode.WIDGET_NOT_FOUND).toBe('WIDGET_NOT_FOUND');
      expect(WidgetErrorCode.INVALID_WIDGET_ID).toBe('INVALID_WIDGET_ID');
      expect(WidgetErrorCode.INVALID_CONTENT).toBe('INVALID_CONTENT');
      expect(WidgetErrorCode.INVALID_WIDGET_TYPE).toBe('INVALID_WIDGET_TYPE');
    });
  });

  describe('WidgetError', () => {
    it('should create a WidgetError with code and message', () => {
      const error = new WidgetError(WidgetErrorCode.WIDGET_NOT_FOUND, 'Test error message');
      
      expect(error.code).toBe(WidgetErrorCode.WIDGET_NOT_FOUND);
      expect(error.message).toBe('Test error message');
      expect(error.name).toBe('WidgetError');
      expect(error).toBeInstanceOf(Error);
    });

    it('should inherit from Error class', () => {
      const error = new WidgetError(WidgetErrorCode.INVALID_CONTENT, 'Test message');
      
      expect(error).toBeInstanceOf(Error);
      expect(error.stack).toBeDefined();
    });
  });

  describe('WidgetNotFoundError', () => {
    it('should create error with correct code and formatted message', () => {
      const widgetId = 'widget-123';
      const error = new WidgetNotFoundError(widgetId);
      
      expect(error.code).toBe(WidgetErrorCode.WIDGET_NOT_FOUND);
      expect(error.message).toBe(`Widget with id ${widgetId} not found`);
      expect(error.name).toBe('WidgetError');
      expect(error).toBeInstanceOf(WidgetError);
    });

    it('should work with different widget IDs', () => {
      const error1 = new WidgetNotFoundError('abc-123');
      const error2 = new WidgetNotFoundError('xyz-999');
      
      expect(error1.message).toBe('Widget with id abc-123 not found');
      expect(error2.message).toBe('Widget with id xyz-999 not found');
    });
  });

  describe('InvalidWidgetIdError', () => {
    it('should create error with correct code and formatted message', () => {
      const invalidId = 'invalid-id';
      const error = new InvalidWidgetIdError(invalidId);
      
      expect(error.code).toBe(WidgetErrorCode.INVALID_WIDGET_ID);
      expect(error.message).toBe(`Invalid widget ID: ${invalidId}`);
      expect(error.name).toBe('WidgetError');
      expect(error).toBeInstanceOf(WidgetError);
    });

    it('should work with different invalid IDs', () => {
      const error1 = new InvalidWidgetIdError('');
      const error2 = new InvalidWidgetIdError('   ');
      
      expect(error1.message).toBe('Invalid widget ID: ');
      expect(error2.message).toBe('Invalid widget ID:    ');
    });
  });

  describe('InvalidContentError', () => {
    it('should create error with correct code and formatted message', () => {
      const invalidContent = 'bad content';
      const error = new InvalidContentError(invalidContent);
      
      expect(error.code).toBe(WidgetErrorCode.INVALID_CONTENT);
      expect(error.message).toBe(`Invalid widget content: ${invalidContent}`);
      expect(error.name).toBe('WidgetError');
      expect(error).toBeInstanceOf(WidgetError);
    });

    it('should work with empty and whitespace content', () => {
      const error1 = new InvalidContentError('');
      const error2 = new InvalidContentError('   ');
      
      expect(error1.message).toBe('Invalid widget content: ');
      expect(error2.message).toBe('Invalid widget content:    ');
    });
  });

  describe('InvalidWidgetTypeError', () => {
    it('should create error with correct code and formatted message', () => {
      const invalidType = 'invalid-type';
      const error = new InvalidWidgetTypeError(invalidType);
      
      expect(error.code).toBe(WidgetErrorCode.INVALID_WIDGET_TYPE);
      expect(error.message).toBe(`Invalid widget type: ${invalidType}`);
      expect(error.name).toBe('WidgetError');
      expect(error).toBeInstanceOf(WidgetError);
    });

    it('should work with different invalid types', () => {
      const error1 = new InvalidWidgetTypeError('unknown');
      const error2 = new InvalidWidgetTypeError('badtype');
      
      expect(error1.message).toBe('Invalid widget type: unknown');
      expect(error2.message).toBe('Invalid widget type: badtype');
    });
  });
});
