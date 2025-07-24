import { WidgetRepository } from '../../domain/repositories/WidgetRepository';
import { Widget } from '../../models/widget';
import { WidgetId } from '../../domain/entities/value-objects/WidgetId';

export class InMemoryWidgetRepository implements WidgetRepository {
  private widgets: Map<string, Widget> = new Map();

  async save(widget: Widget): Promise<void> {
    this.widgets.set(widget.getId().getValue(), widget);
  }

  async findById(id: WidgetId): Promise<Widget | null> {
    return this.widgets.get(id.getValue()) || null;
  }

  async findAll(): Promise<Widget[]> {
    return Array.from(this.widgets.values())
      .sort((a, b) => b.getTimestamp().getTime() - a.getTimestamp().getTime()); // Latest first
  }

  async delete(id: WidgetId): Promise<void> {
    this.widgets.delete(id.getValue());
  }

  async findByType(type: string): Promise<Widget[]> {
    return Array.from(this.widgets.values())
      .filter(widget => widget.getType().getValue() === type)
      .sort((a, b) => b.getTimestamp().getTime() - a.getTimestamp().getTime());
  }

  // For testing purposes
  clear(): void {
    this.widgets.clear();
  }

  size(): number {
    return this.widgets.size;
  }
}
