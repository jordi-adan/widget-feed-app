import { ContentType } from '../ContentType';

describe('ContentType Value Object', () => {
  describe('when creating a valid content type', () => {
    it('should create static content type', () => {
      // Act
      const contentType = ContentType.create('static');

      // Assert
      expect(contentType.getValue()).toBe('static');
      expect(contentType.isStatic()).toBe(true);
      expect(contentType.isDynamic()).toBe(false);
    });

    it('should create dynamic content type', () => {
      // Act
      const contentType = ContentType.create('dynamic');

      // Assert
      expect(contentType.getValue()).toBe('dynamic');
      expect(contentType.isDynamic()).toBe(true);
      expect(contentType.isStatic()).toBe(false);
    });
  });

  describe('when creating an invalid content type', () => {
    it('should throw error for empty string', () => {
      // Act & Assert
      expect(() => ContentType.create('')).toThrow('ContentType cannot be empty');
    });

    it('should throw error for whitespace only', () => {
      // Act & Assert
      expect(() => ContentType.create('   ')).toThrow('ContentType cannot be empty');
    });

    it('should throw error for invalid content type', () => {
      // Act & Assert
      expect(() => ContentType.create('invalid')).toThrow(
        'Invalid content type: invalid. Valid types are: static, dynamic'
      );
    });

    it('should throw error for null or undefined', () => {
      // Act & Assert
      expect(() => ContentType.create(null as any)).toThrow('ContentType cannot be empty');
      expect(() => ContentType.create(undefined as any)).toThrow('ContentType cannot be empty');
    });
  });

  describe('when checking equality', () => {
    it('should return true for same content types', () => {
      // Arrange
      const contentType1 = ContentType.create('static');
      const contentType2 = ContentType.create('static');

      // Act & Assert
      expect(contentType1.equals(contentType2)).toBe(true);
    });

    it('should return false for different content types', () => {
      // Arrange
      const contentType1 = ContentType.create('static');
      const contentType2 = ContentType.create('dynamic');

      // Act & Assert
      expect(contentType1.equals(contentType2)).toBe(false);
    });
  });

  describe('when checking type methods', () => {
    it('should have correct boolean values for each type', () => {
      const typeChecks = [
        { type: 'static', checks: { isStatic: true, isDynamic: false } },
        { type: 'dynamic', checks: { isStatic: false, isDynamic: true } }
      ];

      typeChecks.forEach(({ type, checks }) => {
        const contentType = ContentType.create(type);
        
        expect(contentType.isStatic()).toBe(checks.isStatic);
        expect(contentType.isDynamic()).toBe(checks.isDynamic);
      });
    });
  });
});
