import { DeleteWidgetUseCase } from '../DeleteWidgetUseCase';
import { WidgetRepository } from '../../domain/repositories/WidgetRepository';
import { Widget } from '../../models/widget';
import { WidgetId } from '../../domain/entities/value-objects/WidgetId';
import { WidgetType } from '../../domain/entities/value-objects/WidgetType';
import { WidgetContent } from '../../domain/entities/value-objects/WidgetContent';

describe('DeleteWidgetUseCase', () => {
  let mockRepository: jest.Mocked<WidgetRepository>;
  let deleteWidgetUseCase: DeleteWidgetUseCase;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
      findByType: jest.fn()
    };
    deleteWidgetUseCase = new DeleteWidgetUseCase(mockRepository);
  });

  describe('when deleting a widget', () => {
    it('should delete widget successfully when widget exists', async () => {
      // Arrange
      const widgetId = WidgetId.generate();
      const existingWidget = Widget.create(
        widgetId,
        WidgetType.create('text_block'),
        WidgetContent.create('Test content')
      );
      
      mockRepository.findById.mockResolvedValue(existingWidget);
      mockRepository.delete.mockResolvedValue();
      
      const deleteRequest = {
        id: widgetId.getValue()
      };

      // Act
      const result = await deleteWidgetUseCase.execute(deleteRequest);

      // Assert
      expect(result.success).toBe(true);
      expect(mockRepository.findById).toHaveBeenCalledWith(widgetId);
      expect(mockRepository.delete).toHaveBeenCalledWith(widgetId);
    });

    it('should return error when widget does not exist', async () => {
      // Arrange
      const widgetId = WidgetId.generate();
      mockRepository.findById.mockResolvedValue(null);
      
      const deleteRequest = {
        id: widgetId.getValue()
      };

      // Act
      const result = await deleteWidgetUseCase.execute(deleteRequest);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe('Widget not found');
      expect(result.errorCode).toBe('WIDGET_NOT_FOUND');
      expect(mockRepository.findById).toHaveBeenCalledWith(widgetId);
      expect(mockRepository.delete).not.toHaveBeenCalled();
    });

    it('should return error for invalid widget ID format', async () => {
      // Arrange
      const deleteRequest = {
        id: 'invalid-uuid'
      };

      // Act
      const result = await deleteWidgetUseCase.execute(deleteRequest);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toContain('must be a valid UUID');
      expect(result.errorCode).toBe('INVALID_WIDGET_ID');
      expect(mockRepository.findById).not.toHaveBeenCalled();
      expect(mockRepository.delete).not.toHaveBeenCalled();
    });

    it('should handle repository errors gracefully', async () => {
      // Arrange
      const widgetId = WidgetId.generate();
      mockRepository.findById.mockRejectedValue(new Error('Database error'));
      
      const deleteRequest = {
        id: widgetId.getValue()
      };

      // Act
      const result = await deleteWidgetUseCase.execute(deleteRequest);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toContain('Database error');
    });
  });
});
