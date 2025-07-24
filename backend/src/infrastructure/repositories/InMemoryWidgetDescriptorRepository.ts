import { WidgetDescriptorRepository } from '../../domain/repositories/WidgetDescriptorRepository';
import { WidgetDescriptor } from '../../domain/entities/WidgetDescriptor';
import { WidgetId } from '../../domain/entities/value-objects/WidgetId';

export class InMemoryWidgetDescriptorRepository implements WidgetDescriptorRepository {
  private descriptors: Map<string, WidgetDescriptor> = new Map();

  public async save(widgetDescriptor: WidgetDescriptor): Promise<WidgetDescriptor> {
    const id = widgetDescriptor.getId().getValue();
    this.descriptors.set(id, widgetDescriptor);
    return widgetDescriptor;
  }

  public async findById(id: WidgetId): Promise<WidgetDescriptor | null> {
    const descriptor = this.descriptors.get(id.getValue());
    return descriptor || null;
  }

  public async findAll(): Promise<WidgetDescriptor[]> {
    return Array.from(this.descriptors.values());
  }

  public async delete(id: WidgetId): Promise<void> {
    this.descriptors.delete(id.getValue());
  }

  public async exists(id: WidgetId): Promise<boolean> {
    return this.descriptors.has(id.getValue());
  }
}
