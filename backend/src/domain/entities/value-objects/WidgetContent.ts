export class WidgetContent {
  private constructor(private readonly value: string) {
    this.ensureValidContent(value);
  }

  public static create(value: string): WidgetContent {
    return new WidgetContent(value);
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: WidgetContent): boolean {
    return this.value === other.value;
  }

  public length(): number {
    return this.value.length;
  }

  public isEmpty(): boolean {
    return this.value.trim().length === 0;
  }

  private ensureValidContent(value: string): void {
    if (value === null || value === undefined) {
      throw new Error('WidgetContent cannot be null or undefined');
    }

    if (value.length > 10000) {
      throw new Error('WidgetContent cannot exceed 10000 characters');
    }
  }
}
