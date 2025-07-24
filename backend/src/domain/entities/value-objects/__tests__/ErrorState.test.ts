import { ErrorState } from '../ErrorState';

describe('ErrorState Value Object', () => {
  describe('when creating a valid error state', () => {
    it('should create hidden error state', () => {
      // Act
      const errorState = ErrorState.create('hidden');

      // Assert
      expect(errorState.getValue()).toBe('hidden');
      expect(errorState.isHidden()).toBe(true);
      expect(errorState.isMessage()).toBe(false);
      expect(errorState.isRetry()).toBe(false);
    });

    it('should create message error state', () => {
      // Act
      const errorState = ErrorState.create('message');

      // Assert
      expect(errorState.getValue()).toBe('message');
      expect(errorState.isMessage()).toBe(true);
      expect(errorState.isHidden()).toBe(false);
      expect(errorState.isRetry()).toBe(false);
    });

    it('should create retry error state', () => {
      // Act
      const errorState = ErrorState.create('retry');

      // Assert
      expect(errorState.getValue()).toBe('retry');
      expect(errorState.isRetry()).toBe(true);
      expect(errorState.isHidden()).toBe(false);
      expect(errorState.isMessage()).toBe(false);
    });
  });

  describe('when creating an invalid error state', () => {
    it('should throw error for empty string', () => {
      // Act & Assert
      expect(() => ErrorState.create('')).toThrow('ErrorState cannot be empty');
    });

    it('should throw error for whitespace only', () => {
      // Act & Assert
      expect(() => ErrorState.create('   ')).toThrow('ErrorState cannot be empty');
    });

    it('should throw error for invalid error state', () => {
      // Act & Assert
      expect(() => ErrorState.create('invalid')).toThrow(
        'Invalid error state: invalid. Valid states are: hidden, message, retry'
      );
    });

    it('should throw error for null or undefined', () => {
      // Act & Assert
      expect(() => ErrorState.create(null as any)).toThrow('ErrorState cannot be empty');
      expect(() => ErrorState.create(undefined as any)).toThrow('ErrorState cannot be empty');
    });
  });

  describe('when checking equality', () => {
    it('should return true for same error states', () => {
      // Arrange
      const errorState1 = ErrorState.create('message');
      const errorState2 = ErrorState.create('message');

      // Act & Assert
      expect(errorState1.equals(errorState2)).toBe(true);
    });

    it('should return false for different error states', () => {
      // Arrange
      const errorState1 = ErrorState.create('message');
      const errorState2 = ErrorState.create('retry');

      // Act & Assert
      expect(errorState1.equals(errorState2)).toBe(false);
    });
  });

  describe('when checking state methods', () => {
    it('should have correct boolean values for each state', () => {
      const stateChecks = [
        { state: 'hidden', checks: { isHidden: true, isMessage: false, isRetry: false } },
        { state: 'message', checks: { isHidden: false, isMessage: true, isRetry: false } },
        { state: 'retry', checks: { isHidden: false, isMessage: false, isRetry: true } }
      ];

      stateChecks.forEach(({ state, checks }) => {
        const errorState = ErrorState.create(state);
        
        expect(errorState.isHidden()).toBe(checks.isHidden);
        expect(errorState.isMessage()).toBe(checks.isMessage);
        expect(errorState.isRetry()).toBe(checks.isRetry);
      });
    });
  });
});
