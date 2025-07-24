export class ContentType {
  private static readonly VALID_TYPES = ['static', 'dynamic'] as const;

  private constructor(private readonly value: string) {
    this.ensureValidType(value);
  }

  public static create(value: string): ContentType {
    return new ContentType(value);
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: ContentType): boolean {
    return this.value === other.value;
  }

  public isStatic(): boolean {
    return this.value === 'static';
  }

  public isDynamic(): boolean {
    return this.value === 'dynamic';
  }

  private ensureValidType(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error('ContentType cannot be empty');
    }

    if (!ContentType.VALID_TYPES.includes(value as any)) {
      throw new Error(
        `Invalid content type: ${value}. Valid types are: ${ContentType.VALID_TYPES.join(', ')}`
      );
    }
  }
}
