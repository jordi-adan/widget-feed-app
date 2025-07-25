import { GetSortedWidgetsUseCase } from '../GetSortedWidgetsUseCase';
import { WidgetRepository } from '../../domain/repositories/WidgetRepository';
import { Widget } from '../../models/widget';
import { WidgetId } from '../../domain/entities/value-objects/WidgetId';
import { WidgetType } from '../../domain/entities/value-objects/WidgetType';
import { WidgetContent } from '../../domain/entities/value-objects/WidgetContent';

describe('GetSortedWidgetsUseCase', () => {
  let mockRepository: jest.Mocked<WidgetRepository>;
  let getSortedWidgetsUseCase: GetSortedWidgetsUseCase;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
      findByType: jest.fn()
    };
    getSortedWidgetsUseCase = new GetSortedWidgetsUseCase(mockRepository);
  });

  describe('when getting widgets with sorting', () => {
    it('should return widgets sorted by timestamp descending (newest first)', async () => {
      // Arrange
      const oldDate = new Date('2023-01-01T00:00:00Z');
      const newDate = new Date('2023-01-02T00:00:00Z');
      
      const oldWidget = Widget.create(
        WidgetId.generate(),
        WidgetType.create('text_block'),
        WidgetContent.create('Old widget'),
        oldDate
      );
      
      const newWidget = Widget.create(
        WidgetId.generate(),
        WidgetType.create('text_block'),
        WidgetContent.create('New widget'),
        newDate
      );
      
      // Repository returns widgets in random order
      mockRepository.findAll.mockResolvedValue([oldWidget, newWidget]);

      // Act
      const result = await getSortedWidgetsUseCase.execute({ 
        sortBy: 'timestamp', 
        sortOrder: 'desc' 
      });

      // Assert
      expect(result.success).toBe(true);
      expect(result.widgets).toHaveLength(2);
      expect(result.widgets![0].getContent().getValue()).toBe('New widget');
      expect(result.widgets![1].getContent().getValue()).toBe('Old widget');
    });

    it('should return widgets sorted by timestamp ascending (oldest first)', async () => {
      // Arrange
      const oldDate = new Date('2023-01-01T00:00:00Z');
      const newDate = new Date('2023-01-02T00:00:00Z');
      
      const oldWidget = Widget.create(
        WidgetId.generate(),
        WidgetType.create('text_block'),
        WidgetContent.create('Old widget'),
        oldDate
      );
      
      const newWidget = Widget.create(
        WidgetId.generate(),
        WidgetType.create('text_block'),
        WidgetContent.create('New widget'),
        newDate
      );
      
      mockRepository.findAll.mockResolvedValue([newWidget, oldWidget]);

      // Act
      const result = await getSortedWidgetsUseCase.execute({ 
        sortBy: 'timestamp', 
        sortOrder: 'asc' 
      });

      // Assert
      expect(result.success).toBe(true);
      expect(result.widgets).toHaveLength(2);
      expect(result.widgets![0].getContent().getValue()).toBe('Old widget');
      expect(result.widgets![1].getContent().getValue()).toBe('New widget');
    });

    it('should return widgets sorted by type alphabetically', async () => {
      // Arrange
      const textWidget = Widget.create(
        WidgetId.generate(),
        WidgetType.create('text_block'),
        WidgetContent.create('Text widget')
      );
      
      const imageWidget = Widget.create(
        WidgetId.generate(),
        WidgetType.create('image_list'),
        WidgetContent.create('Image widget')
      );
      
      mockRepository.findAll.mockResolvedValue([textWidget, imageWidget]);

      // Act
      const result = await getSortedWidgetsUseCase.execute({ 
        sortBy: 'type', 
        sortOrder: 'asc' 
      });

      // Assert
      expect(result.success).toBe(true);
      expect(result.widgets).toHaveLength(2);
      expect(result.widgets![0].getType().getValue()).toBe('image_list');
      expect(result.widgets![1].getType().getValue()).toBe('text_block');
    });

    it('should default to timestamp descending when no sort parameters provided', async () => {
      // Arrange
      const oldWidget = Widget.create(
        WidgetId.generate(),
        WidgetType.create('text_block'),
        WidgetContent.create('Old widget'),
        new Date('2023-01-01T00:00:00Z')
      );
      
      const newWidget = Widget.create(
        WidgetId.generate(),
        WidgetType.create('text_block'),
        WidgetContent.create('New widget'),
        new Date('2023-01-02T00:00:00Z')
      );
      
      mockRepository.findAll.mockResolvedValue([oldWidget, newWidget]);

      // Act
      const result = await getSortedWidgetsUseCase.execute({});

      // Assert
      expect(result.success).toBe(true);
      expect(result.widgets![0].getContent().getValue()).toBe('New widget');
      expect(result.widgets![1].getContent().getValue()).toBe('Old widget');
    });

    it('should handle empty widget list', async () => {
      // Arrange
      mockRepository.findAll.mockResolvedValue([]);

      // Act
      const result = await getSortedWidgetsUseCase.execute({ 
        sortBy: 'timestamp', 
        sortOrder: 'desc' 
      });

      // Assert
      expect(result.success).toBe(true);
      expect(result.widgets).toHaveLength(0);
    });

    it('should handle repository errors gracefully', async () => {
      // Arrange
      mockRepository.findAll.mockRejectedValue(new Error('Database error'));

      // Act
      const result = await getSortedWidgetsUseCase.execute({ 
        sortBy: 'timestamp', 
        sortOrder: 'desc' 
      });

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toContain('Database error');
    });

    it('should return error for invalid sort field', async () => {
      // Act
      const result = await getSortedWidgetsUseCase.execute({ 
        sortBy: 'invalid_field', 
        sortOrder: 'desc' 
      });

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid sort field');
    });

    it('should return error for invalid sort order', async () => {
      // Act
      const result = await getSortedWidgetsUseCase.execute({ 
        sortBy: 'timestamp', 
        sortOrder: 'invalid_order' 
      });

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid sort order');
    });
  });
});
