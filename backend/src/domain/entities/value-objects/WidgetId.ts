import { v4 as uuidv4 } from 'uuid';

export class WidgetId {
  private constructor(private readonly value: string) {
    this.ensureValidId(value);
  }

  public static generate(): WidgetId {
    return new WidgetId(uuidv4());
  }

  public static create(value: string): WidgetId {
    return new WidgetId(value);
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: WidgetId): boolean {
    return this.value === other.value;
  }

  private ensureValidId(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error('WidgetId cannot be empty');
    }
    
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(value)) {
      throw new Error('WidgetId must be a valid UUID');
    }
  }
}
