import { InMemoryWidgetRepository } from '../InMemoryWidgetRepository';
import { Widget } from '../../../models/widget';
import { WidgetId } from '../../../domain/entities/value-objects/WidgetId';
import { WidgetContent } from '../../../domain/entities/value-objects/WidgetContent';
import { WidgetType } from '../../../domain/entities/value-objects/WidgetType';
import { v4 as uuidv4 } from 'uuid';

describe('InMemoryWidgetRepository', () => {
  let repository: InMemoryWidgetRepository;

  beforeEach(() => {
    repository = new InMemoryWidgetRepository();
  });

  describe('save and findById', () => {
    it('should save and retrieve a widget', async () => {
      const widgetId = uuidv4();
      const widget = Widget.create(
        WidgetId.create(widgetId),
        WidgetType.create('text'),
        WidgetContent.create('Test content')
      );

      await repository.save(widget);
      const found = await repository.findById(WidgetId.create(widgetId));

      expect(found).toEqual(widget);
    });

    it('should return null for non-existent widget', async () => {
      const found = await repository.findById(WidgetId.create(uuidv4()));
      expect(found).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return empty array when no widgets', async () => {
      const widgets = await repository.findAll();
      expect(widgets).toEqual([]);
    });

    it('should return widgets sorted by timestamp (latest first)', async () => {
      // Create widgets with different timestamps
      const widget1 = Widget.create(
        WidgetId.create(uuidv4()),
        WidgetType.create('text'),
        WidgetContent.create('First widget')
      );
      
      // Wait a bit to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 5));
      
      const widget2 = Widget.create(
        WidgetId.create(uuidv4()),
        WidgetType.create('text'),
        WidgetContent.create('Second widget')
      );

      await repository.save(widget1);
      await repository.save(widget2);

      const widgets = await repository.findAll();
      
      expect(widgets).toHaveLength(2);
      expect(widgets[0].getId().getValue()).toBe(widget2.getId().getValue()); // Latest first
      expect(widgets[1].getId().getValue()).toBe(widget1.getId().getValue());
    });
  });

  describe('delete', () => {
    it('should delete an existing widget', async () => {
      const widgetId = uuidv4();
      const widget = Widget.create(
        WidgetId.create(widgetId),
        WidgetType.create('text'),
        WidgetContent.create('Content to delete')
      );

      await repository.save(widget);
      expect(await repository.findById(WidgetId.create(widgetId))).toEqual(widget);

      await repository.delete(WidgetId.create(widgetId));
      expect(await repository.findById(WidgetId.create(widgetId))).toBeNull();
    });

    it('should handle deleting non-existent widget gracefully', async () => {
      await expect(repository.delete(WidgetId.create(uuidv4()))).resolves.not.toThrow();
    });

    it('should not affect other widgets when deleting', async () => {
      const widget1Id = uuidv4();
      const widget2Id = uuidv4();
      
      const widget1 = Widget.create(
        WidgetId.create(widget1Id),
        WidgetType.create('text'),
        WidgetContent.create('Keep this')
      );
      
      const widget2 = Widget.create(
        WidgetId.create(widget2Id),
        WidgetType.create('text'),
        WidgetContent.create('Delete this')
      );

      await repository.save(widget1);
      await repository.save(widget2);

      await repository.delete(WidgetId.create(widget2Id));

      expect(await repository.findById(WidgetId.create(widget1Id))).toEqual(widget1);
      expect(await repository.findById(WidgetId.create(widget2Id))).toBeNull();
    });
  });

  describe('findByType', () => {
    it('should return empty array when no widgets of specified type', async () => {
      const widgets = await repository.findByType('image');
      expect(widgets).toEqual([]);
    });

    it('should return widgets of specified type only', async () => {
      const textWidget = Widget.create(
        WidgetId.create(uuidv4()),
        WidgetType.create('text'),
        WidgetContent.create('Text content')
      );
      
      const imageWidget = Widget.create(
        WidgetId.create(uuidv4()),
        WidgetType.create('image'),
        WidgetContent.create('Image content')
      );

      await repository.save(textWidget);
      await repository.save(imageWidget);

      const textWidgets = await repository.findByType('text');
      const imageWidgets = await repository.findByType('image');

      expect(textWidgets).toHaveLength(1);
      expect(textWidgets[0]).toEqual(textWidget);
      
      expect(imageWidgets).toHaveLength(1);
      expect(imageWidgets[0]).toEqual(imageWidget);
    });

    it('should return widgets sorted by timestamp (latest first)', async () => {
      const widget1 = Widget.create(
        WidgetId.create(uuidv4()),
        WidgetType.create('text'),
        WidgetContent.create('First text widget')
      );
      
      // Wait to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 5));
      
      const widget2 = Widget.create(
        WidgetId.create(uuidv4()),
        WidgetType.create('text'),
        WidgetContent.create('Second text widget')
      );

      await repository.save(widget1);
      await repository.save(widget2);

      const textWidgets = await repository.findByType('text');
      
      expect(textWidgets).toHaveLength(2);
      expect(textWidgets[0].getId().getValue()).toBe(widget2.getId().getValue()); // Latest first
      expect(textWidgets[1].getId().getValue()).toBe(widget1.getId().getValue());
    });
  });

  describe('utility methods', () => {
    describe('clear', () => {
      it('should remove all widgets', async () => {
        const widget1Id = uuidv4();
        const widget2Id = uuidv4();
        
        const widget1 = Widget.create(
          WidgetId.create(widget1Id),
          WidgetType.create('text'),
          WidgetContent.create('Content 1')
        );
        
        const widget2 = Widget.create(
          WidgetId.create(widget2Id),
          WidgetType.create('image'),
          WidgetContent.create('Content 2')
        );

        await repository.save(widget1);
        await repository.save(widget2);

        expect(repository.size()).toBe(2);

        repository.clear();

        expect(repository.size()).toBe(0);
        expect(await repository.findAll()).toEqual([]);
        expect(await repository.findById(WidgetId.create(widget1Id))).toBeNull();
        expect(await repository.findById(WidgetId.create(widget2Id))).toBeNull();
      });
    });

    describe('size', () => {
      it('should return 0 for empty repository', () => {
        expect(repository.size()).toBe(0);
      });

      it('should return correct count after adding widgets', async () => {
        expect(repository.size()).toBe(0);

        const widget1 = Widget.create(
          WidgetId.create(uuidv4()),
          WidgetType.create('text'),
          WidgetContent.create('Content 1')
        );
        
        await repository.save(widget1);
        expect(repository.size()).toBe(1);

        const widget2 = Widget.create(
          WidgetId.create(uuidv4()),
          WidgetType.create('text'),
          WidgetContent.create('Content 2')
        );
        
        await repository.save(widget2);
        expect(repository.size()).toBe(2);
      });

      it('should return correct count after deleting widgets', async () => {
        const widget1Id = uuidv4();
        const widget2Id = uuidv4();
        
        const widget1 = Widget.create(
          WidgetId.create(widget1Id),
          WidgetType.create('text'),
          WidgetContent.create('Content 1')
        );
        
        const widget2 = Widget.create(
          WidgetId.create(widget2Id),
          WidgetType.create('text'),
          WidgetContent.create('Content 2')
        );

        await repository.save(widget1);
        await repository.save(widget2);
        expect(repository.size()).toBe(2);

        await repository.delete(WidgetId.create(widget1Id));
        expect(repository.size()).toBe(1);

        await repository.delete(WidgetId.create(widget2Id));
        expect(repository.size()).toBe(0);
      });
    });
  });
});
