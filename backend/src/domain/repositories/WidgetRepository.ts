import { Widget } from '../../models/widget';
import { WidgetId } from '../entities/value-objects/WidgetId';

export interface WidgetRepository {
  save(widget: Widget): Promise<void>;
  findById(id: WidgetId): Promise<Widget | null>;
  findAll(): Promise<Widget[]>;
  delete(id: WidgetId): Promise<void>;
  findByType(type: string): Promise<Widget[]>;
}
