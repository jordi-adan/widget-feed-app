import { Widget } from '../../../models/widget';
import { WidgetId } from '../value-objects/WidgetId';
import { WidgetType } from '../value-objects/WidgetType';
import { WidgetContent } from '../value-objects/WidgetContent';

describe('Widget Domain Entity', () => {
  describe('when creating a new widget', () => {
    it('should create a widget with valid data', () => {
      // Arrange
      const id = WidgetId.generate();
      const type = WidgetType.create('text_block');
      const content = WidgetContent.create('Hello World');
      const timestamp = new Date();

      // Act
      const widget = Widget.create(id, type, content, timestamp);

      // Assert
      expect(widget.getId()).toBe(id);
      expect(widget.getType()).toBe(type);
      expect(widget.getContent()).toBe(content);
      expect(widget.getTimestamp()).toBe(timestamp);
    });

    it('should create a widget with current timestamp when not provided', () => {
      // Arrange
      const id = WidgetId.generate();
      const type = WidgetType.create('text_block');
      const content = WidgetContent.create('Hello World');
      const beforeCreation = new Date();

      // Act
      const widget = Widget.create(id, type, content);
      const afterCreation = new Date();

      // Assert
      expect(widget.getTimestamp().getTime()).toBeGreaterThanOrEqual(beforeCreation.getTime());
      expect(widget.getTimestamp().getTime()).toBeLessThanOrEqual(afterCreation.getTime());
    });
  });

  describe('when updating widget content', () => {
    it('should update the content successfully', () => {
      // Arrange
      const widget = Widget.create(
        WidgetId.generate(),
        WidgetType.create('text_block'),
        WidgetContent.create('Original content')
      );
      const newContent = WidgetContent.create('Updated content');

      // Act
      widget.updateContent(newContent);

      // Assert
      expect(widget.getContent()).toBe(newContent);
    });

    it('should update the timestamp when content is updated', () => {
      // Arrange
      const widget = Widget.create(
        WidgetId.generate(),
        WidgetType.create('text_block'),
        WidgetContent.create('Original content')
      );
      const originalTimestamp = widget.getTimestamp();
      
      // Wait a bit to ensure timestamp difference
      setTimeout(() => {
        const newContent = WidgetContent.create('Updated content');

        // Act
        widget.updateContent(newContent);

        // Assert
        expect(widget.getTimestamp().getTime()).toBeGreaterThan(originalTimestamp.getTime());
      }, 10);
    });
  });

  describe('when converting to primitive', () => {
    it('should return correct primitive representation', () => {
      // Arrange
      const id = WidgetId.generate();
      const type = WidgetType.create('text_block');
      const content = WidgetContent.create('Hello World');
      const timestamp = new Date('2023-01-01T00:00:00Z');
      const widget = Widget.create(id, type, content, timestamp);

      // Act
      const primitive = widget.toPrimitive();

      // Assert
      expect(primitive).toEqual({
        id: id.getValue(),
        type: 'text_block',
        content: 'Hello World',
        timestamp: timestamp.toISOString()
      });
    });
  });
});
