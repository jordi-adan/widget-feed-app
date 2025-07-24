import { WidgetRepository } from '../domain/repositories/WidgetRepository';
import { Widget } from '../models/widget';
import { WidgetId } from '../domain/entities/value-objects/WidgetId';
import { WidgetContent } from '../domain/entities/value-objects/WidgetContent';

export interface UpdateWidgetContentRequest {
  id: string;
  content: string;
}

export interface UpdateWidgetContentResponse {
  success: boolean;
  widget?: Widget;
  error?: string;
}

export class UpdateWidgetContentUseCase {
  constructor(private readonly widgetRepository: WidgetRepository) {}

  async execute(request: UpdateWidgetContentRequest): Promise<UpdateWidgetContentResponse> {
    try {
      // Validate and create widget ID
      const widgetId = WidgetId.create(request.id);
      
      // Find the widget
      const widget = await this.widgetRepository.findById(widgetId);
      
      if (!widget) {
        return {
          success: false,
          error: 'Widget not found'
        };
      }

      // Create new content
      const newContent = WidgetContent.create(request.content);

      // Update widget content
      widget.updateContent(newContent);

      // Save updated widget
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
