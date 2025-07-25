import { WidgetDescriptor } from '../entities/WidgetDescriptor';

export interface IWidgetDescriptorRepository {
    create(widgetDescriptor: WidgetDescriptor): Promise<void>;
    findAll(): Promise<WidgetDescriptor[]>;
    findById(id: string): Promise<WidgetDescriptor | undefined>;
    update(widgetDescriptor: WidgetDescriptor): Promise<void>;
    delete(id: string): Promise<void>;
}
