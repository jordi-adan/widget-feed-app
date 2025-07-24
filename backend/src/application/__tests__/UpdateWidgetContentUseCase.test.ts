import { UpdateWidgetContentUseCase } from '../UpdateWidgetContentUseCase';
import { WidgetRepository } from '../../domain/repositories/WidgetRepository';
import { Widget } from '../../models/widget';
import { WidgetId } from '../../domain/entities/value-objects/WidgetId';
import { WidgetType } from '../../domain/entities/value-objects/WidgetType';
import { WidgetContent } from '../../domain/entities/value-objects/WidgetContent';

describe('UpdateWidgetContentUseCase', () => {
  let mockRepository: jest.Mocked<WidgetRepository>;
  let updateWidgetContentUseCase: UpdateWidgetContentUseCase;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
      findByType: jest.fn()
    };
    updateWidgetContentUseCase = new UpdateWidgetContentUseCase(mockRepository);
  });

  describe('when updating widget content', () => {
    it('should update widget content successfully', async () => {
      // Arrange
      const widgetId = WidgetId.generate();
      const originalWidget = Widget.create(
        widgetId,
        WidgetType.create('text'),
        WidgetContent.create('Original content')
      );
      
      mockRepository.findById.mockResolvedValue(originalWidget);
      
      const updateRequest = {
        id: widgetId.getValue(),
        content: 'Updated content'
      };

      // Act
      const result = await updateWidgetContentUseCase.execute(updateRequest);

      // Assert
      expect(result.success).toBe(true);
      expect(result.widget).toBeDefined();
      expect(result.widget!.getContent().getValue()).toBe('Updated content');
      expect(mockRepository.findById).toHaveBeenCalledWith(widgetId);
      expect(mockRepository.save).toHaveBeenCalledWith(expect.any(Widget));
    });

    it('should return error when widget does not exist', async () => {
      // Arrange
      const widgetId = WidgetId.generate();
      mockRepository.findById.mockResolvedValue(null);
      
      const updateRequest = {
        id: widgetId.getValue(),
        content: 'Updated content'
      };

      // Act
      const result = await updateWidgetContentUseCase.execute(updateRequest);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toContain('Widget not found');
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should return error when content is invalid', async () => {
      // Arrange
      const widgetId = WidgetId.generate();
      const originalWidget = Widget.create(
        widgetId,
        WidgetType.create('text'),
        WidgetContent.create('Original content')
      );
      
      mockRepository.findById.mockResolvedValue(originalWidget);
      
      const updateRequest = {
        id: widgetId.getValue(),
        content: 'a'.repeat(10001) // Exceeds max length
      };

      // Act
      const result = await updateWidgetContentUseCase.execute(updateRequest);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toContain('cannot exceed 10000 characters');
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should return error when widget ID is invalid', async () => {
      // Arrange
      const updateRequest = {
        id: 'invalid-id',
        content: 'Updated content'
      };

      // Act
      const result = await updateWidgetContentUseCase.execute(updateRequest);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toContain('must be a valid UUID');
      expect(mockRepository.findById).not.toHaveBeenCalled();
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should handle repository errors gracefully', async () => {
      // Arrange
      const widgetId = WidgetId.generate();
      mockRepository.findById.mockRejectedValue(new Error('Database error'));
      
      const updateRequest = {
        id: widgetId.getValue(),
        content: 'Updated content'
      };

      // Act
      const result = await updateWidgetContentUseCase.execute(updateRequest);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toContain('Database error');
    });

    it('should update timestamp when content is updated', async () => {
      // Arrange
      const widgetId = WidgetId.generate();
      const originalWidget = Widget.create(
        widgetId,
        WidgetType.create('text'),
        WidgetContent.create('Original content'),
        new Date('2023-01-01T00:00:00Z')
      );
      
      mockRepository.findById.mockResolvedValue(originalWidget);
      
      const updateRequest = {
        id: widgetId.getValue(),
        content: 'Updated content'
      };

      // Act
      const result = await updateWidgetContentUseCase.execute(updateRequest);

      // Assert
      expect(result.success).toBe(true);
      expect(result.widget!.getTimestamp().getTime()).toBeGreaterThan(
        new Date('2023-01-01T00:00:00Z').getTime()
      );
    });
  });
});
