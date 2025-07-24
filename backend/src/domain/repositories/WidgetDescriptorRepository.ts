import { WidgetDescriptor } from '../entities/WidgetDescriptor';
import { WidgetId } from '../entities/value-objects/WidgetId';

export interface WidgetDescriptorRepository {
  save(widgetDescriptor: WidgetDescriptor): Promise<WidgetDescriptor>;
  findById(id: WidgetId): Promise<WidgetDescriptor | null>;
  findAll(): Promise<WidgetDescriptor[]>;
  delete(id: WidgetId): Promise<void>;
  exists(id: WidgetId): Promise<boolean>;
}
