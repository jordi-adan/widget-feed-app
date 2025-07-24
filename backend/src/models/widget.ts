   import { WidgetId } from '../domain/entities/value-objects/WidgetId';
import { WidgetType } from '../domain/entities/value-objects/WidgetType';
import { WidgetContent } from '../domain/entities/value-objects/WidgetContent';

export class Widget {
  private constructor(
    private readonly id: WidgetId,
    private readonly type: WidgetType,
    private content: WidgetContent,
    private timestamp: Date
  ) {}

  public static create(
    id: WidgetId,
    type: WidgetType,
    content: WidgetContent,
    timestamp?: Date
  ): Widget {
    return new Widget(
      id,
      type,
      content,
      timestamp || new Date()
    );
  }

  public getId(): WidgetId {
    return this.id;
  }

  public getType(): WidgetType {
    return this.type;
  }

  public getContent(): WidgetContent {
    return this.content;
  }

  public getTimestamp(): Date {
    return this.timestamp;
  }

  public updateContent(newContent: WidgetContent): void {
    this.content = newContent;
    this.timestamp = new Date();
  }

  public toPrimitive(): {
    id: string;
    type: string;
    content: string;
    timestamp: string;
  } {
    return {
      id: this.id.getValue(),
      type: this.type.getValue(),
      content: this.content.getValue(),
      timestamp: this.timestamp.toISOString()
    };
  }

  public equals(other: Widget): boolean {
    return this.id.equals(other.id);
  }
}