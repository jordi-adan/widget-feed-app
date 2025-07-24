import { WidgetContent } from '../WidgetContent';

describe('WidgetContent', () => {
  describe('create', () => {
    it('should create valid widget content', () => {
      const content = WidgetContent.create('This is valid content');
      expect(content.getValue()).toBe('This is valid content');
    });

    it('should allow empty string content', () => {
      const content = WidgetContent.create('');
      expect(content.getValue()).toBe('');
    });

    it('should allow whitespace only content', () => {
      const content = WidgetContent.create('   ');
      expect(content.getValue()).toBe('   ');
    });

    it('should throw error for null content', () => {
      expect(() => WidgetContent.create(null as any))
        .toThrow('WidgetContent cannot be null or undefined');
    });

    it('should throw error for undefined content', () => {
      expect(() => WidgetContent.create(undefined as any))
        .toThrow('WidgetContent cannot be null or undefined');
    });

    it('should throw error for content exceeding 10000 characters', () => {
      const longContent = 'a'.repeat(10001);
      expect(() => WidgetContent.create(longContent))
        .toThrow('WidgetContent cannot exceed 10000 characters');
    });

    it('should allow content with exactly 10000 characters', () => {
      const maxContent = 'a'.repeat(10000);
      const content = WidgetContent.create(maxContent);
      expect(content.getValue()).toBe(maxContent);
      expect(content.length()).toBe(10000);
    });
  });

  describe('getValue', () => {
    it('should return the correct value', () => {
      const content = WidgetContent.create('Test content');
      expect(content.getValue()).toBe('Test content');
    });

    it('should preserve special characters and formatting', () => {
      const specialContent = 'Content with\nnewlines\tand\tspecial chars: @#$%^&*()';
      const content = WidgetContent.create(specialContent);
      expect(content.getValue()).toBe(specialContent);
    });
  });

  describe('equals', () => {
    it('should return true for equal content', () => {
      const content1 = WidgetContent.create('Same content');
      const content2 = WidgetContent.create('Same content');
      
      expect(content1.equals(content2)).toBe(true);
    });

    it('should return false for different content', () => {
      const content1 = WidgetContent.create('Different content');
      const content2 = WidgetContent.create('Another content');
      
      expect(content1.equals(content2)).toBe(false);
    });

    it('should be case sensitive', () => {
      const content1 = WidgetContent.create('Content');
      const content2 = WidgetContent.create('content');
      
      expect(content1.equals(content2)).toBe(false);
    });

    it('should handle empty content comparison', () => {
      const content1 = WidgetContent.create('');
      const content2 = WidgetContent.create('');
      
      expect(content1.equals(content2)).toBe(true);
    });

    it('should handle whitespace differences', () => {
      const content1 = WidgetContent.create('Content with spaces');
      const content2 = WidgetContent.create('Content  with  spaces');
      
      expect(content1.equals(content2)).toBe(false);
    });
  });

  describe('length', () => {
    it('should return correct length for regular content', () => {
      const content = WidgetContent.create('Hello World');
      expect(content.length()).toBe(11);
    });

    it('should return 0 for empty content', () => {
      const content = WidgetContent.create('');
      expect(content.length()).toBe(0);
    });

    it('should count all characters including spaces and special chars', () => {
      const content = WidgetContent.create('Test\nwith\tspecial chars: 123!@#');
      expect(content.length()).toBe(31);
    });

    it('should handle unicode characters correctly', () => {
      const content = WidgetContent.create('Hello 世界 🌍');
      expect(content.length()).toBe(11);
    });
  });

  describe('isEmpty', () => {
    it('should return true for empty string', () => {
      const content = WidgetContent.create('');
      expect(content.isEmpty()).toBe(true);
    });

    it('should return true for whitespace only content', () => {
      const whitespaceContents = ['   ', '\t', '\n', '  \t\n  '];
      
      whitespaceContents.forEach(ws => {
        const content = WidgetContent.create(ws);
        expect(content.isEmpty()).toBe(true);
      });
    });

    it('should return false for content with actual text', () => {
      const content = WidgetContent.create('Not empty');
      expect(content.isEmpty()).toBe(false);
    });

    it('should return false for content with text surrounded by whitespace', () => {
      const content = WidgetContent.create('  Not empty  ');
      expect(content.isEmpty()).toBe(false);
    });

    it('should return false for single character content', () => {
      const content = WidgetContent.create('a');
      expect(content.isEmpty()).toBe(false);
    });
  });

  describe('edge cases and integration', () => {
    it('should handle very long valid content', () => {
      const longContent = 'x'.repeat(9999);
      const content = WidgetContent.create(longContent);
      
      expect(content.getValue()).toBe(longContent);
      expect(content.length()).toBe(9999);
      expect(content.isEmpty()).toBe(false);
    });

    it('should handle content with mixed whitespace and text', () => {
      const mixedContent = '  Start\n\tMiddle  \nEnd  ';
      const content = WidgetContent.create(mixedContent);
      
      expect(content.getValue()).toBe(mixedContent);
      expect(content.length()).toBe(23);
      expect(content.isEmpty()).toBe(false);
    });

    it('should properly compare different instances with same content', () => {
      const text = 'Identical content for comparison';
      const content1 = WidgetContent.create(text);
      const content2 = WidgetContent.create(text);
      
      expect(content1.equals(content2)).toBe(true);
      expect(content1.getValue()).toBe(content2.getValue());
      expect(content1.length()).toBe(content2.length());
      expect(content1.isEmpty()).toBe(content2.isEmpty());
    });
  });
});
