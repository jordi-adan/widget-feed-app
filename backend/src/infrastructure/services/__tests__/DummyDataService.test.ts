import { DummyDataService } from '../DummyDataService';
import { InMemoryWidgetRepository } from '../../repositories/InMemoryWidgetRepository';
import { InMemoryWidgetDescriptorRepository } from '../../repositories/InMemoryWidgetDescriptorRepository';

describe('DummyDataService', () => {
  let repository: InMemoryWidgetRepository;
  let widgetDescriptorRepository: InMemoryWidgetDescriptorRepository;
  let dummyDataService: DummyDataService;

  beforeEach(() => {
    repository = new InMemoryWidgetRepository();
    widgetDescriptorRepository = new InMemoryWidgetDescriptorRepository();
    dummyDataService = new DummyDataService(repository, widgetDescriptorRepository);
  });

  describe('loadDummyData', () => {
    it('should load sample widgets into the repository', async () => {
      // Given
      expect(repository.size()).toBe(0);

      // When
      await dummyDataService.loadDummyData();

      // Then
      expect(repository.size()).toBeGreaterThan(0);
      expect(repository.size()).toBe(8); // Expected number of dummy widgets
    });

    it('should create widgets with different PRD-compliant types', async () => {
      // When
      await dummyDataService.loadDummyData();

      // Then
      const widgets = await repository.findAll();
      const types = widgets.map(w => w.getType().getValue());
      
      expect(types).toContain('text_block');
      expect(types).toContain('expandable_list');
      expect(types).toContain('horizontal_cards');
      expect(types).toContain('image_list');
      expect(types).toContain('highlight_banner');
      expect(types).toContain('quick_actions');
    });

    it('should create widgets with valid JSON content', async () => {
      // When
      await dummyDataService.loadDummyData();

      // Then
      const widgets = await repository.findAll();
      widgets.forEach(widget => {
        expect(() => {
          JSON.parse(widget.getContent().getValue());
        }).not.toThrow();
      });
    });

    it('should create widgets with staggered timestamps', async () => {
      // When
      await dummyDataService.loadDummyData();

      // Then
      const widgets = await repository.findAll();
      const timestamps = widgets.map(w => w.getTimestamp().getTime());
      
      // Check that timestamps are different (staggered)
      const uniqueTimestamps = new Set(timestamps);
      expect(uniqueTimestamps.size).toBeGreaterThan(1);
    });

    it('should handle multiple calls gracefully', async () => {
      // When
      await dummyDataService.loadDummyData();
      const firstCount = repository.size();
      
      await dummyDataService.loadDummyData();
      const secondCount = repository.size();

      // Then
      expect(secondCount).toBe(firstCount * 2); // Should add more widgets
    });
  });

  describe('clearData', () => {
    it('should clear all data from the repository', async () => {
      // Given
      await dummyDataService.loadDummyData();
      expect(repository.size()).toBeGreaterThan(0);

      // When
      await dummyDataService.clearData();

      // Then
      expect(repository.size()).toBe(0);
    });

    it('should work on empty repository', async () => {
      // Given
      expect(repository.size()).toBe(0);

      // When & Then
      await expect(dummyDataService.clearData()).resolves.not.toThrow();
      expect(repository.size()).toBe(0);
    });
  });
});
