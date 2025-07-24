export class ErrorState {
  private static readonly VALID_STATES = ['hidden', 'message', 'retry'] as const;
  
  private constructor(private readonly value: string) {}

  public static create(value: string): ErrorState {
    if (!value || value.trim() === '') {
      throw new Error('ErrorState cannot be empty');
    }

    const trimmedValue = value.trim();
    if (!this.VALID_STATES.includes(trimmedValue as any)) {
      throw new Error(
        `Invalid error state: ${trimmedValue}. Valid states are: ${this.VALID_STATES.join(', ')}`
      );
    }

    return new ErrorState(trimmedValue);
  }

  public getValue(): string {
    return this.value;
  }

  public isHidden(): boolean {
    return this.value === 'hidden';
  }

  public isMessage(): boolean {
    return this.value === 'message';
  }

  public isRetry(): boolean {
    return this.value === 'retry';
  }

  public equals(other: ErrorState): boolean {
    return this.value === other.value;
  }
}
