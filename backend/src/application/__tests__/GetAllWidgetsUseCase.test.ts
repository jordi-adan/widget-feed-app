import { GetAllWidgetsUseCase } from '../GetAllWidgetsUseCase';
import { WidgetRepository } from '../../domain/repositories/WidgetRepository';
import { Widget } from '../../models/widget';
import { WidgetId } from '../../domain/entities/value-objects/WidgetId';
import { WidgetType } from '../../domain/entities/value-objects/WidgetType';
import { WidgetContent } from '../../domain/entities/value-objects/WidgetContent';

describe('GetAllWidgetsUseCase', () => {
  let mockRepository: jest.Mocked<WidgetRepository>;
  let getAllWidgetsUseCase: GetAllWidgetsUseCase;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
      findByType: jest.fn()
    };
    getAllWidgetsUseCase = new GetAllWidgetsUseCase(mockRepository);
  });

  describe('when getting all widgets', () => {
    it('should return all widgets successfully', async () => {
      // Arrange
      const widgets = [
        Widget.create(
          WidgetId.generate(),
          WidgetType.create('text_block'),
          WidgetContent.create('First widget')
        ),
        Widget.create(
          WidgetId.generate(),
          WidgetType.create('image_list'),
          WidgetContent.create('Second widget')
        )
      ];
      mockRepository.findAll.mockResolvedValue(widgets);

      // Act
      const result = await getAllWidgetsUseCase.execute();

      // Assert
      expect(result.success).toBe(true);
      expect(result.widgets).toHaveLength(2);
      expect(result.widgets![0].getContent().getValue()).toBe('First widget');
      expect(result.widgets![1].getContent().getValue()).toBe('Second widget');
      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no widgets exist', async () => {
      // Arrange
      mockRepository.findAll.mockResolvedValue([]);

      // Act
      const result = await getAllWidgetsUseCase.execute();

      // Assert
      expect(result.success).toBe(true);
      expect(result.widgets).toHaveLength(0);
    });

    it('should handle repository errors gracefully', async () => {
      // Arrange
      mockRepository.findAll.mockRejectedValue(new Error('Database connection failed'));

      // Act
      const result = await getAllWidgetsUseCase.execute();

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toContain('Database connection failed');
    });
  });
});
