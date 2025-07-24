import { InMemoryWidgetDescriptorRepository } from '../InMemoryWidgetDescriptorRepository';
import { WidgetDescriptor } from '../../../domain/entities/WidgetDescriptor';
import { WidgetId } from '../../../domain/entities/value-objects/WidgetId';
import { WidgetType } from '../../../domain/entities/value-objects/WidgetType';
import { ContentType } from '../../../domain/entities/value-objects/ContentType';
import { LoadingState } from '../../../domain/entities/value-objects/LoadingState';
import { ErrorState } from '../../../domain/entities/value-objects/ErrorState';

describe('InMemoryWidgetDescriptorRepository', () => {
  let repository: InMemoryWidgetDescriptorRepository;
  let staticWidgetDescriptor: WidgetDescriptor;
  let dynamicWidgetDescriptor: WidgetDescriptor;

  beforeEach(() => {
    repository = new InMemoryWidgetDescriptorRepository();

    staticWidgetDescriptor = WidgetDescriptor.createStatic({
      id: WidgetId.create('550e8400-e29b-41d4-a716-446655440001'),
      widgetType: WidgetType.create('text_block'),
      contentType: ContentType.create('static'),
      staticContent: { text: 'Hello World', style: 'primary' }
    });

    dynamicWidgetDescriptor = WidgetDescriptor.createDynamic({
      id: WidgetId.create('550e8400-e29b-41d4-a716-446655440002'),
      widgetType: WidgetType.create('horizontal_cards'),
      contentType: ContentType.create('dynamic'),
      dataUrl: 'https://api.example.com/cards',
      loadingState: LoadingState.create('skeleton'),
      errorState: ErrorState.create('retry')
    });
  });

  describe('save', () => {
    it('should save a new widget descriptor', async () => {
      // Act
      const result = await repository.save(staticWidgetDescriptor);

      // Assert
      expect(result).toEqual(staticWidgetDescriptor);
      expect(await repository.exists(staticWidgetDescriptor.getId())).toBe(true);
    });

    it('should update an existing widget descriptor', async () => {
      // Arrange
      await repository.save(staticWidgetDescriptor);
      const updatedDescriptor = staticWidgetDescriptor.updateStaticContent({
        text: 'Updated content',
        style: 'secondary'
      });

      // Act
      const result = await repository.save(updatedDescriptor);

      // Assert
      expect(result).toEqual(updatedDescriptor);
      expect(result.getStaticContent()).toEqual({
        text: 'Updated content',
        style: 'secondary'
      });
    });
  });

  describe('findById', () => {
    it('should return widget descriptor when it exists', async () => {
      // Arrange
      await repository.save(staticWidgetDescriptor);

      // Act
      const result = await repository.findById(staticWidgetDescriptor.getId());

      // Assert
      expect(result).toEqual(staticWidgetDescriptor);
    });

    it('should return null when widget descriptor does not exist', async () => {
      // Arrange
      const nonExistentId = WidgetId.create('550e8400-e29b-41d4-a716-446655440999');

      // Act
      const result = await repository.findById(nonExistentId);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return empty array when no widget descriptors exist', async () => {
      // Act
      const result = await repository.findAll();

      // Assert
      expect(result).toEqual([]);
    });

    it('should return all widget descriptors', async () => {
      // Arrange
      await repository.save(staticWidgetDescriptor);
      await repository.save(dynamicWidgetDescriptor);

      // Act
      const result = await repository.findAll();

      // Assert
      expect(result).toHaveLength(2);
      expect(result).toContainEqual(staticWidgetDescriptor);
      expect(result).toContainEqual(dynamicWidgetDescriptor);
    });

    it('should return widget descriptors in order of creation', async () => {
      // Arrange
      await repository.save(staticWidgetDescriptor);
      await repository.save(dynamicWidgetDescriptor);

      // Act
      const result = await repository.findAll();

      // Assert
      expect(result[0]).toEqual(staticWidgetDescriptor);
      expect(result[1]).toEqual(dynamicWidgetDescriptor);
    });
  });

  describe('delete', () => {
    it('should delete an existing widget descriptor', async () => {
      // Arrange
      await repository.save(staticWidgetDescriptor);
      expect(await repository.exists(staticWidgetDescriptor.getId())).toBe(true);

      // Act
      await repository.delete(staticWidgetDescriptor.getId());

      // Assert
      expect(await repository.exists(staticWidgetDescriptor.getId())).toBe(false);
      expect(await repository.findById(staticWidgetDescriptor.getId())).toBeNull();
    });

    it('should not throw error when deleting non-existent widget descriptor', async () => {
      // Arrange
      const nonExistentId = WidgetId.create('550e8400-e29b-41d4-a716-446655440999');

      // Act & Assert
      await expect(repository.delete(nonExistentId)).resolves.not.toThrow();
    });

    it('should only delete the specified widget descriptor', async () => {
      // Arrange
      await repository.save(staticWidgetDescriptor);
      await repository.save(dynamicWidgetDescriptor);

      // Act
      await repository.delete(staticWidgetDescriptor.getId());

      // Assert
      expect(await repository.exists(staticWidgetDescriptor.getId())).toBe(false);
      expect(await repository.exists(dynamicWidgetDescriptor.getId())).toBe(true);
    });
  });

  describe('exists', () => {
    it('should return true when widget descriptor exists', async () => {
      // Arrange
      await repository.save(staticWidgetDescriptor);

      // Act
      const result = await repository.exists(staticWidgetDescriptor.getId());

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when widget descriptor does not exist', async () => {
      // Arrange
      const nonExistentId = WidgetId.create('550e8400-e29b-41d4-a716-446655440999');

      // Act
      const result = await repository.exists(nonExistentId);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle multiple operations correctly', async () => {
      // Save multiple descriptors
      await repository.save(staticWidgetDescriptor);
      await repository.save(dynamicWidgetDescriptor);

      // Verify they exist
      expect(await repository.findAll()).toHaveLength(2);

      // Delete one
      await repository.delete(staticWidgetDescriptor.getId());
      expect(await repository.findAll()).toHaveLength(1);

      // Update the remaining one
      const updatedDescriptor = dynamicWidgetDescriptor;
      await repository.save(updatedDescriptor);
      expect(await repository.findAll()).toHaveLength(1);

      // Verify final state
      const finalDescriptors = await repository.findAll();
      expect(finalDescriptors[0]).toEqual(dynamicWidgetDescriptor);
    });

    it('should maintain separate storage for each repository instance', async () => {
      // Arrange
      const repository2 = new InMemoryWidgetDescriptorRepository();
      await repository.save(staticWidgetDescriptor);

      // Act & Assert
      expect(await repository.findAll()).toHaveLength(1);
      expect(await repository2.findAll()).toHaveLength(0);
    });
  });
});
