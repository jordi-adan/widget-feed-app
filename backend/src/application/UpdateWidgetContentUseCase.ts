import { WidgetRepository } from '../domain/repositories/WidgetRepository';
import { Widget } from '../models/widget';
import { WidgetId } from '../domain/entities/value-objects/WidgetId';
import { WidgetContent } from '../domain/entities/value-objects/WidgetContent';
import { UpdateWidgetContentRequest } from '../types';
import { WidgetErrorCode, WidgetNotFoundError } from '../domain/errors/WidgetErrors';

export interface UpdateWidgetContentResponse {
  success: boolean;
  widget?: Widget;
  error?: string;
  errorCode?: WidgetErrorCode;
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
          error: 'Widget not found',
          errorCode: WidgetErrorCode.WIDGET_NOT_FOUND
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
      if (error instanceof Error && error.message.includes('Invalid UUID format')) {
        return {
          success: false,
          error: error.message,
          errorCode: WidgetErrorCode.INVALID_WIDGET_ID
        };
      }
      
      if (error instanceof Error && error.message.includes('Content cannot be empty')) {
        return {
          success: false,
          error: error.message,
          errorCode: WidgetErrorCode.INVALID_CONTENT
        };
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}
