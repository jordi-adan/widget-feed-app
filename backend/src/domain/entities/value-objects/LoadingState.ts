export class LoadingState {
  private static readonly VALID_STATES = ['skeleton', 'hidden'] as const;
  
  private constructor(private readonly value: string) {}

  public static create(value: string): LoadingState {
    if (!value || value.trim() === '') {
      throw new Error('LoadingState cannot be empty');
    }

    const trimmedValue = value.trim();
    if (!this.VALID_STATES.includes(trimmedValue as any)) {
      throw new Error(
        `Invalid loading state: ${trimmedValue}. Valid states are: ${this.VALID_STATES.join(', ')}`
      );
    }

    return new LoadingState(trimmedValue);
  }

  public getValue(): string {
    return this.value;
  }

  public isSkeleton(): boolean {
    return this.value === 'skeleton';
  }

  public isHidden(): boolean {
    return this.value === 'hidden';
  }

  public equals(other: LoadingState): boolean {
    return this.value === other.value;
  }
}
