import { LoadingState } from '../LoadingState';

describe('LoadingState Value Object', () => {
  describe('when creating a valid loading state', () => {
    it('should create skeleton loading state', () => {
      // Act
      const loadingState = LoadingState.create('skeleton');

      // Assert
      expect(loadingState.getValue()).toBe('skeleton');
      expect(loadingState.isSkeleton()).toBe(true);
      expect(loadingState.isHidden()).toBe(false);
    });

    it('should create hidden loading state', () => {
      // Act
      const loadingState = LoadingState.create('hidden');

      // Assert
      expect(loadingState.getValue()).toBe('hidden');
      expect(loadingState.isHidden()).toBe(true);
      expect(loadingState.isSkeleton()).toBe(false);
    });
  });

  describe('when creating an invalid loading state', () => {
    it('should throw error for empty string', () => {
      // Act & Assert
      expect(() => LoadingState.create('')).toThrow('LoadingState cannot be empty');
    });

    it('should throw error for whitespace only', () => {
      // Act & Assert
      expect(() => LoadingState.create('   ')).toThrow('LoadingState cannot be empty');
    });

    it('should throw error for invalid loading state', () => {
      // Act & Assert
      expect(() => LoadingState.create('invalid')).toThrow(
        'Invalid loading state: invalid. Valid states are: skeleton, hidden'
      );
    });

    it('should throw error for null or undefined', () => {
      // Act & Assert
      expect(() => LoadingState.create(null as any)).toThrow('LoadingState cannot be empty');
      expect(() => LoadingState.create(undefined as any)).toThrow('LoadingState cannot be empty');
    });
  });

  describe('when checking equality', () => {
    it('should return true for same loading states', () => {
      // Arrange
      const loadingState1 = LoadingState.create('skeleton');
      const loadingState2 = LoadingState.create('skeleton');

      // Act & Assert
      expect(loadingState1.equals(loadingState2)).toBe(true);
    });

    it('should return false for different loading states', () => {
      // Arrange
      const loadingState1 = LoadingState.create('skeleton');
      const loadingState2 = LoadingState.create('hidden');

      // Act & Assert
      expect(loadingState1.equals(loadingState2)).toBe(false);
    });
  });

  describe('when checking state methods', () => {
    it('should have correct boolean values for each state', () => {
      const stateChecks = [
        { state: 'skeleton', checks: { isSkeleton: true, isHidden: false } },
        { state: 'hidden', checks: { isSkeleton: false, isHidden: true } }
      ];

      stateChecks.forEach(({ state, checks }) => {
        const loadingState = LoadingState.create(state);
        
        expect(loadingState.isSkeleton()).toBe(checks.isSkeleton);
        expect(loadingState.isHidden()).toBe(checks.isHidden);
      });
    });
  });
});
