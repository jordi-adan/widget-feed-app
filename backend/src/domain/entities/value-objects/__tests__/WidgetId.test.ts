import { WidgetId } from '../WidgetId';

describe('WidgetId', () => {
  describe('generate', () => {
    it('should generate a valid UUID', () => {
      const widgetId = WidgetId.generate();
      const value = widgetId.getValue();
      
      // Check UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(uuidRegex.test(value)).toBe(true);
    });

    it('should generate unique UUIDs', () => {
      const id1 = WidgetId.generate();
      const id2 = WidgetId.generate();
      
      expect(id1.getValue()).not.toBe(id2.getValue());
      expect(id1.equals(id2)).toBe(false);
    });

    it('should generate multiple unique UUIDs', () => {
      const ids = new Set();
      for (let i = 0; i < 100; i++) {
        ids.add(WidgetId.generate().getValue());
      }
      expect(ids.size).toBe(100); // All should be unique
    });
  });

  describe('create', () => {
    it('should create widget id with valid UUID', () => {
      const validUuid = '550e8400-e29b-41d4-a716-446655440000';
      const widgetId = WidgetId.create(validUuid);
      expect(widgetId.getValue()).toBe(validUuid);
    });

    it('should create widget id with generated UUID', () => {
      const generatedId = WidgetId.generate();
      const createdId = WidgetId.create(generatedId.getValue());
      expect(createdId.equals(generatedId)).toBe(true);
    });

    it('should throw error for empty string', () => {
      expect(() => WidgetId.create('')).toThrow('WidgetId cannot be empty');
    });

    it('should throw error for whitespace only string', () => {
      expect(() => WidgetId.create('   ')).toThrow('WidgetId cannot be empty');
    });

    it('should throw error for null or undefined', () => {
      expect(() => WidgetId.create(null as any)).toThrow('WidgetId cannot be empty');
      expect(() => WidgetId.create(undefined as any)).toThrow('WidgetId cannot be empty');
    });

    it('should throw error for invalid UUID format', () => {
      const invalidUuids = [
        'not-a-uuid',
        '123',
        '550e8400-e29b-41d4-a716', // Too short
        '550e8400-e29b-41d4-a716-446655440000-extra', // Too long
        '550e8400-e29b-31d4-a716-446655440000', // Invalid version (should be 4)
        '550e8400-e29b-41d4-z716-446655440000', // Invalid character
        'gggggggg-gggg-4ggg-aggg-gggggggggggg' // Invalid characters
      ];

      invalidUuids.forEach(invalidUuid => {
        expect(() => WidgetId.create(invalidUuid))
          .toThrow('WidgetId must be a valid UUID');
      });
    });

    it('should accept valid UUID variations', () => {
      const validUuids = [
        '550e8400-e29b-41d4-a716-446655440000',
        '6ba7b810-9dad-41d1-80b4-00c04fd430c8',
        '6ba7b811-9dad-41d1-80b4-00c04fd430c8',
        '01234567-89ab-4def-8123-456789abcdef',
        'ffffffff-ffff-4fff-8fff-ffffffffffff',
        '00000000-0000-4000-8000-000000000000'
      ];

      validUuids.forEach(validUuid => {
        expect(() => WidgetId.create(validUuid)).not.toThrow();
        const widgetId = WidgetId.create(validUuid);
        expect(widgetId.getValue()).toBe(validUuid);
      });
    });
  });

  describe('getValue', () => {
    it('should return the correct value', () => {
      const uuid = '550e8400-e29b-41d4-a716-446655440000';
      const widgetId = WidgetId.create(uuid);
      expect(widgetId.getValue()).toBe(uuid);
    });

    it('should return generated UUID value', () => {
      const widgetId = WidgetId.generate();
      const value = widgetId.getValue();
      expect(typeof value).toBe('string');
      expect(value.length).toBe(36); // UUID length with dashes
    });
  });

  describe('equals', () => {
    it('should return true for equal widget IDs', () => {
      const uuid = '550e8400-e29b-41d4-a716-446655440000';
      const id1 = WidgetId.create(uuid);
      const id2 = WidgetId.create(uuid);
      
      expect(id1.equals(id2)).toBe(true);
    });

    it('should return false for different widget IDs', () => {
      const id1 = WidgetId.create('550e8400-e29b-41d4-a716-446655440000');
      const id2 = WidgetId.create('6ba7b810-9dad-41d1-80b4-00c04fd430c8');
      
      expect(id1.equals(id2)).toBe(false);
    });

    it('should return false for generated vs created IDs with different values', () => {
      const generatedId = WidgetId.generate();
      const createdId = WidgetId.create('550e8400-e29b-41d4-a716-446655440000');
      
      // Very unlikely to be equal, but test anyway
      expect(generatedId.equals(createdId)).toBe(false);
    });

    it('should be reflexive', () => {
      const widgetId = WidgetId.generate();
      expect(widgetId.equals(widgetId)).toBe(true);
    });

    it('should be symmetric', () => {
      const uuid = '550e8400-e29b-41d4-a716-446655440000';
      const id1 = WidgetId.create(uuid);
      const id2 = WidgetId.create(uuid);
      
      expect(id1.equals(id2)).toBe(id2.equals(id1));
    });
  });

  describe('integration tests', () => {
    it('should work with generated and created IDs together', () => {
      const generatedId = WidgetId.generate();
      const createdId = WidgetId.create(generatedId.getValue());
      
      expect(createdId.equals(generatedId)).toBe(true);
      expect(generatedId.equals(createdId)).toBe(true);
      expect(createdId.getValue()).toBe(generatedId.getValue());
    });

    it('should handle multiple operations on same ID', () => {
      const originalUuid = '550e8400-e29b-41d4-a716-446655440000';
      const widgetId = WidgetId.create(originalUuid);
      
      // Multiple getValue calls should return same value
      expect(widgetId.getValue()).toBe(originalUuid);
      expect(widgetId.getValue()).toBe(originalUuid);
      
      // Multiple equals calls should be consistent
      const otherWidgetId = WidgetId.create(originalUuid);
      expect(widgetId.equals(otherWidgetId)).toBe(true);
      expect(widgetId.equals(otherWidgetId)).toBe(true);
    });
  });
});
