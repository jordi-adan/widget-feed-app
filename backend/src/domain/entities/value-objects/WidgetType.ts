export class WidgetType {
  private static readonly VALID_TYPES = ['text', 'image', 'video', 'link', 'chart'] as const;
  
  private constructor(private readonly value: string) {
    this.ensureValidType(value);
  }

  public static create(value: string): WidgetType {
    return new WidgetType(value);
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: WidgetType): boolean {
    return this.value === other.value;
  }

  public isText(): boolean {
    return this.value === 'text';
  }

  public isImage(): boolean {
    return this.value === 'image';
  }

  public isVideo(): boolean {
    return this.value === 'video';
  }

  public isLink(): boolean {
    return this.value === 'link';
  }

  public isChart(): boolean {
    return this.value === 'chart';
  }

  private ensureValidType(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error('WidgetType cannot be empty');
    }

    if (!WidgetType.VALID_TYPES.includes(value as any)) {
      throw new Error(`Invalid widget type: ${value}. Valid types are: ${WidgetType.VALID_TYPES.join(', ')}`);
    }
  }
}
