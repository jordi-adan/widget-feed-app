import { WidgetRepository } from '../domain/repositories/WidgetRepository';
import { WidgetId } from '../domain/entities/value-objects/WidgetId';
import { WidgetErrorCode } from '../domain/errors/WidgetErrors';

export interface DeleteWidgetRequest {
  id: string;
}

export interface DeleteWidgetResponse {
  success: boolean;
  error?: string;
  errorCode?: WidgetErrorCode;
}

export class DeleteWidgetUseCase {
  constructor(private readonly widgetRepository: WidgetRepository) {}

  async execute(request: DeleteWidgetRequest): Promise<DeleteWidgetResponse> {
    try {
      // Validate and create widget ID
      const widgetId = WidgetId.create(request.id);
      
      // Check if widget exists
      const widget = await this.widgetRepository.findById(widgetId);
      
      if (!widget) {
        return {
          success: false,
          error: 'Widget not found',
          errorCode: WidgetErrorCode.WIDGET_NOT_FOUND
        };
      }

      // Delete the widget
      await this.widgetRepository.delete(widgetId);

      return {
        success: true
      };
    } catch (error) {
      if (error instanceof Error && error.message.includes('must be a valid UUID')) {
        return {
          success: false,
          error: error.message,
          errorCode: WidgetErrorCode.INVALID_WIDGET_ID
        };
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}
