import { WidgetRepository } from '../domain/repositories/WidgetRepository';
import { Widget } from '../models/widget';
import { WidgetId } from '../domain/entities/value-objects/WidgetId';
import { WidgetType } from '../domain/entities/value-objects/WidgetType';
import { WidgetContent } from '../domain/entities/value-objects/WidgetContent';

export interface CreateWidgetRequest {
  type: string;
  content: string;
}

export interface CreateWidgetResponse {
  success: boolean;
  widget?: Widget;
  error?: string;
}

export class CreateWidgetUseCase {
  constructor(private readonly widgetRepository: WidgetRepository) {}

  async execute(request: CreateWidgetRequest): Promise<CreateWidgetResponse> {
    try {
      // Create value objects
      const id = WidgetId.generate();
      const type = WidgetType.create(request.type);
      const content = WidgetContent.create(request.content);

      // Create widget entity
      const widget = Widget.create(id, type, content);

      // Save widget
      await this.widgetRepository.save(widget);

      return {
        success: true,
        widget
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}
