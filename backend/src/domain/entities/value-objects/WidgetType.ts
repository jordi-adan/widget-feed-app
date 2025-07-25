export class WidgetType {
  private static readonly VALID_TYPES = [
    'expandable_list', 'horizontal_cards', 'image_list', 'text_block', 'highlight_banner', 'quick_actions'
  ] as const;
  
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

  public isExpandableList(): boolean {
    return this.value === 'expandable_list';
  }

  public isHorizontalCards(): boolean {
    return this.value === 'horizontal_cards';
  }

  public isImageList(): boolean {
    return this.value === 'image_list';
  }

  public isTextBlock(): boolean {
    return this.value === 'text_block';
  }

  public isHighlightBanner(): boolean {
    return this.value === 'highlight_banner';
  }

  public isQuickActions(): boolean {
    return this.value === 'quick_actions';
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
