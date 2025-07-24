import { CreateWidgetUseCase } from '../CreateWidgetUseCase';
import { WidgetRepository } from '../../domain/repositories/WidgetRepository';
import { Widget } from '../../models/widget';
import { WidgetId } from '../../domain/entities/value-objects/WidgetId';
import { WidgetType } from '../../domain/entities/value-objects/WidgetType';
import { WidgetContent } from '../../domain/entities/value-objects/WidgetContent';

describe('CreateWidgetUseCase', () => {
  let mockRepository: jest.Mocked<WidgetRepository>;
  let createWidgetUseCase: CreateWidgetUseCase;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
      findByType: jest.fn()
    };
    createWidgetUseCase = new CreateWidgetUseCase(mockRepository);
  });

  describe('when creating a new widget', () => {
    it('should create and save a widget successfully', async () => {
      // Arrange
      const widgetData = {
        type: 'text',
        content: 'Hello World'
      };

      // Act
      const result = await createWidgetUseCase.execute(widgetData);

      // Assert
      expect(result.success).toBe(true);
      expect(result.widget).toBeDefined();
      expect(result.widget!.getType().getValue()).toBe('text');
      expect(result.widget!.getContent().getValue()).toBe('Hello World');
      expect(mockRepository.save).toHaveBeenCalledWith(result.widget);
    });

    it('should return error when widget type is invalid', async () => {
      // Arrange
      const widgetData = {
        type: 'invalid_type',
        content: 'Hello World'
      };

      // Act
      const result = await createWidgetUseCase.execute(widgetData);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid widget type');
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should return error when content is too long', async () => {
      // Arrange
      const widgetData = {
        type: 'text',
        content: 'a'.repeat(10001) // Exceeds max length
      };

      // Act
      const result = await createWidgetUseCase.execute(widgetData);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toContain('cannot exceed 10000 characters');
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should handle repository errors gracefully', async () => {
      // Arrange
      const widgetData = {
        type: 'text',
        content: 'Hello World'
      };
      mockRepository.save.mockRejectedValue(new Error('Database error'));

      // Act
      const result = await createWidgetUseCase.execute(widgetData);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toContain('Database error');
    });
  });
});
